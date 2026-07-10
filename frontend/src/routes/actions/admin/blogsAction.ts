/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { redirect } from "react-router";

/**
 * Custom modules
 */
import { bigblogApi } from "@/api";

/**
 * Types
 */
import type { ActionFunction } from "react-router";
import { AxiosError } from "axios";
import type { ActionResponse } from "@/types";

const blogsAction: ActionFunction = async ({ request }) => {
  const data = (await request.json()) as { blogId: string };

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return redirect("/");

  try {
    await bigblogApi.delete(`/blogs/${data.blogId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      ok: true,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data);
      return {
        ok: false,
        err: err.response?.data,
      } as ActionResponse;
    }

    throw err;
  }
};

export default blogsAction;
