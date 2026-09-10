import dns from "dns/promises";
import net from "net";

// Blocks obvious internal/private targets so the "summarize any URL" feature
// can't be used to make the server fetch internal network resources (SSRF).
const isPrivateOrLoopbackIp = (ip) => {
  const type = net.isIP(ip);

  if (type === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // private
    if (a === 169 && b === 254) return true; // link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 0) return true;
    return false;
  }

  if (type === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1") return true; // loopback
    if (lower.startsWith("fe80:")) return true; // link-local
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    return false;
  }

  return true; // not a valid IP, treat as unsafe
};

export const assertSafeExternalUrl = async (rawUrl) => {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http/https URLs are supported");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local")) {
    throw new Error("This URL is not allowed");
  }

  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error("Could not resolve host");
  }

  if (addresses.some((a) => isPrivateOrLoopbackIp(a.address))) {
    throw new Error("This URL is not allowed");
  }

  return parsed;
};
