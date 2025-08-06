import { createLogger } from "../utils";
import type { WAMessage, MessageUpsertType } from "@whiskeysockets/baileys";
import { extractMessage } from "../utils/message";
import { session } from "../config/socket";
import { plugins } from "../utils/load-plugins";
import { config } from "../config";
import util from "util";

const logger = createLogger("message");

export const handleMessage = async ({
    messages,
    type,
}: {
    messages: WAMessage[];
    type: MessageUpsertType;
}): Promise<void> => {
    const sock = session;
    const m = extractMessage(session, messages);
    if (!m) return;

    if (
        m.message.key &&
        config.socket.auto_read_status &&
        m.message.key.remoteJid === "status@broadcast" &&
        m.type !== "reactionMessage"
    ) {
        const emoji = [
            "❤️",
            "🧡",
            "💛",
            "💚",
            "💙",
            "💜",
            "🖤",
            "🤍",
            "🤎",
            "💖",
            "💗",
        ];

        let randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
        if (m.message.key.participant) {
            await sock.readMessages([m.message.key]);
            await sock.sendMessage("6287845032372@s.whatsapp.net", {
                text: `Reacted status ${m.message.pushName} with ${randomEmoji}`,
            });

            await sock.sendMessage(
                "status@broadcast",
                { react: { text: randomEmoji, key: m.message.key } },
                {
                    statusJidList: [m.message.key.participant ?? ""],
                }
            );
        }
    }

    const message = m?.message;
    const text = m?.content ?? "";
    const sender = m.sender.split("@")[0].split(":")[0] + "@s.whatsapp.net";
    let log = `${m.type} - ${sender}: ${text}`;

    logger.info(log);

    if (m?.content?.startsWith(">")) {
        let senderNumber = sender.replace("@s.whatsapp.net", "");
        if (!config.owner.includes(senderNumber)) return;

        try {
            let evaled = await eval(m?.content.slice(1).trim());
            if (typeof evaled !== "string") {
                evaled = util.inspect(evaled);
            }
            await m.reply(evaled);
        } catch (err: any) {
            await m.reply(String(err));
        }
    }

    for (const plugin of plugins) {
        const match =
            typeof plugin.command === "string"
                ? text === plugin.command
                : plugin.command.test(text);
        if (match) {
            logger.info(`Running plugin: ${plugin.name} for command: ${text}`);

            await plugin.run({ session, message, text });
        }
    }
};
