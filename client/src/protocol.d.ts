import * as $protobuf from "protobufjs";
/** Namespace mds. */
export namespace mds {

    /** Properties of a LoginChallenge. */
    interface ILoginChallenge {

        /** LoginChallenge challenge */
        challenge?: (Uint8Array|null);

        /** LoginChallenge version */
        version?: (string|null);
    }

    /** Represents a LoginChallenge. */
    class LoginChallenge implements ILoginChallenge {

        /**
         * Constructs a new LoginChallenge.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.ILoginChallenge);

        /** LoginChallenge challenge. */
        public challenge: Uint8Array;

        /** LoginChallenge version. */
        public version: string;

        /**
         * Creates a new LoginChallenge instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginChallenge instance
         */
        public static create(properties?: mds.ILoginChallenge): mds.LoginChallenge;

        /**
         * Encodes the specified LoginChallenge message. Does not implicitly {@link mds.LoginChallenge.verify|verify} messages.
         * @param message LoginChallenge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.ILoginChallenge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginChallenge message, length delimited. Does not implicitly {@link mds.LoginChallenge.verify|verify} messages.
         * @param message LoginChallenge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.ILoginChallenge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginChallenge message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginChallenge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.LoginChallenge;

        /**
         * Decodes a LoginChallenge message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginChallenge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.LoginChallenge;

        /**
         * Verifies a LoginChallenge message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginChallenge message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginChallenge
         */
        public static fromObject(object: { [k: string]: any }): mds.LoginChallenge;

        /**
         * Creates a plain object from a LoginChallenge message. Also converts values to other types if specified.
         * @param message LoginChallenge
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.LoginChallenge, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginChallenge to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Login. */
    interface ILogin {

        /** Login store */
        store?: (string|null);

        /** Login publicKey */
        publicKey?: (Uint8Array|null);

        /** Login signature */
        signature?: (Uint8Array|null);

        /** Login muxWidth */
        muxWidth?: (number|null);
    }

    /** Represents a Login. */
    class Login implements ILogin {

        /**
         * Constructs a new Login.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.ILogin);

        /** Login store. */
        public store: string;

        /** Login publicKey. */
        public publicKey: Uint8Array;

        /** Login signature. */
        public signature: Uint8Array;

        /** Login muxWidth. */
        public muxWidth: number;

        /**
         * Creates a new Login instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login instance
         */
        public static create(properties?: mds.ILogin): mds.Login;

        /**
         * Encodes the specified Login message. Does not implicitly {@link mds.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Login message, length delimited. Does not implicitly {@link mds.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.Login;

        /**
         * Decodes a Login message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.Login;

        /**
         * Verifies a Login message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Login message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Login
         */
        public static fromObject(object: { [k: string]: any }): mds.Login;

        /**
         * Creates a plain object from a Login message. Also converts values to other types if specified.
         * @param message Login
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.Login, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Login to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoginResponse. */
    interface ILoginResponse {

        /** LoginResponse ok */
        ok?: (boolean|null);

        /** LoginResponse region */
        region?: (string|null);

        /** LoginResponse error */
        error?: (string|null);

        /** LoginResponse pingIntervalMs */
        pingIntervalMs?: (number|Long|null);
    }

    /** Represents a LoginResponse. */
    class LoginResponse implements ILoginResponse {

        /**
         * Constructs a new LoginResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.ILoginResponse);

        /** LoginResponse ok. */
        public ok: boolean;

        /** LoginResponse region. */
        public region: string;

        /** LoginResponse error. */
        public error: string;

        /** LoginResponse pingIntervalMs. */
        public pingIntervalMs: (number|Long);

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginResponse instance
         */
        public static create(properties?: mds.ILoginResponse): mds.LoginResponse;

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link mds.LoginResponse.verify|verify} messages.
         * @param message LoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link mds.LoginResponse.verify|verify} messages.
         * @param message LoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.LoginResponse;

        /**
         * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.LoginResponse;

        /**
         * Verifies a LoginResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginResponse
         */
        public static fromObject(object: { [k: string]: any }): mds.LoginResponse;

        /**
         * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
         * @param message LoginResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.LoginResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Request. */
    interface IRequest {

        /** Request lane */
        lane?: (number|null);

        /** Request program */
        program?: (string|null);

        /** Request data */
        data?: (string|null);

        /** Request fastpathBatch */
        fastpathBatch?: (mds.IFastpathRequest[]|null);
    }

