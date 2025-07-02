import { Loader2, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useIncidentStore } from '@/store/useIncidentStore';

export const DuringEventClarificationStep: React.FC = () => {
  const { 
    clarificationQuestions, 
    isLoadingQuestions, 
    report,
    updateClarificationAnswer
  } = useIncidentStore();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});


  // Initialize answers from store
  useEffect(() => {
    const existingAnswers: Record<string, string> = {};
    report.clarificationAnswers.duringEvent.forEach(answer => {
      existingAnswers[answer.questionId] = answer.answer;
    });
    setAnswers(existingAnswers);
  }, [report.clarificationAnswers.duringEvent]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Update store immediately
    updateClarificationAnswer('duringEvent', questionId, answer);
  };

  const duringQuestions = clarificationQuestions?.duringEvent || [];
  const hasQuestions = duringQuestions.length > 0;

  return (
    <div>
      <StepHeader
        stepNumber={4}
        title="Step 4: During Event Clarifications"
        subtitle="Answer questions about what happened during the incident (optional)"
        onViewContent={() => console.log('View content clicked')}
        panelType="qa-clarification"
        phase="duringEvent"
      />
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-0">
              {/* Loading state */}
              {isLoadingQuestions && (
                <div className="p-8">
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Loading clarification questions...
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* No questions state */}
              {!isLoadingQuestions && !hasQuestions && (
                <div className="p-8">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No clarification questions are available for the "During Event" phase. You can proceed to the next step.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Questions display */}
              {!isLoadingQuestions && hasQuestions && (
                <div className="p-8">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      These questions are based on your "During the Event" narrative. Answering them is optional but can help provide additional context for your report.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {duringQuestions.map((question, index) => (
                      <div key={question.id} className="form-field">
                        <Label htmlFor={`question-${question.id}`} className="custom-label">
                          Question {index + 1}
                        </Label>
                        <div className="mb-2">
                          <p className="text-sm text-foreground leading-relaxed">
                            {question.question}
                          </p>
                        </div>
                        <Textarea
                          id={`question-${question.id}`}
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Enter your answer here (optional)..."
                          className="min-h-[120px]"
                          rows={4}
                        />
                      </div>
                    ))}
                  </div>

                  {hasQuestions && (
                    <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-sm text-primary">
                        <strong>Note:</strong> All answers are optional. You can skip any questions and proceed to the next step at any time.
                      </p>
                    </div>
                  )}


                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};