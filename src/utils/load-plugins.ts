import { Plugin } from "../types/plugins";
import fs from "fs";
import path from "path";
import { createLogger } from "./logger";
import { config } from "../config";

export const plugins: Plugin[] = [];
const logger = createLogger("PLUGINS", config.logger.level);

export const loadPlugins = async () => {
    logger.info("Loading Plugins...");

    const pluginDir = path.join(__dirname, "..", "plugins");
    logger.debug("Loading from: " + pluginDir);

    const files = fs.readdirSync(pluginDir).filter((f) => f.endsWith(".ts"));

    logger.debug("beberapa plugin ditemukan: " + files.join(", "));

    logger.info(`Berhasil memuat ${files}`);
    for (const file of files) {
        const filePath = path.join(pluginDir, file);
        const pluginModule = await import(filePath);
        const plugin: Plugin = pluginModule.default;
        if (typeof plugin.run === "function" && plugin.command) {
            plugins.push(plugin);
        }
    }
};
