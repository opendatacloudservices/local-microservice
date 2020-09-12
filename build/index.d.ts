/// <reference types="node" />
export declare const logError: (err: Error | string | {
    message: string;
    params: (string | number)[];
}, options?: object | undefined) => void;
export declare const startTransaction: (name: string | null | undefined, options?: {
    startTime?: number;
    childOf?: string;
} | undefined) => {
    name: string;
    result: string | number;
    end: () => void;
} | null;
export declare const currentTraceparent: string | null;
export declare const startSpan: (name: string | null | undefined, options?: {
    childOf?: string;
} | undefined) => {
    end: () => void;
} | null;
export declare const server: import("http").Server;
export declare const catchAll: () => void;
export declare const api: import("express-serve-static-core").Express;
