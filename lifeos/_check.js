
let lastResult = null;

/* ══ NAV ══ */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

/* ══ EMOTION ══ */
const EMOTIONS=[
  {re:/confused|unsure|don.?t know|not sure|lost|overwhelmed/i,label:'Confused',emoji:'😕',color:'#6366f1',tone:'Supportive mode',msg:'We\'ll guide you step by step.'},
  {re:/scared|afraid|fear|anxious|worried|nervous/i,label:'Anxious',emoji:'😰',color:'#f59e0b',tone:'Reassuring mode',msg:'We\'ll focus on risk mitigation.'},
  {re:/excited|thrilled|amazing|love|can.?t wait|pumped/i,label:'Excited',emoji:'🔥',color:'#10b981',tone:'Energizing mode',msg:'Let\'s channel that energy wisely.'},
  {re:/stressed|pressure|overwhelmed|burnout/i,label:'Stressed',emoji:'😤',color:'#f43f5e',tone:'Calming mode',msg:'We\'ll break this into clear steps.'},
  {re:/happy|confident|ready|sure|certain|positive/i,label:'Confident',emoji:'💪',color:'#06b6d4',tone:'Clarity mode',msg:'Great mindset — let\'s validate it.'},
];
function detectEmotion(t){for(const e of EMOTIONS)if(e.re.test(t))return e;return{label:'Neutral',emoji:'😐',color:'#64748b',tone:'Neutral tone',msg:'Balanced analysis incoming.'};}

function setTpl(t){document.getElementById('decision-input').value=t;onInput();}
function onInput(){
  const val=document.getElementById('decision-input').value;
  document.getElementById('char-count').textContent=val.length;
  document.getElementById('submit-btn').disabled=val.trim().length<5;
  const em=detectEmotion(val);
  const dot=document.getElementById('emotion-dot'),txt=document.getElementById('emotion-live-text'),box=document.getElementById('emotion-live');
  if(val.trim().length>3){dot.style.background=em.color;txt.textContent=`// ${em.emoji} ${em.label.toUpperCase()} DETECTED — ${em.msg}`;box.style.borderColor=em.color+'55';}
  else{dot.style.background='#475569';txt.textContent='// AWAITING INPUT — EMOTION SCANNER READY';box.style.borderColor='';}
}

/* ══ LOADING ══ */
function animateSteps(){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('show','done'));
  document.querySelectorAll('.step').forEach((s,i)=>setTimeout(()=>s.classList.add('show'),i*350));
}
function markDone(i){const s=document.getElementById('s'+i);if(s)s.classList.add('done');}
function delay(ms){return new Promise(r=>setTimeout(r,ms));}

/* ══ KEYWORD EXTRACTOR ══ */
function extractKeywords(text){
  const t=text.toLowerCase();
  const topics={
    career:   /job|career|startup|work|company|salary|promotion|boss|office|employ|business|entrepreneur/i,
    finance:  /invest|money|savings|stock|real estate|property|loan|debt|income|financial|wealth|fund/i,
    education:/degree|master|study|university|college|course|learn|skill|mba|phd|school|education/i,
    relocation:/move|city|relocate|country|abroad|migrate|settle|place|location/i,
    relationship:/marry|marriage|relationship|partner|family|divorce|love|dating/i,
    health:   /health|fitness|diet|exercise|medical|doctor|surgery|mental|therapy/i,
  };
  for(const[k,re] of Object.entries(topics)) if(re.test(t)) return k;
  return 'general';
}

function extractOptions(text){
  const t=text.toLowerCase();
  // Try to find "A or B" pattern
  const orMatch=text.match(/(.+?)\s+or\s+(.+?)[\?\.]/i);
  if(orMatch) return [orMatch[1].trim(), orMatch[2].trim()];
  // Fallback based on topic
  const topic=extractKeywords(text);
  const defaults={
    career:['Stay at current job','Start the startup'],
    finance:['Invest in stocks','Buy real estate'],
    education:['Pursue the degree','Gain work experience'],
    relocation:['Move to the new city','Stay in current location'],
    relationship:['Commit to the relationship','Take more time'],
    health:['Start the health change','Maintain current routine'],
    general:['Option A (safer path)','Option B (bolder path)'],
  };
  return defaults[topic]||defaults.general;
}

