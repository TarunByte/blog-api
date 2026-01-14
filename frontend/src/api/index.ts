/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import axios from "axios";

export const bigblogApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});
