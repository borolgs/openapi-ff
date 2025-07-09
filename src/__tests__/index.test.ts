import { describe, expect, test, beforeEach } from 'vitest';
import createFetchClient from 'openapi-fetch';
import { allSettled, createStore, fork } from 'effector';
import { createEffectorClient } from '../create-client';
import { paths } from './api';
import { createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { EndpointByMethod } from './zod';

describe('createApiEffect', () => {
  const baseUrl = 'https://api.example.com' as const;
  const fetchClient = createFetchClient<paths>({ baseUrl });
  const { createApiEffect } = createEffectorClient(fetchClient);

  let agent: MockAgent;
  beforeEach(() => {
    agent = new MockAgent();
    setGlobalDispatcher(agent);
  });

  test('resolve data properly when successfull request', async () => {
    agent
      .get(baseUrl)
      .intercept({ path: '/blogposts', method: 'GET' })
      .reply(200, [{ title: 'title', body: 'body' }]);

    const query = createQuery({
      ...createApiEffect('get', '/blogposts'),
    });

    const scope = fork();
    await allSettled(query.start, { scope, params: {} });

    expect(scope.getState(query.$data)).toMatchObject([{ title: 'title', body: 'body' }]);
  });

  test('executes effect with correct post_id parameter', async () => {
    agent.get(baseUrl).intercept({ path: '/blogposts/1', method: 'GET' }).reply(200, {});

    const query = createQuery({
      ...createApiEffect('get', '/blogposts/{post_id}'),
    });

    const scope = fork();
    await allSettled(query.start, {
      scope,
      params: { params: { path: { post_id: '1' } } },
    });

    expect(scope.getState(query.$succeeded)).toBeTruthy();
  });

  test('maps input source correctly', async () => {
    agent.get(baseUrl).intercept({ path: '/blogposts/1', method: 'GET' }).reply(200, {});

    const query = createQuery({
      ...createApiEffect('get', '/blogposts/{post_id}', {
        mapParams({ postId }: { postId: string }) {
          return { params: { path: { post_id: postId } } };
        },
      }),
    });

    const scope = fork();

    await allSettled(query.start, { scope, params: { postId: '1' } });

    expect(scope.getState(query.$succeeded)).toBeTruthy();
  });

  test('maps input parameters with source correctly', async () => {
    agent.get(baseUrl).intercept({ path: '/blogposts/1', method: 'GET' }).reply(200, {});

    const $header = createStore('test');

    const query = createQuery({
      ...createApiEffect('get', '/blogposts/{post_id}', {
        mapParams: {
          source: $header,
          fn: (header, { postId }: { postId: string }) => {
            return { params: { path: { post_id: postId } }, headers: { Test: header } };
          },
        },
      }),
    });

    const scope = fork();

    await allSettled(query.start, { scope, params: { postId: '1' } });

    expect(scope.getState(query.$succeeded)).toBeTruthy();
  });

  test('handles errors and updates query error', async () => {
    agent
      .get(baseUrl)
      .intercept({ path: '/blogposts', method: 'GET' })
      .reply(500, { code: 500, message: 'Error' });

    const query = createQuery({
      ...createApiEffect('get', '/blogposts'),
    });

    const scope = fork();

    await allSettled(query.start, { scope, params: {} });

    expect(scope.getState(query.$error)).toMatchObject({
      errorType: 'API',
      status: 500,
      response: {
        code: 500,
        message: 'Error',
      },
    });
  });

  describe('WithContract', () => {
    const { createApiEffect } = createEffectorClient(fetchClient, {
      createContract(method, path) {
        const endpoints = EndpointByMethod[method] as Record<string, any>;
        const response = endpoints[path]?.response;
        if (!response) {
          throw new Error(`Response schema for route "${method} ${path}" doesn't exist`);
        }

        return zodContract(response);
      },
    });

    test('validates successful', async () => {
      agent
        .get(baseUrl)
        .intercept({ path: '/blogposts', method: 'GET' })
        .reply(200, [{ title: 'title', body: 'body' }]);

      const query = createQuery({
        ...createApiEffect('get', '/blogposts'),
      });

      const scope = fork();
      await allSettled(query.start, { scope, params: {} });

      expect(scope.getState(query.$data)).toMatchObject([{ title: 'title', body: 'body' }]);
    });

    test('returns validation error for missing required fields', async () => {
      agent
        .get(baseUrl)
        .intercept({ path: '/blogposts/1', method: 'GET' })
        .reply(200, { title: 'title', data: 'body' });

      const query = createQuery({
        ...createApiEffect('get', '/blogposts/{post_id}'),
      });

      const scope = fork();
      await allSettled(query.start, {
        scope,
        params: { params: { path: { post_id: '1' } } },
      });

      expect(scope.getState(query.$error)).toMatchObject({
        validationErrors: ['Required, path: body'],
        errorType: 'INVALID_DATA',
      });
    });
  });
});