/* ══ MOCK AI ENGINE ══ */
function generateAgents(decision, ctx, topic, opts){
  const risk=ctx.risk_appetite||'medium';
  const fin=ctx.financial_status||'moderate savings';
  const age=parseInt(ctx.age)||25;
  const [optA,optB]=opts;
  return [
    { key:'logic', name:'Logic Agent', emoji:'🧠', color:'#6366f1',
      response:`• "${optA}" — stable, predictable, lower upside.\n• "${optB}" — higher variance, greater long-term potential.\n• At age ${age} with ${fin}, opportunity cost of inaction is real.\n• Short-term: "${optA}" wins. Long-term: "${optB}" likely outperforms.\n\nVerdict: If you have 12+ months runway, "${optB}" is the stronger logical choice.`
    },
    { key:'finance', name:'Finance Agent', emoji:'💰', color:'#10b981',
      response:`"${optA}": Stable cash flow, preserves ${fin}, limited upside (~10%/yr).\n"${optB}": Potential 3-10x ROI, but needs 6-18 months runway. 60% face strain in year 1.\n\nVerdict: With ${fin}, "${optB}" only works with 12+ months buffer secured first.`
    },
    { key:'emotion', name:'Emotion Agent', emoji:'❤️', color:'#f43f5e',
      response:`"${optA}": Security, routine, less stress — but risks long-term regret.\n"${optB}": Purpose, growth, ownership — but high stress during uncertainty.\n\nInsight: Which choice will you regret less in 10 years? That's your answer.`
    },
    { key:'risk', name:'Risk Agent', emoji:'⚠️', color:'#f59e0b',
      response:`"${optB}" risks: execution gap, runway depletion, market timing.\n"${optA}" risks: stagnation, skill decay, organizational changes.\n\nWorst case "${optB}": capital gone at month 18, forced return.\nWorst case "${optA}": window closes in 5 years.\n\nRisk Level: ${risk==='low'?'Medium':'High'} — Mitigate with a 90-day pilot first.`
    },
  ];
}

function generateDebate(decision, opts){
  const [optA,optB]=opts;
  return [
    {speaker:'Logic',  color:'#6366f1', msg:`"${optB}" has higher expected value over 3 years. Data beats emotion.`},
    {speaker:'Emotion',color:'#f43f5e', msg:`Data ignores burnout. Emotional readiness determines execution quality.`},
    {speaker:'Finance',color:'#10b981', msg:`Upside is real — but only with 12 months runway. Without it, "${optA}" first.`},
    {speaker:'Risk',   color:'#f59e0b', msg:`70% underestimate year-one complexity. A 90-day pilot changes everything.`},
    {speaker:'Logic',  color:'#6366f1', msg:`Agreed. Staged approach: validate "${optB}" while keeping "${optA}" income.`},
    {speaker:'Emotion',color:'#f43f5e', msg:`That also builds confidence. Confidence directly impacts execution.`},
  ];
}

function generateOutcomes(decision, opts, ctx){
  const [optA,optB]=opts;
  const topic=extractKeywords(decision);
  const outcomes={
    career:{
      a:{sixMonths:`Settled in, performance review due, 8-12% raise likely`,oneYear:`Senior role, team of 2-3, comp up 15-20%`,threeYears:`Domain expert, strong network, income +30%`,best:`Fast-track to leadership`,worst:`Restructuring — role eliminated`},
      b:{sixMonths:`MVP live, first users, early validation`,oneYear:`Product-market fit, small team, revenue covering costs`,threeYears:`Scaled ARR, team of 10+, funding interest`,best:`Acquisition or unicorn path`,worst:`Runway gone at month 14`},
    },
    finance:{
      a:{sixMonths:`Portfolio +8-12%, compounding starts`,oneYear:`+15-20% returns, reinvestment active`,threeYears:`2x initial investment, passive income`,best:`Bull run — 3x returns`,worst:`-30% correction, recoverable`},
      b:{sixMonths:`Property acquired, rental covers 40-60% EMI`,oneYear:`Yield 3-5%, appreciation begins`,threeYears:`Value +20-40%, equity built`,best:`Location goes prime, 2x value`,worst:`Vacancy + maintenance crunch`},
    },
    general:{
      a:{sixMonths:`Adjusted, early results visible`,oneYear:`Momentum established`,threeYears:`Position strengthened, lessons learned`,best:`Exceeds expectations`,worst:`Slower than expected`},
      b:{sixMonths:`Uncertain, signals mixed`,oneYear:`Traction or pivot needed`,threeYears:`Success or valuable experience`,best:`Life trajectory transformed`,worst:`Didn't work — but skills gained`},
    },
  };
  const data=outcomes[topic]||outcomes.general;
  return {
    optionA:{label:`Path A: ${optA}`,sixMonths:data.a.sixMonths,oneYear:data.a.oneYear,threeYears:data.a.threeYears,bestCase:data.a.best,worstCase:data.a.worst,probability:55},
    optionB:{label:`Path B: ${optB}`,sixMonths:data.b.sixMonths,oneYear:data.b.oneYear,threeYears:data.b.threeYears,bestCase:data.b.best,worstCase:data.b.worst,probability:45},
  };
}

