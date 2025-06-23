# State Management Architecture

## Overview

This application uses Zustand for state management, chosen for its simplicity, TypeScript support, and minimal boilerplate. This document outlines the patterns and conventions used throughout the application.

## Core Principles

1. **Single Store Per Domain** - Each major feature has its own store
2. **Type Safety** - All stores are fully typed with TypeScript
3. **Action Colocation** - Actions are defined within the store
4. **Immutable Updates** - Use spread operators for state updates
5. **Selective Subscriptions** - Components subscribe only to needed state

## Store Structure Pattern

```typescript
interface StoreState {
  // Data layer - Core business data
  data: BusinessData;
  
  // UI State layer - Component-specific state
  ui: {
    loading: boolean;
    error: Error | null;
  };
  
  // Configuration layer - App settings
  config: {
    mode: 'mock' | 'live';
  };
  
  // Actions layer - State mutations
  actions: {
    updateData: (data: Partial<BusinessData>) => void;
    reset: () => void;
  };
}
```

## Implementation Pattern

### Basic Store Setup

```typescript
import { create } from 'zustand';

interface MyFeatureState {
  // State
  items: Item[];
  selectedId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setItems: (items: Item[]) => void;
  selectItem: (id: string) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  // Initial state
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  
  // Action implementations
  setItems: (items) => set({ items }),
  
  selectItem: (id) => set({ selectedId: id }),
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  reset: () => set({
    items: [],
    selectedId: null,
    isLoading: false,
    error: null
  })
}));
```

### Complex Nested State Updates

For deeply nested state, use immer or careful spread operations:

```typescript
// Without immer
updateNestedField: (section: string, field: string, value: any) => 
  set((state) => ({
    data: {
      ...state.data,
      [section]: {
        ...state.data[section],
        [field]: value
      }
    }
  }))

// With immer (if added as dependency)
updateNestedField: (section: string, field: string, value: any) =>
  set(produce((draft) => {
    draft.data[section][field] = value;
  }))
```

## Usage Patterns

### Component Usage

```typescript
// Subscribe to entire store (avoid when possible)
const store = useMyFeatureStore();

// Subscribe to specific fields (preferred)
const items = useMyFeatureStore(state => state.items);
const isLoading = useMyFeatureStore(state => state.isLoading);
const addItem = useMyFeatureStore(state => state.addItem);

// Subscribe with shallow equality check
const { item1, item2 } = useMyFeatureStore(
  state => ({ item1: state.items[0], item2: state.items[1] }),
  shallow
);
```

### Async Actions Pattern

```typescript
interface StoreWithAsync {
  // State
  data: Data | null;
  isLoading: boolean;
  error: Error | null;
  
  // Async action
  fetchData: () => Promise<void>;
}

const useStore = create<StoreWithAsync>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.getData();
      set({ data: response, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false 
      });
    }
  }
}));
```

## Real-World Example: Incident Store

The incident capture workflow demonstrates these patterns:

```typescript
export const useIncidentStore = create<IncidentState>((set, get) => ({
  // Layered state structure
  report: {
    metadata: initialMetadata,
    narrative: initialNarrative,
    clarificationAnswers: initialAnswers,
    narrativeExtras: initialExtras,
  },
  
  // UI state
  consolidationStatus: initialStatus,
  loadingOverlay: { isOpen: false, message: '' },
  
  // Configuration
  apiMode: 'mock',
  testDataLevel: 'none',
  
  // Granular update actions
  updateMetadata: (metadata) => set((state) => ({
    report: {
      ...state.report,
      metadata: { ...state.report.metadata, ...metadata }
    }
  })),
  
  // Complex async operations
  consolidatePhase: async (phase) => {
    const { narrative, clarificationAnswers } = get().report;
    
    set((state) => ({
      consolidationStatus: {
        ...state.consolidationStatus,
        [phase]: 'loading'
      }
    }));
    
    try {
      const result = await api.consolidate(phase, narrative, clarificationAnswers);
      
      set((state) => ({
        report: {
          ...state.report,
          narrativeExtras: {
            ...state.report.narrativeExtras,
            [phase]: result
          }
        },
        consolidationStatus: {
          ...state.consolidationStatus,
          [phase]: 'complete'
        }
      }));
    } catch (error) {
      // Error handling...
    }
  }
}));
```

## Best Practices

### 1. Store Organization

```
src/store/
├── useAppStore.ts        // Global app state
├── useIncidentStore.ts   // Feature-specific state
├── useWizardStore.ts     // Reusable wizard state
└── types.ts             // Shared types
```

### 2. Naming Conventions

- Store hooks: `use[Feature]Store`
- Actions: verb-based (`updateData`, `fetchItems`, `reset`)
- Boolean states: `is/has` prefix (`isLoading`, `hasError`)
- Handlers: `handle` prefix (`handleSubmit`, `handleError`)

### 3. Performance Optimization

```typescript
// ❌ Bad - causes unnecessary re-renders
const MyComponent = () => {
  const store = useStore(); // Subscribes to entire store
  return <div>{store.items.length}</div>;
};

// ✅ Good - only re-renders when items change
const MyComponent = () => {
  const itemCount = useStore(state => state.items.length);
  return <div>{itemCount}</div>;
};
```

### 4. Testing Stores

```typescript
// Reset store between tests
beforeEach(() => {
  useMyStore.setState(initialState);
});

// Test actions
it('should add item', () => {
  const { addItem } = useMyStore.getState();
  addItem({ id: '1', name: 'Test' });
  
  const { items } = useMyStore.getState();
  expect(items).toHaveLength(1);
  expect(items[0].name).toBe('Test');
});
```

## Migration Guide

When refactoring existing state management:

1. **Identify State Boundaries** - Group related state
2. **Create Store Interface** - Define types first
3. **Implement Store** - Start with simple actions
4. **Migrate Components** - Update one at a time
5. **Remove Old State** - Clean up after migration

## Common Patterns

### Computed Values

```typescript
const useStore = create((set, get) => ({
  items: [],
  filter: '',
  
  // Computed getter
  get filteredItems() {
    const { items, filter } = get();
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
}));
```

### Store Composition

```typescript
// Combine multiple stores
const useCombinedData = () => {
  const userData = useUserStore(state => state.data);
  const incidentData = useIncidentStore(state => state.report);
  
  return {
    user: userData,
    incident: incidentData,
    canSubmit: userData.role === 'admin' && incidentData.isComplete
  };
};
```

### Persistence

```typescript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      preferences: {},
      setPreference: (key, value) => set((state) => ({
        preferences: { ...state.preferences, [key]: value }
      }))
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({ preferences: state.preferences })
    }
  )
);
```

## Debugging

Enable Redux DevTools support:

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      // store implementation
    }),
    {
      name: 'MyFeatureStore',
    }
  )
);
```

## References

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Best Practices](https://github.com/pmndrs/zustand#typescript-usage)
- [Performance Guide](https://github.com/pmndrs/zustand#selecting-multiple-state-slices)