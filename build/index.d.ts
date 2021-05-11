/// <reference types="node" />
import { Response } from 'express';
export declare const port: string | number;
export declare const server: import("http").Server;
export declare const close: (callback: (err: Error | undefined) => void) => void;
export declare const catchAll: () => void;
export declare const simpleResponse: (responseCode: number, responseText: string, res: Response, trans: (success: boolean, message?: {} | undefined) => void) => Response;
export declare const api: import("express-serve-static-core").Express;
