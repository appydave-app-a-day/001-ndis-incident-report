import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useIncidentStore } from '@/store/useIncidentStore';

export const NarrativeInputStep: React.FC = () => {
  const { 
    report, 
    updateNarrative, 
    isLoadingQuestions 
  } = useIncidentStore();
  
  const [formData, setFormData] = useState(report.narrative);

  // Update store when form data changes
  useEffect(() => {
    updateNarrative(formData);
  }, [formData, updateNarrative]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <StepHeader
        stepNumber={2}
        title="Step 2: Incident Narrative"
        subtitle="Provide detailed descriptions for each phase of the incident"
        onViewContent={() => console.log('View content clicked')}
      />
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <form>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="form-field">
                    <Label htmlFor="before" className="custom-label">
                      Before the Event
                    </Label>
                    <Textarea
                      id="before"
                      value={formData.before}
                      onChange={(e) => handleInputChange('before', e.target.value)}
                      placeholder="Describe what was happening before the incident occurred. Include relevant context, activities, and any notable circumstances..."
                      className="min-h-[150px]"
                      rows={6}
                    />
                  </div>

                  <div className="form-field">
                    <Label htmlFor="during" className="custom-label">
                      During the Event
                    </Label>
                    <Textarea
                      id="during"
                      value={formData.during}
                      onChange={(e) => handleInputChange('during', e.target.value)}
                      placeholder="Describe what happened during the incident. Include specific actions, behaviors, and reactions observed..."
                      className="min-h-[150px]"
                      rows={6}
                    />
                  </div>

                  <div className="form-field">
                    <Label htmlFor="end" className="custom-label">
                      End of the Event
                    </Label>
                    <Textarea
                      id="end"
                      value={formData.end}
                      onChange={(e) => handleInputChange('end', e.target.value)}
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