    /** Represents a Request. */
    class Request implements IRequest {

        /**
         * Constructs a new Request.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IRequest);

        /** Request lane. */
        public lane: number;

        /** Request program. */
        public program: string;

        /** Request data. */
        public data: string;

        /** Request fastpathBatch. */
        public fastpathBatch: mds.IFastpathRequest[];

        /**
         * Creates a new Request instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Request instance
         */
        public static create(properties?: mds.IRequest): mds.Request;

        /**
         * Encodes the specified Request message. Does not implicitly {@link mds.Request.verify|verify} messages.
         * @param message Request message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link mds.Request.verify|verify} messages.
         * @param message Request message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.Request;

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.Request;

        /**
         * Verifies a Request message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Request
         */
        public static fromObject(object: { [k: string]: any }): mds.Request;

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @param message Request
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Request to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Response. */
    interface IResponse {

        /** Response lane */
        lane?: (number|null);

        /** Response error */
        error?: (mds.IErrorResponse|null);

        /** Response output */
        output?: (string|null);

        /** Response fastpathBatch */
        fastpathBatch?: (mds.IFastpathResponse[]|null);
    }

    /** Represents a Response. */
    class Response implements IResponse {

        /**
         * Constructs a new Response.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IResponse);

        /** Response lane. */
        public lane: number;

        /** Response error. */
        public error?: (mds.IErrorResponse|null);

        /** Response output. */
        public output?: (string|null);

        /** Response fastpathBatch. */
        public fastpathBatch: mds.IFastpathResponse[];

        /** Response body. */
        public body?: ("error"|"output");

        /**
         * Creates a new Response instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Response instance
         */
        public static create(properties?: mds.IResponse): mds.Response;

        /**
         * Encodes the specified Response message. Does not implicitly {@link mds.Response.verify|verify} messages.
         * @param message Response message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link mds.Response.verify|verify} messages.
         * @param message Response message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.Response;

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.Response;

        /**
         * Verifies a Response message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Response
         */
        public static fromObject(object: { [k: string]: any }): mds.Response;

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @param message Response
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.Response, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Response to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FastpathRequest. */
    interface IFastpathRequest {

        /** FastpathRequest op */
        op?: (mds.FastpathRequest.Op|null);

        /** FastpathRequest txnId */
        txnId?: (number|Long|null);

        /** FastpathRequest isPrimary */
        isPrimary?: (boolean|null);

        /** FastpathRequest kvp */
        kvp?: (mds.IKeyValuePair[]|null);

        /** FastpathRequest listOptions */
        listOptions?: (mds.IFastpathListOptions|null);
    }

    /** Represents a FastpathRequest. */
    class FastpathRequest implements IFastpathRequest {

        /**
         * Constructs a new FastpathRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IFastpathRequest);

        /** FastpathRequest op. */
        public op: mds.FastpathRequest.Op;

        /** FastpathRequest txnId. */
        public txnId: (number|Long);

        /** FastpathRequest isPrimary. */
        public isPrimary: boolean;

        /** FastpathRequest kvp. */
        public kvp: mds.IKeyValuePair[];

        /** FastpathRequest listOptions. */
        public listOptions?: (mds.IFastpathListOptions|null);

        /**
         * Creates a new FastpathRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FastpathRequest instance
         */
        public static create(properties?: mds.IFastpathRequest): mds.FastpathRequest;

        /**
         * Encodes the specified FastpathRequest message. Does not implicitly {@link mds.FastpathRequest.verify|verify} messages.
         * @param message FastpathRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IFastpathRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FastpathRequest message, length delimited. Does not implicitly {@link mds.FastpathRequest.verify|verify} messages.
         * @param message FastpathRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IFastpathRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FastpathRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FastpathRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.FastpathRequest;

        /**
         * Decodes a FastpathRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FastpathRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.FastpathRequest;

        /**
         * Verifies a FastpathRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FastpathRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FastpathRequest
         */
        public static fromObject(object: { [k: string]: any }): mds.FastpathRequest;

        /**
         * Creates a plain object from a FastpathRequest message. Also converts values to other types if specified.
         * @param message FastpathRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.FastpathRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FastpathRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace FastpathRequest {

        /** Op enum. */
        enum Op {
            INVALID = 0,
            COMMIT_TXN = 1,
            ABORT_TXN = 2,
            OPEN_TXN = 3,
            GET = 4,
            SET = 5,
            DELETE = 6,
            LIST = 7
        }
    }

