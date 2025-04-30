#!/usr/bin/env bash

echo -e "[Prowl-Windows-Agent]: Script started... \n"

PROWL_API_ENDPOINT="http://192.168.1.79:4500/api/endpoints/"
DEVICE_UUID=$(powershell -Command "(Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Cryptography').MachineGuid")
DEVICE_NAME=$(hostname)

function ingest_request_handler() {
    local POST_BODY="$1"
    response=$(curl -s -X POST -H "Content-Type: application/json" -d "$POST_BODY" "$PROWL_API_ENDPOINT/ingest")
    if [ $? -ne 0 ]; then
        echo "[Prowl-Windows-Agent]: Unable to connect to the Prowl API, exiting telemetry script!"
        exit 1
    fi
    api_error=$(echo "$response" | jq 'if .result | type == "object" then .result.error // null else null end')
     if [ "$api_error" != "null" ]; then
        echo "[Prowl-Windows-Agent]: An API Error occurred: $api_error. The script will now exit!"
        exit 1
    else
        echo "$response"
    fi
}

function link_endpoint_request_handler() {
    local POST_BODY="$1"
    response=$(curl -s -X POST -H "Content-Type: application/json" -d "$POST_BODY" "$PROWL_API_ENDPOINT/link")
    if [ $? -ne 0 ]; then
        echo "[Prowl-Windows-Agent]: Unable to connect to the Prowl API, exiting telemetry script!"
        exit 1
    fi
    api_error=$(echo "$response" | jq 'if .result | type == "object" then .result.error // null else null end')
     if [ "$api_error" != "null" ]; then
        echo "[Prowl-Windows-Agent]: An API Error occurred: $api_error. The script will now exit!"
        exit 1
    else
        echo "[Prowl-Windows-Agent]: Endpoint with ID: $DEVICE_UUID is now successfully linked! Please restart the script to start telemetry collection."
    fi
}


function get_process_data() {
    exit 1 # still need to port
    #Fields $5 to $9 = lstart, field $10 = etime, field $11 = command (binary being executed), fields onwards are command arguments 

    process_json_array=$(echo "$process_output" | awk 'NR > 1 {
    start = 11; 
    args = "";

    for (i = start; $i != ""; i++) { 
        gsub(/"/, "\\\"", $i);  
       
        args = args (args == "" ? "" : " ") $i;
    }

    {print "{\"ppid\": "$1",\"pid\": "$2",\"user\": \""$3"\",\"state\": \""$4"\",\"start_time\": \""$5,$6,$7,$8,$9"\",\"elapsed_time\": \""$10"\",\"command\": \""args"\"}"  } }' | jq -s '.') 

    process_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"host_name\":\""$DEVICE_NAME"\",\"agent_pid\":"$$",\"ingest_type\":\"processes\", \"processes\":"$process_json_array"}"
    echo "$process_json_body"
}

function get_filesystem_data() { 
    tmp_dir="$HOME/AppData/Local/Temp"
    desktop_dir="$HOME/Desktop"
    documents_dir="$HOME/Documents"
    downloads_dir="$HOME/Downloads"
    
    files_json_array=""
    files=$(find "$tmp_dir" "$desktop_dir" "$documents_dir" "$downloads_dir" -type f \( -name "*.py" -o -name "*.sh" -o ! -name "*.*" -o -name "*.zip" -o -name "*.js" -o -name "*.rar" -o -name "*.pkg"  -o -name "*.dmg" -o -name "*.tar.gz" \))

    while read file; do 
        sha256_hash=$(sha256sum "$file" | awk '{print $1}')
        creation_timestamp=$(stat --format="%W" "$file")
        last_mod_timestamp=$(stat --format="%Y" "$file")
        file_size=$(stat --format="%s" "$file")
        file_name=$(basename "$file")
        file_description=$(file "$file" | awk -F ":" '{print $2}' | xargs)

        files_json_array+="{\"file_path\":\""$file"\",\"creation_ts\":"$creation_timestamp",\"last_mod_ts\":"$last_mod_timestamp",\"file_size\":"$file_size",\"sha256_hash\":\""$sha256_hash"\",\"file_name\":\""$file_name"\",\"file_description\":\""$file_description"\"}"
    done <<< "$files"

    files_json_array=$(echo "$files_json_array" | jq -s '.')
    files_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"host_name\":\""$DEVICE_NAME"\",\"ingest_type\":\"files\", \"files\":"$files_json_array"}"
    ingest_request_handler "$files_json_body" 
}

function get_network_data() {
    network_json_array=$(python network.py)
    network_json_body="{\"host_uuid\":\""$DEVICE_UUID"\",\"host_name\":\""$DEVICE_NAME"\",\"ingest_type\":\"network\", \"network_connections\":"$network_json_array"}"
    ingest_request_handler "$network_json_body"
}

function link_endpoint() { 
    device_ip=$(ipconfig | grep -m 1 "IPv4 Address" | awk -F: '{print $2}' | xargs)
    device_os_version="$(systeminfo | grep "^OS Name" | awk -F: '{print $2}' | xargs) ($(systeminfo | grep "^OS Version" | awk -F: '{print $2}' | xargs))"
    endpoint_telemetry="{\"endpoint\":{\"host_uuid\":\""$DEVICE_UUID"\",\"host_name\":\""$DEVICE_NAME"\",\"host_os\":\"Windows\",\"host_ip\":\""$device_ip"\",\"host_os_version\":\""$device_os_version"\"}}"
    link_endpoint_request_handler "$endpoint_telemetry"
}


function main() {
    echo -e "[Prowl-Windows-Agent]: Starting Endpoint Telemetry Collection \n"

    TUNING_PROCESS_DATA_DELAY=5
    TUNING_FILESYSTEM_DATA_DELAY=60
    TUNING_NETWORK_DATA_DELAY=40

    LAST_PROCESS_COLLECTION=0
    LAST_FILESYSTEM_COLLECTION=0
    LAST_NETWORK_COLLECTION=0
    

    while true; do 
       current_epoch_time=$(date +%s)

       if (( current_epoch_time - LAST_PROCESS_COLLECTION > TUNING_PROCESS_DATA_DELAY)); then
            get_process_data
            LAST_PROCESS_COLLECTION=$current_epoch_time
       fi

       if (( current_epoch_time - LAST_FILESYSTEM_COLLECTION > TUNING_FILESYSTEM_DATA_DELAY  )); then
            get_filesystem_data
            LAST_FILESYSTEM_COLLECTION=$current_epoch_time
       fi

       if (( current_epoch_time - LAST_NETWORK_COLLECTION > TUNING_NETWORK_DATA_DELAY  )); then
            get_network_data
            LAST_NETWORK_COLLECTION=$current_epoch_time
       fi

       sleep 3
    done
}

case "$1" in
  link-endpoint)
    link_endpoint
    ;;
  *)
    get_process_data
    ;;
esac