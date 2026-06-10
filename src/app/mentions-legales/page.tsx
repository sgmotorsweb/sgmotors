import { Scale, Construction } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="flex flex-col flex-1 bg-primary items-center justify-center py-24 px-4">
      <div className="border rounded-2xl p-12 text-center max-w-md w-full" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "var(--badge-bg)" }}>
          <Construction className="h-10 w-10" style={{ color: "var(--color-sg-accent-blue)" }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Mentions Légales</h1>
        <p style={{ color: "var(--text-muted)" }}>Page en cours de construction.</p>
      </div>
    </div>
  );
}
