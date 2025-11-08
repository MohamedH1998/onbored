const allowedOrigins = [
    "https://app.onbored.io",
    "http://localhost:3000",

  ];
  
  export function corsMiddleware(req: Request) {
    const origin = req.headers.get("Origin") || "";
    if (!allowedOrigins.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }
  
    return {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
        ? origin
        : "",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Content-Encoding, x-client-info",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    };
  }