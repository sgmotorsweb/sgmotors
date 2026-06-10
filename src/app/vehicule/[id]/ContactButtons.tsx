"use client";

import { useState, useEffect } from "react";
import { PhoneCall, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import CallbackWrapper from "./CallbackWrapper";
import { fetchServerSettings } from "@/lib/settings";

function useContact() {
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchServerSettings().then((s) => {
      if (s.whatsapp) setWhatsapp(s.whatsapp.replace(/\s/g, ""));
      else if (s.phone) setWhatsapp(s.phone.replace(/\s/g, ""));
      if (s.phone) setPhone(s.phone);
    });
  }, []);

  return { whatsapp, phone, phoneDigits: phone.replace(/\s/g, "") };
}

export default function ContactButtons({ vehicule }: { vehicule: string }) {
  const { whatsapp, phone, phoneDigits } = useContact();

  return (
    <>
      <CallbackWrapper vehicule={vehicule}>
        <button className="w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(0,102,255,0.3)]" style={{ backgroundColor: "var(--color-sg-accent-blue)", color: "white" }}>
          <PhoneCall className="h-5 w-5" /> Être rappelé
        </button>
      </CallbackWrapper>
      <Link href="/reprise" className="w-full py-4 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-lg" style={{ backgroundColor: "#111827" }}>Demander une reprise</Link>
      {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" className="w-full py-4 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-lg" style={{ backgroundColor: "#25D366" }}><MessageCircle className="h-5 w-5" /> WhatsApp</a>}
      {phone && <a href={`tel:${phoneDigits}`} className="w-full py-4 border-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-lg" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}><Phone className="h-5 w-5" /> Appel direct</a>}
    </>
  );
}

export function FinanceContact() {
  const { phone, phoneDigits } = useContact();
  if (!phone) return null;
  return (
    <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
      Appelez-nous au <a href={`tel:${phoneDigits}`} className="font-medium" style={{ color: "var(--color-sg-accent-blue)" }}>{phone}</a> pour une simulation personnalisée.
    </p>
  );
}

export function MobileContactBar({ vehicule }: { vehicule: string }) {
  const { whatsapp, phone, phoneDigits } = useContact();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t p-4 z-50 flex gap-2" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
      <CallbackWrapper vehicule={vehicule}>
        <button className="flex-1 py-3 text-white rounded-lg font-semibold flex justify-center items-center text-sm shadow-[0_0_15px_rgba(0,102,255,0.3)]" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
          <PhoneCall className="h-4 w-4 mr-2" /> Rappel
        </button>
      </CallbackWrapper>
      <Link href="/reprise" className="py-3 rounded-lg flex justify-center items-center flex-1 text-white text-sm font-semibold" style={{ backgroundColor: "#111827" }}>Reprise</Link>
      {whatsapp && <a href={`https://wa.me/${whatsapp}`} className="p-3 text-white rounded-lg flex justify-center items-center" style={{ backgroundColor: "#25D366" }}><MessageCircle className="h-5 w-5" /></a>}
      {phone && <a href={`tel:${phoneDigits}`} className="p-3 border rounded-lg flex justify-center items-center" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}><Phone className="h-5 w-5" /></a>}
    </div>
  );
}
