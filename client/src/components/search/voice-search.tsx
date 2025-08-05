import { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceSearch } from "@/hooks/use-voice-search";
import { useToast } from "@/hooks/use-toast";

interface VoiceSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function VoiceSearch({ searchQuery, onSearchChange }: VoiceSearchProps) {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    isSupported 
  } = useVoiceSearch();
  const { toast } = useToast();

  // Update search query when transcript changes
  useEffect(() => {
    if (transcript && !isListening) {
      onSearchChange(transcript);
      // Auto-reset transcript after a delay
      setTimeout(() => {
        resetTranscript();
      }, 3000);
    }
  }, [transcript, isListening, onSearchChange, resetTranscript]);

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Show voice search results suggestions
  const getVoiceSearchSuggestions = (query: string) => {
    if (!query) return [];
    
    const suggestions = [
      "vegan serums under $30",
      "bakuchiol anti-aging products",
      "sustainable skincare kits",
      "cruelty-free makeup",
      "organic moisturizers",
      "beet-based supplements",
      "eco-friendly cleansers",
      "sensitive skin products"
    ];
    
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);
  };

  if (!isSupported) {
    return null; // Don't render if voice search isn't supported
  }

  return (
    <>
      {/* Voice Search Status Indicator */}
      {isListening && (
        <div className="fixed top-24 right-4 z-50">
          <Card className="border-[var(--forest-green)] shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Mic className="h-5 w-5 text-[var(--forest-green)]" />
                  <div className="absolute -inset-1 bg-[var(--forest-green)] rounded-full opacity-20 animate-ping" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--forest-green)]">Listening...</div>
                  <div className="text-sm text-gray-600">Speak now to search</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopListening}
                  className="ml-2"
                >
                  <MicOff className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Transcript Display */}
      {transcript && (
        <div className="fixed top-36 right-4 z-50 max-w-sm">
          <Card className="border-[var(--sage-green)] shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--forest-green)]">
                    Voice Input
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTranscript}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                <div className="text-sm bg-[var(--cream-beige)] p-2 rounded">
                  "{transcript}"
                </div>
                {!isListening && (
                  <div className="text-xs text-gray-500">
                    Searching for products...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voice Search Suggestions */}
      {transcript && !isListening && (
        <div className="fixed top-52 right-4 z-50 max-w-sm">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">
                  Voice Search Suggestions
                </div>
                {getVoiceSearchSuggestions(transcript).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSearchChange(suggestion)}
                    className="block w-full text-left text-sm p-2 rounded hover:bg-[var(--cream-beige)] transition-colors"
                  >
                    <Mic className="h-3 w-3 inline mr-2 text-[var(--sage-green)]" />
                    {suggestion}
                  </button>
                ))}
                
                <div className="pt-2 border-t">
                  <button
                    onClick={handleVoiceSearch}
                    className="flex items-center gap-2 text-sm text-[var(--forest-green)] hover:text-[var(--dark-green)]"
                  >
                    <Mic className="h-3 w-3" />
                    Search again
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voice Search Tutorial (first time users) */}
      {!transcript && !isListening && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs">
          <Card className="bg-[var(--forest-green)] text-white border-0 shadow-lg opacity-0 animate-in fade-in duration-1000">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span className="text-sm font-semibold">Voice Search Tips</span>
                </div>
                <div className="text-xs space-y-1">
                  <div>• "Show me vegan serums"</div>
                  <div>• "Find products under $25"</div>
                  <div>• "Bakuchiol anti-aging"</div>
                  <div>• "Sustainable skincare kits"</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
