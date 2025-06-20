
import { BeforeEventClarificationStep } from '@/components/BeforeEventClarificationStep';
import { DuringEventClarificationStep } from '@/components/DuringEventClarificationStep';
import { EndOfEventClarificationStep } from '@/components/EndOfEventClarificationStep';
import { IncidentReviewStep } from '@/components/IncidentReviewStep';
import { MetadataInputStep } from '@/components/MetadataInputStep';
import { NarrativeInputStep } from '@/components/NarrativeInputStep';
import { PostEventSupportClarificationStep } from '@/components/PostEventSupportClarificationStep';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Wizard } from '@/components/wizard';
import type { WizardStep } from '@/components/wizard';
import { useIncidentStore } from '@/store/useIncidentStore';


const Step1 = () => <MetadataInputStep />;

const Step2 = () => <NarrativeInputStep />;

const Step3 = () => <BeforeEventClarificationStep />;

const Step4 = () => <DuringEventClarificationStep />;

const Step5 = () => <EndOfEventClarificationStep />;

const Step6 = () => <PostEventSupportClarificationStep />;

const Step7 = () => <IncidentReviewStep />;

export default function IncidentCapture() {
  const { 
    isMetadataComplete, 
    isNarrativeComplete, 
    loadingOverlay,
    fetchClarificationQuestionsIfNeeded,
    consolidatePhaseNarrative
  } = useIncidentStore();

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
      onLeave: fetchClarificationQuestionsIfNeeded
    },
    { 
      id: 'before-clarification', 
      title: 'Before Event', 
      component: Step3,
      onLeave: () => consolidatePhaseNarrative('beforeEvent')
    },
    { 
      id: 'during-clarification', 
      title: 'During Event', 
      component: Step4,
      onLeave: () => consolidatePhaseNarrative('duringEvent')
    },
    { 
      id: 'end-clarification', 
      title: 'End of Event', 
      component: Step5,
      onLeave: () => consolidatePhaseNarrative('endEvent')
    },
    { 
      id: 'post-clarification', 
      title: 'Post-Event Support', 
      component: Step6,
      onLeave: () => consolidatePhaseNarrative('postEvent')
    },
    { id: 'review', title: 'Review', component: Step7 },
  ];

  const handleComplete = () => {
    alert('Incident report submitted successfully!');
  };

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='wizard-container flex flex-col'>
          <Wizard steps={steps} onComplete={handleComplete} />
        </div>
      </div>
      
      {/* Global Loading Overlay */}
      <LoadingOverlay
        isOpen={loadingOverlay.isOpen}
        message={loadingOverlay.message}
      />
    </div>
  );
}
