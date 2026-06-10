"use client";
import { useEffect } from "react";
import { trackView, trackVisitor } from "@/lib/stats";

export default function StatsTracker({ id }: { id: string }) {
  useEffect(() => {
    trackView(id);
    trackVisitor();
  }, [id]);
  return null;
}
