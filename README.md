# 💰 Windfall Advisor

**AI-powered financial guidance for unexpected windfalls**

🔗 **[Live Demo](https://windfall-advisor.vercel.app/)**

---

## What It Does

Windfall Advisor helps people make smart decisions about unexpected money—whether it's a tax refund, year-end bonus, or gift. Instead of generic advice, it provides personalized allocation recommendations based on the user's unique financial situation.

**The Problem:** Most people don't know how to optimally allocate a financial windfall. Generic advice doesn't account for individual circumstances like existing debt, emergency fund status, or income stability.

**The Solution:** A 3-minute questionnaire that feeds into Claude AI, generating personalized recommendations with clear visualizations and actionable next steps.

---

## Key Features

### 🎯 **Personalized Allocations**
- AI analyzes 6 data points to create custom recommendations
- Dynamic allocation categories with custom emojis and labels
- Explains the "why" behind each recommendation in conversational language

### 📊 **Interactive Visualizations**
- **Debt payoff timeline:** Compare payoff with/without the windfall payment
- **Emergency fund growth:** Interactive chart with adjustable monthly contributions
- **Editable assumptions:** Users can update debt amounts and interest rates

### 🔒 **Privacy-First**
- No signup required
- No data storage
- Anonymous processing
- All data cleared after session

### ⚡ **Smart Conditionals**
- Shows only relevant sections (e.g., hides debt section if no debt)
- Adapts next steps based on allocation
- Different messaging for small vs. large emergency fund contributions

---

## Tech Stack

**Frontend:**
- Next.js 15 (React 18)
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)

**AI Integration:**
- Anthropic Claude API (Sonnet 4)
- Structured output generation
- Custom category creation

**Deployment:**
- Vercel (auto-deployment from GitHub)
- Environment variable management for API keys

---

## How It Works

### User Flow
1. **Landing Page:** Dynamic headline rotates through different windfall amounts
2. **Questionnaire:** 6 questions (5 required, 1 optional)
   - Windfall amount
   - Financial situation (checkboxes)
   - Income stability
   - Urgent needs
   - Financial goals
   - Additional context (optional)
3. **Loading State:** Animated money emojis while AI analyzes
4. **Results Page:** Personalized allocation with explanations and visualizations
5. **Next Steps:** Actionable items customized to their allocation

### AI Prompt Design
The Claude API receives:
- User's questionnaire responses
- Instructions to create specific allocation categories
- Request for custom emojis and labels based on user's situation
- Guidance on realistic defaults (interest rates, debt amounts)

Claude returns:
- Allocation breakdown (array format with custom categories)
- Conversational explanation
- Assumptions for calculations

---

## Product Decisions

### Why This Scope?
**Problem validation:** r/personalfinance has windfall flowcharts, but nothing AI-powered and personalized. Tax refund season (Feb-April) creates consistent demand.

### Key Strategic Choices

**1. Questionnaire Design**
- **Excluded monthly expenses:** People don't know this accurately; we infer from windfall size
- **Excluded current income:** Stability matters more than dollar amount
- **Included open-text fields:** Captures nuance that checkboxes miss

**2. Allocation Strategy**
- Consistent logic across windfall sizes (follow established financial principles)
- Defaults adjust based on windfall amount
- AI decides specific splits, not hardcoded rules

**3. Results Page**
- **Conditional sections:** Only show debt/emergency visualizations when relevant
- **Editable assumptions:** Users can correct our estimates
- **Encouraging messaging:** Small amounts get different, positive framing

**4. Privacy Approach**
- No accounts = lower friction
- Prominent privacy messaging builds trust
- Session-only storage

### What We Deliberately Excluded (v2)
- Multi-step follow-up questions for urgent needs
- Realistic cost validation (e.g., "tires cost $400-800")
- Investment recommendations beyond basic allocation
- Historical tracking or saved plans

---

## What I Learned About AI Product Development

Building this taught me how AI changes the product development process:

**The bottleneck shifts from execution to decision-making.** Claude excels at implementing defined features, but recognizing when to expand scope (e.g., should categories be dynamic vs. fixed? should users save scenarios?) requires human product judgment.

**Iteration cycles are different.** The pattern became: build → use → identify limitations → articulate new requirements → rebuild. This is fundamentally different from traditional development where the entire spec is defined upfront.

**Product sense matters more than ever.** The model doesn't tell you what would make the product more useful - it waits for you to ask. Understanding user needs and translating them into specific AI instructions is the critical skill.

---

## Future Improvements

**Short-term (v2):**
- Error handling for API failures
- Follow-up question interface
- More sophisticated urgent needs handling
- Mobile responsiveness optimization

**Long-term:**
- A/B test different questionnaire flows
- Export results as PDF
- Scenario comparison ("What if I got $500 more?")
- Integration with actual financial accounts (Plaid)

---

## Running Locally

### Prerequisites
- Node.js 18+ 
- Anthropic API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/carolynisadeveloper/windfall-advisor.git
cd windfall-advisor
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` and add your API key:
```
ANTHROPIC_API_KEY=your-api-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

---

## Cost Analysis

**Per user session:**
- ~1,000 input tokens (questionnaire + instructions)
- ~1,000 output tokens (recommendations)
- **Cost:** ~$0.02 per session

**For 1,000 test users:** ~$100 in API costs

---

## Project Context

This project was built as a **product management portfolio piece** to demonstrate:
- Product scoping and feature prioritization
- User research thinking (validated demand, competitive analysis)
- AI product design (where AI adds value vs. rule-based logic)
- Technical feasibility assessment
- Privacy/trust considerations for financial products

**Timeline:** Built in ~10-15 hours over 1 week

---

## Disclaimer

⚠️ **Educational Project Only**

This is a demonstration project for portfolio purposes. Do not use for actual financial decisions. Always consult with a certified financial advisor for personalized financial advice.

---

## License

MIT License - Feel free to use this project as inspiration for your own work!

---

## Contact

Built by [Carolyn Dempsey](https://github.com/carolynisadeveloper)

Questions or feedback? Open an issue or reach out to carolynisadeveloper@gmail.com