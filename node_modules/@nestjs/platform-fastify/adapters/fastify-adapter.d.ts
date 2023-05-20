/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { RequestMethod, VersioningOptions } from '@nestjs/common';
import { VersionValue } from '@nestjs/common/interfaces';
import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { FastifyBaseLogger, FastifyBodyParser, FastifyInstance, FastifyPluginAsync, FastifyPluginCallback, FastifyRegister, FastifyReply, FastifyRequest, FastifyServerOptions, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RawServerDefault, RequestGenericInterface } from 'fastify';
import * as http2 from 'http2';
import * as https from 'https';
import { Chain as LightMyRequestChain, InjectOptions, Response as LightMyRequestResponse } from 'light-my-request';
import { NestFastifyBodyParserOptions } from '../interfaces';
import { FastifyStaticOptions, FastifyViewOptions } from '../interfaces/external';
type FastifyHttp2SecureOptions<Server extends http2.Http2SecureServer, Logger extends FastifyBaseLogger = FastifyBaseLogger> = FastifyServerOptions<Server, Logger> & {
    http2: true;
    https: http2.SecureServerOptions;
};
type FastifyHttp2Options<Server extends http2.Http2Server, Logger extends FastifyBaseLogger = FastifyBaseLogger> = FastifyServerOptions<Server, Logger> & {
    http2: true;
    http2SessionTimeout?: number;
};
type FastifyHttpsOptions<Server extends https.Server, Logger extends FastifyBaseLogger = FastifyBaseLogger> = FastifyServerOptions<Server, Logger> & {
    https: https.ServerOptions;
};
type VersionedRoute<TRequest, TResponse> = ((req: TRequest, res: TResponse, next: Function) => Function) & {
    version: VersionValue;
    versioningOptions: VersioningOptions;
};
/**
 * The following type assertion is valid as we enforce "middie" plugin registration
 * which enhances the FastifyRequest.RawRequest with the "originalUrl" property.
 * ref https://github.com/fastify/middie/pull/16
 * ref https://github.com/fastify/fastify/pull/559
 */
type FastifyRawRequest<TServer extends RawServerBase> = RawRequestDefaultExpression<TServer> & {
    originalUrl?: string;
};
/**
 * @publicApi
 */
export declare class FastifyAdapter<TServer extends RawServerBase = RawServerDefault, TRawRequest extends FastifyRawRequest<TServer> = FastifyRawRequest<TServer>, TRawResponse extends RawReplyDefaultExpression<TServer> = RawReplyDefaultExpression<TServer>, TRequest extends FastifyRequest<RequestGenericInterface, TServer, TRawRequest> = FastifyRequest<RequestGenericInterface, TServer, TRawRequest>, TReply extends FastifyReply<TServer, TRawRequest, TRawResponse> = FastifyReply<TServer, TRawRequest, TRawResponse>, TInstance extends FastifyInstance<TServer, TRawRequest, TRawResponse> = FastifyInstance<TServer, TRawRequest, TRawResponse>> extends AbstractHttpAdapter<TServer, TRequest, TReply> {
    protected readonly instance: TInstance;
    private _isParserRegistered;
    private isMiddieRegistered;
    private versioningOptions;
    private readonly versionConstraint;
    get isParserRegistered(): boolean;
    constructor(instanceOrOptions?: TInstance | FastifyHttp2Options<any> | FastifyHttp2SecureOptions<any> | FastifyHttpsOptions<any> | FastifyServerOptions<TServer>);
    init(): Promise<void>;
    listen(port: string | number, callback?: () => void): void;
    listen(port: string | number, hostname: string, callback?: () => void): void;
    get(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    post(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    head(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    delete(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    put(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    patch(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    options(...args: any[]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    applyVersionFilter(handler: Function, version: VersionValue, versioningOptions: VersioningOptions): VersionedRoute<TRequest, TReply>;
    reply(response: TRawResponse | TReply, body: any, statusCode?: number): FastifyReply<TServer, TRawRequest, TRawResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    status(response: TRawResponse | TReply, statusCode: number): TRawResponse | FastifyReply<TServer, TRawRequest, TRawResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    end(response: TReply, message?: string): void;
    render(response: TReply & {
        view: Function;
    }, view: string, options: any): any;
    redirect(response: TReply, statusCode: number, url: string): FastifyReply<TServer, TRawRequest, TRawResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    setErrorHandler(handler: Parameters<TInstance['setErrorHandler']>[0]): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProvider>;
    setNotFoundHandler(handler: Function): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>;
    getHttpServer<T = TServer>(): T;
    getInstance<T = TInstance>(): T;
    register<TRegister extends Parameters<FastifyRegister<TInstance>>>(plugin: TRegister['0'], opts?: TRegister['1']): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<undefined>;
    inject(): LightMyRequestChain;
    inject(opts: InjectOptions | string): Promise<LightMyRequestResponse>;
    close(): Promise<undefined>;
    initHttpServer(): void;
    useStaticAssets(options: FastifyStaticOptions): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<undefined>;
    setViewEngine(options: FastifyViewOptions | string): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<undefined>;
    isHeadersSent(response: TReply): boolean;
    setHeader(response: TReply, name: string, value: string): FastifyReply<TServer, TRawRequest, TRawResponse, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    getRequestHostname(request: TRequest): string;
    getRequestMethod(request: TRequest): string;
    getRequestUrl(request: TRequest): string;
    getRequestUrl(request: TRawRequest): string;
    enableCors(options: CorsOptions | CorsOptionsDelegate<TRequest>): void;
    registerParserMiddleware(prefix?: string, rawBody?: boolean): void;
    useBodyParser(type: string | string[] | RegExp, rawBody: boolean, options?: NestFastifyBodyParserOptions, parser?: FastifyBodyParser<Buffer, TServer>): void;
    createMiddlewareFactory(requestMethod: RequestMethod): Promise<(path: string, callback: Function) => any>;
    getType(): string;
    protected registerWithPrefix(factory: FastifyPluginCallback<any> | FastifyPluginAsync<any> | Promise<{
        default: FastifyPluginCallback<any>;
    }> | Promise<{
        default: FastifyPluginAsync<any>;
    }>, prefix?: string): FastifyInstance<TServer, TRawRequest, TRawResponse, FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<undefined>;
    private isNativeResponse;
    private registerJsonContentParser;
    private registerUrlencodedContentParser;
    private registerMiddie;
    private getRequestOriginalUrl;
    private injectConstraintsIfVersioned;
}
export {};
