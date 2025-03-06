#!/usr/bin/env zsh

echo "[Prowl-MacOS-Agent]: Starting Endpoint Telemetry Collection \n"

INGEST_API_KEY="t9b5niKoPP91XzNjAAlbV7"
PROWL_API_ENDPOINT="http://localhost:4500/api/endpoints/ingest?agent_api_key=$INGEST_API_KEY"
DEVICE_UUID=$(ioreg -rd1 -c IOPlatformExpertDevice | awk -F'"' '/IOPlatformUUID/{print $4}')

function ingest_request_handler() {
    local POST_BODY="$1"
    response=$(curl -s -X POST -H "Content-Type: application/json" -d "$POST_BODY" "$PROWL_API_ENDPOINT")
    if [ $? -ne 0 ]; then
        echo "[Prowl-MacOS-Agent]: Unable to connect to the Prowl API, exiting telemetry script!"
        exit 1
    fi
    api_error=$(echo "$response" | jq 'if .result | type == "object" then .result.error // null else null end')
     if [ "$api_error" != "null" ]; then
        echo "[Prowl-MacOS-Agent]: Encountered API Error: $api_error. Exiting telemetry script!"
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

    {print "{\"ppid\": "$1",\"pid\": "$2",\"user\": \""$3"\",\"state\": \""$4"\",\"start_time\": \""$5,$6,$7,$8,$9"\",\"elapsed_time\": \""$10"\",\"command\": \""args"\"}"  } }' | jq -s '.') 

    process_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"ingest_type\":\"processes\", \"processes\":"$process_json_array"}"
    ingest_request_handler "$process_json_body"
}

function get_filesystem_data() { 
    tmp_dir="/var/tmp"
    desktop_dir="$HOME/Desktop"
    documents_dir="$HOME/Documents"
    downloads_dir="$HOME/Downloads"

    files_json_array=""
    find "$tmp_dir" "$desktop_dir" "$documents_dir" "$downloads_dir" -type f | while read file; do 
        sha1_hash=$(sha1sum "$file" | awk '{print $1}')
        creation_timestamp=$(stat -f "%B" "$file")
        last_mod_timestamp=$(stat -f "%m" "$file")
        file_size=$(stat -f "%z" "$file")
        file_name=$(basename "$file")
        file_description=$(file "$file" | awk -F ":" '{print $2}' | xargs) 

        files_json_array+="{\"file_path\":\""$file"\",\"creation_ts\":"$creation_timestamp",\"last_mod_ts\":"$last_mod_timestamp",\"file_size\":"$file_size",\"sha1_hash\":\""$sha1_hash"\",\"file_name\":\""$file_name"\",\"file_description\":\""$file_description"\"} "
    done

    files_json_array=$(echo "$files_json_array" | jq -s '.')
    files_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"ingest_type\":\"files\", \"files\":"$files_json_array"}"
    ingest_request_handler "$files_json_body"
}

function get_network_data() {
    source ~/pyenv/bin/activate
    network_json_array=$(sudo python3 macos-network.py)
    network_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"ingest_type\":\"network\", \"network_connections\":"$network_json_array"}"
    ingest_request_handler "$network_json_body"
    deactivate
}

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