function generateSynthesis(decision, opts, ctx){
  const [optA,optB]=opts;
  const risk=ctx.risk_appetite||'medium';
  const fin=ctx.financial_status||'moderate savings';
  const isHighRisk=risk==='high';
  const isLowFin=fin==='limited savings';
  const recommended=isHighRisk&&!isLowFin?optB:isLowFin?optA:`Staged: keep "${optA}", validate "${optB}" in parallel`;
  return {
    recommendedChoice:recommended,
    why:[
      `Matches your risk appetite (${risk}) and financial status (${fin})`,
      `Preserves optionality — course-correct within 6 months if needed`,
      `Logic + Finance agents converge on this when your context is applied`,
    ],
    caution:isLowFin?`Secure 6 months of expenses before any major transition.`:null,
  };
}

function generateConfidence(decision, ctx, topic){
  const risk=ctx.risk_appetite||'medium';
  const fin=ctx.financial_status||'moderate savings';
  const scores={low:62,medium:71,high:78};
  const score=scores[risk]||71;
  return {
    confidence:score,
    riskLevel:{low:'Low',medium:'Medium',high:'High'}[risk]||'Medium',
    consensus:`All agents agree: preparation and a clear timeline matter most.`,
    disagreement:`Logic/Finance favor higher upside; Emotion/Risk prefer a staged transition.`,
    recommendation:`With ${fin} and ${risk} risk appetite, a staged approach maximizes upside while protecting downside. Set a 90-day validation window before committing fully.`,
  };
}

function generateActionPlan(decision, opts, topic){
  const plans={
    career:{
      week1:{title:'Week 1: Clarity',tasks:['List your 3 non-negotiables','Talk to 1 person who made a similar choice','Calculate your financial runway today']},
      week2:{title:'Week 2: Validate',tasks:['Run a 5-day evening pilot on the alternative','Have 2 honest mentor conversations','Write a 1-page decision brief']},
      week3:{title:'Week 3: Commit',tasks:['Set a hard deadline — decide by Friday','Write your 90-day plan','Tell someone — accountability matters']},
      nextSteps:`Execute the 90-day plan. Review with real data at the 90-day mark.`,
    },
    finance:{
      week1:{title:'Week 1: Audit',tasks:['Calculate net worth + monthly burn','Research both options with real numbers','Talk to one experienced investor']},
      week2:{title:'Week 2: Model',tasks:['Run best/base/worst case scenarios','Find your "sleep at night" minimum','Check tax implications']},
      week3:{title:'Week 3: Execute',tasks:['Open accounts or make first move','Set up tracking','Schedule 3-month review']},
      nextSteps:`Review quarterly. Stay the course for 12 months before major changes.`,
    },
    general:{
      week1:{title:'Week 1: Clarity',tasks:['Define success in 3 years for each option','Name your top 3 fears — are they rational?','Talk to someone who\'s been there']},
      week2:{title:'Week 2: Test',tasks:['Take one small action toward each option','Note how each made you feel','Remove one blocker']},
      week3:{title:'Week 3: Commit',tasks:['Decide and write it down','Build a 30-60-90 day plan','Share with your accountability partner']},
      nextSteps:`Start small on day 1. Revisit at 90 days with honest reflection.`,
    },
  };
  const p=plans[topic]||plans.general;
  return {week1:p.week1,week2:p.week2,week3:p.week3,nextSteps:p.nextSteps};
}

/* ══ MAIN RUN ══ */
async function runAnalysis(){
  const decision=document.getElementById('decision-input').value.trim();
  if(decision.length<5)return;
  const ctx={
    age:document.getElementById('ctx-age').value||'25',
    background:document.getElementById('ctx-bg').value||'professional',
    risk_appetite:document.getElementById('ctx-risk').value||'medium',
    financial_status:document.getElementById('ctx-finance').value||'moderate savings',
  };
  showPage('loading');
  animateSteps();

  const topic=extractKeywords(decision);
  const opts=extractOptions(decision);

  // Simulate processing with staggered delays
  await delay(400);  markDone(0);
  await delay(350);  markDone(1);
  await delay(300);  markDone(2);
  await delay(350);  markDone(3);
  await delay(400);  markDone(4);
  await delay(350);  markDone(5);
  await delay(300);  markDone(6);
  await delay(300);

  lastResult={
    decision, ctx,
    emotion:    detectEmotion(decision),
    agents:     generateAgents(decision,ctx,topic,opts),
    debate:     generateDebate(decision,opts),
    outcomes:   generateOutcomes(decision,opts,ctx),
    synthesis:  generateSynthesis(decision,opts,ctx),
    actionPlan: generateActionPlan(decision,opts,topic),
    confidence: generateConfidence(decision,ctx,topic),
  };

  renderDashboard(lastResult);
  showPage('dashboard');
}

/* ══ RENDER ══ */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function renderDashboard(d){
  document.getElementById('nav-decision').textContent=`"${d.decision}"`;
  const em=d.emotion;
  document.getElementById('es-emoji').textContent=em.emoji;
  document.getElementById('es-tone').textContent=em.tone;
  document.getElementById('es-tone').style.color=em.color;
  document.getElementById('es-msg').textContent=em.msg;
  document.getElementById('emotion-strip').style.borderColor=em.color+'40';
  renderConfidence(d.confidence);
  renderAgents(d.agents,d.debate);
  renderSynthesis(d.synthesis);
  renderOutcomes(d.outcomes);
  renderActionPlan(d.actionPlan);
}

