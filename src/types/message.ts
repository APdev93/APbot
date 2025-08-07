import {WAMessage, WAMessageContent } from "baileys";

export interface SerializedMessage {
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