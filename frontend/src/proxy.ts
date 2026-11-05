import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (antes "middleware"): corre antes de cada petición a las rutas del `matcher`.
 * Hace un chequeo rápido y "optimista": si no hay cookie de sesión, manda al login
 * sin llegar a renderizar la página. La verificación real del token la hace la API.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("tk_token")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/mis-tickets/:path*", "/reservas/:path*", "/panel/:path*"],
};
