# AI Manufacturing Scenarios - Demo Guide

This guide provides step-by-step walkthroughs for all AI manufacturing scenarios in the Versuni Frontline PWA.

## 🎯 Quick Navigation

- [Yield Prediction & Loss Prevention](#1-yield-prediction--loss-prevention)
- [Intelligent Scheduling](#2-intelligent-scheduling)
- [Line Balancing AI](#3-line-balancing-ai)
- [Maintenance Cost Optimization](#4-maintenance-cost-optimization)
- [Operator Performance Analytics](#5-operator-performance-analytics)
- [Environmental Compliance AI](#6-environmental-compliance-ai)
- [Changeover Optimization](#7-changeover-optimization)

---

## 1. Yield Prediction & Loss Prevention

**Route:** `/yield-prediction`  
**Navigation:** Production → Yield Prediction  
**Feature Flag:** `yieldPrediction`

### What It Does

AI-powered yield forecasting with real-time loss prevention and material batch quality scoring. Predicts production yield based on historical data, process parameters, and material quality.

### Demo Flow

#### Step 1: View Live Prediction

1. Navigate to **Yield Prediction** page
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

## 2. Intelligent Scheduling

**Route:** `/planning`  
**Navigation:** Production → Planning  
**Feature Flag:** `productionPlanning`

### What It Does

Multi-constraint optimization engine that balances skills, materials, deadlines, and changeover times. Generates what-if scenarios and detects scheduling conflicts.

### Demo Flow

#### Step 1: View Current Schedule

1. Navigate to **Production Planning** page
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

## 3. Line Balancing AI

**Route:** `/line-balancing`  
**Navigation:** Performance → Line Balancing  
**Feature Flag:** `lineBalancing`

### What It Does

Analyzes workload distribution across workstations, identifies bottlenecks, and recommends task redistribution to optimize throughput.

### Demo Flow

#### Step 1: Overview Dashboard

1. Navigate to **Line Balancing** page
2. Show key metrics cards:
   - **Overall Efficiency**: 78.3%
   - **Bottlenecks**: 2 detected
   - **Current Throughput**: 40 units/hour
   - **Improvement Potential**: +18.5%

#### Step 2: Bottleneck Analysis

1. Stay on **Overview** tab
2. Review identified bottlenecks:
   - **Main Assembly (WS-3)**: 90s cycle time (30s over target)
   - **Testing (WS-4)**: 75s cycle time (15s over target)
3. Show severity indicators and throughput impact

#### Step 3: AI Recommendations

Scroll to recommendations section:

- 🔴 **High Priority**: "Move Cable Management task from Main Assembly to Sub-Assembly"
  - Expected improvement: +12%
  - Implementation: Easy
  - Cost: $500
  - Time: 1-2 days

- 🟡 **Medium Priority**: "Add parallel operator at Main Assembly to split workload"
  - Expected improvement: +45%
  - Implementation: Moderate
  - Cost: $50K
  - Time: 1-2 weeks

#### Step 4: Workstation Details

1. Click **Work Stations** tab
2. Select **WS-3 - Main Assembly**
3. Show:
   - Operator: David Lee
   - Utilization: 150% (overloaded)
   - 3 tasks with cycle times
   - Total cycle time: 90s vs 60s target
4. Point out which tasks can be reassigned (green indicator)

#### Step 5: Run Simulation

1. Back to **Overview** tab
2. Select 2-3 recommendations (check boxes)
3. Click **Run Simulation**
4. View **Simulation** tab showing:
   - **Before**: 90s cycle, 40 u/h throughput, 78% efficiency
   - **After**: 74s cycle, 49 u/h throughput, 92% efficiency
   - **Improvements**: -18% cycle time, +22% throughput, +14% efficiency

### Key Talking Points

- **10-20% throughput increase** by eliminating bottlenecks
- **Real-time workstation monitoring** with utilization tracking
- **Task-level analysis** shows exactly where time is spent
- **Simulation before implementation** reduces risk
- **ROI in 5 months** through better line efficiency

---

## 4. Maintenance Cost Optimization

**Route:** `/maintenance-cost`  
**Navigation:** Maintenance → Cost Optimization  
**Feature Flag:** `maintenanceCostOptimization`

### What It Does

AI-driven cost-benefit analysis for maintenance decisions, spare parts demand forecasting, budget tracking, and equipment replacement ROI analysis.

### Demo Flow

#### Step 1: Dashboard Metrics

1. Navigate to **Maintenance Cost Optimization** page
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
- **ROI comparison** between maintenance strategies (preventive 50% ROI, predictive 200% ROI, reactive -40% ROI)

---

## 5. Operator Performance Analytics

**Route:** `/skills`  
**Navigation:** People → Skills Matrix  
**Feature Flag:** `skillsMatrix`

### What It Does

Tracks operator skills, identifies training gaps, provides personalized coaching recommendations, and monitors productivity improvements.

### Demo Flow

#### Step 1: Skills Matrix Overview

1. Navigate to **Skills Matrix** page
2. Show operator roster with skill levels:
   - ✅ Certified (green)
   - 📚 Training (yellow)
   - ❌ Not Certified (red)
3. Point out skill categories: Quality Control, Machine Operation, Troubleshooting, Safety

#### Step 2: Individual Operator Profile

1. Click on an operator (e.g., "Sarah Johnson")
2. Show skill breakdown
3. Highlight training recommendations:
   - "Complete Advanced Troubleshooting module"
   - "Renew Safety Certification (expires in 30 days)"

#### Step 3: Training Gap Analysis

1. View gap analysis for the team
2. Show which skills are understaffed
3. AI recommendations for training priorities

### Key Talking Points

- **15% productivity improvement** through targeted coaching
- **Faster onboarding** with structured skill tracking
- **Succession planning** by identifying backup operators
- **Compliance tracking** for certifications

---

## 6. Environmental Compliance AI

**Route:** `/energy`  
**Navigation:** Performance → Energy  
**Feature Flag:** `energyManagement`

### What It Does

Monitors carbon footprint, optimizes energy consumption, tracks sustainability metrics, and generates ESG compliance reports.

### Demo Flow

#### Step 1: Energy Dashboard

1. Navigate to **Energy Management** page
2. Show real-time metrics:
   - Current consumption
   - Carbon footprint
   - Cost per unit produced

#### Step 2: Optimization Recommendations

1. Review AI suggestions for energy savings
2. Show peak vs off-peak usage patterns
3. Demonstrate cost reduction opportunities

#### Step 3: Sustainability Report

1. Generate compliance report
2. Show trending over time
3. Highlight achievements and goals

### Key Talking Points

- **15-20% energy cost reduction**
- **ESG compliance** automated reporting
- **Carbon footprint tracking** for sustainability goals
- **ROI in 12 months**

---

## 7. Changeover Optimization

**Route:** `/changeover`  
**Navigation:** Production → Changeover  
**Feature Flag:** `smedChangeover`

### What It Does

SMED (Single-Minute Exchange of Die) analysis with AI-powered recommendations to reduce changeover times between product runs.

### Demo Flow

#### Step 1: Changeover History

1. Navigate to **Changeover Optimization** page
2. Show recent changeovers with times
3. Compare against targets

#### Step 2: AI Analysis

1. View step-by-step breakdown
2. Identify bottleneck steps
3. Show AI recommendations for improvement

#### Step 3: Best Practices

1. Review best practice library
2. Show successful changeovers from other shifts
3. Apply learnings to current procedures

### Key Talking Points

- **30-50% reduction in changeover time**
- **SMED methodology** with AI insights
- **Best practice sharing** across shifts
- **Quick ROI** through increased production time

---

## 🎬 Demo Tips

### Preparation

1. Enable all feature flags in Settings
2. Ensure mock data mode is on for consistent demos
3. Have the AI Scenarios dashboard as your starting point (`/ai-scenarios`)
4. Pre-select which scenarios to demo based on audience interest

### Storytelling

- Start with business problem (waste, downtime, costs)
- Show current metrics and pain points
- Demonstrate AI analysis and recommendations
- Highlight expected improvements and ROI
- End with implementation ease and timeline

### Audience-Specific Focus

**For Executives:**

- Focus on ROI, savings, and strategic metrics
- Emphasize the $500K+ annual savings potential
- Show dashboard summaries and high-level insights

**For Plant Managers:**

- Deep dive into optimization details
- Show how scenarios work together
- Emphasize actionable recommendations

**For Operators:**

- Focus on ease of use and daily benefits
- Show mobile-friendly interface
- Emphasize decision support, not replacement

**For IT/Technical:**

- Explain AI models and data sources
- Discuss integration points
- Show API-ready architecture

---

## 📊 Combined Impact

When all 7 AI scenarios are deployed together:

- **$500K+ annual savings**
- **15-25% average improvement** across metrics
- **6-month average ROI**
- **Integrated data platform** for comprehensive insights
- **Scalable architecture** for future AI scenarios

---

## 🔗 Quick Links

- **AI Scenarios Hub**: `/ai-scenarios`
- **Settings**: `/settings` (enable/disable features)
- **Documentation**: See [SCENARIO_IDEAS.md](./SCENARIO_IDEAS.md) for detailed technical specs

---

**Need Help?** Contact the Versuni AI team for training sessions, customization, or integration support.
