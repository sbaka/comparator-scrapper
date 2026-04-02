"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ViewersCountProps } from "@/interfaces";
import type {} from "@/interfaces";

export default function ViewersCount({ id }: ViewersCountProps) {
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    if (!id) {
      return;
    }

    const supabase = createClient();
    const storedViewerId = localStorage.getItem("viewer_id");
    const sessionId = storedViewerId || crypto.randomUUID();

    if (!storedViewerId) {
      localStorage.setItem("viewer_id", sessionId);
    }

    const channel = supabase.channel(`product:${id}`, {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setViewerCount(Object.keys(state).length);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [id]);

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">Live viewers</span>
      <span className="inline-flex min-w-10 justify-center rounded-full bg-primary/15 px-3 py-1 text-primary font-semibold">
        {viewerCount}
      </span>
    </div>
  );
}
