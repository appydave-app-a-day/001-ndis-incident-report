/**
 * Utility functions for parsing enhanced narrative text into structured Q&A format
 */

export interface QAPair {
  question: string;
  answer: string;
}

/**
 * Parses enhanced narrative text that contains Q&A pairs in various formats
 * Handles formats like:
 * - "Q: question text A: answer text"
 * - "Q. question text A. answer text"  
 * - "Question: text Answer: text"
 * - Mixed formats with different separators
 */
export function parseNarrativeToQA(text: string): QAPair[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Clean up the text - preserve newlines but normalize other whitespace
  const cleanText = text.trim();
  
  // Multiple regex patterns to catch different Q&A formats
  const patterns = [
    // Q: ... A: ... format with newlines (original format)
    /Q:\s*(.*?)\s*\n\s*A:\s*(.*?)(?=\n\n\s*Q:|$)/gis,
    // Q: ... A: ... format without required newlines (run-together format)
    /Q:\s*(.*?)\s*A:\s*(.*?)(?=\s*Q:|$)/gis,
    // Q. ... A. ... format  
    /Q\.\s*(.*?)\s*A\.\s*(.*?)(?=\s*Q\.|$)/gis,
    // Question: ... Answer: ... format
    /Question:\s*(.*?)\s*Answer:\s*(.*?)(?=\s*Question:|$)/gis,
  ];

  const qaPairs: QAPair[] = [];
  
  for (const pattern of patterns) {
    let match;
    pattern.lastIndex = 0; // Reset regex state
    
    while ((match = pattern.exec(cleanText)) !== null) {
      const question = match[1]?.trim();
      const answer = match[2]?.trim();
      
      if (question && answer) {
        qaPairs.push({
          question: question.trim(),
          answer: answer.trim()
        });
      }
    }
    
    // If we found matches with this pattern, use them
    if (qaPairs.length > 0) {
      break;
    }
  }
  
  // If no Q&A patterns found, return the original text as a single "narrative" block
  if (qaPairs.length === 0) {
    return [{
      question: "Enhanced Narrative",
      answer: cleanText
    }];
  }
  
  return qaPairs;
}

/**
 * Formats a Q&A pair for display with proper punctuation
 */
export function formatQuestion(question: string): string {
  if (!question) return '';
  
  const trimmed = question.trim();
  
  // Add question mark if it doesn't end with punctuation
  if (!/[.!?]$/.test(trimmed)) {
    return trimmed + '?';
  }
  
  return trimmed;
}

/**
 * Formats an answer for display with proper punctuation
 */
export function formatAnswer(answer: string): string {
  if (!answer) return '';
  
  const trimmed = answer.trim();
  
  // Add period if it doesn't end with punctuation
  if (!/[.!?]$/.test(trimmed)) {
    return trimmed + '.';
  }
  
  return trimmed;
}