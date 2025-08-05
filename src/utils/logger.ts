import pino from "pino";
import { config } from "../config";

export const getTime = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    return now.toLocaleTimeString("id-ID", options);
};

export const createLogger = (
    host: string,
    level: string = "info",
    options: object = {}
): any => {
    let transport = pino.transport({
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "pid,hostname,time",
            messageFormat: `[${getTime()}] (${host.toUpperCase()}) : {msg}`,
            ...options,
        },
    });
    return pino(
        {
            level: level || config.logger.level,
            base: { pid: undefined, hostname: undefined },
        },
        transport
    );
};
