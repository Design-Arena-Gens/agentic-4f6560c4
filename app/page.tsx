import EmailAgent from "@/components/EmailAgent";

const highlights = [
  {
    title: "Intent-aware",
    description: "Blend your objective, call to action, and key points into a cohesive narrative."
  },
  {
    title: "Tone control",
    description: "Shift between formal polish, empathetic support, concise brevity, and more."
  },
  {
    title: "Deploy-ready",
    description: "Designed for instant handoff into your inbox or CRM — no extra edits required."
  }
];

export default function HomePage() {
  return (
    <main style={{ padding: "3rem 0 4rem" }}>
      <section style={{ maxWidth: "960px", margin: "0 auto 2rem", textAlign: "center", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            background: "rgba(37, 99, 235, 0.12)",
            color: "rgba(191, 219, 254, 0.9)",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          MailMuse · Email Writing Agent
        </div>
        <h1 style={{ fontSize: "3rem", fontWeight: 700, marginTop: "1.5rem", marginBottom: "1rem", color: "#f1f5f9" }}>
          Compose crisp, on-tone emails in seconds
        </h1>
        <p style={{ fontSize: "1.1rem", color: "rgba(226, 232, 240, 0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
          MailMuse ingests your scenario, audience, and desired outcome — then orchestrates subject lines, paragraphs, and closings that resonate. No prompt engineering required.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            color: "rgba(191, 219, 254, 0.85)"
          }}
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              style={{
                minWidth: "240px",
                padding: "1rem 1.4rem",
                borderRadius: "1rem",
                background: "rgba(15, 118, 110, 0.15)",
                border: "1px solid rgba(45, 212, 191, 0.18)",
                textAlign: "left"
              }}
            >
              <div style={{ fontWeight: 600, color: "rgba(224, 242, 254, 0.92)", marginBottom: "0.35rem" }}>{item.title}</div>
              <div style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{item.description}</div>
            </div>
          ))}
        </div>
      </section>
      <EmailAgent />
    </main>
  );
}
