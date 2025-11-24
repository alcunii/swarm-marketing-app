'use client';

import CampaignForm from '@/components/CampaignForm';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-full mb-4 backdrop-blur-sm border border-purple-500/20">
            <span className="px-4 py-1 text-sm font-medium text-purple-300">🤖 Powered by AI Agents</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-gradient">
              AI Marketing Swarm
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Launch a <span className="text-purple-400 font-semibold">fully autonomous</span> marketing campaign with a single command. 
            Our AI agents handle <span className="text-indigo-400 font-semibold">strategy</span>, 
            <span className="text-pink-400 font-semibold"> content creation</span>, and 
            <span className="text-purple-400 font-semibold"> scheduling</span>.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-500/20">
              <span className="text-sm text-purple-300">⚡ 3 AI Agents</span>
            </div>
            <div className="px-4 py-2 bg-indigo-500/10 backdrop-blur-sm rounded-full border border-indigo-500/20">
              <span className="text-sm text-indigo-300">🎯 Multi-Platform</span>
            </div>
            <div className="px-4 py-2 bg-pink-500/10 backdrop-blur-sm rounded-full border border-pink-500/20">
              <span className="text-sm text-pink-300">📊 Real-time Analytics</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Create New Campaign
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm">Fast Setup</span>
            </div>
          </div>
          <CampaignForm />
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by innovative marketers</p>
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Fast</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

