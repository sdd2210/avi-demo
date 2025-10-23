export function joinUrl(base: string, ...paths: Array<string>) {
  let url = new URL(base);
  const cleanPath = paths
    .map((p) => p.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');

  url.pathname = [url.pathname.replace(/\/+$/, ''), cleanPath]
    .filter(Boolean)
    .join('/');

  return url.toString();
}