function renderConfidence(c){
  const RC={Low:'#10b981',Medium:'#f59e0b',High:'#f43f5e',Critical:'#dc2626'};
  const bc=c.confidence>=75?'#10b981':c.confidence>=50?'#6366f1':c.confidence>=30?'#f59e0b':'#f43f5e';
  const rc=RC[c.riskLevel]||'#f59e0b';
  document.getElementById('confidence-section').innerHTML=`
    <div class="sec-hdr"><span class="sec-icon">🛡️</span><div class="sec-title">Confidence & Risk Analysis</div></div>
    <div class="conf-top">
      <div>
        <div class="score-row"><span class="score-lbl">AI Confidence Score</span><span class="score-val" style="color:${bc}">${c.confidence}%</span></div>
        <div class="bar-track"><div class="bar-fill" id="conf-bar" style="background:${bc}"></div></div>
        <div class="bar-labels"><span>Uncertain</span><span>Highly Confident</span></div>
      </div>
      <div class="risk-badge" style="background:${rc}15;border-color:${rc}45">
        <div class="risk-badge-lbl">Risk Level</div>
        <div class="risk-badge-val" style="color:${rc}">${esc(c.riskLevel)}</div>
      </div>
    </div>
    <div class="conf-cards">
      <div class="conf-card"><div class="conf-card-hdr">✅ Agents Agree On</div><div class="conf-card-text">${esc(c.consensus)}</div></div>
      <div class="conf-card"><div class="conf-card-hdr">⚡ Key Disagreement</div><div class="conf-card-text">${esc(c.disagreement)}</div></div>
    </div>
    <div class="rec-box"><div class="rec-lbl">Final Recommendation</div><div class="rec-text">${esc(c.recommendation)}</div></div>`;
  setTimeout(()=>{document.getElementById('conf-bar').style.width=c.confidence+'%';},120);
}

function renderAgents(agents,debate){
  const cards=agents.map(a=>`
    <div class="agent-card" style="--ac:${a.color}" onclick="this.classList.toggle('open')">
      <div class="agent-hdr">
        <div class="agent-info"><div class="agent-dot" style="background:${a.color}"></div>
          <span style="font-size:18px">${a.emoji}</span><span class="agent-name">${esc(a.name)}</span></div>
        <span class="agent-chevron">▼</span>
      </div>
      <div class="agent-preview">${esc(a.response.slice(0,120))}...</div>
      <div class="agent-full">${esc(a.response)}</div>
    </div>`).join('');
  const debateHTML=debate.map(l=>`
    <div class="debate-line">
      <span class="debate-speaker" style="background:${l.color}22;color:${l.color};border:1px solid ${l.color}44">${esc(l.speaker)}</span>
      <span class="debate-msg">${esc(l.msg)}</span>
    </div>`).join('');
  document.getElementById('agents-section').innerHTML=`
    <div class="sec-hdr"><span class="sec-icon">💬</span><div class="sec-title">Multi-Agent Debate</div><span class="pill">${agents.length} agents</span></div>
    <div class="agents-grid">${cards}</div>
    <div class="debate-box"><div class="debate-title">⚡ Live Agent Debate — Where They Disagree</div>${debateHTML}</div>`;
}

function renderSynthesis(s){
  const whyHTML=(s.why||[]).map(w=>`<div class="synth-why-item"><span class="synth-bullet">›</span><span>${esc(w)}</span></div>`).join('');
  const cautionHTML=s.caution?`<div class="synth-caution">⚠️ Caution: ${esc(s.caution)}</div>`:'';
  document.getElementById('synthesis-section').innerHTML=`
    <div class="sec-hdr"><span class="sec-icon">🎯</span><div class="sec-title">Final Decision Synthesis</div></div>
    <div class="synthesis-box">
      <div class="synth-choice">Recommended: ${esc(s.recommendedChoice)}</div>
      <div class="synth-why">${whyHTML}</div>${cautionHTML}
    </div>`;
}

function renderOutcomes(o){
  document.getElementById('outcomes-section').innerHTML=`
    <div class="sec-hdr"><span class="sec-icon">🔮</span><div class="sec-title">3-Year Outcome Simulator</div></div>
    <div class="outcomes-grid">${buildPath(o.optionA,'#10b981')}${buildPath(o.optionB,'#f59e0b')}</div>`;
}

