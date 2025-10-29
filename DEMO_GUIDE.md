# Versuni Frontline - Complete Demo Guide

This comprehensive guide provides step-by-step walkthroughs for ALL features and scenarios in the Versuni Frontline PWA manufacturing solution.

## 📋 Table of Contents

### Core Features
- [Home Dashboard](#home-dashboard)
- [AI Agents (Multi-Agent Chat)](#ai-agents-multi-agent-chat)

### Operations (4 scenarios)
- [Digital Twin](#digital-twin)
- [Work Instructions](#work-instructions)
- [Shift Handover](#shift-handover)
- [Safety Analytics](#safety-analytics)

### Production (5 scenarios)
- [Production Planning (Intelligent Scheduling)](#production-planning-intelligent-scheduling)
- [Changeover Optimization (SMED)](#changeover-optimization-smed)
- [Quality Analytics](#quality-analytics)
- [Traceability](#traceability)
- [Yield Prediction & Loss Prevention](#yield-prediction--loss-prevention)

### Maintenance (5 scenarios)
- [Maintenance Management](#maintenance-management)
- [Predictive Maintenance](#predictive-maintenance)
- [Maintenance Cost Optimization](#maintenance-cost-optimization)
- [Root Cause Analysis](#root-cause-analysis)
- [Tool Management](#tool-management)

### Performance (5 scenarios)
- [Performance Dashboard](#performance-dashboard)
- [OEE Coaching](#oee-coaching)
- [Line Balancing AI](#line-balancing-ai)
- [Energy Management](#energy-management)
- [AI Optimization](#ai-optimization)

### People (1 scenario)
- [Skills Matrix (Operator Analytics)](#skills-matrix-operator-analytics)

### AI & Insights (2 scenarios)
- [Knowledge Base](#knowledge-base)
- [AI Scenarios Dashboard](#ai-scenarios-dashboard)

### System (2 features)
- [Edge Devices](#edge-devices)
- [Settings](#settings)

---

## Core Features

## Home Dashboard

**Route:** `/home`  
**Navigation:** Root level - Home icon  
**Feature Flag:** None (always visible)

### What It Does

Central hub providing quick access to all features, recent alerts, key metrics, and AI-powered recommendations. Shows real-time production status and important notifications.

### Demo Flow

1. Navigate to home page
2. Show featured AI scenarios with key metrics
3. Point out quick action cards
4. Demonstrate navigation to different modules
5. Show real-time status indicators

### Key Talking Points

- **Single pane of glass** for all frontline operations
- **Role-based views** (Operator, Supervisor, Engineer, Plant Manager)
- **Quick access** to most-used features
- **Real-time updates** from all connected systems

---

## AI Agents (Multi-Agent Chat)

**Route:** `/chat`  
**Navigation:** Root level - Agents  
**Feature Flag:** `multiAgent`

### What It Does

Multi-agent AI assistant system with specialized agents for different domains (Quality, Maintenance, Production, Safety). Agents collaborate to answer questions and provide recommendations.

### Demo Flow

1. Navigate to Agents page
2. Ask a question: "Why is yield down on Line A?"
3. Show multiple agents analyzing the question
4. Agents discuss and provide coordinated response
5. Follow-up with actions or drill into details

### Key Talking Points

- **Specialized agents** for different domains
- **Collaborative problem-solving** between agents
- **Natural language** interface - no training needed
- **Contextual awareness** of plant operations
- **Action recommendations** with reasoning

---

## Operations

## Digital Twin

**Route:** `/twin`  
**Navigation:** Operations → Digital Twin  
**Feature Flag:** `digitalTwin3D`

### What It Does

3D visualization of the manufacturing facility with real-time equipment status, material flows, and performance metrics. Interactive exploration of production lines and workstations.

### Demo Flow

#### Step 1: Overview

1. Navigate to Digital Twin page
2. Show 3D plant layout
3. Highlight active equipment (green) vs idle/issues (yellow/red)
4. Show material flow animations

#### Step 2: Equipment Detail

1. Click on a machine (e.g., CNC Machine)
2. View real-time metrics:
   - OEE: 78%
   - Uptime: 94%
   - Cycle time: 45s
   - Parts produced today: 1,247
3. Show maintenance status and next scheduled service

#### Step 3: Material Flow

1. Switch to Material Flow view
2. Trace product journey from raw material to finished goods
3. Identify bottlenecks and queue times
4. Show WIP (Work in Progress) inventory levels

### Key Talking Points

- **Real-time visibility** of entire plant
- **3D visualization** makes it intuitive
- **Equipment health monitoring** prevents downtime
- **Material tracking** reduces inventory waste
- **Remote monitoring** capability for plant managers

---

## Work Instructions

**Route:** `/work-instructions`  
**Navigation:** Operations → Work Instructions  
**Feature Flag:** `workInstructions`

### What It Does

Digital work instructions with step-by-step procedures, images, videos, and AR overlays. Tracks completion, provides quality checkpoints, and adapts based on operator skill level.

### Demo Flow

#### Step 1: Instruction Library

1. Navigate to Work Instructions
2. Show categorized procedures (Assembly, Quality Check, Maintenance, Setup)
3. Filter by product, line, or operation

#### Step 2: Follow Procedure

1. Select "Gear Assembly - Model X"
2. Step through instructions:
   - Step 1: Retrieve components (with image)
   - Step 2: Apply lubricant (with video)
   - Step 3: Align gears (with AR overlay)
   - Step 4: Torque to spec (with sensor integration)
3. Show quality checkpoints and confirmation buttons

#### Step 3: Adaptive Instructions

1. Show how instructions adapt for:
   - New operator: More detail, slower pace
   - Experienced operator: Summary view only
   - Quality issues: Additional verification steps

### Key Talking Points

- **Paperless operations** improve efficiency
- **Multimedia instructions** (images, videos, AR)
- **Quality gates** built into process
- **Skill-adaptive** content for all levels
- **Version control** ensures current procedures
- **Training mode** for onboarding

---

## Shift Handover

**Route:** `/shift-handover`  
**Navigation:** Operations → Shift Handover  
**Feature Flag:** `shiftHandover`

### What It Does

Structured shift handover with production metrics, issues, actions, and AI-generated summaries. Ensures continuity between shifts and captures tribal knowledge.

### Demo Flow

#### Step 1: Create Handover Report

1. Navigate to Shift Handover
2. Review auto-populated data:
   - Production volume: 1,245 units (98% of target)
   - Quality: 2 defects (0.16%)
   - Downtime: 15 minutes (Machine #3)
   - Safety: No incidents

#### Step 2: Add Manual Updates

1. Add open issues:
   - "Machine #3 bearing vibration - maintenance scheduled"
   - "Material shortage on Batch-X49 - expedited delivery tomorrow"
2. Add completed actions:
   - "Recalibrated sensor on Line B"
   - "Trained new operator on quality procedure"

#### Step 3: AI Summary

1. Click "Generate AI Summary"
2. Review concise handover brief
3. Highlight priority items for incoming shift
4. Send handover report

#### Step 4: Review Historical Handovers

1. View past 7 days of handovers
2. Track recurring issues
3. Identify trends

### Key Talking Points

- **Structured communication** prevents information loss
- **AI summaries** save time
- **Automatic data** from all systems
- **Issue tracking** ensures follow-through
- **Historical analysis** identifies patterns
- **Mobile-friendly** for field use

---

## Safety Analytics

**Route:** `/safety`  
**Navigation:** Operations → Safety  
**Feature Flag:** `safetyAnalytics`

### What It Does

Proactive safety monitoring with incident tracking, near-miss analysis, PPE compliance detection via computer vision, and predictive risk scoring.

### Demo Flow

#### Step 1: Safety Dashboard

1. Navigate to Safety page
2. Show key metrics:
   - Days since last incident: 47
   - Near misses this month: 3
   - PPE compliance: 98.5%
   - Safety audits passed: 12/12

#### Step 2: Incident Tracking

1. Click on recent incident
2. Review details:
   - Date, time, location
   - People involved
   - Root cause analysis
   - Corrective actions
   - Status: Closed

#### Step 3: Near-Miss Analysis

1. View near-miss log
2. Show AI pattern detection:
   - "3 near misses near Machine #7 in past 30 days"
   - "Recommendation: Review safety barriers and signage"
3. Track corrective actions

#### Step 4: PPE Compliance

1. Show computer vision monitoring
2. Real-time alerts for missing PPE
3. Compliance by area and shift
4. Trend over time

### Key Talking Points

- **Proactive safety** vs reactive
- **Near-miss tracking** prevents incidents
- **AI-powered** risk prediction
- **Computer vision** for PPE compliance
- **Root cause analysis** for continuous improvement
- **Regulatory compliance** reporting

---

## Production

## Production Planning (Intelligent Scheduling)

**Route:** `/planning`  
**Navigation:** Production → Planning  
**Feature Flag:** `productionPlanning`

### What It Does

Multi-constraint optimization engine that balances skills, materials, deadlines, and changeover times. Generates what-if scenarios and detects scheduling conflicts.

### Demo Flow

#### Step 1: View Current Schedule

1. Navigate to Production Planning page
2. Show the Gantt chart with 5 scheduled jobs
3. Point out color coding:
   - Green: On schedule
   - Yellow: Tight deadline
   - Red: Behind schedule or conflicts

#### Step 2: Run Schedule Optimization

1. Click **Optimize Schedule** button
2. AI analyzes constraints:
   - Operator skills and availability
   - Material stock levels
   - Machine capabilities
   - Changeover times between products
3. Show optimized sequence with efficiency score (85%)

#### Step 3: What-If Scenarios

1. Click **What-If Scenarios** tab
2. Select **Rush Order** scenario
3. Show AI recommendations:
   - Which job to delay
   - Resource reallocation
   - Expected completion time
4. Try other scenarios:
   - **Machine Breakdown**: Alternative routing
   - **Material Shortage**: Substitute materials
   - **Low Yield**: Buffer adjustments

#### Step 4: Conflict Detection

1. Click **Conflicts** tab
2. Show detected issues:
   - Operator lacks certification for Job-3
   - Material delivery late for Job-5
   - Changeover time underestimated between Job-2 and Job-3

### Key Talking Points

- **20-30% better schedule adherence** with AI optimization
- **Automatic conflict detection** prevents execution issues
- **What-if planning** helps with contingency scenarios
- **Multi-constraint balancing** (skills, materials, time, quality)
- **ROI in 4 months** through better resource utilization

---

## Changeover Optimization (SMED)

**Route:** `/changeover`  
**Navigation:** Production → Changeover  
**Feature Flag:** `smedChangeover`

### What It Does

SMED (Single-Minute Exchange of Die) analysis with AI-powered recommendations to reduce changeover times between product runs. Tracks best practices and operator performance.

### Demo Flow

#### Step 1: Changeover History

1. Navigate to Changeover Optimization page
2. Show recent changeovers:
   - Product A → Product B: 32 minutes (Target: 25 min)
   - Product B → Product C: 18 minutes (Target: 20 min - BEAT TARGET!)
   - Product C → Product A: 45 minutes (Target: 30 min - NEEDS IMPROVEMENT)

#### Step 2: Detailed Analysis

1. Click on longest changeover (45 min)
2. View step-by-step breakdown:
   - Tool removal: 8 minutes
   - Cleaning: 12 minutes ⚠️ (Target: 6 min)
   - Tool installation: 10 minutes
   - Calibration: 15 minutes ⚠️ (Target: 8 min)

#### Step 3: AI Recommendations

Show AI suggestions:
- "Prepare tools in parallel during production run" → Save 5 minutes
- "Use quick-clean solution on Station 2" → Save 4 minutes
- "Pre-calibrate tools offline" → Save 6 minutes
- **Total potential savings: 15 minutes (33% reduction)**

#### Step 4: Best Practices

1. View best changeover for this transition (22 minutes by Shift B)
2. Show video snippets of key techniques
3. Assign training to slower operators

### Key Talking Points

- **30-50% reduction in changeover time**
- **SMED methodology** with AI insights
- **Best practice sharing** across shifts
- **Video capture** of excellent changeovers
- **Quick ROI** through increased production time
- **Operator coaching** for skill development

---

## Quality Analytics

**Route:** `/quality`  
**Navigation:** Production → Quality  
**Feature Flag:** `qualityInsights`

### What It Does

Real-time quality monitoring with defect detection, root cause analysis, statistical process control (SPC), and AI-powered quality predictions.

### Demo Flow

#### Step 1: Quality Dashboard

1. Navigate to Quality page
2. Show metrics:
   - First Pass Yield: 96.2%
   - Defect Rate: 3.8%
   - Rework: 2.1%
   - Scrap: 1.7%
   - CPK: 1.67

#### Step 2: Defect Pareto

1. View top defect categories:
   - Dimensional variance: 45%
   - Surface finish: 28%
   - Missing component: 15%
   - Assembly error: 12%

#### Step 3: SPC Charts

1. Show control charts for critical dimensions
2. Identify out-of-control points
3. Show trend toward upper control limit
4. AI alert: "Process drift detected - adjustment recommended"

#### Step 4: Root Cause Analysis

1. Drill into dimensional variance spike
2. AI correlates with:
   - Material batch change
   - Temperature fluctuation
   - Tool wear on Machine #3
3. Show recommended corrective actions

### Key Talking Points

- **Real-time quality monitoring** catches issues early
- **Statistical process control** prevents defects
- **AI root cause analysis** speeds resolution
- **Predictive quality** alerts before defects occur
- **Cost savings** through reduced rework and scrap

---

## Traceability

**Route:** `/traceability`  
**Navigation:** Production → Traceability  
**Feature Flag:** `traceability`

### What It Does

End-to-end traceability from raw materials to finished goods. Tracks every operation, operator, machine, material batch, and quality check. Enables rapid recall analysis.

### Demo Flow

#### Step 1: Product Search

1. Navigate to Traceability page
2. Search by serial number (e.g., "SN-12345")
3. Show complete product history

#### Step 2: Manufacturing Journey

View genealogy:
- **Raw Materials:**
  - Steel coil: Batch-M7234 (Supplier A, received 10/15)
  - Plastic housing: Batch-P9821 (Supplier B, received 10/18)
- **Operations:**
  - Stamping: Machine #12, Operator John, 10/20 08:15
  - Machining: Machine #3, Operator Maria, 10/20 09:30
  - Assembly: Station A, Operator David, 10/20 11:45
  - Testing: Station T2, Operator Sarah, 10/20 13:20
- **Quality Checks:**
  - Visual inspection: PASS
  - Dimensional check: PASS (0.02mm tolerance)
  - Functional test: PASS
  - Final inspection: PASS

#### Step 3: Batch Analysis

1. Click on Material Batch-M7234
2. Show all products using this batch (2,450 units)
3. Check quality performance: 98.5% FPY
4. Identify any defect patterns

#### Step 4: Recall Simulation

1. Simulate recall scenario: "Supplier A steel issue"
2. Instantly identify affected products (2,450 units)
3. Show customers, locations, and lot numbers
4. Generate recall report

### Key Talking Points

- **Complete traceability** in seconds (vs hours/days)
- **Rapid recall** response protects brand
- **Regulatory compliance** (ISO, FDA, etc.)
- **Supplier quality** tracking
- **Process optimization** insights from data

---

## Yield Prediction & Loss Prevention

**Route:** `/yield-prediction`  
**Navigation:** Production → Yield Prediction  
**Feature Flag:** `yieldPrediction`

### What It Does

AI-powered yield forecasting with real-time loss prevention and material batch quality scoring. Predicts production yield based on historical data, process parameters, and material quality.

### Demo Flow

#### Step 1: View Live Prediction

1. Navigate to Yield Prediction page
2. Click **Live Prediction** tab
3. Show key metrics:
   - **Current Yield**: 85.2% (actual production)
   - **Predicted Yield**: 87.4% (AI forecast)
   - **Target Yield**: 90.0% (goal)
   - **Confidence**: 87% (prediction reliability)

#### Step 2: Review Active Alerts

Scroll down to see real-time alerts:

- 🔴 **Material viscosity deviation** - High impact, immediate action required
- 🟡 **Process temperature fluctuation** - Medium impact, monitor closely
- 🟢 **Preventive check recommendation** - Low priority

#### Step 3: Check AI Recommendations

Show the AI recommendations panel:

- "Reduce mixing speed by 15% to improve homogeneity"
- "Switch to alternative material supplier for Batch-X47"
- "Schedule preventive calibration for Sensor-T3"

#### Step 4: Analyze 7-Day Trends

1. Click **Analytics** tab
2. Show the yield trend chart over 7 days
3. Point out:
   - Steady improvement from 82% to 85%
   - Dip on Day 4 due to material issue
   - Top loss causes breakdown (Material Quality 35%, Process Drift 28%, etc.)

#### Step 5: Material Batch Tracking

1. Click **Materials** tab
2. Show best and worst performing batches
3. Click on **Batch-X47** to see quality scores:
   - Moisture: 85/100 (good)
   - Purity: 72/100 (needs attention)
   - Viscosity: 91/100 (excellent)
   - pH Level: 88/100 (good)
   - **Overall Score**: 84/100

### Key Talking Points

- **15% reduction in material waste** through early quality detection
- **$50K-200K annual savings** from loss prevention
- **87% prediction accuracy** with machine learning
- **Real-time alerts** prevent issues before they impact production
- **Material traceability** helps identify supplier quality patterns

---

## Maintenance

## Maintenance Management

**Route:** `/maintenance`  
**Navigation:** Maintenance → Maintenance  
**Feature Flag:** `predictiveMaintenance`

### What It Does

Centralized maintenance management with work orders, equipment history, spare parts inventory, and maintenance KPIs. Tracks corrective, preventive, and predictive maintenance activities.

### Demo Flow

#### Step 1: Maintenance Dashboard

1. Navigate to Maintenance page
2. Show key metrics:
   - Open work orders: 12
   - Overdue: 2
   - Completed this month: 47
   - Average MTTR: 2.3 hours
   - MTBF: 320 hours

#### Step 2: Work Order Management

1. View active work orders
2. Filter by priority, type, equipment
3. Select work order "WO-1234 - CNC Machine bearing"
4. Show details:
   - Equipment, issue description
   - Assigned technician, priority
   - Required parts and tools
   - Estimated vs actual time
5. Update status and add notes
6. Close work order

#### Step 3: Equipment History

1. Click on CNC Machine #1
2. View complete maintenance history
3. Show failure patterns and intervals
4. Track spare parts consumption
5. Calculate total cost of ownership

### Key Talking Points

- **Centralized work order** management
- **Equipment health tracking** improves reliability
- **Maintenance KPIs** drive continuous improvement
- **Mobile access** for field technicians
- **Compliance documentation** for audits

---

## Predictive Maintenance

**Route:** `/predictive`  
**Navigation:** Maintenance → Predictive  
**Feature Flag:** `predictiveMaintenance`

### What It Does

AI/ML-powered predictive maintenance using sensor data, vibration analysis, thermal imaging, and failure pattern recognition. Predicts equipment failures before they occur.

### Demo Flow

#### Step 1: Equipment Health Overview

1. Navigate to Predictive Maintenance page
2. Show equipment health scores (0-100):
   - CNC Machine #1: 92 (Healthy)
   - Robot Arm #2: 78 (Monitor)
   - Conveyor #5: 45 (Action Required ⚠️)
3. View prioritized action list

#### Step 2: Failure Predictions

1. Click on Conveyor #5
2. Show AI prediction:
   - Failure probability: 68%
   - Time to failure: 5-7 days
   - Predicted failure mode: Motor bearing
   - Confidence: 84%

#### Step 3: Sensor Analysis

1. View real-time sensor data:
   - Vibration: 8.2 mm/s (High ⚠️)
   - Temperature: 85°C (Elevated)
   - Current draw: 14.2A (Normal)
   - Oil pressure: 42 PSI (Low ⚠️)
2. Show trend charts and anomaly detection

#### Step 4: Maintenance Recommendation

AI recommends:
- "Replace motor bearing within 3 days"
- "Estimated downtime: 4 hours"
- "Required parts: Bearing SKF-6205 (In stock: 3 units)"
- "Estimated cost: $2,500"
- "Failure cost if deferred: $18,000"

### Key Talking Points

- **30-50% reduction** in unplanned downtime
- **Early failure detection** prevents cascading damage
- **Optimized maintenance timing** balances cost vs risk
- **ROI in 8 months** through avoided breakdowns
- **Condition-based** vs time-based maintenance

---

## Maintenance Cost Optimization

**Route:** `/maintenance-cost`  
**Navigation:** Maintenance → Cost Optimization  
**Feature Flag:** `maintenanceCostOptimization`

### What It Does

AI-driven cost-benefit analysis for maintenance decisions, spare parts demand forecasting, budget tracking, and equipment replacement ROI analysis.

### Demo Flow

#### Step 1: Dashboard Metrics

1. Navigate to Maintenance Cost Optimization page
2. Show key metrics:
   - **Budget Utilization**: 75% (healthy)
   - **Cost Savings YTD**: $47K
   - **Pending Decisions**: 2 tasks awaiting analysis
   - **Parts at Risk**: 3 items below reorder point

#### Step 2: Maintenance Decision Analysis

1. Click **Maintenance Decisions** tab
2. Review first decision: **CNC Machine #1 - Spindle bearing replacement**
   - Priority: High
   - Estimated cost: $15,000
   - Downtime cost: $8,500
   - Failure risk: 65%
3. Show AI recommendation: **"Execute Now"**
4. Read reasoning: "High failure probability combined with critical machine status justifies immediate action. Deferring risks production stoppage with higher recovery costs."
5. Show cost breakdown:
   - Total cost: $23,500
   - Potential savings: $12,000 (vs emergency repair)
   - ROI: 215%

#### Step 3: Alternative Decision

Review second task: **Robot Arm #3 - Servo motor repair**

- AI recommends: **"Schedule Optimal"**
- Best window: Weekend during low production
- Reasoning: "Medium priority with manageable risk. Optimal scheduling reduces downtime impact by 60%."

#### Step 4: Spare Parts Inventory

1. Click **Spare Parts** tab
2. Show forecasted demand for critical parts
3. Highlight urgent item: **Bearing-A23**
   - Current stock: 2 units
   - Forecast demand: 5 units (next 90 days)
   - Reorder point: 3 units (🔴 BELOW THRESHOLD)
   - Optimal order: 8 units
   - Lead time: 14 days
4. Show alert: "⚠️ Stock below reorder point! Order 8 units immediately to avoid stockout."

#### Step 5: Budget Tracking

1. Click **Budget Tracking** tab
2. Show Q1-2024 budget overview:
   - Allocated: $250K
   - Spent: $187.5K
   - Forecast: $235K
   - Variance: +$15K (under budget)
3. Review spending breakdown by category:
   - Preventive: 45%
   - Corrective: 30%
   - Predictive: 15%
   - Emergency: 10%
4. Show AI recommendations:
   - "Increase preventive maintenance allocation by 10%"
   - "Current pace is sustainable, forecast within budget"

#### Step 6: Life Cycle Analysis

1. Click **Life Cycle Analysis** tab
2. Review **CNC Machine #1** (8 years old):
   - Acquisition cost: $250K
   - Total maintenance: $95K
   - Life cycle cost: $345K
   - Replacement cost: $280K (new machine)
3. Show AI recommendation: **"Plan Replacement"**
4. Read analysis: "Equipment approaching end of economical life. Maintenance costs trending upward (averaging $28K/year). Replacement recommended within 12-18 months. ROI of replacement: 145% over 5 years due to efficiency gains and reduced downtime."
5. Show cost comparison scenarios:
   - Continue repair: $380K (5 years)
   - Replace now: $280K + $25K maintenance
   - Net savings: $75K

### Key Talking Points

- **15-25% reduction in maintenance costs** through optimized decisions
- **$75K-250K annual savings** from better planning
- **Predictive parts ordering** prevents stockouts and emergency purchases
- **Budget variance tracking** keeps spending on target
- **Life cycle analysis** shows when to repair vs replace
- **ROI comparison** between maintenance strategies

---

## Root Cause Analysis

**Route:** `/rca`  
**Navigation:** Maintenance → Root Cause  
**Feature Flag:** `rootCauseAnalysis`

### What It Does

AI-powered root cause analysis using 5-Why methodology, fishbone diagrams, and pattern recognition across incidents. Identifies systemic issues vs one-off events.

### Demo Flow

#### Step 1: Recent Incidents

1. Navigate to Root Cause Analysis page
2. Show recent downtime/quality events
3. Filter by severity, equipment, or timeframe

#### Step 2: RCA Investigation

1. Select incident: "Line A stoppage - 45 minutes"
2. View event timeline and symptoms
3. Launch AI-assisted 5-Why analysis:
   - Why #1: "Machine stopped due to jam"
   - Why #2: "Material feeder misaligned"
   - Why #3: "Adjustment bolt loosened"
   - Why #4: "Vibration from adjacent equipment"
   - Why #5: "Foundation bolts need tightening"
   - **Root cause: Inadequate preventive maintenance on foundation**

#### Step 3: Fishbone Diagram

1. View ishikawa diagram showing contributing factors:
   - **Man**: Maintenance training gap
   - **Machine**: Equipment vibration
   - **Method**: PM checklist incomplete
   - **Material**: N/A
   - **Environment**: Floor vibration from forklift traffic

#### Step 4: Pattern Detection

AI identifies:
- "3 similar incidents in past 90 days"
- "All on machines near forklift lane"
- "Recommendation: Update PM checklist, add vibration monitoring, consider forklift route change"

#### Step 5: Corrective Actions

1. Assign actions:
   - Update PM checklist (Maintenance team)
   - Install vibration sensors (Engineering)
   - Review forklift routes (Operations)
2. Track completion and verify effectiveness

### Key Talking Points

- **Systematic root cause** vs superficial fixes
- **AI pattern recognition** spots systemic issues
- **Reduced repeat failures** through proper analysis
- **Knowledge capture** for organizational learning
- **Collaborative investigation** across teams

---

## Tool Management

**Route:** `/tools`  
**Navigation:** Maintenance → Tools  
**Feature Flag:** `toolManagement`

### What It Does

Tool lifecycle management with usage tracking, calibration scheduling, condition monitoring, and tool inventory optimization. Ensures tools are available, calibrated, and in good condition.

### Demo Flow

#### Step 1: Tool Inventory

1. Navigate to Tool Management page
2. Show tool categories (cutting, measuring, assembly, etc.)
3. Display total tools: 847
4. Show status breakdown:
   - In use: 423
   - Available: 315
   - Calibration due: 47
   - Maintenance required: 62

#### Step 2: Tool Detail

1. Select "Torque Wrench TW-042"
2. View tool information:
   - Serial number, acquisition date
   - Current location: Station A
   - Assigned to: Operator David
   - Usage hours: 1,247
   - Last calibration: 45 days ago
   - Next calibration: 15 days
   - Calibration history: All passed

#### Step 3: Calibration Alerts

1. View calibration due list (47 tools)
2. Filter by urgency:
   - Overdue: 3 tools
   - Due this week: 12 tools
   - Due this month: 32 tools
3. Schedule calibration for critical tools
4. Generate calibration certificates

#### Step 4: Tool Condition Monitoring

1. Show tools flagged for maintenance:
   - Drill bit set #23: Worn, replace
   - Pneumatic driver #15: Pressure leak, repair
   - Calipers CAL-08: Battery low, replace
2. Create work orders for repairs

#### Step 5: Usage Analytics

1. View tool utilization reports:
   - Most used tools
   - Idle tools (candidates for redistribution)
   - Tool life vs expected
   - Cost per tool per year
2. Optimize tool inventory based on usage

### Key Talking Points

- **Tool availability** prevents production delays
- **Calibration compliance** ensures quality
- **Predictive maintenance** for tool condition
- **Usage tracking** optimizes inventory
- **Cost reduction** through better management
- **Audit trail** for ISO compliance

---

## Performance

## Performance Dashboard

**Route:** `/performance`  
**Navigation:** Performance → Performance  
**Feature Flag:** `performanceDashboard`

### What It Does

Comprehensive performance dashboard with OEE, throughput, quality metrics, and trend analysis. Real-time and historical views across lines, shifts, and products.

### Demo Flow

#### Step 1: Overview Metrics

1. Navigate to Performance Dashboard
2. Show plant-level KPIs:
   - Overall OEE: 76.3%
   - Availability: 94.2%
   - Performance: 88.5%
   - Quality: 96.8%
   - Units produced today: 12,458

#### Step 2: Line Comparison

1. View performance by production line:
   - Line A: OEE 82% (Excellent)
   - Line B: OEE 74% (Good)
   - Line C: OEE 68% (Needs improvement)
2. Drill into Line C to see bottlenecks

#### Step 3: Shift Analysis

1. Compare shift performance:
   - Shift A (6am-2pm): OEE 79%
   - Shift B (2pm-10pm): OEE 75%
   - Shift C (10pm-6am): OEE 72%
2. Identify opportunity for shift C improvement

#### Step 4: Trend Analysis

1. Show 30-day OEE trend
2. Identify patterns:
   - Mondays typically lower (startup issues)
   - Fridays improving (pre-weekend focus)
   - Overall upward trend: +4% this month
3. View loss category breakdown:
   - Minor stops: 35%
   - Speed loss: 28%
   - Changeovers: 22%
   - Quality issues: 15%

#### Step 5: Benchmarking

1. Compare to targets:
   - Current OEE: 76.3%
   - Plant target: 80%
   - Industry average: 72%
   - World class: 85%
2. Show gap to world class and improvement roadmap

### Key Talking Points

- **Real-time visibility** into performance
- **Data-driven decisions** vs gut feel
- **Benchmarking** drives continuous improvement
- **Transparent metrics** engage operators
- **Trend analysis** shows improvement progress

---

## OEE Coaching

**Route:** `/oee-coaching`  
**Navigation:** Performance → OEE Coaching  
**Feature Flag:** `oeeCoaching`

### What It Does

AI-powered OEE coaching with personalized recommendations for operators and supervisors. Identifies top losses and provides actionable improvement strategies.

### Demo Flow

#### Step 1: Current OEE Assessment

1. Navigate to OEE Coaching page
2. Show current OEE: 76.3%
3. Break down the losses:
   - Availability losses: 5.8%
   - Performance losses: 11.5%
   - Quality losses: 3.2%

#### Step 2: AI Coaching Recommendations

Show top 5 AI recommendations:

1. **"Reduce minor stops on Line C"**
   - Impact: +3.2% OEE
   - Effort: Medium
   - Action: "Implement predictive jam detection on feeder"

2. **"Improve changeover efficiency"**
   - Impact: +2.5% OEE
   - Effort: Low
   - Action: "Apply SMED techniques, pre-stage tools"

3. **"Address speed losses during startup"**
   - Impact: +1.8% OEE
   - Effort: Low
   - Action: "Pre-warm equipment, optimize ramp-up procedure"

4. **"Reduce quality defects on Shift C"**
   - Impact: +1.2% OEE
   - Effort: Medium
   - Action: "Additional training on quality checks"

5. **"Improve planned maintenance efficiency"**
   - Impact: +1.0% OEE
   - Effort: High
   - Action: "Parallel maintenance activities, better planning"

#### Step 3: Improvement Tracking

1. View active improvement projects
2. Show progress over time
3. Calculate ROI for each initiative
4. Celebrate wins and share best practices

#### Step 4: Operator Coaching

1. Select an operator or shift
2. Show personalized coaching:
   - Strengths: "Excellent quality performance"
   - Opportunities: "Minor stop frequency above average"
   - Tips: "Check feeder alignment at start of shift"
3. Track skill development over time

### Key Talking Points

- **Personalized coaching** for each operator/line
- **Prioritized recommendations** with impact scores
- **Continuous improvement culture**
- **ROI tracking** proves value
- **Operator engagement** through recognition

---

## Line Balancing AI

**Route:** `/line-balancing`  
**Navigation:** Performance → Line Balancing  
**Feature Flag:** `lineBalancing`

### What It Does

Analyzes workload distribution across workstations, identifies bottlenecks, and recommends task redistribution to optimize throughput.

### Demo Flow

#### Step 1: Overview Dashboard

1. Navigate to Line Balancing page
2. Show key metrics cards:
   - **Overall Efficiency**: 78.3%
   - **Bottlenecks**: 2 detected
   - **Current Throughput**: 50 units/hour
   - **Improvement Potential**: +18.5%

#### Step 2: Bottleneck Analysis

1. Stay on **Overview** tab
2. Review identified bottlenecks:
   - **Sub-Assembly (WS-2)**: 75s cycle time (3s over target)
   - **Main Assembly (WS-3)**: 90s cycle time (18s over target) ⚠️
3. Show severity indicators and throughput impact

#### Step 3: AI Recommendations

Scroll to recommendations section:

- 🔴 **High Priority**: "Move Cable Management task from Main Assembly to Packaging"
  - Expected improvement: +12%
  - Implementation: Easy
  - Cost: $500
  - Time: 1-2 days

- 🟡 **Medium Priority**: "Add parallel operator at Main Assembly"
  - Expected improvement: +45%
  - Implementation: Moderate
  - Cost: $50K
  - Time: 1-2 weeks

- 🟡 **Medium Priority**: "Simplify wiring process with pre-assembled harness"
  - Expected improvement: +8%
  - Implementation: Complex
  - Cost: $15K
  - Time: 1 month

#### Step 4: Workstation Details

1. Click **Work Stations** tab
2. Select **WS-3 - Main Assembly**
3. Show:
   - Operator: David Lee
   - Utilization: 125% (overloaded)
   - 3 tasks with cycle times
   - Total cycle time: 90s vs 72s target
4. Point out which tasks can be reassigned (green checkmark)

#### Step 5: Run Simulation

1. Back to **Overview** tab
2. Select 2 recommendations (checkboxes)
3. Click **Run Simulation**
4. View **Simulation** tab showing:
   - **Before**: 90s cycle, 40 u/h throughput, 78% efficiency
   - **After**: 74s cycle, 49 u/h throughput, 95% efficiency
   - **Improvements**: -18% cycle time, +22% throughput, +17% efficiency

### Key Talking Points

- **10-20% throughput increase** by eliminating bottlenecks
- **Real-time workstation monitoring** with utilization tracking
- **Task-level analysis** shows exactly where time is spent
- **Simulation before implementation** reduces risk
- **ROI in 5 months** through better line efficiency

---

## Energy Management

**Route:** `/energy`  
**Navigation:** Performance → Energy  
**Feature Flag:** `energyManagement`

### What It Does

Monitors energy consumption, carbon footprint, optimizes usage patterns, and generates ESG compliance reports. Identifies energy-saving opportunities.

### Demo Flow

#### Step 1: Energy Dashboard

1. Navigate to Energy Management page
2. Show real-time metrics:
   - Current consumption: 847 kW
   - Cost today: $2,458
   - Carbon footprint: 423 kg CO2
   - Cost per unit: $0.82

#### Step 2: Consumption Breakdown

1. View energy by category:
   - Production equipment: 62%
   - HVAC: 18%
   - Lighting: 8%
   - Compressed air: 7%
   - Other: 5%
2. Identify high consumers:
   - CNC machines: 245 kW
   - Ovens: 178 kW
   - Compressors: 95 kW

#### Step 3: Peak vs Off-Peak Analysis

1. Show 24-hour consumption pattern
2. Identify peak usage times (8am-4pm)
3. Calculate demand charges
4. AI recommendation: "Shift non-critical operations to off-peak hours to save $18K annually"

#### Step 4: Optimization Opportunities

AI identifies savings:
- "Reduce compressed air leaks" → $12K/year
- "Optimize HVAC setpoints" → $8K/year
- "Install LED lighting" → $6K/year
- "Power down idle equipment" → $5K/year
- **Total potential: $31K annual savings**

#### Step 5: Sustainability Reporting

1. View carbon footprint trends
2. Show progress toward net-zero goals
3. Generate ESG compliance report
4. Compare to industry benchmarks

### Key Talking Points

- **15-20% energy cost reduction**
- **ESG compliance** automated reporting
- **Carbon footprint tracking** for sustainability goals
- **Demand charge optimization** through load shifting
- **ROI in 12 months**

---

## AI Optimization

**Route:** `/optimization`  
**Navigation:** Performance → AI Optimization  
**Feature Flag:** `aiAssistant`

### What It Does

Cross-functional AI optimization that analyzes all systems holistically to find improvement opportunities. Considers interactions between quality, maintenance, production, and energy.

### Demo Flow

#### Step 1: Holistic Analysis

1. Navigate to AI Optimization page
2. AI analyzes entire operation:
   - Production schedules
   - Maintenance windows
   - Quality patterns
   - Energy consumption
   - Operator skills
   - Material flows

#### Step 2: Cross-Functional Opportunities

Show top optimization opportunities:

1. **"Coordinate maintenance with low-demand periods"**
   - Impact: -$45K downtime cost
   - Synergy: Maintenance + Production planning
   - Analysis: "3 maintenance windows could shift to off-peak, reducing production impact by 70%"

2. **"Batch similar products to reduce changeovers"**
   - Impact: +12% throughput
   - Synergy: Scheduling + Changeover optimization
   - Analysis: "Current schedule has 14 changeovers, optimal sequence reduces to 9"

3. **"Adjust quality inspection frequency based on material batch quality"**
   - Impact: +3% throughput, maintain quality
   - Synergy: Quality + Yield prediction
   - Analysis: "High-quality batches can use sampling, low-quality need 100% inspection"

4. **"Shift energy-intensive operations to off-peak hours"**
   - Impact: -$18K energy cost
   - Synergy: Energy + Production scheduling
   - Analysis: "Heat treatment can run overnight at 40% lower electricity rates"

#### Step 3: Implementation Plan

1. AI generates 90-day roadmap
2. Sequences improvements by:
   - Quick wins first
   - Dependencies respected
   - Resource constraints considered
3. Shows cumulative impact: $180K annual savings

#### Step 4: What-If Scenarios

1. Test different scenarios:
   - "What if demand increases 20%?"
   - "What if a key machine goes down?"
   - "What if material costs increase?"
2. AI recommends adjustments for each scenario

### Key Talking Points

- **Holistic optimization** vs siloed improvements
- **Cross-functional synergies** multiplied impact
- **Systems thinking** approach
- **Prioritized roadmap** for implementation
- **Significant ROI** from coordinated improvements

---

## People

## Skills Matrix (Operator Analytics)

**Route:** `/skills`  
**Navigation:** People → Skills Matrix  
**Feature Flag:** `skillsMatrix`

### What It Does

Tracks operator skills, identifies training gaps, provides personalized coaching recommendations, and monitors productivity improvements. Supports succession planning and workforce development.

### Demo Flow

#### Step 1: Skills Matrix Overview

1. Navigate to Skills Matrix page
2. Show operator roster with skill levels:
   - ✅ Certified (green): Can work independently
   - 📚 Training (yellow): Learning, requires supervision
   - ❌ Not Certified (red): Not trained
3. View skill categories:
   - Quality Control
   - Machine Operation
   - Troubleshooting
   - Safety
   - Advanced Setup

#### Step 2: Individual Operator Profile

1. Click on "Sarah Johnson"
2. View complete skill profile:
   - Quality Control: ✅ Certified
   - Machine Operation: ✅ Certified
   - Troubleshooting: 📚 In Training (80% complete)
   - Safety: ✅ Certified (expires in 30 days ⚠️)
   - Advanced Setup: ❌ Not Certified
3. Show certification history and training hours

#### Step 3: Training Recommendations

AI suggests for Sarah:
- "Complete Advanced Troubleshooting module" (Priority: High)
  - Estimated time: 4 hours
  - Unlock capability: Independent problem-solving
- "Renew Safety Certification" (Priority: Critical)
  - Deadline: 30 days
  - Required: 8-hour refresher course
- "Consider Advanced Setup training" (Priority: Medium)
  - Benefit: Qualify for Lead Operator role

#### Step 4: Team Gap Analysis

1. View team skills dashboard
2. Show coverage gaps:
   - Quality Control: 8/10 operators (Good)
   - Machine Operation: 10/10 operators (Full)
   - Troubleshooting: 5/10 operators (Gap ⚠️)
   - Safety: 9/10 operators (Good, 1 expiring)
   - Advanced Setup: 3/10 operators (Gap ⚠️)
3. AI identifies risk: "Only 3 operators certified for advanced setups. Need 5 for redundancy."

#### Step 5: Succession Planning

1. View leadership pipeline
2. Identify operators ready for advancement:
   - Sarah: 90% ready for Lead Operator (needs Advanced Setup)
   - Mike: 85% ready for Lead Operator (needs Troubleshooting)
   - David: 75% ready for Supervisor (needs leadership training)
3. Create development plans

#### Step 6: Performance Correlation

1. Show correlation between training and performance:
   - Trained operators: 92% first-pass quality
   - In-training operators: 87% first-pass quality
   - Gap: 5 percentage points
2. Calculate ROI of training programs

### Key Talking Points

- **15% productivity improvement** through targeted coaching
- **Faster onboarding** with structured skill tracking
- **Succession planning** ensures continuity
- **Training ROI** quantified through performance data
- **Compliance tracking** for certifications
- **Employee engagement** through career development
- **Workforce optimization** based on skill availability

---

## AI & Insights

## Knowledge Base

**Route:** `/knowledge`  
**Navigation:** AI & Insights → Knowledge  
**Feature Flag:** `aiAssistant`

### What It Does

AI-powered knowledge repository with natural language search. Includes SOPs, troubleshooting guides, best practices, and institutional knowledge. Learns from usage patterns.

### Demo Flow

#### Step 1: Knowledge Search

1. Navigate to Knowledge Base
2. Enter question: "How do I fix a material feeder jam?"
3. AI returns relevant articles:
   - SOP: Material Feeder Jam Clearance
   - Troubleshooting Guide: Feeder Issues
   - Video: Feeder Maintenance Best Practices
   - Related incidents: 12 similar cases

#### Step 2: View Article

1. Click on "Material Feeder Jam Clearance"
2. Show structured content:
   - Safety precautions
   - Step-by-step procedure with images
   - Common mistakes to avoid
   - Required tools
   - Estimated time: 5 minutes
3. View article metrics:
   - Used 247 times this month
   - 94% helpful rating
   - Average resolution time: 6 minutes

#### Step 3: Related Content

AI suggests related articles:
- "Preventive maintenance for feeders"
- "Feeder alignment procedure"
- "Material viscosity specifications"

#### Step 4: Capture New Knowledge

1. Create new article from recent incident
2. AI assists with:
   - Suggesting title and keywords
   - Identifying similar existing content
   - Recommending categories
3. Add images and videos
4. Publish for team access

#### Step 5: Usage Analytics

1. View most-searched topics
2. Identify knowledge gaps (high search, low results)
3. Track article effectiveness
4. Update outdated content

### Key Talking Points

- **Instant access** to institutional knowledge
- **Natural language search** vs keyword-based
- **Capture tribal knowledge** before it's lost
- **AI-powered** content recommendations
- **Reduced training time** for new operators
- **Continuous improvement** through usage analytics

---

## AI Scenarios Dashboard

**Route:** `/ai-scenarios`  
**Navigation:** AI & Insights → AI Scenarios  
**Feature Flag:** `aiAssistant`

### What It Does

Central hub for all AI-powered manufacturing scenarios. Shows available AI features, their status, impact, and ROI. Provides guided tours and implementation support.

### Demo Flow

#### Step 1: Scenarios Overview

1. Navigate to AI Scenarios Dashboard
2. Show all available scenarios (20+):
   - Operations: 4 scenarios
   - Production: 5 scenarios
   - Maintenance: 5 scenarios
   - Performance: 5 scenarios
   - People: 1 scenario
   - AI & Insights: 2 scenarios

#### Step 2: Scenario Categories

Filter by category:
- **Live**: Currently deployed and active
- **Pilot**: Being tested
- **Planned**: Scheduled for implementation
- **Available**: Ready to deploy

#### Step 3: Impact Summary

Show aggregate impact:
- **Total Annual Savings**: $500K+
- **Active Scenarios**: 20+
- **Average ROI**: 6 months
- **Average Improvement**: 15-25% across metrics

#### Step 4: Scenario Details

1. Click on "Yield Prediction"
2. View scenario card:
   - Description and benefits
   - Current status: Live
   - Users: 45 operators
   - Impact: $75K annual savings
   - Success metrics: 87% accuracy, 15% waste reduction
   - Learn more / Demo / Configure

#### Step 5: Implementation Support

1. Select scenario to deploy
2. View requirements:
   - Data connections needed
   - Training required
   - Timeline estimate
   - Expected ROI
3. Request implementation assistance

### Key Talking Points

- **Centralized view** of all AI capabilities
- **Proven ROI** across scenarios
- **Modular deployment** - start where it matters most
- **Guided implementation** support
- **Continuous innovation** - new scenarios added regularly

---

## System

## Edge Devices

**Route:** `/edge-devices`  
**Navigation:** System → Edge Devices  
**Feature Flag:** `edgeDevices`

### What It Does

Manages edge computing devices deployed on the factory floor. Monitors device health, connectivity, data collection, and local AI processing.

### Demo Flow

#### Step 1: Device Overview

1. Navigate to Edge Devices page
2. Show deployed devices:
   - Edge Gateways: 12 (all online)
   - Vision Cameras: 24 (23 online, 1 offline ⚠️)
   - Sensors: 147 (145 online, 2 low battery ⚠️)
   - PLCs: 18 (all online)

#### Step 2: Device Details

1. Select "Edge Gateway EG-03"
2. View device information:
   - Location: Line A - Station 3
   - Status: Online
   - Uptime: 45 days
   - CPU: 34%
   - Memory: 56%
   - Storage: 67%
   - Network: 125 Mbps
   - Temperature: 42°C

#### Step 3: Data Collection

Show connected sensors and data streams:
- Temperature sensor: 1 reading/sec
- Vibration sensor: 10 readings/sec
- Vision camera: 30 fps
- PLC data: Real-time
- Total data rate: 2.3 MB/sec

#### Step 4: Local AI Processing

View AI models running on edge:
- Defect detection model: 98.5% accuracy
- Predictive maintenance model: Running
- Quality inspection: 45 parts/min processed
- Anomaly detection: Active

#### Step 5: Alerts and Maintenance

1. Show device alerts:
   - Camera-12: Offline since 2:15 PM (Network issue)
   - Sensor-45: Low battery (Replace within 7 days)
   - Gateway-07: High temperature (Check cooling)
2. Create maintenance work orders

### Key Talking Points

- **Edge computing** enables real-time AI
- **Low latency** for critical decisions
- **Reduced cloud costs** through local processing
- **Reliable operation** even with network issues
- **Scalable architecture** for plant-wide deployment

---

## Settings

**Route:** `/settings`  
**Navigation:** System → Settings  
**Feature Flag:** None (always available)

### What It Does

Application settings including user preferences, feature flags, language selection, role management, and system configuration.

### Demo Flow

#### Step 1: User Profile

1. Navigate to Settings page
2. View current user:
   - Name: John Supervisor
   - Role: Supervisor
   - Plant: Manufacturing Site A
   - Language: English
   - Theme: Light mode

#### Step 2: Feature Flags

1. Click **Features** tab
2. Show available features with toggles:
   - ✅ Multi-Agent Chat
   - ✅ Digital Twin 3D
   - ✅ Yield Prediction
   - ✅ Line Balancing
   - ✅ Maintenance Cost Optimization
   - ✅ Predictive Maintenance
   - ❌ (Disabled feature for demo purposes)
3. Toggle features on/off to customize experience

#### Step 3: Role Selection

1. Switch between roles:
   - Operator: Simplified view, execution focus
   - Supervisor: Team oversight, problem-solving
   - Engineer: Technical analysis, optimization
   - Plant Manager: Strategic view, KPIs
2. Show how interface adapts to each role

#### Step 4: Language Selection

1. Click language dropdown
2. Switch between:
   - English
   - Nederlands (Dutch)
   - Deutsch (German)
3. Show interface updating in real-time

#### Step 5: System Configuration

1. View system settings:
   - Data refresh rate
   - Notification preferences
   - Default dashboard
   - Time zone
   - Units (metric/imperial)

### Key Talking Points

- **Personalized experience** for each user
- **Role-based access** controls
- **Multi-language support** for global deployment
- **Feature flags** enable gradual rollout
- **Configurable** to match plant needs

---

## 🎬 Demo Tips

### Preparation

1. **Enable all feature flags** in Settings
2. **Choose role** appropriate for audience (Operator, Supervisor, Engineer, Plant Manager)
3. **Start at Home or AI Scenarios dashboard** for overview
4. **Pre-select 3-5 scenarios** to demo based on audience interest
5. **Have backup scenarios** ready in case of questions

### Storytelling Framework

For each scenario, follow this structure:

1. **Business Problem**: Start with the pain point
   - "Currently, 15% of material is wasted due to quality issues"
   - "Unplanned downtime costs $5K per hour"
   - "Changeovers take 45 minutes, losing production time"

2. **Current State**: Show baseline metrics
   - Display current performance
   - Highlight inefficiencies
   - Demonstrate manual processes

3. **AI Solution**: Introduce the scenario
   - Show AI analysis and insights
   - Explain how it works (briefly, avoid technical jargon)
   - Demonstrate key features

4. **Recommendations**: Show actionable guidance
   - AI-generated recommendations
   - Cost-benefit analysis
   - Prioritization

5. **Expected Impact**: Highlight improvements
   - Quantified benefits ($, %, time)
   - ROI timeline
   - Success metrics

6. **Ease of Implementation**: Address concerns
   - "Can be deployed in 2 weeks"
   - "No disruption to production"
   - "Training takes 1 hour"

### Audience-Specific Focus

**For Executives:**
- Focus on: ROI, strategic benefits, competitive advantage
- Show: Dashboard summaries, aggregate impact ($500K+ savings)
- Emphasize: Quick deployment, proven results, scalability
- Time: 15-20 minutes, high-level overview of 5-7 key scenarios

**For Plant Managers:**
- Focus on: Operational improvements, problem-solving, team enablement
- Show: Detailed scenario flows, optimization recommendations
- Emphasize: Actionable insights, cross-functional benefits
- Time: 30-45 minutes, deep dive into 4-6 relevant scenarios

**For Supervisors:**
- Focus on: Daily operations, team performance, issue resolution
- Show: Work instructions, shift handover, OEE coaching, quality analytics
- Emphasize: Ease of use, mobile access, decision support
- Time: 20-30 minutes, focus on 3-5 operational scenarios

**For Operators:**
- Focus on: Day-to-day tasks, ease of use, helping not replacing
- Show: Work instructions, digital twin, quality checks, knowledge base
- Emphasize: Intuitive interface, mobile-first, decision support
- Time: 15-20 minutes, hands-on with 2-3 core scenarios

**For Engineers/Technical:**
- Focus on: AI models, data sources, integration, architecture
- Show: Predictive models, root cause analysis, optimization algorithms
- Emphasize: Accuracy, scalability, API-ready, extensible
- Time: 45-60 minutes, technical deep dive into 3-4 complex scenarios

**For IT/Infrastructure:**
- Focus on: Deployment, security, integration, maintenance
- Show: Edge devices, system architecture, data flows
- Emphasize: Cloud/hybrid options, security, APIs, monitoring
- Time: 30 minutes, infrastructure and integration focus

### Interactive Demo Techniques

1. **Let them drive**: Hand the controls to audience for key actions
2. **What-if scenarios**: "What happens if we change this parameter?"
3. **Compare scenarios**: Show before/after, with/without AI
4. **Real questions**: Use their actual problems as examples
5. **Pause for questions**: Build in interaction points

### Common Questions & Answers

**Q: "How accurate is the AI?"**
- A: "87-95% accuracy depending on scenario, continuously improving with more data"

**Q: "How long to implement?"**
- A: "Pilot scenarios in 2-4 weeks, full deployment in 2-3 months per scenario"

**Q: "What about our existing systems?"**
- A: "Integrates with MES, ERP, SCADA, PLCs via standard APIs and edge gateways"

**Q: "Do we need to replace our operators?"**
- A: "Absolutely not. This is decision support, not replacement. Operators remain in control."

**Q: "What if the AI is wrong?"**
- A: "All recommendations include confidence scores and reasoning. Final decisions remain with people."

**Q: "What's the ROI?"**
- A: "Average 6-month ROI, $500K+ annual savings across all scenarios. Individual scenarios range from 4-12 months ROI."

**Q: "Can we start with just one scenario?"**
- A: "Yes! Modular architecture. Start where you have the biggest pain point. Common starting points: Yield Prediction, Predictive Maintenance, OEE Coaching."

---

## 📊 Combined Impact

When all scenarios are deployed together:

### Financial Impact
- **Annual Savings**: $500K - $1.2M
- **Average ROI**: 6 months
- **Cost Avoidance**: $200K+ (prevented downtime, quality issues, waste)

### Operational Improvements
- **OEE Improvement**: +8-12 percentage points
- **Throughput**: +15-20%
- **Downtime Reduction**: -30-50%
- **Quality Improvement**: +5-8%
- **Waste Reduction**: -15-25%
- **Energy Savings**: -15-20%

### Strategic Benefits
- **Faster Decision-Making**: Real-time insights vs lagging indicators
- **Predictive Operations**: Prevent issues before they occur
- **Continuous Improvement**: Data-driven optimization
- **Workforce Development**: Skilled operators with AI support
- **Sustainability**: Reduced energy and waste
- **Competitive Advantage**: Industry-leading performance

### Deployment Approach

**Phase 1 (Months 1-3): Quick Wins**
- Yield Prediction
- OEE Coaching
- Work Instructions
- Expected impact: $150K annual savings

**Phase 2 (Months 4-6): Core Operations**
- Predictive Maintenance
- Production Planning
- Line Balancing
- Expected impact: +$200K annual savings

**Phase 3 (Months 7-9): Advanced Optimization**
- Maintenance Cost Optimization
- Quality Analytics
- Energy Management
- Expected impact: +$150K annual savings

**Phase 4 (Months 10-12): Complete Digital Transformation**
- All remaining scenarios
- Cross-functional optimization
- Full AI Optimization
- Expected impact: +$150K+ annual savings

---

## 🔗 Quick Reference

### Routes by Category

**Core:**
- Home: `/home`
- Agents: `/chat`

**Operations:**
- Digital Twin: `/twin`
- Work Instructions: `/work-instructions`
- Shift Handover: `/shift-handover`
- Safety: `/safety`

**Production:**
- Planning: `/planning`
- Changeover: `/changeover`
- Quality: `/quality`
- Traceability: `/traceability`
- Yield Prediction: `/yield-prediction`

**Maintenance:**
- Maintenance: `/maintenance`
- Predictive: `/predictive`
- Cost Optimization: `/maintenance-cost`
- Root Cause: `/rca`
- Tools: `/tools`

**Performance:**
- Performance: `/performance`
- OEE Coaching: `/oee-coaching`
- Line Balancing: `/line-balancing`
- Energy: `/energy`
- AI Optimization: `/optimization`

**People:**
- Skills Matrix: `/skills`

**AI & Insights:**
- Knowledge: `/knowledge`
- AI Scenarios: `/ai-scenarios`

**System:**
- Edge Devices: `/edge-devices`
- Settings: `/settings`

### Feature Flags

Enable/disable scenarios in Settings:
- `multiAgent` - AI Agents
- `digitalTwin3D` - Digital Twin
- `workInstructions` - Work Instructions
- `shiftHandover` - Shift Handover
- `safetyAnalytics` - Safety
- `productionPlanning` - Planning
- `smedChangeover` - Changeover
- `qualityInsights` - Quality
- `traceability` - Traceability
- `yieldPrediction` - Yield Prediction
- `predictiveMaintenance` - Maintenance & Predictive
- `maintenanceCostOptimization` - Cost Optimization
- `rootCauseAnalysis` - Root Cause
- `toolManagement` - Tools
- `performanceDashboard` - Performance
- `oeeCoaching` - OEE Coaching
- `lineBalancing` - Line Balancing
- `energyManagement` - Energy
- `aiAssistant` - AI Optimization, Knowledge, AI Scenarios
- `skillsMatrix` - Skills Matrix
- `edgeDevices` - Edge Devices

---

## 📞 Support & Resources

### For Demo Support
- Contact: Versuni AI Team
- Email: ai-team@versuni.com
- Training sessions available
- Customization services

### Documentation
- Technical Specs: See `SCENARIO_IDEAS.md`
- Setup Guide: See `README.md`
- Latest Updates: See `LATEST_UPDATES.md`

### Community
- Share your success stories
- Request new scenarios
- Provide feedback for improvements

---

**Ready to Transform Your Manufacturing Operations?**

This comprehensive suite of AI-powered scenarios represents the future of smart manufacturing. Start with your biggest pain point, prove the value, and scale across your organization.

**Contact us to schedule a personalized demo or pilot program!**
