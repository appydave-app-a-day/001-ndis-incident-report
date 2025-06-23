# Progressive Enhancement Pattern

## Overview

Progressive enhancement is a design pattern where features are enhanced incrementally as users progress through a workflow. In this application, it's primarily used for AI-powered narrative consolidation, processing each phase of an incident report independently rather than in batch.

## Core Concept

Instead of processing all data at once at the end of a workflow, progressive enhancement:
- Processes data incrementally at natural transition points
- Provides immediate feedback for completed sections
- Allows graceful degradation if later steps fail
- Reduces cognitive load by showing results progressively

## Implementation in Incident Capture

### Workflow Structure

```
Step 1: Metadata Input
Step 2: Narrative Input (4 phases)
Step 3: Before Event Clarification → [Progressive Consolidation]
Step 4: During Event Clarification → [Progressive Consolidation]
Step 5: End Event Clarification → [Progressive Consolidation]
Step 6: Post-Event Clarification → [Progressive Consolidation]
Step 7: Review (Shows all enhanced narratives)
```

### Key Benefits Discovered

1. **Better User Experience** - Users see their enhanced content sooner
2. **Reduced API Load** - Smaller, focused requests vs. large batch
3. **Failure Isolation** - One phase failing doesn't block others
4. **Natural Progress Indication** - Enhancement aligns with workflow

## Technical Implementation

### 1. Hook Pattern

The `useProgressiveEnhancement` hook provides a reusable pattern:

```typescript
const {
  status,        // Status for each phase
  results,       // Enhanced results
  enhancePhase,  // Process single phase
  retry,         // Retry failed phase
  isProcessing,  // Global processing state
} = useProgressiveEnhancement(
  phases,
  enhancerFunction,
  options
);
```

### 2. Integration with Wizard Flow

```typescript
// In clarification step components
const handleNext = async () => {
  const currentPhase = getCurrentPhase();
  
  // Show processing modal
  setShowProcessingModal(true);
  
  try {
    // Enhance current phase before moving to next step
    await consolidatePhase(currentPhase);
    wizard.nextStep();
  } catch (error) {
    // Handle error but allow progression
    console.error('Consolidation failed:', error);
    wizard.nextStep();
  } finally {
    setShowProcessingModal(false);
  }
};
```

### 3. State Management

```typescript
// Store tracks consolidation status per phase
interface ConsolidationStatus {
  beforeEvent: 'pending' | 'loading' | 'complete' | 'error';
  duringEvent: 'pending' | 'loading' | 'complete' | 'error';
  endEvent: 'pending' | 'loading' | 'complete' | 'error';
  postEvent: 'pending' | 'loading' | 'complete' | 'error';
}

// Store enhanced narratives separately
interface NarrativeExtras {
  beforeEvent: string;
  duringEvent: string;
  endEvent: string;
  postEvent: string;
}
```

## UX Patterns

### 1. Processing Modal

Shows clear feedback during enhancement:

```typescript
<Modal open={isProcessing}>
  <ModalContent>
    <h2>Enhancing Narrative</h2>
    <p>Enhancing {phaseName} narrative with AI assistance...</p>
    <Spinner size="large" />
  </ModalContent>
</Modal>
```

### 2. Status Indicators

Visual feedback for completed enhancements:

```typescript
<PhaseIndicator 
  phase="beforeEvent" 
  status={consolidationStatus.beforeEvent}
/>
// Shows: ✓ Enhanced, ⟳ Processing, ✗ Failed, - Pending
```

### 3. Progressive Reveal

Review screen shows enhanced content progressively:

```typescript
{phase.status === 'complete' ? (
  <EnhancedNarrative content={phase.enhanced} />
) : (
  <OriginalNarrative content={phase.original} />
)}
```

## Error Handling Strategy

### 1. Graceful Degradation

If enhancement fails, show original content:

```typescript
const displayContent = 
  consolidationStatus[phase] === 'complete' 
    ? narrativeExtras[phase] 
    : narrative[phase];
```

### 2. Retry Mechanism

Allow users to retry failed enhancements:

```typescript
{status === 'error' && (
  <Button onClick={() => retryConsolidation(phase)}>
    <RefreshIcon /> Retry Enhancement
  </Button>
)}
```

### 3. Partial Success

Continue workflow even if some phases fail:

```typescript
// Review screen shows mix of enhanced and original
const report = {
  beforeEvent: extras.beforeEvent || narrative.beforeEvent,
  duringEvent: extras.duringEvent || narrative.duringEvent,
  // ... etc
};
```

## Performance Considerations

### 1. Caching Strategy

Prevent re-processing unchanged content:

```typescript
// Hash narrative + answers to detect changes
const contentHash = hashContent(narrative, answers);

if (cachedHash[phase] === contentHash) {
  // Skip consolidation, use cached result
  return cachedResult[phase];
}
```

### 2. Parallel vs Sequential

Current implementation is sequential, but could be parallel:

```typescript
// Sequential (current)
for (const phase of phases) {
  await enhancePhase(phase);
}

// Parallel (potential optimization)
await Promise.all(
  phases.map(phase => enhancePhase(phase))
);
```

### 3. Preemptive Loading

Could pre-process while user fills forms:

```typescript
// Start processing as soon as clarifications complete
useEffect(() => {
  if (answersComplete && !consolidated) {
    startConsolidation();
  }
}, [answersComplete]);
```

## Alternative Approaches Considered

### 1. Batch Processing (Original Design)

**Pros:**
- Single API call
- Atomic operation
- Simpler state management

**Cons:**
- Long wait at end
- All-or-nothing results
- Poor failure recovery

### 2. Real-time Processing

**Pros:**
- Instant feedback
- No explicit wait

**Cons:**
- Complex debouncing
- Excessive API calls
- Difficult to implement

### 3. Background Processing

**Pros:**
- No blocking UI
- Process while user continues

**Cons:**
- Complex synchronization
- Confusing UX
- Race conditions

## Lessons Learned

1. **User Perception** - Breaking up long operations improves perceived performance
2. **Natural Boundaries** - Process at workflow transition points
3. **Failure Isolation** - Independent processing enables partial success
4. **Flexibility Required** - Initial design should accommodate progressive patterns

## Best Practices

### 1. Identify Natural Processing Points

```typescript
// Good: Process after meaningful user input
onClarificationComplete: () => enhance(phase)

// Bad: Process on every keystroke
onChange: () => enhance(phase) // Too frequent
```

### 2. Provide Clear Feedback

```typescript
// Show what's happening
"Enhancing Before Event narrative..."

// Not just generic
"Processing..." // Too vague
```

### 3. Enable User Control

```typescript
// Allow skipping/retrying
<Button onClick={skipEnhancement}>Continue without enhancement</Button>
<Button onClick={retryEnhancement}>Try again</Button>
```

### 4. Design for Failure

```typescript
// Always have fallback content
const content = enhanced || original || placeholder;
```

## Future Enhancements

1. **Parallel Processing** - Process multiple phases simultaneously
2. **Preemptive Processing** - Start before user completes step
3. **Differential Updates** - Only process changed content
4. **Streaming Results** - Show partial results as available
5. **Quality Indicators** - Show enhancement confidence scores

## Code Example: Full Implementation

```typescript
// Component using progressive enhancement
export const ClarificationStep: React.FC<{ phase: Phase }> = ({ phase }) => {
  const { wizard } = useWizard();
  const { consolidatePhase } = useIncidentStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleNext = async () => {
    setIsProcessing(true);
    
    try {
      // Progressive enhancement happens here
      await consolidatePhase(phase);
      
      // Success - move to next step
      wizard.nextStep();
    } catch (error) {
      // Log error but allow progression
      console.error(`Failed to enhance ${phase}:`, error);
      
      // Still move forward - graceful degradation
      wizard.nextStep();
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <StepContent>
        {/* Clarification questions UI */}
      </StepContent>
      
      <StepActions>
        <Button onClick={wizard.previousStep}>Back</Button>
        <Button onClick={handleNext} disabled={isProcessing}>
          {isProcessing ? 'Enhancing...' : 'Next'}
        </Button>
      </StepActions>
      
      {isProcessing && (
        <ProcessingModal phase={phase} />
      )}
    </>
  );
};
```

## Conclusion

Progressive enhancement emerged as a superior pattern for multi-step workflows with AI integration. By processing data at natural transition points, it provides better user experience, improved error handling, and more flexible architecture. This pattern should be considered for any workflow involving multiple processing steps.