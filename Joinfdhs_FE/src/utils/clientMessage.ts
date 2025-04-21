// src/utils/clientMessage.ts
"use client";

import { message } from "antd";

export function showMessage(type: "success" | "error", content: string) {
  if (typeof window !== "undefined") {
    // Only run in the client
    if (type === "success") {
      message.success(content);
    } else if (type === "error") {
      message.error(content);
    }
  }
}