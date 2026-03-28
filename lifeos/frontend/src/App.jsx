import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./components/Hero.jsx";
import DecisionInput from "./components/DecisionInput.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

export default function App() {
  const [phase, setPhase] = useState("hero"); // hero | input | loading | dashboard
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleAnalyze(decision) {
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      setPhase("dashboard");
    } catch (err) {
      setError(err.message);
      setPhase("input");
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setPhase("input");
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "hero" && (
        <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Hero onStart={() => setPhase("input")} />
        </motion.div>
      )}
      {phase === "input" && (
        <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <DecisionInput onAnalyze={handleAnalyze} error={error} />
        </motion.div>
      )}
      {phase === "loading" && (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoadingScreen />
        </motion.div>
      )}
      {phase === "dashboard" && result && (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Dashboard data={result} onReset={reset} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