function buildPath(opt,color){
  const periods=[{label:'6 Months',val:opt.sixMonths},{label:'1 Year',val:opt.oneYear},{label:'3 Years',val:opt.threeYears}];
  const tlHTML=periods.map((p,i)=>`
    <div class="tl-row">
      <div class="tl-spine">
        <div class="tl-dot" style="background:${color};border-color:${color}"></div>
        ${i<2?`<div class="tl-line" style="background:${color}"></div>`:''}
      </div>
      <div class="tl-body"><div class="tl-period" style="color:${color}">${p.label}</div><div class="tl-text">${esc(p.val||'')}</div></div>
    </div>`).join('');
  return `
    <div class="path-card" style="background:${color}0c;border-color:${color}38">
      <div class="path-hdr">
        <span class="path-type" style="color:${color};border-color:${color}45;background:${color}18">${esc(opt.label)}</span>
        <span class="path-prob" style="color:${color}">${opt.probability}%</span>
      </div>
      <div class="tl">${tlHTML}</div>
      <div class="cases">
        <div class="case-row"><span>📈</span><div><div class="case-lbl">Best Case</div><div class="case-text">${esc(opt.bestCase)}</div></div></div>
        <div class="case-row"><span>📉</span><div><div class="case-lbl">Worst Case</div><div class="case-text">${esc(opt.worstCase)}</div></div></div>
      </div>
    </div>`;
}

function renderActionPlan(plan){
  const colors=['#6366f1','#8b5cf6','#a78bfa'];
  const weeks=[plan.week1,plan.week2,plan.week3].filter(Boolean);
  const html=weeks.map((w,i)=>`
    <div class="week-card" style="border-left-color:${colors[i]}">
      <div class="week-title" style="color:${colors[i]}">${esc(w.title)}</div>
      <ul class="task-list">${(w.tasks||[]).map(t=>`<li class="task-item"><span class="task-dot" style="background:${colors[i]}"></span>${esc(t)}</li>`).join('')}</ul>
    </div>`).join('');
  const nextHTML=plan.nextSteps?`<div class="next-steps"><div class="next-steps-lbl">Next Steps</div>${esc(plan.nextSteps)}</div>`:'';
  document.getElementById('action-section').innerHTML=`
    <div class="sec-hdr"><span class="sec-icon">📋</span><div class="sec-title">3-Week Action Plan</div>
      <button class="copy-btn" onclick="copyPlan()">📋 Copy</button></div>
    <div class="weeks">${html}</div>${nextHTML}`;
}

/* ══ COPY / EXPORT ══ */
function copyPlan(){
  if(!lastResult)return;
  const text=[lastResult.actionPlan.week1,lastResult.actionPlan.week2,lastResult.actionPlan.week3]
    .filter(Boolean).map(w=>`${w.title}\n${w.tasks.map(t=>`• ${t}`).join('\n')}`).join('\n\n');
  navigator.clipboard.writeText(text).then(()=>{
    const b=document.querySelector('.copy-btn');
    if(b){b.textContent='✅ Copied!';setTimeout(()=>b.textContent='📋 Copy',2000);}
  });
}

