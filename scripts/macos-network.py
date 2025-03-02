import psutil
import socket
import json
from collections import namedtuple

network_json_array = []

def is_ipv6(ip):
    try:
        socket.inet_pton(socket.AF_INET6, ip)
        return True
    except socket.error:
        return False

def get_network_connections():
    network_connections = psutil.net_connections(kind='inet') 
    for connection in network_connections:
        if connection.pid is None:
            continue
        try:
            command = (psutil.Process(connection.pid)).name()
            pid = connection.pid
            laddr = connection.laddr
            raddr = connection.raddr
            status = connection.status
            if status == "ESTABLISHED" or status == "LISTEN":
                if not is_ipv6(laddr.ip) and laddr.ip != "0.0.0.0":
                    if raddr == ():
                        RemoteAddress = namedtuple("RemoteAddress", "ip  port")
                        raddr = RemoteAddress("127.0.0.1", laddr.port)
                    network_body = {"command":command, "pid":pid, "local_address_ip":laddr.ip, "local_address_port":laddr.port, "remote_address_ip":raddr.ip, "remote_address_port":raddr.port, "connection_status":status}
                    network_json_array.append(network_body)

        except psutil.NoSuchProcess:
            continue
        except psutil.AccessDenied:
            continue

get_network_connections()

print(json.dumps(network_json_array))

