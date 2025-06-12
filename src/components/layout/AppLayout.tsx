import React, { useState } from 'react';
import { Menu, X, FileText, BarChart3 } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Incident Capture',
    href: '/capture',
    icon: FileText,
    disabled: false,
    description: 'Document and capture incident details',
  },
  {
    name: 'Analysis',
    href: '/analysis',
    icon: BarChart3,
    disabled: true,
    description: 'Analyze incident patterns and trends',
  },
];

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-lg font-semibold">Workflows</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    item.disabled && 'pointer-events-none opacity-50',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-600 group-[.active]:bg-white/20 group-[.active]:text-white">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Workflows</h2>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item, index) => (
              <div key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      item.disabled && 'pointer-events-none opacity-50',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-600 group-[.active]:bg-white/20 group-[.active]:text-white">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
                <p className="mt-1 px-12 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
              NDIS Incident Documentation Assistant
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {isHome ? (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Welcome to NDIS Incident Documentation Assistant
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Select a workflow from the sidebar to begin
                </p>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
                        item.disabled && 'pointer-events-none opacity-50'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-lg font-semibold text-primary">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {item.description}
                          </p>
                          {item.disabled && (
                            <p className="mt-2 text-xs font-medium text-orange-600">
                              Coming soon
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;