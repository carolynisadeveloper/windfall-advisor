import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Create the prompt for Claude
    const prompt = `You are a helpful financial advisor. A user has received a windfall of $${formData.amount} and needs advice on how to allocate it.

Here is their situation:
- Amount received: $${formData.amount}
- Financial situation: ${formData.financialSituation.join(', ')}
- Income stability: ${formData.incomeStability}
- Urgent needs: ${formData.urgentNeeds}
- Financial goals: ${formData.goals}
${formData.additionalInfo ? `- Additional context: ${formData.additionalInfo}` : ''}

Please provide:
1. A recommended allocation breakdown (how much to put toward debt, savings, investing, and enjoying)
2. A brief, conversational explanation of why this breakdown makes sense for their situation
3. Estimated credit card debt amount (if they have high-interest debt)
4. Estimated credit card interest rate (if applicable)

Respond ONLY with a JSON object in this exact format (no markdown, no code blocks):
{
  "allocation": [
    {
      "category": "debt",
      "amount": 700,
      "emoji": "💳",
      "label": "Credit card payment"
    },
    {
      "category": "savings",
      "amount": 250,
      "emoji": "💰",
      "label": "Emergency fund starter"
    },
    {
      "category": "enjoy",
      "amount": 50,
      "emoji": "🎉",
      "label": "Something fun"
    }
  ],
  "explanation": "A friendly, conversational 2-3 paragraph explanation in your own words",
  "assumptions": {
    "creditCardDebt": 5000,
    "creditCardRate": 24,
    "savingsRate": 4.5
  },
  "hasDebt": true
}

Important:
- "allocation" should be an array of allocation items
- Choose specific, personalized emojis and labels based on their situation
- Examples: If they need car repairs, use 🚗 and "New tires" or "Car repairs"
- If they mention vacation, use 🌴 and "Vacation fund"
- If investing, use 📈 and be specific like "Index funds" or "Retirement investing"
- Only include categories with amount > 0
- Make sure all amounts add up to the total windfall amount
- Use your judgment to determine appropriate amounts based on their situation.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    const recommendation = JSON.parse(responseText);

    // Validate that allocation adds up to the windfall amount
    let totalAllocated = 0;
    if (Array.isArray(recommendation.allocation)) {
      totalAllocated = recommendation.allocation.reduce((sum, item) => sum + item.amount, 0);
    } else {
      totalAllocated = Object.values(recommendation.allocation).reduce((sum, val) => sum + val, 0);
    }

    const windfallAmount = parseFloat(formData.amount);
    
    // If there's a discrepancy, log it and fix it
    if (Math.abs(totalAllocated - windfallAmount) > 0.01) {
      console.warn(`Allocation mismatch: Total ${totalAllocated} vs Windfall ${windfallAmount}`);
      
      // Adjust the largest allocation to make it add up correctly
      const difference = windfallAmount - totalAllocated;
      if (Array.isArray(recommendation.allocation) && recommendation.allocation.length > 0) {
        recommendation.allocation[0].amount += difference;
      }
    }

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Error calling Claude:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}