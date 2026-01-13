

'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
const [amount, setAmount] = useState(500);
  const amounts = [500, 1000, 10000];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount(prev => {
        const currentIndex = amounts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % amounts.length;
        return amounts[nextIndex];
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800;900&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-white">
        {/* Disclaimer Banner */}
        <div className="bg-slate-100 border-b border-slate-200 py-3 px-6">
          <p className="text-center text-sm text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
            <span className="font-semibold">Personal Project:</span> This is an educational demonstration. Do not use for actual financial decisions. Consult a certified financial advisor.
          </p>
        </div>

        {/* Navigation bar */}
        <nav className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-5">
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

        <div className="max-w-5xl mx-auto px-6">
          {/* Hero section */}
          <div className="py-24 border-b border-slate-200">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-bold text-slate-900 mb-8 leading-tight" style={{fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.02em'}}>
  💰 What should I do with the{' '}
  <span className="inline relative overflow-hidden" style={{ minWidth: '280px', textAlign: 'center', display: 'inline' }}>
    <span 
      key={amount}
      className="inline-block text-green-600"
      style={{
        animation: 'dropAndFade 2.5s ease-in-out'
      }}
    >
      ${amount.toLocaleString()}
    </span>
  </span>
  {' '}I just got?
</h1>
              
              <p className="text-2xl text-slate-700 mb-4 leading-relaxed font-semibold" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                Whether it's a tax refund, year-end bonus, or unexpected gift, making the right decision with a financial windfall can meaningfully improve your financial position.
              </p>

              <p className="text-lg text-slate-600 mb-12 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                Get personalized guidance in 3 minutes. No signup, no cost, completely private.
              </p>
              
              <Link href="/questionnaire" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-12 py-5 rounded text-lg transition-colors inline-flex items-center group" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
     Get Your Plan
     <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
   </Link>
            </div>
          </div>

          {/* How it works */}
          <div className="py-20 border-b border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-12" style={{fontFamily: '"DM Sans", sans-serif'}}>
              How This Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Share Your Situation
                </h3>
                <p className="text-slate-600 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Answer six straightforward questions about your current financial picture - your debts, savings, income stability, and goals.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Get Your Allocation
                </h3>
                <p className="text-slate-600 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Our AI analyzes your situation and recommends how to split your windfall across debt paydown, emergency savings, and personal spending.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  See the Impact
                </h3>
                <p className="text-slate-600 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                  Visualize how your decision affects your debt timeline, interest savings, and emergency fund growth over time.
                </p>
              </div>
            </div>
          </div>

          {/* What you get */}
          <div className="py-20 border-b border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-12" style={{fontFamily: '"DM Sans", sans-serif'}}>
              What You'll Receive
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-2xl mt-1 mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Personalized allocation strategy
                  </h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    A dollar-by-dollar breakdown of how to deploy your windfall based on your specific financial situation and priorities.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mt-1 mr-4">📈</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Long-term impact projections
                  </h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Interactive visualizations showing how your decision affects debt payoff timelines, interest savings, and emergency fund growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mt-1 mr-4">🗺️</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Clear, actionable next steps
                  </h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Specific guidance on what to do today, this week, and this month to implement your financial plan effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="py-20">
            <div className="bg-slate-50 border border-slate-200 rounded p-10">
              <div className="flex items-start">
                <div className="text-3xl mt-1 mr-5">🔐</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    Your Privacy Matters
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-4" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    We don't require an account, collect personal information, or store your financial data. Your answers are processed anonymously and discarded after generating your recommendation.
                  </p>
                  <p className="text-sm text-slate-600" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
                    This tool provides educational guidance based on general financial principles. For comprehensive advice tailored to your complete financial picture, consult a certified financial planner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm" style={{fontFamily: '"Source Sans Pro", sans-serif'}}>
            <p>© 2025 Windfall Advisor. Educational guidance only, not professional financial advice.</p>
          </div>
        </footer>
      </div>
      <style jsx>{`
          @keyframes dropAndFade {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            10% {
              transform: translateY(0);
              opacity: 1;
            }
            90% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(20px);
              opacity: 0;
            }
          }
        `}</style>
      </>
  );
}