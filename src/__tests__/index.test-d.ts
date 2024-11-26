import { describe, test, expectTypeOf } from "vitest";
import createFetchClient from "openapi-fetch";
import { type EventCallable, type Event, Effect } from "effector";
import { ApiError, createClient } from "../create-client";
import { components, paths } from "./api";
import {
  Contract,
  createQuery,
  HttpError,
  NetworkError,
} from "@farfetched/core";

describe("createApiEffect", () => {
  const fetchClient = createFetchClient<paths>();
  const { createApiEffect, createApiEffectWithContract } =
    createClient(fetchClient);

  test("query has correct types", async () => {
    const query = createQuery({
      effect: createApiEffect("get", "/blogposts"),
    });

    expectTypeOf(query.finished.success).toMatchTypeOf<
      Event<{
        result: components["schemas"]["Post"][];
      }>
    >();

    expectTypeOf(query.finished.failure).toMatchTypeOf<
      Event<{
        error:
          | ApiError<
              number,
              components["responses"]["Error"]["content"]["application/json"]
            >
          | HttpError
          | NetworkError;
      }>
    >();
  });

  test("effect with contract has correct types", async () => {
    const { effect, contract } = createApiEffectWithContract(
      "get",
      "/blogposts"
    );

    expectTypeOf(effect).toMatchTypeOf<
      Effect<
        any,
        components["schemas"]["Post"][],
        | ApiError<
            number,
            components["responses"]["Error"]["content"]["application/json"]
          >
        | HttpError
        | NetworkError
      >
    >();

    expectTypeOf(contract).toMatchTypeOf<
      Contract<unknown, components["schemas"]["Post"][]>
    >();
  });

  test("effect has correct types after mapping", async () => {
    const query = createQuery({
      effect: createApiEffect("get", "/blogposts/{post_id}", {
        mapParams({ postId }: { postId: string }) {
          return { params: { path: { post_id: postId } } };
        },
      }),
    });

    expectTypeOf(query.start).toEqualTypeOf<
      EventCallable<{ postId: string }>
    >();
  });
});
