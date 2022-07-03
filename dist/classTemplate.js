"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
_1.default.configure({
    clientId: 'krneki',
});
_1.default.signIn.oneTap.show();
_1.default.signIn.oneTap.hide();
// OneAccountServices.signIn.renderButton({
//   id: 'container',
// });
_1.default.signIn.onSuccess((result) => {
    console.log('OneAccountResult', result);
});
// OneAccountServices.access.request(['1a.address.view']);
