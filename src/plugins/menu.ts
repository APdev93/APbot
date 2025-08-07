import { Plugin } from "../types/plugins";

const plugin: Plugin = {
    name: "menu",
    command: "/menu",
    async run({ session, message, text }) {
        const menuText = `*Menu Commands:*\n
1. /menu - Tampilkan daftar perintah
2. /self <on|off> - Toggle self mode
3. /ping - Cek latensi bot
4. /info - Melihat informasi bot`;

        await session.sendMessage(
            message?.key.remoteJid!,
            { text: menuText },
            { quoted: message }
        );
    },
};

export default plugin;
