"use client";
import { useState } from "react";
import { handleComment } from "@/utils/supabase/queries";
const commentInput = ( { id }: { id: string }) => {
const [text, setText] = useState("");
 const handleSend = () => {
    const NoBrText = text.replace(/<\/br>/g, "").trim();
    const localTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });
    

    if (NoBrText.length > 0) {
      handleComment(id, NoBrText, localTime);
      setText("");
    }
  };
return (
<div>
  <h2>Comment Input</h2>
  <input type="text" placeholder="Enter your message..." value={text} onChange={(e) => setText(e.target.value)} />
      <button
        onClick={handleSend}
         className="bg-grey text-white rounded-full p-2 transition-transform duration-200 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#1E1E1E"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button></div>)
}
export default commentInput;