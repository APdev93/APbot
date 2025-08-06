import { Plugin } from "../types/plugins";

const plugin: Plugin = {
    name: "ping",
    command: /^(p\s*)?[.!]?ping$|^\.test$|^!ping$/i,
    async run({ session, message, text }) {
        await session.sendMessage(
            message?.key.remoteJid!,
            { text: "Test succesfully!" },
            { quoted: message }
        );
    },
};

export default plugin;
