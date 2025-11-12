import { Contract, HttpError, NetworkError, createQuery } from '@farfetched/core';
import { Effect, type Event, type EventCallable, createStore } from 'effector';
import createFetchClient, { type FetchOptions } from 'openapi-fetch';
import { ErrorStatus, PathsWithMethod } from 'types';
import { describe, expectTypeOf, test } from 'vitest';
import { ApiError, createEffectorClient } from '../create-client';
import { components, paths } from './api';

describe('createApiEffect', () => {
  const fetchClient = createFetchClient<paths>();
  const { createApiEffect } = createEffectorClient(fetchClient);

  test('query has correct types', async () => {
    const query = createQuery({
      ...createApiEffect('get', '/blogposts'),
    });

    expectTypeOf(query.finished.success).toMatchTypeOf<
      Event<{
        result: components['schemas']['Post'][];
      }>
    >();

    expectTypeOf(query.finished.failure).toMatchTypeOf<
      Event<{
        error:
          | ApiError<ErrorStatus, components['responses']['Error']['content']['application/json']>
          | HttpError
          | NetworkError;
      }>
    >();
  });

  test('effect with contract has correct types', async () => {
    const { effect, contract } = createApiEffect('get', '/blogposts');

    expectTypeOf(effect).toMatchTypeOf<
      Effect<
        any,
        components['schemas']['Post'][],
        | ApiError<ErrorStatus, components['responses']['Error']['content']['application/json']>
        | HttpError
        | NetworkError
      >
    >();

    expectTypeOf(contract).toMatchTypeOf<Contract<unknown, components['schemas']['Post'][]>>();
  });

  test('effect has correct params type: path', async () => {
    const query = createQuery({
      ...createApiEffect('get', '/blogposts/{post_id}'),
    });

    expectTypeOf(query.start).toEqualTypeOf<
      EventCallable<FetchOptions<paths['/blogposts/{post_id}']['get']>>
    >();
  });

  test('effect has correct params type: body', async () => {
    const query = createQuery({
      ...createApiEffect('put', '/blogposts'),
    });

    expectTypeOf(query.start).toEqualTypeOf<
      EventCallable<FetchOptions<paths['/blogposts']['put']>>
    >();
  });

  test('effect has correct types after mapping with source', async () => {
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

    expectTypeOf(query.start).toEqualTypeOf<EventCallable<{ postId: string }>>();
  });

  test('effect has correct types after mapping', async () => {
    const query = createQuery({
      ...createApiEffect('get', '/blogposts/{post_id}', {
        mapParams: ({ postId }: { postId: string }) => {
          return { params: { path: { post_id: postId } } };
        },
      }),
    });

    expectTypeOf(query.start).toEqualTypeOf<EventCallable<{ postId: string }>>();
  });
});
