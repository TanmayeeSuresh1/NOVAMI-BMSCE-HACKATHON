import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const RISK_CONFIG = {
  Low: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  High: { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
  Critical: { color: "#dc2626", bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.2)" },
};

export default function ConfidenceMeter({ confidence }) {
  const { confidence: score, riskLevel, consensus, disagreement, recommendation } = confidence;
  const risk = RISK_CONFIG[riskLevel] || RISK_CONFIG.Medium;

  const barColor =
    score >= 75 ? "#10b981" :
    score >= 50 ? "#6366f1" :
    score >= 30 ? "#f59e0b" : "#f43f5e";

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <Shield size={18} color="#6366f1" />
        <h2 style={styles.sectionTitle}>Confidence & Risk Analysis</h2>
      </div>

      <div style={styles.grid}>
        {/* Confidence score */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreTop}>
            <span style={styles.scoreLabel}>AI Confidence</span>
            <motion.span
              style={{ ...styles.scoreValue, color: barColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {score}%
            </motion.span>
          </div>
          <div style={styles.barTrack}>
            <motion.div
              style={{ ...styles.barFill, background: barColor }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            />
          </div>
          <div style={styles.barLabels}>
            <span>Uncertain</span>
            <span>Confident</span>
          </div>
        </div>

        {/* Risk level */}
        <div style={{ ...styles.riskCard, background: risk.bg, borderColor: risk.border }}>
          <AlertCircle size={16} color={risk.color} />
          <div>
            <div style={styles.riskLabel}>Risk Level</div>
            <div style={{ ...styles.riskValue, color: risk.color }}>{riskLevel}</div>
          </div>
        </div>
      </div>

      {/* Consensus */}
      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <CheckCircle size={14} color="#10b981" />
            <span style={styles.infoTitle}>Agents Agree On</span>
          </div>
          <p style={styles.infoText}>{consensus}</p>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <TrendingUp size={14} color="#f59e0b" />
            <span style={styles.infoTitle}>Key Disagreement</span>
          </div>
          <p style={styles.infoText}>{disagreement}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div style={styles.recommendation}>
        <div style={styles.recLabel}>Final Recommendation</div>
        <p style={styles.recText}>{recommendation}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(13,17,23,0.8)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "24px", marginBottom: 20,
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#f1f5f9" },
  grid: { display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 16, alignItems: "start" },
  scoreCard: { flex: 1 },
  scoreTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  scoreLabel: { fontSize: "0.85rem", color: "#64748b" },
  scoreValue: { fontSize: "2rem", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" },
  barTrack: { height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4 },
  barLabels: { display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#475569", marginTop: 6 },
  riskCard: {
    display: "flex", alignItems: "center", gap: 10,
    border: "1px solid", borderRadius: 12, padding: "14px 18px", flexShrink: 0,
  },
  riskLabel: { fontSize: "0.75rem", color: "#64748b", marginBottom: 2 },
  riskValue: { fontSize: "1rem", fontWeight: 700 },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 },
  infoCard: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10, padding: "14px",
  },
  infoHeader: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 },
  infoTitle: { fontSize: "0.78rem", color: "#64748b", fontWeight: 500 },
  infoText: { fontSize: "0.83rem", color: "#94a3b8", lineHeight: 1.6 },
  recommendation: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
    border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "16px",
  },
  recLabel: { fontSize: "0.75rem", color: "#6366f1", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" },
  recText: { fontSize: "0.9rem", color: "#c7d2fe", lineHeight: 1.7 },
};
