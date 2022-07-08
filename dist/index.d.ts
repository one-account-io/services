import { OneAccountOnSuccessResult, OneAccountServicesConfig } from './types';
declare type OneAccountOnSuccessCallbackType = (result: OneAccountOnSuccessResult) => void;
declare class OneAccountServices {
    private config;
    private codeVerifier;
    private authorizationHeader;
    constructor();
    configure: (config: Partial<OneAccountServicesConfig>) => void;
    private handleEvent;
    signIn: {
        _parent: OneAccountServices;
        _onSuccessCallback: OneAccountOnSuccessCallbackType;
        onSuccess: (cb: OneAccountOnSuccessCallbackType) => void;
        oneTap: {
            _parent: any;
            visible: boolean;
            show: ({ autoSignIn }?: {
                autoSignIn?: boolean | undefined;
            }) => Promise<void>;
            hide: () => void;
        };
    };
}
declare const _default: OneAccountServices;
export default _default;
