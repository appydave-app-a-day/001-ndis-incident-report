import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ConditionsEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Editor component for contributing conditions with auto-save and validation
 */
export const ConditionsEditor: React.FC<ConditionsEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter the contributing conditions that led to this incident...",
  disabled = false,
  className = "",
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Auto-save with debouncing
  const debouncedSave = useCallback((newValue: string) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      onChange(newValue);
      setLastSaved(new Date());
      
      // Reset saving state after a brief moment
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    }, 1000); // 1 second debounce
  }, [onChange]);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedSave(newValue);
  };

  // Handle key shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + S to save immediately
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      setIsSaving(true);
      onChange(localValue);
      setLastSaved(new Date());
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Calculate character count and validation
  const characterCount = localValue.length;
  const wordCount = localValue.trim() ? localValue.trim().split(/\s+/).length : 0;
  const isValid = characterCount >= 50; // Minimum 50 characters
  const hasContent = characterCount > 0;

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `Saved ${diffSeconds}s ago`;
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `Saved ${minutes}m ago`;
    } else {
      return lastSaved.toLocaleTimeString();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <Label htmlFor="conditions-editor" className="text-base font-medium">
          Contributing Conditions Analysis
        </Label>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {isSaving && (
            <span className="text-blue-600">Saving...</span>
          )}
          {lastSaved && !isSaving && (
            <span>{formatLastSaved()}</span>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          id="conditions-editor"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[300px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-describedby="conditions-editor-help"
        />
      </div>

      {/* Character Count and Validation */}
      <div className="flex items-center justify-between text-sm">
        <div className="space-x-4">
          <span className={characterCount > 2000 ? 'text-red-600' : 'text-gray-500'}>
            {characterCount.toLocaleString()} characters
          </span>
          <span className="text-gray-500">
            {wordCount.toLocaleString()} words
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasContent && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isValid 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {isValid ? 'Valid' : 'Needs more detail'}
            </span>
          )}
          
          {characterCount > 2000 && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              Too long
            </span>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div id="conditions-editor-help" className="text-sm text-gray-600">
        <p>
          Review and edit the AI-generated contributing conditions analysis. The analysis is structured 
          with categories and bullet points. You can edit the content while maintaining or changing the 
          structure as needed. Press Ctrl+S (Cmd+S on Mac) to save immediately.
        </p>
        {!isValid && hasContent && (
          <p className="text-yellow-600 mt-1">
            Please provide at least 50 characters for a meaningful analysis.
          </p>
        )}
        {characterCount > 2000 && (
          <p className="text-red-600 mt-1">
            Content is too long. Please keep it under 2,000 characters for optimal processing.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConditionsEditor;