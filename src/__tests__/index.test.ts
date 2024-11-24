import { describe, expect, vi, test, beforeEach, Mock } from "vitest";
import createFetchClient from "openapi-fetch";
import { allSettled, fork } from "effector";
import { createClient } from "../create-client";
import { paths } from "./api";
import { createQuery } from "@farfetched/core";
import { MockAgent, setGlobalDispatcher } from "undici";

describe("createApiEffect", () => {
  const baseUrl = "https://api.example.com" as const;
  const fetchClient = createFetchClient<paths>({ baseUrl });
  const { createApiEffect } = createClient(fetchClient);

  let agent: MockAgent;
  beforeEach(() => {
    agent = new MockAgent();
    setGlobalDispatcher(agent);
  });

  test("resolve data properly when successfull request", async () => {
    agent
      .get(baseUrl)
      .intercept({ path: "/blogposts", method: "GET" })
      .reply(200, [{ title: "title", body: "body" }]);

    const query = createQuery({
      effect: createApiEffect("get", "/blogposts"),
    });

    const scope = fork();
    await allSettled(query.start, { scope, params: {} });

    expect(scope.getState(query.$data)).toMatchObject([
      { title: "title", body: "body" },
    ]);
  });

  test("executes effect with correct post_id parameter", async () => {
    agent
      .get(baseUrl)
      .intercept({ path: "/blogposts/1", method: "GET" })
      .reply(200, {});

    const query = createQuery({
      effect: createApiEffect("get", "/blogposts/{post_id}"),
    });

    const scope = fork();
    await allSettled(query.start, {
      scope,
      params: { params: { path: { post_id: "1" } } },
    });

    expect(scope.getState(query.$succeeded)).toBeTruthy();
  });

  test("maps input parameters correctly", async () => {
    agent
      .get(baseUrl)
      .intercept({ path: "/blogposts/1", method: "GET" })
      .reply(200, {});

    const query = createQuery({
      effect: createApiEffect("get", "/blogposts/{post_id}", {
        mapParams({ postId }: { postId: string }) {
          return { params: { path: { post_id: postId } } };
        },
      }),
    });

    const scope = fork();
    await allSettled(query.start, { scope, params: { postId: "1" } });

    expect(scope.getState(query.$succeeded)).toBeTruthy();
  });

  test("handles errors and updates query error", async () => {
    agent
      .get(baseUrl)
      .intercept({ path: "/blogposts", method: "GET" })
      .reply(500, { code: 500, message: "Error" });

    const query = createQuery({
      effect: createApiEffect("get", "/blogposts"),
    });

    const scope = fork();

    await allSettled(query.start, { scope, params: {} });

    expect(scope.getState(query.$error)).toMatchObject({
      errorType: "API",
      status: 500,
      response: {
        code: 500,
        message: "Error",
      },
    });
  });
});
