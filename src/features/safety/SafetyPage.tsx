import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
  Users,
  HardHat,
  Eye,
  Leaf,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { agentService } from '@/data/clients/agent';

interface SafetyIncident {
  id: string;
  type: 'near-miss' | 'first-aid' | 'recordable' | 'lost-time';
  date: Date;
  location: string;
  lineId: string;
  shift: string;
  description: string;
  rootCause?: string;
  correctiveActions: string[];
  status: 'open' | 'investigating' | 'corrective-action' | 'closed';
  reportedBy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceItem {
  id: string;
  category: 'ppe' | 'environmental' | 'lockout-tagout' | 'training';
  description: string;
  status: 'compliant' | 'non-compliant' | 'expired' | 'due-soon';
  dueDate?: Date;
  responsiblePerson: string;
  location?: string;
}

// Mock data: Safety incidents
const safetyIncidents: SafetyIncident[] = [
  {
    id: 'inc-001',
    type: 'near-miss',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4),
    location: 'Line-B, Filler Station',
    lineId: 'line-b',
    shift: 'Morning',
    description: 'Operator nearly slipped on oil spill near Filler-2. No injury occurred.',
    rootCause: 'Hydraulic line slow leak not detected during routine inspection',
    correctiveActions: [
      'Installed drip pan under hydraulic connections',
      'Added daily visual inspection to checklist',
      'Scheduled hydraulic line replacement',
    ],
    status: 'corrective-action',
    reportedBy: 'Mike Chen',
    severity: 'medium',
  },
  {
    id: 'inc-002',
    type: 'first-aid',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    location: 'Line-A, Assembly Station',
    lineId: 'line-a',
    shift: 'Afternoon',
    description: 'Minor cut on hand while changing conveyor belt. First aid administered.',
    rootCause: 'Sharp edge on belt tensioner not guarded',
    correctiveActions: [
      'Added protective guard to belt tensioner',
      'Retrained operators on proper PPE (cut-resistant gloves)',
      'Updated SOP to specify glove requirement',
    ],
    status: 'closed',
    reportedBy: 'Sarah Johnson',
    severity: 'low',
  },
  {
    id: 'inc-003',
    type: 'near-miss',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    location: 'Line-C, Packaging Area',
    lineId: 'line-c',
    shift: 'Night',
    description:
      'Forklift nearly backed into operator in blind spot. Operator heard beeper and moved.',
    rootCause: 'Poor lighting in night shift, pedestrian walkway not clearly marked',
    correctiveActions: [
      'Installed additional LED lights in packaging area',
      'Painted bright yellow pedestrian walkway',
      'Added proximity sensor to forklift',
    ],
    status: 'closed',
    reportedBy: 'John Smith',
    severity: 'high',
  },
  {
    id: 'inc-004',
    type: 'near-miss',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    location: 'Line-B, Sealer Station',
    lineId: 'line-b',
    shift: 'Morning',
    description: 'Hot seal bar guard left open, operator noticed before reaching in.',
    rootCause: 'Interlock switch failed, guard can open without stopping machine',
    correctiveActions: [
      'Replaced faulty interlock switch',
      'Added interlock test to weekly PM checklist',
    ],
    status: 'investigating',
    reportedBy: 'Emily Davis',
    severity: 'critical',
  },
];

