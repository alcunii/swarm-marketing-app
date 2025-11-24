'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PlatformMetrics {
  total_posts: number;
  published_posts: number;
  pending_posts: number;
  avg_reach: number;
  avg_engagement: number;
}

interface ReportData {
  batch_id: string;
  report_date: string;
  total_posts: number;
  published_posts: number;
  pending_posts: number;
  platforms_used: string[];
  platform_breakdown: Record<string, PlatformMetrics>;
  total_estimated_reach: number;
  total_estimated_engagement: number;
  generated_at: string;
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batch_id');
  const [report, setReport] = useState<ReportData | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Platform configuration with icons and colors
  const platformConfig: Record<string, { icon: string; gradient: string; iconBg: string }> = {
    Facebook: { icon: '📘', gradient: 'from-blue-600 to-blue-800', iconBg: 'bg-blue-600' },
    Instagram: { icon: '📷', gradient: 'from-pink-600 to-purple-600', iconBg: 'bg-pink-600' },
    YouTube: { icon: '📺', gradient: 'from-red-600 to-red-800', iconBg: 'bg-red-600' },
    Twitter: { icon: '🐦', gradient: 'from-sky-500 to-blue-600', iconBg: 'bg-sky-500' },
    LinkedIn: { icon: '💼', gradient: 'from-blue-700 to-blue-900', iconBg: 'bg-blue-700' },
    TikTok: { icon: '🎵', gradient: 'from-black to-gray-800', iconBg: 'bg-black' }
  };

  const getPlatformConfig = (platform: string) => {
    return platformConfig[platform] || { icon: '🌐', gradient: 'from-gray-600 to-gray-800', iconBg: 'bg-gray-600' };
  };

  useEffect(() => {
    if (!batchId) {
      setLoading(false);
      setError('No campaign batch ID provided.');
      return;
    }

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report?batch_id=${batchId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch report');
        }

        setReport(data.report_data);
        setSummary(data.summary);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
    const interval = setInterval(fetchReport, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-12 h-12 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
        <p className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Generating Campaign Report...
        </p>
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
          <p className="text-red-400 font-semibold text-center mb-6">{error}</p>
          <Link 
            href={`/dashboard?batch_id=${batchId}`} 
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition"
          >
            ← Back to Campaign Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 mb-6 text-lg">Report not available yet</p>
          <Link 
            href={`/dashboard?batch_id=${batchId}`} 
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ← Back to Campaign Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const publishRate = report.total_posts > 0 
    ? Math.round((report.published_posts / report.total_posts) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              📊 Campaign Activity Report
            </h1>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-mono">Batch ID: {batchId}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Generated: {new Date(report.generated_at).toLocaleString()}
              </p>
            </div>
          </div>
          <Link 
            href={`/dashboard?batch_id=${batchId}`}
            className="group flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Executive Summary</h2>
            </div>
            <p className="text-lg text-white/90 leading-relaxed">{summary}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-semibold">Total Posts Created</p>
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
              </div>
            </div>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{report.total_posts}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-semibold">Published</p>
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{report.published_posts}</p>
            <div className="mt-3 flex items-center">
              <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${publishRate}%` }}></div>
              </div>
              <span className="text-sm font-bold text-green-400">{publishRate}%</span>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-semibold">Est. Total Reach</p>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{report.total_estimated_reach.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-semibold">Est. Total Engagement</p>
              <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
            </div>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">{report.total_estimated_engagement.toLocaleString()}</p>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl mb-8 border border-gray-700/50">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Platform Performance Breakdown</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(report.platform_breakdown).map(([platform, metrics]) => {
              const config = getPlatformConfig(platform);
              const platformPublishRate = metrics.total_posts > 0 
                ? Math.round((metrics.published_posts / metrics.total_posts) * 100)
                : 0;
              
              return (
                <div key={platform} className={`bg-gradient-to-br ${config.gradient} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{platform}</h3>
                        <p className="text-sm text-white/80">Performance Metrics</p>
                      </div>
                      <div className={`w-16 h-16 ${config.iconBg} bg-opacity-30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                        {config.icon}
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/80 text-sm font-medium">Total Posts</span>
                          <span className="text-2xl font-extrabold text-white">{metrics.total_posts}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="text-center">
                            <p className="text-xs text-white/60 mb-1">Published</p>
                            <p className="text-lg font-bold text-green-300">{metrics.published_posts}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/60 mb-1">Pending</p>
                            <p className="text-lg font-bold text-yellow-300">{metrics.pending_posts}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/80 text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            Avg Reach
                          </span>
                          <span className="font-bold text-white text-lg">{metrics.avg_reach.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            Avg Engagement
                          </span>
                          <span className="font-bold text-white text-lg">{metrics.avg_engagement.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-white/80 font-medium">Completion Rate</span>
                        <span className="text-sm font-bold text-white">{platformPublishRate}%</span>
                      </div>
                      <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                          style={{ width: `${platformPublishRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platforms Overview */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Platforms Used</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            {report.platforms_used.map((platform) => {
              const config = getPlatformConfig(platform);
              return (
                <span 
                  key={platform}
                  className={`inline-flex items-center bg-gradient-to-r ${config.gradient} px-6 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                >
                  <span className="text-2xl mr-2">{config.icon}</span>
                  {platform}
                </span>
              );
            })}
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-xl inline-block">
            <p className="text-gray-400 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-purple-400 text-lg mr-2">{report.platforms_used.length}</span>
              <span>platform{report.platforms_used.length !== 1 ? 's' : ''} activated</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
