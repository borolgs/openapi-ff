/* eslint-disable */

// Types from openapi-typescript-helpers:
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';
/** 2XX statuses */

// biome-ignore format: keep on one line
export type ErrorStatus = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | '5XX' | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 427 | 428 | 429 | 430 | 431 | 444 | 450 | 451 | 497 | 498 | 499 | '4XX' | "default";

/** Find first match of multiple keys */
export type FilterKeys<Obj, Matchers> = Obj[keyof Obj & Matchers];

/** Return `responses` for an Operation Object */
export type ResponseObjectMap<T> = T extends { responses: any } ? T['responses'] : unknown;

/** Given an OpenAPI **Paths Object**, find all paths that have the given method */
export type PathsWithMethod<Paths extends {}, PathnameMethod extends HttpMethod> = {
  [Pathname in keyof Paths]: Paths[Pathname] extends {
    [K in PathnameMethod]: any;
  }
    ? Pathname
    : never;
}[keyof Paths];

export type HasRequiredKeys<T> = {} extends T ? true : false;
// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export type OptionalParams<T> = HasRequiredKeys<T> extends true ? T | void : T;
