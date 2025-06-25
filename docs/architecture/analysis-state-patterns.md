# Analysis State Management Patterns

## Overview

This document defines the state management architecture for Epic 5's analysis workflow, building on patterns established in Epic 4.

## State Store Architecture

### Analysis Store Structure

```typescript
// src/store/useAnalysisStore.ts

interface AnalysisStore {
  // ===== Data Layer =====
  analysisData: {
    // Source data from capture workflow
    capturedNarrative: {
      consolidatedNarrative: string;
      metadata: IncidentMetadata;
      timestamp: string;
    };
    
    // AI-generated analysis
    contributingConditions: {
      original: string;      // AI-generated text
      edited: string;        // User-edited version
      lastModified?: Date;
    };
    
    classifications: {
      original: IncidentClassification[];  // AI-suggested
      edited: IncidentClassification[];    // User-curated
    };
  };

  // ===== UI State Layer =====
  uiState: {
    // Prefetch status tracking
    prefetchStatus: {
      conditions: LoadingStatus;
      classifications: LoadingStatus;
      error?: string;
    };
    
    // Current step state
    currentStep: number;
    isAnalysisComplete: boolean;
    
    // Modal/dialog states
    showAddClassificationModal: boolean;
  };

  // ===== Actions Layer =====
  // Data actions
  setNarrative: (narrative: CapturedNarrative) => void;
  updateContributingConditions: (conditions: string) => void;
  setClassifications: (classifications: IncidentClassification[]) => void;
  addClassification: (classification: IncidentClassification) => void;
  updateClassification: (id: string, updates: Partial<IncidentClassification>) => void;
  removeClassification: (id: string) => void;
  
  // Async actions
  prefetchAnalysisData: () => Promise<void>;
  completeAnalysis: () => void;
  
  // UI actions
  setCurrentStep: (step: number) => void;
  toggleAddClassificationModal: () => void;
  
  // Utility actions
  resetAnalysis: () => void;
  loadFromIncidentCapture: () => void;
}

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

interface IncidentClassification {
  id: string;
  incidentType: 'Behavioural' | 'Environmental' | 'Medical' | 'Communication';
  supportingEvidence: string;
  confidence?: number;
}
```

## Implementation Patterns

### 1. Progressive Data Loading

```typescript
// Progressive prefetch implementation
const prefetchAnalysisData = async () => {
  const { capturedNarrative } = get().analysisData;
  
  // Set loading states
  set((state) => ({
    uiState: {
      ...state.uiState,
      prefetchStatus: {
        conditions: 'loading',
        classifications: 'loading'
      }
    }
  }));
  
  // Parallel fetch with individual error handling
  const [conditionsResult, classificationsResult] = await Promise.allSettled([
    apiService.fetchContributingConditions(capturedNarrative.consolidatedNarrative),
    apiService.fetchIncidentClassifications(capturedNarrative.consolidatedNarrative)
  ]);
  
  // Handle conditions result
  if (conditionsResult.status === 'fulfilled') {
    set((state) => ({
      analysisData: {
        ...state.analysisData,
        contributingConditions: {
          original: conditionsResult.value.contributingConditions,
          edited: conditionsResult.value.contributingConditions
        }
      },
      uiState: {
        ...state.uiState,
        prefetchStatus: {
          ...state.uiState.prefetchStatus,
          conditions: 'success'
        }
      }
    }));
  } else {
    // Handle error state
    set((state) => ({
      uiState: {
        ...state.uiState,
        prefetchStatus: {
          ...state.uiState.prefetchStatus,
          conditions: 'error',
          error: conditionsResult.reason.message
        }
      }
    }));
  }
  
  // Similar handling for classifications...
};
```

### 2. Optimistic Updates

```typescript
// Optimistic classification updates
const updateClassification = (id: string, updates: Partial<IncidentClassification>) => {
  set((state) => ({
    analysisData: {
      ...state.analysisData,
      classifications: {
        ...state.analysisData.classifications,
        edited: state.analysisData.classifications.edited.map(
          c => c.id === id ? { ...c, ...updates } : c
        )
      }
    }
  }));
};
```

### 3. State Persistence

```typescript
// Optional: Persist analysis state to sessionStorage
const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'analysis-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        analysisData: state.analysisData,
        // Don't persist UI state
      })
    }
  )
);
```

## Integration with Capture Workflow

### Loading Captured Data

