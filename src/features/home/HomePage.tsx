export function HomePage() {
  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Shift */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Current Shift</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shift:</span>
              <span className="font-medium">Morning (06:00 - 14:00)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Line:</span>
              <span className="font-medium">Line-B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-versuni-success">Running</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">OEE</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-versuni-accent h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Quality</span>
                <span className="text-sm font-medium">97%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-versuni-success h-2 rounded-full" style={{ width: '97%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-versuni-warning rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Temperature High</p>
                <p className="text-xs text-muted-foreground">Filler-3 • 5 min ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-versuni-error rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">PM Overdue</p>
                <p className="text-xs text-muted-foreground">Capper-1 • 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
