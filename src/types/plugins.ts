import { WASocket, proto } from "baileys";

export interface Plugin {
    name: string;
    command: string | RegExp;
    run: (args: {
        session: WASocket;
        message: proto.IWebMessageInfo | undefined;
        text: string;
    }) => Promise<any>;
}
