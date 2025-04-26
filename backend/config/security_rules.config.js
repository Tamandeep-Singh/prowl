const rules = {
    processes: [
       { detection: "Base64", filter: "base64", score: 1, message:"Base64.", category: "command"},
       { detection: "Curl", filter: "curl", score: 1, message:"Curl.", category: "command"},
       { detection: "Wget", filter: "wget", score: 1, message:"Wget.", category: "command"},
       { detection: "Netcat", filter: "^(nc|ncat|netcat)", score: 13, message:"Netcat was used!", category: "command"},
       { detection: "Nmap", filter: "nmap", score: 1, message:"Nmap.", category: "command"},
       { detection: "Bash (Reverse Shell)", filter: "bash", score: 1, message:"Bash.", category: "command"}
    ],
    files: [
        { detection: "Tmp file", filter: "/tmp/.*", score: 1, message:"Stored in TMP for potential staging.", category: "file_path"},
        { detection: "Executable", filter: "executable", score: 2, message:"Executable binary.", category: "file_description"},
        { detection: "Suspicious Files", filter: "\.*(sh|zip|dmg|pkg|ps1|rar|exe|vb|bat|jar)", score: 1, message:"Potentially dangerous due to it's file extension.", category: ""}
    ],
    network_connections: [
        { detection: "Testing", filter: "testing", score: 1, message:"testing", category: "command"}
    ],
    whitelist: {
        users: [],
        processes: [],
        files: [],
    },
    blacklist: {
        users: [],
        processes: [],
        files: [],
    }
}

module.exports = rules;