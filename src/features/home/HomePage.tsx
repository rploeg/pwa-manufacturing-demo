import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
  Trophy,
  Calendar,
  Sparkles,
  MessageSquare,
  Network,
  ArrowRight,
  Zap,
  Target,
  Activity,
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: RefreshCw,
      title: 'Changeover Optimization',
      description: 'SMED analysis with AI-powered recommendations',
      path: '/changeover',
      gradient: 'from-purple-500 to-blue-500',
      stats: { label: 'Avg Time', value: '28 min', trend: '-15%' },
    },
    {
      icon: Shield,
      title: 'Safety & Compliance',
      description: 'Track incidents and monitor compliance',
      path: '/safety',
      gradient: 'from-green-500 to-emerald-500',
      stats: { label: 'Compliance', value: '50%', trend: 'Critical' },
    },
    {
      icon: Trophy,
      title: 'OEE Coaching',
      description: 'Benchmark lines and share best practices',
      path: '/oee-coaching',
      gradient: 'from-amber-500 to-orange-500',
      stats: { label: 'Plant Avg', value: '82.9%', trend: '+2.1%' },
    },
    {
      icon: Calendar,
      title: 'Production Planning',
      description: 'Optimize schedules and balance capacity',
      path: '/planning',
      gradient: 'from-indigo-500 to-purple-500',
      stats: { label: 'On-Time', value: '80%', trend: '4/5' },
    },
  ];

  const quickActions = [
    { icon: MessageSquare, label: 'AI Agents', path: '/chat', color: 'text-blue-600' },
    { icon: Network, label: 'Digital Twin', path: '/twin', color: 'text-purple-600' },
    { icon: Activity, label: 'Predictive', path: '/predictive', color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-versuni-primary via-purple-600 to-blue-600 p-8 md:p-12 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                AI-Powered Manufacturing
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Versuni Frontline Assistant</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl">
              Intelligent manufacturing insights powered by Azure AI Foundry multi-agent system
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/chat')}
                className="bg-white text-versuni-primary hover:bg-gray-100"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Talk to AI Agents
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/twin')}
                className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-versuni-primary transition-all backdrop-blur-sm"
              >
                <Network className="w-5 h-5 mr-2" />
                Explore Digital Twin
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Real-time Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Shift</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">Morning</p>
            <p className="text-xs text-muted-foreground mt-1">06:00 - 14:00 • Line-B</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall OEE</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">82.9%</p>
            <p className="text-xs text-green-600 mt-1">↑ 2.1% vs yesterday</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Quality Rate</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">97.2%</p>
            <p className="text-xs text-muted-foreground mt-1">12 defects today</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-red-600 mt-1">1 critical • 2 warnings</p>
          </Card>
        </div>

        {/* AI-Powered Manufacturing Features */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI-Powered Manufacturing
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced analytics and optimization with AI agents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.path}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 dark:hover:border-purple-800"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div
                      className={`w-full h-full bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl`}
                    ></div>
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">{feature.stats.label}</p>
                        <p className="text-lg font-bold">{feature.stats.value}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">AI Enabled</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.path}
                  variant="outline"
                  className="h-auto py-4 justify-start hover:bg-muted"
                  onClick={() => navigate(action.path)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${action.color}`} />
                  <span className="font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Active Alerts</h2>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">PM Task Overdue</p>
                  <p className="text-xs text-muted-foreground mt-1">Capper-1 • 2 hours ago</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate('/maintenance')}>
                  View
                </Button>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Temperature High</p>
                  <p className="text-xs text-muted-foreground mt-1">Filler-3 • 5 min ago</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate('/predictive')}>
                  View
                </Button>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Quality Check Required</p>
                  <p className="text-xs text-muted-foreground mt-1">Line-B • 10 min ago</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate('/quality')}>
                  View
                </Button>
              </div>
            </div>
          </Card>

          {/* Today's Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Today's Performance</h2>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Production Target</span>
                  <span className="text-sm font-medium">840 / 1000 units</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <span className="text-sm font-medium">87.3%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87.3%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Performance</span>
                  <span className="text-sm font-medium">92.1%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full"
                    style={{ width: '92.1%' }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={() => navigate('/twin')}>
                  <Zap className="w-4 h-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
