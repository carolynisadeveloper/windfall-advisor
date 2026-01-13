'use client';

import { useEffect, useState } from 'react';
import { Edit2, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Results() {
  // Read data from sessionStorage
  const [formData, setFormData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  
  // All hooks must be at the top
  const [assumptions, setAssumptions] = useState({
    creditCardDebt: 5000,
    creditCardRate: 24,
    savingsRate: 4.5
  });

  const [editingField, setEditingField] = useState(null);
  const [monthlyContribution, setMonthlyContribution] = useState(50);
  
  // Load form data and recommendation on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('windfallData');
    const savedRec = sessionStorage.getItem('recommendation');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedRec) {
      setRecommendation(JSON.parse(savedRec));
    }
  }, []);

  // Update assumptions when recommendation loads
  useEffect(() => {
    if (recommendation?.assumptions) {
      setAssumptions({
        creditCardDebt: recommendation.assumptions.creditCardDebt,
        creditCardRate: recommendation.assumptions.creditCardRate,
        savingsRate: recommendation.assumptions.savingsRate
      });
    }
  }, [recommendation]);
  
// Get emoji and label for each allocation category (fallback for old format)
  const getCategoryInfo = (category) => {
    const info = {
      debt: { emoji: '💳', label: 'Credit card payment' },
      savings: { emoji: '💰', label: 'Emergency fund' },
      investing: { emoji: '📈', label: 'Investing' },
      urgent: { emoji: '🚨', label: 'Urgent needs' },
      enjoy: { emoji: '🎉', label: 'Something you\'ll enjoy' }
    };
    return info[category] || { emoji: '💵', label: category };
  };

// Load form data on mount

// Show loading state while data loads
  if (!formData || !recommendation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌬️</div>
          <p className="text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
            Loading your personalized plan...
          </p>
        </div>
      </div>
    );
  }

  // Handle both old object format and new array format
  const allocation = Array.isArray(recommendation?.allocation) 
    ? recommendation.allocation.reduce((acc, item) => {
        acc[item.category] = item.amount;
        return acc;
      }, {})
    : (recommendation?.allocation || { debt: 0, savings: 0, enjoy: 0 });

