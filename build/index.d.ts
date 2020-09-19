/// <reference types="node" />
export declare const logError: (err: Error | string | {
    message: string;
    params: (string | number)[];
}, options?: object | undefined) => void;
export declare const startTransaction: (params: {
    name: string;
    type?: string;
    subtype?: string;
    action?: string;
    options?: {
        startTime?: number;
        childOf?: string;
    };
}) => {
    end: (result: string) => void;
};
export declare const currentTraceparent: string | null;
export declare const startSpan: (params: {
    name: string;
    type?: string;
    subtype?: string;
    action?: string;
    options?: {
        childOf?: string;
    };
}) => {
    end: () => void;
};
export declare const server: import("http").Server;
export declare const close: (callback: (err: Error | undefined) => void) => void;
export declare const catchAll: () => void;
export declare const api: import("express-serve-static-core").Express;
