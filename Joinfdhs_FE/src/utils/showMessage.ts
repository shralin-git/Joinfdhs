// src/utils/showMessage.ts
"use client"; // Ensures that this file is treated as a client-side module

import { message } from 'antd';

export const showMessage = (type: "success" | "error", content: string) => {
  if (typeof window !== "undefined") {
    if (type === "success") {
      message.success(content);
    } else if (type === "error") {
      message.error(content);
    }
  }
};