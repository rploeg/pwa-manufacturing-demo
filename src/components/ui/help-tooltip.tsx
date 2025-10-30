import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface HelpTooltipProps {
  content: string | ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  maxWidth?: number;
}

export function HelpTooltip({ content, side = 'top', maxWidth = 300 }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} style={{ maxWidth: `${maxWidth}px` }}>
          <div className="text-sm">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Pre-built help tooltips for common scenarios
export const HelpTooltips = {
  OEE: (
    <HelpTooltip content="OEE (Overall Equipment Effectiveness) measures manufacturing productivity. It's calculated as: Availability × Performance × Quality. Target is typically 85%+" />
  ),
  
  SMED: (
    <HelpTooltip content="SMED (Single-Minute Exchange of Die) is a system for reducing changeover time. The goal is to reduce setup time to single-digit minutes (under 10 minutes)." />
  ),
  
  Availability: (
    <HelpTooltip content="Availability = (Operating Time / Planned Production Time) × 100. Measures the percentage of scheduled time that equipment is actually running." />
  ),
  
  Performance: (
    <HelpTooltip content="Performance = (Actual Output / Theoretical Maximum Output) × 100. Measures how close equipment runs to its maximum speed." />
  ),
  
  Quality: (
    <HelpTooltip content="Quality = (Good Units / Total Units Produced) × 100. Measures the percentage of products that meet quality standards." />
  ),
  
  CycleTime: (
    <HelpTooltip content="Cycle Time is the total time from start to finish of a process. Target Cycle Time = Available Time / Customer Demand." />
  ),
  
  TaktTime: (
    <HelpTooltip content="Takt Time = Available Production Time / Customer Demand. It's the pace of production needed to meet customer demand." />
  ),
  
  RootCause: (
    <HelpTooltip content="Root Cause Analysis (RCA) identifies the fundamental cause of a problem. The '5 Whys' method is commonly used." />
  ),
  
  PredictiveMaintenance: (
    <HelpTooltip content="Predictive Maintenance uses AI/ML to predict equipment failures before they occur, reducing unplanned downtime." />
  ),
  
  DigitalTwin: (
    <HelpTooltip content="A Digital Twin is a virtual replica of physical equipment that mirrors real-time status, enabling monitoring and simulation." />
  ),
};
