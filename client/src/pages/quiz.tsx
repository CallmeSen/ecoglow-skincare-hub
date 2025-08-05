import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuizModal from "@/components/quiz/quiz-modal";

export default function Quiz() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const benefits = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Personalized Recommendations",
      description: "Get product suggestions tailored to your unique skin profile and concerns"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Expert-Backed Science",
      description: "Our quiz is based on dermatological research and sustainability science"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Sustainable Matches",
      description: "Find products that align with your environmental values and ethics"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Skin Analysis",
      description: "Tell us about your skin type, concerns, and current routine"
    },
    {
      step: 2,
      title: "Lifestyle Preferences",
      description: "Share your sustainability values and beauty preferences"
    },
    {
      step: 3,
      title: "Budget & Goals",
      description: "Set your price range and skincare objectives"
    },
    {
      step: 4,
      title: "Get Results",
      description: "Receive personalized product recommendations with exclusive discounts"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-[var(--dark-green)] mb-6">
            Find Your Perfect Skincare Routine
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Take our AI-powered quiz to discover personalized product recommendations 
            based on your skin type, concerns, and sustainability preferences. 
            Get expert-curated suggestions in just 2 minutes.
          </p>
          
          <Button
            size="lg"
            onClick={() => setIsQuizOpen(true)}
            className="bg-[var(--berry-red)] hover:bg-red-700 text-white px-12 py-4 text-xl font-semibold transform hover:scale-105 transition-all"
          >
            Start Your Personalized Quiz
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[var(--dark-green)] mb-8">
            Why Take Our Quiz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[var(--sage-green)] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[var(--dark-green)] mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[var(--forest-green)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-8 h-0.5 bg-[var(--sage-green)] transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[var(--dark-green)] mb-8">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-4 h-4 bg-yellow-400 rounded-full mr-1" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The quiz perfectly matched me with products that actually work for my sensitive skin. 
                  I love that everything is sustainable too!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[var(--sage-green)] rounded-full mr-3" />
                  <div>
                    <div className="font-semibold">Sarah M.</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-4 h-4 bg-yellow-400 rounded-full mr-1" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "I was skeptical at first, but the recommendations were spot-on. 
                  My skin has never looked better, and I feel good about my choices."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[var(--sage-green)] rounded-full mr-3" />
                  <div>
                    <div className="font-semibold">Emily R.</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-4 h-4 bg-yellow-400 rounded-full mr-1" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The quiz saved me so much time and money. No more guessing what products 
                  might work - everything was perfectly curated for me."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[var(--sage-green)] rounded-full mr-3" />
                  <div>
                    <div className="font-semibold">Jessica L.</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[var(--dark-green)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How long does the quiz take?</h3>
                <p className="text-gray-600">
                  The quiz takes approximately 2-3 minutes to complete. We keep it short while 
                  gathering all the essential information to provide accurate recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Are the recommendations really personalized?</h3>
                <p className="text-gray-600">
                  Yes! Our AI-powered algorithm analyzes your responses about skin type, concerns, 
                  preferences, and sustainability values to suggest products specifically for you.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I retake the quiz if my skin changes?</h3>
                <p className="text-gray-600">
                  Absolutely! We recommend retaking the quiz every 3-6 months or whenever you 
                  notice significant changes in your skin or preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do I get a discount on recommended products?</h3>
                <p className="text-gray-600">
                  Yes! Quiz participants receive exclusive discounts on their personalized 
                  recommendations, plus early access to new product launches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-[var(--cream-beige)] rounded-2xl p-12">
          <h2 className="text-3xl font-serif font-bold text-[var(--dark-green)] mb-4">
            Ready to Transform Your Skincare Routine?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect products through our quiz.
          </p>
          <Button
            size="lg"
            onClick={() => setIsQuizOpen(true)}
            className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)] text-white px-12 py-4 text-xl font-semibold transform hover:scale-105 transition-all"
          >
            Take the Quiz Now
          </Button>
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}
