export const ErrorMessage = {
    DATABASE: {
        QUERY_FAILED: '데이터베이스 쿼리 중 문제가 발생했습니다.'
    },
    DOMAIN: {
        NOT_FOUND: (domain: string) => `도메인 ${domain}에 대한 IP를 찾을 수 없습니다.`
    },
    VALIDATION: {
        MISSING_HOST_HEADER: '요청에 Host 헤더가 없습니다.'
    }
} as const;