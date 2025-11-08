import pako from "pako";

export function decompressPayload(buffer: Uint8Array): string {
  try {
    return pako.ungzip(buffer, { to: "string" });
  } catch (err) {
    console.error("Decompression failed", err);
    throw new Error("Invalid gzip");
  }
}
