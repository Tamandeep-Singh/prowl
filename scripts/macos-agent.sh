#!/usr/bin/env zsh

echo "[Prowl-MacOS-Agent]: Starting Endpoint Telemetry Collection \n"

INGEST_API_KEY="t9b5niKoPP91XzNjAAlbV7"
PROWL_API_ENDPOINT="http://localhost:4500/api/v1/endpoints/ingest?agent_api_key=$INGEST_API_KEY"
DEVICE_UUID=$(ioreg -rd1 -c IOPlatformExpertDevice | awk -F'"' '/IOPlatformUUID/{print $4}')

function ingest_request_handler() {
    local POST_BODY="$1"
    response=$(curl -s -X POST -H "Content-Type: application/json" -d "$POST_BODY" "$PROWL_API_ENDPOINT")
    if [ $? -ne 0 ]; then
        echo "[Prowl-MacOS-Agent]: Unable to connect to the Prowl API, exiting telemetry script!"
        exit 1
    fi
    api_error=$(echo "$response" | jq -r '.error')
     if [ "$api_error" != "null" ]; then
        echo "[Prowl-MacOS-Agent]: Encountered API Error :: \"$api_error\". Exiting telemetry script!"
        exit 1
    else
        echo "$response"
    fi
}

function get_process_data() {
    process_output=$(ps -axo ppid,pid,user,state,lstart,etime,args)
    #Fields $5 to $9 = lstart, field $10 = etime, field $11 = command (binary being executed), fields onwards are command arguments 

    process_json_array=$(echo "$process_output" | awk 'NR > 1 {
    start = 11; 
    args = "";

    for (i = start; $i != ""; i++) { 
        gsub(/"/, "\\\"", $i);  
       
        args = args (args == "" ? "" : " ") $i;
    }

    {print "{\"ppid\": \""$1"\",\"pid\": \""$2"\",\"user\": \""$3"\",\"state\": \""$4"\",\"start_time\": \""$5,$6,$7,$8,$9"\",\"elapsed_time\": \""$10"\",\"command\": \""args"\"}"  } }' | jq -s '.') 

    process_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"ingest_type\":\"processes\", \"processes\":"$process_json_array"}"
    ingest_request_handler "$process_json_body"
}

function get_filesystem_data() { }

function get_network_data() { }

function get_endpoint_data() { 
    device_name=$(scutil --get ComputerName)
    device_ip=$(networksetup -getinfo "Wi-Fi" | grep "^IP address: " | awk '{print $3}')
    device_os_version="$(sw_vers -ProductName) $(sw_vers -ProductVersion) ($(sw_vers -BuildVersion))"
    endpoint_telemetry="{\"host_uuid\":\""$DEVICE_UUID"\",\"host_name\":\""$device_name"\",\"host_os\":\"MacOS\",\"host_ip\":\""$device_ip"\",\"host_os_version\":\""$device_os_version"\"}"
    echo "$endpoint_telemetry"
}

function main() {
    get_process_data
}

main


