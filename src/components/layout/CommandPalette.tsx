import { BarChart3, Wand2, FileText, Settings, X } from 'lucide-react';
import React from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const commands = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, shortcut: 'D' },
  { id: 'capture', label: 'Incident Capture', icon: Wand2, shortcut: 'C' },
  { id: 'analysis', label: 'Analysis', icon: FileText, shortcut: 'A' },
  { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'S' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onAction,
}) => {
  if (!isOpen) return null;

  const handleAction = (actionId: string) => {
    onAction(actionId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Navigation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commands */}
        <div className="p-2">
          {commands.map((command) => {
            const Icon = command.icon;
            return (
              <button
                key={command.id}
                onClick={() => handleAction(command.id)}
                className="w-full flex items-center justify-between px-3 py-3 text-left rounded hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center">
                  <Icon className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-900">{command.label}</span>
                </div>
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-600 opacity-60 group-hover:opacity-100">
                  {command.shortcut}
                </kbd>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};