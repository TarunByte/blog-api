/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { data, redirect } from "react-router";

/**
 * Custom modules
 */
import { bigblogApi } from "@/api";

/**
 * Types
 */
import type { LoaderFunction } from "react-router";
import type { Blog, PaginatedResponse } from "@/types";
import { AxiosError } from "axios";

export interface HomeLoaderResponse {
  recentBlog: PaginatedResponse<Blog, "blogs">;
  allBlog: PaginatedResponse<Blog, "blogs">;
}

const homeLoader: LoaderFunction = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return redirect("/");

    const { data: recentBlog } = await bigblogApi.get("/blogs", {
      params: { limit: 4 },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    const { data: allBlog } = await bigblogApi.get("/blogs", {
      params: {
        offset: 4,
        limit: 12,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return { recentBlog, allBlog } as HomeLoaderResponse;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw data(err.response?.data.message || err.message, {
        status: err.response?.status || err.status,
        statusText: err.response?.data.code || err.code,
      });
    }

    throw err;
  }
};

export default homeLoader;
