'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Questionnaire() {
  const [formData, setFormData] = useState({
    amount: '',
    financialSituation: [],
    incomeStability: '',
    urgentNeeds: '',
    goals: '',
    additionalInfo: ''
  });

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      financialSituation: prev.financialSituation.includes(value)
        ? prev.financialSituation.filter(item => item !== value)
        : [...prev.financialSituation, value]
    }));
  };

const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call our API to get Claude's recommendation
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const recommendation = await response.json();
      
      // Store both form data and recommendation in sessionStorage
      sessionStorage.setItem('windfallData', JSON.stringify(formData));
      sessionStorage.setItem('recommendation', JSON.stringify(recommendation));
      
      // Navigate to results page
      window.location.href = '/results';
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800;900&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-white">
        {/* Navigation bar */}
        <nav className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                🌬️
              </span>
              <span className="text-sm text-slate-400" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                Powered by AI
              </span>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4" style={{fontFamily: '"DM Sans", sans-serif'}}>
              Let's figure out your plan
            </h1>
            <p className="text-lg text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
              Answer a few questions so we can give you advice that fits your situation. This takes about 3 minutes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Loading Animation Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center">
              <div className="text-center">
                {/* Animated money emojis */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div 
                    className="text-4xl"
                    style={{
                      animation: 'dotPulse 1.4s ease-in-out infinite',
                      animationDelay: '0s'
                    }}
                  >💵</div>
                  <div 
                    className="text-4xl"
                    style={{
                      animation: 'dotPulse 1.4s ease-in-out infinite',
                      animationDelay: '0.2s'
                    }}
                  >💵</div>
                  <div 
                    className="text-4xl"
                    style={{
                      animation: 'dotPulse 1.4s ease-in-out infinite',
                      animationDelay: '0.4s'
                    }}
                  >💵</div>
                </div>

                {/* Loading text */}
                <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{fontFamily: '"DM Sans", sans-serif'}}>
                  Let's see what you should do with this money...
                </h2>
                <p className="text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Claude is analyzing your situation
                </p>
              </div>
            </div>
          )}
            
            {/* Question 1: Amount */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <label className="block mb-4">
                <span className="text-xl font-semibold text-slate-900 block mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  1. How much money did you receive?
                </span>
                <div className="relative mt-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="1,000"
                    required
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded text-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    style={{fontFamily: '"Source Sans Pro", sans-serif'}}
                  />
                </div>
              </label>
            </div>

            {/* Question 2: Financial Situation */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <div className="mb-4">
                <span className="text-xl font-semibold text-slate-900 block mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  2. What's your current financial situation?
                </span>
                <span className="text-sm text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Select all that apply
                </span>
              </div>
              
              <div className="space-y-3 mt-4">
                {[
                  { value: 'high-interest-debt', label: 'I have high-interest debt (credit cards, payday loans)' },
                  { value: 'low-interest-debt', label: 'I have some debt but it\'s lower interest (student loans, car payment)' },
                  { value: 'emergency-fund-3plus', label: 'I have an emergency fund that covers 3+ months of expenses' },
                  { value: 'emergency-fund-less-3', label: 'I have an emergency fund but it\'s less than 3 months' },
                  { value: 'no-emergency-fund', label: 'I have no emergency fund' },
                  { value: 'investing-retirement', label: 'I\'m regularly investing for retirement' }
                ].map(option => (
                  <label key={option.value} className="flex items-start cursor-pointer hover:bg-slate-50 p-3 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.financialSituation.includes(option.value)}
                      onChange={() => handleCheckboxChange(option.value)}
                      className="mt-1 mr-3 w-4 h-4"
                    />
                    <span className="text-slate-700" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3: Income Stability */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <div className="mb-4">
                <span className="text-xl font-semibold text-slate-900 block mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  3. How stable is your income right now?
                </span>
              </div>
              
              <div className="space-y-3 mt-4">
                {[
                  { value: 'very-stable', label: 'Very stable' },
                  { value: 'stable', label: 'Stable' },
                  { value: 'somewhat-uncertain', label: 'Somewhat uncertain' },
                  { value: 'very-uncertain', label: 'Very uncertain' }
                ].map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer hover:bg-slate-50 p-3 rounded transition-colors">
                    <input
                      type="radio"
                      name="incomeStability"
                      value={option.value}
                      checked={formData.incomeStability === option.value}
                      onChange={(e) => setFormData({...formData, incomeStability: e.target.value})}
                      required
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-slate-700" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 4: Urgent Needs */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <label className="block">
                <span className="text-xl font-semibold text-slate-900 block mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  4. Do you have any urgent financial needs or upcoming expenses in the next 3 months?
                </span>
                <textarea
                  value={formData.urgentNeeds}
                  onChange={(e) => setFormData({...formData, urgentNeeds: e.target.value})}
                  placeholder="e.g., car needs new brakes, medical bill due, moving costs, or write 'none'"
                  rows="3"
                  required
                  className="w-full mt-3 px-4 py-3 border border-slate-300 rounded text-base focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  style={{fontFamily: '"Source Sans Pro", sans-serif'}}
                />
              </label>
            </div>

            {/* Question 5: Goals */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <label className="block">
                <span className="text-xl font-semibold text-slate-900 block mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  5. What are your financial priorities or goals right now?
                </span>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  placeholder="e.g., pay off credit card, save for a vacation, build emergency fund, start investing, or 'not sure'"
                  rows="3"
                  required
                  className="w-full mt-3 px-4 py-3 border border-slate-300 rounded text-base focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  style={{fontFamily: '"Source Sans Pro", sans-serif'}}
                />
              </label>
            </div>

            {/* Question 6: Additional Info (Optional) */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <label className="block">
                <span className="text-xl font-semibold text-slate-900 block mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  6. Anything else we should know about your situation?
                </span>
                <span className="text-sm text-slate-600 block mb-3" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Optional
                </span>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  placeholder="Any other details that might be helpful..."
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded text-base focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  style={{fontFamily: '"Source Sans Pro", sans-serif'}}
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold px-12 py-5 rounded text-lg transition-colors inline-flex items-center justify-center group"
                style={{fontFamily: '"Source Sans Pro", sans-serif'}}
              >
                {isLoading ? 'Generating Your Plan...' : 'Get My Personalized Plan'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            {/* Privacy Note */}
            <div className="text-center pt-4">
              <p className="text-sm text-slate-500" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                🔒 Your information is private and won't be stored
              </p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
          <div className="max-w-3xl mx-auto px-6 text-center text-sm" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
            <p>© 2025 Windfall Advisor. Educational guidance only, not professional financial advice.</p>
          </div>
        </footer>
      </div>
      {/* CSS Animation */}
        <style jsx>{`
          @keyframes dotPulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}</style>
      </>
  );
}