function exportPlan(){
  if(!lastResult)return;
  const d=lastResult;
  const lines=[
    'LIFEOS DECISION ANALYSIS','========================',
    `Decision: ${d.decision}`,`Context: Age ${d.ctx.age}, ${d.ctx.background}, Risk: ${d.ctx.risk_appetite}, Finance: ${d.ctx.financial_status}`,'',
    `Confidence: ${d.confidence.confidence}% | Risk: ${d.confidence.riskLevel}`,`Recommendation: ${d.confidence.recommendation}`,'',
    'AGENT PERSPECTIVES','------------------',
    ...d.agents.map(a=>`${a.emoji} ${a.name}:\n${a.response}\n`),
    'FINAL SYNTHESIS','---------------',
    `Recommended: ${d.synthesis.recommendedChoice}`,
    ...(d.synthesis.why||[]).map(w=>`• ${w}`),
    d.synthesis.caution?`Caution: ${d.synthesis.caution}`:'','',
    '3-YEAR OUTCOMES','---------------',
    `${d.outcomes.optionA.label} (${d.outcomes.optionA.probability}%)`,
    `  6mo: ${d.outcomes.optionA.sixMonths}`,`  1yr: ${d.outcomes.optionA.oneYear}`,`  3yr: ${d.outcomes.optionA.threeYears}`,'',
    `${d.outcomes.optionB.label} (${d.outcomes.optionB.probability}%)`,
    `  6mo: ${d.outcomes.optionB.sixMonths}`,`  1yr: ${d.outcomes.optionB.oneYear}`,`  3yr: ${d.outcomes.optionB.threeYears}`,'',
    'ACTION PLAN','-----------',
    ...[d.actionPlan.week1,d.actionPlan.week2,d.actionPlan.week3].filter(Boolean)
      .map(w=>`${w.title}\n${w.tasks.map(t=>`• ${t}`).join('\n')}`),
    `\nNext Steps:\n${d.actionPlan.nextSteps||''}`
  ];
  const blob=new Blob([lines.join('\n')],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='lifeos-analysis.txt';a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════
   CHATBOT ENGINE — AI POWERED
══════════════════════════════════════════════ */
const chatHistory = [];
let chatApiKey = ''; // separate from main API_KEY, user can set independently

/* Build system prompt with full decision context */
function buildSystemPrompt() {
  const base = `You are LifeOS Assistant — a sharp, friendly AI decision coach embedded in the LifeOS decision intelligence app.
You help users think through life decisions: career, finance, relationships, education, relocation, and more.
Be concise, direct, and warm. Use bullet points when listing things. Keep replies under 150 words unless the user asks for detail.
Never say "I'm just an AI" — just answer helpfully and confidently.`;

  if (!lastResult) return base;

  const d = lastResult;
  return `${base}

CURRENT DECISION CONTEXT:
Decision: "${d.decision}"
User profile: Age ${d.ctx.age}, ${d.ctx.background}, Risk appetite: ${d.ctx.risk_appetite}, Financial status: ${d.ctx.financial_status}
Emotion detected: ${d.emotion.label}

AGENT VERDICTS:
- Logic: ${d.agents.find(a=>a.key==='logic')?.response.split('\n').slice(-1)[0] || ''}
- Finance: ${d.agents.find(a=>a.key==='finance')?.response.split('\n').slice(-1)[0] || ''}
- Emotion: ${d.agents.find(a=>a.key==='emotion')?.response.split('\n').slice(-1)[0] || ''}
- Risk: ${d.agents.find(a=>a.key==='risk')?.response.split('\n').slice(-1)[0] || ''}

RECOMMENDATION: ${d.synthesis.recommendedChoice}
CONFIDENCE: ${d.confidence.confidence}% | RISK LEVEL: ${d.confidence.riskLevel}
KEY DISAGREEMENT: ${d.confidence.disagreement}

Answer questions about this decision using the above context. If asked something unrelated to the decision, answer it as a general knowledgeable assistant.`;
}

/* Call OpenAI with full conversation history */
async function callChatAI(userMessage) {
  const key = chatApiKey || (typeof API_KEY !== 'undefined' ? API_KEY : '');
  if (!key) throw new Error('NO_KEY');

  // Keep last 10 messages for context
  const recentHistory = chatHistory.slice(-10).map(m => ({
    role: m.role === 'bot' ? 'assistant' : 'user',
    content: m.text
  }));

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...recentHistory,
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || 'API error ' + res.status);
  }
  return (await res.json()).choices[0].message.content;
}

