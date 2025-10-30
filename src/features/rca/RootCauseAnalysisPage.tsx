import { useState } from 'react';
import { AlertCircle, TrendingDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhyStep {
  question: string;
  answer: string;
}

interface RCACase {
  id: string;
  title: string;
  issue: string;
  date: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'open' | 'in-progress' | 'completed';
  whySteps: WhyStep[];
  rootCause: string;
  correctiveActions: CorrectiveAction[];
}

interface CorrectiveAction {
  description: string;
  assignedTo: string;
  completed: boolean;
}

export function RootCauseAnalysisPage() {
  const [selectedCase, setSelectedCase] = useState<RCACase | null>(null);

  const [cases, setCases] = useState<RCACase[]>([
    {
      id: 'RCA-001',
      title: 'Filler-3 Seal Mechanism Jam',
      issue: 'Repeated seal jams causing 15% downtime on Line-B',
      date: 'Oct 29, 2025',
      severity: 'critical',
      status: 'in-progress',
      whySteps: [
        { question: 'Why did the seal jam?', answer: 'Heating element temperature fluctuating' },
        {
          question: 'Why is the temperature fluctuating?',
          answer: 'Thermocouple sensor giving inconsistent readings',
        },
        { question: 'Why is the sensor inconsistent?', answer: 'Sensor connection loose' },
        { question: 'Why is the connection loose?', answer: 'Vibration from adjacent equipment' },
        {
          question: 'Why is there excessive vibration?',
          answer: 'Motor mount bolts not properly torqued during last maintenance',
        },
      ],
      rootCause: 'Motor mount bolts not properly torqued during last maintenance',
      correctiveActions: [
        {
          description: 'Re-torque all motor mount bolts to spec (25 Nm)',
          assignedTo: 'Maintenance Team',
          completed: true,
        },
        {
          description: 'Update PM checklist to include vibration check',
          assignedTo: 'Maintenance Manager',
          completed: false,
        },
        {
          description: 'Provide torque wrench training refresher',
          assignedTo: 'Training Coordinator',
          completed: false,
        },
      ],
    },
    {
      id: 'RCA-002',
      title: 'Quality Defect Rate Spike',
      issue: 'Line-A defect rate increased from 1.2% to 3.8%',
      date: 'Oct 28, 2025',
      severity: 'major',
      status: 'completed',
      whySteps: [
        {
          question: 'Why did the defect rate increase?',
          answer: 'Vision system missing micro-cracks in components',
        },
        {
          question: 'Why is the vision system missing defects?',
          answer: 'Camera lens has accumulated dust and contamination',
        },
        {
          question: 'Why did the lens get contaminated?',
          answer: 'Protective cover was removed and not replaced',
        },
        {
          question: 'Why was the cover not replaced?',
          answer: 'Cleaning procedure does not specify cover replacement',
        },
        {
          question: 'Why is it missing from the procedure?',
          answer: 'Procedure was created before protective covers were installed',
        },
      ],
      rootCause: 'Outdated cleaning procedure missing protective cover reinstallation step',
      correctiveActions: [
        {
          description: 'Clean and recalibrate vision system camera',
          assignedTo: 'Quality Team',
          completed: true,
        },
        {
          description: 'Update cleaning SOP to include cover replacement',
          assignedTo: 'Quality Manager',
          completed: true,
        },
        {
          description: 'Add camera cleanliness check to daily startup',
          assignedTo: 'Production Lead',
          completed: true,
        },
      ],
    },
    {
      id: 'RCA-003',
      title: 'Conveyor Belt Misalignment',
      issue: 'Intermittent product jams on conveyor B2',
      date: 'Oct 27, 2025',
      severity: 'minor',
      status: 'completed',
      whySteps: [
        { question: 'Why are products jamming?', answer: 'Conveyor belt running off-center' },
        {
          question: 'Why is the belt off-center?',
          answer: 'Tension rollers are unevenly adjusted',
        },
        {
          question: 'Why are rollers unevenly adjusted?',
          answer: 'No tension measurement tool available during last adjustment',
        },
        {
          question: 'Why was no tool available?',
          answer: 'Tension gauge was borrowed by another line and not returned',
        },
        {
          question: 'Why was it not returned?',
          answer: 'No tool checkout/return tracking system in place',
        },
      ],
      rootCause: 'Lack of tool tracking system leading to missing equipment during maintenance',
      correctiveActions: [
        {
          description: 'Realign conveyor belt with proper tension gauge',
          assignedTo: 'Maintenance Team',
          completed: true,
        },
        {
          description: 'Implement tool checkout system with RFID tags',
          assignedTo: 'Maintenance Manager',
          completed: true,
        },
        {
          description: 'Purchase dedicated tension gauge for each line',
          assignedTo: 'Procurement',
          completed: true,
        },
      ],
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-700';
      case 'major':
        return 'bg-orange-50 text-orange-700';
      case 'minor':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700';
      case 'open':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const handleNewAnalysis = () => {
    const newCase: RCACase = {
      id: `RCA-${String(cases.length + 1).padStart(3, '0')}`,
      title: 'New Root Cause Analysis',
      issue: 'Click to edit issue description',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      severity: 'major',
      status: 'open',
      whySteps: [{ question: 'Why did this happen?', answer: '' }],
      rootCause: '',
      correctiveActions: [],
    };
    setCases([newCase, ...cases]);
    setSelectedCase(newCase);
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Root Cause Analysis</h1>
        <p className="text-muted-foreground">Systematic problem solving with 5-Why analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-1 space-y-3">
          <Button className="w-full mb-3" onClick={handleNewAnalysis}>
            New Analysis
          </Button>
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => setSelectedCase(caseItem)}
              className={`bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedCase?.id === caseItem.id ? 'ring-2 ring-versuni-primary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 text-sm">{caseItem.title}</h3>
                  <div className="text-xs text-muted-foreground mb-2">{caseItem.issue}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${getSeverityColor(caseItem.severity)}`}
                    >
                      {caseItem.severity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(caseItem.status)}`}
                    >
                      {caseItem.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{caseItem.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Detail */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="space-y-6">
              {/* Case Header */}
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCase.title}</h2>
                    <p className="text-muted-foreground">{selectedCase.issue}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${getSeverityColor(selectedCase.severity)}`}
                  >
                    {selectedCase.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium">{selectedCase.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2 font-medium">{selectedCase.date}</span>
                  </div>
                </div>
              </div>

              {/* 5-Why Analysis */}
              <div className="bg-card rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">5-Why Analysis</h3>
                  <p className="text-sm text-muted-foreground">Drill down to the root cause</p>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {selectedCase.whySteps.map((step, idx) => (
                      <div key={idx} className="relative">
                        {idx < selectedCase.whySteps.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-versuni-primary/30" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-versuni-primary text-white font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="font-medium text-sm mb-2">{step.question}</div>
                            <div className="p-3 bg-accent rounded-lg text-sm">{step.answer}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedCase.whySteps.length < 5 && (
                    <Button variant="outline" className="w-full mt-4">
                      Add Another "Why"
                    </Button>
                  )}
                </div>
              </div>

              {/* Root Cause & Actions */}
              <div className="bg-card rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Root Cause Identified
                  </h3>
                </div>
                <div className="p-4">
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded-md mb-4">
                    <p className="font-medium text-yellow-900">{selectedCase.rootCause}</p>
                  </div>

                  <h4 className="font-semibold mb-3">Corrective Actions</h4>
                  <div className="space-y-2">
                    {selectedCase.correctiveActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-accent rounded-md">
                        <input type="checkbox" className="mt-1" defaultChecked={action.completed} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{action.description}</div>
                          <div className="text-xs text-muted-foreground">
                            Assigned to: {action.assignedTo}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => alert('Root cause analysis completed! Report has been saved and stakeholders will be notified.')}
                    >
                      Complete Analysis
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => alert('Exporting comprehensive RCA report with fishbone diagram, 5 Whys analysis, and action items...')}
                    >
                      Export Report
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fishbone Diagram */}
              <div className="bg-card rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-blue-600" />
                    Fishbone Diagram (Ishikawa)
                  </h3>
                </div>
                <div className="p-6">
                  <div className="text-center text-muted-foreground">
                    <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Interactive fishbone diagram coming soon</p>
                    <p className="text-xs mt-1">
                      Visualize causes across Man, Machine, Method, Material, Environment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border p-12 text-center text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a case to view root cause analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
