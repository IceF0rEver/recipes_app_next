// import type { NextRequest } from "next/server";
// import { createI18nMiddleware } from "next-international/middleware";

// const I18nMiddleware = createI18nMiddleware({
// 	locales: ["en", "fr"],
// 	defaultLocale: "en",
// });

// export function middleware(request: NextRequest) {
// 	return I18nMiddleware(request);
// }

// export const config = {
// 	matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
// };

import { betterFetch } from "@better-fetch/fetch";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import type { auth } from "./lib/auth/auth";

const I18nMiddleware = createI18nMiddleware({
	locales: ["en", "fr"],
	defaultLocale: "fr",
});

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		},
	);

	const { pathname } = request.nextUrl;
	const locale = pathname.split("/")[1];

	if (sessionCookie && pathname.startsWith(`/${locale}/auth`)) {
		return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
	}

	if (!sessionCookie && pathname.startsWith(`/${locale}/dashboard`)) {
		return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
	}

	if (session) {
		if (
			session.user.role !== "admin" &&
			pathname.startsWith(`/${locale}/dashboard/admin`)
		) {
			return NextResponse.redirect(
				new URL(`/${locale}/dashboard`, request.url),
			);
		}
	}

	const i18nResponse = I18nMiddleware(request);
	if (i18nResponse) return i18nResponse;

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
		"/(fr|en)/auth/:path*",
		"/(fr|en)/dashboard/:path*",
	],
};
