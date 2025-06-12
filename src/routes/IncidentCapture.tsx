import { Wizard } from '@/components/wizard';
import type { WizardStep } from '@/components/wizard';

const Step1 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 1: Basic Information</h2>
    <p className="text-gray-600 mb-4">Collect basic information about the incident.</p>
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Date & Time</p>
        <p className="font-medium">December 6, 2024 - 10:30 AM</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Location</p>
        <p className="font-medium">Community Center - Main Hall</p>
      </div>
    </div>
  </div>
);

const Step2 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 2: People Involved</h2>
    <p className="text-gray-600 mb-4">Identify all people involved in the incident.</p>
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Participant</p>
        <p className="font-medium">John Doe</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Staff Member</p>
        <p className="font-medium">Jane Smith</p>
      </div>
    </div>
  </div>
);

const Step3 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 3: Incident Details</h2>
    <p className="text-gray-600 mb-4">Describe what happened during the incident.</p>
    <div className="rounded-lg border p-4">
      <p className="text-sm text-gray-500">Description</p>
      <p className="font-medium">The participant experienced difficulty with mobility during the morning activity session...</p>
    </div>
  </div>
);

const Step4 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 4: Actions Taken</h2>
    <p className="text-gray-600 mb-4">Document the immediate actions taken.</p>
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Immediate Response</p>
        <p className="font-medium">Staff provided assistance and ensured participant safety</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Medical Attention</p>
        <p className="font-medium">First aid administered, no further medical attention required</p>
      </div>
    </div>
  </div>
);

const Step5 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 5: Review & Submit</h2>
    <p className="text-gray-600 mb-4">Review all information before submitting.</p>
    <div className="rounded-lg border bg-blue-50 p-4">
      <p className="text-sm font-medium text-blue-900">Ready to Submit</p>
      <p className="text-sm text-blue-700">All required information has been collected. Click Finish to submit the incident report.</p>
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
    <div className='min-h-screen p-4 md:p-8 max-w-5xl mx-auto'>
      <h1 className='text-2xl md:text-3xl font-bold mb-4 md:mb-6'>Incident Capture</h1>
      <div className='bg-white rounded-lg shadow-sm border min-h-[500px] flex flex-col'>
        <Wizard steps={steps} onComplete={handleComplete} />
      </div>
    </div>
  );
}
