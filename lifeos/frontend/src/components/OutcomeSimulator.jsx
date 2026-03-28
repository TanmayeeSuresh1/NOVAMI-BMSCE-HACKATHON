import { motion } from "framer-motion";
import { GitBranch, TrendingUp, TrendingDown } from "lucide-react";

export default function OutcomeSimulator({ outcomes }) {
  const { optionA, optionB } = outcomes;

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <GitBranch size={18} color="#6366f1" />
        <h2 style={styles.sectionTitle}>Future Outcome Simulator</h2>
      </div>

      <div style={styles.paths}>
        <PathCard option={optionA} type="stable" delay={0} />
        <PathCard option={optionB} type="risky" delay={0.15} />
      </div>
    </div>
  );
}

function PathCard({ option, type, delay }) {
  const isStable = type === "stable";
  const color = isStable ? "#10b981" : "#f59e0b";
  const bg = isStable ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.06)";
  const border = isStable ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)";

  return (
    <motion.div
      style={{ ...styles.card, background: bg, borderColor: border }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div style={styles.cardHeader}>
        <span style={{ ...styles.typeBadge, color, borderColor: border, background: bg }}>
          {isStable ? "📈 Stable Path" : "⚡ Risky Path"}
        </span>
        <span style={{ ...styles.prob, color }}>{option.probability}%</span>
      </div>

      <h3 style={{ ...styles.pathLabel, color }}>{option.label}</h3>

      {/* Timeline */}
      <div style={styles.timeline}>
        <TimelineItem year="Year 1" text={option.year1} color={color} />
        <TimelineItem year="Year 2" text={option.year2} color={color} last />
      </div>

      {/* Best/Worst */}
      <div style={styles.cases}>
        <div style={styles.caseItem}>
          <TrendingUp size={12} color="#10b981" />
          <div>
            <div style={styles.caseLabel}>Best Case</div>
            <div style={styles.caseText}>{option.bestCase}</div>
          </div>
        </div>
        <div style={styles.caseItem}>
          <TrendingDown size={12} color="#f43f5e" />
          <div>
            <div style={styles.caseLabel}>Worst Case</div>
            <div style={styles.caseText}>{option.worstCase}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItem({ year, text, color, last }) {
  return (
    <div style={styles.timelineItem}>
      <div style={styles.timelineLeft}>
        <div style={{ ...styles.dot, background: color }} />
        {!last && <div style={{ ...styles.line, background: color + "40" }} />}
      </div>
      <div style={styles.timelineContent}>
        <span style={{ ...styles.yearLabel, color }}>{year}</span>
        <p style={styles.yearText}>{text}</p>
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
  sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#f1f5f9" },
  paths: { display: "flex", flexDirection: "column", gap: 14 },
  card: { border: "1px solid", borderRadius: 12, padding: "18px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  typeBadge: {
    fontSize: "0.75rem", fontWeight: 600, border: "1px solid",
    borderRadius: 20, padding: "3px 10px",
  },
  prob: { fontSize: "1.2rem", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" },
  pathLabel: { fontSize: "0.95rem", fontWeight: 600, marginBottom: 14 },
  timeline: { marginBottom: 14 },
  timelineItem: { display: "flex", gap: 12, marginBottom: 4 },
  timelineLeft: { display: "flex", flexDirection: "column", alignItems: "center", width: 16, flexShrink: 0 },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  line: { width: 2, flex: 1, minHeight: 20, marginTop: 4 },
  timelineContent: { paddingBottom: 12 },
  yearLabel: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  yearText: { fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6, marginTop: 2 },
  cases: { display: "flex", flexDirection: "column", gap: 8 },
  caseItem: {
    display: "flex", gap: 8, alignItems: "flex-start",
    background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "8px 10px",
  },
  caseLabel: { fontSize: "0.7rem", color: "#475569", fontWeight: 600, marginBottom: 2 },
  caseText: { fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.5 },
};
