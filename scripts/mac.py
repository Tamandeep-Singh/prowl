import subprocess

process = subprocess.Popen(['ps', '-axo','ppid,pid,user,args,lstart'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Capture the output and error
stdout, stderr = process.communicate()

# Print the output and error (if any)
print("Output:\n", stdout.decode())
