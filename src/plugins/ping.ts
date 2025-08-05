import { Plugin } from "../types/plugins";

const plugin: Plugin = {
    name: "ping",
    command: ".ping",
    async run({ session, message, text }) {
        await session.sendMessage(
            message?.key.remoteJid!,
            { text: "pong!" },
            { quoted: message }
        );
    },
};

export default plugin;
