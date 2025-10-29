import { useState } from 'react';
import { Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Skill {
  name: string;
  level: 'novice' | 'intermediate' | 'advanced' | 'expert';
  certified: boolean;
  expiryDate?: string;
}

export function SkillsMatrixPage() {
  const [skills] = useState<Skill[]>([
    { name: 'CNC Machine Operation', level: 'expert', certified: true, expiryDate: '2026-03-15' },
    { name: 'Quality Inspection', level: 'advanced', certified: true, expiryDate: '2025-12-01' },
    { name: 'Safety Procedures', level: 'expert', certified: true, expiryDate: '2025-11-10' },
    { name: 'Lean Manufacturing', level: 'intermediate', certified: false },
    { name: 'Robot Programming', level: 'novice', certified: false },
    {
      name: 'Preventive Maintenance',
      level: 'intermediate',
      certified: true,
      expiryDate: '2026-01-20',
    },
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'text-green-600 bg-green-50';
      case 'advanced':
        return 'text-blue-600 bg-blue-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'novice':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const needsRenewal = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const days = Math.floor((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days < 90;
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Skills Matrix</h1>
        <p className="text-muted-foreground">Track your certifications and skill development</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-versuni-primary" />
            <span className="text-sm text-muted-foreground">Certifications</span>
          </div>
          <div className="text-2xl font-bold">4/6</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Expert Skills</span>
          </div>
          <div className="text-2xl font-bold">2</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-muted-foreground">Training Needed</span>
          </div>
          <div className="text-2xl font-bold">2</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Completion</span>
          </div>
          <div className="text-2xl font-bold">67%</div>
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">My Skills</h2>
        </div>
        <div className="divide-y">
          {skills.map((skill, idx) => (
            <div key={idx} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{skill.name}</h3>
                    {skill.certified && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-md font-medium ${getLevelColor(skill.level)}`}
                    >
                      {skill.level}
                    </span>
                    {skill.expiryDate && (
                      <span
                        className={
                          needsRenewal(skill.expiryDate)
                            ? 'text-orange-600'
                            : 'text-muted-foreground'
                        }
                      >
                        {needsRenewal(skill.expiryDate) ? '⚠️ ' : ''}
                        Valid until {new Date(skill.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {!skill.certified && (
                  <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
                    Get Certified
                  </button>
                )}
                {skill.certified && needsRenewal(skill.expiryDate) && (
                  <button className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Renew
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Training */}
      <div className="mt-6 bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Recommended Training</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-md">
            <div>
              <div className="font-medium">Advanced Robot Programming</div>
              <div className="text-sm text-muted-foreground">Next session: Nov 15, 2025</div>
            </div>
            <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
              Enroll
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-md">
            <div>
              <div className="font-medium">Lean Six Sigma Green Belt</div>
              <div className="text-sm text-muted-foreground">Next session: Dec 1, 2025</div>
            </div>
            <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
              Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
