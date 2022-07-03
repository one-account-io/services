"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const oneAccountServicesDefaultConfig = {
    clientId: '',
    apiURL: 'http://localhost:3000/v1',
};
class OneAccountServices {
    constructor() {
        this.codeVerifier = '';
        this.authorizationHeader = '';
        this.configure = (config) => {
            Object.assign(this.config, config);
        };
        // private saveCodeVerifier = (codeVerifier: string) => {
        //   this.codeVerifier = codeVerifier;
        //   const expires = new Date();
        //   expires.setTime(expires.getTime() + 3 * 60 * 60 * 1000);
        //   document.cookie = `codeVerifier=${codeVerifier}; expires=${expires.toUTCString()};path=/`;
        // };
        this.handleEvent = ({ data: message }) => __awaiter(this, void 0, void 0, function* () {
            console.log('message', message);
            if (!message)
                return;
            if (message.type === 'oneAccountSignInSuccess') {
                console.log('signIn', message.data);
                const body = {
                    client_id: this.config.clientId,
                    grant_type: 'authorization_code',
                    // response_type: 'code',
                    redirect_uri: `${this.config.apiURL}/oauth/continue`,
                    code: message.data.code,
                    code_verifier: this.codeVerifier,
                };
                const searchParams = (0, utils_1.objectToQuery)(body);
                const res = yield fetch(`${this.config.apiURL}/oauth/token`, {
                    method: 'POST',
                    body: searchParams,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                });
                const tokenData = yield res.json();
                this.authorizationHeader = `${tokenData.token_type} ${tokenData.access_token}`;
                const res2 = yield fetch(`${this.config.apiURL}/oauth/userinfo`, {
                    headers: {
                        Authorization: this.authorizationHeader,
                    },
                });
                const userData = yield res2.json();
                this.signIn._onSuccessCallback({
                    userData,
                    tokenData,
                });
                this.signIn.oneTap.hide();
            }
            else if (message.type === 'removeOneAccountOneTapSignInIframe') {
                this.signIn.oneTap.hide();
            }
        });
        this.signIn = new (class OneAccountSignIn {
            constructor(parent) {
                this._onSuccessCallback = (result) => {
                    console.log('Successfully signed in with One Account.', result);
                    document.write(`Hi, ${result.userData.first_name}!`);
                };
                this.onSuccess = (cb) => {
                    this._onSuccessCallback = cb;
                };
                this.oneTap = new (class OneAccountOneTap {
                    constructor(parent) {
                        this.show = ({ autoSignIn = true } = {}) => __awaiter(this, void 0, void 0, function* () {
                            if (document.getElementById('one-account-one-tap-sign-in')) {
                                this.hide();
                            }
                            this._parent._parent.codeVerifier = (0, utils_1.generateCodeVerifier)();
                            const codeChallenge = yield (0, utils_1.generateCodeChallenge)(this._parent._parent.codeVerifier);
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
                                include_granted_scopes: true,
                                code_challenge: codeChallenge,
                                code_challenge_method: 'S256',
                                flow: 'popup',
                                popup_width: popupWidth,
                                popup_height: popupHeight,
                                popup_left: left,
                                popup_top: top,
                                auto_sign_in: autoSignIn,
                                origin: window.location.origin,
                            };
                            const query = (0, utils_1.objectToQuery)(queryObject);
                            document.body.innerHTML += `<iframe
          title="One Account"
          id="one-account-one-tap-sign-in"
          src="${this._parent._parent.config.apiURL}/iframe/one-tap-sign-in?${query}"
          style="width: 470px; height: 400px; position: fixed; top: 0px; right: 0px; z-index: 9999"
          frameborder="0"
          ></iframe>`;
                        });
                        this.hide = () => {
                            var _a;
                            const element = document.getElementById('one-account-one-tap-sign-in');
                            if (!element)
                                return;
                            (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
                        };
                        this._parent = parent;
                    }
                })(this);
                this._parent = parent;
            }
        })(this);
        this.config = oneAccountServicesDefaultConfig;
        window.addEventListener('message', this.handleEvent, false);
    }
}
exports.default = new OneAccountServices();
