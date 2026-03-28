import { motion } from "framer-motion";

const STEPS = [
  { emoji: "🧠", label: "Logic Agent analyzing..." },
  { emoji: "💰", label: "Finance Agent calculating..." },
  { emoji: "❤️", label: "Emotion Agent processing..." },
  { emoji: "⚠️", label: "Risk Agent assessing..." },
  { emoji: "🔮", label: "Simulating future outcomes..." },
  { emoji: "📋", label: "Building action plan..." },
];

export default function LoadingScreen() {
  return (
    <div style={styles.container}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <motion.div style={styles.content} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Spinning ring */}
        <div style={styles.ringWrap}>
          <motion.div
            style={styles.ring}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            style={{ ...styles.ring, ...styles.ring2 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <span style={styles.ringIcon}>🤖</span>
        </div>

        <motion.h2 style={styles.title} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
          AI Agents at Work
        </motion.h2>
        <p style={styles.sub}>Running multi-agent analysis on your decision...</p>

        {/* Steps */}
        <div style={styles.steps}>
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              style={styles.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4 }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ delay: i * 0.4 + 0.2, duration: 0.4 }}
              >
                {step.emoji}
              </motion.span>
              <span style={styles.stepLabel}>{step.label}</span>
              <motion.div
                style={styles.stepDot}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: i * 0.4, duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative", overflow: "hidden",
    background: "#080b14",
  },
  orb1: {
    position: "fixed", top: "10%", left: "20%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed", bottom: "10%", right: "20%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  content: { textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px" },
  ringWrap: { position: "relative", width: 100, height: 100, margin: "0 auto 28px" },
  ring: {
    position: "absolute", inset: 0, borderRadius: "50%",
    border: "2px solid transparent",
    borderTopColor: "#6366f1", borderRightColor: "rgba(99,102,241,0.3)",
  },
  ring2: {
    inset: 10,
    borderTopColor: "transparent", borderRightColor: "#8b5cf6",
    borderBottomColor: "rgba(139,92,246,0.3)",
  },
  ringIcon: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", fontSize: 28,
  },
  title: { fontSize: "1.6rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8 },
  sub: { color: "#64748b", fontSize: "0.9rem", marginBottom: 36 },
  steps: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" },
  step: {
    display: "flex", alignItems: "center", gap: 12,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10, padding: "10px 16px", textAlign: "left",
  },
  stepLabel: { flex: 1, fontSize: "0.85rem", color: "#94a3b8" },
  stepDot: { width: 6, height: 6, borderRadius: "50%", background: "#6366f1" },
};
