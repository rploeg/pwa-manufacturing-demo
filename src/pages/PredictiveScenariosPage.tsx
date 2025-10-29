import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Users,
  Clock,
  DollarSign,
  Target,
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScenarioParams {
  productionRate: number; // units per hour
  shiftsPerDay: number;
  operatorsPerShift: number;
  defectRate: number; // percentage
  energyCostPerKWh: number;
  powerConsumption: number; // kW
}

interface ScenarioResults {
  dailyOutput: number;
  weeklyOutput: number;
  monthlyOutput: number;
  totalCost: number;
  costPerUnit: number;
  oee: number;
  energyCost: number;
  laborCost: number;
  qualityCost: number;
  roi: number;
}

export default function PredictiveScenariosPage() {
  const { t, formatCurrency } = useLanguage();

  const [scenario, setScenario] = useState<ScenarioParams>({
    productionRate: 50,
    shiftsPerDay: 2,
    operatorsPerShift: 4,
    defectRate: 2.5,
    energyCostPerKWh: 0.15,
    powerConsumption: 150,
  });

  const [baselineScenario] = useState<ScenarioParams>({
    productionRate: 50,
    shiftsPerDay: 2,
    operatorsPerShift: 4,
    defectRate: 2.5,
    energyCostPerKWh: 0.15,
    powerConsumption: 150,
  });

  const calculateResults = (params: ScenarioParams): ScenarioResults => {
    const hoursPerShift = 8;
    const workDays = 5;
    const hourlyLaborCost = 25; // EUR per operator per hour

    // Production calculations
    const dailyHours = params.shiftsPerDay * hoursPerShift;
    const dailyOutput = params.productionRate * dailyHours;
    const weeklyOutput = dailyOutput * workDays;
    const monthlyOutput = dailyOutput * workDays * 4.33;

    // Cost calculations
    const dailyEnergyConsumption = params.powerConsumption * dailyHours;
    const energyCost = analyticsService.calculateEnergyCost(
      dailyEnergyConsumption * workDays * 4.33,
      params.energyCostPerKWh
    );

    const laborCost = params.operatorsPerShift * hourlyLaborCost * dailyHours * workDays * 4.33;

    const defectCount = Math.round(monthlyOutput * (params.defectRate / 100));
    const qualityCost = analyticsService.calculateQualityCost(defectCount, 25);

    const totalCost = energyCost + laborCost + qualityCost;
    const costPerUnit = totalCost / monthlyOutput;

    // OEE calculation (simplified)
    const availability = 85;
    const performance = Math.min(100, (params.productionRate / 60) * 100);
    const quality = 100 - params.defectRate;
    const oee = analyticsService.calculateOEE(availability, performance, quality);

    // ROI calculation (comparing to baseline)
    const baselineResults = calculateResults(baselineScenario);
    const investment = Math.abs(totalCost - baselineResults.totalCost);
    const benefit = (monthlyOutput - baselineResults.monthlyOutput) * 50; // EUR 50 per unit revenue
    const roi = benefit > 0 ? analyticsService.calculateROI(benefit, investment) : 0;

    return {
      dailyOutput,
      weeklyOutput,
      monthlyOutput,
      totalCost,
      costPerUnit,
      oee,
      energyCost,
      laborCost,
      qualityCost,
      roi,
    };
  };

  const results = calculateResults(scenario);
  const baselineResults = calculateResults(baselineScenario);

  const getComparison = (current: number, baseline: number) => {
    const diff = ((current - baseline) / baseline) * 100;
    return {
      diff: Math.abs(diff),
      isImprovement: diff > 0,
      isNegative: diff < 0,
    };
  };

  const outputComparison = getComparison(results.monthlyOutput, baselineResults.monthlyOutput);
  const costComparison = getComparison(baselineResults.costPerUnit, results.costPerUnit); // reversed for cost
  const oeeComparison = getComparison(results.oee, baselineResults.oee);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('scenarios.title', 'Predictive Scenarios')}</h1>
        <p className="text-muted-foreground">
          {t('scenarios.description', 'What-if analysis and capacity planning calculator')}
        </p>
      </div>

      {/* Scenario Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {t('scenarios.parameters', 'Scenario Parameters')}
          </CardTitle>
          <CardDescription>
            {t('scenarios.adjust', 'Adjust parameters to see predicted outcomes')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Production Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t('scenarios.productionRate', 'Production Rate')}
                </label>
                <span className="text-sm font-bold">{scenario.productionRate} units/hour</span>
              </div>
              <Slider
                value={[scenario.productionRate]}
                onValueChange={(values: number[]) =>
                  setScenario({ ...scenario, productionRate: values[0] })
                }
                min={20}
                max={100}
                step={5}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">Range: 20-100 units/hour</p>
            </div>

            {/* Shifts per Day */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('scenarios.shiftsPerDay', 'Shifts per Day')}
                </label>
                <span className="text-sm font-bold">{scenario.shiftsPerDay} shifts</span>
              </div>
              <Slider
                value={[scenario.shiftsPerDay]}
                onValueChange={(values: number[]) =>
                  setScenario({ ...scenario, shiftsPerDay: values[0] })
                }
                min={1}
                max={3}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">Range: 1-3 shifts (8 hours each)</p>
            </div>

            {/* Operators per Shift */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('scenarios.operatorsPerShift', 'Operators per Shift')}
                </label>
                <span className="text-sm font-bold">{scenario.operatorsPerShift} operators</span>
              </div>
              <Slider
                value={[scenario.operatorsPerShift]}
                onValueChange={(values: number[]) =>
                  setScenario({ ...scenario, operatorsPerShift: values[0] })
                }
                min={2}
                max={8}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">Range: 2-8 operators</p>
            </div>

            {/* Defect Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t('scenarios.defectRate', 'Defect Rate')}
                </label>
                <span className="text-sm font-bold">{scenario.defectRate.toFixed(1)}%</span>
              </div>
              <Slider
                value={[scenario.defectRate]}
                onValueChange={(values: number[]) =>
                  setScenario({ ...scenario, defectRate: values[0] })
                }
                min={0.5}
                max={10}
                step={0.5}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">Range: 0.5%-10%</p>
            </div>

            {/* Power Consumption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t('scenarios.powerConsumption', 'Power Consumption')}
                </label>
                <span className="text-sm font-bold">{scenario.powerConsumption} kW</span>
              </div>
              <Slider
                value={[scenario.powerConsumption]}
                onValueChange={(values: number[]) =>
                  setScenario({ ...scenario, powerConsumption: values[0] })
                }
                min={50}
                max={300}
                step={10}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">Range: 50-300 kW</p>
            </div>

            {/* Energy Cost */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {t('scenarios.energyCost', 'Energy Cost')}
                </label>
                <span className="text-sm font-bold">
                  {formatCurrency(scenario.energyCostPerKWh)}/kWh
                </span>
              </div>
              <Slider
                value={[scenario.energyCostPerKWh * 100]}
                onValueChange={(values: number[]) =>
                  setScenario({ ...scenario, energyCostPerKWh: values[0] / 100 })
                }
                min={5}
                max={30}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">Range: €0.05-€0.30 per kWh</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setScenario(baselineScenario)}>
              {t('scenarios.resetBaseline', 'Reset to Baseline')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('scenarios.monthlyOutput', 'Monthly Output')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(results.monthlyOutput).toLocaleString()}
            </div>
            <div
              className={`text-sm mt-1 flex items-center gap-1 ${
                outputComparison.isImprovement
                  ? 'text-green-600'
                  : outputComparison.isNegative
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              }`}
            >
              {outputComparison.isImprovement ? (
                <TrendingUp className="w-3 h-3" />
              ) : outputComparison.isNegative ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              {outputComparison.diff.toFixed(1)}% vs baseline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {t('scenarios.costPerUnit', 'Cost per Unit')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(results.costPerUnit)}</div>
            <div
              className={`text-sm mt-1 flex items-center gap-1 ${
                costComparison.isImprovement
                  ? 'text-green-600'
                  : costComparison.isNegative
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              }`}
            >
              {costComparison.isImprovement ? (
                <TrendingUp className="w-3 h-3" />
              ) : costComparison.isNegative ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              {costComparison.diff.toFixed(1)}% vs baseline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              OEE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.oee.toFixed(1)}%</div>
            <div
              className={`text-sm mt-1 flex items-center gap-1 ${
                oeeComparison.isImprovement
                  ? 'text-green-600'
                  : oeeComparison.isNegative
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              }`}
            >
              {oeeComparison.isImprovement ? (
                <TrendingUp className="w-3 h-3" />
              ) : oeeComparison.isNegative ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              {oeeComparison.diff.toFixed(1)}% vs baseline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('scenarios.roi', 'ROI')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.roi.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground mt-1">Return on investment</div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('scenarios.costBreakdown', 'Cost Breakdown (Monthly)')}</CardTitle>
          <CardDescription>Detailed cost analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">{t('scenarios.energyCostLabel', 'Energy Cost')}</span>
              </div>
              <span className="font-bold">{formatCurrency(results.energyCost)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{t('scenarios.laborCost', 'Labor Cost')}</span>
              </div>
              <span className="font-bold">{formatCurrency(results.laborCost)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium">
                  {t('scenarios.qualityCost', 'Quality Cost (Defects)')}
                </span>
              </div>
              <span className="font-bold">{formatCurrency(results.qualityCost)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-bold">
                  {t('scenarios.totalMonthlyCost', 'Total Monthly Cost')}
                </span>
              </div>
              <span className="font-bold text-xl">{formatCurrency(results.totalCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CheckCircle className="w-5 h-5" />
            {t('scenarios.recommendations', 'AI Recommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          {scenario.defectRate > 3 && (
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">High defect rate detected</div>
                <div className="text-xs mt-1">
                  Consider quality improvement initiatives. Reducing defect rate to 2% could save{' '}
                  {formatCurrency(results.qualityCost * 0.4)} per month.
                </div>
              </div>
            </div>
          )}
          {scenario.shiftsPerDay < 3 && (
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Capacity expansion opportunity</div>
                <div className="text-xs mt-1">
                  Adding a third shift could increase monthly output by{' '}
                  {Math.round(results.dailyOutput * 5 * 4.33).toLocaleString()} units.
                </div>
              </div>
            </div>
          )}
          {results.oee < 75 && (
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
              <Target className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">OEE below target</div>
                <div className="text-xs mt-1">
                  Focus on improving availability and performance to reach 85% OEE target.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
