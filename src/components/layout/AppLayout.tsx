import React, { useState } from 'react';
import { FileText, BarChart3, Settings } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    section: 'capture',
    label: 'Incident Capture',
    href: '/capture',
    icon: FileText,
  },
  {
    section: 'analysis',
    label: 'Analysis',
    href: '/analysis',
    icon: BarChart3,
  },
];

export const AppLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/capture') return 'capture';
    if (path === '/analysis') return 'analysis';
    return 'home';
  };

  const sectionTitles = {
    home: 'NDIS Incident Documentation',
    capture: 'Incident Capture',
    analysis: 'Analysis',
  };

  const currentSection = getCurrentSection();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-2xl shadow-gray-900/10 border-r border-gray-200/50 dark:border-gray-700 flex flex-col relative z-20">
        {/* Logo/Header */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            NDIS Assistant
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.section;
              
              return (
                <li key={item.section}>
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(
                      'w-full justify-start px-4 py-3 h-auto text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <NavLink to={item.href} className="flex items-center w-full">
                      <Icon className={cn(
                        'mr-3 h-5 w-5 transition-colors',
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      )} />
                      {item.label}
                    </NavLink>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 h-auto"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200/60 dark:border-gray-700 px-6 py-4 h-16 relative z-10">
          <div className="flex items-center justify-between h-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {sectionTitles[currentSection]}
            </h2>
            <div className="flex items-center space-x-4">
              <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 shadow-sm">
                ⌘K
              </kbd>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Quick Search
              </span>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          {isHome ? (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to NDIS Incident Documentation Assistant
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Select a workflow from the sidebar to begin
                  </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.section}
                        to={item.href}
                        className="block p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-900/20 transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-6">
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                              {item.label}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {item.section === 'capture' ? 'Document and capture incident details with our comprehensive workflow system' : 'Analyze incident patterns and trends to improve safety outcomes'}
                            </p>
                          </div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-hidden">
                <Outlet />
              </div>
            </div>
          )}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default AppLayout;