"use cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
};

export const getUsersList = async (headers: Headers) => {
	const usersList = await auth.api.listUsers({
		headers: headers,
		query: {},
	});
	return usersList;
};
