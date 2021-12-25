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
            }
            if (message.ok != null && message.hasOwnProperty("ok"))
                object.ok = message.ok;
            if (message.region != null && message.hasOwnProperty("region"))
                object.region = message.region;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
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

    mds.RoleList = (function() {

        /**
         * Properties of a RoleList.
         * @memberof mds
         * @interface IRoleList
         * @property {Array.<string>|null} [roles] RoleList roles
         */

        /**
         * Constructs a new RoleList.
         * @memberof mds
         * @classdesc Represents a RoleList.
         * @implements IRoleList
         * @constructor
         * @param {mds.IRoleList=} [properties] Properties to set
         */
        function RoleList(properties) {
            this.roles = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoleList roles.
         * @member {Array.<string>} roles
         * @memberof mds.RoleList
         * @instance
         */
        RoleList.prototype.roles = $util.emptyArray;

        /**
         * Creates a new RoleList instance using the specified properties.
         * @function create
         * @memberof mds.RoleList
         * @static
         * @param {mds.IRoleList=} [properties] Properties to set
         * @returns {mds.RoleList} RoleList instance
         */
        RoleList.create = function create(properties) {
            return new RoleList(properties);
        };

        /**
         * Encodes the specified RoleList message. Does not implicitly {@link mds.RoleList.verify|verify} messages.
         * @function encode
         * @memberof mds.RoleList
         * @static
         * @param {mds.IRoleList} message RoleList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoleList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roles != null && message.roles.length)
                for (var i = 0; i < message.roles.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roles[i]);
            return writer;
        };

        /**
         * Encodes the specified RoleList message, length delimited. Does not implicitly {@link mds.RoleList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof mds.RoleList
         * @static
         * @param {mds.IRoleList} message RoleList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoleList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoleList message from the specified reader or buffer.
         * @function decode
         * @memberof mds.RoleList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {mds.RoleList} RoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoleList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mds.RoleList();
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
         * Decodes a RoleList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof mds.RoleList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {mds.RoleList} RoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoleList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoleList message.
         * @function verify
         * @memberof mds.RoleList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoleList.verify = function verify(message) {
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
         * Creates a RoleList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof mds.RoleList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {mds.RoleList} RoleList
         */
        RoleList.fromObject = function fromObject(object) {
            if (object instanceof $root.mds.RoleList)
                return object;
            var message = new $root.mds.RoleList();
            if (object.roles) {
                if (!Array.isArray(object.roles))
                    throw TypeError(".mds.RoleList.roles: array expected");
                message.roles = [];
                for (var i = 0; i < object.roles.length; ++i)
                    message.roles[i] = String(object.roles[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a RoleList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof mds.RoleList
         * @static
         * @param {mds.RoleList} message RoleList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoleList.toObject = function toObject(message, options) {
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
         * Converts this RoleList to JSON.
         * @function toJSON
         * @memberof mds.RoleList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoleList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoleList;
    })();

    return mds;
})();

module.exports = $root;
