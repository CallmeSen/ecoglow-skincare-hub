import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

export default function VoiceSearch({ onSearch, className }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert("Voice search is not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      // Process the voice query
      processVoiceQuery(transcript);
      
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please enable microphone permissions.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceQuery = (transcript: string) => {
    console.log('Voice query:', transcript);
    
    // Provide voice feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Searching for ${transcript}`);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }

    // Navigate to search page with the query
    const searchParams = new URLSearchParams({ q: transcript });
    setLocation(`/search?${searchParams.toString()}`);
    onSearch(transcript);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={startListening}
      disabled={isListening}
      className={`p-2 ${isListening ? 'text-red-500' : 'text-gray-600'} hover:text-[var(--forest-green)] ${className}`}
      aria-label={isListening ? "Listening..." : "Start voice search"}
      data-testid="button-voice-search"
    >
      {isListening ? (
        <MicOff className="h-5 w-5 animate-pulse" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}