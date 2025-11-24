
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Post {
  kpi_id: string;
  platform: string;
  post_caption: string;
  hashtags: string;
  call_to_action: string;
  emojis: string;
  scheduled_time: string;
  status: string;
  is_published: boolean;
}

interface Strategy {
    name: string;
    value: number;
    unit: string;
    description: string;
    platform: string;
}

interface Summary {
    status: string;
    summary: string;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batch_id');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [strategy, setStrategy] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Platform icon and color mapping
  const platformConfig: Record<string, { icon: string; bgColor: string; textColor: string }> = {
    Facebook: { icon: '📘', bgColor: 'bg-blue-600', textColor: 'text-blue-400' },
    Instagram: { icon: '📷', bgColor: 'bg-pink-600', textColor: 'text-pink-400' },
    YouTube: { icon: '📺', bgColor: 'bg-red-600', textColor: 'text-red-400' },
    Twitter: { icon: '🐦', bgColor: 'bg-sky-600', textColor: 'text-sky-400' },
    LinkedIn: { icon: '💼', bgColor: 'bg-blue-700', textColor: 'text-blue-400' },
    TikTok: { icon: '🎵', bgColor: 'bg-black', textColor: 'text-pink-400' }
  };

  const getPlatformConfig = (platform: string) => {
    return platformConfig[platform] || { icon: '📱', bgColor: 'bg-gray-600', textColor: 'text-gray-400' };
  };

  useEffect(() => {
    if (!batchId) {
        setLoading(false);
        setError("No campaign batch ID provided.");
        return;
    };

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard?batch_id=${batchId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error + (data.detail ? `: ${data.detail}` : ''));
        }
        setSummary(data.summary);
        setPosts(data.posts);
        setStrategy(data.strategy);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-12 h-12 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>
        </div>
        <p className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🤖 AI Agents Working...
        </p>
        <p className="mt-2 text-gray-400 text-center max-w-md">
          Analyzing campaign strategy and generating content. This may take a moment.
        </p>
        <div className="mt-6 flex space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md bg-red-500/10 border border-red-500/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-400 font-semibold text-center mb-4 text-lg">{error}</p>
          <p className="text-sm text-gray-400 text-center">
            Troubleshooting: Pastikan row awal batch tersimpan, kredensial DB benar, dan workflow n8n mulai menulis data.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Campaign Dashboard
            </h1>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-mono">Batch ID: {batchId}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Report Button - Only show if status is completed */}
            {summary?.status === 'completed' && (
              <a 
                href={`/report?batch_id=${batchId}`}
                className="group flex items-center bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                📊 View Campaign Report
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Summary and Status */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl mb-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Campaign Summary</h2>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-gray-400 mr-3">Status:</span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
              {summary?.status?.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed bg-gray-900/30 p-4 rounded-xl">
            {summary?.summary || "🤖 AI agents are analyzing your campaign and generating strategy..."}
          </p>
        </div>

        {/* Strategy */}
        {strategy.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl mb-8 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">AI-Proposed Strategy</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategy.map((s, i) => {
                  const config = getPlatformConfig(s.platform);
                  return (
                    <div key={i} className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-xl border border-gray-700/50 hover:border-${config.textColor.split('-')[1]}-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center text-2xl mr-3 shadow-lg`}>
                            {config.icon}
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold ${config.textColor}`}>{s.platform}</h3>
                            <p className="text-2xl font-extrabold text-white">{s.value}{s.unit}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{s.description}</p>
                    </div>
                  );
                })}
                </div>
            </div>
        )}

        {/* Posts */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Generated Content</h2>
              </div>
              <span className="px-4 py-2 bg-pink-600/20 text-pink-300 rounded-full text-sm font-bold border border-pink-500/30">
                {posts.length} posts
              </span>
            </div>
            
            {posts.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-gray-400 text-lg">
                  🤖 AI agents are generating content. New posts will appear here automatically...
                </p>
              </div>
            )}
            
            <div className="space-y-6">
            {posts.map((post) => {
              const config = getPlatformConfig(post.platform);
              return (
                <div key={post.kpi_id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-xl flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
                    <div className="flex-shrink-0">
                        <div className={`w-16 h-16 ${config.bgColor} rounded-2xl flex flex-col items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}>
                            <span className="text-2xl">{config.icon}</span>
                            <span className="font-bold text-white text-xs mt-1">{post.platform}</span>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <p className="text-gray-200 text-base leading-relaxed mb-3">{post.post_caption}</p>
                        {post.hashtags && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.hashtags.split(' ').map((tag, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {post.call_to_action && (
                          <div className="mb-3 flex items-center">
                            <svg className="w-4 h-4 text-indigo-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-indigo-300 font-medium">{post.call_to_action}</span>
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-gray-400 pt-3 border-t border-gray-700/50">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span>{new Date(post.scheduled_time).toLocaleString()}</span>
                            </div>
                            <span className={`inline-flex items-center font-bold px-4 py-2 rounded-full text-xs shadow-md ${post.is_published ? 'bg-green-600/20 text-green-300 border border-green-500/30' : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'}`}>
                                {post.is_published ? (
                                  <>
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Pending
                                  </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
              );
            })}
            </div>
        </div>
      </div>
    </main>
  );
}
