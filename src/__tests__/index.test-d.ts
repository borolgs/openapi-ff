import { describe, test, expectTypeOf } from 'vitest';
import createFetchClient from 'openapi-fetch';
import { type EventCallable, type Event, Effect, createStore } from 'effector';
import { ApiError, createClient } from '../create-client';
import { components, paths } from './api';
import { Contract, createQuery, HttpError, NetworkError } from '@farfetched/core';
import { ErrorStatus } from 'types';

describe('createApiEffect', () => {
  const fetchClient = createFetchClient<paths>();
  const { createApiEffect } = createClient(fetchClient);

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
