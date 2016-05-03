#!/usr/bin/env ruby

require 'csv'
require 'time'
require 'json'

ROUTER_DATA = {}
API_DATA    = {}

START_TIME = Time.parse("Sat, 30 Apr 2016 16:00:00 GMT").utc
DATA_KEYS = [ "statusRequests", "registerRequests", "okResponse", "rejectedResponse", "accessDenyResponse", "processTime"]

def normalize(x, xmin, xmax, ymin, ymax)
  xrange = xmax - xmin
  yrange = ymax - ymin
  ymin + (x - xmin) * (yrange.to_f / xrange) 
end

MAX_VALUES = {
  "statusRequests" => 0,
  "registerRequests" => 0,
  "okResponse" => 0,
  "rejectedResponse" => 0,
  "accessDenyResponse" => 0,
  "processTime" => 0
}

File.open("midburn-queue_2016-04-30_070000_2016-05-01_070000.log", "r") do |f|
  f.each_line do |line|
    parts = line.split(" ")

    begin
      time = Time.parse(parts[2])

      # skip the records earlier then 6pm
      if time < START_TIME
        next
      end

      time_i = time.to_i
      time_s = time_i.to_s

      if parts[3] == "heroku"
        if parts[4] == "router"
          at = parts[7].split("=")[1]
          if at == "info"

            ROUTER_DATA[time_s] = {
              "statusRequests" => 0,
              "registerRequests" => 0,
              "okResponse" => 0,
              "rejectedResponse" => 0,
              "accessDenyResponse" => 0,
              "processTime" => 0
            } if ROUTER_DATA[time_s].nil?

            path = eval(parts[9].split("=")[1])
            connect = parts[14].split("=")[1].to_i
            service = parts[15].split("=")[1].to_i
            status = parts[16].split("=")[1]
            process_time = connect+service

            # filter unparsable records
            begin
              if time.nil? || path.empty? || status.empty? || process_time.nil?
                next
              end
            rescue Exception => e
              puts "---> UNPARSABLE INPUT: #{line}"
              next      
            end

            case path
            when "/status"
              ROUTER_DATA[time_s]["statusRequests"] += 1
            when "/register"
              ROUTER_DATA[time_s]["registerRequests"] += 1
            else
              # puts "---> FILTERED PATH: #{path}"
            end

            case status
            when "200"
              ROUTER_DATA[time_s]["okResponse"] += 1
            when "400"
              ROUTER_DATA[time_s]["rejectedResponse"] += 1
              puts "---> 400: ip: #{parts[12].split("=")[1]}, #{parts[8]} #{parts[9]}"
            when "403"
              ROUTER_DATA[time_s]["accessDenyResponse"] += 1
            when "404"
              puts "---> 404: ip: #{parts[12].split("=")[1]}, #{parts[8]} #{parts[9]}"
            else
              puts "---> FILTERED STATUS: #{status}"
            end

            ROUTER_DATA[time_s]["processTime"] += process_time

            MAX_VALUES.keys.each do |key|
              if ROUTER_DATA[time_s][key] > MAX_VALUES[key]
                MAX_VALUES[key] = ROUTER_DATA[time_s][key]
              end
            end
          end

          if at == "error"
            next
          end
        end

        if parts[4] == "api"
          message = parts[7..999].join(" ")

          API_DATA[time_s] = [] if API_DATA[time_s].nil?
          API_DATA[time_s] << message
        end

      end

      if parts[3] == "app"
        next
      end

    rescue Exception => e
      puts "line failed: #{e.message} --> line: #{line}"      
    end
  end
end

############################################
# NORMALIZE DATA TO VALUES BETWEEN 0 AND 1 #
############################################
puts "Normalizing data by:"
puts MAX_VALUES
ROUTER_DATA.keys.each do |time|
  DATA_KEYS.each do |key|
    ROUTER_DATA[time][key] = normalize(ROUTER_DATA[time][key], 0, MAX_VALUES[key], 0, 1)
  end
end

#######################
#   WRITE CSV FILES   #
#######################
CSV.open("router-data.csv", "w") do |csv|
  csv << ["time"] + DATA_KEYS
  ROUTER_DATA.keys.each do |time|
    values = ROUTER_DATA[time]
    csv << [time, values["statusRequests"], values["registerRequests"], values["okResponse"], values["rejectedResponse"], values["accessDenyResponse"], values["processTime"]]
  end
end

CSV.open("api-data.csv", "w") do |csv|
  csv << ["time", "message"]
  API_DATA.keys.each do |time|
    API_DATA[time].each do |msg|
      csv << [time, msg]
    end
  end
end

CSV.open("max-data.csv", "w") do |csv|
  csv << DATA_KEYS
  row = []
  DATA_KEYS.each do |key|
    row << MAX_VALUES[key]
  end
  
  csv << row
end

# EoF