const rules = {
    processes: [
       { detection: "Base64", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?base64(?:\\.exe)?(?:\\s+.*)?$", score: 4, message:"Base64 was used, potentially to encode and obsfucate malicious commands.", field: "command"},
       { detection: "Curl", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?curl(?:\\.exe)?(?:\\s+.*)?$", score: 3, message:"Curl was used, potentially to download malicious files.", field: "command"},
       { detection: "Wget", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?wget(?:\\.exe)?(?:\\s+.*)?$", score: 3, message:"Wget was used, potentially to download malicious files.", field: "command"},
       { detection: "Netcat", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?(nc|ncat|netcat)(?:\\.exe)?(?:\\s+.*)?$", score: 4, message:"Netcat was used, potentially for a bind / reverse shell and network mapping.", field: "command"},
       { detection: "Nmap", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?nmap(?:\\.exe)?(?:\\s+.*)?$", score: 4, message:"Nmap was used, potentially for network discovery, port scanning and reconnaissance.", field: "command"},
       { detection: "Bash (Reverse Shell)", filter: "bash\s+-i\s+>&\s+\/dev\/tcp\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+.*", score: 8, message:"A Bash (Reverse Shell) was detected, which might be used for remote code execution and firewall evasion.", field: "command"},
       { detection: "Powershell", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?powershell(?:\\.exe)?(?:\\s+.*)?$", score: 4, message:"Powershell was used, potentially to execute dangerous scripts or escalate privileges.", field: "command"},
       { detection: "Registry", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?reg(?:\\.exe)?(?:\\s+.*)?$", score: 5, message:"Registry was used, potentially to establish persistence.", field: "command"},
       { detection: "Whoami", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?whoami(?:\\.exe)?(?:\\s+.*)?$", score: 3, message:"Whoami was used, potentially to map out the network and move laterally.", field: "command"},
       { detection: "Command Prompt", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?cmd(?:\\.exe)?(?:\\s+.*)?$", score: 3, message:"CMD was used, potentially to execute scripts or access common shell commands.", field: "command"},
       { detection: "SSH", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?ssh(?:\\.exe)?(?:\\s+.*)?$", score: 8, message:"SSH was used, potentially to move laterally across the network or connect to a remote machine.", field: "command"},
       { detection: "Cron", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?crontab(?:\\.exe)?(?:\\s+.*)?$", score: 5, message:"Cron was used, potentially to establish persistence via scheduled jobs or services.", field: "command"}
    ],
    files: [
        { detection: "Executable", filter: "executable", score: 3, message:"Executable binary, potentially malicious.", field: "file_description"},
        { detection: "Compressed Archive", filter: "\.(zip|rar|tar|gz|7z)$", score: 2, message:"Compressed file, potentially used for data staging.", field: "file_name"},
        { detection: "Compressed Archive (File Description)", filter: "(Zip|RAR|7-zip|tar|archive|compression)", score: 2, message:"Compressed archive, could indicate data staging or a malicious payload.", field: "file_description"}, 
        { detection: "No File Extension", filter: "^[^\.]+$", score: 3, message:"No file extension which could indicate it contains a malicious payload.", field: "file_name"}
    ],
    network_connections: [
        { detection: "Command Network Filter", filter: "(netcat|bash|python|wget|curl|ssh|telnet|powershell|ftp)(?:\.exe)?$", score: 3, message:"Unusual command detected to spawn a network process.", field: "command"}
    ],
    whitelist: {
        processes: [],
        files: [],
        network_connections: []
    },
    blacklist: {
        users: ["tam-macbook:user2"],
        processes: [{ detection: "Netcat (Blacklist)", filter: "^(?:[A-Za-z]:\\\\|/)?(?:[\\w.-]+[\\\\/])*?(nc|ncat|netcat)(?:\\.exe)?(?:\\s+.*)?$", message:"Blacklisted Process (netcat) detected!", field: "command" }],
        files: [{ detection: "Demo.txt (Blacklist)", filter: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03", message: "Blacklisted File (Demo.txt) detected via matching SHA-256 Hash!", field: "sha256_hash"}],
        network_connections: []
    },
    notification_emails: ["prowl.example@gmail.com"]
}

module.exports = rules;