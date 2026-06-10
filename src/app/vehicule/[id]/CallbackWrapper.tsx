"use client";

import { useState, ReactNode } from "react";
import CallbackModal from "@/components/CallbackModal";

export default function CallbackWrapper({ children, vehicule }: { children: ReactNode; vehicule: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <CallbackModal isOpen={open} onClose={() => setOpen(false)} vehicule={vehicule} />
    </>
  );
}
