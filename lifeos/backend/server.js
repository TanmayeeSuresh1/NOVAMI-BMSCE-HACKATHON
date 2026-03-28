import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import {
  AGENTS,
  OUTCOME_PROMPT,
  ACTION_PLAN_PROMPT,
  CONFIDENCE_PROMPT,
} from "./agents.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: call OpenAI with a system + user prompt
async function callLLM(systemPrompt, userMessage, jsonMode = false) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    ...(jsonMode && { response_format: { type: "json_object" } }),
    temperature: 0.7,
    max_tokens: 600,
  });
  return response.choices[0].message.content;
}

// Detect emotion/tone from input text
function detectEmotion(text) {
  const lower = text.toLowerCase();
  if (/confused|unsure|don't know|not sure|lost|overwhelmed/.test(lower))
    return { tone: "supportive", label: "Confused", emoji: "😕" };
  if (/scared|afraid|fear|terrified|anxious|worried/.test(lower))
    return { tone: "reassuring", label: "Anxious", emoji: "😰" };
  if (/excited|thrilled|can't wait|amazing|love/.test(lower))
    return { tone: "energizing", label: "Excited", emoji: "🔥" };
  if (/stressed|pressure|deadline|overwhelmed/.test(lower))
    return { tone: "calming", label: "Stressed", emoji: "😤" };
  return { tone: "neutral", label: "Neutral", emoji: "😐" };
}

// POST /api/analyze — main endpoint
app.post("/api/analyze", async (req, res) => {
  const { decision } = req.body;
  if (!decision || decision.trim().length < 5) {
    return res.status(400).json({ error: "Please provide a valid decision." });
  }

  try {
    // Run all 4 agents in parallel
    const agentPromises = Object.entries(AGENTS).map(async ([key, agent]) => {
      const response = await callLLM(
        agent.systemPrompt,
        `Decision to analyze: "${decision}"`
      );
      return { key, ...agent, response };
    });

    const agentResults = await Promise.all(agentPromises);

    // Build summary of agent responses for confidence scoring
    const agentSummary = agentResults
      .map((a) => `${a.name}: ${a.response}`)
      .join("\n\n");

    // Run outcome sim, action plan, and confidence in parallel
    const [outcomesRaw, actionPlanRaw, confidenceRaw] = await Promise.all([
      callLLM("You are a future scenario simulator.", OUTCOME_PROMPT(decision), true),
      callLLM("You are an action plan generator.", ACTION_PLAN_PROMPT(decision), true),
      callLLM("You are a decision analyst.", CONFIDENCE_PROMPT(decision, agentSummary), true),
    ]);

    const emotion = detectEmotion(decision);

    res.json({
      decision,
      emotion,
      agents: agentResults,
      outcomes: JSON.parse(outcomesRaw),
      actionPlan: JSON.parse(actionPlanRaw),
      confidence: JSON.parse(confidenceRaw),
    });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: "AI analysis failed. Check your API key and try again." });
  }
});

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LifeOS backend running on port ${PORT}`));
