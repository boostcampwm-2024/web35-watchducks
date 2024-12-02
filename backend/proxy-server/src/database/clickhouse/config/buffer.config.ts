export interface BufferConfig {
    maxSize: number;
    flushIntervalSecond: number;
}

export const logBufferConfig: BufferConfig = {
    maxSize: 1000,
    flushIntervalSecond: 5,
};
