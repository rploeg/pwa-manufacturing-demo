import { useState } from 'react';
import {
  BookOpen,
  Video,
  Image,
  FileText,
  CheckCircle,
  Sparkles,
  Mic,
  Search,
  Lightbulb,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface WorkInstruction {
  id: string;
  title: string;
  partNumber: string;
  revision: string;
  type: 'assembly' | 'inspection' | 'setup' | 'maintenance';
  media: Array<{ type: 'video' | 'image' | 'pdf'; url: string; title: string }>;
  steps: Array<{ step: number; instruction: string; image?: string; completed?: boolean }>;
  estimatedTime: string;
}

export function WorkInstructionsPage() {
  const { toast } = useToast();
  const [selectedInstruction, setSelectedInstruction] = useState<WorkInstruction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [aiAssistanceVisible, setAiAssistanceVisible] = useState(false);
  const [voiceGuidanceActive, setVoiceGuidanceActive] = useState(false);
  const [aiTips, setAiTips] = useState<{ [key: number]: string }>({});
  const [instructions] = useState<WorkInstruction[]>([
    {
      id: 'wi-001',
      title: 'Airfryer Heating Element Assembly',
      partNumber: 'AF-2000-HE',
      revision: 'Rev 3.2',
      type: 'assembly',
      estimatedTime: '12 minutes',
      media: [
        { type: 'video', url: '#', title: 'Assembly Overview' },
        { type: 'pdf', url: '#', title: 'Technical Drawing' },
      ],
      steps: [
        {
          step: 1,
          instruction: 'Verify all components are present using checklist',
          completed: false,
        },
        {
          step: 2,
          instruction: 'Apply thermal paste to heating element base (0.5mm thickness)',
          image: 'thermal-paste',
          completed: false,
        },
        {
          step: 3,
          instruction: 'Position heating element in housing, align with mounting holes',
          completed: false,
        },
        { step: 4, instruction: 'Secure with 4x M4 screws, torque to 2.5 Nm', completed: false },
        { step: 5, instruction: 'Connect power cable (red) to terminal A', completed: false },
        {
          step: 6,
          instruction: 'Connect ground wire (green/yellow) to terminal GND',
          completed: false,
        },
        { step: 7, instruction: 'Perform continuity test - must read < 1 Ohm', completed: false },
        { step: 8, instruction: 'Apply QC sticker and record serial number', completed: false },
      ],
    },
    {
      id: 'wi-002',
      title: 'Coffee Machine Water Tank Installation',
      partNumber: 'CM-500-WT',
      revision: 'Rev 2.1',
      type: 'assembly',
      estimatedTime: '8 minutes',
      media: [{ type: 'video', url: '#', title: 'Installation Guide' }],
      steps: [
        { step: 1, instruction: 'Inspect water tank for cracks or defects', completed: false },
        { step: 2, instruction: 'Install rubber seal on tank inlet', completed: false },
        { step: 3, instruction: 'Align tank with housing guides', completed: false },
        { step: 4, instruction: 'Press until click is heard', completed: false },
        { step: 5, instruction: 'Test release mechanism', completed: false },
      ],
    },
    {
      id: 'wi-003',
      title: 'Quality Inspection - Pressure Test',
      partNumber: 'QC-PT-001',
      revision: 'Rev 1.5',
      type: 'inspection',
      estimatedTime: '5 minutes',
      media: [{ type: 'image', url: '#', title: 'Setup Diagram' }],
      steps: [
        { step: 1, instruction: 'Connect unit to pressure test fixture', completed: false },
        { step: 2, instruction: 'Set pressure to 12 bar', completed: false },
        { step: 3, instruction: 'Hold for 60 seconds', completed: false },
        { step: 4, instruction: 'Check for leaks - no drops allowed', completed: false },
        { step: 5, instruction: 'Record result in system', completed: false },
      ],
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assembly':
        return 'bg-blue-50 text-blue-700';
      case 'inspection':
        return 'bg-purple-50 text-purple-700';
      case 'setup':
        return 'bg-green-50 text-green-700';
      case 'maintenance':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
    }
  };

  // AI Functions
  const getAiTip = (stepNumber: number) => {
    const tips: { [key: number]: string } = {
      1: 'AI Tip: Use the digital checklist feature to automatically verify components with computer vision.',
      2: 'AI Tip: Optimal thermal paste thickness is 0.5mm. AI vision can measure and verify thickness in real-time.',
      3: 'AI Tip: Common mistake: Check alignment marks before positioning. AI can detect misalignment.',
      4: 'AI Tip: Use the torque wrench sensor connected to the system for automatic recording.',
      5: 'AI Tip: Color-coded cables reduce connection errors by 87%. Double-check terminal labels.',
      6: 'AI Tip: Ground connection is critical for safety. System will verify continuity automatically.',
      7: 'AI Tip: Expected reading: 0.1-0.8 Ohms. Values outside this range indicate issues.',
      8: 'AI Tip: Serial number automatically recorded via barcode scanner. Manual entry as backup.',
    };
    return tips[stepNumber] || 'AI Tip: Follow the instructions carefully and verify each step.';
  };

  const handleVoiceGuidance = () => {
    setVoiceGuidanceActive(!voiceGuidanceActive);
    toast({
      title: voiceGuidanceActive ? 'Voice Guidance Disabled' : 'Voice Guidance Enabled',
      description: voiceGuidanceActive
        ? 'AI voice assistance has been turned off'
        : 'AI will now provide voice guidance for each step',
    });
  };

  const handleAiAssist = (stepNumber: number) => {
    setActiveStep(stepNumber);
    setAiAssistanceVisible(true);
    setAiTips((prev) => ({
      ...prev,
      [stepNumber]: getAiTip(stepNumber),
    }));
    toast({
      title: 'AI Assistant',
      description: 'Getting contextual help for this step...',
    });
  };

  const handleSmartSearch = (query: string) => {
    setSearchQuery(query);
    // Simulate AI-powered search
    toast({
      title: 'AI Search',
      description: `Searching work instructions for: "${query}"`,
    });
  };

  const filteredInstructions = searchQuery
    ? instructions.filter(
        (inst) =>
          inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : instructions;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Work Instructions</h1>
        <p className="text-muted-foreground">
          AI-powered step-by-step assembly and inspection guides
        </p>
      </div>

      {/* AI Toolbar */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant Active</h3>
              <p className="text-xs text-muted-foreground">
                Get contextual help, voice guidance, and smart recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={voiceGuidanceActive ? 'default' : 'outline'}
              size="sm"
              onClick={handleVoiceGuidance}
            >
              <Mic className="w-4 h-4 mr-2" />
              Voice Guide
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({
                  title: 'AI Error Detection',
                  description: 'Real-time error detection is monitoring your progress',
                })
              }
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Error Detection
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="AI-powered search: Try 'heating element' or 'pressure test'..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-versuni-primary"
            value={searchQuery}
            onChange={(e) => handleSmartSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredInstructions.map((instruction) => (
            <div
              key={instruction.id}
              onClick={() => setSelectedInstruction(instruction)}
              className={`bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedInstruction?.id === instruction.id ? 'ring-2 ring-versuni-primary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 text-sm">{instruction.title}</h3>
                  <div className="text-xs text-muted-foreground mb-2">
                    {instruction.partNumber} • {instruction.revision}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor(instruction.type)}`}
                    >
                      {instruction.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ⏱️ {instruction.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instruction Detail */}
        <div className="lg:col-span-2">
          {selectedInstruction ? (
            <div className="bg-card rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold mb-2">{selectedInstruction.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedInstruction.partNumber}</span>
                  <span>•</span>
                  <span>{selectedInstruction.revision}</span>
                  <span>•</span>
                  <span>⏱️ {selectedInstruction.estimatedTime}</span>
                </div>

                {/* Media Resources */}
                {selectedInstruction.media.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedInstruction.media.map((media, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-accent rounded-md hover:bg-accent/80 text-sm"
                      >
                        {getMediaIcon(media.type)}
                        {media.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Steps */}
              <div className="p-6">
                <h3 className="font-semibold mb-4">Steps</h3>
                <div className="space-y-4">
                  {selectedInstruction.steps.map((step) => (
                    <div key={step.step} className="space-y-2">
                      <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-versuni-primary text-white font-bold text-sm flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{step.instruction}</p>
                          {step.image && (
                            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                              <Image className="w-3 h-3" />
                              See reference image
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAiAssist(step.step)}
                            className="h-8 px-2"
                          >
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                          </Button>
                          <button className="p-2 hover:bg-background rounded-md">
                            {step.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* AI Tips - Show when assistance is requested */}
                      {aiAssistanceVisible && activeStep === step.step && aiTips[step.step] && (
                        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">AI Assistant</h4>
                              <p className="text-sm text-muted-foreground">{aiTips[step.step]}</p>
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs text-muted-foreground">
                                  Was this helpful?
                                </span>
                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
                    Complete All Steps
                  </button>
                  <button className="px-4 py-2 border rounded-md hover:bg-accent">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border p-12 text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a work instruction to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
