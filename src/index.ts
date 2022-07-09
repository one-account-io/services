import { OneAccountMessage, OneAccountOnSuccessResult, OneAccountServicesConfig } from './types';
import { generateCodeChallenge, generateCodeVerifier, objectToQuery } from './utils';

const oneAccountServicesDefaultConfig: OneAccountServicesConfig = {
  clientId: '',
  apiURL: 'https://api.one-account.io/v1',
};

type OneAccountOnSuccessCallbackType = (result: OneAccountOnSuccessResult) => void;

class OneAccountServices {
  private config: OneAccountServicesConfig;
  private codeVerifier: string = '';
  private authorizationHeader: string = '';

  constructor() {
    this.config = oneAccountServicesDefaultConfig;
    window.addEventListener('message', this.handleEvent, false);
  }

  configure = (config: Partial<OneAccountServicesConfig>) => {
    Object.assign(this.config, config);
  };

  // private saveCodeVerifier = (codeVerifier: string) => {
  //   this.codeVerifier = codeVerifier;
  //   const expires = new Date();
  //   expires.setTime(expires.getTime() + 3 * 60 * 60 * 1000);
  //   document.cookie = `codeVerifier=${codeVerifier}; expires=${expires.toUTCString()};path=/`;
  // };

  private handleEvent = async ({ data: message }: { data: OneAccountMessage }) => {
    if (!message) return;
    if (message.type === 'oneAccountSignInSuccess') {
      const body = {
        client_id: this.config.clientId,
        grant_type: 'authorization_code',
        // response_type: 'code',
        redirect_uri: `${this.config.apiURL}/oauth/continue`,
        code: message.data.code,
        code_verifier: this.codeVerifier,
      };

      const searchParams = objectToQuery(body);

      const res = await fetch(`${this.config.apiURL}/oauth/token`, {
        method: 'POST',
        body: searchParams,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const tokenData = await res.json();
      this.authorizationHeader = `${tokenData.token_type} ${tokenData.access_token}`;

      const res2 = await fetch(`${this.config.apiURL}/oauth/userinfo`, {
        headers: {
          Authorization: this.authorizationHeader,
        },
      });

      const userData = await res2.json();

      this.signIn._onSuccessCallback({
        userData: {
          sub: userData.sub,
          fullName: userData.full_name,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          profilePicture: userData.profile_picture,
        },
        tokenData: {
          accessToken: tokenData.access_token,
          tokenType: tokenData.token_type,
          expiresIn: tokenData.expires_in
        },
      });
      this.signIn.oneTap.hide();
    } else if (message.type === 'removeOneAccountOneTapSignInIframe') {
      this.signIn.oneTap.hide();
    }
  };

  signIn = new (class OneAccountSignIn {
    _parent: OneAccountServices;
    constructor(parent: OneAccountServices) {
      this._parent = parent;
    }

    _onSuccessCallback: OneAccountOnSuccessCallbackType = (result: OneAccountOnSuccessResult) => {
      console.log('Successfully signed in with One Account.', result);
      document.write(`Hi, ${result.userData.firstName}!`);
    };

    onSuccess = (cb: OneAccountOnSuccessCallbackType) => {
      this._onSuccessCallback = cb;
    };

    oneTap = new (class OneAccountOneTap {
      _parent: OneAccountSignIn;
      visible: boolean = false;
      constructor(parent: OneAccountSignIn) {
        this._parent = parent;
      }
      show = async ({
        autoSignIn = true,
        includeGrantedScopes = true,
        associateSession = true
      } = {}) => {
        if (this.visible) {
          return;
        }
        this.visible = true;

        this._parent._parent.codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(this._parent._parent.codeVerifier);

        const w = 490;
        const h = 860;

        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        const width = window.innerWidth
          ? window.innerWidth
          : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width;
        const height = window.innerHeight
          ? window.innerHeight
          : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = Math.round((width - w) / 2 / systemZoom + dualScreenLeft);
        const top = Math.round((height - h) / 2 / systemZoom + dualScreenTop);

        const popupWidth = Math.round(w / systemZoom);
        const popupHeight = Math.round(h / systemZoom);

        const queryObject = {
          grant_type: 'authorization_code',
          response_type: 'code',
          client_id: this._parent._parent.config.clientId,
          scope: 'openid+1a.fullname.view+1a.email.view+1a.profilepicture.view',
          state: '',
          include_granted_scopes: includeGrantedScopes,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          flow: 'popup',
          popup_width: popupWidth,
          popup_height: popupHeight,
          popup_left: left,
          popup_top: top,
          auto_sign_in: autoSignIn,
          origin: window.location.origin,
          associate_session: associateSession,
        };

        const query = objectToQuery(queryObject);

        if (document.getElementById('one-account-one-tap-sign-in')) {
          return;
        }

        const iframe = document.createElement('iframe');
        iframe.title = 'One Account';
        iframe.id = 'one-account-one-tap-sign-in';
        iframe.src = `${this._parent._parent.config.apiURL}/iframe/one-tap-sign-in?${query}`;
        iframe.style.width = '470px';
        iframe.style.height = '400px';
        iframe.style.position = 'fixed';
        iframe.style.top = '0px';
        iframe.style.right = '0px';
        iframe.style.zIndex = '9999';
        iframe.style.border = 'none';

        document.body.appendChild(iframe);
      };
      hide = () => {
        this.visible = false;
        const element = document.getElementById('one-account-one-tap-sign-in');
        if (!element) return;
        element.parentNode?.removeChild(element);
      };
    })(this);
  })(this);

  // access = new (class OneAccountAccess {
  //   request = async (requestedScopes: string[]) => {};
  // })();

  // security = new (class OneAccountSecurity {
  //   requestAdditionalVerification = () => {};
  // })();
}


export default new OneAccountServices();