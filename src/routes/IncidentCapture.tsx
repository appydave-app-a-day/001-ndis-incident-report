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
    <div className="px-6 py-6">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">
            Date & Time
          </label>
          <p className="text-base text-gray-700 font-medium">December 6, 2024 - 10:30 AM</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">
            Location
          </label>
          <p className="text-base text-gray-700 font-medium">Community Center - Main Hall</p>
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
    <div className="px-6 py-6">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">
            Participant
          </label>
          <p className="text-base text-gray-700 font-medium">John Doe</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">
            Staff Member
          </label>
          <p className="text-base text-gray-700 font-medium">Jane Smith</p>
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
    <div className="px-6 py-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
        <label className="text-sm font-semibold text-gray-900 block mb-3">
          Description
        </label>
        <p className="text-base text-gray-700 leading-relaxed">
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
    <div className="px-6 py-6">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">
            Immediate Response
          </label>
          <p className="text-base text-gray-700 leading-relaxed">Staff provided assistance and ensured participant safety</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">
            Medical Attention
          </label>
          <p className="text-base text-gray-700 leading-relaxed">First aid administered, no further medical attention required</p>
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
    <div className="px-6 py-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-sm font-semibold text-blue-900 mb-2">Ready to Submit</p>
        <p className="text-base text-gray-700 leading-relaxed">
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
    <div className='p-6'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>Incident Capture Workflow</h1>
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] flex flex-col'>
          <Wizard steps={steps} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
