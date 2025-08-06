import { Boom } from "@hapi/boom";
import { ConnectionState, DisconnectReason } from "baileys";
import startSocket, { session } from "../config/socket";
import { createLogger } from "../utils";
import { config } from "../config";

const logger = createLogger("connection");

export const handleConnection = async (
    conn: Partial<ConnectionState>
): Promise<void> => {
    const { connection, lastDisconnect } = conn;

    if (connection === "connecting") {
        logger.info("Connecting to WhatsApp...");
    }

    if (connection === "open") {
        logger.info("Connected to WhatsApp!");
        session.sendMessage(`${config.socket.whatsapp}@s.whatsapp.net`, {
            text: "Bot Connected!",
        });
    }

    if (connection === "close") {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

        logger.warn(`Connection closed (code: ${statusCode})`);

        switch (statusCode) {
            case DisconnectReason.badSession:
                logger.error(
                    "Bad session, please delete the auth folder and re-login."
                );
                break;
            case DisconnectReason.connectionClosed:
                logger.warn("Connection closed.");
                await startSocket();
                break;
            case DisconnectReason.connectionLost:
                logger.warn("Connection lost.");
                await startSocket();
                break;
            case DisconnectReason.restartRequired:
                logger.info("Restart required.");
                await startSocket();
                break;
            case DisconnectReason.timedOut:
                logger.warn("Connection timed out. Reconnecting...");
                await startSocket();
                break;
            case DisconnectReason.loggedOut:
                logger.error(
                    "Logged out. Please delete the auth folder to re-login."
                );
                break;
            case DisconnectReason.multideviceMismatch:
                logger.error("Multi-device mismatch.");
                break;
            case DisconnectReason.connectionReplaced:
                logger.error("Connection replaced by another session.");
                break;
            case DisconnectReason.forbidden:
                logger.error("Access forbidden.");
                break;
            case DisconnectReason.unavailableService:
                logger.error("Service unavailable.");
                break;
            default:
                logger.error("Connection closed for unknown reason.");
                await startSocket();
        }
    }
};
