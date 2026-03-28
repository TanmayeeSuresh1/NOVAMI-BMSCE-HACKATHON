import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const AGENT_COLORS = {
  logic: "#6366f1",
  finance: "#10b981",
  emotion: "#f43f5e",
  risk: "#f59e0b",
};

export default function AgentDebate({ agents }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <MessageSquare size={18} color="#6366f1" />
        <h2 style={styles.sectionTitle}>Multi-Agent Debate</h2>
        <span style={styles.badge}>{agents.length} agents</span>
      </div>

      <div style={styles.grid}>
        {agents.map((agent, i) => {
          const color = AGENT_COLORS[agent.key] || "#6366f1";
          const isOpen = expanded === agent.key;

          return (
            <motion.div
              key={agent.key}
              style={{ ...styles.card, borderColor: isOpen ? color : "rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: color }}
            >
              <div style={styles.cardHeader} onClick={() => setExpanded(isOpen ? null : agent.key)}>
                <div style={styles.agentInfo}>
                  <div style={{ ...styles.agentDot, background: color }} />
                  <span style={styles.agentEmoji}>{agent.emoji}</span>
                  <span style={styles.agentName}>{agent.name}</span>
                </div>
                <button style={styles.expandBtn}>
                  {isOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </button>
              </div>

              {/* Preview */}
              {!isOpen && (
                <p style={styles.preview}>
                  {agent.response.slice(0, 120)}...
                </p>
              )}

              {/* Full response */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={styles.fullResponse}>{agent.response}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Disagreement highlight */}
      <motion.div
        style={styles.disagreement}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AlertTriangle size={14} color="#f59e0b" />
        <span>Click any agent card to expand their full analysis. Agents may disagree — that's the point.</span>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(13,17,23,0.8)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "24px", marginBottom: 20,
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#f1f5f9", flex: 1 },
  badge: {
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 20, padding: "2px 10px", fontSize: "0.75rem", color: "#a5b4fc",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },
  card: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "16px", cursor: "pointer", transition: "border-color 0.2s",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  agentInfo: { display: "flex", alignItems: "center", gap: 8 },
  agentDot: { width: 8, height: 8, borderRadius: "50%" },
  agentEmoji: { fontSize: 18 },
  agentName: { fontSize: "0.9rem", fontWeight: 600, color: "#e2e8f0" },
  expandBtn: { background: "none", border: "none", cursor: "pointer", padding: 2 },
  preview: { fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6 },
  fullResponse: { fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.7, paddingTop: 8 },
  disagreement: {
    display: "flex", alignItems: "center", gap: 8, marginTop: 16,
    background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)",
    borderRadius: 8, padding: "10px 14px", fontSize: "0.78rem", color: "#94a3b8",
  },
};
