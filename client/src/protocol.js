/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.mds = (function() {

    /**
     * Namespace mds.
     * @exports mds
     * @namespace
     */
    var mds = {};

    mds.LoginChallenge = (function() {

        /**
         * Properties of a LoginChallenge.
         * @memberof mds
         * @interface ILoginChallenge
         * @property {Uint8Array|null} [challenge] LoginChallenge challenge
         * @property {string|null} [version] LoginChallenge version
         */

        /**
         * Constructs a new LoginChallenge.
         * @memberof mds
         * @classdesc Represents a LoginChallenge.
         * @implements ILoginChallenge
         * @constructor
         * @param {mds.ILoginChallenge=} [properties] Properties to set
         */
        function LoginChallenge(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginChallenge challenge.
         * @member {Uint8Array} challenge
         * @memberof mds.LoginChallenge
         * @instance
         */
        LoginChallenge.prototype.challenge = $util.newBuffer([]);

        /**
         * LoginChallenge version.
         * @member {string} version
         * @memberof mds.LoginChallenge
         * @instance
         */
        LoginChallenge.prototype.version = "";

        /**
         * Creates a new LoginChallenge instance using the specified properties.
         * @function create
         * @memberof mds.LoginChallenge
         * @static
         * @param {mds.ILoginChallenge=} [properties] Properties to set
         * @returns {mds.LoginChallenge} LoginChallenge instance
         */
        LoginChallenge.create = function create(properties) {
            return new LoginChallenge(properties);
        };

        /**
         * Encodes the specified LoginChallenge message. Does not implicitly {@link mds.LoginChallenge.verify|verify} messages.
         * @function encode
         * @memberof mds.LoginChallenge
         * @static
         * @param {mds.ILoginChallenge} message LoginChallenge message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginChallenge.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.challenge != null && Object.hasOwnProperty.call(message, "challenge"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.challenge);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.version);
            return writer;
        };

        /**
         * Encodes the specified LoginChallenge message, length delimited. Does not implicitly {@link mds.LoginChallenge.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.LoginChallenge
         * @static
         * @param {mds.ILoginChallenge} message LoginChallenge message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginChallenge.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginChallenge message from the specified reader or buffer.
         * @function decode
         * @memberof mds.LoginChallenge
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.LoginChallenge} LoginChallenge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginChallenge.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.LoginChallenge();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.challenge = reader.bytes();
                    break;
                case 2:
                    message.version = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginChallenge message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.LoginChallenge
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.LoginChallenge} LoginChallenge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginChallenge.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginChallenge message.
         * @function verify
         * @memberof mds.LoginChallenge
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginChallenge.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.challenge != null && message.hasOwnProperty("challenge"))
                if (!(message.challenge && typeof message.challenge.length === "number" || $util.isString(message.challenge)))
                    return "challenge: buffer expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            return null;
        };

        /**
         * Creates a LoginChallenge message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.LoginChallenge
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.LoginChallenge} LoginChallenge
         */
        LoginChallenge.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.LoginChallenge)
                return object;
            var message = new $root.mds.LoginChallenge();
            if (object.challenge != null)
                if (typeof object.challenge === "string")
                    $util.base64.decode(object.challenge, message.challenge = $util.newBuffer($util.base64.length(object.challenge)), 0);
                else if (object.challenge.length)
                    message.challenge = object.challenge;
            if (object.version != null)
                message.version = String(object.version);
            return message;
        };

        /**
         * Creates a plain object from a LoginChallenge message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.LoginChallenge
         * @static
         * @param {mds.LoginChallenge} message LoginChallenge
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginChallenge.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.challenge = "";
                else {
                    object.challenge = [];
                    if (options.bytes !== Array)
                        object.challenge = $util.newBuffer(object.challenge);
                }
                object.version = "";
            }
            if (message.challenge != null && message.hasOwnProperty("challenge"))
                object.challenge = options.bytes === String ? $util.base64.encode(message.challenge, 0, message.challenge.length) : options.bytes === Array ? Array.prototype.slice.call(message.challenge) : message.challenge;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            return object;
        };

        /**
         * Converts this LoginChallenge to JSON.
         * @function toJSON
         * @memberof mds.LoginChallenge
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginChallenge.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginChallenge;
    })();

    mds.Login = (function() {

        /**
         * Properties of a Login.
         * @memberof mds
         * @interface ILogin
         * @property {string|null} [store] Login store
         * @property {Uint8Array|null} [publicKey] Login publicKey
         * @property {Uint8Array|null} [signature] Login signature
         * @property {number|null} [muxWidth] Login muxWidth
         */

        /**
         * Constructs a new Login.
         * @memberof mds
         * @classdesc Represents a Login.
         * @implements ILogin
         * @constructor
         * @param {mds.ILogin=} [properties] Properties to set
         */
        function Login(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Login store.
         * @member {string} store
         * @memberof mds.Login
         * @instance
         */
        Login.prototype.store = "";

        /**
         * Login publicKey.
         * @member {Uint8Array} publicKey
         * @memberof mds.Login
         * @instance
         */
        Login.prototype.publicKey = $util.newBuffer([]);

        /**
         * Login signature.
         * @member {Uint8Array} signature
         * @memberof mds.Login
         * @instance
         */
        Login.prototype.signature = $util.newBuffer([]);

        /**
         * Login muxWidth.
         * @member {number} muxWidth
         * @memberof mds.Login
         * @instance
         */
        Login.prototype.muxWidth = 0;

        /**
         * Creates a new Login instance using the specified properties.
         * @function create
         * @memberof mds.Login
         * @static
         * @param {mds.ILogin=} [properties] Properties to set
         * @returns {mds.Login} Login instance
         */
        Login.create = function create(properties) {
            return new Login(properties);
        };

        /**
         * Encodes the specified Login message. Does not implicitly {@link mds.Login.verify|verify} messages.
         * @function encode
         * @memberof mds.Login
         * @static
         * @param {mds.ILogin} message Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.store != null && Object.hasOwnProperty.call(message, "store"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.store);
            if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.publicKey);
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.signature);
            if (message.muxWidth != null && Object.hasOwnProperty.call(message, "muxWidth"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.muxWidth);
            return writer;
        };

        /**
         * Encodes the specified Login message, length delimited. Does not implicitly {@link mds.Login.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.Login
         * @static
         * @param {mds.ILogin} message Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @function decode
         * @memberof mds.Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.Login} Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.Login();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.store = reader.string();
                    break;
                case 2:
                    message.publicKey = reader.bytes();
                    break;
                case 3:
                    message.signature = reader.bytes();
                    break;
                case 4:
                    message.muxWidth = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Login message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.Login} Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Login message.
         * @function verify
         * @memberof mds.Login
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Login.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.store != null && message.hasOwnProperty("store"))
                if (!$util.isString(message.store))
                    return "store: string expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                if (!(message.publicKey && typeof message.publicKey.length === "number" || $util.isString(message.publicKey)))
                    return "publicKey: buffer expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                    return "signature: buffer expected";
            if (message.muxWidth != null && message.hasOwnProperty("muxWidth"))
                if (!$util.isInteger(message.muxWidth))
                    return "muxWidth: integer expected";
            return null;
        };

        /**
         * Creates a Login message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.Login
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.Login} Login
         */
        Login.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.Login)
                return object;
            var message = new $root.mds.Login();
            if (object.store != null)
                message.store = String(object.store);
            if (object.publicKey != null)
                if (typeof object.publicKey === "string")
                    $util.base64.decode(object.publicKey, message.publicKey = $util.newBuffer($util.base64.length(object.publicKey)), 0);
                else if (object.publicKey.length)
                    message.publicKey = object.publicKey;
            if (object.signature != null)
                if (typeof object.signature === "string")
                    $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                else if (object.signature.length)
                    message.signature = object.signature;
            if (object.muxWidth != null)
                message.muxWidth = object.muxWidth >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Login message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.Login
         * @static
         * @param {mds.Login} message Login
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Login.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.store = "";
                if (options.bytes === String)
                    object.publicKey = "";
                else {
                    object.publicKey = [];
                    if (options.bytes !== Array)
                        object.publicKey = $util.newBuffer(object.publicKey);
                }
                if (options.bytes === String)
                    object.signature = "";
                else {
                    object.signature = [];
                    if (options.bytes !== Array)
                        object.signature = $util.newBuffer(object.signature);
                }
                object.muxWidth = 0;
            }
            if (message.store != null && message.hasOwnProperty("store"))
                object.store = message.store;
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = options.bytes === String ? $util.base64.encode(message.publicKey, 0, message.publicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicKey) : message.publicKey;
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            if (message.muxWidth != null && message.hasOwnProperty("muxWidth"))
                object.muxWidth = message.muxWidth;
            return object;
        };

        /**
         * Converts this Login to JSON.
         * @function toJSON
         * @memberof mds.Login
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Login.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Login;
    })();

    mds.LoginResponse = (function() {

        /**
         * Properties of a LoginResponse.
         * @memberof mds
         * @interface ILoginResponse
         * @property {boolean|null} [ok] LoginResponse ok
         * @property {string|null} [region] LoginResponse region
         * @property {string|null} [error] LoginResponse error
         * @property {number|Long|null} [pingIntervalMs] LoginResponse pingIntervalMs
         */

        /**
         * Constructs a new LoginResponse.
         * @memberof mds
         * @classdesc Represents a LoginResponse.
         * @implements ILoginResponse
         * @constructor
         * @param {mds.ILoginResponse=} [properties] Properties to set
         */
        function LoginResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginResponse ok.
         * @member {boolean} ok
         * @memberof mds.LoginResponse
         * @instance
         */
        LoginResponse.prototype.ok = false;

        /**
         * LoginResponse region.
         * @member {string} region
         * @memberof mds.LoginResponse
         * @instance
         */
        LoginResponse.prototype.region = "";

        /**
         * LoginResponse error.
         * @member {string} error
         * @memberof mds.LoginResponse
         * @instance
         */
        LoginResponse.prototype.error = "";

        /**
         * LoginResponse pingIntervalMs.
         * @member {number|Long} pingIntervalMs
         * @memberof mds.LoginResponse
         * @instance
         */
        LoginResponse.prototype.pingIntervalMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @function create
         * @memberof mds.LoginResponse
         * @static
         * @param {mds.ILoginResponse=} [properties] Properties to set
         * @returns {mds.LoginResponse} LoginResponse instance
         */
        LoginResponse.create = function create(properties) {
            return new LoginResponse(properties);
        };

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link mds.LoginResponse.verify|verify} messages.
         * @function encode
         * @memberof mds.LoginResponse
         * @static
         * @param {mds.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ok != null && Object.hasOwnProperty.call(message, "ok"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.ok);
            if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.region);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.error);
            if (message.pingIntervalMs != null && Object.hasOwnProperty.call(message, "pingIntervalMs"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.pingIntervalMs);
            return writer;
        };

        /**
         * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link mds.LoginResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.LoginResponse
         * @static
         * @param {mds.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @function decode
         * @memberof mds.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.LoginResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ok = reader.bool();
                    break;
                case 2:
                    message.region = reader.string();
                    break;
                case 3:
                    message.error = reader.string();
                    break;
                case 4:
                    message.pingIntervalMs = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginResponse message.
         * @function verify
         * @memberof mds.LoginResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ok != null && message.hasOwnProperty("ok"))
                if (typeof message.ok !== "boolean")
                    return "ok: boolean expected";
            if (message.region != null && message.hasOwnProperty("region"))
                if (!$util.isString(message.region))
                    return "region: string expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.pingIntervalMs != null && message.hasOwnProperty("pingIntervalMs"))
                if (!$util.isInteger(message.pingIntervalMs) && !(message.pingIntervalMs && $util.isInteger(message.pingIntervalMs.low) && $util.isInteger(message.pingIntervalMs.high)))
                    return "pingIntervalMs: integer|Long expected";
            return null;
        };

        /**
         * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.LoginResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.LoginResponse} LoginResponse
         */
        LoginResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.LoginResponse)
                return object;
            var message = new $root.mds.LoginResponse();
            if (object.ok != null)
                message.ok = Boolean(object.ok);
            if (object.region != null)
                message.region = String(object.region);
            if (object.error != null)
                message.error = String(object.error);
            if (object.pingIntervalMs != null)
                if ($util.Long)
                    (message.pingIntervalMs = $util.Long.fromValue(object.pingIntervalMs)).unsigned = true;
                else if (typeof object.pingIntervalMs === "string")
                    message.pingIntervalMs = parseInt(object.pingIntervalMs, 10);
                else if (typeof object.pingIntervalMs === "number")
                    message.pingIntervalMs = object.pingIntervalMs;
                else if (typeof object.pingIntervalMs === "object")
                    message.pingIntervalMs = new $util.LongBits(object.pingIntervalMs.low >>> 0, object.pingIntervalMs.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.LoginResponse
         * @static
         * @param {mds.LoginResponse} message LoginResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.ok = false;
                object.region = "";
                object.error = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.pingIntervalMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.pingIntervalMs = options.longs === String ? "0" : 0;
            }
            if (message.ok != null && message.hasOwnProperty("ok"))
                object.ok = message.ok;
            if (message.region != null && message.hasOwnProperty("region"))
                object.region = message.region;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.pingIntervalMs != null && message.hasOwnProperty("pingIntervalMs"))
                if (typeof message.pingIntervalMs === "number")
                    object.pingIntervalMs = options.longs === String ? String(message.pingIntervalMs) : message.pingIntervalMs;
                else
                    object.pingIntervalMs = options.longs === String ? $util.Long.prototype.toString.call(message.pingIntervalMs) : options.longs === Number ? new $util.LongBits(message.pingIntervalMs.low >>> 0, message.pingIntervalMs.high >>> 0).toNumber(true) : message.pingIntervalMs;
            return object;
        };

        /**
         * Converts this LoginResponse to JSON.
         * @function toJSON
         * @memberof mds.LoginResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginResponse;
    })();

    mds.Request = (function() {

        /**
         * Properties of a Request.
         * @memberof mds
         * @interface IRequest
         * @property {number|null} [lane] Request lane
         * @property {string|null} [program] Request program
         * @property {string|null} [data] Request data
         * @property {Array.<mds.IFastpathRequest>|null} [fastpathBatch] Request fastpathBatch
         */

        /**
         * Constructs a new Request.
         * @memberof mds
         * @classdesc Represents a Request.
         * @implements IRequest
         * @constructor
         * @param {mds.IRequest=} [properties] Properties to set
         */
        function Request(properties) {
            this.fastpathBatch = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Request lane.
         * @member {number} lane
         * @memberof mds.Request
         * @instance
         */
        Request.prototype.lane = 0;

        /**
         * Request program.
         * @member {string} program
         * @memberof mds.Request
         * @instance
         */
        Request.prototype.program = "";

        /**
         * Request data.
         * @member {string} data
         * @memberof mds.Request
         * @instance
         */
        Request.prototype.data = "";

        /**
         * Request fastpathBatch.
         * @member {Array.<mds.IFastpathRequest>} fastpathBatch
         * @memberof mds.Request
         * @instance
         */
        Request.prototype.fastpathBatch = $util.emptyArray;

        /**
         * Creates a new Request instance using the specified properties.
         * @function create
         * @memberof mds.Request
         * @static
         * @param {mds.IRequest=} [properties] Properties to set
         * @returns {mds.Request} Request instance
         */
        Request.create = function create(properties) {
            return new Request(properties);
        };

        /**
         * Encodes the specified Request message. Does not implicitly {@link mds.Request.verify|verify} messages.
         * @function encode
         * @memberof mds.Request
         * @static
         * @param {mds.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lane != null && Object.hasOwnProperty.call(message, "lane"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.lane);
            if (message.program != null && Object.hasOwnProperty.call(message, "program"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.program);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.data);
            if (message.fastpathBatch != null && message.fastpathBatch.length)
                for (var i = 0; i < message.fastpathBatch.length; ++i)
                    $root.mds.FastpathRequest.encode(message.fastpathBatch[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link mds.Request.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.Request
         * @static
         * @param {mds.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @function decode
         * @memberof mds.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.Request();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.lane = reader.uint32();
                    break;
                case 2:
                    message.program = reader.string();
                    break;
                case 3:
                    message.data = reader.string();
                    break;
                case 4:
                    if (!(message.fastpathBatch && message.fastpathBatch.length))
                        message.fastpathBatch = [];
                    message.fastpathBatch.push($root.mds.FastpathRequest.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Request message.
         * @function verify
         * @memberof mds.Request
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Request.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lane != null && message.hasOwnProperty("lane"))
                if (!$util.isInteger(message.lane))
                    return "lane: integer expected";
            if (message.program != null && message.hasOwnProperty("program"))
                if (!$util.isString(message.program))
                    return "program: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            if (message.fastpathBatch != null && message.hasOwnProperty("fastpathBatch")) {
                if (!Array.isArray(message.fastpathBatch))
                    return "fastpathBatch: array expected";
                for (var i = 0; i < message.fastpathBatch.length; ++i) {
                    var error = $root.mds.FastpathRequest.verify(message.fastpathBatch[i]);
                    if (error)
                        return "fastpathBatch." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.Request
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.Request} Request
         */
        Request.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.Request)
                return object;
            var message = new $root.mds.Request();
            if (object.lane != null)
                message.lane = object.lane >>> 0;
            if (object.program != null)
                message.program = String(object.program);
            if (object.data != null)
                message.data = String(object.data);
            if (object.fastpathBatch) {
                if (!Array.isArray(object.fastpathBatch))
                    throw TypeError(".mds.Request.fastpathBatch: array expected");
                message.fastpathBatch = [];
                for (var i = 0; i < object.fastpathBatch.length; ++i) {
                    if (typeof object.fastpathBatch[i] !== "object")
                        throw TypeError(".mds.Request.fastpathBatch: object expected");
                    message.fastpathBatch[i] = $root.mds.FastpathRequest.fromObject(object.fastpathBatch[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.Request
         * @static
         * @param {mds.Request} message Request
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Request.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.fastpathBatch = [];
            if (options.defaults) {
                object.lane = 0;
                object.program = "";
                object.data = "";
            }
            if (message.lane != null && message.hasOwnProperty("lane"))
                object.lane = message.lane;
            if (message.program != null && message.hasOwnProperty("program"))
                object.program = message.program;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            if (message.fastpathBatch && message.fastpathBatch.length) {
                object.fastpathBatch = [];
                for (var j = 0; j < message.fastpathBatch.length; ++j)
                    object.fastpathBatch[j] = $root.mds.FastpathRequest.toObject(message.fastpathBatch[j], options);
            }
            return object;
        };

        /**
         * Converts this Request to JSON.
         * @function toJSON
         * @memberof mds.Request
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Request.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Request;
    })();

    mds.Response = (function() {

        /**
         * Properties of a Response.
         * @memberof mds
         * @interface IResponse
         * @property {number|null} [lane] Response lane
         * @property {mds.IErrorResponse|null} [error] Response error
         * @property {string|null} [output] Response output
         * @property {Array.<mds.IFastpathResponse>|null} [fastpathBatch] Response fastpathBatch
         */

        /**
         * Constructs a new Response.
         * @memberof mds
         * @classdesc Represents a Response.
         * @implements IResponse
         * @constructor
         * @param {mds.IResponse=} [properties] Properties to set
         */
        function Response(properties) {
            this.fastpathBatch = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Response lane.
         * @member {number} lane
         * @memberof mds.Response
         * @instance
         */
        Response.prototype.lane = 0;

        /**
         * Response error.
         * @member {mds.IErrorResponse|null|undefined} error
         * @memberof mds.Response
         * @instance
         */
        Response.prototype.error = null;

        /**
         * Response output.
         * @member {string|null|undefined} output
         * @memberof mds.Response
         * @instance
         */
        Response.prototype.output = null;

        /**
         * Response fastpathBatch.
         * @member {Array.<mds.IFastpathResponse>} fastpathBatch
         * @memberof mds.Response
         * @instance
         */
        Response.prototype.fastpathBatch = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Response body.
         * @member {"error"|"output"|undefined} body
         * @memberof mds.Response
         * @instance
         */
        Object.defineProperty(Response.prototype, "body", {
            get: $util.oneOfGetter($oneOfFields = ["error", "output"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Response instance using the specified properties.
         * @function create
         * @memberof mds.Response
         * @static
         * @param {mds.IResponse=} [properties] Properties to set
         * @returns {mds.Response} Response instance
         */
        Response.create = function create(properties) {
            return new Response(properties);
        };

        /**
         * Encodes the specified Response message. Does not implicitly {@link mds.Response.verify|verify} messages.
         * @function encode
         * @memberof mds.Response
         * @static
         * @param {mds.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lane != null && Object.hasOwnProperty.call(message, "lane"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.lane);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.mds.ErrorResponse.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.output != null && Object.hasOwnProperty.call(message, "output"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.output);
            if (message.fastpathBatch != null && message.fastpathBatch.length)
                for (var i = 0; i < message.fastpathBatch.length; ++i)
                    $root.mds.FastpathResponse.encode(message.fastpathBatch[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link mds.Response.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.Response
         * @static
         * @param {mds.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @function decode
         * @memberof mds.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.Response();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.lane = reader.uint32();
                    break;
                case 2:
                    message.error = $root.mds.ErrorResponse.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.output = reader.string();
                    break;
                case 4:
                    if (!(message.fastpathBatch && message.fastpathBatch.length))
                        message.fastpathBatch = [];
                    message.fastpathBatch.push($root.mds.FastpathResponse.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Response message.
         * @function verify
         * @memberof mds.Response
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Response.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.lane != null && message.hasOwnProperty("lane"))
                if (!$util.isInteger(message.lane))
                    return "lane: integer expected";
            if (message.error != null && message.hasOwnProperty("error")) {
                properties.body = 1;
                {
                    var error = $root.mds.ErrorResponse.verify(message.error);
                    if (error)
                        return "error." + error;
                }
            }
            if (message.output != null && message.hasOwnProperty("output")) {
                if (properties.body === 1)
                    return "body: multiple values";
                properties.body = 1;
                if (!$util.isString(message.output))
                    return "output: string expected";
            }
            if (message.fastpathBatch != null && message.hasOwnProperty("fastpathBatch")) {
                if (!Array.isArray(message.fastpathBatch))
                    return "fastpathBatch: array expected";
                for (var i = 0; i < message.fastpathBatch.length; ++i) {
                    var error = $root.mds.FastpathResponse.verify(message.fastpathBatch[i]);
                    if (error)
                        return "fastpathBatch." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.Response
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.Response} Response
         */
        Response.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.Response)
                return object;
            var message = new $root.mds.Response();
            if (object.lane != null)
                message.lane = object.lane >>> 0;
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".mds.Response.error: object expected");
                message.error = $root.mds.ErrorResponse.fromObject(object.error);
            }
            if (object.output != null)
                message.output = String(object.output);
            if (object.fastpathBatch) {
                if (!Array.isArray(object.fastpathBatch))
                    throw TypeError(".mds.Response.fastpathBatch: array expected");
                message.fastpathBatch = [];
                for (var i = 0; i < object.fastpathBatch.length; ++i) {
                    if (typeof object.fastpathBatch[i] !== "object")
                        throw TypeError(".mds.Response.fastpathBatch: object expected");
                    message.fastpathBatch[i] = $root.mds.FastpathResponse.fromObject(object.fastpathBatch[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.Response
         * @static
         * @param {mds.Response} message Response
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Response.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.fastpathBatch = [];
            if (options.defaults)
                object.lane = 0;
            if (message.lane != null && message.hasOwnProperty("lane"))
                object.lane = message.lane;
            if (message.error != null && message.hasOwnProperty("error")) {
                object.error = $root.mds.ErrorResponse.toObject(message.error, options);
                if (options.oneofs)
                    object.body = "error";
            }
            if (message.output != null && message.hasOwnProperty("output")) {
                object.output = message.output;
                if (options.oneofs)
                    object.body = "output";
            }
            if (message.fastpathBatch && message.fastpathBatch.length) {
                object.fastpathBatch = [];
                for (var j = 0; j < message.fastpathBatch.length; ++j)
                    object.fastpathBatch[j] = $root.mds.FastpathResponse.toObject(message.fastpathBatch[j], options);
            }
            return object;
        };

        /**
         * Converts this Response to JSON.
         * @function toJSON
         * @memberof mds.Response
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Response.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Response;
    })();

    mds.FastpathRequest = (function() {

        /**
         * Properties of a FastpathRequest.
         * @memberof mds
         * @interface IFastpathRequest
         * @property {mds.FastpathRequest.Op|null} [op] FastpathRequest op
         * @property {number|Long|null} [txnId] FastpathRequest txnId
         * @property {boolean|null} [isPrimary] FastpathRequest isPrimary
         * @property {Array.<mds.IKeyValuePair>|null} [kvp] FastpathRequest kvp
         * @property {mds.IFastpathListOptions|null} [listOptions] FastpathRequest listOptions
         */

        /**
         * Constructs a new FastpathRequest.
         * @memberof mds
         * @classdesc Represents a FastpathRequest.
         * @implements IFastpathRequest
         * @constructor
         * @param {mds.IFastpathRequest=} [properties] Properties to set
         */
        function FastpathRequest(properties) {
            this.kvp = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FastpathRequest op.
         * @member {mds.FastpathRequest.Op} op
         * @memberof mds.FastpathRequest
         * @instance
         */
        FastpathRequest.prototype.op = 0;

        /**
         * FastpathRequest txnId.
         * @member {number|Long} txnId
         * @memberof mds.FastpathRequest
         * @instance
         */
        FastpathRequest.prototype.txnId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FastpathRequest isPrimary.
         * @member {boolean} isPrimary
         * @memberof mds.FastpathRequest
         * @instance
         */
        FastpathRequest.prototype.isPrimary = false;

        /**
         * FastpathRequest kvp.
         * @member {Array.<mds.IKeyValuePair>} kvp
         * @memberof mds.FastpathRequest
         * @instance
         */
        FastpathRequest.prototype.kvp = $util.emptyArray;

        /**
         * FastpathRequest listOptions.
         * @member {mds.IFastpathListOptions|null|undefined} listOptions
         * @memberof mds.FastpathRequest
         * @instance
         */
        FastpathRequest.prototype.listOptions = null;

        /**
         * Creates a new FastpathRequest instance using the specified properties.
         * @function create
         * @memberof mds.FastpathRequest
         * @static
         * @param {mds.IFastpathRequest=} [properties] Properties to set
         * @returns {mds.FastpathRequest} FastpathRequest instance
         */
        FastpathRequest.create = function create(properties) {
            return new FastpathRequest(properties);
        };

        /**
         * Encodes the specified FastpathRequest message. Does not implicitly {@link mds.FastpathRequest.verify|verify} messages.
         * @function encode
         * @memberof mds.FastpathRequest
         * @static
         * @param {mds.IFastpathRequest} message FastpathRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FastpathRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.op != null && Object.hasOwnProperty.call(message, "op"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.op);
            if (message.txnId != null && Object.hasOwnProperty.call(message, "txnId"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.txnId);
            if (message.isPrimary != null && Object.hasOwnProperty.call(message, "isPrimary"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isPrimary);
            if (message.kvp != null && message.kvp.length)
                for (var i = 0; i < message.kvp.length; ++i)
                    $root.mds.KeyValuePair.encode(message.kvp[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.listOptions != null && Object.hasOwnProperty.call(message, "listOptions"))
                $root.mds.FastpathListOptions.encode(message.listOptions, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FastpathRequest message, length delimited. Does not implicitly {@link mds.FastpathRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.FastpathRequest
         * @static
         * @param {mds.IFastpathRequest} message FastpathRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FastpathRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FastpathRequest message from the specified reader or buffer.
         * @function decode
         * @memberof mds.FastpathRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.FastpathRequest} FastpathRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FastpathRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.FastpathRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.op = reader.int32();
                    break;
                case 2:
                    message.txnId = reader.uint64();
                    break;
                case 3:
                    message.isPrimary = reader.bool();
                    break;
                case 4:
                    if (!(message.kvp && message.kvp.length))
                        message.kvp = [];
                    message.kvp.push($root.mds.KeyValuePair.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.listOptions = $root.mds.FastpathListOptions.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FastpathRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.FastpathRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.FastpathRequest} FastpathRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FastpathRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FastpathRequest message.
         * @function verify
         * @memberof mds.FastpathRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FastpathRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.op != null && message.hasOwnProperty("op"))
                switch (message.op) {
                default:
                    return "op: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.txnId != null && message.hasOwnProperty("txnId"))
                if (!$util.isInteger(message.txnId) && !(message.txnId && $util.isInteger(message.txnId.low) && $util.isInteger(message.txnId.high)))
                    return "txnId: integer|Long expected";
            if (message.isPrimary != null && message.hasOwnProperty("isPrimary"))
                if (typeof message.isPrimary !== "boolean")
                    return "isPrimary: boolean expected";
            if (message.kvp != null && message.hasOwnProperty("kvp")) {
                if (!Array.isArray(message.kvp))
                    return "kvp: array expected";
                for (var i = 0; i < message.kvp.length; ++i) {
                    var error = $root.mds.KeyValuePair.verify(message.kvp[i]);
                    if (error)
                        return "kvp." + error;
                }
            }
            if (message.listOptions != null && message.hasOwnProperty("listOptions")) {
                var error = $root.mds.FastpathListOptions.verify(message.listOptions);
                if (error)
                    return "listOptions." + error;
            }
            return null;
        };

        /**
         * Creates a FastpathRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.FastpathRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.FastpathRequest} FastpathRequest
         */
        FastpathRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.FastpathRequest)
                return object;
            var message = new $root.mds.FastpathRequest();
            switch (object.op) {
            case "INVALID":
            case 0:
                message.op = 0;
                break;
            case "COMMIT_TXN":
            case 1:
                message.op = 1;
                break;
            case "ABORT_TXN":
            case 2:
                message.op = 2;
                break;
            case "OPEN_TXN":
            case 3:
                message.op = 3;
                break;
            case "GET":
            case 4:
                message.op = 4;
                break;
            case "SET":
            case 5:
                message.op = 5;
                break;
            case "DELETE":
            case 6:
                message.op = 6;
                break;
            case "LIST":
            case 7:
                message.op = 7;
                break;
            }
            if (object.txnId != null)
                if ($util.Long)
                    (message.txnId = $util.Long.fromValue(object.txnId)).unsigned = true;
                else if (typeof object.txnId === "string")
                    message.txnId = parseInt(object.txnId, 10);
                else if (typeof object.txnId === "number")
                    message.txnId = object.txnId;
                else if (typeof object.txnId === "object")
                    message.txnId = new $util.LongBits(object.txnId.low >>> 0, object.txnId.high >>> 0).toNumber(true);
            if (object.isPrimary != null)
                message.isPrimary = Boolean(object.isPrimary);
            if (object.kvp) {
                if (!Array.isArray(object.kvp))
                    throw TypeError(".mds.FastpathRequest.kvp: array expected");
                message.kvp = [];
                for (var i = 0; i < object.kvp.length; ++i) {
                    if (typeof object.kvp[i] !== "object")
                        throw TypeError(".mds.FastpathRequest.kvp: object expected");
                    message.kvp[i] = $root.mds.KeyValuePair.fromObject(object.kvp[i]);
                }
            }
            if (object.listOptions != null) {
                if (typeof object.listOptions !== "object")
                    throw TypeError(".mds.FastpathRequest.listOptions: object expected");
                message.listOptions = $root.mds.FastpathListOptions.fromObject(object.listOptions);
            }
            return message;
        };

        /**
         * Creates a plain object from a FastpathRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.FastpathRequest
         * @static
         * @param {mds.FastpathRequest} message FastpathRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FastpathRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.kvp = [];
            if (options.defaults) {
                object.op = options.enums === String ? "INVALID" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.txnId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.txnId = options.longs === String ? "0" : 0;
                object.isPrimary = false;
                object.listOptions = null;
            }
            if (message.op != null && message.hasOwnProperty("op"))
                object.op = options.enums === String ? $root.mds.FastpathRequest.Op[message.op] : message.op;
            if (message.txnId != null && message.hasOwnProperty("txnId"))
                if (typeof message.txnId === "number")
                    object.txnId = options.longs === String ? String(message.txnId) : message.txnId;
                else
                    object.txnId = options.longs === String ? $util.Long.prototype.toString.call(message.txnId) : options.longs === Number ? new $util.LongBits(message.txnId.low >>> 0, message.txnId.high >>> 0).toNumber(true) : message.txnId;
            if (message.isPrimary != null && message.hasOwnProperty("isPrimary"))
                object.isPrimary = message.isPrimary;
            if (message.kvp && message.kvp.length) {
                object.kvp = [];
                for (var j = 0; j < message.kvp.length; ++j)
                    object.kvp[j] = $root.mds.KeyValuePair.toObject(message.kvp[j], options);
            }
            if (message.listOptions != null && message.hasOwnProperty("listOptions"))
                object.listOptions = $root.mds.FastpathListOptions.toObject(message.listOptions, options);
            return object;
        };

        /**
         * Converts this FastpathRequest to JSON.
         * @function toJSON
         * @memberof mds.FastpathRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FastpathRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Op enum.
         * @name mds.FastpathRequest.Op
         * @enum {number}
         * @property {number} INVALID=0 INVALID value
         * @property {number} COMMIT_TXN=1 COMMIT_TXN value
         * @property {number} ABORT_TXN=2 ABORT_TXN value
         * @property {number} OPEN_TXN=3 OPEN_TXN value
         * @property {number} GET=4 GET value
         * @property {number} SET=5 SET value
         * @property {number} DELETE=6 DELETE value
         * @property {number} LIST=7 LIST value
         */
        FastpathRequest.Op = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "INVALID"] = 0;
            values[valuesById[1] = "COMMIT_TXN"] = 1;
            values[valuesById[2] = "ABORT_TXN"] = 2;
            values[valuesById[3] = "OPEN_TXN"] = 3;
            values[valuesById[4] = "GET"] = 4;
            values[valuesById[5] = "SET"] = 5;
            values[valuesById[6] = "DELETE"] = 6;
            values[valuesById[7] = "LIST"] = 7;
            return values;
        })();

        return FastpathRequest;
    })();

    mds.FastpathListOptions = (function() {

        /**
         * Properties of a FastpathListOptions.
         * @memberof mds
         * @interface IFastpathListOptions
         * @property {number|null} [limit] FastpathListOptions limit
         * @property {boolean|null} [reverse] FastpathListOptions reverse
         * @property {boolean|null} [wantValue] FastpathListOptions wantValue
         */

        /**
         * Constructs a new FastpathListOptions.
         * @memberof mds
         * @classdesc Represents a FastpathListOptions.
         * @implements IFastpathListOptions
         * @constructor
         * @param {mds.IFastpathListOptions=} [properties] Properties to set
         */
        function FastpathListOptions(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FastpathListOptions limit.
         * @member {number} limit
         * @memberof mds.FastpathListOptions
         * @instance
         */
        FastpathListOptions.prototype.limit = 0;

        /**
         * FastpathListOptions reverse.
         * @member {boolean} reverse
         * @memberof mds.FastpathListOptions
         * @instance
         */
        FastpathListOptions.prototype.reverse = false;

        /**
         * FastpathListOptions wantValue.
         * @member {boolean} wantValue
         * @memberof mds.FastpathListOptions
         * @instance
         */
        FastpathListOptions.prototype.wantValue = false;

        /**
         * Creates a new FastpathListOptions instance using the specified properties.
         * @function create
         * @memberof mds.FastpathListOptions
         * @static
         * @param {mds.IFastpathListOptions=} [properties] Properties to set
         * @returns {mds.FastpathListOptions} FastpathListOptions instance
         */
        FastpathListOptions.create = function create(properties) {
            return new FastpathListOptions(properties);
        };

        /**
         * Encodes the specified FastpathListOptions message. Does not implicitly {@link mds.FastpathListOptions.verify|verify} messages.
         * @function encode
         * @memberof mds.FastpathListOptions
         * @static
         * @param {mds.IFastpathListOptions} message FastpathListOptions message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FastpathListOptions.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.limit);
            if (message.reverse != null && Object.hasOwnProperty.call(message, "reverse"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.reverse);
            if (message.wantValue != null && Object.hasOwnProperty.call(message, "wantValue"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.wantValue);
            return writer;
        };

        /**
         * Encodes the specified FastpathListOptions message, length delimited. Does not implicitly {@link mds.FastpathListOptions.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.FastpathListOptions
         * @static
         * @param {mds.IFastpathListOptions} message FastpathListOptions message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FastpathListOptions.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FastpathListOptions message from the specified reader or buffer.
         * @function decode
         * @memberof mds.FastpathListOptions
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.FastpathListOptions} FastpathListOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FastpathListOptions.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.FastpathListOptions();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.limit = reader.uint32();
                    break;
                case 2:
                    message.reverse = reader.bool();
                    break;
                case 3:
                    message.wantValue = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FastpathListOptions message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.FastpathListOptions
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.FastpathListOptions} FastpathListOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FastpathListOptions.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FastpathListOptions message.
         * @function verify
         * @memberof mds.FastpathListOptions
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FastpathListOptions.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.reverse != null && message.hasOwnProperty("reverse"))
                if (typeof message.reverse !== "boolean")
                    return "reverse: boolean expected";
            if (message.wantValue != null && message.hasOwnProperty("wantValue"))
                if (typeof message.wantValue !== "boolean")
                    return "wantValue: boolean expected";
            return null;
        };

        /**
         * Creates a FastpathListOptions message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.FastpathListOptions
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.FastpathListOptions} FastpathListOptions
         */
        FastpathListOptions.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.FastpathListOptions)
                return object;
            var message = new $root.mds.FastpathListOptions();
            if (object.limit != null)
                message.limit = object.limit >>> 0;
            if (object.reverse != null)
                message.reverse = Boolean(object.reverse);
            if (object.wantValue != null)
                message.wantValue = Boolean(object.wantValue);
            return message;
        };

        /**
         * Creates a plain object from a FastpathListOptions message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.FastpathListOptions
         * @static
         * @param {mds.FastpathListOptions} message FastpathListOptions
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FastpathListOptions.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.limit = 0;
                object.reverse = false;
                object.wantValue = false;
            }
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            if (message.reverse != null && message.hasOwnProperty("reverse"))
                object.reverse = message.reverse;
            if (message.wantValue != null && message.hasOwnProperty("wantValue"))
                object.wantValue = message.wantValue;
            return object;
        };

        /**
         * Converts this FastpathListOptions to JSON.
         * @function toJSON
         * @memberof mds.FastpathListOptions
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FastpathListOptions.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FastpathListOptions;
    })();

    mds.FastpathResponse = (function() {

        /**
         * Properties of a FastpathResponse.
         * @memberof mds
         * @interface IFastpathResponse
         * @property {number|Long|null} [txnId] FastpathResponse txnId
         * @property {mds.IErrorResponse|null} [error] FastpathResponse error
         * @property {Array.<mds.IKeyValuePair>|null} [kvp] FastpathResponse kvp
         */

        /**
         * Constructs a new FastpathResponse.
         * @memberof mds
         * @classdesc Represents a FastpathResponse.
         * @implements IFastpathResponse
         * @constructor
         * @param {mds.IFastpathResponse=} [properties] Properties to set
         */
        function FastpathResponse(properties) {
            this.kvp = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FastpathResponse txnId.
         * @member {number|Long} txnId
         * @memberof mds.FastpathResponse
         * @instance
         */
        FastpathResponse.prototype.txnId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FastpathResponse error.
         * @member {mds.IErrorResponse|null|undefined} error
         * @memberof mds.FastpathResponse
         * @instance
         */
        FastpathResponse.prototype.error = null;

        /**
         * FastpathResponse kvp.
         * @member {Array.<mds.IKeyValuePair>} kvp
         * @memberof mds.FastpathResponse
         * @instance
         */
        FastpathResponse.prototype.kvp = $util.emptyArray;

        /**
         * Creates a new FastpathResponse instance using the specified properties.
         * @function create
         * @memberof mds.FastpathResponse
         * @static
         * @param {mds.IFastpathResponse=} [properties] Properties to set
         * @returns {mds.FastpathResponse} FastpathResponse instance
         */
        FastpathResponse.create = function create(properties) {
            return new FastpathResponse(properties);
        };

        /**
         * Encodes the specified FastpathResponse message. Does not implicitly {@link mds.FastpathResponse.verify|verify} messages.
         * @function encode
         * @memberof mds.FastpathResponse
         * @static
         * @param {mds.IFastpathResponse} message FastpathResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FastpathResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.txnId != null && Object.hasOwnProperty.call(message, "txnId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.txnId);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.mds.ErrorResponse.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.kvp != null && message.kvp.length)
                for (var i = 0; i < message.kvp.length; ++i)
                    $root.mds.KeyValuePair.encode(message.kvp[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FastpathResponse message, length delimited. Does not implicitly {@link mds.FastpathResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.FastpathResponse
         * @static
         * @param {mds.IFastpathResponse} message FastpathResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FastpathResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FastpathResponse message from the specified reader or buffer.
         * @function decode
         * @memberof mds.FastpathResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.FastpathResponse} FastpathResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FastpathResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.FastpathResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.txnId = reader.uint64();
                    break;
                case 2:
                    message.error = $root.mds.ErrorResponse.decode(reader, reader.uint32());
                    break;
                case 3:
                    if (!(message.kvp && message.kvp.length))
                        message.kvp = [];
                    message.kvp.push($root.mds.KeyValuePair.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FastpathResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.FastpathResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.FastpathResponse} FastpathResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FastpathResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FastpathResponse message.
         * @function verify
         * @memberof mds.FastpathResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FastpathResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.txnId != null && message.hasOwnProperty("txnId"))
                if (!$util.isInteger(message.txnId) && !(message.txnId && $util.isInteger(message.txnId.low) && $util.isInteger(message.txnId.high)))
                    return "txnId: integer|Long expected";
            if (message.error != null && message.hasOwnProperty("error")) {
                var error = $root.mds.ErrorResponse.verify(message.error);
                if (error)
                    return "error." + error;
            }
            if (message.kvp != null && message.hasOwnProperty("kvp")) {
                if (!Array.isArray(message.kvp))
                    return "kvp: array expected";
                for (var i = 0; i < message.kvp.length; ++i) {
                    var error = $root.mds.KeyValuePair.verify(message.kvp[i]);
                    if (error)
                        return "kvp." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FastpathResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.FastpathResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.FastpathResponse} FastpathResponse
         */
        FastpathResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.FastpathResponse)
                return object;
            var message = new $root.mds.FastpathResponse();
            if (object.txnId != null)
                if ($util.Long)
                    (message.txnId = $util.Long.fromValue(object.txnId)).unsigned = true;
                else if (typeof object.txnId === "string")
                    message.txnId = parseInt(object.txnId, 10);
                else if (typeof object.txnId === "number")
                    message.txnId = object.txnId;
                else if (typeof object.txnId === "object")
                    message.txnId = new $util.LongBits(object.txnId.low >>> 0, object.txnId.high >>> 0).toNumber(true);
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".mds.FastpathResponse.error: object expected");
                message.error = $root.mds.ErrorResponse.fromObject(object.error);
            }
            if (object.kvp) {
                if (!Array.isArray(object.kvp))
                    throw TypeError(".mds.FastpathResponse.kvp: array expected");
                message.kvp = [];
                for (var i = 0; i < object.kvp.length; ++i) {
                    if (typeof object.kvp[i] !== "object")
                        throw TypeError(".mds.FastpathResponse.kvp: object expected");
                    message.kvp[i] = $root.mds.KeyValuePair.fromObject(object.kvp[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a FastpathResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.FastpathResponse
         * @static
         * @param {mds.FastpathResponse} message FastpathResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FastpathResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.kvp = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.txnId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.txnId = options.longs === String ? "0" : 0;
                object.error = null;
            }
            if (message.txnId != null && message.hasOwnProperty("txnId"))
                if (typeof message.txnId === "number")
                    object.txnId = options.longs === String ? String(message.txnId) : message.txnId;
                else
                    object.txnId = options.longs === String ? $util.Long.prototype.toString.call(message.txnId) : options.longs === Number ? new $util.LongBits(message.txnId.low >>> 0, message.txnId.high >>> 0).toNumber(true) : message.txnId;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = $root.mds.ErrorResponse.toObject(message.error, options);
            if (message.kvp && message.kvp.length) {
                object.kvp = [];
                for (var j = 0; j < message.kvp.length; ++j)
                    object.kvp[j] = $root.mds.KeyValuePair.toObject(message.kvp[j], options);
            }
            return object;
        };

        /**
         * Converts this FastpathResponse to JSON.
         * @function toJSON
         * @memberof mds.FastpathResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FastpathResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FastpathResponse;
    })();

    mds.KeyValuePair = (function() {

        /**
         * Properties of a KeyValuePair.
         * @memberof mds
         * @interface IKeyValuePair
         * @property {Uint8Array|null} [key] KeyValuePair key
         * @property {Uint8Array|null} [value] KeyValuePair value
         */

        /**
         * Constructs a new KeyValuePair.
         * @memberof mds
         * @classdesc Represents a KeyValuePair.
         * @implements IKeyValuePair
         * @constructor
         * @param {mds.IKeyValuePair=} [properties] Properties to set
         */
        function KeyValuePair(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyValuePair key.
         * @member {Uint8Array} key
         * @memberof mds.KeyValuePair
         * @instance
         */
        KeyValuePair.prototype.key = $util.newBuffer([]);

        /**
         * KeyValuePair value.
         * @member {Uint8Array} value
         * @memberof mds.KeyValuePair
         * @instance
         */
        KeyValuePair.prototype.value = $util.newBuffer([]);

        /**
         * Creates a new KeyValuePair instance using the specified properties.
         * @function create
         * @memberof mds.KeyValuePair
         * @static
         * @param {mds.IKeyValuePair=} [properties] Properties to set
         * @returns {mds.KeyValuePair} KeyValuePair instance
         */
        KeyValuePair.create = function create(properties) {
            return new KeyValuePair(properties);
        };

        /**
         * Encodes the specified KeyValuePair message. Does not implicitly {@link mds.KeyValuePair.verify|verify} messages.
         * @function encode
         * @memberof mds.KeyValuePair
         * @static
         * @param {mds.IKeyValuePair} message KeyValuePair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyValuePair.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
            return writer;
        };

        /**
         * Encodes the specified KeyValuePair message, length delimited. Does not implicitly {@link mds.KeyValuePair.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.KeyValuePair
         * @static
         * @param {mds.IKeyValuePair} message KeyValuePair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyValuePair.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyValuePair message from the specified reader or buffer.
         * @function decode
         * @memberof mds.KeyValuePair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.KeyValuePair} KeyValuePair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyValuePair.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.KeyValuePair();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                case 2:
                    message.value = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a KeyValuePair message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.KeyValuePair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.KeyValuePair} KeyValuePair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyValuePair.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyValuePair message.
         * @function verify
         * @memberof mds.KeyValuePair
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyValuePair.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                    return "key: buffer expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                    return "value: buffer expected";
            return null;
        };

        /**
         * Creates a KeyValuePair message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.KeyValuePair
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.KeyValuePair} KeyValuePair
         */
        KeyValuePair.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.KeyValuePair)
                return object;
            var message = new $root.mds.KeyValuePair();
            if (object.key != null)
                if (typeof object.key === "string")
                    $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                else if (object.key.length)
                    message.key = object.key;
            if (object.value != null)
                if (typeof object.value === "string")
                    $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                else if (object.value.length)
                    message.value = object.value;
            return message;
        };

        /**
         * Creates a plain object from a KeyValuePair message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.KeyValuePair
         * @static
         * @param {mds.KeyValuePair} message KeyValuePair
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyValuePair.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.key = "";
                else {
                    object.key = [];
                    if (options.bytes !== Array)
                        object.key = $util.newBuffer(object.key);
                }
                if (options.bytes === String)
                    object.value = "";
                else {
                    object.value = [];
                    if (options.bytes !== Array)
                        object.value = $util.newBuffer(object.value);
                }
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
            return object;
        };

        /**
         * Converts this KeyValuePair to JSON.
         * @function toJSON
         * @memberof mds.KeyValuePair
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyValuePair.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyValuePair;
    })();

    mds.StoreInfo = (function() {

        /**
         * Properties of a StoreInfo.
         * @memberof mds
         * @interface IStoreInfo
         * @property {string|null} [cluster] StoreInfo cluster
         * @property {string|null} [subspace] StoreInfo subspace
         */

        /**
         * Constructs a new StoreInfo.
         * @memberof mds
         * @classdesc Represents a StoreInfo.
         * @implements IStoreInfo
         * @constructor
         * @param {mds.IStoreInfo=} [properties] Properties to set
         */
        function StoreInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StoreInfo cluster.
         * @member {string} cluster
         * @memberof mds.StoreInfo
         * @instance
         */
        StoreInfo.prototype.cluster = "";

        /**
         * StoreInfo subspace.
         * @member {string} subspace
         * @memberof mds.StoreInfo
         * @instance
         */
        StoreInfo.prototype.subspace = "";

        /**
         * Creates a new StoreInfo instance using the specified properties.
         * @function create
         * @memberof mds.StoreInfo
         * @static
         * @param {mds.IStoreInfo=} [properties] Properties to set
         * @returns {mds.StoreInfo} StoreInfo instance
         */
        StoreInfo.create = function create(properties) {
            return new StoreInfo(properties);
        };

        /**
         * Encodes the specified StoreInfo message. Does not implicitly {@link mds.StoreInfo.verify|verify} messages.
         * @function encode
         * @memberof mds.StoreInfo
         * @static
         * @param {mds.IStoreInfo} message StoreInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StoreInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cluster != null && Object.hasOwnProperty.call(message, "cluster"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cluster);
            if (message.subspace != null && Object.hasOwnProperty.call(message, "subspace"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.subspace);
            return writer;
        };

        /**
         * Encodes the specified StoreInfo message, length delimited. Does not implicitly {@link mds.StoreInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.StoreInfo
         * @static
         * @param {mds.IStoreInfo} message StoreInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StoreInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StoreInfo message from the specified reader or buffer.
         * @function decode
         * @memberof mds.StoreInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.StoreInfo} StoreInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StoreInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.StoreInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cluster = reader.string();
                    break;
                case 2:
                    message.subspace = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StoreInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.StoreInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.StoreInfo} StoreInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StoreInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StoreInfo message.
         * @function verify
         * @memberof mds.StoreInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StoreInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cluster != null && message.hasOwnProperty("cluster"))
                if (!$util.isString(message.cluster))
                    return "cluster: string expected";
            if (message.subspace != null && message.hasOwnProperty("subspace"))
                if (!$util.isString(message.subspace))
                    return "subspace: string expected";
            return null;
        };

        /**
         * Creates a StoreInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.StoreInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.StoreInfo} StoreInfo
         */
        StoreInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.StoreInfo)
                return object;
            var message = new $root.mds.StoreInfo();
            if (object.cluster != null)
                message.cluster = String(object.cluster);
            if (object.subspace != null)
                message.subspace = String(object.subspace);
            return message;
        };

        /**
         * Creates a plain object from a StoreInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.StoreInfo
         * @static
         * @param {mds.StoreInfo} message StoreInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StoreInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cluster = "";
                object.subspace = "";
            }
            if (message.cluster != null && message.hasOwnProperty("cluster"))
                object.cluster = message.cluster;
            if (message.subspace != null && message.hasOwnProperty("subspace"))
                object.subspace = message.subspace;
            return object;
        };

        /**
         * Converts this StoreInfo to JSON.
         * @function toJSON
         * @memberof mds.StoreInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StoreInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StoreInfo;
    })();

    mds.ErrorResponse = (function() {

        /**
         * Properties of an ErrorResponse.
         * @memberof mds
         * @interface IErrorResponse
         * @property {string|null} [description] ErrorResponse description
         * @property {boolean|null} [retryable] ErrorResponse retryable
         */

        /**
         * Constructs a new ErrorResponse.
         * @memberof mds
         * @classdesc Represents an ErrorResponse.
         * @implements IErrorResponse
         * @constructor
         * @param {mds.IErrorResponse=} [properties] Properties to set
         */
        function ErrorResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorResponse description.
         * @member {string} description
         * @memberof mds.ErrorResponse
         * @instance
         */
        ErrorResponse.prototype.description = "";

        /**
         * ErrorResponse retryable.
         * @member {boolean} retryable
         * @memberof mds.ErrorResponse
         * @instance
         */
        ErrorResponse.prototype.retryable = false;

        /**
         * Creates a new ErrorResponse instance using the specified properties.
         * @function create
         * @memberof mds.ErrorResponse
         * @static
         * @param {mds.IErrorResponse=} [properties] Properties to set
         * @returns {mds.ErrorResponse} ErrorResponse instance
         */
        ErrorResponse.create = function create(properties) {
            return new ErrorResponse(properties);
        };

        /**
         * Encodes the specified ErrorResponse message. Does not implicitly {@link mds.ErrorResponse.verify|verify} messages.
         * @function encode
         * @memberof mds.ErrorResponse
         * @static
         * @param {mds.IErrorResponse} message ErrorResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.description);
            if (message.retryable != null && Object.hasOwnProperty.call(message, "retryable"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.retryable);
            return writer;
        };

        /**
         * Encodes the specified ErrorResponse message, length delimited. Does not implicitly {@link mds.ErrorResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.ErrorResponse
         * @static
         * @param {mds.IErrorResponse} message ErrorResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer.
         * @function decode
         * @memberof mds.ErrorResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.ErrorResponse} ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.ErrorResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.description = reader.string();
                    break;
                case 2:
                    message.retryable = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.ErrorResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.ErrorResponse} ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorResponse message.
         * @function verify
         * @memberof mds.ErrorResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.retryable != null && message.hasOwnProperty("retryable"))
                if (typeof message.retryable !== "boolean")
                    return "retryable: boolean expected";
            return null;
        };

        /**
         * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.ErrorResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.ErrorResponse} ErrorResponse
         */
        ErrorResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.ErrorResponse)
                return object;
            var message = new $root.mds.ErrorResponse();
            if (object.description != null)
                message.description = String(object.description);
            if (object.retryable != null)
                message.retryable = Boolean(object.retryable);
            return message;
        };

        /**
         * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.ErrorResponse
         * @static
         * @param {mds.ErrorResponse} message ErrorResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.description = "";
                object.retryable = false;
            }
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.retryable != null && message.hasOwnProperty("retryable"))
                object.retryable = message.retryable;
            return object;
        };

        /**
         * Converts this ErrorResponse to JSON.
         * @function toJSON
         * @memberof mds.ErrorResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ErrorResponse;
    })();

    mds.Cluster = (function() {

        /**
         * Properties of a Cluster.
         * @memberof mds
         * @interface ICluster
         * @property {mds.IClusterRegion|null} [primary] Cluster primary
         * @property {Array.<mds.IClusterRegion>|null} [replicas] Cluster replicas
         */

        /**
         * Constructs a new Cluster.
         * @memberof mds
         * @classdesc Represents a Cluster.
         * @implements ICluster
         * @constructor
         * @param {mds.ICluster=} [properties] Properties to set
         */
        function Cluster(properties) {
            this.replicas = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Cluster primary.
         * @member {mds.IClusterRegion|null|undefined} primary
         * @memberof mds.Cluster
         * @instance
         */
        Cluster.prototype.primary = null;

        /**
         * Cluster replicas.
         * @member {Array.<mds.IClusterRegion>} replicas
         * @memberof mds.Cluster
         * @instance
         */
        Cluster.prototype.replicas = $util.emptyArray;

        /**
         * Creates a new Cluster instance using the specified properties.
         * @function create
         * @memberof mds.Cluster
         * @static
         * @param {mds.ICluster=} [properties] Properties to set
         * @returns {mds.Cluster} Cluster instance
         */
        Cluster.create = function create(properties) {
            return new Cluster(properties);
        };

        /**
         * Encodes the specified Cluster message. Does not implicitly {@link mds.Cluster.verify|verify} messages.
         * @function encode
         * @memberof mds.Cluster
         * @static
         * @param {mds.ICluster} message Cluster message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cluster.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.primary != null && Object.hasOwnProperty.call(message, "primary"))
                $root.mds.ClusterRegion.encode(message.primary, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.replicas != null && message.replicas.length)
                for (var i = 0; i < message.replicas.length; ++i)
                    $root.mds.ClusterRegion.encode(message.replicas[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Cluster message, length delimited. Does not implicitly {@link mds.Cluster.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.Cluster
         * @static
         * @param {mds.ICluster} message Cluster message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cluster.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Cluster message from the specified reader or buffer.
         * @function decode
         * @memberof mds.Cluster
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.Cluster} Cluster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cluster.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.Cluster();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.primary = $root.mds.ClusterRegion.decode(reader, reader.uint32());
                    break;
                case 2:
                    if (!(message.replicas && message.replicas.length))
                        message.replicas = [];
                    message.replicas.push($root.mds.ClusterRegion.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Cluster message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.Cluster
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.Cluster} Cluster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cluster.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Cluster message.
         * @function verify
         * @memberof mds.Cluster
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Cluster.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.primary != null && message.hasOwnProperty("primary")) {
                var error = $root.mds.ClusterRegion.verify(message.primary);
                if (error)
                    return "primary." + error;
            }
            if (message.replicas != null && message.hasOwnProperty("replicas")) {
                if (!Array.isArray(message.replicas))
                    return "replicas: array expected";
                for (var i = 0; i < message.replicas.length; ++i) {
                    var error = $root.mds.ClusterRegion.verify(message.replicas[i]);
                    if (error)
                        return "replicas." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Cluster message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.Cluster
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.Cluster} Cluster
         */
        Cluster.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.Cluster)
                return object;
            var message = new $root.mds.Cluster();
            if (object.primary != null) {
                if (typeof object.primary !== "object")
                    throw TypeError(".mds.Cluster.primary: object expected");
                message.primary = $root.mds.ClusterRegion.fromObject(object.primary);
            }
            if (object.replicas) {
                if (!Array.isArray(object.replicas))
                    throw TypeError(".mds.Cluster.replicas: array expected");
                message.replicas = [];
                for (var i = 0; i < object.replicas.length; ++i) {
                    if (typeof object.replicas[i] !== "object")
                        throw TypeError(".mds.Cluster.replicas: object expected");
                    message.replicas[i] = $root.mds.ClusterRegion.fromObject(object.replicas[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Cluster message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.Cluster
         * @static
         * @param {mds.Cluster} message Cluster
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Cluster.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.replicas = [];
            if (options.defaults)
                object.primary = null;
            if (message.primary != null && message.hasOwnProperty("primary"))
                object.primary = $root.mds.ClusterRegion.toObject(message.primary, options);
            if (message.replicas && message.replicas.length) {
                object.replicas = [];
                for (var j = 0; j < message.replicas.length; ++j)
                    object.replicas[j] = $root.mds.ClusterRegion.toObject(message.replicas[j], options);
            }
            return object;
        };

        /**
         * Converts this Cluster to JSON.
         * @function toJSON
         * @memberof mds.Cluster
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Cluster.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Cluster;
    })();

    mds.ClusterRegion = (function() {

        /**
         * Properties of a ClusterRegion.
         * @memberof mds
         * @interface IClusterRegion
         * @property {string|null} [region] ClusterRegion region
         * @property {string|null} [config] ClusterRegion config
         */

        /**
         * Constructs a new ClusterRegion.
         * @memberof mds
         * @classdesc Represents a ClusterRegion.
         * @implements IClusterRegion
         * @constructor
         * @param {mds.IClusterRegion=} [properties] Properties to set
         */
        function ClusterRegion(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClusterRegion region.
         * @member {string} region
         * @memberof mds.ClusterRegion
         * @instance
         */
        ClusterRegion.prototype.region = "";

        /**
         * ClusterRegion config.
         * @member {string} config
         * @memberof mds.ClusterRegion
         * @instance
         */
        ClusterRegion.prototype.config = "";

        /**
         * Creates a new ClusterRegion instance using the specified properties.
         * @function create
         * @memberof mds.ClusterRegion
         * @static
         * @param {mds.IClusterRegion=} [properties] Properties to set
         * @returns {mds.ClusterRegion} ClusterRegion instance
         */
        ClusterRegion.create = function create(properties) {
            return new ClusterRegion(properties);
        };

        /**
         * Encodes the specified ClusterRegion message. Does not implicitly {@link mds.ClusterRegion.verify|verify} messages.
         * @function encode
         * @memberof mds.ClusterRegion
         * @static
         * @param {mds.IClusterRegion} message ClusterRegion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClusterRegion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.region);
            if (message.config != null && Object.hasOwnProperty.call(message, "config"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.config);
            return writer;
        };

        /**
         * Encodes the specified ClusterRegion message, length delimited. Does not implicitly {@link mds.ClusterRegion.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.ClusterRegion
         * @static
         * @param {mds.IClusterRegion} message ClusterRegion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClusterRegion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClusterRegion message from the specified reader or buffer.
         * @function decode
         * @memberof mds.ClusterRegion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.ClusterRegion} ClusterRegion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClusterRegion.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.ClusterRegion();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.region = reader.string();
                    break;
                case 2:
                    message.config = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ClusterRegion message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.ClusterRegion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.ClusterRegion} ClusterRegion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClusterRegion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClusterRegion message.
         * @function verify
         * @memberof mds.ClusterRegion
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClusterRegion.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.region != null && message.hasOwnProperty("region"))
                if (!$util.isString(message.region))
                    return "region: string expected";
            if (message.config != null && message.hasOwnProperty("config"))
                if (!$util.isString(message.config))
                    return "config: string expected";
            return null;
        };

        /**
         * Creates a ClusterRegion message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.ClusterRegion
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.ClusterRegion} ClusterRegion
         */
        ClusterRegion.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.ClusterRegion)
                return object;
            var message = new $root.mds.ClusterRegion();
            if (object.region != null)
                message.region = String(object.region);
            if (object.config != null)
                message.config = String(object.config);
            return message;
        };

        /**
         * Creates a plain object from a ClusterRegion message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.ClusterRegion
         * @static
         * @param {mds.ClusterRegion} message ClusterRegion
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClusterRegion.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.region = "";
                object.config = "";
            }
            if (message.region != null && message.hasOwnProperty("region"))
                object.region = message.region;
            if (message.config != null && message.hasOwnProperty("config"))
                object.config = message.config;
            return object;
        };

        /**
         * Converts this ClusterRegion to JSON.
         * @function toJSON
         * @memberof mds.ClusterRegion
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClusterRegion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ClusterRegion;
    })();

    mds.UserRoleList = (function() {

        /**
         * Properties of a UserRoleList.
         * @memberof mds
         * @interface IUserRoleList
         * @property {Array.<string>|null} [roles] UserRoleList roles
         */

        /**
         * Constructs a new UserRoleList.
         * @memberof mds
         * @classdesc Represents a UserRoleList.
         * @implements IUserRoleList
         * @constructor
         * @param {mds.IUserRoleList=} [properties] Properties to set
         */
        function UserRoleList(properties) {
            this.roles = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserRoleList roles.
         * @member {Array.<string>} roles
         * @memberof mds.UserRoleList
         * @instance
         */
        UserRoleList.prototype.roles = $util.emptyArray;

        /**
         * Creates a new UserRoleList instance using the specified properties.
         * @function create
         * @memberof mds.UserRoleList
         * @static
         * @param {mds.IUserRoleList=} [properties] Properties to set
         * @returns {mds.UserRoleList} UserRoleList instance
         */
        UserRoleList.create = function create(properties) {
            return new UserRoleList(properties);
        };

        /**
         * Encodes the specified UserRoleList message. Does not implicitly {@link mds.UserRoleList.verify|verify} messages.
         * @function encode
         * @memberof mds.UserRoleList
         * @static
         * @param {mds.IUserRoleList} message UserRoleList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserRoleList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roles != null && message.roles.length)
                for (var i = 0; i < message.roles.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roles[i]);
            return writer;
        };

        /**
         * Encodes the specified UserRoleList message, length delimited. Does not implicitly {@link mds.UserRoleList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.UserRoleList
         * @static
         * @param {mds.IUserRoleList} message UserRoleList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserRoleList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserRoleList message from the specified reader or buffer.
         * @function decode
         * @memberof mds.UserRoleList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.UserRoleList} UserRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserRoleList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.UserRoleList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.roles && message.roles.length))
                        message.roles = [];
                    message.roles.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserRoleList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.UserRoleList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.UserRoleList} UserRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserRoleList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserRoleList message.
         * @function verify
         * @memberof mds.UserRoleList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserRoleList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roles != null && message.hasOwnProperty("roles")) {
                if (!Array.isArray(message.roles))
                    return "roles: array expected";
                for (var i = 0; i < message.roles.length; ++i)
                    if (!$util.isString(message.roles[i]))
                        return "roles: string[] expected";
            }
            return null;
        };

        /**
         * Creates a UserRoleList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.UserRoleList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.UserRoleList} UserRoleList
         */
        UserRoleList.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.UserRoleList)
                return object;
            var message = new $root.mds.UserRoleList();
            if (object.roles) {
                if (!Array.isArray(object.roles))
                    throw TypeError(".mds.UserRoleList.roles: array expected");
                message.roles = [];
                for (var i = 0; i < object.roles.length; ++i)
                    message.roles[i] = String(object.roles[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a UserRoleList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.UserRoleList
         * @static
         * @param {mds.UserRoleList} message UserRoleList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserRoleList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.roles = [];
            if (message.roles && message.roles.length) {
                object.roles = [];
                for (var j = 0; j < message.roles.length; ++j)
                    object.roles[j] = message.roles[j];
            }
            return object;
        };

        /**
         * Converts this UserRoleList to JSON.
         * @function toJSON
         * @memberof mds.UserRoleList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserRoleList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserRoleList;
    })();

    mds.StoreRoleList = (function() {

        /**
         * Properties of a StoreRoleList.
         * @memberof mds
         * @interface IStoreRoleList
         * @property {Array.<string>|null} [roles] StoreRoleList roles
         * @property {Array.<string>|null} [readonlyRoles] StoreRoleList readonlyRoles
         */

        /**
         * Constructs a new StoreRoleList.
         * @memberof mds
         * @classdesc Represents a StoreRoleList.
         * @implements IStoreRoleList
         * @constructor
         * @param {mds.IStoreRoleList=} [properties] Properties to set
         */
        function StoreRoleList(properties) {
            this.roles = [];
            this.readonlyRoles = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StoreRoleList roles.
         * @member {Array.<string>} roles
         * @memberof mds.StoreRoleList
         * @instance
         */
        StoreRoleList.prototype.roles = $util.emptyArray;

        /**
         * StoreRoleList readonlyRoles.
         * @member {Array.<string>} readonlyRoles
         * @memberof mds.StoreRoleList
         * @instance
         */
        StoreRoleList.prototype.readonlyRoles = $util.emptyArray;

        /**
         * Creates a new StoreRoleList instance using the specified properties.
         * @function create
         * @memberof mds.StoreRoleList
         * @static
         * @param {mds.IStoreRoleList=} [properties] Properties to set
         * @returns {mds.StoreRoleList} StoreRoleList instance
         */
        StoreRoleList.create = function create(properties) {
            return new StoreRoleList(properties);
        };

        /**
         * Encodes the specified StoreRoleList message. Does not implicitly {@link mds.StoreRoleList.verify|verify} messages.
         * @function encode
         * @memberof mds.StoreRoleList
         * @static
         * @param {mds.IStoreRoleList} message StoreRoleList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StoreRoleList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roles != null && message.roles.length)
                for (var i = 0; i < message.roles.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roles[i]);
            if (message.readonlyRoles != null && message.readonlyRoles.length)
                for (var i = 0; i < message.readonlyRoles.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.readonlyRoles[i]);
            return writer;
        };

        /**
         * Encodes the specified StoreRoleList message, length delimited. Does not implicitly {@link mds.StoreRoleList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.StoreRoleList
         * @static
         * @param {mds.IStoreRoleList} message StoreRoleList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StoreRoleList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StoreRoleList message from the specified reader or buffer.
         * @function decode
         * @memberof mds.StoreRoleList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.StoreRoleList} StoreRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StoreRoleList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.StoreRoleList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.roles && message.roles.length))
                        message.roles = [];
                    message.roles.push(reader.string());
                    break;
                case 2:
                    if (!(message.readonlyRoles && message.readonlyRoles.length))
                        message.readonlyRoles = [];
                    message.readonlyRoles.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StoreRoleList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.StoreRoleList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.StoreRoleList} StoreRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StoreRoleList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StoreRoleList message.
         * @function verify
         * @memberof mds.StoreRoleList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StoreRoleList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roles != null && message.hasOwnProperty("roles")) {
                if (!Array.isArray(message.roles))
                    return "roles: array expected";
                for (var i = 0; i < message.roles.length; ++i)
                    if (!$util.isString(message.roles[i]))
                        return "roles: string[] expected";
            }
            if (message.readonlyRoles != null && message.hasOwnProperty("readonlyRoles")) {
                if (!Array.isArray(message.readonlyRoles))
                    return "readonlyRoles: array expected";
                for (var i = 0; i < message.readonlyRoles.length; ++i)
                    if (!$util.isString(message.readonlyRoles[i]))
                        return "readonlyRoles: string[] expected";
            }
            return null;
        };

        /**
         * Creates a StoreRoleList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.StoreRoleList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.StoreRoleList} StoreRoleList
         */
        StoreRoleList.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.StoreRoleList)
                return object;
            var message = new $root.mds.StoreRoleList();
            if (object.roles) {
                if (!Array.isArray(object.roles))
                    throw TypeError(".mds.StoreRoleList.roles: array expected");
                message.roles = [];
                for (var i = 0; i < object.roles.length; ++i)
                    message.roles[i] = String(object.roles[i]);
            }
            if (object.readonlyRoles) {
                if (!Array.isArray(object.readonlyRoles))
                    throw TypeError(".mds.StoreRoleList.readonlyRoles: array expected");
                message.readonlyRoles = [];
                for (var i = 0; i < object.readonlyRoles.length; ++i)
                    message.readonlyRoles[i] = String(object.readonlyRoles[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a StoreRoleList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.StoreRoleList
         * @static
         * @param {mds.StoreRoleList} message StoreRoleList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StoreRoleList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.roles = [];
                object.readonlyRoles = [];
            }
            if (message.roles && message.roles.length) {
                object.roles = [];
                for (var j = 0; j < message.roles.length; ++j)
                    object.roles[j] = message.roles[j];
            }
            if (message.readonlyRoles && message.readonlyRoles.length) {
                object.readonlyRoles = [];
                for (var j = 0; j < message.readonlyRoles.length; ++j)
                    object.readonlyRoles[j] = message.readonlyRoles[j];
            }
            return object;
        };

        /**
         * Converts this StoreRoleList to JSON.
         * @function toJSON
         * @memberof mds.StoreRoleList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StoreRoleList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StoreRoleList;
    })();

    return mds;
})();

module.exports = $root;
