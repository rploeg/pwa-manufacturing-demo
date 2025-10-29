// Advanced Analytics Service
// Provides trend analysis, cost calculations, and comparative metrics

export interface TrendData {
  label: string;
  value: number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'stable';
}

export interface CostImpact {
  category: string;
  actual: number;
  target: number;
  savings: number;
  currency: string;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ComparativeMetric {
  name: string;
  current: number;
  previous: number;
  benchmark: number;
  unit: string;
}

class AnalyticsService {
  // Calculate trend from historical data
  calculateTrend(data: HistoricalDataPoint[]): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';

    const recent = data.slice(-7); // Last 7 points
    const older = data.slice(-14, -7); // Previous 7 points

    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(changePercent) < 2) return 'stable';
    return changePercent > 0 ? 'up' : 'down';
  }

  // Calculate percentage change
  calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Generate historical data for demo
  generateHistoricalData(
    days: number,
    baseValue: number,
    variance: number,
    trend?: 'increasing' | 'decreasing' | 'stable'
  ): HistoricalDataPoint[] {
    const data: HistoricalDataPoint[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      let value = baseValue;

      // Apply trend
      if (trend === 'increasing') {
        value += (days - i) * (variance / days);
      } else if (trend === 'decreasing') {
        value -= (days - i) * (variance / days);
      }

      // Add random variance
      value += (Math.random() - 0.5) * variance;

      data.push({
        timestamp: date,
        value: Math.max(0, value),
      });
    }

    return data;
  }

  // Calculate cost impact
  calculateCostImpact(
    actual: number,
    target: number,
    costPerUnit: number,
    currency: string = '€'
  ): CostImpact {
    const savings = (target - actual) * costPerUnit;

    return {
      category: 'General',
      actual,
      target,
      savings,
      currency,
    };
  }

  // Energy cost calculation
  calculateEnergyCost(kWh: number, ratePerKWh: number = 0.15): number {
    return kWh * ratePerKWh;
  }

  // Downtime cost calculation
  calculateDowntimeCost(minutes: number, costPerMinute: number = 50): number {
    return minutes * costPerMinute;
  }

  // Quality cost calculation (defect costs)
  calculateQualityCost(defectCount: number, costPerDefect: number = 25): number {
    return defectCount * costPerDefect;
  }

  // OEE calculation
  calculateOEE(availability: number, performance: number, quality: number): number {
    return (availability * performance * quality) / 10000;
  }

  // Compare periods
  comparePeriods(
    current: HistoricalDataPoint[],
    previous: HistoricalDataPoint[]
  ): ComparativeMetric[] {
    const metrics: ComparativeMetric[] = [];

    const currentAvg = current.reduce((sum, d) => sum + d.value, 0) / current.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.value, 0) / previous.length;

    // Industry benchmark (simulated)
    const benchmark = currentAvg * (0.9 + Math.random() * 0.2);

    metrics.push({
      name: 'Average Value',
      current: currentAvg,
      previous: previousAvg,
      benchmark,
      unit: 'units',
    });

    return metrics;
  }

  // Generate comparative analytics
  generateComparativeAnalytics(_metric: string): {
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    yearToDate: number;
  } {
    return {
      thisWeek: Math.random() * 100 + 50,
      lastWeek: Math.random() * 100 + 50,
      thisMonth: Math.random() * 400 + 200,
      lastMonth: Math.random() * 400 + 200,
      yearToDate: Math.random() * 5000 + 2000,
    };
  }

  // Forecast future values using simple linear regression
  forecastValue(historical: HistoricalDataPoint[], daysAhead: number = 7): number {
    if (historical.length < 2) return historical[historical.length - 1]?.value || 0;

    // Simple linear regression
    const n = historical.length;
    const xValues = historical.map((_, i) => i);
    const yValues = historical.map((d) => d.value);

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return slope * (n + daysAhead - 1) + intercept;
  }

  // Calculate ROI
  calculateROI(investment: number, benefit: number): number {
    if (investment === 0) return 0;
    return ((benefit - investment) / investment) * 100;
  }

  // Payback period calculation
  calculatePaybackPeriod(investment: number, monthlySavings: number): number {
    if (monthlySavings <= 0) return Infinity;
    return investment / monthlySavings;
  }
}

export const analyticsService = new AnalyticsService();
