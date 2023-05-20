"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyAdapter = void 0;
const common_1 = require("@nestjs/common");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const http_adapter_1 = require("@nestjs/core/adapters/http-adapter");
const fastify_1 = require("fastify");
const Reply = require("fastify/lib/reply");
const symbols_1 = require("fastify/lib/symbols");
// `querystring` is used internally in fastify for registering urlencoded body parser.
const querystring_1 = require("querystring");
/**
 * @publicApi
 */
class FastifyAdapter extends http_adapter_1.AbstractHttpAdapter {
    get isParserRegistered() {
        return !!this._isParserRegistered;
    }
    constructor(instanceOrOptions) {
        super();
        this.versionConstraint = {
            name: 'version',
            validate(value) {
                if (!(0, shared_utils_1.isString)(value) && !Array.isArray(value)) {
                    throw new Error('Version constraint should be a string or an array of strings.');
                }
            },
            storage() {
                const versions = new Map();
                return {
                    get(version) {
                        if (Array.isArray(version)) {
                            return versions.get(version.find(v => versions.has(v))) || null;
                        }
                        return versions.get(version) || null;
                    },
                    set(versionOrVersions, store) {
                        const storeVersionConstraint = (version) => versions.set(version, store);
                        if (Array.isArray(versionOrVersions))
                            versionOrVersions.forEach(storeVersionConstraint);
                        else
                            storeVersionConstraint(versionOrVersions);
                    },
                    del(version) {
                        if (Array.isArray(version)) {
                            version.forEach(v => versions.delete(v));
                        }
                        else {
                            versions.delete(version);
                        }
                    },
                    empty() {
                        versions.clear();
                    },
                };
            },
            deriveConstraint: (req) => {
                var _a, _b, _c, _d;
                // Media Type (Accept Header) Versioning Handler
                if (this.versioningOptions.type === common_1.VersioningType.MEDIA_TYPE) {
                    const MEDIA_TYPE_HEADER = 'Accept';
                    const acceptHeaderValue = (((_a = req.headers) === null || _a === void 0 ? void 0 : _a[MEDIA_TYPE_HEADER]) || ((_b = req.headers) === null || _b === void 0 ? void 0 : _b[MEDIA_TYPE_HEADER.toLowerCase()]));
                    const acceptHeaderVersionParameter = acceptHeaderValue
                        ? acceptHeaderValue.split(';')[1]
                        : '';
                    return (0, shared_utils_1.isUndefined)(acceptHeaderVersionParameter)
                        ? common_1.VERSION_NEUTRAL // No version was supplied
                        : acceptHeaderVersionParameter.split(this.versioningOptions.key)[1];
                }
                // Header Versioning Handler
                else if (this.versioningOptions.type === common_1.VersioningType.HEADER) {
                    const customHeaderVersionParameter = ((_c = req.headers) === null || _c === void 0 ? void 0 : _c[this.versioningOptions.header]) ||
                        ((_d = req.headers) === null || _d === void 0 ? void 0 : _d[this.versioningOptions.header.toLowerCase()]);
                    return (0, shared_utils_1.isUndefined)(customHeaderVersionParameter)
                        ? common_1.VERSION_NEUTRAL // No version was supplied
                        : customHeaderVersionParameter;
                }
                // Custom Versioning Handler
                else if (this.versioningOptions.type === common_1.VersioningType.CUSTOM) {
                    return this.versioningOptions.extractor(req);
                }
                return undefined;
            },
            mustMatchWhenDerived: false,
        };
        const instance = instanceOrOptions && instanceOrOptions.server
            ? instanceOrOptions
            : (0, fastify_1.fastify)(Object.assign({ constraints: {
                    version: this.versionConstraint,
                } }, instanceOrOptions));
        this.setInstance(instance);
    }
    async init() {
        if (this.isMiddieRegistered) {
            return;
        }
        await this.registerMiddie();
    }
    listen(listenOptions, ...args) {
        const isFirstArgTypeofFunction = typeof args[0] === 'function';
        const callback = isFirstArgTypeofFunction ? args[0] : args[1];
        let options;
        if (typeof listenOptions === 'object' &&
            (listenOptions.host !== undefined ||
                listenOptions.port !== undefined ||
                listenOptions.path !== undefined)) {
            // First parameter is an object with a path, port and/or host attributes
            options = listenOptions;
        }
        else {
            options = {
                port: +listenOptions,
            };
        }
        if (!isFirstArgTypeofFunction) {
            options.host = args[0];
        }
        return this.instance.listen(options, callback);
    }
    get(...args) {
        return this.injectConstraintsIfVersioned('get', ...args);
    }
    post(...args) {
        return this.injectConstraintsIfVersioned('post', ...args);
    }
    head(...args) {
        return this.injectConstraintsIfVersioned('head', ...args);
    }
    delete(...args) {
        return this.injectConstraintsIfVersioned('delete', ...args);
    }
    put(...args) {
        return this.injectConstraintsIfVersioned('put', ...args);
    }
    patch(...args) {
        return this.injectConstraintsIfVersioned('patch', ...args);
    }
    options(...args) {
        return this.injectConstraintsIfVersioned('options', ...args);
    }
    applyVersionFilter(handler, version, versioningOptions) {
        if (!this.versioningOptions) {
            this.versioningOptions = versioningOptions;
        }
        const versionedRoute = handler;
        versionedRoute.version = version;
        return versionedRoute;
    }
    reply(response, body, statusCode) {
        const fastifyReply = this.isNativeResponse(response)
            ? new Reply(response, {
                [symbols_1.kRouteContext]: {
                    preSerialization: null,
                    preValidation: [],
                    preHandler: [],
                    onSend: [],
                    onError: [],
                },
            }, {})
            : response;
        if (statusCode) {
            fastifyReply.status(statusCode);
        }
        if (body instanceof common_1.StreamableFile) {
            const streamHeaders = body.getHeaders();
            if (fastifyReply.getHeader('Content-Type') === undefined &&
                streamHeaders.type !== undefined) {
                fastifyReply.header('Content-Type', streamHeaders.type);
            }
            if (fastifyReply.getHeader('Content-Disposition') === undefined &&
                streamHeaders.disposition !== undefined) {
                fastifyReply.header('Content-Disposition', streamHeaders.disposition);
            }
            if (fastifyReply.getHeader('Content-Length') === undefined &&
                streamHeaders.length !== undefined) {
                fastifyReply.header('Content-Length', streamHeaders.length);
            }
            body = body.getStream();
        }
        if (fastifyReply.getHeader('Content-Type') !== undefined &&
            fastifyReply.getHeader('Content-Type') !== 'application/json' &&
            (body === null || body === void 0 ? void 0 : body.statusCode) >= common_1.HttpStatus.BAD_REQUEST) {
            common_1.Logger.warn("Content-Type doesn't match Reply body, you might need a custom ExceptionFilter for non-JSON responses", FastifyAdapter.name);
            fastifyReply.header('Content-Type', 'application/json');
        }
        return fastifyReply.send(body);
    }
    status(response, statusCode) {
        if (this.isNativeResponse(response)) {
            response.statusCode = statusCode;
            return response;
        }
        return response.code(statusCode);
    }
    end(response, message) {
        response.raw.end(message);
    }
    render(response, view, options) {
        return response && response.view(view, options);
    }
    redirect(response, statusCode, url) {
        const code = statusCode !== null && statusCode !== void 0 ? statusCode : common_1.HttpStatus.FOUND;
        return response.status(code).redirect(url);
    }
    setErrorHandler(handler) {
        return this.instance.setErrorHandler(handler);
    }
    setNotFoundHandler(handler) {
        return this.instance.setNotFoundHandler(handler);
    }
    getHttpServer() {
        return this.instance.server;
    }
    getInstance() {
        return this.instance;
    }
    register(plugin, opts) {
        return this.instance.register(plugin, opts);
    }
    inject(opts) {
        return this.instance.inject(opts);
    }
    async close() {
        try {
            return await this.instance.close();
        }
        catch (err) {
            // Check if server is still running
            if (err.code !== 'ERR_SERVER_NOT_RUNNING') {
                throw err;
            }
            return;
        }
    }
    initHttpServer() {
        this.httpServer = this.instance.server;
    }
    useStaticAssets(options) {
        return this.register((0, load_package_util_1.loadPackage)('@fastify/static', 'FastifyAdapter.useStaticAssets()', () => require('@fastify/static')), options);
    }
    setViewEngine(options) {
        if ((0, shared_utils_1.isString)(options)) {
            new common_1.Logger('FastifyAdapter').error("setViewEngine() doesn't support a string argument.");
            process.exit(1);
        }
        return this.register((0, load_package_util_1.loadPackage)('@fastify/view', 'FastifyAdapter.setViewEngine()', () => require('@fastify/view')), options);
    }
    isHeadersSent(response) {
        return response.sent;
    }
    setHeader(response, name, value) {
        return response.header(name, value);
    }
    getRequestHostname(request) {
        return request.hostname;
    }
    getRequestMethod(request) {
        return request.raw ? request.raw.method : request.method;
    }
    getRequestUrl(request) {
        return this.getRequestOriginalUrl(request.raw || request);
    }
    enableCors(options) {
        this.register(Promise.resolve().then(() => require('@fastify/cors')), options);
    }
    registerParserMiddleware(prefix, rawBody) {
        if (this._isParserRegistered) {
            return;
        }
        this.registerUrlencodedContentParser(rawBody);
        this.registerJsonContentParser(rawBody);
        this._isParserRegistered = true;
    }
    useBodyParser(type, rawBody, options, parser) {
        const parserOptions = Object.assign(Object.assign({}, (options || {})), { parseAs: 'buffer' });
        this.getInstance().addContentTypeParser(type, parserOptions, (req, body, done) => {
            if (rawBody === true && Buffer.isBuffer(body)) {
                req.rawBody = body;
            }
            if (parser) {
                parser(req, body, done);
                return;
            }
            done(null, body);
        });
        // To avoid the Nest application init to override our custom
        // body parser, we mark the parsers as registered.
        this._isParserRegistered = true;
    }
    async createMiddlewareFactory(requestMethod) {
        if (!this.isMiddieRegistered) {
            await this.registerMiddie();
        }
        return (path, callback) => {
            let normalizedPath = path.endsWith('/*')
                ? `${path.slice(0, -1)}(.*)`
                : path;
            // Fallback to "(.*)" to support plugins like GraphQL
            normalizedPath = normalizedPath === '/(.*)' ? '(.*)' : normalizedPath;
            // The following type assertion is valid as we use import('@fastify/middie') rather than require('@fastify/middie')
            // ref https://github.com/fastify/middie/pull/55
            this.instance.use(normalizedPath, callback);
        };
    }
    getType() {
        return 'fastify';
    }
    registerWithPrefix(factory, prefix = '/') {
        return this.instance.register(factory, { prefix });
    }
    isNativeResponse(response) {
        return !('status' in response);
    }
    registerJsonContentParser(rawBody) {
        const contentType = 'application/json';
        const withRawBody = !!rawBody;
        const { bodyLimit } = this.getInstance().initialConfig;
        this.useBodyParser(contentType, withRawBody, { bodyLimit }, (req, body, done) => {
            const { onProtoPoisoning, onConstructorPoisoning } = this.instance.initialConfig;
            const defaultJsonParser = this.instance.getDefaultJsonParser(onProtoPoisoning || 'error', onConstructorPoisoning || 'error');
            defaultJsonParser(req, body, done);
        });
    }
    registerUrlencodedContentParser(rawBody) {
        const contentType = 'application/x-www-form-urlencoded';
        const withRawBody = !!rawBody;
        const { bodyLimit } = this.getInstance().initialConfig;
        this.useBodyParser(contentType, withRawBody, { bodyLimit }, (_req, body, done) => {
            done(null, (0, querystring_1.parse)(body.toString()));
        });
    }
    async registerMiddie() {
        this.isMiddieRegistered = true;
        await this.register(Promise.resolve().then(() => require('@fastify/middie')));
    }
    getRequestOriginalUrl(rawRequest) {
        return rawRequest.originalUrl || rawRequest.url;
    }
    injectConstraintsIfVersioned(routerMethodKey, ...args) {
        const handlerRef = args[args.length - 1];
        const isVersioned = !(0, shared_utils_1.isUndefined)(handlerRef.version) &&
            handlerRef.version !== common_1.VERSION_NEUTRAL;
        if (isVersioned) {
            const isPathAndRouteTuple = args.length === 2;
            if (isPathAndRouteTuple) {
                const options = {
                    constraints: {
                        version: handlerRef.version,
                    },
                };
                const path = args[0];
                return this.instance[routerMethodKey](path, options, handlerRef);
            }
        }
        return this.instance[routerMethodKey](...args);
    }
}
exports.FastifyAdapter = FastifyAdapter;
