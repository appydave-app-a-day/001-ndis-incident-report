import { Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useIncidentStore } from '@/store/useIncidentStore';

export const NarrativeInputStep: React.FC = () => {
  const report = useIncidentStore(state => state.report);
  const isLoadingQuestions = useIncidentStore(state => state.isLoadingQuestions);
  const updateNarrative = useIncidentStore(state => state.updateNarrative);

  // Performance monitoring (only in development)
  const renderCountRef = useRef(0);
  if (import.meta.env.DEV) {
    renderCountRef.current++;
    console.log(`NarrativeInputStep render #${renderCountRef.current}`);
  }
  
  const [formData, setFormData] = useState(() => report.narrative);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedDataRef = useRef(report.narrative);

  // Sync local state with store when store changes externally (but not from our own updates)
  useEffect(() => {
    // Only update local state if the store change came from outside this component
    const storeDataString = JSON.stringify(report.narrative);
    const lastSyncedString = JSON.stringify(lastSyncedDataRef.current);
    
    if (storeDataString !== lastSyncedString) {
      setFormData(report.narrative);
      lastSyncedDataRef.current = report.narrative;
    }
  }, [report.narrative]);

  // Debounced store update function
  const debouncedUpdateNarrative = useCallback((data: typeof formData) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      updateNarrative(data);
      lastSyncedDataRef.current = data;
    }, 300); // 300ms debounce
  }, [updateNarrative]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [field]: value
      };
      debouncedUpdateNarrative(newFormData);
      return newFormData;
    });
  }, [debouncedUpdateNarrative]);

  return (
    <div>
      <StepHeader
        stepNumber={2}
        title="Step 2: Incident Narrative"
        subtitle="Provide detailed descriptions for each phase of the incident"
        onViewContent={() => console.log('View content clicked')}
        panelType="narrative-input"
      />
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <form>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="form-field">
                    <Label htmlFor="beforeEvent" className="custom-label">
                      Before the Event
                    </Label>
                    <Textarea
                      id="beforeEvent"
                      value={formData.beforeEvent}
                      onChange={(e) => handleInputChange('beforeEvent', e.target.value)}
                      placeholder="Describe what was happening before the incident occurred. Include relevant context, activities, and any notable circumstances..."
                      className="min-h-[150px]"
                      rows={6}
                    />
                  </div>

                  <div className="form-field">
                    <Label htmlFor="duringEvent" className="custom-label">
                      During the Event
                    </Label>
                    <Textarea
                      id="duringEvent"
                      value={formData.duringEvent}
                      onChange={(e) => handleInputChange('duringEvent', e.target.value)}
                      placeholder="Describe what happened during the incident. Include specific actions, behaviors, and reactions observed..."
                      className="min-h-[150px]"
                      rows={6}
                    />
                  </div>

                  <div className="form-field">
                    <Label htmlFor="endEvent" className="custom-label">
                      End of the Event
                    </Label>
                    <Textarea
                      id="endEvent"
                      value={formData.endEvent}
                      onChange={(e) => handleInputChange('endEvent', e.target.value)}
                      placeholder="Describe how the incident concluded. What actions were taken to resolve or de-escalate the situation..."
                      className="min-h-[150px]"
                      rows={6}
                    />
                  </div>

                  <div className="form-field">
                    <Label htmlFor="postEvent" className="custom-label">
                      Post-Event Support
                    </Label>
                    <Textarea
                      id="postEvent"
                      value={formData.postEvent}
                      onChange={(e) => handleInputChange('postEvent', e.target.value)}
                      placeholder="Describe any follow-up actions, support provided, or ongoing considerations after the incident..."
                      className="min-h-[150px]"
                      rows={6}
                    />
                  </div>
                </div>

                {/* Loading state display */}
                {isLoadingQuestions && (
                  <div className="form-field-after-grid">
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <AlertDescription>
                        Preparing clarification questions based on your narrative...
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};