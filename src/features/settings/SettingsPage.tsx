export function SettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Environment */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Environment</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode:</span>
              <span className="font-mono">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Using Mocks:</span>
              <span className="font-mono text-versuni-success">True</span>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Feature Flags</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Voice Handover</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Digital Twin</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Multi-Agent</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Cache Management</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
              Clear Conversation Cache
            </button>
            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
              Clear Twin Cache
            </button>
            <button className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
