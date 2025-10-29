import { useState } from 'react';
import { Trophy, TrendingUp, Target, Award, Zap, Star } from 'lucide-react';

interface KPI {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

export function PerformanceDashboardPage() {
  const [kpis] = useState<KPI[]>([
    { name: 'Units Assembled', current: 847, target: 800, unit: 'units', trend: 'up' },
    { name: 'Quality Score', current: 98.5, target: 95, unit: '%', trend: 'up' },
    { name: 'First-Time-Right', current: 96.2, target: 92, unit: '%', trend: 'up' },
    { name: 'Avg Cycle Time', current: 42, target: 45, unit: 'sec', trend: 'down' },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'ACH-001',
      title: 'Perfect Week',
      description: 'Zero quality defects for 5 consecutive days',
      icon: '🏆',
      earned: true,
      date: 'Oct 25, 2025',
    },
    {
      id: 'ACH-002',
      title: 'Productivity Champion',
      description: 'Exceeded daily target by 20% for 3 days',
      icon: '⚡',
      earned: true,
      date: 'Oct 20, 2025',
    },
    {
      id: 'ACH-003',
      title: 'Safety Star',
      description: '30 days without safety incidents',
      icon: '🛡️',
      earned: true,
      date: 'Oct 15, 2025',
    },
    {
      id: 'ACH-004',
      title: 'Master Operator',
      description: 'Certified on all 5 production lines',
      icon: '🎯',
      earned: false,
    },
    {
      id: 'ACH-005',
      title: 'Team Leader',
      description: 'Trained 3 new operators',
      icon: '👥',
      earned: false,
    },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Sarah Chen', score: 2847, avatar: '👩' },
    { rank: 2, name: 'You', score: 2645, avatar: '👤', isCurrentUser: true },
    { rank: 3, name: 'Mike Torres', score: 2589, avatar: '👨' },
    { rank: 4, name: 'Lisa Park', score: 2456, avatar: '👩' },
    { rank: 5, name: 'James Wilson', score: 2334, avatar: '👨' },
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-green-600 rotate-180" />;
      case 'stable':
        return <span className="w-4 h-4">→</span>;
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 80) return 'bg-blue-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Performance Dashboard</h1>
        <p className="text-muted-foreground">Track your KPIs and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-versuni-primary to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6" />
            <span className="text-sm opacity-90">Total Points</span>
          </div>
          <div className="text-3xl font-bold">2,645</div>
          <div className="text-sm opacity-90 mt-1">Rank #2 this week</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-yellow-600" />
            <span className="text-sm text-muted-foreground">Achievements</span>
          </div>
          <div className="text-3xl font-bold">3/5</div>
          <div className="text-sm text-muted-foreground mt-1">Unlocked</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <div className="text-3xl font-bold">12 days</div>
          <div className="text-sm text-muted-foreground mt-1">Performance above target</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-orange-600" />
            <span className="text-sm text-muted-foreground">Efficiency</span>
          </div>
          <div className="text-3xl font-bold">106%</div>
          <div className="text-sm text-muted-foreground mt-1">vs. target</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPIs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-versuni-primary" />
                My KPIs - Today
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {kpis.map((kpi, idx) => {
                const percentage = Math.min((kpi.current / kpi.target) * 100, 100);
                return (
                  <div key={idx} className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{kpi.name}</span>
                        {getTrendIcon(kpi.trend)}
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-lg">{kpi.current}</span>
                        <span className="text-muted-foreground">
                          {' '}
                          / {kpi.target} {kpi.unit}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full ${getProgressColor(kpi.current, kpi.target)} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {percentage.toFixed(1)}% of target
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Achievements
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                    <div className="text-center">
                      <div className="font-medium text-sm mb-1">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      {achievement.earned && achievement.date && (
                        <div className="text-xs text-yellow-700 font-medium mt-2">
                          Earned {achievement.date}
                        </div>
                      )}
                      {!achievement.earned && (
                        <div className="text-xs text-gray-500 mt-2">🔒 Locked</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border sticky top-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Weekly Leaderboard
              </h2>
            </div>
            <div className="divide-y">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`p-4 flex items-center gap-3 ${
                    entry.isCurrentUser ? 'bg-versuni-primary/10' : 'hover:bg-accent/50'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      entry.rank === 1
                        ? 'bg-yellow-400 text-yellow-900'
                        : entry.rank === 2
                          ? 'bg-gray-300 text-gray-800'
                          : entry.rank === 3
                            ? 'bg-orange-400 text-orange-900'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <div className="text-2xl">{entry.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium text-sm ${entry.isCurrentUser ? 'text-versuni-primary font-bold' : ''}`}
                    >
                      {entry.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{entry.score} points</div>
                  </div>
                  {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-600" />}
                </div>
              ))}
            </div>
            <div className="p-4 bg-accent text-center text-sm text-muted-foreground">
              Resets every Monday at 00:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
