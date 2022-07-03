export interface OneAccountServicesConfig {
    clientId: string;
    apiURL: string;
}
export interface OneAccountSignInConfig {
    flow: 'redirect' | 'popup';
    autoSignIn: boolean;
    grantType: string;
    responseType: string;
    redirectURI: string;
    scope: string[];
    state: string;
    includeGrantedScopes: boolean;
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    saveCodeVerifier: boolean;
}
export interface OneAccountTokenData {
    access_token: string;
    token_type: string;
}
export interface OneAccountUserData {
    sub: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    profile_picture?: string;
}
export interface OneAccountOnSuccessResult {
    tokenData: {};
    userData: OneAccountUserData;
}
export interface OneAccountMessage {
    type: string;
    data: {
        code: string;
    };
}