    /** Properties of a FastpathListOptions. */
    interface IFastpathListOptions {

        /** FastpathListOptions limit */
        limit?: (number|null);

        /** FastpathListOptions reverse */
        reverse?: (boolean|null);

        /** FastpathListOptions wantValue */
        wantValue?: (boolean|null);
    }

    /** Represents a FastpathListOptions. */
    class FastpathListOptions implements IFastpathListOptions {

        /**
         * Constructs a new FastpathListOptions.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IFastpathListOptions);

        /** FastpathListOptions limit. */
        public limit: number;

        /** FastpathListOptions reverse. */
        public reverse: boolean;

        /** FastpathListOptions wantValue. */
        public wantValue: boolean;

        /**
         * Creates a new FastpathListOptions instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FastpathListOptions instance
         */
        public static create(properties?: mds.IFastpathListOptions): mds.FastpathListOptions;

        /**
         * Encodes the specified FastpathListOptions message. Does not implicitly {@link mds.FastpathListOptions.verify|verify} messages.
         * @param message FastpathListOptions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IFastpathListOptions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FastpathListOptions message, length delimited. Does not implicitly {@link mds.FastpathListOptions.verify|verify} messages.
         * @param message FastpathListOptions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IFastpathListOptions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FastpathListOptions message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FastpathListOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.FastpathListOptions;

        /**
         * Decodes a FastpathListOptions message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FastpathListOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.FastpathListOptions;

        /**
         * Verifies a FastpathListOptions message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FastpathListOptions message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FastpathListOptions
         */
        public static fromObject(object: { [k: string]: any }): mds.FastpathListOptions;

        /**
         * Creates a plain object from a FastpathListOptions message. Also converts values to other types if specified.
         * @param message FastpathListOptions
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.FastpathListOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FastpathListOptions to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FastpathResponse. */
    interface IFastpathResponse {

        /** FastpathResponse txnId */
        txnId?: (number|Long|null);

        /** FastpathResponse error */
        error?: (mds.IErrorResponse|null);

        /** FastpathResponse kvp */
        kvp?: (mds.IKeyValuePair[]|null);
    }

    /** Represents a FastpathResponse. */
    class FastpathResponse implements IFastpathResponse {

        /**
         * Constructs a new FastpathResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IFastpathResponse);

        /** FastpathResponse txnId. */
        public txnId: (number|Long);

        /** FastpathResponse error. */
        public error?: (mds.IErrorResponse|null);

        /** FastpathResponse kvp. */
        public kvp: mds.IKeyValuePair[];

        /**
         * Creates a new FastpathResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FastpathResponse instance
         */
        public static create(properties?: mds.IFastpathResponse): mds.FastpathResponse;

        /**
         * Encodes the specified FastpathResponse message. Does not implicitly {@link mds.FastpathResponse.verify|verify} messages.
         * @param message FastpathResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IFastpathResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FastpathResponse message, length delimited. Does not implicitly {@link mds.FastpathResponse.verify|verify} messages.
         * @param message FastpathResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IFastpathResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FastpathResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FastpathResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.FastpathResponse;

        /**
         * Decodes a FastpathResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FastpathResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.FastpathResponse;

        /**
         * Verifies a FastpathResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FastpathResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FastpathResponse
         */
        public static fromObject(object: { [k: string]: any }): mds.FastpathResponse;

        /**
         * Creates a plain object from a FastpathResponse message. Also converts values to other types if specified.
         * @param message FastpathResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.FastpathResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FastpathResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KeyValuePair. */
    interface IKeyValuePair {

        /** KeyValuePair key */
        key?: (Uint8Array|null);

        /** KeyValuePair value */
        value?: (Uint8Array|null);
    }

    /** Represents a KeyValuePair. */
    class KeyValuePair implements IKeyValuePair {

        /**
         * Constructs a new KeyValuePair.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IKeyValuePair);

        /** KeyValuePair key. */
        public key: Uint8Array;

        /** KeyValuePair value. */
        public value: Uint8Array;

        /**
         * Creates a new KeyValuePair instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyValuePair instance
         */
        public static create(properties?: mds.IKeyValuePair): mds.KeyValuePair;

