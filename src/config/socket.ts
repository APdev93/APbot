import makeWASocket, {
    Browsers,
    delay,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState,
} from "baileys";
import type { WASocket } from "baileys";

import { createLogger } from "../utils";
import { config } from "./config";
import { handleConnection } from "../handler/connection";
import { handleMessage } from "../handler/message";

const logger = createLogger("socket");
const socketLogger = createLogger("whatsapp", config.socket.logger.level);
export let session: WASocket;

export default async function startSocket(): Promise<WASocket> {
    logger.info("Starting Socket...");
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock: WASocket = makeWASocket({
        version: version,
        logger: socketLogger,
        browser: Browsers.ubuntu("Chrome"),
        markOnlineOnConnect: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, socketLogger),
        },
        generateHighQualityLinkPreview: true,
    });
    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
        logger.info("User not registered");
        logger.info("Generating Pair Code...");

        await delay(5000);
        const code: string = await sock.requestPairingCode(
            config.socket.whatsapp
        );

        logger.info(`Pairing Code: ${code}`);
    }

    sock.ev.on("connection.update", handleConnection);
    sock.ev.on("messages.upsert", handleMessage);

    session = sock;
    return sock;
}
