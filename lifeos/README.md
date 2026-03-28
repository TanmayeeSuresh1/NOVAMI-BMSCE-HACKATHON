# LifeOS — AI Decision Intelligence System

> Multi-agent AI that simulates life outcomes, debates your decisions, and builds your action plan.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your OpenAI API key to .env
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Stack
- Frontend: React + Vite + Framer Motion
- Backend: Node.js + Express + OpenAI GPT-4o-mini
- Agents: Logic, Finance, Emotion, Risk (parallel calls)
