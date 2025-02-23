#!/usr/bin/env zsh

# ECS635U Final Year Project - Prowl: Cybersecurity Hub
# Script: db-setup-macos.sh (Shell Script)
# Purpose: Database Setup (MongoDB) for the MacOS Operating System

PROWL_DB="prowl-prototype"

echo "Starting Database Setup (MongoDB) for MacOS!"

mongosh > /dev/null << MONGOEOF 
use $PROWL_DB
db.createCollection("users")
db.users.insertOne({ name: "Testing", email: "test@example.com" })
exit
MONGOEOF



