import {
  type Contract,
  httpError,
  networkError,
  type FarfetchedError,
  type HttpError,
  type NetworkError,
} from '@farfetched/core';
import { attach, createStore, type Store, type Effect } from 'effector';
import {
  type ClientMethod,
  type FetchResponse,
  type MaybeOptionalInit,
  type Client,
  type FetchOptions,
  mergeHeaders,
} from 'openapi-fetch';

import type {
  ErrorStatus,
  HttpMethod,
  FilterKeys,
  ResponseObjectMap,
  PathsWithMethod,
} from './types';

export type OpenapiEffectorClient<Paths extends {}> = {
  createApiEffect: CreateApiEffect<Paths>;
};

type CreateApiEffect<Paths extends Record<string, Record<HttpMethod, {}>>> = {
  // Simple
  <
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Operation extends Paths[Path][Method],
    Responses extends ResponseObjectMap<Operation>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
    Response extends Required<FetchResponse<Paths[Path][Method], Init, `${string}/json`>>,
  >(
    method: Method,
    path: Path,
  ): {
    effect: Effect<Init, Response['data'], ApiErrors<Responses> | HttpError | NetworkError>;
    contract: Contract<unknown, Response['data']>;
  };

  // Mapper with source
  <
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Operation extends Paths[Path][Method],
    Responses extends ResponseObjectMap<Operation>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
    Response extends Required<FetchResponse<Paths[Path][Method], Init, `${string}/json`>>,
    Source,
    NewInit = Init,
  >(
    method: Method,
    path: Path,
    options: {
      mapParams: {
        source: Store<Source>;
        fn: (source: Source, params: NewInit) => Init;
      };
    },
  ): {
    effect: Effect<NewInit, Response['data'], ApiErrors<Responses> | HttpError | NetworkError>;
    contract: Contract<unknown, Response['data']>;
  };

  // Mapper
  <
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Operation extends Paths[Path][Method],
    Responses extends ResponseObjectMap<Operation>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
    Response extends Required<FetchResponse<Paths[Path][Method], Init, `${string}/json`>>,
    NewInit,
  >(
    method: Method,
    path: Path,
    options: {
      mapParams: (params: NewInit) => Init;
    },
  ): {
    effect: Effect<NewInit, Response['data'], ApiErrors<Responses> | HttpError | NetworkError>;
    contract: Contract<unknown, Response['data']>;
  };
};

const API = 'API';
export type ApiError<S extends ErrorStatus, T> = {
  status: S;
  statusText: string;
  response: T;
} & FarfetchedError<typeof API>;

type ApiErrors<Responses extends Record<string | number, any>> = {
  [K in keyof Responses]: K extends ErrorStatus
    ? Responses[K] extends { content: Record<string, any> }
      ? ApiError<K, FilterKeys<Responses[K]['content'], `${string}/json`>>
      : never
    : never;
}[keyof Responses & ErrorStatus];

type WithError<T = any, P = Record<string, unknown>> = P & { error: T };

// TODO
export function isApiError<S extends ErrorStatus, R>(
  args: WithError,
): args is WithError<ApiError<S, R>> {
  return args.error?.errorType === API;
}

export function createEffectorClient<Paths extends {}>(
  client: Client<Paths>,
  options?: {
    createContract?: <Method extends HttpMethod, Path extends PathsWithMethod<Paths, Method>>(
      method: Method,
      path: Path,
    ) => Contract<unknown, unknown>;
  },
): OpenapiEffectorClient<Paths> {
  const createApiEffect = (method: any, path: any, opts: any) => {
    const mth = method.toUpperCase() as Uppercase<typeof method>;
    const fn = (client as any)[mth] as ClientMethod<Paths, typeof method, `${string}/json`>;

    const source = opts?.mapParams?.source ?? createStore(null);

    const hasMapper = !!opts?.mapParams;
    const withSource = !!opts?.mapParams.fn;
    const mapper = hasMapper ? (withSource ? opts.mapParams.fn : opts.mapParams) : null;

    const requestFx = attach({
      source,
      effect: async (s: any, init: any) => {
        let mappedInit = init;
        if (hasMapper) {
          if (withSource) {
            mappedInit = mapper(s, init);
          } else {
            mappedInit = mapper(init);
          }
        }

        const { data, error, response } = await fn(path, mappedInit).catch((cause) => {
          throw networkError({
            reason: cause?.message ?? null,
            cause,
          });
        });

        if (error != null && error !== '') {
          throw apiError({
            status: response.status,
            statusText: response.statusText,
            response: error,
          });
        }

        if (!response.ok) {
          throw httpError({
            status: response.status,
            statusText: response.statusText,
            response: null,
          });
        }

        return data;
      },
    });

    return {
      effect: requestFx,
      contract: (options?.createContract?.(method, path) ?? noopContract()) as any,
    };
  };

  return { createApiEffect: createApiEffect as any };
}

function apiError<Status extends number = number, ErrorResponse = unknown>(config: {
  status: Status;
  statusText: string;
  response: ErrorResponse;
}): any {
  return {
    ...config,
    errorType: API,
    explanation: 'Request was finished with unsuccessful API response',
  };
}

export function mergeInitHeaders<T>(init: FetchOptions<T>, headers: Record<string, any>) {
  return {
    ...init,
    headers: mergeHeaders(init.headers, headers),
  };
}

function noopContract<T>() {
  return {
    isData: (_: any): _ is T => true,
    getErrorMessages: () => [],
  };
}
