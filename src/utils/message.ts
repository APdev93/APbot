import {
    proto,
    WASocket,
    WAMessage,
    WAMessageContent,
} from "@whiskeysockets/baileys";

interface SerializedMessage {
    id: string;
    chat: string;
    type: string;
    sender: string;
    from: string;
    fromMe: boolean | null | undefined;
    isGroup: boolean | null | undefined;
    content: string | null | undefined;
    args: string[] | null | undefined;
    quoted: WAMessageContent | null;
    message: WAMessage;
    reply: (text: string) => Promise<void>;
}

export const extractMessage = (
    sock: WASocket,
    messages: proto.IWebMessageInfo[]
): SerializedMessage | null => {
    const m = messages?.[0];

    if (!m) return null;

    const isGroup = m.key?.remoteJid?.endsWith("@g.us");
    const type = m.message
        ? Object.keys(m.message)[0]
        : `unknown message type ${JSON.stringify(m, null, 4)}`;

    let content: string | null | undefined;
    switch (type) {
        case "conversation":
            content = m.message?.conversation;
            break;
        case "imageMessage":
            content = m.message?.imageMessage?.caption;
            break;
        case "videoMessage":
            content = m.message?.videoMessage?.caption;
            break;
        case "extendedTextMessage":
            content = m.message?.extendedTextMessage?.text;
            break;
        case "buttonsResponseMessage":
            content = m.message?.buttonsResponseMessage?.selectedButtonId;
            break;
        case "listResponseMessage":
            content =
                m.message?.listResponseMessage?.singleSelectReply
                    ?.selectedRowId;
            break;
        default:
            content = "";
    }

    const quoted =
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

    return {
        id: m.key.id!,
        chat: m.key.remoteJid!,
        type,
        sender: m.key.fromMe
            ? sock.user?.id || "me"
            : isGroup
            ? m.key.participant || ""
            : m.key.remoteJid!,
        from: m.key.remoteJid!,
        fromMe: m.key.fromMe,
        isGroup,
        content,
        args: content?.trim()?.split(" "),
        message: m,
        quoted,
        reply: async (text: string) => {
            await sock.sendMessage(m.key.remoteJid!, { text }, { quoted: m });
        },
    };
};
