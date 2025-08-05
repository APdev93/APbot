import startSocket from "./config/socket";
import { loadPlugins } from "./utils/load-plugins";

const main = async () => {
    await startSocket();
    await loadPlugins();
};

main();
