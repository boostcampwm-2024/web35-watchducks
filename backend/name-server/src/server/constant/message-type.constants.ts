export const MESSAGE_TYPE = {
    DNS: 'DNS',
    HEALTH_CHECK: 'HEALTH_CHECK',
} as const;

export const MIN_DNS_MESSAGE_LENGTH = 12;

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
