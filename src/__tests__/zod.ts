import { z } from "zod";

export type Post = z.infer<typeof Post>;
export const Post = z.object({
  title: z.string(),
  body: z.string(),
  publish_date: z.union([z.number(), z.undefined()]).optional(),
});

export type StringArray = z.infer<typeof StringArray>;
export const StringArray = z.array(z.string());

export type User = z.infer<typeof User>;
export const User = z.object({
  email: z.string(),
  age: z.union([z.number(), z.undefined()]).optional(),
  avatar: z.union([z.string(), z.undefined()]).optional(),
  created_at: z.number(),
  updated_at: z.number(),
});

export type put_Comment = typeof put_Comment;
export const put_Comment = {
  method: z.literal("PUT"),
  path: z.literal("/comment"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      message: z.string(),
      replied_at: z.number(),
    }),
  }),
  response: z.unknown(),
};

export type get_Blogposts = typeof get_Blogposts;
export const get_Blogposts = {
  method: z.literal("GET"),
  path: z.literal("/blogposts"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      tags: z.array(z.string()).optional(),
      published: z.boolean().optional(),
    }),
  }),
  response: z.array(Post),
};

export type put_Blogposts = typeof put_Blogposts;
export const put_Blogposts = {
  method: z.literal("PUT"),
  path: z.literal("/blogposts"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      title: z.string(),
      body: z.string(),
      publish_date: z.number(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type patch_Blogposts = typeof patch_Blogposts;
export const patch_Blogposts = {
  method: z.literal("PATCH"),
  path: z.literal("/blogposts"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      publish_date: z.number().optional(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type get_BlogpostsPost_id = typeof get_BlogpostsPost_id;
export const get_BlogpostsPost_id = {
  method: z.literal("GET"),
  path: z.literal("/blogposts/{post_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      version: z.number().optional(),
      format: z.string().optional(),
    }),
    path: z.object({
      post_id: z.string(),
    }),
  }),
  response: Post,
};

export type patch_BlogpostsPost_id = typeof patch_BlogpostsPost_id;
export const patch_BlogpostsPost_id = {
  method: z.literal("PATCH"),
  path: z.literal("/blogposts/{post_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      post_id: z.string(),
    }),
    body: z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      publish_date: z.number().optional(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type delete_BlogpostsPost_id = typeof delete_BlogpostsPost_id;
export const delete_BlogpostsPost_id = {
  method: z.literal("DELETE"),
  path: z.literal("/blogposts/{post_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      post_id: z.string(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type put_BlogpostsOptional = typeof put_BlogpostsOptional;
export const put_BlogpostsOptional = {
  method: z.literal("PUT"),
  path: z.literal("/blogposts-optional"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      title: z.string(),
      body: z.string(),
      publish_date: z.number(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type put_BlogpostsOptionalInline = typeof put_BlogpostsOptionalInline;
export const put_BlogpostsOptionalInline = {
  method: z.literal("PUT"),
  path: z.literal("/blogposts-optional-inline"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: Post,
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type get_GetHeaderParams = typeof get_GetHeaderParams;
export const get_GetHeaderParams = {
  method: z.literal("GET"),
  path: z.literal("/header-params"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    header: z.object({
      "x-required-header": z.string(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type put_Media = typeof put_Media;
export const put_Media = {
  method: z.literal("PUT"),
  path: z.literal("/media"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      media: z.string(),
      name: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_MismatchedData = typeof get_MismatchedData;
export const get_MismatchedData = {
  method: z.literal("GET"),
  path: z.literal("/mismatched-data"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: Post,
};

export type get_MismatchedErrors = typeof get_MismatchedErrors;
export const get_MismatchedErrors = {
  method: z.literal("GET"),
  path: z.literal("/mismatched-errors"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type get_Self = typeof get_Self;
export const get_Self = {
  method: z.literal("GET"),
  path: z.literal("/self"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type get_StringArray = typeof get_StringArray;
export const get_StringArray = {
  method: z.literal("GET"),
  path: z.literal("/string-array"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: StringArray,
};

export type get_TagName = typeof get_TagName;
export const get_TagName = {
  method: z.literal("GET"),
  path: z.literal("/tag/{name}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      name: z.string(),
    }),
  }),
  response: z.string(),
};

export type put_TagName = typeof put_TagName;
export const put_TagName = {
  method: z.literal("PUT"),
  path: z.literal("/tag/{name}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      name: z.string(),
    }),
    body: z.object({
      description: z.string().optional(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type delete_TagName = typeof delete_TagName;
export const delete_TagName = {
  method: z.literal("DELETE"),
  path: z.literal("/tag/{name}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      name: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_QueryParams = typeof get_QueryParams;
export const get_QueryParams = {
  method: z.literal("GET"),
  path: z.literal("/query-params"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      string: z.string().optional(),
      number: z.number().optional(),
      boolean: z.boolean().optional(),
      array: z.array(z.string()).optional(),
      object: z
        .object({
          foo: z.string(),
          bar: z.string(),
        })
        .optional(),
    }),
  }),
  response: z.object({
    status: z.string(),
  }),
};

export type get_PathParamsSimple_primitiveSimple_obj_flatSimple_arr_flat_simple_obj_explode_simple_arr_explode_label_primitive_label_obj_flat_label_arr_flat_label_obj_explode_label_arr_explode_matrix_primitive_matrix_obj_flat_matrix_arr_flat_matrix_obj_explode_matrix_arr_explode_ =
  typeof get_PathParamsSimple_primitiveSimple_obj_flatSimple_arr_flat_simple_obj_explode_simple_arr_explode_label_primitive_label_obj_flat_label_arr_flat_label_obj_explode_label_arr_explode_matrix_primitive_matrix_obj_flat_matrix_arr_flat_matrix_obj_explode_matrix_arr_explode_;
export const get_PathParamsSimple_primitiveSimple_obj_flatSimple_arr_flat_simple_obj_explode_simple_arr_explode_label_primitive_label_obj_flat_label_arr_flat_label_obj_explode_label_arr_explode_matrix_primitive_matrix_obj_flat_matrix_arr_flat_matrix_obj_explode_matrix_arr_explode_ =
  {
    method: z.literal("GET"),
    path: z.literal(
      "/path-params/{simple_primitive}/{simple_obj_flat}/{simple_arr_flat}/{simple_obj_explode*}/{simple_arr_explode*}/{.label_primitive}/{.label_obj_flat}/{.label_arr_flat}/{.label_obj_explode*}/{.label_arr_explode*}/{;matrix_primitive}/{;matrix_obj_flat}/{;matrix_arr_flat}/{;matrix_obj_explode*}/{;matrix_arr_explode*}",
    ),
    requestFormat: z.literal("json"),
    parameters: z.object({
      path: z.object({
        simple_primitive: z.string().optional(),
        simple_obj_flat: z
          .object({
            a: z.string(),
            c: z.string(),
          })
          .optional(),
        simple_arr_flat: z.array(z.number()).optional(),
        simple_obj_explode: z
          .object({
            e: z.string(),
            g: z.string(),
          })
          .optional(),
        simple_arr_explode: z.array(z.number()).optional(),
        label_primitive: z.string().optional(),
        label_obj_flat: z
          .object({
            a: z.string(),
            c: z.string(),
          })
          .optional(),
        label_arr_flat: z.array(z.number()).optional(),
        label_obj_explode: z
          .object({
            e: z.string(),
            g: z.string(),
          })
          .optional(),
        label_arr_explode: z.array(z.number()).optional(),
        matrix_primitive: z.string().optional(),
        matrix_obj_flat: z
          .object({
            a: z.string(),
            c: z.string(),
          })
          .optional(),
        matrix_arr_flat: z.array(z.number()).optional(),
        matrix_obj_explode: z
          .object({
            e: z.string(),
            g: z.string(),
          })
          .optional(),
        matrix_arr_explode: z.array(z.number()).optional(),
      }),
    }),
    response: z.object({
      status: z.string(),
    }),
  };

export type get_DefaultAsError = typeof get_DefaultAsError;
export const get_DefaultAsError = {
  method: z.literal("GET"),
  path: z.literal("/default-as-error"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    code: z.number(),
    message: z.string(),
  }),
};

export type get_AnyMethod = typeof get_AnyMethod;
export const get_AnyMethod = {
  method: z.literal("GET"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type put_AnyMethod = typeof put_AnyMethod;
export const put_AnyMethod = {
  method: z.literal("PUT"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type post_AnyMethod = typeof post_AnyMethod;
export const post_AnyMethod = {
  method: z.literal("POST"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type delete_AnyMethod = typeof delete_AnyMethod;
export const delete_AnyMethod = {
  method: z.literal("DELETE"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type options_AnyMethod = typeof options_AnyMethod;
export const options_AnyMethod = {
  method: z.literal("OPTIONS"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type head_AnyMethod = typeof head_AnyMethod;
export const head_AnyMethod = {
  method: z.literal("HEAD"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type patch_AnyMethod = typeof patch_AnyMethod;
export const patch_AnyMethod = {
  method: z.literal("PATCH"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type trace_AnyMethod = typeof trace_AnyMethod;
export const trace_AnyMethod = {
  method: z.literal("TRACE"),
  path: z.literal("/anyMethod"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: User,
};

export type put_Contact = typeof put_Contact;
export const put_Contact = {
  method: z.literal("PUT"),
  path: z.literal("/contact"),
  requestFormat: z.literal("form-data"),
  parameters: z.object({
    body: z.object({
      name: z.string(),
      email: z.string(),
      subject: z.string(),
      message: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_MultipleResponseContent = typeof get_MultipleResponseContent;
export const get_MultipleResponseContent = {
  method: z.literal("GET"),
  path: z.literal("/multiple-response-content"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    id: z.string(),
    email: z.string(),
    name: z.union([z.string(), z.undefined()]).optional(),
  }),
};

// <EndpointByMethod>
export const EndpointByMethod = {
  put: {
    "/comment": put_Comment,
    "/blogposts": put_Blogposts,
    "/blogposts-optional": put_BlogpostsOptional,
    "/blogposts-optional-inline": put_BlogpostsOptionalInline,
    "/media": put_Media,
    "/tag/{name}": put_TagName,
    "/anyMethod": put_AnyMethod,
    "/contact": put_Contact,
  },
  get: {
    "/blogposts": get_Blogposts,
    "/blogposts/{post_id}": get_BlogpostsPost_id,
    "/header-params": get_GetHeaderParams,
    "/mismatched-data": get_MismatchedData,
    "/mismatched-errors": get_MismatchedErrors,
    "/self": get_Self,
    "/string-array": get_StringArray,
    "/tag/{name}": get_TagName,
    "/query-params": get_QueryParams,
    "/path-params/{simple_primitive}/{simple_obj_flat}/{simple_arr_flat}/{simple_obj_explode*}/{simple_arr_explode*}/{.label_primitive}/{.label_obj_flat}/{.label_arr_flat}/{.label_obj_explode*}/{.label_arr_explode*}/{;matrix_primitive}/{;matrix_obj_flat}/{;matrix_arr_flat}/{;matrix_obj_explode*}/{;matrix_arr_explode*}":
      get_PathParamsSimple_primitiveSimple_obj_flatSimple_arr_flat_simple_obj_explode_simple_arr_explode_label_primitive_label_obj_flat_label_arr_flat_label_obj_explode_label_arr_explode_matrix_primitive_matrix_obj_flat_matrix_arr_flat_matrix_obj_explode_matrix_arr_explode_,
    "/default-as-error": get_DefaultAsError,
    "/anyMethod": get_AnyMethod,
    "/multiple-response-content": get_MultipleResponseContent,
  },
  patch: {
    "/blogposts": patch_Blogposts,
    "/blogposts/{post_id}": patch_BlogpostsPost_id,
    "/anyMethod": patch_AnyMethod,
  },
  delete: {
    "/blogposts/{post_id}": delete_BlogpostsPost_id,
    "/tag/{name}": delete_TagName,
    "/anyMethod": delete_AnyMethod,
  },
  post: {
    "/anyMethod": post_AnyMethod,
  },
  options: {
    "/anyMethod": options_AnyMethod,
  },
  head: {
    "/anyMethod": head_AnyMethod,
  },
  trace: {
    "/anyMethod": trace_AnyMethod,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type PutEndpoints = EndpointByMethod["put"];
export type GetEndpoints = EndpointByMethod["get"];
export type PatchEndpoints = EndpointByMethod["patch"];
export type DeleteEndpoints = EndpointByMethod["delete"];
export type PostEndpoints = EndpointByMethod["post"];
export type OptionsEndpoints = EndpointByMethod["options"];
export type HeadEndpoints = EndpointByMethod["head"];
export type TraceEndpoints = EndpointByMethod["trace"];
export type AllEndpoints = EndpointByMethod[keyof EndpointByMethod];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown;
  query?: Record<string, unknown>;
  header?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | "options" | MutationMethod;

type RequestFormat = "json" | "form-data" | "form-url" | "binary" | "text";

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined;
  response: unknown;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string;
  method: Method;
  path: string;
  requestFormat: RequestFormat;
  parameters?: TConfig["parameters"];
  meta: {
    alias: string;
    hasParameters: boolean;
    areParametersRequired: boolean;
  };
  response: TConfig["response"];
};

type Fetcher = (
  method: Method,
  url: string,
  parameters?: EndpointParameters | undefined,
) => Promise<Endpoint["response"]>;

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P;
}[keyof T];

type MaybeOptionalArg<T> = RequiredKeys<T> extends never ? [config?: T] : [config: T];

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
  baseUrl: string = "";

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  // <ApiClient.put>
  put<Path extends keyof PutEndpoints, TEndpoint extends PutEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("put", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.put>

  // <ApiClient.get>
  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("get", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.get>

  // <ApiClient.patch>
  patch<Path extends keyof PatchEndpoints, TEndpoint extends PatchEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("patch", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.patch>

  // <ApiClient.delete>
  delete<Path extends keyof DeleteEndpoints, TEndpoint extends DeleteEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("delete", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.delete>

  // <ApiClient.post>
  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("post", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.post>

  // <ApiClient.options>
  options<Path extends keyof OptionsEndpoints, TEndpoint extends OptionsEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("options", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.options>

  // <ApiClient.head>
  head<Path extends keyof HeadEndpoints, TEndpoint extends HeadEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("head", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.head>

  // <ApiClient.trace>
  trace<Path extends keyof TraceEndpoints, TEndpoint extends TraceEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("trace", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.trace>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
  return new ApiClient(fetcher).setBaseUrl(baseUrl ?? "");
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
