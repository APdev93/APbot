import { getState, setState } from "../config";
import { Plugin } from "../types/plugins";

const plugin: Plugin = {
    name: "self",
    command: "/self",
    async run({ session, message, text }) {
        const state = getState();

        let type = text.split(" ")[1]?.toLowerCase();

        if (state.public ? "on" : "off" === type) {
            await session.sendMessage(
                message?.key.remoteJid!,
                { text: `Bot sudah dalam mode ${state.public ? "on" : "off"}` },
                { quoted: message }
            );
            return;
        } else if (type === "on") {
            setState({ public: true });
            await session.sendMessage(
                message?.key.remoteJid!,
                { text: "Bot sekarang berfungsi untuk owner saja" },
                { quoted: message }
            );
        } else if (type === "off") {
            setState({ public: false });
            await session.sendMessage(
                message?.key.remoteJid!,
                { text: "Bot sekarang berfungsi untuk semua orang" },
                { quoted: message }
            );
        } else {
            await session.sendMessage(
                message?.key.remoteJid!,
                { text: "Penggunaan: .self <on|off>" },
                { quoted: message }
            );
        }
    },
};

export default plugin;
