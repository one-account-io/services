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
  idToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface OneAccountUserData {
  sub: string;
  email?: string;
  emailVerified?: boolean;
  givenName?: string;
  familyName?: string;
  name?: string;
  picture?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  locale?: string;
  nickname?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  address?: {
    formatted?: string | null;
    postalCode?: string | null;
    streetAddress?: string | null;
    region?: string | null;
    country?: string | null;
    locality?: string | null;
  };
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
