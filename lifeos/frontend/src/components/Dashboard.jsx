import { motion } from "framer-motion";
import { RotateCcw, Download } from "lucide-react";
import AgentDebate from "./AgentDebate.jsx";
import ConfidenceMeter from "./ConfidenceMeter.jsx";
import OutcomeSimulator from "./OutcomeSimulator.jsx";
import ActionPlan from "./ActionPlan.jsx";

const EMOTION_COLORS = {
  supportive: "#6366f1",
  reassuring: "#10b981",
  energizing: "#f59e0b",
  calming: "#06b6d4",
  neutral: "#64748b",
};

export default function Dashboard({ data, onReset }) {
  const { decision, emotion, agents, outcomes, actionPlan, confidence } = data;
  const emotionColor = EMOTION_COLORS[emotion.tone] || "#64748b";

  function handleDownload() {
    const text = `
LIFEOS DECISION ANALYSIS
========================
Decision: ${decision}

CONFIDENCE: ${confidence.confidence}% | Risk: ${confidence.riskLevel}
Recommendation: ${confidence.recommendation}

AGENT PERSPECTIVES
------------------
${agents.map((a) => `${a.emoji} ${a.name}:\n${a.response}`).join("\n\n")}

ACTION PLAN
-----------
${Object.values(actionPlan).map((w) => `${w.title}\n${w.tasks.map((t) => `• ${t}`).join("\n")}`).join("\n\n")}
    `.trim();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "lifeos-analysis.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.container}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.inner}>
        {/* Header */}
        <motion.div style={styles.header} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div style={styles.emotionBadge}>
              <span>{emotion.emoji}</span>
              <span style={{ color: emotionColor }}>{emotion.label} tone detected</span>
            </div>
            <h1 style={styles.title}>Decision Analysis</h1>
            <p style={styles.decisionText}>"{decision}"</p>
          </div>
          <div style={styles.headerActions}>
            <motion.button style={styles.iconBtn} onClick={handleDownload} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Download size={16} />
              Export
            </motion.button>
            <motion.button style={styles.iconBtn} onClick={onReset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <RotateCcw size={16} />
              New Decision
            </motion.button>
          </div>
        </motion.div>

        {/* Confidence at top */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ConfidenceMeter confidence={confidence} />
        </motion.div>

        {/* Agent Debate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AgentDebate agents={agents} />
        </motion.div>

        {/* Outcomes + Action Plan side by side on wide screens */}
        <div style={styles.grid2}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <OutcomeSimulator outcomes={outcomes} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <ActionPlan plan={actionPlan} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", background: "#080b14",
    position: "relative", overflow: "hidden",
  },
  orb1: {
    position: "fixed", top: 0, left: "-10%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed", bottom: 0, right: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  inner: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    flexWrap: "wrap", gap: 16, marginBottom: 28,
  },
  emotionBadge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20, padding: "4px 12px", fontSize: "0.75rem", marginBottom: 8,
  },
  title: { fontSize: "1.8rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 6 },
  decisionText: { color: "#64748b", fontSize: "0.9rem", fontStyle: "italic", maxWidth: 600 },
  headerActions: { display: "flex", gap: 10, flexShrink: 0 },
  iconBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "8px 14px", fontSize: "0.85rem", color: "#94a3b8",
    cursor: "pointer", transition: "all 0.2s",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 20, marginTop: 20,
  },
};
