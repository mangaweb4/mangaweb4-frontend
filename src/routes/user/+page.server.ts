import type { PageServerLoad } from "./$types";
import { getUserDetail } from "$lib/user.server";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { variables } from "$lib/variables.server";
import { ChannelCredentials } from "@grpc/grpc-js";
import logger from "$lib/logger";
import { UserClient } from '$lib/grpc/user.client'
import { SystemClient } from "$lib/grpc/system.client";

export const load: PageServerLoad = async ({ request, url, cookies }) => {
   const user = getUserDetail(request, cookies)

   let transport = new GrpcTransport({
      host: variables.apiBasePath,
      channelCredentials: ChannelCredentials.createInsecure(),
   })

   const client = new UserClient(transport)
   const userInfo = await client.info({
      user: user.email,
   })

   logger.debug(userInfo.request, "user information request")
   logger.debug(userInfo.response, "user information response")

   const systemClient = new SystemClient(transport)
   const backendInfo = await systemClient.info({})

   logger.debug(backendInfo.request, "backend information request")
   logger.debug(backendInfo.response, "backend information response")

   return { ...user, ...userInfo.response, backend: backendInfo.response }
}

export const prerender = false;