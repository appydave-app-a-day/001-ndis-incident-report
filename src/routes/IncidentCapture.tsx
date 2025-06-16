import { Wizard } from '@/components/wizard';
import { StepHeader } from '@/components/wizard/StepHeader';
import type { WizardStep } from '@/components/wizard';
import { Calendar, Users, FileText, Shield, CheckCircle } from 'lucide-react';

const Step1 = () => (
  <div>
    <StepHeader
      stepNumber={1}
      title="Step 1: Basic Information"
      subtitle="Collect basic information about the incident."
      icon={<Calendar className="w-7 h-7 text-white" />}
      onViewContent={() => console.log('View content clicked')}
    />
    <div className="px-xxxl py-xxl">
      <div className="space-y-6">
        <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
          <label className="text-label text-primary-text font-semibold block mb-4">
            Date & Time
          </label>
          <p className="text-body text-primary-text font-medium">December 6, 2024 - 10:30 AM</p>
        </div>
        <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
          <label className="text-label text-primary-text font-semibold block mb-4">
            Location
          </label>
          <p className="text-body text-primary-text font-medium">Community Center - Main Hall</p>
        </div>
      </div>
    </div>
  </div>
);

const Step2 = () => (
  <div>
    <StepHeader
      stepNumber={2}
      title="Step 2: People Involved"
      subtitle="Identify all people involved in the incident."
      icon={<Users className="w-7 h-7 text-white" />}
      onViewContent={() => console.log('View content clicked')}
    />
    <div className="px-xxxl py-xxl">
      <div className="space-y-6">
        <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
          <label className="text-label text-primary-text font-semibold block mb-4">
            Participant
          </label>
          <p className="text-body text-primary-text font-medium">John Doe</p>
        </div>
        <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
          <label className="text-label text-primary-text font-semibold block mb-4">
            Staff Member
          </label>
          <p className="text-body text-primary-text font-medium">Jane Smith</p>
        </div>
      </div>
    </div>
  </div>
);

const Step3 = () => (
  <div>
    <StepHeader
      stepNumber={3}
      title="Step 3: Incident Details"
      subtitle="Describe what happened during the incident."
      icon={<FileText className="w-7 h-7 text-white" />}
      onViewContent={() => console.log('View content clicked')}
    />
    <div className="px-xxxl py-xxl">
      <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
        <label className="text-label text-primary-text font-semibold block mb-4">
          Description
        </label>
        <p className="text-body text-primary-text leading-relaxed">
          The participant experienced difficulty with mobility during the morning activity session...
        </p>
      </div>
    </div>
  </div>
);

const Step4 = () => (
  <div>
    <StepHeader
      stepNumber={4}
      title="Step 4: Actions Taken"
      subtitle="Document the immediate actions taken."
      icon={<Shield className="w-7 h-7 text-white" />}
      onViewContent={() => console.log('View content clicked')}
    />
    <div className="px-xxxl py-xxl">
      <div className="space-y-6">
        <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
          <label className="text-label text-primary-text font-semibold block mb-4">
            Immediate Response
          </label>
          <p className="text-body text-primary-text leading-relaxed">Staff provided assistance and ensured participant safety</p>
        </div>
        <div className="bg-card-background border-2 border-border-light rounded-md p-6 hover:border-border-medium transition-colors duration-200">
          <label className="text-label text-primary-text font-semibold block mb-4">
            Medical Attention
          </label>
          <p className="text-body text-primary-text leading-relaxed">First aid administered, no further medical attention required</p>
        </div>
      </div>
    </div>
  </div>
);

const Step5 = () => (
  <div>
    <StepHeader
      stepNumber={5}
      title="Step 5: Review & Submit"
      subtitle="Review all information before submitting."
      icon={<CheckCircle className="w-7 h-7 text-white" />}
      onViewContent={() => console.log('View content clicked')}
    />
    <div className="px-xxxl py-xxl">
      <div className="bg-light-blue border-2 border-primary-blue/20 rounded-md p-6">
        <p className="text-label text-deep-navy font-semibold mb-2">Ready to Submit</p>
        <p className="text-body text-primary-text leading-relaxed">
          All required information has been collected. Click Finish to submit the incident report.
        </p>
      </div>
    </div>
  </div>
);

export default function IncidentCapture() {
  const steps: WizardStep[] = [
    { id: 'basic-info', title: 'Basic Info', component: Step1 },
    { id: 'people', title: 'People', component: Step2 },
    { id: 'details', title: 'Details', component: Step3 },
    { id: 'actions', title: 'Actions', component: Step4 },
    { id: 'review', title: 'Review', component: Step5 },
  ];

  const handleComplete = () => {
    console.log('Wizard completed!');
    alert('Incident report submitted successfully!');
  };

  return (
    <div className='p-4 md:p-8'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold mb-4 md:mb-6'>Incident Capture Workflow</h1>
        <div className='bg-white rounded-lg shadow-sm border min-h-[500px] flex flex-col'>
          <Wizard steps={steps} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
