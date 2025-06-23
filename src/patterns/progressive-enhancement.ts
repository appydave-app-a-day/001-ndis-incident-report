import { useState, useCallback, useRef } from 'react';

export type Phase = 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent';

export interface ProgressiveEnhancementState<T> {
  status: Record<Phase, 'pending' | 'processing' | 'completed' | 'error'>;
  results: Partial<Record<Phase, T>>;
  errors: Partial<Record<Phase, Error>>;
  currentPhase: Phase | null;
}

export interface UseProgressiveEnhancementOptions<T> {
  onPhaseStart?: (phase: Phase) => void;
  onPhaseComplete?: (phase: Phase, result: T) => void;
  onPhaseError?: (phase: Phase, error: Error) => void;
  onAllComplete?: (results: Record<Phase, T>) => void;
}

export const useProgressiveEnhancement = <T>(
  phases: Phase[],
  enhancer: (phase: Phase) => Promise<T>,
  options: UseProgressiveEnhancementOptions<T> = {}
) => {
  const [state, setState] = useState<ProgressiveEnhancementState<T>>({
    status: phases.reduce((acc, phase) => ({ ...acc, [phase]: 'pending' }), {} as Record<Phase, 'pending'>),
    results: {},
    errors: {},
    currentPhase: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const enhancePhase = useCallback(async (phase: Phase): Promise<T | null> => {
    // Cancel any ongoing enhancement
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      status: { ...prev.status, [phase]: 'processing' },
      currentPhase: phase,
    }));

    options.onPhaseStart?.(phase);

    try {
      const result = await enhancer(phase);

      // Check if the operation was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }

      setState(prev => ({
        ...prev,
        status: { ...prev.status, [phase]: 'completed' },
        results: { ...prev.results, [phase]: result },
        currentPhase: null,
      }));

      options.onPhaseComplete?.(phase, result);

      // Check if all phases are complete
      const allResults = { ...state.results, [phase]: result };
      if (phases.every(p => allResults[p] !== undefined)) {
        options.onAllComplete?.(allResults as Record<Phase, T>);
      }

      return result;
    } catch (error) {
      // Check if the operation was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }

      const err = error instanceof Error ? error : new Error('Enhancement failed');
      
      setState(prev => ({
        ...prev,
        status: { ...prev.status, [phase]: 'error' },
        errors: { ...prev.errors, [phase]: err },
        currentPhase: null,
      }));

      options.onPhaseError?.(phase, err);
      return null;
    }
  }, [enhancer, options, phases, state.results]);

  const enhanceAllSequentially = useCallback(async () => {
    for (const phase of phases) {
      if (state.status[phase] === 'completed') {
        continue; // Skip already completed phases
      }
      await enhancePhase(phase);
    }
  }, [phases, state.status, enhancePhase]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      status: phases.reduce((acc, phase) => ({ ...acc, [phase]: 'pending' }), {} as Record<Phase, 'pending'>),
      results: {},
      errors: {},
      currentPhase: null,
    });
  }, [phases]);

  const retry = useCallback(async (phase: Phase) => {
    if (state.status[phase] === 'error') {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [phase]: undefined },
      }));
      return enhancePhase(phase);
    }
    return null;
  }, [state.status, enhancePhase]);

  return {
    ...state,
    enhancePhase,
    enhanceAllSequentially,
    reset,
    retry,
    isProcessing: state.currentPhase !== null,
    hasErrors: Object.keys(state.errors).length > 0,
    isComplete: phases.every(phase => state.status[phase] === 'completed'),
  };
};