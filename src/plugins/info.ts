import { Plugin } from "../types/plugins";
import os from "os";

const plugin: Plugin = {
    name: "info",
    command: "/info",
    async run({ session, message, text }) {
        let sent = await session.sendMessage(
            message?.key.remoteJid!,
            { text: "Checking..." },
            { quoted: message }
        );
        let startLatency = Date.now();
        let memoryUsage = Object.fromEntries(
            Object.entries(process.memoryUsage()).map(([key, value]) => [
                key,
                `${(value / 1024 / 1024).toFixed(3)} MB`,
            ])
        );
        let uptime = process.uptime();
        let uptimeInfo = {
            hour: uptime / 3600,
            minute: (uptime % 3600) / 60,
            second: uptime % 60,
        };

        let textInfo = `*System Information:*\n\n`;
        textInfo += `Platform: ${os.platform()}\n`;
        textInfo += `Architecture: ${os.arch()}\n`;
        textInfo += `Home Directory: ${os.homedir()}\n`;
        textInfo += `CPU: ${JSON.stringify(os.cpus(), null, 2)}\n`;
        textInfo += `Memory: ${os.totalmem()}\n`;
        textInfo += `Free Memory: ${os.freemem()}\n`;
        textInfo += `Node Version: ${process.version}\n`;
        textInfo += `Uptime: ${os.uptime()}\n`;
        textInfo += `Hostname: ${os.hostname()}\n`;
        textInfo += `OS Version: ${os.version()}\n`;
        textInfo += `Release: ${os.release()}\n`;
        textInfo += `Network Interfaces: ${JSON.stringify(
            os.networkInterfaces(),
            null,
            2
        )}\n`;
        textInfo += `Process:\n\n`;
        textInfo += `Process ID: ${process.pid}\n`;
        textInfo += `Process Title: ${process.title}\n`;
        textInfo += `processUptime: ${uptimeInfo.hour.toFixed(
            0
        )}h ${uptimeInfo.minute.toFixed(0)}m ${uptimeInfo.second.toFixed(0)}\n`;
        textInfo += `Latency: ${(Date.now() - startLatency) / 1000}s\n`;
        textInfo += `Memory Usage:\n\n`;
        textInfo += `RSS: ${memoryUsage.rss}\n`;
        textInfo += `Heap Total: ${memoryUsage.heapTotal}\n`;
        textInfo += `Heap Used: ${memoryUsage.heapUsed}\n`;
        textInfo += `External: ${memoryUsage.external}\n`;
        textInfo += `arrayBuffers: ${memoryUsage.arrayBuffers}\n`;

        await session.sendMessage(
            message?.key.remoteJid!,
            { text: textInfo, edit: sent?.key },
            { quoted: message }
        );
    },
};

export default plugin;
