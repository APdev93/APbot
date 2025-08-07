interface IConfig {
    logger: {
        level: string;
    };
    owner: string[];
    socket: {
        restart_interval: number;
        logger: {
            level: string;
        };
        whatsapp: string;
    };
}

interface IState {
    public: boolean;
    autoread_story: boolean;
}

export const config: IConfig = {
    logger: {
        level: "debug",
    },
    owner: ["6287845032372"],
    socket: {
        restart_interval: 1000 * 60 * 60, // 1 hour
        logger: {
            level: "silent",
        },
        whatsapp: "6287845032372",
    },
};

export let state: IState = {
    public: true,
    autoread_story: true,
};

export const getState = (): IState => state;
export const setState = (newState: Partial<IState>): void => {
    Object.assign(state, newState);
};
