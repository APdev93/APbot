import { Plugin } from "../types/plugins";
import os from "os";

const plugin: Plugin = {
    name: "info",
    command: "/info",
    async run({ session, message, text }) {
        const sent = await session.sendMessage(
            message?.key.remoteJid!,
            { text: "Checking..." },
            { quoted: message }
        );

        const startLatency = Date.now();

        const memoryUsageRaw = process.memoryUsage();
        const memoryUsage = Object.fromEntries(
            Object.entries(memoryUsageRaw).map(([key, value]) => [
                key,
                `${(value / 1024 / 1024).toFixed(2)} MB`,
            ])
        );

        const uptimeSec = process.uptime();
        const uptimeInfo = {
            hour: Math.floor(uptimeSec / 3600),
            minute: Math.floor((uptimeSec % 3600) / 60),
            second: Math.floor(uptimeSec % 60),
        };

        const cpus = os.cpus();
        const cpuModel = cpus[0].model;
        const cpuCount = cpus.length;

        const interfaces = os.networkInterfaces();
        const netInfo: string[] = [];
        for (const [name, infos] of Object.entries(interfaces)) {
            for (const info of infos ?? []) {
                if (!info.internal && info.family === "IPv4") {
                    netInfo.push(`${name}: ${info.address} (MAC: ${info.mac})`);
                }
            }
        }

        const latency = ((Date.now() - startLatency) / 1000).toFixed(3);

        let textInfo = `📊 *System Information:*\n\n`;
        textInfo += `• *Platform:* ${os.platform()}\n`;
        textInfo += `• *Architecture:* ${os.arch()}\n`;
        textInfo += `• *Home Dir:* ${os.homedir()}\n`;
        textInfo += `• *CPU:* ${cpuModel} (${cpuCount} cores)\n`;
        textInfo += `• *RAM:* ${(os.totalmem() / 1024 ** 3).toFixed(2)} GB\n`;
        textInfo += `• *Free RAM:* ${(os.freemem() / 1024 ** 3).toFixed(
            2
        )} GB\n`;
        textInfo += `• *Node.js:* ${process.version}\n`;
        textInfo += `• *Uptime:* ${(os.uptime() / 3600).toFixed(1)} jam\n`;
        textInfo += `• *Hostname:* ${os.hostname()}\n`;
        textInfo += `• *OS Version:* ${os.version?.() ?? "-"}\n`;
        textInfo += `• *Release:* ${os.release()}\n\n`;

        textInfo += `🌐 *Network Interfaces:*\n`;
        textInfo += netInfo.length
            ? netInfo.map((i) => `• ${i}`).join("\n") + "\n\n"
            : "• Tidak ditemukan interface publik\n\n";

        textInfo += `⚙️ *Process Info:*\n`;
        textInfo += `• PID: ${process.pid}\n`;
        textInfo += `• Title: ${process.title}\n`;
        textInfo += `• Uptime: ${uptimeInfo.hour}h ${uptimeInfo.minute}m ${uptimeInfo.second}s\n`;
        textInfo += `• Latency: ${latency}s\n\n`;

        textInfo += `🧠 *Memory Usage:*\n`;
        textInfo += `• RSS: ${memoryUsage.rss}\n`;
        textInfo += `• Heap Total: ${memoryUsage.heapTotal}\n`;
        textInfo += `• Heap Used: ${memoryUsage.heapUsed}\n`;
        textInfo += `• External: ${memoryUsage.external}\n`;
        textInfo += `• ArrayBuffers: ${memoryUsage.arrayBuffers}\n`;

        await session.sendMessage(
            message?.key.remoteJid!,
            { text: textInfo, edit: sent?.key },
            { quoted: message }
        );
    },
};

export default plugin;
