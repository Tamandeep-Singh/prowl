const rules = {
    processes: [
       { detection: "Base64", filter: "(?:\/?\w+\/)*base64.*", score: 1, message:"Base64.", field: "command"},
       { detection: "Curl", filter: "(?:\/?\w+\/)*curl.*", score: 2, message:"Curl.", field: "command"},
       { detection: "Wget", filter: "(?:\/?\w+\/)*wget.*", score: 2, message:"Wget.", field: "command"},
       { detection: "Netcat", filter: "(?:\/?\w+\/)*(nc|ncat|nmap).*", score: 2, message:"Netcat was used, perhaps for a bind or reverse shell and network mapping,", field: "command"},
       { detection: "Nmap", filter: "(?:\/?\w+\/)*nmap.*", score: 4, message:"Nmap was used, potentially for network discovery, port scanning and reconnaissance", field: "command"},
       { detection: "Bash (Reverse Shell)", filter: "bash\s+-i\s+>&\s+\/dev\/tcp\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+.*", score: 8, message:"Bash (Reverse Shell) which might be used for remote code execution or firewall evasion", field: "command"}
    ],
    files: [
        { detection: "Tmp file", filter: "/tmp/.*", score: 1, message:"Stored in TMP for potential staging.", field: "file_path"},
        { detection: "Executable", filter: "executable", score: 2, message:"Executable binary.", field: "file_description"},
        { detection: "Suspicious Files", filter: "\.*(sh|zip|dmg|pkg|ps1|rar|exe|vb|bat|jar)", score: 1, message:"Potentially dangerous due to it's file extension.", field: ""}
    ],
    network_connections: [
        { detection: "Testing", filter: "testing", score: 1, message:"testing", category: "command"}
    ],
    whitelist: {
        processes: [],
        files: [],
        network_connections: []
    },
    blacklist: {
        users: [],
        processes: [],
        files: [],
        network_connections: []
    },
    notification_emails: ["prowl.test.fake@gmail.com"]
}

module.exports = rules;