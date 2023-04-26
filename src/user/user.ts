import { generate } from "https://deno.land/std@0.184.0/uuid/v1.ts";
import { User } from "./user.d.ts";
import { env } from "../helpers/env.ts";

function generateUserId(): string {
  return generate().toString();
}

export function getUserFromUrl(url: string): User {
  const id = generateUserId();
  const parsedUrl = new URL(url);
  const username = parsedUrl.searchParams.get("username") || "Anonymous";
  const region = env.ServerRegion;
  return { id, username, region };
}
