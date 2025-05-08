import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const isDev = process.env.NODE_ENV !== "production";

  try {
    const puppeteer = isDev
      ? await import("puppeteer")
      : await import("puppeteer-core");

    let browser;

    if (isDev) {
      // Local: Use full Puppeteer (has Chromium bundled)
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // Production (Vercel): Use chrome-aws-lambda
      const chromium = await import("chrome-aws-lambda");
      browser = await puppeteer.launch({
        args: chromium.default.args,
        defaultViewport: { width: 1280, height: 720 },
        executablePath: await chromium.default.executablePath,
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const screenshot = await page.screenshot({ type: "png" });

    await browser.close();

    const base64 = Buffer.from(screenshot as Buffer).toString("base64");
    return NextResponse.json({ image: base64 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Screenshot error:", error.message);
    } else {
      console.error("Screenshot error:", error);
    }
    return NextResponse.json({ error: "Screenshot failed" }, { status: 500 });
  }
}
