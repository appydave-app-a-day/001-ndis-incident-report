import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useIncidentStore } from '@/store/useIncidentStore';

export const MetadataInputStep: React.FC = () => {
  const { report, updateMetadata } = useIncidentStore();
  const [formData, setFormData] = useState(report.metadata);

  // Update store when form data changes
  useEffect(() => {
    updateMetadata(formData);
  }, [formData, updateMetadata]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <StepHeader
        stepNumber={1}
        title="Step 1: Incident Metadata"
        subtitle="Enter the basic information about the incident"
        icon={<Calendar className="w-7 h-7 text-white" />}
        onViewContent={() => console.log('View content clicked')}
      />
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-field">
                    <Label htmlFor="reporterName" className="custom-label">
                      Reporter Name
                    </Label>
                    <Input
                      id="reporterName"
                      type="text"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange('reporterName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <Label htmlFor="participantName" className="custom-label">
                      Participant Name
                    </Label>
                    <Input
                      id="participantName"
                      type="text"
                      value={formData.participantName}
                      onChange={(e) => handleInputChange('participantName', e.target.value)}
                      placeholder="Enter participant's full name"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="form-field-after-grid">
                  <Label htmlFor="eventDateTime" className="custom-label">
                    Event Date & Time
                  </Label>
                  <Input
                    id="eventDateTime"
                    type="datetime-local"
                    value={formData.eventDateTime}
                    onChange={(e) => handleInputChange('eventDateTime', e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="form-field-after-grid">
                  <Label htmlFor="location" className="custom-label">
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter the location where the incident occurred"
                    className="w-full"
                    required
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};