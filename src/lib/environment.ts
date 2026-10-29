// The public hostname wins. Local previews and prerendering use the build's site.
const hostname = window.location.hostname.toLowerCase();
const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
const siteHostname = isLocal
  ? new URL(import.meta.env.VITE_SITE_URL || "https://tsuru.jcampos.dev").hostname
  : hostname;

export const IS_STAGING = siteHostname === "tsuru.jcampos.dev" || siteHostname.endsWith(".tsuru.jcampos.dev");
export const IS_PRELAUNCH = siteHostname === "tsuru.lat" || siteHostname === "www.tsuru.lat";
