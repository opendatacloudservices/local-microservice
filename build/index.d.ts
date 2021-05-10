/// <reference types="node" />
import { Response } from 'express';
export declare const logError: (err: Error | string | {
    message: string;
    params: (string | number)[];
}) => void;
export declare const logInfo: (err: Error | string | {
    message: string;
    params: (string | number)[];
}) => void;
export declare const addToken: (url: string, res: Response) => string;
export declare const startTransaction: (params: {
    name: string;
    type?: string;
    subtype?: string;
    action?: string;
    options?: {
        startTime?: number;
        childOf?: string;
    };
}) => (success: boolean, message?: {} | undefined) => void;
export declare const startSpan: (params: {
    name: string;
    type?: string;
    subtype?: string;
    action?: string;
    options?: {
        childOf?: string;
    };
}) => (success: boolean, message?: {} | undefined) => void;
export declare const port: string | number;
export declare const server: import("http").Server;
export declare const close: (callback: (err: Error | undefined) => void) => void;
export declare const catchAll: () => void;
export declare const api: import("express-serve-static-core").Express;
