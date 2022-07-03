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
exports.objectToQuery = exports.generateCodeChallenge = exports.generateCodeVerifier = void 0;
const generateCodeVerifier = (length = 128) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.generateCodeVerifier = generateCodeVerifier;
const generateCodeChallenge = (codeVerifier) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
});
exports.generateCodeChallenge = generateCodeChallenge;
const objectToQuery = (object) => Object.keys(object)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
    .join('&');
exports.objectToQuery = objectToQuery;