// Format the financial situation labels nicely
  const formatFinancialSituation = (situations) => {
    const labels = {
      'high-interest-debt': 'High-interest debt',
      'low-interest-debt': 'Lower-interest debt',
      'emergency-fund-3plus': 'Emergency fund (3+ months)',
      'emergency-fund-less-3': 'Emergency fund (less than 3 months)',
      'no-emergency-fund': 'No emergency fund',
      'investing-retirement': 'Investing for retirement'
    };
    return situations.map(s => labels[s] || s).join(', ');
  };

  // Format income stability nicely
  const formatIncomeStability = (stability) => {
    const labels = {
      'very-stable': 'Very stable',
      'stable': 'Stable',
      'somewhat-uncertain': 'Somewhat uncertain',
      'very-uncertain': 'Very uncertain'
    };
    return labels[stability] || stability;
  };

  const userAnswers = {
    amount: parseFloat(formData.amount),
    financialSituation: formatFinancialSituation(formData.financialSituation),
    incomeStability: formatIncomeStability(formData.incomeStability),
    urgentNeeds: formData.urgentNeeds,
    goals: formData.goals
  };

  // Calculate debt payoff timeline
  const calculateDebtPayoff = (debt, rate, payment) => {
    const monthlyRate = rate / 100 / 12;
    const minimumPayment = debt * 0.025;
    
    // Without windfall
    let balanceWithout = debt;
    let monthsWithout = 0;
    let interestWithout = 0;
    
    while (balanceWithout > 0 && monthsWithout < 120) {
      const interest = balanceWithout * monthlyRate;
      interestWithout += interest;
      balanceWithout = balanceWithout + interest - minimumPayment;
      monthsWithout++;
    }
    
    // With windfall
    let balanceWith = debt - payment;
    let monthsWith = 0;
    let interestWith = 0;
    
    while (balanceWith > 0 && monthsWith < 120) {
      const interest = balanceWith * monthlyRate;
      interestWith += interest;
      balanceWith = balanceWith + interest - minimumPayment;
      monthsWith++;
    }
    
    return {
      withoutMonths: monthsWithout,
      withMonths: monthsWith,
      interestSaved: Math.round(interestWithout - interestWith)
    };
  };

  // Calculate emergency fund growth
  const calculateEmergencyGrowth = (initial, monthly, rate) => {
    const data = [];
    let balance = initial;
    
    for (let month = 0; month <= 12; month++) {
      data.push({
        month: month,
        balance: Math.round(balance)
      });
      
      if (month < 12) {
        balance = balance * (1 + rate / 100 / 12) + monthly;
      }
    }
    
    return data;
  };

  const debtStats = calculateDebtPayoff(assumptions.creditCardDebt, assumptions.creditCardRate, allocation.debt);
  const emergencyData = calculateEmergencyGrowth(allocation.savings, monthlyContribution, assumptions.savingsRate);

  const handleEditSave = (field, value) => {
    setAssumptions({...assumptions, [field]: parseFloat(value)});
    setEditingField(null);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800;900&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-white">
        {/* Navigation bar */}
        <nav className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                🌬️
              </span>
             <Link href="/" className="text-sm text-slate-400 hover:text-slate-300" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
  Start Over
</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-16">
          
          {/* Your Answers - Collapsible */}
          <details className="mb-12 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <summary className="cursor-pointer font-semibold text-slate-900 text-lg" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              📋 Your Answers
            </summary>
      <div className="mt-4 space-y-2 text-slate-700" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              <p><strong>Windfall:</strong> ${userAnswers.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              <p><strong>Current situation:</strong> {userAnswers.financialSituation}</p>
              <p><strong>Income:</strong> {userAnswers.incomeStability}</p>
              <p><strong>Urgent needs:</strong> {userAnswers.urgentNeeds}</p>
              <p><strong>Goals:</strong> {userAnswers.goals}</p>
              {formData.additionalInfo && (
                <p><strong>Additional info:</strong> {formData.additionalInfo}</p>
              )}
            </div>
          </details>

          {/* Main Recommendation */}
          <div className="mb-12">
           <h1 className="text-4xl font-bold text-slate-900 mb-8" style={{fontFamily: '"DM Sans", sans-serif'}}>
              Here's what makes sense for your ${parseFloat(formData.amount).toLocaleString('en-US')}
            </h1>

           {/* Allocation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {Array.isArray(recommendation?.allocation) 
                ? recommendation.allocation
                    .filter(item => item.amount > 0)
                    .map((item, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-2">{item.emoji}</div>
                        <div className="text-3xl font-bold text-slate-900 mb-2" style={{fontFamily: '"DM Sans", sans-serif'}}>
                          ${item.amount.toLocaleString()}
                        </div>
                        <div className="text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                          {item.label}
                        </div>
                      </div>
                    ))
                : Object.entries(allocation)
                    .filter(([_, amount]) => amount > 0)
                    .map(([category, amount]) => {
                      const { emoji, label } = getCategoryInfo(category);
                      return (
                        <div key={category} className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                          <div className="text-3xl mb-2">{emoji}</div>
                          <div className="text-3xl font-bold text-slate-900 mb-2" style={{fontFamily: '"DM Sans", sans-serif'}}>
                            ${amount.toLocaleString()}
                          </div>
                          <div className="text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                            {label}
                          </div>
                        </div>
                      );
                    })
              }
            </div>
            
          </div>

          {/* Why This Breakdown */}
          <div className="mb-12 bg-white border border-slate-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{fontFamily: '"DM Sans", sans-serif'}}>
              Why this breakdown?
            </h2>
            
            <div className="prose prose-slate max-w-none" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {recommendation?.explanation || 'Loading...'}
              </p>
            </div>
          </div>

          {/* Credit Card Impact */}

          {allocation.debt > 0 && (
          <div className="mb-12 bg-white border border-slate-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{fontFamily: '"DM Sans", sans-serif'}}>
              💳 Your credit card debt
            </h2>

            {/* Editable Assumptions */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700">Assumed credit card debt:</span>
                <div className="flex items-center">
                  {editingField === 'debt' ? (
                    <input
                      type="number"
                      defaultValue={assumptions.creditCardDebt}
                      onBlur={(e) => handleEditSave('creditCardDebt', e.target.value)}
                      autoFocus
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-right"
                    />
                  ) : (
                    <>
                      <span className="font-semibold text-slate-900">${assumptions.creditCardDebt.toLocaleString()}</span>
                      <button onClick={() => setEditingField('debt')} className="ml-2 text-slate-500 hover:text-slate-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Credit card rate:</span>
                <div className="flex items-center">
                  {editingField === 'rate' ? (
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={assumptions.creditCardRate}
                      onBlur={(e) => handleEditSave('creditCardRate', e.target.value)}
                      autoFocus
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-right"
                    />
                  ) : (
                    <>
                      <span className="font-semibold text-slate-900">{assumptions.creditCardRate}%</span>
                      <button onClick={() => setEditingField('rate')} className="ml-2 text-slate-500 hover:text-slate-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Debt Timeline Visualization */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                Debt-Free Timeline
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 text-sm" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                      Without this payment
                    </span>
                    <span className="font-semibold text-slate-900" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                      {debtStats.withoutMonths} months
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-slate-400 h-3 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 text-sm" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                      With ${allocation.debt} payment
                    </span>
                    <span className="font-semibold text-green-700" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                      {debtStats.withMonths} months
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{width: `${(debtStats.withMonths / debtStats.withoutMonths) * 100}%`}}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-900 font-semibold" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  <TrendingDown className="inline w-5 h-5 mr-2" />
                  You'll be debt-free {debtStats.withoutMonths - debtStats.withMonths} months sooner
                </p>
                <p className="text-green-800 text-sm mt-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Interest saved: ${debtStats.interestSaved}
                </p>
              </div>
            </div>
          </div>
        )}

          {/* Emergency Fund Impact */}
          {(allocation.savings > 0 || 
  (Array.isArray(recommendation?.allocation) && 
   recommendation.allocation.some(item => 
     (item.category === 'savings' || item.label.toLowerCase().includes('emergency'))
   ))) && (
          <div className="mb-12 bg-white border border-slate-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{fontFamily: '"DM Sans", sans-serif'}}>
              💰 Your emergency fund
            </h2>

            <div className="mb-6">
              {allocation.savings >= 150 ? (
                // Show the coverage list for larger amounts
                <>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Your ${allocation.savings} covers:
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { item: 'Unexpected car repair', amount: 200 },
                      { item: 'Urgent care visit', amount: 150 },
                      { item: 'Broken appliance', amount: 200 },
                      { item: 'Cracked phone screen', amount: 150 }
                    ].map((expense, idx) => {
                      const canCover = allocation.savings >= expense.amount;
                      return (
                        <div key={idx} className="flex items-center text-slate-700" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                          <span className={`mr-2 ${canCover ? 'text-green-600' : 'text-slate-400'}`}>
                            {canCover ? '✓' : '○'}
                          </span>
                          <span className={!canCover ? 'opacity-60' : ''}>
                            {expense.item} (${expense.amount})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                // Show encouraging message for smaller amounts
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <p className="text-slate-700 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Your ${allocation.savings} is a great start to your emergency fund! While it won't cover major expenses yet, it's there for smaller surprises — and every dollar you add gets you closer to full coverage for unexpected costs.
                  </p>
                </div>
              )}
            </div>
        

            {/* Interactive Growth Chart */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Watch your emergency fund grow
                </h3>
              </div>

              {/* Monthly Contribution Selector */}
              <div className="mb-4 bg-slate-50 rounded-lg p-4">
                <label className="text-sm text-slate-700 mb-2 block" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  If you add each month:
                </label>
                <div className="flex gap-2">
                  {[0, 50, 100, 150].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setMonthlyContribution(amount)}
                      className={`px-4 py-2 rounded font-semibold transition-colors ${
                        monthlyContribution === amount
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      style={{fontFamily: '"Source Sans Pro", sans-serif'}}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emergencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                      stroke="#64748b"
                    />
                    <YAxis 
                      label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                      stroke="#64748b"
                    />
                    <Tooltip 
                      formatter={(value) => `$${value}`}
                      contentStyle={{ fontFamily: '"Source Sans Pro", sans-serif' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#0f172a" 
                      strokeWidth={3}
                      dot={{ fill: '#0f172a', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 font-semibold" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  <TrendingUp className="inline w-5 h-5 mr-2" />
                  In 12 months: ${emergencyData[12].balance.toLocaleString()}
                </p>
                <p className="text-blue-800 text-sm mt-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Interest earned in year 1: ${Math.round(emergencyData[12].balance - allocation.savings - (monthlyContribution * 12))}
                </p>
              </div>
            </div>
          </div>)}

          {/* Next Steps */}
          <div className="mb-12 bg-slate-50 border border-slate-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{fontFamily: '"DM Sans", sans-serif'}}>
              🗺️ Your next steps
            </h2>
            
            <div className="space-y-6" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              {/* Generate steps dynamically from allocation */}
              {Array.isArray(recommendation?.allocation) ? (
                // New array format - generate steps for each category
                recommendation.allocation
                  .filter(item => item.amount > 0)
                  .map((item, index) => {
                    let stepText = '';
                    
                    if (item.category === 'debt') {
                      stepText = `Log into your credit card account and make a $${item.amount.toLocaleString()} payment`;
                    } else if (item.category === 'savings' || item.label.toLowerCase().includes('emergency')) {
                      stepText = `Open a high-yield savings account (Ally, Marcus, or Discover pay around ${assumptions.savingsRate}%) and deposit your $${item.amount.toLocaleString()}`;
                    } else if (item.category === 'investing') {
                      stepText = `Consider opening a brokerage account or contributing to your retirement account with your $${item.amount.toLocaleString()}`;
                    } else {
                      // Generic step for other categories (vacation, urgent needs, etc.)
                      stepText = `Set aside your $${item.amount.toLocaleString()} for ${item.label.toLowerCase()}`;
                    }
                    
                    return (
                      <div key={index}>
                        <h3 className="font-semibold text-slate-900 mb-2">{index + 1}. {index === 0 ? 'Today' : 'This week'}:</h3>
                        <p className="text-slate-700">{stepText}</p>
                      </div>
                    );
                  })
              ) : (
                // Fallback for old object format
                <>
                  {allocation.debt > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">1. Today:</h3>
                      <p className="text-slate-700">
                        Log into your credit card account and make a ${allocation.debt.toLocaleString()} payment
                      </p>
                    </div>
                  )}

                  {allocation.savings > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{allocation.debt > 0 ? '2' : '1'}. This week:</h3>
                      <p className="text-slate-700">
                        Open a high-yield savings account and deposit your ${allocation.savings.toLocaleString()}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Set a reminder:</h3>
                <p className="text-slate-700">
                  Check in on your progress in 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded transition-colors" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              Ask a Follow-Up Question (v2)
            </button>
            <Link href="/questionnaire" className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold px-8 py-4 rounded transition-colors flex items-center justify-center" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
  Try a Different Amount
</Link>
          </div>

        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-sm" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
            <p>© 2025 Windfall Advisor. Educational guidance only, not professional financial advice.</p>
          </div>
        </footer>
      </div>
    </>
  );
  }