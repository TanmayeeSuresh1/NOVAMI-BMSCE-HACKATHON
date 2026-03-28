import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Copy, Check } from "lucide-react";

const WEEK_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa"];

export default function ActionPlan({ plan }) {
  const [copied, setCopied] = useState(false);
  const weeks = Object.values(plan);

  function handleCopy() {
    const text = weeks
      .map((w) => `${w.title}\n${w.tasks.map((t) => `• ${t}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <ClipboardList size={18} color="#6366f1" />
        <h2 style={styles.sectionTitle}>3-Week Action Plan</h2>
        <motion.button
          style={styles.copyBtn}
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>

      <div style={styles.weeks}>
        {weeks.map((week, i) => (
          <motion.div
            key={i}
            style={{ ...styles.weekCard, borderLeftColor: WEEK_COLORS[i] }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div style={{ ...styles.weekTitle, color: WEEK_COLORS[i] }}>{week.title}</div>
            <ul style={styles.taskList}>
              {week.tasks.map((task, j) => (
                <motion.li
                  key={j}
                  style={styles.task}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + j * 0.08 }}
                >
                  <span style={{ ...styles.taskDot, background: WEEK_COLORS[i] }} />
                  {task}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(13,17,23,0.8)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "24px",
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#f1f5f9", flex: 1 },
  copyBtn: {
    display: "flex", alignItems: "center", gap: 5,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6, padding: "5px 10px", fontSize: "0.78rem", color: "#94a3b8",
    cursor: "pointer",
  },
  weeks: { display: "flex", flexDirection: "column", gap: 14 },
  weekCard: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderLeft: "3px solid", borderRadius: "0 10px 10px 0", padding: "14px 16px",
  },
  weekTitle: { fontSize: "0.85rem", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" },
  taskList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 8 },
  task: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.83rem", color: "#94a3b8", lineHeight: 1.5 },
  taskDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 6 },
};
