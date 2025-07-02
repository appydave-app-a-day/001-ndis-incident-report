import { BarChart3, Settings, Wand2, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';

import { CommandPalette } from '@/components/layout/CommandPalette';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    section: 'home',
    label: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    section: 'capture',
    label: 'Incident Capture',
    href: '/capture',
    icon: Wand2,
  },
  {
    section: 'analysis',
    label: 'Analysis',
    href: '/analysis',
    icon: FileText,
  },
];

export const AppLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/capture') return 'capture';
    if (path === '/analysis') return 'analysis';
    return 'home';
  };

  const sectionTitles = {
    home: 'Dashboard',
    capture: 'Incident Capture Workflow',
    analysis: 'Incident Analysis Workflow',
  };

  const currentSection = getCurrentSection();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandPaletteAction = (action: string) => {
    switch (action) {
      case 'dashboard':
        navigate('/');
        break;
      case 'capture':
        navigate('/capture');
        break;
      case 'analysis':
        navigate('/analysis');
        break;
      case 'settings':
        setIsSettingsOpen(true);
        break;
    }
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="flex h-screen bg-secondary dark:bg-background">
      {/* Fixed Sidebar */}
      <div className="sidebar-container bg-card border-r border-border flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">
            NDIS Assistant
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.section;
              
              return (
                <button
                  key={item.section}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'nav-button',
                    isActive ? 'nav-button-active' : 'nav-button-inactive'
                  )}
                >
                  <Icon className="nav-button-icon" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Settings Button */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="nav-button nav-button-inactive w-full text-left"
          >
            <Settings className="nav-button-icon" />
            Settings
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card shadow-sm border-b border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              {sectionTitles[currentSection]}
            </h2>
            <div className="flex items-center space-x-4">
              <kbd
                className="custom-kbd"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                ⌘K
              </kbd>
              <span className="quick-search-text">
                Quick Search
              </span>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-secondary dark:bg-background">
          {isHome ? (
            <div className="h-full p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    Welcome to NDIS Incident Documentation Assistant
                  </h1>
                  <p className="text-xl text-muted-foreground">
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
                        className="block p-8 bg-card rounded-xl border border-border hover:shadow-xl hover:shadow-border/60 transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-6">
                          <div className="p-4 bg-accent/20 rounded-xl">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                              {item.label}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
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
            <div className="p-6">
              <Outlet />
            </div>
          )}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAction={handleCommandPaletteAction}
      />
    </div>
  );
};

export default AppLayout;