// Mock data: Compliance tracking
const complianceItems: ComplianceItem[] = [
  {
    id: 'comp-001',
    category: 'ppe',
    description: 'Safety glasses compliance - Line-A',
    status: 'compliant',
    responsiblePerson: 'Safety Team',
    location: 'Line-A',
  },
  {
    id: 'comp-002',
    category: 'environmental',
    description: 'Air emissions permit renewal',
    status: 'due-soon',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    responsiblePerson: 'John Smith',
  },
  {
    id: 'comp-003',
    category: 'training',
    description: 'Forklift certification - Mike Chen',
    status: 'expired',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    responsiblePerson: 'HR Department',
  },
  {
    id: 'comp-004',
    category: 'lockout-tagout',
    description: 'LOTO annual audit - Line-B',
    status: 'compliant',
    responsiblePerson: 'Maintenance Team',
    location: 'Line-B',
  },
  {
    id: 'comp-005',
    category: 'environmental',
    description: 'Hazardous waste manifest',
    status: 'non-compliant',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    responsiblePerson: 'EHS Manager',
  },
  {
    id: 'comp-006',
    category: 'ppe',
    description: 'Hearing protection compliance - Line-C',
    status: 'compliant',
    responsiblePerson: 'Safety Team',
    location: 'Line-C',
  },
];

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState<'incidents' | 'compliance' | 'analytics'>('incidents');
  const [incidentFilter, setIncidentFilter] = useState<string>('all');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredIncidents =
    incidentFilter === 'all'
      ? safetyIncidents
      : safetyIncidents.filter((inc) => inc.status === incidentFilter);

  // Calculate metrics
  const nearMissCount = safetyIncidents.filter((i) => i.type === 'near-miss').length;
  const openCount = safetyIncidents.filter(
    (i) => i.status === 'open' || i.status === 'investigating'
  ).length;
  const criticalCount = safetyIncidents.filter((i) => i.severity === 'critical').length;
  const complianceRate =
    (complianceItems.filter((c) => c.status === 'compliant').length / complianceItems.length) * 100;

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'near-miss':
        return <Eye className="w-4 h-4" />;
      case 'first-aid':
        return <Shield className="w-4 h-4" />;
      case 'recordable':
        return <AlertTriangle className="w-4 h-4" />;
      case 'lost-time':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-amber-100 text-amber-800';
      case 'corrective-action':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'non-compliant':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'due-soon':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      const nonCompliantItems = complianceItems.filter(
        (c) => c.status === 'non-compliant' || c.status === 'expired'
      );

      const prompt = `You are a safety and compliance analyst. Analyze the following workplace safety data and provide recommendations.

SAFETY INCIDENT DATA:
- Total near-miss reports: ${nearMissCount}
- Open safety incidents: ${openCount}
- Critical safety issues: ${criticalCount}
- Overall compliance rate: ${complianceRate.toFixed(1)}%

RECENT SAFETY INCIDENTS:
${safetyIncidents
  .slice(0, 4)
  .map(
    (inc) => `
  * Type: ${inc.type.toUpperCase()}
  * Description: ${inc.description}
  * Location: ${inc.location}
  * Shift: ${inc.shift}
  * Severity: ${inc.severity}
  * Status: ${inc.status}
  * Root Cause: ${inc.rootCause || 'Under investigation'}
  * Corrective Actions: ${inc.correctiveActions.join(', ')}`
  )
  .join('\n')}

NON-COMPLIANT ITEMS:
${nonCompliantItems.map((item) => `- ${item.category.toUpperCase()}: ${item.description} (Status: ${item.status})`).join('\n')}

Based on this SAFETY data, provide specific safety improvement recommendations:
1. Safety Pattern Analysis: What common themes appear in the incidents?
2. High-Priority Actions: What safety issues need immediate attention?
3. Preventive Measures: What can prevent these safety incidents from recurring?
4. Compliance Priorities: Which compliance items should be addressed first?
5. Training Needs: What safety training or awareness programs are needed?

Focus your analysis on workplace safety, not production or equipment issues.`;

      const stream = agentService.streamOrchestrator({
        messages: [
          { role: 'user', content: prompt, timestamp: new Date(), id: Date.now().toString() },
        ],
        maxTokens: 800,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (!chunk.done) {
          fullResponse += chunk.delta;
          setAiAnalysis(fullResponse);
        }
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiAnalysis('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          Safety & Compliance
        </h1>
        <p className="text-muted-foreground">
          Track incidents, monitor compliance, and drive continuous safety improvement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Near-Miss Reports</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{nearMissCount}</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            Good leading indicator
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Open Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{openCount}</p>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Critical Issues</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold">{criticalCount}</p>
          <p className="text-xs text-red-600">Immediate action needed</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Compliance Rate</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{complianceRate.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">
            {complianceItems.filter((c) => c.status === 'compliant').length}/
            {complianceItems.length} items
          </p>
        </Card>
      </div>

      {/* AI Analysis Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              AI Safety Analysis
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get AI-powered insights on safety patterns and compliance priorities
            </p>
          </div>
          <Button
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </div>

        {aiAnalysis && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">{aiAnalysis}</div>
            </div>
          </div>
        )}

        {!aiAnalysis && !isAnalyzing && (
          <div className="text-sm text-muted-foreground italic">
            Click "Analyze with AI" to identify safety patterns, compliance gaps, and preventive
            actions.
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={activeTab === 'incidents' ? 'default' : 'outline'}
          onClick={() => setActiveTab('incidents')}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Incidents
        </Button>
        <Button
          variant={activeTab === 'compliance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('compliance')}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Compliance
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {activeTab === 'incidents' && (
        <>
          {/* Incident Filters */}
          <div className="mb-4 flex gap-2">
            <Button
              size="sm"
              variant={incidentFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setIncidentFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={incidentFilter === 'open' ? 'default' : 'outline'}
              onClick={() => setIncidentFilter('open')}
            >
              Open
            </Button>
            <Button
              size="sm"
              variant={incidentFilter === 'investigating' ? 'default' : 'outline'}
              onClick={() => setIncidentFilter('investigating')}
            >
              Investigating
            </Button>
            <Button
              size="sm"
              variant={incidentFilter === 'corrective-action' ? 'default' : 'outline'}
              onClick={() => setIncidentFilter('corrective-action')}
            >
              Corrective Action
            </Button>
            <Button
              size="sm"
              variant={incidentFilter === 'closed' ? 'default' : 'outline'}
              onClick={() => setIncidentFilter('closed')}
            >
              Closed
            </Button>
          </div>

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded ${
                        incident.type === 'near-miss'
                          ? 'bg-blue-100'
                          : incident.type === 'first-aid'
                            ? 'bg-yellow-100'
                            : incident.type === 'recordable'
                              ? 'bg-orange-100'
                              : 'bg-red-100'
                      }`}
                    >
                      {getIncidentIcon(incident.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold capitalize">
                          {incident.type.replace('-', ' ')}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(incident.status)}`}
                        >
                          {incident.status.replace('-', ' ')}
                        </span>
                        <span
                          className={`text-xs font-semibold ${getSeverityColor(incident.severity)}`}
                        >
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {incident.location} • {incident.shift} Shift •{' '}
                        {incident.date.toLocaleString()}
                      </p>
                      <p className="text-sm mb-2">{incident.description}</p>
                      {incident.rootCause && (
                        <div className="mt-2 p-2 bg-amber-50 rounded text-sm">
                          <p className="font-semibold text-amber-900">Root Cause:</p>
                          <p className="text-amber-800">{incident.rootCause}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {incident.correctiveActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-semibold mb-2">Corrective Actions:</p>
                    <ul className="space-y-1">
                      {incident.correctiveActions.map((action, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reported by: {incident.reportedBy}</span>
                  <span>ID: {incident.id}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {/* PPE Compliance */}
          <Card className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-blue-600" />
              Personal Protective Equipment (PPE)
            </h3>
            <div className="space-y-2">
              {complianceItems
                .filter((c) => c.category === 'ppe')
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      {getComplianceStatusIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.location} • {item.responsiblePerson}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.status === 'compliant'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </Card>

          {/* Environmental Compliance */}
          <Card className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Environmental Compliance
            </h3>
            <div className="space-y-2">
              {complianceItems
                .filter((c) => c.category === 'environmental')
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      {getComplianceStatusIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.responsiblePerson}
                          {item.dueDate && ` • Due: ${item.dueDate.toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.status === 'compliant'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'due-soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </Card>

          {/* Training & Certifications */}
          <Card className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Training & Certifications
            </h3>
            <div className="space-y-2">
              {complianceItems
                .filter((c) => c.category === 'training')
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      {getComplianceStatusIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.responsiblePerson}
                          {item.dueDate && ` • Expired: ${item.dueDate.toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </Card>

          {/* LOTO Compliance */}
          <Card className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Lockout/Tagout (LOTO)
            </h3>
            <div className="space-y-2">
              {complianceItems
                .filter((c) => c.category === 'lockout-tagout')
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      {getComplianceStatusIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.location} • {item.responsiblePerson}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Trend Analysis */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Safety Trend Analysis - Last 30 Days</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded">
                <p className="text-sm text-muted-foreground mb-1">Total Incidents</p>
                <p className="text-3xl font-bold">{safetyIncidents.length}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  25% decrease from last month
                </p>
              </div>
              <div className="p-4 border rounded">
                <p className="text-sm text-muted-foreground mb-1">Days Since Last Injury</p>
                <p className="text-3xl font-bold">45</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Target: 90 days
                </p>
              </div>
              <div className="p-4 border rounded">
                <p className="text-sm text-muted-foreground mb-1">Near-Miss to Injury Ratio</p>
                <p className="text-3xl font-bold">4:1</p>
                <p className="text-xs text-muted-foreground">Good reporting culture</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Key Insights</h4>
              <ul className="text-sm space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Hotspot Identified:</strong> Line-B has 50% of near-misses. Recommend
                    focused safety walk next week.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Pattern Detected:</strong> 75% of incidents occur during shift changes.
                    Consider overlap period for handover.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Positive Trend:</strong> Near-miss reporting up 40% - indicates improved
                    safety culture and awareness.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Action Required:</strong> 1 critical interlock failure needs immediate
                    resolution before next shift.
                  </span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Incident Distribution */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Incident Distribution by Type</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Near-Miss</span>
                  <span className="text-sm font-semibold">
                    {safetyIncidents.filter((i) => i.type === 'near-miss').length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(safetyIncidents.filter((i) => i.type === 'near-miss').length / safetyIncidents.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">First Aid</span>
                  <span className="text-sm font-semibold">
                    {safetyIncidents.filter((i) => i.type === 'first-aid').length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${(safetyIncidents.filter((i) => i.type === 'first-aid').length / safetyIncidents.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Recordable</span>
                  <span className="text-sm font-semibold">0</span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Lost Time</span>
                  <span className="text-sm font-semibold">0</span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