        /**
         * Encodes the specified KeyValuePair message. Does not implicitly {@link mds.KeyValuePair.verify|verify} messages.
         * @param message KeyValuePair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IKeyValuePair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyValuePair message, length delimited. Does not implicitly {@link mds.KeyValuePair.verify|verify} messages.
         * @param message KeyValuePair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IKeyValuePair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyValuePair message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyValuePair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.KeyValuePair;

        /**
         * Decodes a KeyValuePair message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyValuePair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.KeyValuePair;

        /**
         * Verifies a KeyValuePair message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyValuePair message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyValuePair
         */
        public static fromObject(object: { [k: string]: any }): mds.KeyValuePair;

        /**
         * Creates a plain object from a KeyValuePair message. Also converts values to other types if specified.
         * @param message KeyValuePair
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.KeyValuePair, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyValuePair to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StoreInfo. */
    interface IStoreInfo {

        /** StoreInfo cluster */
        cluster?: (string|null);

        /** StoreInfo subspace */
        subspace?: (string|null);
    }

    /** Represents a StoreInfo. */
    class StoreInfo implements IStoreInfo {

        /**
         * Constructs a new StoreInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IStoreInfo);

        /** StoreInfo cluster. */
        public cluster: string;

        /** StoreInfo subspace. */
        public subspace: string;

        /**
         * Creates a new StoreInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StoreInfo instance
         */
        public static create(properties?: mds.IStoreInfo): mds.StoreInfo;

        /**
         * Encodes the specified StoreInfo message. Does not implicitly {@link mds.StoreInfo.verify|verify} messages.
         * @param message StoreInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IStoreInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StoreInfo message, length delimited. Does not implicitly {@link mds.StoreInfo.verify|verify} messages.
         * @param message StoreInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IStoreInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StoreInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StoreInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.StoreInfo;

        /**
         * Decodes a StoreInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StoreInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.StoreInfo;

        /**
         * Verifies a StoreInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StoreInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StoreInfo
         */
        public static fromObject(object: { [k: string]: any }): mds.StoreInfo;

        /**
         * Creates a plain object from a StoreInfo message. Also converts values to other types if specified.
         * @param message StoreInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.StoreInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StoreInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ErrorResponse. */
    interface IErrorResponse {

        /** ErrorResponse description */
        description?: (string|null);

        /** ErrorResponse retryable */
        retryable?: (boolean|null);
    }

    /** Represents an ErrorResponse. */
    class ErrorResponse implements IErrorResponse {

        /**
         * Constructs a new ErrorResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IErrorResponse);

        /** ErrorResponse description. */
        public description: string;

        /** ErrorResponse retryable. */
        public retryable: boolean;

        /**
         * Creates a new ErrorResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ErrorResponse instance
         */
        public static create(properties?: mds.IErrorResponse): mds.ErrorResponse;

        /**
         * Encodes the specified ErrorResponse message. Does not implicitly {@link mds.ErrorResponse.verify|verify} messages.
         * @param message ErrorResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IErrorResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ErrorResponse message, length delimited. Does not implicitly {@link mds.ErrorResponse.verify|verify} messages.
         * @param message ErrorResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IErrorResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.ErrorResponse;

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.ErrorResponse;

        /**
         * Verifies an ErrorResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ErrorResponse
         */
        public static fromObject(object: { [k: string]: any }): mds.ErrorResponse;

        /**
         * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
         * @param message ErrorResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.ErrorResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ErrorResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Cluster. */
    interface ICluster {

        /** Cluster primary */
        primary?: (mds.IClusterRegion|null);

        /** Cluster replicas */
        replicas?: (mds.IClusterRegion[]|null);
    }

    /** Represents a Cluster. */
    class Cluster implements ICluster {

        /**
         * Constructs a new Cluster.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.ICluster);

        /** Cluster primary. */
        public primary?: (mds.IClusterRegion|null);

        /** Cluster replicas. */
        public replicas: mds.IClusterRegion[];

        /**
         * Creates a new Cluster instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Cluster instance
         */
        public static create(properties?: mds.ICluster): mds.Cluster;

        /**
         * Encodes the specified Cluster message. Does not implicitly {@link mds.Cluster.verify|verify} messages.
         * @param message Cluster message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.ICluster, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Cluster message, length delimited. Does not implicitly {@link mds.Cluster.verify|verify} messages.
         * @param message Cluster message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.ICluster, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Cluster message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Cluster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.Cluster;

        /**
         * Decodes a Cluster message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Cluster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.Cluster;

        /**
         * Verifies a Cluster message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Cluster message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Cluster
         */
        public static fromObject(object: { [k: string]: any }): mds.Cluster;

