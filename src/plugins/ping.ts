import { Plugin } from "../types/plugins";

const plugin: Plugin = {
    name: "ping",
    command: /^(p\s*)?[.!]?ping$|^\.test$|^!ping$/i,
    async run({ session, message, text }) {
        const start = Date.now();
        let sent = await session.sendMessage(
            message?.key.remoteJid!,
            { text: "Testing..." },
            { quoted: message }
        );

        const latency = (Date.now() - start) / 1000;
        const formatted = latency.toFixed(3);
        await session.sendMessage(
            message?.key.remoteJid!,
            { text: `Latency: ${formatted} ms`, edit: sent?.key },
            { quoted: message }
        );
    },
};

export default plugin;
