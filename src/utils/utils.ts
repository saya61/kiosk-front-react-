// src/utils/utils.ts

export const buildUrl = (baseUrl: string, path: string) => {
    // URL 조합 시 이중 슬래시가 포함되지 않도록 처리
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    return baseUrl + path;
};
