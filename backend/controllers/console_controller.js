const { NodeSSH } = require("node-ssh");

class ConsoleController {
    static connections = {};

    static connectToEndpoint = async (request) => {
        const { host_id, host_ip, username, password } = request.body;
        if (this.connections[host_id]) {
            return { success: true, message: "endpoint is already connected via ssh"};
        };
        const connection = new NodeSSH();
        try {
            await connection.connect({
                host: host_ip,
                username,
                password
            });
            this.connections[host_id] = connection;
            return { success: true, message: "successfully connected to endpoint via ssh"};
        }
        catch(error) {
            return { success: true, error: "could not connect to endpoint via ssh"};
        };
    };

    static disconnectEndpoint = async (request) => {
        const { host_id } = request.body;
        if (this.connections[host_id]) {
            const connection = this.connections[host_id];
            connection.dispose();
            delete this.connections[host_id];
        };
        return { success: true, message: "successfully disconnected endpoint"};
    };
    
    static executeCommand = async (request) => {
        const { host_id, command } = request.body;
        const connection = this.connections[host_id];
        if (!connection) {
            return { success: false, error: "no previous ssh connection for endpoint found"};
        };
        try {
            const output = await connection.execCommand(command);
            if (output.stderr !== "") {
                return { success: true, execution_result: output.stderr + "\n"};
            }
            return { success: true, execution_result: output.stdout + "\n"};
        }
        catch (error) {
            return { success: false, execution_result: "an error occured while executing the ssh command"};
        };
    };
};

module.exports = ConsoleController; 