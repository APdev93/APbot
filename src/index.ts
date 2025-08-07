import { config } from "./config";
import startSocket, { restartSocket } from "./config/socket";
import { loadPlugins } from "./utils/load-plugins";

const main = async () => {
    await startSocket();
    await loadPlugins();

    setInterval(async () => {
        await restartSocket();
        await loadPlugins();
    }, config.socket.restart_interval);
};

main();
