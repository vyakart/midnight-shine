import React from 'react'
import { TerminalToggle } from '../components/Terminal/TerminalToggle'

export const Terminal: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Terminal
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Interactive terminal interface. Choose between Simple (better input) or Enhanced (visual effects) mode.
          </p>
        </div>

        {/* Terminal with Toggle */}
        <TerminalToggle
          defaultMode="simple"
          className="mb-8"
        />

        {/* Terminal Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Type <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">help</code> to see all commands</li>
              <li>• Use <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">Tab</code> for auto-completion</li>
              <li>• Arrow keys navigate command history</li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">Ctrl+L</code> to clear terminal</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🚀 Try These Commands
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">whoami</code> - About me</li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">ls</code> - List files</li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">projects</code> - My work</li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">contact</code> - Get in touch</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🎛️ Terminal Modes
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• <span className="text-green-500 font-semibold">Simple:</span> Clean interface, better input</li>
              <li>• <span className="text-cyan-500 font-semibold">Enhanced:</span> Visual effects, animations</li>
              <li>• Switch modes using the toggle above</li>
              <li>• Performance mode auto-enables if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}