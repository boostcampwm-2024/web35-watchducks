interface ListenConfig {
    port: number;
    host: string | undefined;
}

export const listenConfig: ListenConfig = {
    port: Number(process.env.PORT),
    host: process.env.LISTENING_HOST,
};
