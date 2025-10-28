import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { handoverService } from '@/data/clients/handover';
import type { HandoverNote, ActionItem } from '@/data/types';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';
type ProcessingState = 'idle' | 'transcribing' | 'summarizing' | 'complete';

export function HandoverPage() {
  const { toast } = useToast();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [duration, setDuration] = useState(0);
  const [lineId, setLineId] = useState('line-a');
  const [recentNotes, setRecentNotes] = useState<HandoverNote[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load recent notes on mount
  useEffect(() => {
    loadRecentNotes();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const loadRecentNotes = async () => {
    try {
      const notes = await handoverService.getNotes({ lineId });
      setRecentNotes(notes.slice(0, 5)); // Show last 5
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

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

      // Start timer
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
    setTranscript('');
    setSummary('');
    setActionItems([]);
    setProcessingState('idle');
    chunksRef.current = [];
  };

  const processRecording = async () => {
    if (!audioBlob) return;

    setProcessingState('transcribing');

    try {
      // Step 1: Upload audio
      const uploadedUrl = await handoverService.uploadAudio(audioBlob, {
        lineId,
        shift: getCurrentShift(),
      });
      
      // Step 2: Transcribe
      const transcriptResult = await handoverService.transcribe(uploadedUrl);
      setTranscript(transcriptResult);
      
      toast({
        title: 'Transcription complete',
        description: 'Generating summary...',
      });

      // Step 3: Summarize
      setProcessingState('summarizing');
      const summaryResult = await handoverService.summarize(transcriptResult, {
        lineId,
        shift: getCurrentShift(),
      });
      setSummary(summaryResult.summary);
      setActionItems(summaryResult.actionItems);

      // Step 4: Save note
      await handoverService.saveNote({
        shift: getCurrentShift(),
        lineId,
        lineName: lineId.toUpperCase(),
        authorId: 'current-user',
        authorName: 'Current User',
        createdAt: new Date(),
        audioUrl: uploadedUrl,
        audioDuration: duration,
        transcript: transcriptResult,
        summary: summaryResult.summary,
        actionItems: summaryResult.actionItems,
        tags: [],
        status: 'published',
      });

      setProcessingState('complete');
      loadRecentNotes();

      toast({
        title: 'Handover note saved',
        description: 'Your shift handover has been processed and saved',
      });
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

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Shift Handover</h1>
        <p className="text-muted-foreground">
          Record voice notes for shift handover with AI-powered transcription and summarization
        </p>
      </div>

      {/* Line Selection */}
      <Card className="p-4 mb-6">
        <label className="block text-sm font-medium mb-2">Production Line</label>
        <select
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
          className="w-full md:w-64 border rounded-md p-2 bg-background"
          disabled={recordingState !== 'idle'}
        >
          <option value="line-a">Line-A</option>
          <option value="line-b">Line-B</option>
          <option value="line-c">Line-C</option>
        </select>
        <p className="text-xs text-muted-foreground mt-2">
          Current shift: <span className="capitalize">{getCurrentShift()}</span>
        </p>
      </Card>

      {/* Recording Controls */}
      <Card className="p-6 mb-6">
        <div className="text-center">
          {/* Recording State Indicator */}
          {recordingState === 'recording' && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-semibold">Recording...</span>
              </div>
              <div className="text-3xl font-mono font-bold mt-2">
                {formatDuration(duration)}
              </div>
            </div>
          )}

          {recordingState === 'paused' && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 text-amber-500">
                <Pause className="w-5 h-5" />
                <span className="font-semibold">Paused</span>
              </div>
              <div className="text-3xl font-mono font-bold mt-2">
                {formatDuration(duration)}
              </div>
            </div>
          )}

          {recordingState === 'stopped' && audioUrl && (
            <div className="mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="font-semibold">Recording complete</p>
              <div className="text-2xl font-mono mt-2">{formatDuration(duration)}</div>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full mt-4"
              />
            </div>
          )}

          {recordingState === 'idle' && (
            <div className="mb-4">
              <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-semibold">Ready to record</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click the button below to start recording
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {recordingState === 'idle' && (
              <Button
                onClick={startRecording}
                size="lg"
                className="gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            )}

            {recordingState === 'recording' && (
              <>
                <Button onClick={pauseRecording} variant="outline" size="lg">
                  <Pause className="w-5 h-5" />
                </Button>
                <Button onClick={stopRecording} variant="destructive" size="lg">
                  <Square className="w-5 h-5" />
                </Button>
              </>
            )}

            {recordingState === 'paused' && (
              <>
                <Button onClick={resumeRecording} size="lg">
                  <Play className="w-5 h-5" />
                </Button>
                <Button onClick={stopRecording} variant="destructive" size="lg">
                  <Square className="w-5 h-5" />
                </Button>
              </>
            )}

            {recordingState === 'stopped' && (
              <>
                <Button onClick={discardRecording} variant="outline" size="lg">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Discard
                </Button>
                <Button
                  onClick={processRecording}
                  size="lg"
                  disabled={processingState !== 'idle'}
                >
                  {processingState === 'idle' && (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Process & Save
                    </>
                  )}
                  {processingState !== 'idle' && (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Processing Results */}
      {(transcript || summary) && (
        <div className="space-y-4 mb-6">
          {transcript && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Transcript</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {transcript}
              </p>
            </Card>
          )}

          {summary && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </Card>
          )}

          {actionItems.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Action Items</h3>
              <ul className="space-y-2">
                {actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item.description}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Recent Handover Notes */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Handover Notes</h2>
        {recentNotes.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No handover notes yet. Record your first one above!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <Card key={note.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">
                      {note.lineId.toUpperCase()} - {note.shift}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(note.createdAt)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.summary}
                </p>
                {note.actionItems.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3" />
                    {note.actionItems.length} action item(s)
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