        /**
         * Creates a plain object from a Cluster message. Also converts values to other types if specified.
         * @param message Cluster
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.Cluster, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Cluster to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ClusterRegion. */
    interface IClusterRegion {

        /** ClusterRegion region */
        region?: (string|null);

        /** ClusterRegion config */
        config?: (string|null);
    }

    /** Represents a ClusterRegion. */
    class ClusterRegion implements IClusterRegion {

        /**
         * Constructs a new ClusterRegion.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IClusterRegion);

        /** ClusterRegion region. */
        public region: string;

        /** ClusterRegion config. */
        public config: string;

        /**
         * Creates a new ClusterRegion instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClusterRegion instance
         */
        public static create(properties?: mds.IClusterRegion): mds.ClusterRegion;

        /**
         * Encodes the specified ClusterRegion message. Does not implicitly {@link mds.ClusterRegion.verify|verify} messages.
         * @param message ClusterRegion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IClusterRegion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClusterRegion message, length delimited. Does not implicitly {@link mds.ClusterRegion.verify|verify} messages.
         * @param message ClusterRegion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IClusterRegion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClusterRegion message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClusterRegion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.ClusterRegion;

        /**
         * Decodes a ClusterRegion message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClusterRegion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.ClusterRegion;

        /**
         * Verifies a ClusterRegion message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClusterRegion message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClusterRegion
         */
        public static fromObject(object: { [k: string]: any }): mds.ClusterRegion;

        /**
         * Creates a plain object from a ClusterRegion message. Also converts values to other types if specified.
         * @param message ClusterRegion
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.ClusterRegion, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClusterRegion to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a UserRoleList. */
    interface IUserRoleList {

        /** UserRoleList roles */
        roles?: (string[]|null);
    }

    /** Represents a UserRoleList. */
    class UserRoleList implements IUserRoleList {

        /**
         * Constructs a new UserRoleList.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IUserRoleList);

        /** UserRoleList roles. */
        public roles: string[];

        /**
         * Creates a new UserRoleList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserRoleList instance
         */
        public static create(properties?: mds.IUserRoleList): mds.UserRoleList;

        /**
         * Encodes the specified UserRoleList message. Does not implicitly {@link mds.UserRoleList.verify|verify} messages.
         * @param message UserRoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IUserRoleList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserRoleList message, length delimited. Does not implicitly {@link mds.UserRoleList.verify|verify} messages.
         * @param message UserRoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IUserRoleList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserRoleList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.UserRoleList;

        /**
         * Decodes a UserRoleList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.UserRoleList;

        /**
         * Verifies a UserRoleList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserRoleList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserRoleList
         */
        public static fromObject(object: { [k: string]: any }): mds.UserRoleList;

        /**
         * Creates a plain object from a UserRoleList message. Also converts values to other types if specified.
         * @param message UserRoleList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.UserRoleList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserRoleList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StoreRoleList. */
    interface IStoreRoleList {

        /** StoreRoleList roles */
        roles?: (string[]|null);

        /** StoreRoleList readonlyRoles */
        readonlyRoles?: (string[]|null);
    }

    /** Represents a StoreRoleList. */
    class StoreRoleList implements IStoreRoleList {

        /**
         * Constructs a new StoreRoleList.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IStoreRoleList);

        /** StoreRoleList roles. */
        public roles: string[];

        /** StoreRoleList readonlyRoles. */
        public readonlyRoles: string[];

        /**
         * Creates a new StoreRoleList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StoreRoleList instance
         */
        public static create(properties?: mds.IStoreRoleList): mds.StoreRoleList;

        /**
         * Encodes the specified StoreRoleList message. Does not implicitly {@link mds.StoreRoleList.verify|verify} messages.
         * @param message StoreRoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IStoreRoleList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StoreRoleList message, length delimited. Does not implicitly {@link mds.StoreRoleList.verify|verify} messages.
         * @param message StoreRoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IStoreRoleList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StoreRoleList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StoreRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.StoreRoleList;

        /**
         * Decodes a StoreRoleList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StoreRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.StoreRoleList;

        /**
         * Verifies a StoreRoleList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StoreRoleList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StoreRoleList
         */
        public static fromObject(object: { [k: string]: any }): mds.StoreRoleList;

        /**
         * Creates a plain object from a StoreRoleList message. Also converts values to other types if specified.
         * @param message StoreRoleList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.StoreRoleList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StoreRoleList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
