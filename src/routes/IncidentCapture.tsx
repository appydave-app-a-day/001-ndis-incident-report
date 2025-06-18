import { BeforeEventClarificationStep } from '@/components/BeforeEventClarificationStep';
import { DuringEventClarificationStep } from '@/components/DuringEventClarificationStep';
import { MetadataInputStep } from '@/components/MetadataInputStep';
import { NarrativeInputStep } from '@/components/NarrativeInputStep';
import { Wizard } from '@/components/wizard';
import type { WizardStep } from '@/components/wizard';
import { StepHeader } from '@/components/wizard/StepHeader';
import { IncidentApiService } from '@/lib/services/api';
import { useIncidentStore } from '@/store/useIncidentStore';


const Step1 = () => <MetadataInputStep />;

const Step2 = () => <NarrativeInputStep />;

const Step3 = () => <BeforeEventClarificationStep />;

const Step4 = () => <DuringEventClarificationStep />;

const Step5 = () => (
  <div>
    <StepHeader
      stepNumber={5}
      title="Step 5: Review & Submit"
      subtitle="Review all information before submitting."
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
  const { isMetadataComplete, isNarrativeComplete, report, setClarificationQuestions, setLoadingQuestions } = useIncidentStore();

  // Function to fetch clarification questions when leaving narrative step
  const fetchClarificationQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const questions = await IncidentApiService.getClarificationQuestions(report.narrative);
      setClarificationQuestions(questions);
    } catch (error) {
      console.error('Failed to fetch clarification questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const steps: WizardStep[] = [
    { 
      id: 'basic-info', 
      title: 'Basic Info', 
      component: Step1,
      isValid: isMetadataComplete
    },
    { 
      id: 'narrative', 
      title: 'Narrative', 
      component: Step2,
      isValid: isNarrativeComplete,
      onLeave: fetchClarificationQuestions
    },
    { id: 'before-clarification', title: 'Before Event', component: Step3 },
    { id: 'during-clarification', title: 'During Event', component: Step4 },
    { id: 'review', title: 'Review', component: Step5 },
  ];

  const handleComplete = () => {
    console.log('Wizard completed!');
    alert('Incident report submitted successfully!');
  };

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='wizard-container flex flex-col'>
          <Wizard steps={steps} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
