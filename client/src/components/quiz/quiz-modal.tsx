import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QuizData } from "@/lib/types";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizStep {
  id: string;
  title: string;
  type: "radio" | "checkbox";
  options: Array<{ value: string; label: string; description?: string }>;
}

const quizSteps: QuizStep[] = [
  {
    id: "skinType",
    title: "What's your skin type?",
    type: "radio",
    options: [
      { value: "dry", label: "Dry", description: "Often feels tight or flaky" },
      { value: "oily", label: "Oily", description: "Shiny with enlarged pores" },
      { value: "combination", label: "Combination", description: "Oily T-zone, dry cheeks" },
      { value: "sensitive", label: "Sensitive", description: "Easily irritated or reactive" },
      { value: "normal", label: "Normal", description: "Balanced and comfortable" },
    ],
  },
  {
    id: "concerns",
    title: "What are your main skin concerns?",
    type: "checkbox",
    options: [
      { value: "aging", label: "Fine lines & aging" },
      { value: "acne", label: "Acne & breakouts" },
      { value: "pigmentation", label: "Dark spots & pigmentation" },
      { value: "hydration", label: "Dryness & hydration" },
      { value: "dullness", label: "Dullness & lack of glow" },
      { value: "sensitivity", label: "Sensitivity & irritation" },
    ],
  },
  {
    id: "sustainability",
    title: "How important is sustainability to you?",
    type: "radio",
    options: [
      { value: "very", label: "Very important", description: "I only buy eco-friendly products" },
      { value: "somewhat", label: "Somewhat important", description: "I prefer sustainable when possible" },
      { value: "not", label: "Not a priority", description: "I focus on effectiveness over sustainability" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget for skincare?",
    type: "radio",
    options: [
      { value: "low", label: "Under $50/month" },
      { value: "medium", label: "$50-100/month" },
      { value: "high", label: "$100+/month" },
    ],
  },
  {
    id: "routine",
    title: "How complex do you like your routine?",
    type: "radio",
    options: [
      { value: "simple", label: "Simple", description: "2-3 products maximum" },
      { value: "moderate", label: "Moderate", description: "4-6 products is perfect" },
      { value: "complex", label: "Complex", description: "I love a 10+ step routine" },
    ],
  },
];

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizData>>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const saveQuizMutation = useMutation({
    mutationFn: async (quizData: QuizData) => {
      const response = await apiRequest("POST", "/api/quiz", {
        userId: "demo-user",
        responses: quizData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations || []);
      setCurrentStep(quizSteps.length); // Go to results step
      toast({
        title: "Quiz completed!",
        description: "Your personalized recommendations are ready.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentQuizStep = quizSteps[currentStep];
  const progress = ((currentStep + 1) / (quizSteps.length + 1)) * 100;
  const isLastStep = currentStep === quizSteps.length - 1;
  const isResultsStep = currentStep === quizSteps.length;

  const handleAnswer = (stepId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [stepId]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      // Submit quiz
      const quizData: QuizData = {
        skinType: answers.skinType || "",
        concerns: Array.isArray(answers.concerns) ? answers.concerns : [],
        sustainability: answers.sustainability || "",
        budget: answers.budget || "",
        routineComplexity: answers.routine,
      };
      saveQuizMutation.mutate(quizData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
    onClose();
  };

  const canProceed = () => {
    if (isResultsStep) return false;
    const currentAnswer = answers[currentQuizStep.id as keyof QuizData];
    return currentAnswer && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-serif text-[var(--dark-green)]">
              {isResultsStep ? "Your Perfect Routine" : "Discover Your Perfect Routine"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600">
            Step {Math.min(currentStep + 1, quizSteps.length + 1)} of {quizSteps.length + 1}
          </p>
        </div>

        {/* Quiz Steps */}
        {!isResultsStep && currentQuizStep && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">{currentQuizStep.title}</h3>

            {currentQuizStep.type === "radio" ? (
              <RadioGroup
                value={answers[currentQuizStep.id as keyof QuizData] as string}
                onValueChange={(value) => handleAnswer(currentQuizStep.id, value)}
                className="space-y-3"
              >
                {currentQuizStep.options.map((option) => (
                  <Label
                    key={option.value}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--sage-green)] transition-colors"
                  >
                    <RadioGroupItem value={option.value} className="mr-3" />
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      {option.description && (
                        <div className="text-gray-600 text-sm">{option.description}</div>
                      )}
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQuizStep.options.map((option) => (
                  <Label
                    key={option.value}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--sage-green)] transition-colors"
                  >
                    <Checkbox
                      checked={(answers.concerns as string[])?.includes(option.value) || false}
                      onCheckedChange={(checked) => {
                        const currentConcerns = (answers.concerns as string[]) || [];
                        if (checked) {
                          handleAnswer("concerns", [...currentConcerns, option.value]);
                        } else {
                          handleAnswer("concerns", currentConcerns.filter(c => c !== option.value));
                        }
                      }}
                      className="mr-3"
                    />
                    <div className="font-semibold">{option.label}</div>
                  </Label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Step */}
        {isResultsStep && (
          <div className="space-y-6">
            <div className="bg-[var(--cream-beige)] rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4">Perfect for your skin profile:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Placeholder for recommended products */}
                <Card>
                  <CardContent className="p-4">
                    <img
                      src="https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
                      alt="Recommended product"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h5 className="font-semibold">Bakuchiol Glow Serum</h5>
                    <p className="text-sm text-gray-600 mb-2">Perfect for anti-aging concerns</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[var(--forest-green)]">$28</span>
                      <Button size="sm" className="bg-[var(--forest-green)]">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <img
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
                      alt="Recommended kit"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h5 className="font-semibold">Complete Glow Kit</h5>
                    <p className="text-sm text-gray-600 mb-2">Full routine bundle - save 15%</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[var(--forest-green)]">$65</span>
                      <Button size="sm" className="bg-[var(--forest-green)]">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-[var(--berry-red)] hover:bg-red-700 text-white px-8"
                onClick={handleClose}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {!isResultsStep && (
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || saveQuizMutation.isPending}
              className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)] flex items-center gap-2"
            >
              {isLastStep ? (
                saveQuizMutation.isPending ? "Analyzing..." : "Get My Results"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
