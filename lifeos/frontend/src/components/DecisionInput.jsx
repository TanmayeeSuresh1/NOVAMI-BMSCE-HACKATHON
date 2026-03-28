import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, AlertCircle } from "lucide-react";

const TEMPLATES = [
  { label: "Career", icon: "💼", text: "Should I quit my job and start a startup, or stay and get promoted?" },
  { label: "Finance", icon: "💰", text: "Should I invest my savings in stocks or buy real estate?" },
  { label: "Education", icon: "🎓", text: "Should I pursue a Master's degree or gain work experience?" },
  { label: "Relocation", icon: "🌍", text: "Should I move to a new city for a better opportunity?" },
];

export default function DecisionInput({ onAnalyze, error }) {
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!decision.trim() || loading) return;
    setLoading(true);
    await onAnalyze(decision.trim());
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <div style={styles.orb} />

      <motion.div style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={styles.header}>
          <div style={styles.iconWrap}><Brain size={22} color="#6366f1" /></div>
          <div>
            <h2 style={styles.title}>What's your decision?</h2>
            <p style={styles.sub}>Be specific — the more context, the better the analysis.</p>
          </div>
        </div>

        {/* Templates */}
        <div style={styles.templates}>
          {TEMPLATES.map((t) => (
            <motion.button
              key={t.label}
              style={styles.templateBtn}
              onClick={() => setDecision(t.text)}
              whileHover={{ borderColor: "rgba(99,102,241,0.5)", background: "rgba(99,102,241,0.08)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            style={styles.textarea}
            placeholder="e.g. Should I take the job offer in New York or stay at my current company and wait for a promotion?"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div style={styles.charCount}>{decision.length}/500</div>

          {error && (
            <motion.div style={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: decision.trim().length < 5 ? 0.5 : 1,
            }}
            disabled={decision.trim().length < 5 || loading}
            whileHover={decision.trim().length >= 5 ? { scale: 1.02 } : {}}
            whileTap={decision.trim().length >= 5 ? { scale: 0.98 } : {}}
          >
            {loading ? "Analyzing..." : "Run AI Analysis"}
            <ChevronRight size={18} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "24px",
    background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, #080b14 60%)",
    position: "relative",
  },
  orb: {
    position: "fixed", top: "20%", right: "-5%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(13,17,23,0.9)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20, padding: "36px", width: "100%", maxWidth: 600,
    backdropFilter: "blur(20px)", position: "relative", zIndex: 1,
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  header: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 28 },
  iconWrap: {
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 10, padding: 10, flexShrink: 0,
  },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  sub: { fontSize: "0.875rem", color: "#64748b" },
  templates: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 },
  templateBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8, padding: "7px 14px", fontSize: "0.8rem", color: "#94a3b8",
    cursor: "pointer", transition: "all 0.2s",
  },
  textarea: {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
    padding: "14px 16px", color: "#e2e8f0", fontSize: "0.95rem",
    resize: "vertical", outline: "none", fontFamily: "Inter, sans-serif",
    lineHeight: 1.6, transition: "border-color 0.2s",
  },
  charCount: { textAlign: "right", fontSize: "0.75rem", color: "#475569", marginTop: 6, marginBottom: 16 },
  error: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)",
    borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem",
    color: "#fb7185", marginBottom: 16,
  },
  submitBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 12, padding: "14px",
    fontSize: "1rem", fontWeight: 600, color: "#fff",
    cursor: "pointer", transition: "all 0.2s",
  },
};
