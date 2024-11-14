import type { Packet } from 'dns-packet';

export const NORMAL_PACKET: Packet = {
    id: 1,
    type: 'query',
    flags: 0,
    questions: [
        {
            name: 'example.com',
            type: 'A',
            class: 'IN',
        },
    ],
};
export const NOT_EXIST_DOMAIN_PACKET: Packet = {
    id: 1,
    type: 'query',
    flags: 0,
    questions: [
        {
            name: 'not_exist_example.com',
            type: 'A',
            class: 'IN',
        },
    ],
};
export const EMPTY_PACKET: Packet = {};
export const NONE_QUESTION_PACKET: Packet = {
    id: 1,
    type: 'query',
    flags: 0,
    questions: [],
};
