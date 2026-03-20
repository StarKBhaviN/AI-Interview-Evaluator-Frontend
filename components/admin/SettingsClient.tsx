"use client"
import React, { useState } from 'react'
import { Settings, Camera, Shield, Scale, Bell, Save } from 'lucide-react'

export default function SettingsClient() {
  const [settings, setSettings] = useState({
    companyName: 'AI Interview Pro',
    timePerQuestion: 180,
    totalQuestions: 5,
    enableCamera: true,
    enableStrictMode: false,
    notifications: true,
    communicationWeight: 30,
    technicalWeight: 40,
    confidenceWeight: 30,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/30 text-sm mt-1">Configure interview parameters and system behavior</p>
      </div>

      {/* General */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" /> General
        </h2>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/40 mb-1.5 block">Time per Question: {settings.timePerQuestion}s</label>
              <input type="range" min={60} max={600} step={30} value={settings.timePerQuestion} onChange={(e) => setSettings({ ...settings, timePerQuestion: +e.target.value })} className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/40 mb-1.5 block">Total Questions: {settings.totalQuestions}</label>
              <input type="range" min={3} max={15} value={settings.totalQuestions} onChange={(e) => setSettings({ ...settings, totalQuestions: +e.target.value })} className="w-full accent-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring toggles */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" /> Monitoring & Security
        </h2>
        <div className="space-y-4">
          {[
            { key: 'enableCamera' as const, label: 'Camera Detection', desc: 'Monitor candidate via webcam during interview', icon: Camera, color: 'indigo' },
            { key: 'enableStrictMode' as const, label: 'Strict Mode', desc: 'Flag tab switches, face detection failures, and noise', icon: Shield, color: 'red' },
            { key: 'notifications' as const, label: 'Email Notifications', desc: 'Send email notifications on interview completion', icon: Bell, color: 'amber' },
          ].map((toggle_item) => {
            const Icon = toggle_item.icon
            const enabled = settings[toggle_item.key] as boolean
            return (
              <div key={toggle_item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    enabled ? `bg-${toggle_item.color}-500/15 text-${toggle_item.color}-400` : 'bg-white/[0.04] text-white/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">{toggle_item.label}</p>
                    <p className="text-[11px] text-white/25">{toggle_item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(toggle_item.key)}
                  className={`w-11 h-6 rounded-full transition-all duration-200 relative ${
                    enabled ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200 ${
                    enabled ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scoring weights */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" /> Scoring Weights
        </h2>
        <div className="space-y-5">
          {[
            { key: 'communicationWeight' as const, label: 'Communication', color: 'indigo' },
            { key: 'technicalWeight' as const, label: 'Technical Skills', color: 'purple' },
            { key: 'confidenceWeight' as const, label: 'Confidence', color: 'cyan' },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/50 font-medium">{item.label}</span>
                <span className="text-white/60 font-bold">{settings[item.key]}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings[item.key] as number}
                onChange={(e) => setSettings({ ...settings, [item.key]: +e.target.value })}
                className="w-full accent-indigo-500"
              />
            </div>
          ))}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
            <span className="text-xs text-white/30">
              Total Weight: <span className={`font-bold ${
                settings.communicationWeight + settings.technicalWeight + settings.confidenceWeight === 100
                  ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {settings.communicationWeight + settings.technicalWeight + settings.confidenceWeight}%
              </span>
              {" "}(should be 100%)
            </span>
          </div>
        </div>
      </div>

      {/* Save */}
      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  )
}
