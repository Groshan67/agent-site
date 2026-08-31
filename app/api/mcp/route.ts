import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

/**
 * سرور MCP داخل یه Next.js App Router API route.
 * این هندلر همزمان GET/POST/DELETE رو مدیریت می‌کنه (Streamable HTTP transport).
 * آدرس نهایی بعد از دیپلوی چیزی شبیه این میشه:
 *   https://your-domain.com/api/mcp
 */
const handler = createMcpHandler((server) => {
  // ---------- ابزار (Tool) نمونه‌ی شماره ۱: جمع دو عدد ----------
  server.registerTool(
    "add",
    {
      title: "Add two numbers",
      description: "دو عدد رو با هم جمع می‌کنه",
      inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }],
    })
  );

  // ---------- ابزار نمونه‌ی شماره ۲: گرفتن اطلاعات از دیتابیس/API خودت ----------
  server.registerTool(
    "get_latest_orders",
    {
      title: "Get latest orders",
      description: "آخرین سفارش‌های ثبت‌شده رو از دیتابیس پروژه برمی‌گردونه",
      inputSchema: { limit: z.number().min(1).max(50).default(5) },
    },
    async ({ limit }) => {
      // اینجا به‌جای این mock، به دیتابیس یا API واقعی پروژه‌ت وصل شو
      const orders = await fetchOrdersFromYourDb(limit);
      return {
        content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
      };
    }
  );
});

async function fetchOrdersFromYourDb(limit: number) {
  // نمونه‌ی ساختگی — جایگزینش کن با query واقعی (Prisma, Drizzle, fetch به API خودت و ...)
  return Array.from({ length: limit }).map((_, i) => ({
    id: i + 1,
    total: (i + 1) * 10,
  }));
}

export { handler as GET, handler as POST, handler as DELETE };
