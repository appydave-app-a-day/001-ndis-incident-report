import React from 'react';

import { formatAnswer, formatQuestion, parseNarrativeToQA, type QAPair } from '@/lib/utils/narrativeParser';

interface QADisplayProps {
  text: string;
  className?: string;
}

interface QAPairDisplayProps {
  qaPair: QAPair;
  index: number;
}

const QAPairDisplay: React.FC<QAPairDisplayProps> = ({ qaPair, index }) => {
  return (
    <div className="qa-pair">
      <div className="qa-question">
        <div className="qa-question-box">
          <p className="qa-question-text">
            {formatQuestion(qaPair.question)}
          </p>
        </div>
      </div>
      <div className="qa-answer">
        <div className="qa-answer-box">
          <p className="qa-answer-text">
            {formatAnswer(qaPair.answer)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const QADisplay: React.FC<QADisplayProps> = ({ 
  text, 
  className = '' 
}) => {
  const qaPairs = parseNarrativeToQA(text);
  
  // Debug logging to understand parsing issues
  if (import.meta.env.DEV) {
    console.log('QADisplay Debug:', {
      textLength: text?.length || 0,
      textPreview: text?.substring(0, 200) + '...',
      parsedQAPairs: qaPairs.length,
      qaPairs: qaPairs
    });
  }
  
  // If we only have one pair and it's labeled as "Enhanced Narrative", 
  // render it as plain text instead of Q&A format
  if (qaPairs.length === 1 && qaPairs[0].question === "Enhanced Narrative") {
    return (
      <div className={`qa-display ${className}`}>
        <p className="text-gray-800 leading-relaxed">
          {qaPairs[0].answer}
        </p>
      </div>
    );
  }
  
  // Render as structured Q&A pairs
  return (
    <div className={`qa-display ${className}`}>
      {qaPairs.map((qaPair, index) => (
        <QAPairDisplay 
          key={index} 
          qaPair={qaPair} 
          index={index} 
        />
      ))}
    </div>
  );
};