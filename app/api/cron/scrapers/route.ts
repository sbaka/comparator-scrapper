import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCRAPYD_PROJECT = process.env.SCRAPYD_PROJECT ?? "webcrawler";
const SCRAPYD_BASE_URL =
  process.env.SCRAPYD_BASE_URL ?? "http://127.0.0.1:6800";

const SPIDERS = ["clickInfo", "maxFrame", "ssjStore", "wifiDjelfa"];

function isCronAuthorized(request: Request): boolean {
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${expectedSecret}`;
}

async function scheduleSpider(spider: string) {
  const response = await fetch(`${SCRAPYD_BASE_URL}/schedule.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      project: SCRAPYD_PROJECT,
      spider,
    }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
  };

  if (!response.ok || payload.status !== "ok") {
    throw new Error(payload.message ?? `Failed to schedule spider '${spider}'`);
  }
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await Promise.all(SPIDERS.map((spider) => scheduleSpider(spider)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
