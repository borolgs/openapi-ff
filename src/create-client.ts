import {
  Client,
  ClientMethod,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";

import { createEffect, Effect } from "effector";
import {
  MediaType,
  HttpMethod,
  PathsWithMethod,
} from "openapi-typescript-helpers";
import {
  httpError,
  type HttpError,
  type NetworkError,
  networkError,
  type FarfetchedError,
} from "@farfetched/core";

const API = "API";
export interface ApiError<Status extends number = number, ApiResponse = unknown>
  extends FarfetchedError<typeof API> {
  status: Status;
  statusText: string;
  response: ApiResponse;
}

type WithError<T = any, P = Record<string, unknown>> = P & { error: T };

function apiError<
  Status extends number = number,
  ErrorResponse = unknown
>(config: {
  status: Status;
  statusText: string;
  response: ErrorResponse;
}): ApiError<Status, ErrorResponse> {
  return {
    ...config,
    errorType: API,
    explanation: "Request was finished with unsuccessful HTTP code",
  };
}

export function isApiError(args: WithError): args is WithError<ApiError> {
  return args.error?.errorType === API;
}

type CreateApiEffectOptions<Init> = { mapParams?: (init: any) => Init };

type InitOrPrependInit<
  Init,
  PrependInit,
  Options extends CreateApiEffectOptions<Init>
> = Options extends { mapParams: (init: any) => any } ? PrependInit : Init;

type CreateApiEffect<
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType
> = <
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Response extends Required<FetchResponse<Paths[Path][Method], Init, Media>>,
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Options extends CreateApiEffectOptions<Init> = {}
>(
  method: Method,
  path: Path,
  options?: Options
) => Effect<
  Init extends undefined
    ? void
    : InitOrPrependInit<
        Init,
        Parameters<NonNullable<Options["mapParams"]>>[0],
        Options
      >,
  Response["data"],
  ApiError<number, Response["error"]> | HttpError | NetworkError
>;

export interface OpenapiEffectorClient<
  Paths extends {},
  Media extends MediaType = MediaType
> {
  createApiEffect: CreateApiEffect<Paths, Media>;
}

export function createClient<
  Paths extends {},
  Media extends MediaType = MediaType
>(client: Client<Paths, Media>): OpenapiEffectorClient<Paths, Media> {
  return {
    createApiEffect: (method, url, options) => {
      const mth = method.toUpperCase() as Uppercase<typeof method>;
      const fn = client[mth] as ClientMethod<Paths, typeof method, Media>;

      return createEffect(async (init: any) => {
        const { data, error, response } = await fn(
          url,
          options?.mapParams?.(init) ?? init
        ).catch((cause) => {
          throw networkError({
            reason: cause?.message ?? null,
            cause,
          });
        });

        if (error != null && error !== "") {
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
      }) as any;
    },
  };
}