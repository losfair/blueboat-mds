var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    function concat(list, totalLength) {
      if (list.length === 0)
        return EMPTY_BUFFER;
      if (list.length === 1)
        return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength)
        return target.slice(0, offset);
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.byteLength === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data))
        return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    try {
      const bufferUtil = __require("bufferutil");
      module.exports = {
        concat,
        mask(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bufferUtil.mask(source, mask, output, offset, length);
        },
        toArrayBuffer,
        toBuffer,
        unmask(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        }
      };
    } catch (e) {
      module.exports = {
        concat,
        mask: _mask,
        toArrayBuffer,
        toBuffer,
        unmask: _unmask
      };
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      static get extensionName() {
        return "permessage-deflate";
      }
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(new Error("The deflate stream was closed while data was being processed"));
          }
        }
      }
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error('Unexpected or invalid parameter "client_max_window_bits"');
        }
        return params;
      }
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
          if (fin)
            data2 = data2.slice(0, data2.length - 4);
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    try {
      const isValidUTF8 = __require("utf-8-validate");
      module.exports = {
        isValidStatusCode,
        isValidUTF8(buf) {
          return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
        },
        tokenChars
      };
    } catch (e) {
      module.exports = {
        isValidStatusCode,
        isValidUTF8: _isValidUTF8,
        tokenChars
      };
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var Receiver = class extends Writable {
      constructor(options = {}) {
        super();
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._state = GET_INFO;
        this._loop = false;
      }
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = buf.slice(n);
          return buf.slice(0, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = buf.slice(n);
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      startLoop(cb) {
        let err;
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              err = this.getInfo();
              break;
            case GET_PAYLOAD_LENGTH_16:
              err = this.getPayloadLength16();
              break;
            case GET_PAYLOAD_LENGTH_64:
              err = this.getPayloadLength64();
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              err = this.getData(cb);
              break;
            default:
              this._loop = false;
              return;
          }
        } while (this._loop);
        cb(err);
      }
      getInfo() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          this._loop = false;
          return error(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          this._loop = false;
          return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            this._loop = false;
            return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          }
          if (!this._fragmented) {
            this._loop = false;
            return error(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            this._loop = false;
            return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            this._loop = false;
            return error(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
          }
          if (compressed) {
            this._loop = false;
            return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          }
          if (this._payloadLength > 125) {
            this._loop = false;
            return error(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
          }
        } else {
          this._loop = false;
          return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            this._loop = false;
            return error(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
          }
        } else if (this._masked) {
          this._loop = false;
          return error(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          return this.haveLength();
      }
      getPayloadLength16() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        return this.haveLength();
      }
      getPayloadLength64() {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          this._loop = false;
          return error(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.haveLength();
      }
      haveLength() {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            this._loop = false;
            return error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked)
            unmask(data, this._mask);
        }
        if (this._opcode > 7)
          return this.controlMessage(data);
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        return this.dataMessage();
      }
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              return cb(error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
            }
            this._fragments.push(buf);
          }
          const er = this.dataMessage();
          if (er)
            return cb(er);
          this.startLoop(cb);
        });
      }
      dataMessage() {
        if (this._fin) {
          const messageLength = this._messageLength;
          const fragments = this._fragments;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];
          if (this._opcode === 2) {
            let data;
            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else {
              data = fragments;
            }
            this.emit("message", data, true);
          } else {
            const buf = concat(fragments, messageLength);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              this._loop = false;
              return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
            }
            this.emit("message", buf, false);
          }
        }
        this._state = GET_INFO;
      }
      controlMessage(data) {
        if (this._opcode === 8) {
          this._loop = false;
          if (data.length === 0) {
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else if (data.length === 1) {
            return error(RangeError, "invalid payload length 1", true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              return error(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
            }
            const buf = data.slice(2);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
            }
            this.emit("conclude", code, buf);
            this.end();
          }
        } else if (this._opcode === 9) {
          this.emit("ping", data);
        } else {
          this.emit("pong", data);
        }
        this._state = GET_INFO;
      }
    };
    module.exports = Receiver;
    function error(ErrorCtor, message, prefix, statusCode, errorCode) {
      const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
      Error.captureStackTrace(err, error);
      err.code = errorCode;
      err[kStatusCode] = statusCode;
      return err;
    }
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var net = __require("net");
    var tls = __require("tls");
    var { randomFillSync } = __require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER } = require_constants();
    var { isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var mask = Buffer.alloc(4);
    var Sender = class {
      constructor(socket, extensions) {
        this._extensions = extensions || {};
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      static frame(data, options) {
        const merge = options.mask && options.readOnly;
        let offset = options.mask ? 6 : 2;
        let payloadLength = data.length;
        if (data.length >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (data.length > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(data.length, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(data.length, 4, 6);
        }
        if (!options.mask)
          return [target, data];
        randomFillSync(mask, 0, 4);
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (merge) {
          applyMask(data, mask, target, offset, data.length);
          return [target];
        }
        applyMask(data, mask, data, 0, data.length);
        return [target, data];
      }
      close(code, data, mask2, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        if (this._deflating) {
          this.enqueue([this.doClose, buf, mask2, cb]);
        } else {
          this.doClose(buf, mask2, cb);
        }
      }
      doClose(data, mask2, cb) {
        this.sendFrame(Sender.frame(data, {
          fin: true,
          rsv1: false,
          opcode: 8,
          mask: mask2,
          readOnly: false
        }), cb);
      }
      ping(data, mask2, cb) {
        const buf = toBuffer(data);
        if (buf.length > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        if (this._deflating) {
          this.enqueue([this.doPing, buf, mask2, toBuffer.readOnly, cb]);
        } else {
          this.doPing(buf, mask2, toBuffer.readOnly, cb);
        }
      }
      doPing(data, mask2, readOnly, cb) {
        this.sendFrame(Sender.frame(data, {
          fin: true,
          rsv1: false,
          opcode: 9,
          mask: mask2,
          readOnly
        }), cb);
      }
      pong(data, mask2, cb) {
        const buf = toBuffer(data);
        if (buf.length > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        if (this._deflating) {
          this.enqueue([this.doPong, buf, mask2, toBuffer.readOnly, cb]);
        } else {
          this.doPong(buf, mask2, toBuffer.readOnly, cb);
        }
      }
      doPong(data, mask2, readOnly, cb) {
        this.sendFrame(Sender.frame(data, {
          fin: true,
          rsv1: false,
          opcode: 10,
          mask: mask2,
          readOnly
        }), cb);
      }
      send(data, options, cb) {
        const buf = toBuffer(data);
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = buf.length >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        if (perMessageDeflate) {
          const opts = {
            fin: options.fin,
            rsv1,
            opcode,
            mask: options.mask,
            readOnly: toBuffer.readOnly
          };
          if (this._deflating) {
            this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
          } else {
            this.dispatch(buf, this._compress, opts, cb);
          }
        } else {
          this.sendFrame(Sender.frame(buf, {
            fin: options.fin,
            rsv1: false,
            opcode,
            mask: options.mask,
            readOnly: toBuffer.readOnly
          }), cb);
        }
      }
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += data.length;
        this._deflating = true;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error("The socket was closed while data was being compressed");
            if (typeof cb === "function")
              cb(err);
            for (let i = 0; i < this._queue.length; i++) {
              const callback = this._queue[i][4];
              if (typeof callback === "function")
                callback(err);
            }
            return;
          }
          this._bufferedBytes -= data.length;
          this._deflating = false;
          options.readOnly = false;
          this.sendFrame(Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      dequeue() {
        while (!this._deflating && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[1].length;
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      enqueue(params) {
        this._bufferedBytes += params[1].length;
        this._queue.push(params);
      }
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender;
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      get target() {
        return this[kTarget];
      }
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      get code() {
        return this[kCode];
      }
      get reason() {
        return this[kReason];
      }
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      get error() {
        return this[kError];
      }
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      addEventListener(type, listener, options = {}) {
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = listener;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0)
        dest[name] = [elem];
      else
        dest[name].push(elem);
    }
    function parse(header) {
      const offers = Object.create(null);
      let params = Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1)
              start = i;
            else if (!mustUnescape)
              mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1)
                start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1)
        end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations))
          configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(Object.keys(params).map((k) => {
            let values = params[k];
            if (!Array.isArray(values))
              values = [values];
            return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
          })).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Readable } = __require("stream");
    var { URL } = __require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver = require_receiver();
    var Sender = require_sender();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var protocolVersions = [8, 13];
    var closeTimeout = 30 * 1e3;
    var WebSocket2 = class extends EventEmitter {
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = WebSocket2.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._isServer = true;
        }
      }
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      get isPaused() {
        return this._paused;
      }
      get onclose() {
        return null;
      }
      get onerror() {
        return null;
      }
      get onopen() {
        return null;
      }
      get onmessage() {
        return null;
      }
      get protocol() {
        return this._protocol;
      }
      get readyState() {
        return this._readyState;
      }
      get url() {
        return this._url;
      }
      setSocket(socket, head, options) {
        const receiver = new Receiver({
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        this._sender = new Sender(socket, this._extensions);
        this._receiver = receiver;
        this._socket = socket;
        receiver[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        socket.setTimeout(0);
        socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = WebSocket2.OPEN;
        this.emit("open");
      }
      emitClose() {
        if (!this._socket) {
          this._readyState = WebSocket2.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = WebSocket2.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      close(code, data) {
        if (this.readyState === WebSocket2.CLOSED)
          return;
        if (this.readyState === WebSocket2.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this.readyState === WebSocket2.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = WebSocket2.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._closeTimer = setTimeout(this._socket.destroy.bind(this._socket), closeTimeout);
      }
      pause() {
        if (this.readyState === WebSocket2.CONNECTING || this.readyState === WebSocket2.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      ping(data, mask, cb) {
        if (this.readyState === WebSocket2.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket2.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      pong(data, mask, cb) {
        if (this.readyState === WebSocket2.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket2.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      resume() {
        if (this.readyState === WebSocket2.CONNECTING || this.readyState === WebSocket2.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain)
          this._socket.resume();
      }
      send(data, options, cb) {
        if (this.readyState === WebSocket2.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket2.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      terminate() {
        if (this.readyState === WebSocket2.CLOSED)
          return;
        if (this.readyState === WebSocket2.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this._socket) {
          this._readyState = WebSocket2.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        createConnection: void 0,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: void 0,
        host: void 0,
        path: void 0,
        port: void 0
      };
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
        websocket._url = address.href;
      } else {
        try {
          parsedUrl = new URL(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
        websocket._url = address;
      }
      const isSecure = parsedUrl.protocol === "wss:";
      const isUnixSocket = parsedUrl.protocol === "ws+unix:";
      let invalidURLMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isUnixSocket) {
        invalidURLMessage = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"`;
      } else if (isUnixSocket && !parsedUrl.pathname) {
        invalidURLMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidURLMessage = "The URL contains a fragment identifier";
      }
      if (invalidURLMessage) {
        const err = new SyntaxError(invalidURLMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const get = isSecure ? https.get : http.get;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = isSecure ? tlsConnect : netConnect;
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket",
        ...opts.headers
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(opts.perMessageDeflate !== true ? opts.perMessageDeflate : {}, false, opts.maxPayload);
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError("An invalid or duplicated subprotocol was specified");
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isUnixSocket) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req = websocket._req = get(opts);
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req.aborted)
          return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING)
          return;
        req = websocket._req = null;
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt)
          websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        stream.once("abort", websocket.emitClose.bind(websocket));
        websocket.emit("error", err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = toBuffer(data).length;
        if (websocket._socket)
          websocket._sender._bufferedBytes += length;
        else
          websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
        cb(err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0)
        return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005)
        websocket.close();
      else
        websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused)
        websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      websocket.emit("error", err);
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      websocket.pong(data, !websocket._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      let chunk;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) {
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data))
          ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed)
          return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed)
          return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called)
            callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy)
          ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null)
          return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted)
            duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused)
          ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1)
            start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1)
            end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1)
            end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var https = __require("https");
    var net = __require("net");
    var tls = __require("tls");
    var { createHash } = __require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer = class extends EventEmitter {
      constructor(options, callback) {
        super();
        options = {
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(options.port, options.host, options.backlog, callback);
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb)
          this.once("close", cb);
        if (this._state === CLOSING)
          return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"] !== void 0 ? req.headers["sec-websocket-key"] : false;
        const version2 = +req.headers["sec-websocket-version"];
        if (req.method !== "GET" || req.headers.upgrade.toLowerCase() !== "websocket" || !key || !keyRegex.test(key) || version2 !== 8 && version2 !== 13 || !this.shouldHandle(req)) {
          return abortHandshake(socket, 400);
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            return abortHandshake(socket, 400);
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(this.options.perMessageDeflate, true, this.options.maxPayload);
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            return abortHandshake(socket, 400);
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version2 === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
        }
        if (this._state > RUNNING)
          return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new WebSocket2(null);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer;
    function addListeners(server, map) {
      for (const event of Object.keys(map))
        server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      if (socket.writable) {
        message = message || http.STATUS_CODES[code];
        headers = {
          Connection: "close",
          "Content-Type": "text/html",
          "Content-Length": Buffer.byteLength(message),
          ...headers
        };
        socket.write(`HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
      }
      socket.removeListener("error", socketOnError);
      socket.destroy();
    }
  }
});

// node_modules/ws/index.js
var require_ws = __commonJS({
  "node_modules/ws/index.js"(exports, module) {
    "use strict";
    var WebSocket2 = require_websocket();
    WebSocket2.createWebSocketStream = require_stream();
    WebSocket2.Server = require_websocket_server();
    WebSocket2.Receiver = require_receiver();
    WebSocket2.Sender = require_sender();
    WebSocket2.WebSocket = WebSocket2;
    WebSocket2.WebSocketServer = WebSocket2.Server;
    module.exports = WebSocket2;
  }
});

// node_modules/isomorphic-ws/node.js
var require_node = __commonJS({
  "node_modules/isomorphic-ws/node.js"(exports, module) {
    "use strict";
    module.exports = require_ws();
  }
});

// src/protocol.js
var require_protocol = __commonJS({
  "src/protocol.js"(exports, module) {
    "use strict";
    var $protobuf = __require("protobufjs/minimal");
    var $Reader = $protobuf.Reader;
    var $Writer = $protobuf.Writer;
    var $util = $protobuf.util;
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    $root.mds = function() {
      var mds2 = {};
      mds2.LoginChallenge = function() {
        function LoginChallenge(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        LoginChallenge.prototype.challenge = $util.newBuffer([]);
        LoginChallenge.prototype.version = "";
        LoginChallenge.create = function create(properties) {
          return new LoginChallenge(properties);
        };
        LoginChallenge.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.challenge != null && Object.hasOwnProperty.call(message, "challenge"))
            writer.uint32(10).bytes(message.challenge);
          if (message.version != null && Object.hasOwnProperty.call(message, "version"))
            writer.uint32(18).string(message.version);
          return writer;
        };
        LoginChallenge.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        LoginChallenge.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.LoginChallenge();
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
        LoginChallenge.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        LoginChallenge.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.challenge != null && message.hasOwnProperty("challenge")) {
            if (!(message.challenge && typeof message.challenge.length === "number" || $util.isString(message.challenge)))
              return "challenge: buffer expected";
          }
          if (message.version != null && message.hasOwnProperty("version")) {
            if (!$util.isString(message.version))
              return "version: string expected";
          }
          return null;
        };
        LoginChallenge.fromObject = function fromObject(object) {
          if (object instanceof $root.mds.LoginChallenge)
            return object;
          var message = new $root.mds.LoginChallenge();
          if (object.challenge != null) {
            if (typeof object.challenge === "string")
              $util.base64.decode(object.challenge, message.challenge = $util.newBuffer($util.base64.length(object.challenge)), 0);
            else if (object.challenge.length)
              message.challenge = object.challenge;
          }
          if (object.version != null)
            message.version = String(object.version);
          return message;
        };
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
        LoginChallenge.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return LoginChallenge;
      }();
      mds2.Login = function() {
        function Login(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        Login.prototype.store = "";
        Login.prototype.publicKey = $util.newBuffer([]);
        Login.prototype.signature = $util.newBuffer([]);
        Login.prototype.muxWidth = 0;
        Login.create = function create(properties) {
          return new Login(properties);
        };
        Login.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.store != null && Object.hasOwnProperty.call(message, "store"))
            writer.uint32(10).string(message.store);
          if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
            writer.uint32(18).bytes(message.publicKey);
          if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
            writer.uint32(26).bytes(message.signature);
          if (message.muxWidth != null && Object.hasOwnProperty.call(message, "muxWidth"))
            writer.uint32(32).uint32(message.muxWidth);
          return writer;
        };
        Login.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        Login.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.Login();
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
        Login.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        Login.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.store != null && message.hasOwnProperty("store")) {
            if (!$util.isString(message.store))
              return "store: string expected";
          }
          if (message.publicKey != null && message.hasOwnProperty("publicKey")) {
            if (!(message.publicKey && typeof message.publicKey.length === "number" || $util.isString(message.publicKey)))
              return "publicKey: buffer expected";
          }
          if (message.signature != null && message.hasOwnProperty("signature")) {
            if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
              return "signature: buffer expected";
          }
          if (message.muxWidth != null && message.hasOwnProperty("muxWidth")) {
            if (!$util.isInteger(message.muxWidth))
              return "muxWidth: integer expected";
          }
          return null;
        };
        Login.fromObject = function fromObject(object) {
          if (object instanceof $root.mds.Login)
            return object;
          var message = new $root.mds.Login();
          if (object.store != null)
            message.store = String(object.store);
          if (object.publicKey != null) {
            if (typeof object.publicKey === "string")
              $util.base64.decode(object.publicKey, message.publicKey = $util.newBuffer($util.base64.length(object.publicKey)), 0);
            else if (object.publicKey.length)
              message.publicKey = object.publicKey;
          }
          if (object.signature != null) {
            if (typeof object.signature === "string")
              $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
            else if (object.signature.length)
              message.signature = object.signature;
          }
          if (object.muxWidth != null)
            message.muxWidth = object.muxWidth >>> 0;
          return message;
        };
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
        Login.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return Login;
      }();
      mds2.LoginResponse = function() {
        function LoginResponse(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        LoginResponse.prototype.ok = false;
        LoginResponse.prototype.region = "";
        LoginResponse.prototype.error = "";
        LoginResponse.create = function create(properties) {
          return new LoginResponse(properties);
        };
        LoginResponse.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.ok != null && Object.hasOwnProperty.call(message, "ok"))
            writer.uint32(8).bool(message.ok);
          if (message.region != null && Object.hasOwnProperty.call(message, "region"))
            writer.uint32(18).string(message.region);
          if (message.error != null && Object.hasOwnProperty.call(message, "error"))
            writer.uint32(26).string(message.error);
          return writer;
        };
        LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        LoginResponse.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.LoginResponse();
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
        LoginResponse.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        LoginResponse.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.ok != null && message.hasOwnProperty("ok")) {
            if (typeof message.ok !== "boolean")
              return "ok: boolean expected";
          }
          if (message.region != null && message.hasOwnProperty("region")) {
            if (!$util.isString(message.region))
              return "region: string expected";
          }
          if (message.error != null && message.hasOwnProperty("error")) {
            if (!$util.isString(message.error))
              return "error: string expected";
          }
          return null;
        };
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
        LoginResponse.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return LoginResponse;
      }();
      mds2.Request = function() {
        function Request(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        Request.prototype.lane = 0;
        Request.prototype.program = "";
        Request.prototype.data = "";
        Request.create = function create(properties) {
          return new Request(properties);
        };
        Request.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.lane != null && Object.hasOwnProperty.call(message, "lane"))
            writer.uint32(8).uint32(message.lane);
          if (message.program != null && Object.hasOwnProperty.call(message, "program"))
            writer.uint32(18).string(message.program);
          if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(26).string(message.data);
          return writer;
        };
        Request.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        Request.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.Request();
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
        Request.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        Request.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.lane != null && message.hasOwnProperty("lane")) {
            if (!$util.isInteger(message.lane))
              return "lane: integer expected";
          }
          if (message.program != null && message.hasOwnProperty("program")) {
            if (!$util.isString(message.program))
              return "program: string expected";
          }
          if (message.data != null && message.hasOwnProperty("data")) {
            if (!$util.isString(message.data))
              return "data: string expected";
          }
          return null;
        };
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
        Request.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return Request;
      }();
      mds2.Response = function() {
        function Response(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        Response.prototype.lane = 0;
        Response.prototype.error = null;
        Response.prototype.output = null;
        var $oneOfFields;
        Object.defineProperty(Response.prototype, "body", {
          get: $util.oneOfGetter($oneOfFields = ["error", "output"]),
          set: $util.oneOfSetter($oneOfFields)
        });
        Response.create = function create(properties) {
          return new Response(properties);
        };
        Response.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.lane != null && Object.hasOwnProperty.call(message, "lane"))
            writer.uint32(8).uint32(message.lane);
          if (message.error != null && Object.hasOwnProperty.call(message, "error"))
            $root.mds.ErrorResponse.encode(message.error, writer.uint32(18).fork()).ldelim();
          if (message.output != null && Object.hasOwnProperty.call(message, "output"))
            writer.uint32(26).string(message.output);
          return writer;
        };
        Response.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        Response.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.Response();
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
        Response.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        Response.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          var properties = {};
          if (message.lane != null && message.hasOwnProperty("lane")) {
            if (!$util.isInteger(message.lane))
              return "lane: integer expected";
          }
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
        Response.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return Response;
      }();
      mds2.StoreInfo = function() {
        function StoreInfo(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        StoreInfo.prototype.cluster = "";
        StoreInfo.prototype.subspace = "";
        StoreInfo.create = function create(properties) {
          return new StoreInfo(properties);
        };
        StoreInfo.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.cluster != null && Object.hasOwnProperty.call(message, "cluster"))
            writer.uint32(10).string(message.cluster);
          if (message.subspace != null && Object.hasOwnProperty.call(message, "subspace"))
            writer.uint32(18).string(message.subspace);
          return writer;
        };
        StoreInfo.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        StoreInfo.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.StoreInfo();
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
        StoreInfo.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        StoreInfo.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.cluster != null && message.hasOwnProperty("cluster")) {
            if (!$util.isString(message.cluster))
              return "cluster: string expected";
          }
          if (message.subspace != null && message.hasOwnProperty("subspace")) {
            if (!$util.isString(message.subspace))
              return "subspace: string expected";
          }
          return null;
        };
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
        StoreInfo.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return StoreInfo;
      }();
      mds2.ErrorResponse = function() {
        function ErrorResponse(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        ErrorResponse.prototype.description = "";
        ErrorResponse.prototype.retryable = false;
        ErrorResponse.create = function create(properties) {
          return new ErrorResponse(properties);
        };
        ErrorResponse.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.description != null && Object.hasOwnProperty.call(message, "description"))
            writer.uint32(10).string(message.description);
          if (message.retryable != null && Object.hasOwnProperty.call(message, "retryable"))
            writer.uint32(16).bool(message.retryable);
          return writer;
        };
        ErrorResponse.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        ErrorResponse.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.ErrorResponse();
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
        ErrorResponse.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        ErrorResponse.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.description != null && message.hasOwnProperty("description")) {
            if (!$util.isString(message.description))
              return "description: string expected";
          }
          if (message.retryable != null && message.hasOwnProperty("retryable")) {
            if (typeof message.retryable !== "boolean")
              return "retryable: boolean expected";
          }
          return null;
        };
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
        ErrorResponse.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return ErrorResponse;
      }();
      mds2.Cluster = function() {
        function Cluster(properties) {
          this.replicas = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        Cluster.prototype.primary = null;
        Cluster.prototype.replicas = $util.emptyArray;
        Cluster.create = function create(properties) {
          return new Cluster(properties);
        };
        Cluster.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.primary != null && Object.hasOwnProperty.call(message, "primary"))
            $root.mds.ClusterRegion.encode(message.primary, writer.uint32(10).fork()).ldelim();
          if (message.replicas != null && message.replicas.length)
            for (var i = 0; i < message.replicas.length; ++i)
              $root.mds.ClusterRegion.encode(message.replicas[i], writer.uint32(18).fork()).ldelim();
          return writer;
        };
        Cluster.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        Cluster.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.Cluster();
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
        Cluster.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
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
        Cluster.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return Cluster;
      }();
      mds2.ClusterRegion = function() {
        function ClusterRegion(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        ClusterRegion.prototype.region = "";
        ClusterRegion.prototype.config = "";
        ClusterRegion.create = function create(properties) {
          return new ClusterRegion(properties);
        };
        ClusterRegion.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.region != null && Object.hasOwnProperty.call(message, "region"))
            writer.uint32(10).string(message.region);
          if (message.config != null && Object.hasOwnProperty.call(message, "config"))
            writer.uint32(18).string(message.config);
          return writer;
        };
        ClusterRegion.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        ClusterRegion.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.ClusterRegion();
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
        ClusterRegion.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
        ClusterRegion.verify = function verify(message) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (message.region != null && message.hasOwnProperty("region")) {
            if (!$util.isString(message.region))
              return "region: string expected";
          }
          if (message.config != null && message.hasOwnProperty("config")) {
            if (!$util.isString(message.config))
              return "config: string expected";
          }
          return null;
        };
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
        ClusterRegion.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return ClusterRegion;
      }();
      mds2.RoleList = function() {
        function RoleList(properties) {
          this.roles = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null)
                this[keys[i]] = properties[keys[i]];
          }
        }
        RoleList.prototype.roles = $util.emptyArray;
        RoleList.create = function create(properties) {
          return new RoleList(properties);
        };
        RoleList.encode = function encode2(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.roles != null && message.roles.length)
            for (var i = 0; i < message.roles.length; ++i)
              writer.uint32(10).string(message.roles[i]);
          return writer;
        };
        RoleList.encodeDelimited = function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        };
        RoleList.decode = function decode2(reader, length) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.mds.RoleList();
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
        RoleList.decodeDelimited = function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        };
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
        RoleList.prototype.toJSON = function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
        return RoleList;
      }();
      return mds2;
    }();
    module.exports = $root;
  }
});

// node_modules/@noble/ed25519/index.js
var require_ed25519 = __commonJS({
  "node_modules/@noble/ed25519/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utils = exports.verify = exports.sign = exports.getPublicKey = exports.SignResult = exports.Signature = exports.Point = exports.ExtendedPoint = exports.CURVE = void 0;
    var CURVE = {
      a: -1n,
      d: 37095705934669439343138083508754565189542113879843219016388785533085940283555n,
      P: 2n ** 255n - 19n,
      n: 2n ** 252n + 27742317777372353535851937790883648493n,
      h: 8n,
      Gx: 15112221349535400772501151409588531511454012693041857206046113283949847762202n,
      Gy: 46316835694926478169428394003475163141307993866256225615783033603165251855960n
    };
    exports.CURVE = CURVE;
    var B32 = 32;
    var SQRT_M1 = 19681161376707505956807079304988542015446066515923890162744021073123829784752n;
    var SQRT_AD_MINUS_ONE = 25063068953384623474111414158702152701244531502492656460079210482610430750235n;
    var INVSQRT_A_MINUS_D = 54469307008909316920995813868745141605393597292927456921205312896311721017578n;
    var ONE_MINUS_D_SQ = 1159843021668779879193775521855586647937357759715417654439879720876111806838n;
    var D_MINUS_ONE_SQ = 40440834346308536858101042469323190826248399146238708352240133220865137265952n;
    var ExtendedPoint = class {
      constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
      }
      static fromAffine(p) {
        if (!(p instanceof Point)) {
          throw new TypeError("ExtendedPoint#fromAffine: expected Point");
        }
        if (p.equals(Point.ZERO))
          return ExtendedPoint.ZERO;
        return new ExtendedPoint(p.x, p.y, 1n, mod(p.x * p.y));
      }
      static toAffineBatch(points) {
        const toInv = invertBatch(points.map((p) => p.z));
        return points.map((p, i) => p.toAffine(toInv[i]));
      }
      static normalizeZ(points) {
        return this.toAffineBatch(points).map(this.fromAffine);
      }
      static fromRistrettoHash(hash) {
        const r1 = bytes255ToNumberLE(hash.slice(0, B32));
        const R1 = this.calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(hash.slice(B32, B32 * 2));
        const R2 = this.calcElligatorRistrettoMap(r2);
        return R1.add(R2);
      }
      static calcElligatorRistrettoMap(r0) {
        const { d } = CURVE;
        const r = mod(SQRT_M1 * r0 * r0);
        const Ns = mod((r + 1n) * ONE_MINUS_D_SQ);
        let c = -1n;
        const D = mod((c - d * r) * mod(r + d));
        let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
        let s_ = mod(s * r0);
        if (!edIsNegative(s_))
          s_ = mod(-s_);
        if (!Ns_D_is_sq)
          s = s_;
        if (!Ns_D_is_sq)
          c = r;
        const Nt = mod(c * (r - 1n) * D_MINUS_ONE_SQ - D);
        const s2 = s * s;
        const W0 = mod((s + s) * D);
        const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
        const W2 = mod(1n - s2);
        const W3 = mod(1n + s2);
        return new ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
      }
      static fromRistrettoBytes(bytes) {
        const { a, d } = CURVE;
        const emsg = "ExtendedPoint.fromRistrettoBytes: Cannot convert bytes to Ristretto Point";
        const s = bytes255ToNumberLE(bytes);
        if (!equalBytes(numberToBytesPadded(s, B32), bytes) || edIsNegative(s))
          throw new Error(emsg);
        const s2 = mod(s * s);
        const u1 = mod(1n + a * s2);
        const u2 = mod(1n - a * s2);
        const u1_2 = mod(u1 * u1);
        const u2_2 = mod(u2 * u2);
        const v = mod(a * d * u1_2 - u2_2);
        const { isValid: isValid2, value: I } = invertSqrt(mod(v * u2_2));
        const Dx = mod(I * u2);
        const Dy = mod(I * Dx * v);
        let x = mod((s + s) * Dx);
        if (edIsNegative(x))
          x = mod(-x);
        const y = mod(u1 * Dy);
        const t = mod(x * y);
        if (!isValid2 || edIsNegative(t) || y === 0n)
          throw new Error(emsg);
        return new ExtendedPoint(x, y, 1n, t);
      }
      toRistrettoBytes() {
        let { x, y, z, t } = this;
        const u1 = mod((z + y) * (z - y));
        const u2 = mod(x * y);
        const { value: invsqrt } = invertSqrt(mod(u1 * u2 ** 2n));
        const D1 = mod(invsqrt * u1);
        const D2 = mod(invsqrt * u2);
        const zInv = mod(D1 * D2 * t);
        let D;
        if (edIsNegative(t * zInv)) {
          [x, y] = [mod(y * SQRT_M1), mod(x * SQRT_M1)];
          D = mod(D1 * INVSQRT_A_MINUS_D);
        } else {
          D = D2;
        }
        if (edIsNegative(x * zInv))
          y = mod(-y);
        let s = mod((z - y) * D);
        if (edIsNegative(s))
          s = mod(-s);
        return numberToBytesPadded(s, B32);
      }
      equals(other) {
        const a = this;
        const b = other;
        const [T1, T2, Z1, Z2] = [a.t, b.t, a.z, b.z];
        return mod(T1 * Z2) === mod(T2 * Z1);
      }
      negate() {
        return new ExtendedPoint(mod(-this.x), this.y, this.z, mod(-this.t));
      }
      double() {
        const X1 = this.x;
        const Y1 = this.y;
        const Z1 = this.z;
        const { a } = CURVE;
        const A = mod(X1 ** 2n);
        const B = mod(Y1 ** 2n);
        const C = mod(2n * Z1 ** 2n);
        const D = mod(a * A);
        const E = mod((X1 + Y1) ** 2n - A - B);
        const G = mod(D + B);
        const F = mod(G - C);
        const H = mod(D - B);
        const X3 = mod(E * F);
        const Y3 = mod(G * H);
        const T3 = mod(E * H);
        const Z3 = mod(F * G);
        return new ExtendedPoint(X3, Y3, Z3, T3);
      }
      add(other) {
        const X1 = this.x;
        const Y1 = this.y;
        const Z1 = this.z;
        const T1 = this.t;
        const X2 = other.x;
        const Y2 = other.y;
        const Z2 = other.z;
        const T2 = other.t;
        const A = mod((Y1 - X1) * (Y2 + X2));
        const B = mod((Y1 + X1) * (Y2 - X2));
        const F = mod(B - A);
        if (F === 0n) {
          return this.double();
        }
        const C = mod(Z1 * 2n * T2);
        const D = mod(T1 * 2n * Z2);
        const E = mod(D + C);
        const G = mod(B + A);
        const H = mod(D - C);
        const X3 = mod(E * F);
        const Y3 = mod(G * H);
        const T3 = mod(E * H);
        const Z3 = mod(F * G);
        return new ExtendedPoint(X3, Y3, Z3, T3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      multiplyUnsafe(scalar) {
        if (!isValidScalar(scalar))
          throw new TypeError("Point#multiply: expected number or bigint");
        let n = mod(BigInt(scalar), CURVE.n);
        if (n === 1n)
          return this;
        let p = ExtendedPoint.ZERO;
        let d = this;
        while (n > 0n) {
          if (n & 1n)
            p = p.add(d);
          d = d.double();
          n >>= 1n;
        }
        return p;
      }
      precomputeWindow(W) {
        const windows = 256 / W + 1;
        let points = [];
        let p = this;
        let base = p;
        for (let window = 0; window < windows; window++) {
          base = p;
          points.push(base);
          for (let i = 1; i < 2 ** (W - 1); i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      }
      wNAF(n, affinePoint) {
        if (!affinePoint && this.equals(ExtendedPoint.BASE))
          affinePoint = Point.BASE;
        const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
        if (256 % W) {
          throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
          precomputes = this.precomputeWindow(W);
          if (affinePoint && W !== 1) {
            precomputes = ExtendedPoint.normalizeZ(precomputes);
            pointPrecomputes.set(affinePoint, precomputes);
          }
        }
        let p = ExtendedPoint.ZERO;
        let f = ExtendedPoint.ZERO;
        const windows = 256 / W + 1;
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
          const offset = window * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += 1n;
          }
          if (wbits === 0) {
            f = f.add(window % 2 ? precomputes[offset].negate() : precomputes[offset]);
          } else {
            const cached = precomputes[offset + Math.abs(wbits) - 1];
            p = p.add(wbits < 0 ? cached.negate() : cached);
          }
        }
        return [p, f];
      }
      multiply(scalar, affinePoint) {
        if (!isValidScalar(scalar))
          throw new TypeError("Point#multiply: expected number or bigint");
        const n = mod(BigInt(scalar), CURVE.n);
        return ExtendedPoint.normalizeZ(this.wNAF(n, affinePoint))[0];
      }
      toAffine(invZ = invert(this.z)) {
        const x = mod(this.x * invZ);
        const y = mod(this.y * invZ);
        return new Point(x, y);
      }
    };
    exports.ExtendedPoint = ExtendedPoint;
    ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, 1n, mod(CURVE.Gx * CURVE.Gy));
    ExtendedPoint.ZERO = new ExtendedPoint(0n, 1n, 1n, 0n);
    var pointPrecomputes = new WeakMap();
    var Point = class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
      }
      static fromHex(hash) {
        const { d, P } = CURVE;
        const bytes = hash instanceof Uint8Array ? hash : hexToBytes(hash);
        if (bytes.length !== 32)
          throw new Error("Point.fromHex: expected 32 bytes");
        const last = bytes[31];
        const normedLast = last & ~128;
        const isLastByteOdd = (last & 128) !== 0;
        const normed = Uint8Array.from(Array.from(bytes.slice(0, 31)).concat(normedLast));
        const y = bytesToNumberLE(normed);
        if (y >= P)
          throw new Error("Point.fromHex expects hex <= Fp");
        const y2 = mod(y * y);
        const u = mod(y2 - 1n);
        const v = mod(d * y2 + 1n);
        let { isValid: isValid2, value: x } = uvRatio(u, v);
        if (!isValid2)
          throw new Error("Point.fromHex: invalid y coordinate");
        const isXOdd = (x & 1n) === 1n;
        if (isLastByteOdd !== isXOdd) {
          x = mod(-x);
        }
        return new Point(x, y);
      }
      static async fromPrivateKey(privateKey) {
        const privBytes = await exports.utils.sha512(normalizePrivateKey(privateKey));
        return Point.BASE.multiply(encodePrivate(privBytes));
      }
      toRawBytes() {
        const hex = numberToHex(this.y);
        const u8 = new Uint8Array(B32);
        for (let i = hex.length - 2, j = 0; j < B32 && i >= 0; i -= 2, j++) {
          u8[j] = Number.parseInt(hex[i] + hex[i + 1], 16);
        }
        const mask = this.x & 1n ? 128 : 0;
        u8[B32 - 1] |= mask;
        return u8;
      }
      toHex() {
        return bytesToHex(this.toRawBytes());
      }
      toX25519() {
        return mod((1n + this.y) * invert(1n - this.y));
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }
      negate() {
        return new Point(mod(-this.x), this.y);
      }
      add(other) {
        return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
      }
      subtract(other) {
        return this.add(other.negate());
      }
      multiply(scalar) {
        return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
      }
    };
    exports.Point = Point;
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
    Point.ZERO = new Point(0n, 1n);
    var Signature = class {
      constructor(r, s) {
        this.r = r;
        this.s = s;
      }
      static fromHex(hex) {
        hex = ensureBytes(hex);
        const r = Point.fromHex(hex.slice(0, 32));
        const s = bytesToNumberLE(hex.slice(32));
        if (!isWithinCurveOrder(s))
          throw new Error("Signature.fromHex expects s <= CURVE.n");
        return new Signature(r, s);
      }
      toRawBytes() {
        const numberBytes = hexToBytes(numberToHex(this.s)).reverse();
        const sBytes = new Uint8Array(B32);
        sBytes.set(numberBytes);
        const res = new Uint8Array(B32 * 2);
        res.set(this.r.toRawBytes());
        res.set(sBytes, 32);
        return res;
      }
      toHex() {
        return bytesToHex(this.toRawBytes());
      }
    };
    exports.Signature = Signature;
    exports.SignResult = Signature;
    function concatBytes(...arrays) {
      if (arrays.length === 1)
        return arrays[0];
      const length = arrays.reduce((a, arr) => a + arr.length, 0);
      const result = new Uint8Array(length);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
      }
      return result;
    }
    function bytesToHex(uint8a) {
      let hex = "";
      for (let i = 0; i < uint8a.length; i++) {
        hex += uint8a[i].toString(16).padStart(2, "0");
      }
      return hex;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string") {
        throw new TypeError("hexToBytes: expected string, got " + typeof hex);
      }
      if (hex.length % 2)
        throw new Error("hexToBytes: received invalid unpadded hex");
      const array = new Uint8Array(hex.length / 2);
      for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        array[i] = Number.parseInt(hex.slice(j, j + 2), 16);
      }
      return array;
    }
    function numberToHex(num) {
      const hex = num.toString(16);
      return hex.length & 1 ? `0${hex}` : hex;
    }
    function numberToBytesPadded(num, length = B32) {
      const hex = numberToHex(num).padStart(length * 2, "0");
      return hexToBytes(hex).reverse();
    }
    function edIsNegative(num) {
      return (mod(num) & 1n) === 1n;
    }
    function isValidScalar(num) {
      if (typeof num === "bigint" && num > 0n)
        return true;
      if (typeof num === "number" && num > 0 && Number.isSafeInteger(num))
        return true;
      return false;
    }
    function bytesToNumberLE(uint8a) {
      let value = 0n;
      for (let i = 0; i < uint8a.length; i++) {
        value += BigInt(uint8a[i]) << 8n * BigInt(i);
      }
      return value;
    }
    function bytes255ToNumberLE(bytes) {
      return mod(bytesToNumberLE(bytes) & 2n ** 255n - 1n);
    }
    function mod(a, b = CURVE.P) {
      const res = a % b;
      return res >= 0n ? res : b + res;
    }
    function invert(number, modulo = CURVE.P) {
      if (number === 0n || modulo <= 0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
      }
      let a = mod(number, modulo);
      let b = modulo;
      let [x, y, u, v] = [0n, 1n, 1n, 0n];
      while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        [b, a] = [a, r];
        [x, y] = [u, v];
        [u, v] = [m, n];
      }
      const gcd = b;
      if (gcd !== 1n)
        throw new Error("invert: does not exist");
      return mod(x, modulo);
    }
    function invertBatch(nums, n = CURVE.P) {
      const len = nums.length;
      const scratch = new Array(len);
      let acc = 1n;
      for (let i = 0; i < len; i++) {
        if (nums[i] === 0n)
          continue;
        scratch[i] = acc;
        acc = mod(acc * nums[i], n);
      }
      acc = invert(acc, n);
      for (let i = len - 1; i >= 0; i--) {
        if (nums[i] === 0n)
          continue;
        let tmp = mod(acc * nums[i], n);
        nums[i] = mod(acc * scratch[i], n);
        acc = tmp;
      }
      return nums;
    }
    function pow2(x, power) {
      const { P } = CURVE;
      let res = x;
      while (power-- > 0n) {
        res *= res;
        res %= P;
      }
      return res;
    }
    function pow_2_252_3(x) {
      const { P } = CURVE;
      const x2 = x * x % P;
      const b2 = x2 * x % P;
      const b4 = pow2(b2, 2n) * b2 % P;
      const b5 = pow2(b4, 1n) * x % P;
      const b10 = pow2(b5, 5n) * b5 % P;
      const b20 = pow2(b10, 10n) * b10 % P;
      const b40 = pow2(b20, 20n) * b20 % P;
      const b80 = pow2(b40, 40n) * b40 % P;
      const b160 = pow2(b80, 80n) * b80 % P;
      const b240 = pow2(b160, 80n) * b80 % P;
      const b250 = pow2(b240, 10n) * b10 % P;
      const pow_p_5_8 = pow2(b250, 2n) * x % P;
      return pow_p_5_8;
    }
    function uvRatio(u, v) {
      const v3 = mod(v * v * v);
      const v7 = mod(v3 * v3 * v);
      let x = mod(u * v3 * pow_2_252_3(u * v7));
      const vx2 = mod(v * x * x);
      const root1 = x;
      const root2 = mod(x * SQRT_M1);
      const useRoot1 = vx2 === u;
      const useRoot2 = vx2 === mod(-u);
      const noRoot = vx2 === mod(-u * SQRT_M1);
      if (useRoot1)
        x = root1;
      if (useRoot2 || noRoot)
        x = root2;
      if (edIsNegative(x))
        x = mod(-x);
      return { isValid: useRoot1 || useRoot2, value: x };
    }
    function invertSqrt(number) {
      return uvRatio(1n, number);
    }
    async function sha512ToNumberLE(...args) {
      const messageArray = concatBytes(...args);
      const hash = await exports.utils.sha512(messageArray);
      const value = bytesToNumberLE(hash);
      return mod(value, CURVE.n);
    }
    function keyPrefix(privateBytes) {
      return privateBytes.slice(B32);
    }
    function encodePrivate(privateBytes) {
      const last = B32 - 1;
      const head = privateBytes.slice(0, B32);
      head[0] &= 248;
      head[last] &= 127;
      head[last] |= 64;
      return mod(bytesToNumberLE(head), CURVE.n);
    }
    function equalBytes(b1, b2) {
      if (b1.length !== b2.length) {
        return false;
      }
      for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    function ensureBytes(hash) {
      return hash instanceof Uint8Array ? hash : hexToBytes(hash);
    }
    function isWithinCurveOrder(num) {
      return 0 < num && num < CURVE.n;
    }
    function normalizePrivateKey(key) {
      let num;
      if (typeof key === "bigint" || typeof key === "number" && Number.isSafeInteger(key)) {
        num = BigInt(key);
        if (num < 0n || num > 2n ** 256n)
          throw new Error("Expected 32 bytes of private key");
        key = num.toString(16).padStart(B32 * 2, "0");
      }
      if (typeof key === "string") {
        if (key.length !== 64)
          throw new Error("Expected 32 bytes of private key");
        return hexToBytes(key);
      } else if (key instanceof Uint8Array) {
        if (key.length !== 32)
          throw new Error("Expected 32 bytes of private key");
        return key;
      } else {
        throw new TypeError("Expected valid private key");
      }
    }
    async function getPublicKey2(privateKey) {
      const key = await Point.fromPrivateKey(privateKey);
      return typeof privateKey === "string" ? key.toHex() : key.toRawBytes();
    }
    exports.getPublicKey = getPublicKey2;
    async function sign2(hash, privateKey) {
      const privBytes = await exports.utils.sha512(normalizePrivateKey(privateKey));
      const p = encodePrivate(privBytes);
      const P = Point.BASE.multiply(p);
      const msg = ensureBytes(hash);
      const r = await sha512ToNumberLE(keyPrefix(privBytes), msg);
      const R = Point.BASE.multiply(r);
      const h = await sha512ToNumberLE(R.toRawBytes(), P.toRawBytes(), msg);
      const S = mod(r + h * p, CURVE.n);
      const sig = new Signature(R, S);
      return typeof hash === "string" ? sig.toHex() : sig.toRawBytes();
    }
    exports.sign = sign2;
    async function verify(signature, hash, publicKey) {
      hash = ensureBytes(hash);
      if (!(publicKey instanceof Point))
        publicKey = Point.fromHex(publicKey);
      if (!(signature instanceof Signature))
        signature = Signature.fromHex(signature);
      const hs = await sha512ToNumberLE(signature.r.toRawBytes(), publicKey.toRawBytes(), hash);
      const Ph = ExtendedPoint.fromAffine(publicKey).multiplyUnsafe(hs);
      const Gs = ExtendedPoint.BASE.multiply(signature.s);
      const RPh = ExtendedPoint.fromAffine(signature.r).add(Ph);
      return RPh.subtract(Gs).multiplyUnsafe(8n).equals(ExtendedPoint.ZERO);
    }
    exports.verify = verify;
    Point.BASE._setWindowSize(8);
    var crypto = (() => {
      const webCrypto = typeof self === "object" && "crypto" in self ? self.crypto : void 0;
      const nodeRequire = typeof module !== "undefined" && typeof __require === "function";
      return {
        node: nodeRequire && !webCrypto ? __require("crypto") : void 0,
        web: webCrypto
      };
    })();
    exports.utils = {
      TORSION_SUBGROUP: [
        "0100000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
        "0000000000000000000000000000000000000000000000000000000000000080",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
        "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
      ],
      randomBytes: (bytesLength = 32) => {
        if (crypto.web) {
          return crypto.web.getRandomValues(new Uint8Array(bytesLength));
        } else if (crypto.node) {
          const { randomBytes } = crypto.node;
          return new Uint8Array(randomBytes(bytesLength).buffer);
        } else {
          throw new Error("The environment doesn't have randomBytes function");
        }
      },
      randomPrivateKey: () => {
        let i = 1024;
        while (i--) {
          const b32 = exports.utils.randomBytes(32);
          const num = bytesToNumberLE(b32);
          if (num > 1n && num < CURVE.n)
            return b32;
        }
        throw new Error("Valid private key was not found in 1024 iterations. PRNG is broken");
      },
      sha512: async (message) => {
        if (crypto.web) {
          const buffer = await crypto.web.subtle.digest("SHA-512", message.buffer);
          return new Uint8Array(buffer);
        } else if (crypto.node) {
          return Uint8Array.from(crypto.node.createHash("sha512").update(message).digest());
        } else {
          throw new Error("The environment doesn't have sha512 function");
        }
      },
      precompute(windowSize = 8, point = Point.BASE) {
        const cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(1n);
        return cached;
      }
    };
  }
});

// node_modules/async-sema/lib/index.js
var require_lib = __commonJS({
  "node_modules/async-sema/lib/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RateLimit = exports.Sema = void 0;
    var events_1 = __importDefault(__require("events"));
    function arrayMove(src, srcIndex, dst, dstIndex, len) {
      for (let j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
      }
    }
    function pow2AtLeast(n) {
      n = n >>> 0;
      n = n - 1;
      n = n | n >> 1;
      n = n | n >> 2;
      n = n | n >> 4;
      n = n | n >> 8;
      n = n | n >> 16;
      return n + 1;
    }
    function getCapacity(capacity) {
      return pow2AtLeast(Math.min(Math.max(16, capacity), 1073741824));
    }
    var Deque = class {
      constructor(capacity) {
        this._capacity = getCapacity(capacity);
        this._length = 0;
        this._front = 0;
        this.arr = [];
      }
      push(item) {
        const length = this._length;
        this.checkCapacity(length + 1);
        const i = this._front + length & this._capacity - 1;
        this.arr[i] = item;
        this._length = length + 1;
        return length + 1;
      }
      pop() {
        const length = this._length;
        if (length === 0) {
          return void 0;
        }
        const i = this._front + length - 1 & this._capacity - 1;
        const ret = this.arr[i];
        this.arr[i] = void 0;
        this._length = length - 1;
        return ret;
      }
      shift() {
        const length = this._length;
        if (length === 0) {
          return void 0;
        }
        const front = this._front;
        const ret = this.arr[front];
        this.arr[front] = void 0;
        this._front = front + 1 & this._capacity - 1;
        this._length = length - 1;
        return ret;
      }
      get length() {
        return this._length;
      }
      checkCapacity(size) {
        if (this._capacity < size) {
          this.resizeTo(getCapacity(this._capacity * 1.5 + 16));
        }
      }
      resizeTo(capacity) {
        const oldCapacity = this._capacity;
        this._capacity = capacity;
        const front = this._front;
        const length = this._length;
        if (front + length > oldCapacity) {
          const moveItemsCount = front + length & oldCapacity - 1;
          arrayMove(this.arr, 0, this.arr, oldCapacity, moveItemsCount);
        }
      }
    };
    var ReleaseEmitter = class extends events_1.default {
    };
    function isFn(x) {
      return typeof x === "function";
    }
    function defaultInit() {
      return "1";
    }
    var Sema2 = class {
      constructor(nr, { initFn = defaultInit, pauseFn, resumeFn, capacity = 10 } = {}) {
        if (isFn(pauseFn) !== isFn(resumeFn)) {
          throw new Error("pauseFn and resumeFn must be both set for pausing");
        }
        this.nrTokens = nr;
        this.free = new Deque(nr);
        this.waiting = new Deque(capacity);
        this.releaseEmitter = new ReleaseEmitter();
        this.noTokens = initFn === defaultInit;
        this.pauseFn = pauseFn;
        this.resumeFn = resumeFn;
        this.paused = false;
        this.releaseEmitter.on("release", (token) => {
          const p = this.waiting.shift();
          if (p) {
            p.resolve(token);
          } else {
            if (this.resumeFn && this.paused) {
              this.paused = false;
              this.resumeFn();
            }
            this.free.push(token);
          }
        });
        for (let i = 0; i < nr; i++) {
          this.free.push(initFn());
        }
      }
      tryAcquire() {
        return this.free.pop();
      }
      async acquire() {
        let token = this.tryAcquire();
        if (token !== void 0) {
          return token;
        }
        return new Promise((resolve, reject) => {
          if (this.pauseFn && !this.paused) {
            this.paused = true;
            this.pauseFn();
          }
          this.waiting.push({ resolve, reject });
        });
      }
      release(token) {
        this.releaseEmitter.emit("release", this.noTokens ? "1" : token);
      }
      drain() {
        const a = new Array(this.nrTokens);
        for (let i = 0; i < this.nrTokens; i++) {
          a[i] = this.acquire();
        }
        return Promise.all(a);
      }
      nrWaiting() {
        return this.waiting.length;
      }
    };
    exports.Sema = Sema2;
    function RateLimit(rps, { timeUnit = 1e3, uniformDistribution = false } = {}) {
      const sema = new Sema2(uniformDistribution ? 1 : rps);
      const delay = uniformDistribution ? timeUnit / rps : timeUnit;
      return async function rl() {
        await sema.acquire();
        setTimeout(() => sema.release(), delay);
      };
    }
    exports.RateLimit = RateLimit;
  }
});

// src/client.ts
var import_isomorphic_ws = __toModule(require_node());
var import_protocol = __toModule(require_protocol());
var ed25519 = __toModule(require_ed25519());

// node_modules/js-base64/base64.mjs
var version = "3.7.2";
var VERSION = version;
var _hasatob = typeof atob === "function";
var _hasbtoa = typeof btoa === "function";
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length; ) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
      throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = _hasbtoa ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
  const maxargs = 4096;
  let strs = [];
  for (let i = 0, l = u8a.length; i < l; i += maxargs) {
    strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
  }
  return _btoa(strs.join(""));
};
var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
var cb_utob = (c) => {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  } else {
    var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
    return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = (u) => u.replace(re_utob, cb_utob);
var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
var encodeURI = (src) => encode(src, true);
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = (cccc) => {
  switch (cccc.length) {
    case 4:
      var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
      return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
    case 3:
      return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
    default:
      return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
  }
};
var btou = (b) => b.replace(re_btou, cb_btou);
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "", r1, r2;
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
};
var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a), (c) => c.charCodeAt(0));
var toUint8Array = (a) => _toUint8Array(_unURI(a));
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
var decode = (src) => _decode(_unURI(src));
var isValid = (src) => {
  if (typeof src !== "string")
    return false;
  const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
  return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
var _noEnum = (v) => {
  return {
    value: v,
    enumerable: false,
    writable: true,
    configurable: true
  };
};
var extendString = function() {
  const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
  _add("fromBase64", function() {
    return decode(this);
  });
  _add("toBase64", function(urlsafe) {
    return encode(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return encode(this, true);
  });
  _add("toBase64URL", function() {
    return encode(this, true);
  });
  _add("toUint8Array", function() {
    return toUint8Array(this);
  });
};
var extendUint8Array = function() {
  const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
  _add("toBase64", function(urlsafe) {
    return fromUint8Array(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return fromUint8Array(this, true);
  });
  _add("toBase64URL", function() {
    return fromUint8Array(this, true);
  });
};
var extendBuiltins = () => {
  extendString();
  extendUint8Array();
};
var gBase64 = {
  version,
  VERSION,
  atob: _atob,
  atobPolyfill,
  btoa: _btoa,
  btoaPolyfill,
  fromBase64: decode,
  toBase64: encode,
  encode,
  encodeURI,
  encodeURL: encodeURI,
  utob,
  btou,
  decode,
  isValid,
  fromUint8Array,
  toUint8Array,
  extendString,
  extendUint8Array,
  extendBuiltins
};

// src/client.ts
var import_async_sema = __toModule(require_lib());
import winston from "winston";
var MdsClient = class {
  constructor({ endpoint, secretKey, store, numLanes }) {
    this.laneCompletions = /* @__PURE__ */ new Map();
    this.broken = false;
    this.serverInfo = null;
    this.ws = null;
    this.publicKey = null;
    this.store = store;
    this.endpoint = endpoint;
    this.secretKey = gBase64.toUint8Array(secretKey);
    if (this.secretKey.length != 32) {
      throw new Error("Invalid secret key");
    }
    this.numLanes = numLanes;
    this.laneSem = new import_async_sema.Sema(numLanes);
    this.lanePool = [];
    for (let i = 0; i < numLanes; i++) {
      this.lanePool.push(i);
    }
  }
  async init() {
    this.publicKey = await ed25519.getPublicKey(this.secretKey);
    winston.info(`[MdsClient] public key: ${Buffer.from(this.publicKey).toString("hex")}`);
    this.ws = new import_isomorphic_ws.default(this.endpoint);
    const authProm = new Promise((resolve, reject) => {
      this.ws.onerror = (e) => {
        reject(new Error(`ws error: ${e.error}`));
      };
      this.ws.onclose = (e) => {
        reject(new Error(`ws closed: ${e.reason}`));
      };
      this.ws.onopen = () => {
        winston.info("[MdsClient] connected");
        this.ws.onmessage = async (event) => {
          try {
            const challenge = import_protocol.mds.LoginChallenge.decode(await normalizeWsData(event.data));
            const sig = await ed25519.sign(challenge.challenge, this.secretKey);
            const login = import_protocol.mds.Login.encode({
              store: this.store,
              publicKey: this.publicKey,
              signature: sig,
              muxWidth: this.numLanes
            });
            this.ws.send(login.finish());
            this.ws.onmessage = async (event2) => {
              this.resetWsHandlers();
              try {
                const loginResult = import_protocol.mds.LoginResponse.decode(await normalizeWsData(event2.data));
                if (loginResult.ok) {
                  resolve({
                    version: challenge.version
                  });
                } else {
                  reject(new Error("Login failed: " + loginResult.error));
                }
              } catch (e) {
                reject(e);
              }
            };
          } catch (e) {
            this.resetWsHandlers();
            reject(e);
          }
        };
      };
    });
    this.serverInfo = await authProm;
    winston.info("[MdsClient] logged in");
    this.ws.onmessage = this.onWsMessage.bind(this);
    this.ws.onerror = this.onWsError.bind(this);
    this.ws.onclose = this.onWsClose.bind(this);
  }
  close() {
    this.ws?.close();
  }
  getServerInfo() {
    if (!this.serverInfo)
      throw new Error("not initialized");
    return this.serverInfo;
  }
  resetWsHandlers() {
    this.ws.onmessage = (event) => {
      winston.error("unknown ws event", event);
    };
    this.ws.onerror = (event) => {
      winston.error("ws error", event);
    };
    this.ws.onclose = (event) => {
      winston.error("ws close", event);
    };
  }
  async onWsMessage(e) {
    const msg = import_protocol.mds.Response.decode(await normalizeWsData(e.data));
    this.laneCompletions.get(msg.lane).resolve(msg);
    this.laneCompletions.delete(msg.lane);
  }
  onWsError(e) {
    winston.error("ws error", e);
    this.laneCompletions.forEach((v, k) => {
      v.reject(new Error("websocket error"));
    });
    this.laneCompletions = /* @__PURE__ */ new Map();
    this.broken = true;
  }
  onWsClose(e) {
    winston.error("onWsClose", e);
    this.laneCompletions.forEach((v, k) => {
      v.reject(new Error("websocket closed"));
    });
    this.laneCompletions = /* @__PURE__ */ new Map();
    this.broken = true;
  }
  async grabLane() {
    await this.laneSem.acquire();
    const lane = this.lanePool.pop();
    if (typeof lane !== "number")
      throw new Error("lane pool is empty");
    return lane;
  }
  releaseLane(lane) {
    this.lanePool.push(lane);
    this.laneSem.release();
  }
  waitResponse(lane) {
    return new Promise((resolve, reject) => {
      if (this.broken) {
        reject(new Error("websocket broken"));
      } else {
        this.laneCompletions.set(lane, { resolve, reject });
      }
    });
  }
  async run(program, data, retryable = false) {
    const lane = await this.grabLane();
    try {
      const reqI = {
        lane,
        program
      };
      if (data !== void 0) {
        reqI.data = JSON.stringify(data);
      }
      const req = import_protocol.mds.Request.encode(reqI);
      const reqBytes = req.finish();
      for (let i = 0; i < 5; i++) {
        this.ws.send(reqBytes);
        const res = await this.waitResponse(lane);
        if (res.error) {
          if (retryable && res.error.retryable) {
            winston.warn(`retrying task`, { attempt: i, error: res.error.description || "" });
            continue;
          } else {
            throw new Error("remote error: " + res.error.description);
          }
        }
        return JSON.parse(res.output);
      }
      throw new Error("failed to complete task after retries");
    } finally {
      this.releaseLane(lane);
    }
  }
};
async function normalizeWsData(data) {
  if (data instanceof Uint8Array) {
    return data;
  } else if (typeof Blob !== void 0 && data instanceof Blob) {
    return new Uint8Array(await data.arrayBuffer());
  } else {
    throw new Error("Invalid WebSocket data type");
  }
}

// src/pathutil.ts
function tryPrettyPrintPath(path) {
  let idx = 0;
  let segs = [];
  while (idx < path.length) {
    if (path[idx] == 2) {
      let seg = [];
      let fin = false;
      idx++;
      while (idx < path.length) {
        let b = path[idx++];
        if (b == 0) {
          fin = true;
          break;
        }
        seg.push(b);
      }
      if (!fin)
        return void 0;
      segs.push(new TextDecoder().decode(Uint8Array.from(seg)));
    } else {
      return void 0;
    }
  }
  return segs.join("/");
}
function encodePath(path) {
  const raw = path.map((seg) => new TextEncoder().encode(seg));
  const buf = new Uint8Array(raw.reduce((acc, cur) => acc + cur.length + 2, 0));
  let offset = 0;
  for (const seg of raw) {
    buf[offset++] = 2;
    buf.set(seg, offset);
    offset += seg.length;
    buf[offset++] = 0;
  }
  return buf;
}
export {
  MdsClient,
  encodePath,
  tryPrettyPrintPath
};
/*! noble-ed25519 - MIT License (c) Paul Miller (paulmillr.com) */
