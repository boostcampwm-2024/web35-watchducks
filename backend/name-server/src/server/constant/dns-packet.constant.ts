export const DNS_FLAGS = {
    QUERY_RESPONSE: 0x8000, // Query/Response
    AUTHORITATIVE_ANSWER: 0x0400, // 권한 있는 응답 (네임서버가 해당 도메인의 공식 서버일 때)
    TRUNCATED_RESPONSE: 0x0200, // 응답이 잘린 경우 (UDP 크기 제한 초과)
    RECURSION_DESIRED: 0x0100, // 재귀적 쿼리 요청 (클라이언트가 설정)
    RECURSION_AVAILABLE: 0x0080, // 재귀 쿼리 지원 여부
    AUTHENTIC_DATA: 0x0020, // DNSSEC 검증된 데이터
    CHECKING_DISABLED: 0x0010, // DNSSEC 검증 비활성화
} as const;

export const RESPONSE_CODE = {
    NOERROR: 0, // 정상 응답
    NXDOMAIN: 3, // 도메인이 존재하지 않음
    SERVFAIL: 2, // 서버 에러
} as const;

export const RESPONSE_CODE_MASK = 0x000f;

export const RECORD_TYPE = {
    ADDRESS: 'A',
    NAME_SERVER: 'NS',
} as const;

export const RECORD_CLASS = {
    INTERNET: 'IN',
} as const;

export const PACKET_TYPE = {
    RESPONSE: 'response',
} as const;

export type ResponseCodeType = (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE];
