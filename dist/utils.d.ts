export declare const generateCodeVerifier: (length?: number) => string;
export declare const generateCodeChallenge: (codeVerifier: string) => Promise<string>;
export declare const objectToQuery: (object: {
    [key: string]: string | number | boolean;
}) => string;
