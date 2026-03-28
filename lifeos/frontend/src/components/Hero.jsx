import { motion } from "framer-motion";
import { Brain, Zap, ArrowRight } from "lucide-react";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
}));

export default function Hero({ onStart }) {
  return (
    <div style={styles.container}>
      {/* Animated background particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.4)",
            pointerEvents: "none",
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + p.delay, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* Glow orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <motion.div
        style={styles.content}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div style={styles.badge} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Zap size={12} color="#6366f1" />
          <span>AI-Powered Decision Intelligence</span>
        </motion.div>

        <motion.h1 style={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          Stop Guessing.
          <br />
          <span style={styles.gradient}>Start Deciding.</span>
        </motion.h1>

        <motion.p style={styles.subtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          LifeOS simulates your future, debates your options through multiple AI agents,
          and turns uncertainty into a clear action plan.
        </motion.p>

        <motion.div style={styles.features} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {["Multi-Agent Debate", "Future Simulation", "Confidence Scoring", "Action Plan"].map((f) => (
            <span key={f} style={styles.featureTag}>{f}</span>
          ))}
        </motion.div>

        <motion.button
          style={styles.cta}
          onClick={onStart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Brain size={18} />
          Analyze My Decision
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, #080b14 60%)",
  },
  orb1: {
    position: "fixed", top: "-20%", left: "-10%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed", bottom: "-20%", right: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  content: {
    textAlign: "center",
    maxWidth: 680,
    padding: "0 24px",
    position: "relative",
    zIndex: 1,
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 20, padding: "6px 14px", fontSize: 12,
    color: "#a5b4fc", marginBottom: 28, letterSpacing: "0.05em",
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: 700, lineHeight: 1.1,
    color: "#f1f5f9", marginBottom: 20,
  },
  gradient: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.7,
    marginBottom: 28, maxWidth: 520, margin: "0 auto 28px",
  },
  features: {
    display: "flex", flexWrap: "wrap", gap: 8,
    justifyContent: "center", marginBottom: 36,
  },
  featureTag: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#94a3b8",
  },
  cta: {
    display: "inline-flex", alignItems: "center", gap: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 12, padding: "14px 28px",
    fontSize: "1rem", fontWeight: 600, color: "#fff",
    cursor: "pointer", transition: "all 0.2s",
  },
};
