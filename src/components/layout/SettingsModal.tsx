import { Sun, Moon, Settings2, Bug, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { useTheme } from "@/lib/hooks/useTheme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const isDev = import.meta.env.DEV;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }} />
        <DialogContent style={{ 
          maxWidth: '500px', 
          width: '90vw',
          backgroundColor: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Hide the default Radix close button */}
          <style>{`
            /* Hide the hardcoded close button from DialogContent */
            .absolute.right-4.top-4 {
              display: none !important;
            }
            /* Also target by component structure */
            [data-radix-dialog-content] > button:last-child {
              display: none !important;
            }
          `}</style>
        <DialogHeader style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings2 style={{ width: '24px', height: '24px', color: 'hsl(var(--primary))' }} />
              <DialogTitle style={{ fontSize: '24px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                Settings
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '6px',
                color: 'hsl(var(--muted-foreground))',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                minHeight: '32px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'hsl(var(--foreground))';
                e.currentTarget.style.backgroundColor = 'hsl(var(--muted))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </Button>
          </div>
        </DialogHeader>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Theme Section */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '16px' 
            }}>
              <Sun style={{ width: '18px', height: '18px', color: 'hsl(var(--muted-foreground))' }} />
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'hsl(var(--foreground))' 
              }}>
                Appearance
              </label>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))'
            }}>
              <Button
                variant={theme === "light" ? "default" : "secondary"}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '12px 16px',
                  height: 'auto'
                }}
                onClick={() => setTheme("light")}
              >
                <Sun style={{ width: '16px', height: '16px' }} />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "secondary"}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '12px 16px',
                  height: 'auto'
                }}
                onClick={() => setTheme("dark")}
              >
                <Moon style={{ width: '16px', height: '16px' }} />
                Dark
              </Button>
            </div>
          </div>

          {/* Development Options */}
          {isDev && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '16px' 
              }}>
                <Bug style={{ width: '18px', height: '18px', color: 'hsl(var(--muted-foreground))' }} />
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'hsl(var(--foreground))' 
                }}>
                  Development
                </label>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: 'hsl(var(--muted))',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'hsl(var(--muted-foreground))',
                  marginBottom: '12px' 
                }}>
                  Current debug settings:
                </div>
                <div style={{ 
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  backgroundColor: 'hsl(var(--background))',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid hsl(var(--border))',
                  lineHeight: '1.5'
                }}>
                  <div>VITE_SHOW_TOAST_DEBUG={import.meta.env.VITE_SHOW_TOAST_DEBUG || 'false'}</div>
                  <div>VITE_SHOW_API_DEBUG={import.meta.env.VITE_SHOW_API_DEBUG || 'false'}</div>
                  <div>VITE_API_MODE={import.meta.env.VITE_API_MODE || 'mock'}</div>
                  <div>DEV_MODE={isDev ? 'true' : 'false'}</div>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'hsl(var(--muted-foreground))',
                  marginTop: '8px' 
                }}>
                  Edit .env file and restart server to change these values
                </div>
              </div>
            </div>
          )}
        </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}