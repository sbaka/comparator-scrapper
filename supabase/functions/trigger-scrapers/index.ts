// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SCRAPYD_PROJECT = Deno.env.get("SCRAPYD_PROJECT");
const SCRAPYD_BASE_URL = Deno.env.get("SCRAPYD_BASE_URL");

const SPIDERS = [
  "clickInfo",
  "maxFrame",
  "ssjStore",
  "wifiDjelfa",
  "draceshop",
  "gentech",
  "itechstore",
  "zmika",
];

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
  });

  const payload = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
  };

  if (!response.ok || payload.status !== "ok") {
    throw new Error(payload.message ?? `Failed to schedule spider '${spider}'`);
  }

  return payload;
}

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Verify authorization header if CRON_SECRET is set
    const cronSecret = Deno.env.get("CRON_SECRET");
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Schedule all spiders in parallel
    const results = await Promise.all(
      SPIDERS.map(async (spider) => ({
        spider,
        result: await scheduleSpider(spider),
      })),
    );

    return new Response(
      JSON.stringify({
        ok: true,
        message: "All spiders scheduled successfully",
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error scheduling spiders:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
