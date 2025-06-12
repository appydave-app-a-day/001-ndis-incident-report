import { Wizard } from '@/components/wizard';
import type { WizardStep } from '@/components/wizard';

const Step1 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 1: Basic Information</h2>
    <p className="text-gray-600">This is the first step of the wizard.</p>
  </div>
);

const Step2 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 2: Incident Details</h2>
    <p className="text-gray-600">This is the second step of the wizard.</p>
  </div>
);

const Step3 = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Step 3: Review</h2>
    <p className="text-gray-600">This is the final step of the wizard.</p>
  </div>
);

export default function IncidentCapture() {
  const steps: WizardStep[] = [
    { id: 'basic-info', title: 'Basic Information', component: Step1 },
    { id: 'incident-details', title: 'Incident Details', component: Step2 },
    { id: 'review', title: 'Review', component: Step3 },
  ];

  const handleComplete = () => {
    console.log('Wizard completed!');
    alert('Wizard completed successfully!');
  };

  return (
    <div className='min-h-screen p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Incident Capture</h1>
      <div className='bg-white rounded-lg shadow-sm border min-h-[400px] flex flex-col'>
        <Wizard steps={steps} onComplete={handleComplete} />
      </div>
    </div>
  );
}
