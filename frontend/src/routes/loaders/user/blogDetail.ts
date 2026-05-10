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
import { AxiosError } from "axios";

const blogDetail: LoaderFunction = async ({ params }) => {
  const slug = params.slug;
  const accessToken = localStorage.getItem("accessToken");

  // if (!accessToken) return redirect("/");
  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : {};

  try {
    const { data } = await bigblogApi.get(`/blogs/${slug}`, {
      headers,
      withCredentials: true,
    });

    return data;
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

export default blogDetail;
