# openapi-ff

openapi-ff is a type-safe tiny wrapper around [effector](https://effector.dev/) and [farfetched](https://ff.effector.dev/) to work with OpenAPI schema.

It works by using [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) and [openapi-typescript](https://openapi-ts.dev/).

## Setup

```bash
pnpm i openapi-ff @farfetched/core effector openapi-fetch
pnpm i -D openapi-typescript typescript
```

Next, generate TypeScript types from your OpenAPI schema using openapi-typescript:

```bash
npx openapi-typescript ./path/to/api/v1.yaml -o ./src/shared/api/schema.d.ts
```

## Usage

```ts
import createFetchClient from "openapi-fetch";
import { createEffectorClient } from "openapi-ff";
import { createQuery } from "@farfetched/core";
import type { paths } from "./schema"; // generated by openapi-typescript

export const client = createFetchClient<paths>({
  baseUrl: "https://myapi.dev/v1/",
});
export const { createApiEffect } = createEffectorClient(client);

const blogpostQuery = createQuery({
  ...createApiEffect("get", "/blogposts/{post_id}"),
});
```

```tsx
import { useUnit } from "effector-react";

function Post() {
  const { data: post, pending } = useUnit(blogpostQuery);

  if (pending) {
    return <Loader />;
  }

  return (
    <section>
      <p>{post.title}</p>
    </section>
  );
}
```

Advanced Usage:

```ts
import { chainRoute } from "atomic-router";
import { startChain } from "@farfetched/atomic-router";
import { isApiError } from "openapi-ff";

const blogpostQuery = createQuery({
  ...createApiEffect("get", "/blogposts/{post_id}", {
    mapParams: (args: { postId: string }) => ({ params: { path: { post_id: args.postId } } }),
  }),
  mapData: ({ result, params }) => ({ ...result, ...params }),
  initialData: { body: "-", title: "-", postId: "0" },
});

export const blogpostRoute = chainRoute({
  route: routes.blogpost.item,
  ...startChain(blogpostQuery),
});

const apiError = sample({
  clock: softwareQuery.finished.failure,
  filter: isApiError,
});
```

Map with source:

```ts
import { mergeInitHeaders } from 'openapi-ff';

const blogpostQuery = createQuery({
  ...createApiEffect("get", "/blogposts/{post_id}", {
    mapParams: {
      source: $token,
      fn: (token, init) => mergeInitHeaders(init, { Authorization: token }),
    },
  }),
});
```

## Runtime Validation

`openapi-ff` does not handle runtime validation, as `openapi-typescript` [does not support it](https://github.com/openapi-ts/openapi-typescript/issues/1420#issuecomment-1792909086).

> openapi-typescript by its design generates runtime-free static types, and only static types.

However, `openapi-ff` allows adding a contract factory when creating a client:

```ts
const { createApiEffect } = createEffectorClient(fetchClient, {
  createContract(method, path) {
    // ... create your own contract
    return contract; // Contract<unknown, unknown>
  },
});

const query = createQuery({
  ...createApiEffect("get", "/blogposts"),
});
```

### [typed-openapi](https://github.com/astahmer/typed-openapi) example

```bash
npx typed-openapi path/to/api.yaml -o src/zod.ts -r zod # Generate zod schemas
pnpm install zod @farfetched/zod
```

```ts
import { EndpointByMethod } from "./zod";
import { zodContract } from "@farfetched/zod";

const { createApiEffect } = createEffectorClient(fetchClient, {
  createContract(method, path) {
    const response = (EndpointByMethod as any)[method][path]?.response;
    if (!response) {
      throw new Error(`Response schema for route "${method} ${path}" doesn't exist`);
    }
    return zodContract(response);
  },
});

const query = createQuery({
  ...createApiEffect("get", "/blogposts"),
});
```
