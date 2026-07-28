const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export function withBase(pathname = "/") {
  const base = trimTrailingSlash(import.meta.env.BASE_URL || "/");
  const cleanPath = pathname === "/" ? "" : `/${pathname.replace(/^\/+/, "")}`;
  return `${base}${cleanPath}` || "/";
}

export function withoutBase(pathname: string) {
  const base = trimTrailingSlash(import.meta.env.BASE_URL || "/");

  if (!base || base === "/") {
    return pathname || "/";
  }

  return pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname || "/";
}