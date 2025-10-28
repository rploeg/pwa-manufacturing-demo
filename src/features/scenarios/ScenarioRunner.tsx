import { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  MessageSquare,
  FileText,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type {
  ScenarioTemplate,
  ScenarioStep,
  ScenarioStepResult,
} from '@/data/types';

interface ScenarioRunnerProps {
  template: ScenarioTemplate;
  onClose: () => void;
}

export function ScenarioRunner({ template, onClose }: ScenarioRunnerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [stepResults, setStepResults] = useState<ScenarioStepResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const currentStep = template.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / template.steps.length) * 100;
  const isLastStep = currentStepIndex === template.steps.length - 1;

  const handleInputChange = (key: string, value: unknown) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const executeAgentStep = async (step: ScenarioStep): Promise<string> => {
    // Simulate agent execution with SSE streaming
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock agent responses based on step
        const mockResponses: Record<string, string> = {
          'step-2': `**OEE Analysis Results**

Line-B Afternoon Shift Performance:
- **OEE**: 76.2% (↓ 11.8% vs. baseline 88%)
- **Availability**: 89.4% (↓ 6.6%)
- **Performance**: 91.2% (↓ 3.8%)
- **Quality**: 93.5% (↓ 1.4%)

**Primary Impact**: Availability loss due to unplanned downtime.`,
          'step-3': `**Root Cause Analysis**

Top 3 Contributing Factors:
1. **Unplanned Downtime** (2h 15min)
   - Filler-3 seal jam at 15:30 (45 min)
   - Conveyor belt misalignment at 17:00 (1h 30min)
   
2. **Performance Loss** (3.8%)
   - Reduced speed after seal jam repair
   - Operator caution during ramp-up
   
3. **Quality Issues** (1.4%)
   - 8 defects rejected during belt misalignment
   - Cosmetic damage on 3 units

**Recommendation**: Preventive maintenance on Filler-3 sealing mechanism and conveyor alignment check.`,
          'step-4': `**Maintenance Action Plan**

**Task 1: Filler-3 Seal Mechanism Inspection**
- Priority: High
- Duration: 2 hours
- Parts: Seal cartridge (P/N 12345), O-rings
- Technician: Assign to PM team

**Task 2: Conveyor Belt Alignment**
- Priority: High  
- Duration: 1.5 hours
- Parts: Alignment guides, tension springs
- Schedule: Next planned downtime

**Task 3: Operator Refresher Training**
- Priority: Medium
- Duration: 30 minutes
- Topic: Post-jam restart procedures`,
        };

        resolve(
          mockResponses[step.id] ||
            `Agent ${step.agentId} completed analysis successfully.`
        );
      }, 2000 + Math.random() * 1000);
    });
  };

  const handleNext = async () => {
    if (currentStep.type === 'form') {
      // Validate required inputs
      const missingFields = currentStep.inputs?.filter(
        (input) => input.required && !inputs[input.key]
      );
      if (missingFields && missingFields.length > 0) {
        alert('Please fill in all required fields');
        return;
      }
    }

    // Execute agent step
    if (currentStep.type === 'agent') {
      setIsExecuting(true);
      const result = await executeAgentStep(currentStep);
      setStepResults((prev) => [
        ...prev,
        {
          stepId: currentStep.id,
          stepTitle: currentStep.title,
          startedAt: new Date(),
          completedAt: new Date(),
          status: 'completed',
          data: result,
        },
      ]);
      setIsExecuting(false);
    }

    if (isLastStep) {
      // Complete scenario
      alert('Scenario completed successfully!');
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const renderStepIcon = (type: ScenarioStep['type']) => {
    switch (type) {
      case 'agent':
        return <MessageSquare className="w-5 h-5" />;
      case 'form':
        return <FileText className="w-5 h-5" />;
      case 'review':
        return <Eye className="w-5 h-5" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'form':
        return (
          <div className="space-y-4">
            {currentStep.inputs?.map((input) => (
              <div key={input.key}>
                <label className="block text-sm font-medium mb-2">
                  {input.label}
                  {input.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {input.type === 'select' && (
                  <select
                    value={(inputs[input.key] as string) || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    className="w-full border rounded-md p-2 bg-background"
                  >
                    <option value="">Select...</option>
                    {input.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {input.type === 'text' && (
                  <Input
                    value={(inputs[input.key] as string) || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    placeholder={input.label}
                  />
                )}
                {input.type === 'number' && (
                  <Input
                    type="number"
                    value={(inputs[input.key] as number) || ''}
                    onChange={(e) =>
                      handleInputChange(input.key, parseInt(e.target.value))
                    }
                    placeholder={input.label}
                  />
                )}
                {input.type === 'date' && (
                  <Input
                    type="date"
                    value={(inputs[input.key] as string) || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                  />
                )}
                {input.type === 'multiselect' && (
                  <div className="space-y-2">
                    {input.options?.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            (inputs[input.key] as string[])?.includes(opt.value) ||
                            false
                          }
                          onChange={(e) => {
                            const current = (inputs[input.key] as string[]) || [];
                            if (e.target.checked) {
                              handleInputChange(input.key, [...current, opt.value]);
                            } else {
                              handleInputChange(
                                input.key,
                                current.filter((v) => v !== opt.value)
                              );
                            }
                          }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'agent':
        const result = stepResults.find((r) => r.stepId === currentStep.id);
        return (
          <div className="space-y-4">
            {isExecuting ? (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Agent {currentStep.agentId} is processing...</span>
              </div>
            ) : result ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {result.data as string}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                Click "Next" to execute this agent step.
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Scenario Summary</h4>
              <div className="space-y-2 text-sm">
                {stepResults.map((result) => (
                  <div key={result.stepId} className="border-l-2 border-primary pl-3">
                    <div className="font-medium">{result.stepTitle}</div>
                    <div className="text-muted-foreground mt-1">
                      {typeof result.data === 'string' && result.data.length > 100
                        ? result.data.slice(0, 100) + '...'
                        : (result.data as string)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Review the results above. Click "Complete" to finish this scenario.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{template.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span>
              Step {currentStepIndex + 1} of {template.steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              {renderStepIcon(currentStep.type)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{currentStep.title}</h3>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
          </div>

          <div className="mt-6">{renderStepContent()}</div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || isExecuting}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
