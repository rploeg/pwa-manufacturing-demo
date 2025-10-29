import { useState, useMemo } from 'react';
import {
  Zap,
  TrendingDown,
  Leaf,
  Gauge,
  AlertTriangle,
  Brain,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { HistoricalChart } from '@/components/charts/HistoricalChart';
import { analyticsService } from '@/services/analyticsService';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnergyConsumer {
  name: string;
  power: number;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

export function EnergyManagementPage() {
  const { t } = useLanguage();
  const [consumers] = useState<EnergyConsumer[]>([
    { name: 'Production Line A', power: 145.2, efficiency: 87, trend: 'stable', status: 'normal' },
    { name: 'Production Line B', power: 162.8, efficiency: 82, trend: 'up', status: 'warning' },
    { name: 'HVAC System', power: 78.5, efficiency: 91, trend: 'down', status: 'normal' },
    { name: 'Compressed Air', power: 52.3, efficiency: 76, trend: 'stable', status: 'warning' },
    { name: 'Lighting', power: 18.7, efficiency: 95, trend: 'down', status: 'normal' },
    { name: 'Office & IT', power: 34.2, efficiency: 88, trend: 'stable', status: 'normal' },
  ]);

  const totalPower = consumers.reduce((sum, c) => sum + c.power, 0);
  const avgEfficiency = consumers.reduce((sum, c) => sum + c.efficiency, 0) / consumers.length;

  // Generate historical data for power consumption
  const historicalPowerData = useMemo(() => {
    return analyticsService.generateHistoricalData(30, totalPower, 50);
  }, [totalPower]);

  // Generate historical efficiency data
  const historicalEfficiencyData = useMemo(() => {
    return analyticsService.generateHistoricalData(30, avgEfficiency, 5);
  }, [avgEfficiency]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 text-green-700';
      case 'warning':
        return 'bg-orange-50 text-orange-700';
      case 'critical':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('energy.title', 'Energy Management')}</h1>
        <p className="text-muted-foreground">
          {t('energy.description', 'Monitor power consumption and sustainability metrics')}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6" />
            <span className="text-sm opacity-90">{t('energy.totalPower', 'Total Power')}</span>
          </div>
          <div className="text-3xl font-bold">{totalPower.toFixed(1)} kW</div>
          <div className="text-sm opacity-90 mt-1">
            {t('energy.realtime', 'Real-time consumption')}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              {t('energy.efficiency', 'Avg Efficiency')}
            </span>
          </div>
          <div className="text-3xl font-bold">{avgEfficiency.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground mt-1">+2.3% vs. last week</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="text-sm text-muted-foreground">
              {t('energy.co2Saved', 'CO₂ Saved')}
            </span>
          </div>
          <div className="text-3xl font-bold">1.2 ton</div>
          <div className="text-sm text-muted-foreground mt-1">
            {t('time.thisMonth', 'This month')}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-muted-foreground">
              {t('energy.savings', 'Cost Savings')}
            </span>
          </div>
          <div className="text-3xl font-bold">€2.8k</div>
          <div className="text-sm text-muted-foreground mt-1">
            {t('time.thisMonth', 'This month')}
          </div>
        </div>
      </div>

      {/* AI Energy Optimization Scenario */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
            <Brain className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">AI Energy Optimization Active</h2>
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            </div>
            <p className="text-muted-foreground mb-4">
              Our AI system is continuously analyzing energy patterns and optimizing consumption in
              real-time
            </p>

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Energy Saved Today</span>
                </div>
                <div className="text-2xl font-bold text-green-600">124 kWh</div>
                <div className="text-xs text-muted-foreground mt-1">€18.60 cost reduction</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Efficiency Gain</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">+8.3%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Since AI activation (7 days ago)
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">CO₂ Reduction</span>
                </div>
                <div className="text-2xl font-bold text-green-600">58 kg</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Carbon footprint reduced today
                </div>
              </div>
            </div>

            {/* AI Actions Taken */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                Recent AI Optimizations
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-900">HVAC Load Shifting</div>
                    <div className="text-xs text-blue-700 mt-0.5">
                      Pre-cooled facility during low-rate period (5:00-6:00 AM). Reduced peak demand
                      by 12 kW.
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      💰 Saved €4.80 • 2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900">
                      Production Line Sequencing
                    </div>
                    <div className="text-xs text-green-700 mt-0.5">
                      Optimized Line-A and Line-B start times to avoid concurrent peak loads.
                      Smoothed power curve.
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      💰 Saved €7.20 • 4 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-md">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-purple-900">
                      Compressed Air Optimization
                    </div>
                    <div className="text-xs text-purple-700 mt-0.5">
                      Detected and isolated air leak in Zone-C. Scheduled maintenance alert sent.
                      Preventing 8 kW waste.
                    </div>
                    <div className="text-xs text-purple-600 font-medium mt-1">
                      🔧 Maintenance scheduled • 6 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predicted Optimization */}
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 mb-1">
                    🎯 Next Optimization Opportunity
                  </div>
                  <div className="text-sm text-amber-800">
                    AI predicts <strong>weather change</strong> at 14:00 (temperature drop to 18°C).
                    Recommendation: Reduce HVAC power by 15% from 14:00-17:00.
                    <strong>Estimated savings: €12.50 (18 kWh)</strong>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium">
                      Auto-Apply at 14:00
                    </button>
                    <button className="px-3 py-1.5 text-xs border border-amber-600 text-amber-700 rounded-md hover:bg-amber-50 font-medium">
                      Review Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Power Consumption by Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HistoricalChart
          title={t('energy.consumption', 'Power Consumption Trend')}
          description="30-day power consumption history"
          data={historicalPowerData}
          dataKey="value"
          chartType="area"
          color="#f59e0b"
          valueFormatter={(value) => `${value.toFixed(1)} kW`}
          yAxisLabel="Power (kW)"
          height={300}
        />
        <HistoricalChart
          title={t('energy.efficiency', 'Energy Efficiency Trend')}
          description="30-day efficiency performance"
          data={historicalEfficiencyData}
          dataKey="value"
          chartType="line"
          color="#10b981"
          valueFormatter={(value) => `${value.toFixed(1)}%`}
          yAxisLabel="Efficiency (%)"
          height={300}
        />
      </div>

      {/* Power Consumption by Area */}
      <div className="bg-card rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Power Consumption by Area
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {consumers.map((consumer, idx) => {
              const percentage = (consumer.power / totalPower) * 100;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{consumer.name}</span>
                      <span className="text-xl">{getTrendIcon(consumer.trend)}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(consumer.status)}`}
                      >
                        {consumer.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{consumer.power} kW</div>
                      <div className="text-xs text-muted-foreground">
                        {consumer.efficiency}% efficient
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-500 to-orange-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of total consumption
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Demand Chart */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Peak Demand - Today</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { time: '00:00 - 06:00', power: 285, bar: 45 },
                { time: '06:00 - 12:00', power: 478, bar: 76 },
                { time: '12:00 - 18:00', power: 512, bar: 82 },
                { time: '18:00 - 00:00', power: 392, bar: 62 },
              ].map((period, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-muted-foreground">{period.time}</div>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded-md overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{ width: `${period.bar}%` }}
                    >
                      {period.power} kW
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-blue-50 rounded-md text-sm">
              <div className="font-medium text-blue-900 mb-1">Peak time: 12:00 - 18:00</div>
              <div className="text-blue-700 text-xs">
                Consider shifting non-critical loads to off-peak hours
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Sustainability Metrics
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Renewable Energy</span>
                <span className="text-2xl font-bold text-green-700">32%</span>
              </div>
              <div className="relative w-full h-2 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-green-600"
                  style={{ width: '32%' }}
                />
              </div>
              <div className="text-xs text-green-700 mt-1">Solar panels + wind</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Water Consumption</span>
                <span className="text-2xl font-bold text-blue-700">3.2m³</span>
              </div>
              <div className="text-xs text-blue-700">-8% vs. last month</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-900">Waste Recycled</span>
                <span className="text-2xl font-bold text-purple-700">87%</span>
              </div>
              <div className="text-xs text-purple-700">Target: 90% by Q4</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-orange-900 mb-1">
                    Carbon Footprint Alert
                  </div>
                  <div className="text-xs text-orange-700">
                    Emissions 12% above monthly target. Review Line-B efficiency.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">AI Recommendations</h2>
        </div>
        <div className="divide-y">
          <div className="p-4 flex items-start gap-3 hover:bg-accent/50">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Optimize HVAC Schedule</div>
              <div className="text-sm text-muted-foreground">
                Reduce HVAC power by 15% during lunch breaks. Estimated savings: €450/month
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
              Apply
            </button>
          </div>
          <div className="p-4 flex items-start gap-3 hover:bg-accent/50">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Upgrade Line-B Motors</div>
              <div className="text-sm text-muted-foreground">
                Replace with high-efficiency motors. ROI: 18 months, 8% energy reduction
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm border rounded-md hover:bg-accent">
              Review
            </button>
          </div>
          <div className="p-4 flex items-start gap-3 hover:bg-accent/50">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Compressed Air Leak Detection</div>
              <div className="text-sm text-muted-foreground">
                Schedule leak audit. Compressed air efficiency below 80%
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm border rounded-md hover:bg-accent">
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
