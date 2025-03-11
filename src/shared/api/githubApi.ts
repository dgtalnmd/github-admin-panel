import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { Repo } from "../types/repo";

// Invalidate with delay, github endpoint does not return new data immediately
const INVALIDATE_DELAY = 1000;

interface GetRepoList {
  items: Array<Repo>;
  total_count: number;
}

interface CreateRepoRequest {
  name: string;
  description: string;
  private: boolean;
}

interface UpdateRepoRequest {
  owner: string;
  repo: string;
  data: {
    description?: string;
    private?: boolean;
    name?: string;
  };
}

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.github.com/",
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).credentials;
      if (token) {
        headers.set("Authorization", `token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Repos"],
  endpoints: (builder) => ({
    getRepos: builder.query<
      GetRepoList,
      { page: number; perPage: number; owner: string }
    >({
      query: ({ page, perPage, owner }) => {
        return `/search/repositories?q=user:${owner}&page=${page}&per_page=${perPage}&sort=updated`;
      },
      providesTags: ["Repos"],
    }),
    getRepo: builder.query<Repo, { owner: string; name: string }>({
      query: ({ owner, name }) => {
        return `repos/${owner}/${name}`;
      },
    }),
    createRepo: builder.mutation<Repo, CreateRepoRequest>({
      query: ({ name, description, private: isPrivate }) => ({
        url: "user/repos",
        method: "POST",
        body: {
          name,
          description,
          private: isPrivate,
        },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        setTimeout(() => {
          dispatch(githubApi.util.invalidateTags(["Repos"]));
        }, INVALIDATE_DELAY);
      },
    }),
    updateRepo: builder.mutation<Repo, UpdateRepoRequest>({
      query: ({ owner, repo, data }) => ({
        url: `repos/${owner}/${repo}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        setTimeout(() => {
          dispatch(githubApi.util.invalidateTags(["Repos"]));
        }, INVALIDATE_DELAY);
      },
    }),
    deleteRepo: builder.mutation<void, { owner: string; repo: string }>({
      query: ({ owner, repo }) => ({
        url: `repos/${owner}/${repo}`,
        method: "DELETE",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        setTimeout(() => {
          dispatch(githubApi.util.invalidateTags(["Repos"]));
        }, INVALIDATE_DELAY);
      },
    }),
  }),
});

export const {
  useLazyGetReposQuery,
  useLazyGetRepoQuery,
  useCreateRepoMutation,
  useUpdateRepoMutation,
  useDeleteRepoMutation,
} = githubApi;