/* Local KB — instant answers for common questions without API */
function localReply(input) {
  const t = input.toLowerCase();

  if (/^(hi|hello|hey|sup|yo)\b/i.test(input))
    return `Hey! 👋 I'm your LifeOS Assistant — ask me anything. Decision advice, life questions, or just thinking out loud. I've got you.`;

  if (/\b(recommend|should i|best choice|which one|verdict)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first and I'll give you a clear recommendation.`;
    const s = lastResult.synthesis;
    return `Recommendation: ${s.recommendedChoice}\n\n${(s.why||[]).map(w=>`• ${w}`).join('\n')}${s.caution ? `\n\n⚠️ ${s.caution}` : ''}`;
  }
  if (/\b(risk|danger|worst|fail)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first and I'll break down the risks.`;
    return lastResult.agents.find(a=>a.key==='risk')?.response || 'No risk data.';
  }
  if (/\b(financ|money|cost|salary|invest|budget)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first for the financial breakdown.`;
    return lastResult.agents.find(a=>a.key==='finance')?.response || 'No finance data.';
  }
  if (/\b(feel|emotion|stress|happy|anxious|burnout)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first for the emotional perspective.`;
    return lastResult.agents.find(a=>a.key==='emotion')?.response || 'No emotion data.';
  }
  if (/\b(action|plan|week|steps|how to start)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first and I'll show your action plan.`;
    const p = lastResult.actionPlan;
    return `${p.week1?.title}\n${(p.week1?.tasks||[]).map(t=>`• ${t}`).join('\n')}\n\n${p.week2?.title}\n${(p.week2?.tasks||[]).map(t=>`• ${t}`).join('\n')}\n\n${p.week3?.title}\n${(p.week3?.tasks||[]).map(t=>`• ${t}`).join('\n')}`;
  }
  if (/\b(outcome|future|year|scenario|simulation)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first to see the outcome simulation.`;
    const o = lastResult.outcomes;
    return `${o.optionA.label} (${o.optionA.probability}%)\n• 6mo: ${o.optionA.sixMonths}\n• 1yr: ${o.optionA.oneYear}\n• 3yr: ${o.optionA.threeYears}\n\n${o.optionB.label} (${o.optionB.probability}%)\n• 6mo: ${o.optionB.sixMonths}\n• 1yr: ${o.optionB.oneYear}\n• 3yr: ${o.optionB.threeYears}`;
  }
  if (/\b(confidence|score|percent|how sure)\b/i.test(t)) {
    if (!lastResult) return `Run an analysis first to see the confidence score.`;
    const c = lastResult.confidence;
    return `Confidence: ${c.confidence}% | Risk: ${c.riskLevel}\n\n${c.recommendation}`;
  }
  if (/\b(help|what can you|capabilities)\b/i.test(t))
    return `I can answer anything — decision advice, life questions, career, finance, relationships, or just general knowledge. Ask away!\n\nWith an OpenAI key set, I use GPT-4o-mini for full AI answers. Without one, I use smart local responses.`;
  if (/\b(thank|thanks|great|awesome|perfect)\b/i.test(t))
    return `You've got this. 🙌 The best decision is the one you actually execute.`;

  return null; // signal to try AI
}

/* Main reply handler — tries AI first, falls back to local */
async function chatbotReply(input) {
  // Try local KB first for instant common answers
  const local = localReply(input);

  // Try AI
  try {
    const aiReply = await callChatAI(input);
    return aiReply;
  } catch (err) {
    if (err.message === 'NO_KEY') {
      // No key — use local if available, else prompt to set key
      if (local) return local;
      return `I can answer that better with an AI key! Tap "Set AI Key" below to enable full answers, or ask me about your decision analysis — I can answer those without a key.`;
    }
    // API error — fall back to local
    if (local) return local + '\n\n_(AI unavailable — showing local analysis)_';
    return `Something went wrong with the AI (${err.message}). Try again or ask about your decision analysis — I can answer those locally.`;
  }
}

/* ══ CHAT UI — injected into body ══ */
function buildChatUI() {
  if (document.getElementById('chat-fab')) return; // already built
  document.body.insertAdjacentHTML('beforeend', `
  <button id="chat-fab" onclick="toggleChat()"
    style="position:fixed;bottom:28px;right:28px;z-index:500;width:56px;height:56px;border-radius:50%;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;cursor:pointer;
      box-shadow:0 8px 32px rgba(99,102,241,.5);display:flex;align-items:center;justify-content:center;
      font-size:22px;transition:transform .2s,box-shadow .2s;position:fixed">
    💬
    <span id="chat-badge" style="position:absolute;top:0;right:0;width:16px;height:16px;
      background:#f43f5e;border-radius:50%;font-size:9px;color:#fff;display:flex;
      align-items:center;justify-content:center;font-weight:700;pointer-events:none">1</span>
  </button>

  <div id="chat-panel" style="display:none;position:fixed;bottom:96px;right:28px;z-index:500;
    width:360px;max-width:calc(100vw - 40px);height:500px;background:#0d1117;
    border:1px solid rgba(99,102,241,.3);border-radius:20px;flex-direction:column;
    box-shadow:0 24px 80px rgba(0,0,0,.7);overflow:hidden">

    <div style="background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1));
      border-bottom:1px solid rgba(99,102,241,.2);padding:16px 18px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);
        display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🤖</div>
      <div style="flex:1">
        <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.95rem;color:#f1f5f9">LifeOS Assistant</div>
        <div style="font-size:.72rem;color:#10b981;display:flex;align-items:center;gap:4px">
          <span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;flex-shrink:0"></span>Always online
        </div>
      </div>
      <button onclick="toggleChat()" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:22px;padding:4px;line-height:1;flex-shrink:0">×</button>
    </div>

    <div id="chat-key-row" style="padding:7px 14px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;align-items:center;gap:8px;flex-shrink:0">
      <span id="chat-key-status" style="font-size:.68rem;font-family:monospace;flex:1;color:#475569">AI: local mode</span>
      <button onclick="setChatKey()" style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);border-radius:6px;padding:3px 9px;font-size:.68rem;color:#a5b4fc;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap">🔑 Set AI Key</button>
    </div>

    <div style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0">
      <button onclick="quickAsk('What do you recommend?')" style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:20px;padding:4px 10px;font-size:.72rem;color:#a5b4fc;cursor:pointer;font-family:Inter,sans-serif">🎯 Recommend</button>
      <button onclick="quickAsk('What are the main risks?')" style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:20px;padding:4px 10px;font-size:.72rem;color:#fbbf24;cursor:pointer;font-family:Inter,sans-serif">⚠️ Risks</button>
      <button onclick="quickAsk('Show me the action plan')" style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:20px;padding:4px 10px;font-size:.72rem;color:#34d399;cursor:pointer;font-family:Inter,sans-serif">📋 Plan</button>
      <button onclick="quickAsk('What happens in 3 years?')" style="background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:20px;padding:4px 10px;font-size:.72rem;color:#c4b5fd;cursor:pointer;font-family:Inter,sans-serif">🔮 Outcomes</button>
    </div>

    <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:0"></div>

    <div style="padding:12px 14px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:8px;align-items:flex-end;flex-shrink:0">
      <textarea id="chat-input" rows="1"
        onkeydown="chatKeydown(event)"
        oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,80)+'px'"
        placeholder="Ask anything about your decision..."
        style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:10px;
          padding:9px 12px;color:#e2e8f0;font-size:.83rem;outline:none;resize:none;
          font-family:Inter,sans-serif;line-height:1.5;max-height:80px;transition:border-color .2s"></textarea>
      <button onclick="sendChat()"
        style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
          font-size:15px;flex-shrink:0">➤</button>
    </div>
  </div>`);
}

function toggleChat() {
  buildChatUI();
  const badge = document.getElementById('chat-badge');
  const panel = document.getElementById('chat-panel');
  const isOpen = panel.style.display === 'flex';
  panel.style.display = isOpen ? 'none' : 'flex';
  if (badge) badge.style.display = 'none';
  if (!isOpen && chatHistory.length === 0) {
    const greeting = lastResult
      ? `Hey! 👋 I've analyzed your decision:\n"${lastResult.decision.slice(0,70)}..."\n\nAsk me anything — risks, finances, outcomes, action plan, or what I recommend.`
      : `Hey! 👋 I'm your LifeOS Assistant.\n\nRun an analysis first, then I can answer specific questions about your decision. Or ask me about decision frameworks, timing, or how LifeOS works!`;
    addBotMessage(greeting);
  }
}

function addBotMessage(text) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;align-items:flex-start;margin-bottom:14px';
  div.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);
      display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">🤖</div>
    <div style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);
      border-radius:0 12px 12px 12px;padding:11px 14px;font-size:.83rem;color:#c7d2fe;
      line-height:1.7;max-width:85%;white-space:pre-wrap;word-break:break-word">${esc(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({role:'bot', text});
}

