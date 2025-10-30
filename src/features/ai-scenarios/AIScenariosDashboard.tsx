import { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  ArrowRight,
  Zap,
  BarChart,
  RefreshCw,
  ClipboardCheck,
  AlertTriangle,
  Brain,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function AIScenariosDashboard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const scenarios = [
    {
      id: 'yield-prediction',
      title: 'Yield Prediction & Loss Prevention',
      description:
        'AI-powered yield forecasting with real-time loss prevention and material batch quality scoring',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      path: '/yield-prediction',
      category: 'production',
      metrics: {
        improvement: '10-15%',
        savings: '$50K-200K',
        roi: '6 months',
      },
      status: 'implemented',
    },
    {
      id: 'intelligent-scheduling',
      title: 'Intelligent Scheduling',
      description:
        'Multi-constraint optimization with dynamic rescheduling and what-if scenario planning',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      path: '/planning',
      category: 'planning',
      metrics: {
        improvement: '20-30%',
        savings: 'Better adherence',
        roi: '4 months',
      },
      status: 'implemented',
    },
    {
      id: 'operator-analytics',
      title: 'Operator Performance Analytics',
      description:
        'Skill gap analysis, personalized coaching, and productivity tracking with AI recommendations',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      path: '/skills',
      category: 'people',
      metrics: {
        improvement: '15%',
        savings: 'Faster onboarding',
        roi: '8 months',
      },
      status: 'implemented',
    },
    {
      id: 'sustainability',
      title: 'Environmental Compliance AI',
      description:
        'Carbon footprint tracking, energy optimization, and automated sustainability reporting',
      icon: Zap,
      color: 'from-green-600 to-teal-500',
      path: '/energy',
      category: 'sustainability',
      metrics: {
        improvement: 'ESG compliance',
        savings: '15-20%',
        roi: '12 months',
      },
      status: 'implemented',
    },
    {
      id: 'line-balancing',
      title: 'Line Balancing AI',
      description:
        'Workload optimization with bottleneck detection and automated task redistribution',
      icon: BarChart,
      color: 'from-orange-500 to-red-500',
      path: '/line-balancing',
      category: 'optimization',
      metrics: {
        improvement: '10-20%',
        savings: 'Better throughput',
        roi: '5 months',
      },
      status: 'implemented',
    },
    {
      id: 'maintenance-cost',
      title: 'Maintenance Cost Optimization',
      description:
        'AI-driven cost-benefit analysis, spare parts forecasting, and budget optimization',
      icon: DollarSign,
      color: 'from-indigo-500 to-purple-500',
      path: '/maintenance-cost',
      category: 'optimization',
      metrics: {
        improvement: '15-25%',
        savings: '$75K-250K',
        roi: '7 months',
      },
      status: 'implemented',
    },
    {
      id: 'changeover',
      title: 'Changeover Optimization (SMED)',
      description:
        'AI-powered SMED analysis with automated recommendations for reducing changeover time',
      icon: RefreshCw,
      color: 'from-blue-500 to-indigo-500',
      path: '/changeover',
      category: 'production',
      metrics: {
        improvement: '28 min saved',
        savings: 'Faster setup',
        roi: '4 months',
      },
      status: 'implemented',
    },
    {
      id: 'quality',
      title: 'Quality Intelligence',
      description:
        'Real-time quality monitoring with AI-powered defect prediction and root cause analysis',
      icon: ClipboardCheck,
      color: 'from-cyan-500 to-blue-500',
      path: '/quality',
      category: 'production',
      metrics: {
        improvement: '2.5% defect',
        savings: 'Better quality',
        roi: '6 months',
      },
      status: 'implemented',
    },
    {
      id: 'rca',
      title: 'Root Cause Analysis AI',
      description:
        'Automated problem diagnosis with AI-powered root cause identification and solution recommendations',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      path: '/rca',
      category: 'maintenance',
      metrics: {
        improvement: '40% faster',
        savings: 'Quick resolution',
        roi: '5 months',
      },
      status: 'implemented',
    },
    {
      id: 'predictive',
      title: 'Predictive Maintenance',
      description:
        'Machine learning models to predict equipment failures before they occur',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      path: '/predictive',
      category: 'maintenance',
      metrics: {
        improvement: '30% reduction',
        savings: 'Less downtime',
        roi: '8 months',
      },
      status: 'implemented',
    },
    {
      id: 'knowledge',
      title: 'AI Knowledge Assistant',
      description:
        'Intelligent document search and Q&A system powered by RAG (Retrieval Augmented Generation)',
      icon: BookOpen,
      color: 'from-teal-500 to-green-500',
      path: '/knowledge',
      category: 'optimization',
      metrics: {
        improvement: '10x faster',
        savings: 'Quick answers',
        roi: '3 months',
      },
      status: 'implemented',
    },
    {
      id: 'oee-coaching',
      title: 'OEE Coaching & Benchmarking',
      description:
        'AI-driven OEE analysis with personalized improvement recommendations and peer benchmarking',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      path: '/oee-coaching',
      category: 'optimization',
      metrics: {
        improvement: '82.9% OEE',
        savings: 'Plant improvement',
        roi: '6 months',
      },
      status: 'implemented',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Scenarios' },
    { id: 'production', label: 'Production' },
    { id: 'planning', label: 'Planning' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'people', label: 'People' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'optimization', label: 'Optimization' },
  ];

  const filteredScenarios =
    activeCategory === 'all' ? scenarios : scenarios.filter((s) => s.category === activeCategory);

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Manufacturing Scenarios</h1>
            <p className="text-muted-foreground">
              Advanced AI-powered solutions for production optimization
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredScenarios.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <Card
              key={scenario.id}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200"
              onClick={() => navigate(scenario.path)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div
                  className={`w-full h-full bg-gradient-to-br ${scenario.color} rounded-full blur-2xl`}
                ></div>
              </div>

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${scenario.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>

                <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Improvement</p>
                      <p className="text-sm font-bold">{scenario.metrics.improvement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Savings</p>
                      <p className="text-sm font-bold">{scenario.metrics.savings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="text-sm font-bold">{scenario.metrics.roi}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {scenario.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-lg font-semibold mb-4">Implementation Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">12</div>
            <div className="text-sm text-muted-foreground">AI Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">15-30%</div>
            <div className="text-sm text-muted-foreground">Avg Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">$500K+</div>
            <div className="text-sm text-muted-foreground">Annual Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">6 months</div>
            <div className="text-sm text-muted-foreground">Avg ROI</div>
          </div>
        </div>
      </Card>

      {/* Integration Note */}
      <Card className="p-6 mt-6 border-2 border-purple-200 bg-purple-50">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">AI-Powered Manufacturing Suite</h3>
            <p className="text-sm text-purple-800 mb-3">
              These AI scenarios work together to create a comprehensive smart manufacturing
              platform. Each module can be deployed independently or as part of an integrated
              solution.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/chat')}>
                Talk to AI Assistant
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/optimization')}>
                View All AI Features
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
