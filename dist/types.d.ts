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
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}
export interface OneAccountUserData {
    sub: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    profilePicture?: string;
}
export interface OneAccountOnSuccessResult {
    tokenData: OneAccountTokenData;
    userData: OneAccountUserData;
}
export interface OneAccountMessage {
    type: string;
    data: {
        code: string;
    };
}