```typescript
const loadFromIncidentCapture = () => {
  // Get data from incident capture store (Epic 4)
  const captureData = useIncidentStore.getState();
  
  set((state) => ({
    analysisData: {
      ...state.analysisData,
      capturedNarrative: {
        consolidatedNarrative: captureData.report.enrichedNarrative || 
                              captureData.report.initialNarrative,
        metadata: captureData.report.metadata,
        timestamp: new Date().toISOString()
      }
    }
  }));
};
```

## Component Integration Patterns

### 1. Step Components

```typescript
// Story 5.1: Review Narrative
const ReviewNarrativeStep = () => {
  const narrative = useAnalysisStore(s => s.analysisData.capturedNarrative);
  const prefetchAnalysis = useAnalysisStore(s => s.prefetchAnalysisData);
  
  const handleNext = async () => {
    // Trigger prefetch when moving to next step
    await prefetchAnalysis();
    // Navigation handled by wizard
  };
  
  return (
    <StepLayout title="Review Incident Narrative">
      <NarrativeDisplay narrative={narrative} />
    </StepLayout>
  );
};
```

### 2. Loading State Management

```typescript
// Reusable loading boundary
const AnalysisLoadingBoundary: React.FC<{
  status: LoadingStatus;
  children: React.ReactNode;
}> = ({ status, children }) => {
  if (status === 'loading') {
    return <LoadingOverlay message="Analyzing incident data..." />;
  }
  
  if (status === 'error') {
    return <ErrorDisplay message="Failed to load analysis" />;
  }
  
  return <>{children}</>;
};
```

### 3. Form Field Binding

```typescript
// Story 5.2: Contributing Conditions
const ContributingConditionsStep = () => {
  const conditions = useAnalysisStore(s => s.analysisData.contributingConditions);
  const updateConditions = useAnalysisStore(s => s.updateContributingConditions);
  const prefetchStatus = useAnalysisStore(s => s.uiState.prefetchStatus.conditions);
  
  return (
    <AnalysisLoadingBoundary status={prefetchStatus}>
      <StepLayout title="Contributing Conditions">
        <Textarea
          value={conditions.edited}
          onChange={(e) => updateConditions(e.target.value)}
          rows={10}
          placeholder="Describe the contributing conditions..."
        />
        {conditions.original !== conditions.edited && (
          <p className="text-sm text-muted-foreground">
            Modified from AI suggestion
          </p>
        )}
      </StepLayout>
    </AnalysisLoadingBoundary>
  );
};
```

## Performance Optimizations

### 1. Selective Subscriptions

```typescript
// Subscribe to specific slices
const conditions = useAnalysisStore(
  s => s.analysisData.contributingConditions.edited
);

// Shallow equality check for arrays
const classifications = useAnalysisStore(
  s => s.analysisData.classifications.edited,
  shallow
);
```

### 2. Memoized Selectors

```typescript
// Complex derived state
const analysisComplete = useAnalysisStore(
  s => s.analysisData.contributingConditions.edited.length > 0 &&
       s.analysisData.classifications.edited.length > 0
);
```

## Testing Patterns

### 1. Mock Store for Testing

```typescript
// __tests__/mockAnalysisStore.ts
export const createMockAnalysisStore = (initialState?: Partial<AnalysisStore>) => {
  return create<AnalysisStore>()((set, get) => ({
    ...defaultAnalysisState,
    ...initialState,
    // Mock actions
    prefetchAnalysisData: jest.fn(),
    // ... other mocked actions
  }));
};
```

### 2. Test Scenarios

```typescript
describe('Analysis Workflow', () => {
  it('should prefetch data after narrative review', async () => {
    const store = createMockAnalysisStore();
    await store.getState().prefetchAnalysisData();
    
    expect(store.getState().uiState.prefetchStatus.conditions).toBe('success');
  });
});
```

## Migration from Epic 4

### Accessing Capture Data

```typescript
// Bridge between Epic 4 and Epic 5 stores
export const useAnalysisWorkflow = () => {
  const captureComplete = useIncidentStore(s => s.report.enrichedNarrative !== null);
  const loadAnalysisData = useAnalysisStore(s => s.loadFromIncidentCapture);
  
  useEffect(() => {
    if (captureComplete) {
      loadAnalysisData();
    }
  }, [captureComplete]);
};
```

## Best Practices

1. **Keep Actions Pure**: Avoid side effects in synchronous actions
2. **Granular Updates**: Update only affected state slices
3. **Type Safety**: Leverage TypeScript for all state operations
4. **Error Boundaries**: Handle API failures gracefully
5. **Loading States**: Always indicate async operations to users
6. **State Reset**: Clear analysis data when starting new workflow