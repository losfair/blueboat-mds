import * as $protobuf from "protobufjs";
/** Namespace mds. */
export namespace mds {

    /** Properties of a LoginChallenge. */
    interface ILoginChallenge {

        /** LoginChallenge challenge */
        challenge?: (Uint8Array|null);
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

    /** Properties of a RoleList. */
    interface IRoleList {

        /** RoleList roles */
        roles?: (string[]|null);
    }

    /** Represents a RoleList. */
    class RoleList implements IRoleList {

        /**
         * Constructs a new RoleList.
         * @param [properties] Properties to set
         */
        constructor(properties?: mds.IRoleList);

        /** RoleList roles. */
        public roles: string[];

        /**
         * Creates a new RoleList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleList instance
         */
        public static create(properties?: mds.IRoleList): mds.RoleList;

        /**
         * Encodes the specified RoleList message. Does not implicitly {@link mds.RoleList.verify|verify} messages.
         * @param message RoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: mds.IRoleList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoleList message, length delimited. Does not implicitly {@link mds.RoleList.verify|verify} messages.
         * @param message RoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: mds.IRoleList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoleList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): mds.RoleList;

        /**
         * Decodes a RoleList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): mds.RoleList;

        /**
         * Verifies a RoleList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoleList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoleList
         */
        public static fromObject(object: { [k: string]: any }): mds.RoleList;

        /**
         * Creates a plain object from a RoleList message. Also converts values to other types if specified.
         * @param message RoleList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: mds.RoleList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoleList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
