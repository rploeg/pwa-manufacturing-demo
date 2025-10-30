import { useState, useRef, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  MessageSquare,
  ClipboardList,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { handoverService } from '@/data/clients/handover';

interface ShiftIssue {
  id: string;
  equipment: string;
  description: string;
  status: 'open' | 'resolved' | 'in-progress';
  priority: 'high' | 'medium' | 'low';
}

interface ShiftTask {
  id: string;
  description: string;
  completed: boolean;
  assignedTo?: string;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';
type ProcessingState = 'idle' | 'transcribing' | 'summarizing' | 'complete';

export function ShiftHandoverPage() {
  const { toast } = useToast();
  const [currentShift] = useState('Day Shift (06:00-14:00)');
  const [nextShift] = useState('Afternoon Shift (14:00-22:00)');

  // Voice recording state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [issues] = useState<ShiftIssue[]>([
    {
      id: 'ISS-001',
      equipment: 'Filler-3',
      description: 'Intermittent seal mechanism jam - requires monitoring',
      status: 'in-progress',
      priority: 'high',
    },
    {
      id: 'ISS-002',
      equipment: 'Conveyor-B2',
      description: 'Belt tension adjusted, running smoothly now',
      status: 'resolved',
      priority: 'medium',
    },
    {
      id: 'ISS-003',
      equipment: 'Quality Station 4',
      description: 'Vision system calibration needed - scheduled for tonight',
      status: 'open',
      priority: 'low',
    },
  ]);

  const [tasks] = useState<ShiftTask[]>([
    { id: 'T-001', description: 'Complete PM checklist for Line-A', completed: true },
    { id: 'T-002', description: 'Update production log with reject counts', completed: true },
    {
      id: 'T-003',
      description: 'Brief maintenance on Filler-3 issue',
      completed: false,
      assignedTo: 'Next Shift Lead',
    },
    { id: 'T-004', description: 'Stock check on packaging materials', completed: true },
  ]);

  const [handoverNotes, setHandoverNotes] = useState(
    'Line-A ran at 95% OEE today. Watch Filler-3 closely - maintenance is aware. Raw material delivery expected at 15:00, coordinate with warehouse. Night shift to complete calibration on QS-4.'
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      toast({
        title: 'Recording started',
        description: 'Speak your shift handover notes',
      });
    } catch (error) {
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access to record handover notes',
        variant: 'destructive',
      });
      console.error('Error accessing microphone:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState('idle');
    setDuration(0);
    setProcessingState('idle');
    chunksRef.current = [];
  };

  const processRecording = async () => {
    if (!audioBlob) return;

    setProcessingState('transcribing');

    try {
      const uploadedUrl = await handoverService.uploadAudio(audioBlob, {
        lineId: 'line-a',
        shift: getCurrentShift(),
      });

      const transcriptResult = await handoverService.transcribe(uploadedUrl);
      setHandoverNotes((prev) => prev + '\n\n[Voice Note]: ' + transcriptResult);

      setProcessingState('complete');

      toast({
        title: 'Voice note transcribed',
        description: 'Transcript added to handover notes',
      });

      // Auto-reset after 2 seconds
      setTimeout(() => {
        discardRecording();
      }, 2000);
    } catch (error) {
      toast({
        title: 'Processing failed',
        description: 'Could not process the recording. Please try again.',
        variant: 'destructive',
      });
      setProcessingState('idle');
      console.error('Processing error:', error);
    }
  };

  const getCurrentShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'morning';
    if (hour >= 14 && hour < 22) return 'afternoon';
    return 'night';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-50 text-green-700';
      case 'in-progress':
        return 'bg-orange-50 text-orange-700';
      case 'open':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Shift Handover</h1>
        <p className="text-muted-foreground">Transfer critical information between shifts</p>
      </div>

      {/* Shift Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-versuni-primary" />
            <span className="text-sm text-muted-foreground">Current Shift</span>
          </div>
          <div className="text-lg font-bold">{currentShift}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Next Shift</span>
          </div>
          <div className="text-lg font-bold">{nextShift}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Handover Status</span>
          </div>
          <div className="text-lg font-bold text-green-600">Ready</div>
        </div>
      </div>

      {/* Open Issues */}
      <div className="bg-card rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Issues & Concerns
          </h2>
        </div>
        <div className="divide-y">
          {issues.map((issue) => (
            <div key={issue.id} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{issue.equipment}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(issue.status)}`}
                    >
                      {issue.status}
                    </span>
                    <span className={`text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Checklist */}
      <div className="bg-card rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Shift Tasks
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.description}
                  </p>
                  {task.assignedTo && (
                    <p className="text-xs text-muted-foreground mt-1">→ {task.assignedTo}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Completed: {tasks.filter((t) => t.completed).length} / {tasks.length}
          </div>
        </div>
      </div>

      {/* Handover Notes */}
      <div className="bg-card rounded-lg border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Handover Notes
          </h2>
        </div>
        <div className="p-4">
          <textarea
            value={handoverNotes}
            onChange={(e) => setHandoverNotes(e.target.value)}
            className="w-full h-32 p-3 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-versuni-primary"
            placeholder="Add important notes for the next shift..."
          />

          {/* Voice Recording Section */}
          <div className="mt-4 p-4 border rounded-lg bg-accent/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Voice Notes</span>
              {recordingState !== 'idle' && (
                <span className="text-xs text-muted-foreground">{formatDuration(duration)}</span>
              )}
            </div>

            {recordingState === 'idle' && (
              <Button onClick={startRecording} variant="outline" className="w-full gap-2">
                <Mic className="w-4 h-4" />
                Start Voice Recording
              </Button>
            )}

            {recordingState === 'recording' && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-red-500 py-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Recording...</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={pauseRecording} variant="outline" size="sm" className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            )}

            {recordingState === 'paused' && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-500 py-2">
                  <Pause className="w-4 h-4" />
                  <span className="text-sm font-semibold">Paused</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={resumeRecording} size="sm" className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            )}

            {recordingState === 'stopped' && (
              <div className="space-y-3">
                {audioUrl && <audio src={audioUrl} controls className="w-full" />}
                <div className="flex gap-2">
                  <Button onClick={discardRecording} variant="outline" size="sm" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Discard
                  </Button>
                  <Button
                    onClick={processRecording}
                    size="sm"
                    className="flex-1"
                    disabled={processingState !== 'idle'}
                  >
                    {processingState === 'idle' && 'Add to Notes'}
                    {processingState === 'transcribing' && (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Transcribing...
                      </>
                    )}
                    {processingState === 'complete' && (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Done!
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Button 
              className="flex-1"
              onClick={() => alert('Shift handover completed successfully! All notes and tasks have been logged.')}
            >
              Complete Handover
            </Button>
          </div>
        </div>
      </div>

      {/* Previous Handovers */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Previous Handovers</h2>
        </div>
        <div className="divide-y">
          <div className="p-4 hover:bg-accent/50 cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Night Shift → Day Shift</span>
              <span className="text-sm text-muted-foreground">Today, 06:00</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Production targets met. Line-B minor downtime resolved...
            </p>
          </div>
          <div className="p-4 hover:bg-accent/50 cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Afternoon Shift → Night Shift</span>
              <span className="text-sm text-muted-foreground">Yesterday, 22:00</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Quality inspection passed. Material restocked for tomorrow...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
