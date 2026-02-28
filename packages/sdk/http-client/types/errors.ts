export type ErrorHandlerRecord = {
  badRequest?: string;
  unauthorized?: string;
  paymentRequired?: string;
  forbidden?: string;
  notFound?: string;
  methodNotAllowed?: string;
  notAcceptable?: string;
  proxyAuthRequired?: string;
  requestTimeout?: string;
  conflict?: string;
  gone?: string;
  lengthRequired?: string;
  preconditionFailed?: string;
  payloadTooLarge?: string;
  uriTooLong?: string;
  unsupportedMediaType?: string;
  rangeNotSatisfiable?: string;
  expectationFailed?: string;
  imATeapot?: string;
  misdirectedRequest?: string;
  unprocessableEntity?: string;
  locked?: string;
  failedDependency?: string;
  tooEarly?: string;
  upgradeRequired?: string;
  preconditionRequired?: string;
  tooManyRequests?: string;
  requestHeaderFieldsTooLarge?: string;
  unavailableForLegalReasons?: string;
  internalServerError?: string;
  notImplemented?: string;
  badGateway?: string;
  serviceUnavailable?: string;
  gatewayTimeout?: string;
  httpVersionNotSupported?: string;
  variantAlsoNegotiates?: string;
  insufficientStorage?: string;
  loopDetected?: string;
  notExtended?: string;
  networkAuthenticationRequired?: string;
};

export type NormalizedError = {
  message: string;
  status?: number;
  body?: unknown;
  isAbort: boolean;
};

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = 'HttpError';
  }
}