function addUserMessage(text) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;align-items:flex-start;justify-content:flex-end;margin-bottom:14px';
  div.innerHTML = `
    <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
      border-radius:12px 0 12px 12px;padding:11px 14px;font-size:.83rem;color:#e2e8f0;
      line-height:1.7;max-width:85%;word-break:break-word">${esc(text)}</div>
    <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.08);
      display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">👤</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({role:'user', text});
}

function sendChat() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  addUserMessage(text);
  const msgs = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.id = 'typing-indicator';
  typing.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:14px';
  typing.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);
      display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">🤖</div>
    <div style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);
      border-radius:0 12px 12px 12px;padding:11px 14px;display:flex;gap:5px;align-items:center">
      <span style="width:7px;height:7px;border-radius:50%;background:#6366f1;display:inline-block;animation:pulse .8s infinite"></span>
      <span style="width:7px;height:7px;border-radius:50%;background:#6366f1;display:inline-block;animation:pulse .8s .25s infinite"></span>
      <span style="width:7px;height:7px;border-radius:50%;background:#6366f1;display:inline-block;animation:pulse .8s .5s infinite"></span>
    </div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  // chatbotReply is now async
  chatbotReply(text).then(reply => {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
    addBotMessage(reply);
  }).catch(() => {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
    addBotMessage('Something went wrong. Try again!');
  });
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}

function setChatKey() {
  const k = prompt('Paste your OpenAI API key (sk-...):\n\nEnables full GPT-4o-mini answers for any question.');
  if (!k || !k.trim()) return;
  chatApiKey = k.trim();
  const status = document.getElementById('chat-key-status');
  if (status) { status.textContent = 'AI: GPT-4o-mini ✓'; status.style.color = '#10b981'; }
  addBotMessage('AI key set! 🚀 I can now answer anything — ask me any question on any topic.');
}

function quickAsk(q) {
  buildChatUI();
  const panel = document.getElementById('chat-panel');
  panel.style.display = 'flex';
  const badge = document.getElementById('chat-badge');
  if (badge) badge.style.display = 'none';
  if (chatHistory.length === 0) {
    addBotMessage(lastResult ? `Hey! 👋 I've analyzed your decision. Ask me anything!` : `Hey! 👋 I'm your LifeOS Assistant. Ask me anything!`);
  }
  addUserMessage(q);
  chatbotReply(q).then(r => addBotMessage(r)).catch(() => addBotMessage('Try again!'));
}

/* ══ GAMER PARTICLES + CHAT INIT ══ */
window.addEventListener('DOMContentLoaded', () => {
  // Always build the chat button on load so it's visible immediately
  buildChatUI();

  const container = document.getElementById('game-particles');
  if (!container) return;
  const colors = ['rgba(0,255,128,.7)','rgba(0,200,255,.6)','rgba(0,255,200,.5)','rgba(100,255,150,.4)'];
  for (let i = 0; i < 35; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 3 + 1;
    span.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;
      animation-duration:${5+Math.random()*12}s;animation-delay:${Math.random()*10}s;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      box-shadow:0 0 ${size*3}px ${colors[0]};`;
    container.appendChild(span);
  }
});
