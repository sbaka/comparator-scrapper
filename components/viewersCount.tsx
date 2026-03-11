"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
const viewersCount = ( { name }: { name: string }) => {
const [viewerCount, setViewerCount] = useState(0);

useEffect(() => {
const supabase = createClient();
const sessionId =
localStorage.getItem("viewer_id") || crypto.randomUUID()

localStorage.setItem("viewer_id", sessionId)
console.log("Session ID:", sessionId)
const channel = supabase.channel(`product:${name}`, {
  config: {
    presence: {
      key: sessionId
    }
  }
})

channel.on("presence", { event: "sync" }, () => {
  const state = channel.presenceState()
  setViewerCount(Object.keys(state).length)
  console.log("Viewers:", Object.keys(state).length)
})

channel.subscribe()

channel.track({
  online_at: new Date().toISOString()
})
}, [])

return (<div>
  <h2>Viewers Count: {viewerCount}</h2>
  <p></p>
</div>
)
}
export default viewersCount;