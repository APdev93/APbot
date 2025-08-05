type IConfig = {
    logger: {
        level: string;
    };
    owner: string[];
    socket: {
        logger: {
            level: string;
        };
        whatsapp: string;
        auto_read_status: boolean;
    };
};

export const config: IConfig = {
    logger: {
        level: "debug",
    },
    owner: ["6287845032372"],
    socket: {
        logger: {
            level: "silent",
        },
        whatsapp: "6287845032372",
        auto_read_status: true,
    },
};
