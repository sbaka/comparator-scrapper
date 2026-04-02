"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Eye } from "lucide-react";

interface ViewersBadgeProps {
  id: string;
  compact?: boolean;
  shouldTrack?: boolean;
}

export function ViewersBadge({
  id,
  compact = false,
  shouldTrack = false,
}: ViewersBadgeProps) {
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

    const updateFromPresence = () => {
      const state = channel.presenceState();
      setViewerCount(Object.keys(state).length);
    };

    channel.on("presence", { event: "sync" }, updateFromPresence);
    channel.on("presence", { event: "join" }, updateFromPresence);
    channel.on("presence", { event: "leave" }, updateFromPresence);

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED" && shouldTrack) {
        setViewerCount((current) => Math.max(1, current));
        await channel.track({ online_at: new Date().toISOString() });
        updateFromPresence();
      }
    });

    return () => {
      if (shouldTrack) {
        channel.untrack();
      }
      supabase.removeChannel(channel);
    };
  }, [id, shouldTrack]);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50 hover:border-primary/30 transition-colors">
        <Eye size={14} className="text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">
          {viewerCount > 99 ? "99+" : viewerCount}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground flex items-center gap-2">
        <Eye size={16} />
        Live viewers
      </span>
      <span className="inline-flex min-w-10 justify-center rounded-full bg-primary/15 px-3 py-1 text-primary font-semibold">
        {viewerCount}
      </span>
    </div>
  );
}
