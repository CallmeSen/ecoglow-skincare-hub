import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Search as SearchIcon, Mic, Filter, Grid3x3, List, ArrowUp, X, Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Product } from "@shared/schema";


export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [10, 100],
    skinTypes: [] as string[],
    sustainability: [] as string[],
    ingredients: [] as string[],
    categories: [] as string[],
    rating: 0
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Get URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || "";

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Search products with filters
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', searchQuery, selectedFilters, sortBy],
    enabled: true
  });

  // Filter and sort products based on search query and filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.ingredients || []).some(ingredient => ingredient.toLowerCase().includes(query)) ||
        (product.benefits || []).some(benefit => benefit.toLowerCase().includes(query))
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price || "0");
      return price >= selectedFilters.priceRange[0] && price <= selectedFilters.priceRange[1];
    });

    // Skin type filter
    if (selectedFilters.skinTypes.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.skinTypes.some(type => (product.skinTypes || []).includes(type))
      );
    }

    // Sustainability filter
    if (selectedFilters.sustainability.length > 0) {
      filtered = filtered.filter(product => {
        const sustainabilityChecks = {
          'Vegan': product.isVegan,
          'Cruelty-Free': product.isCrueltyFree,
          'Organic': product.isOrganic,
          'Carbon Neutral': parseFloat(product.carbonFootprint || "0") < 1.0
        };
        return selectedFilters.sustainability.some(filter => 
          sustainabilityChecks[filter as keyof typeof sustainabilityChecks]
        );
      });
    }

    // Category filter
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.categories.includes(product.category)
      );
    }

    // Rating filter
    if (selectedFilters.rating > 0) {
      filtered = filtered.filter(product => parseFloat(product.rating || "0") >= selectedFilters.rating);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0"));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0"));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default: // relevance
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedFilters, sortBy]);

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      // Update search history
      const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Update URL
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      window.history.pushState({}, '', `${window.location.pathname}?${params}`);
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      priceRange: [10, 100],
      skinTypes: [],
      sustainability: [],
      ingredients: [],
      categories: [],
      rating: 0
    });
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const suggestions = [
    "bakuchiol serum anti-aging",
    "vegan makeup beet tint",
    "sustainable skincare kit",
    "organic moisturizer",
    "cruelty-free cleanser"
  ];

  const popularSearches = [
    "Bakuchiol Alternatives",
    "Beet Supplements", 
    "Vegan Kits",
    "Anti-Aging Serums",
    "Zero Waste Beauty"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream-beige)] to-white">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex-1 relative min-w-0">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--sage-green)] h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search Sustainable Beauty: Bakuchiol, Beet Gummies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                  className="pl-10 pr-12 h-12 text-lg border-2 border-[var(--sage-green)] focus:border-[var(--forest-green)]"
                  data-testid="input-search"
                />
                <Button
                  onClick={startVoiceSearch}
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 ${isListening ? 'text-red-500' : 'text-[var(--sage-green)]'}`}
                  data-testid="button-voice-search"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search History Dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-50">
                  {searchHistory.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(query);
                        handleSearch(query);
                        setShowHistory(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <SearchIcon className="h-4 w-4 text-gray-400" />
                      {query}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => handleSearch()}
              className="bg-[var(--forest-green)] hover:bg-green-700 text-white px-6"
              data-testid="button-search"
            >
              Search
            </Button>
          </div>
          
          {/* Quick Suggestions */}
          {!searchQuery && (
            <div className="mt-3 flex flex-wrap gap-2 overflow-hidden">
              <span className="text-sm text-gray-600 flex-shrink-0">Popular:</span>
              <div className="flex flex-wrap gap-2 min-w-0">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                    className="text-sm bg-[var(--sage-green)] text-white px-3 py-1 rounded-full hover:bg-[var(--forest-green)] transition-colors flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-80 hidden lg:block">
          <Card className="sticky top-32">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-[var(--berry-red)]"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <Slider
                    value={selectedFilters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={100}
                    min={10}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${selectedFilters.priceRange[0]}</span>
                    <span>${selectedFilters.priceRange[1]}</span>
                  </div>
                </div>

                <Separator />

                {/* Skin Types */}
                <div>
                  <h4 className="font-medium mb-3">Skin Type</h4>
                  <div className="space-y-2">
                    {['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={selectedFilters.skinTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('skinTypes', [...selectedFilters.skinTypes, type]);
                            } else {
                              handleFilterChange('skinTypes', selectedFilters.skinTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sustainability */}
                <div>
                  <h4 className="font-medium mb-3">Sustainability</h4>
                  <div className="space-y-2">
                    {['Vegan', 'Cruelty-Free', 'Organic', 'Carbon Neutral'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={selectedFilters.sustainability.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('sustainability', [...selectedFilters.sustainability, option]);
                            } else {
                              handleFilterChange('sustainability', selectedFilters.sustainability.filter(s => s !== option));
                            }
                          }}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {['Serums', 'Moisturizers', 'Cleansers', 'Masks', 'Supplements'].map((category) => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={selectedFilters.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('categories', [...selectedFilters.categories, category]);
                            } else {
                              handleFilterChange('categories', selectedFilters.categories.filter(c => c !== category));
                            }
                          }}
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating */}
                <div>
                  <h4 className="font-medium mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={selectedFilters.rating === rating}
                          onCheckedChange={(checked) => {
                            handleFilterChange('rating', checked ? rating : 0);
                          }}
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-sm">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isLoading ? 'Searching...' : `${filteredProducts.length} products found`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="bg-gray-200 h-48 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* No Results State */
            <div className="text-center py-16">
              <div className="w-64 h-64 mx-auto mb-8 bg-[var(--cream-beige)] rounded-full flex items-center justify-center">
                <div className="text-6xl">🍃</div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                No Matches for "{searchQuery}"
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search for something else
              </p>
              
              {/* Suggested Searches */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">People Also Searched:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch(search);
                      }}
                      className="bg-[var(--sage-green)] text-white px-4 py-2 rounded-full hover:bg-[var(--forest-green)] transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`group hover:shadow-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex gap-4 w-full' : ''}`}>
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                      <Link href={`/product/${product.id}`}>
                        <img
                          src={(product.images || [])[0] || "/placeholder-product.jpg"}
                          alt={product.name}
                          className={`w-full object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform ${
                            viewMode === 'list' ? 'h-32' : 'h-48'
                          }`}
                        />
                      </Link>
                    </div>
                    
                    <div className={`flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-lg hover:text-[var(--forest-green)] transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addToWishlist(product.id)}
                            className={`p-1 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                            data-testid={`button-wishlist-${product.id}`}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.isVegan && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Vegan
                            </Badge>
                          )}
                          {product.isCrueltyFree && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              Cruelty-Free
                            </Badge>
                          )}
                          {product.isOrganic && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                              Organic
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(parseFloat(product.rating || "0"))
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[var(--forest-green)]">
                            ${product.price}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.carbonFootprint}kg CO₂
                          </span>
                        </div>
                        
                        <Button
                          onClick={() => addToCart(product.id, 1)}
                          size="sm"
                          className="bg-[var(--berry-red)] hover:bg-red-700 text-white"
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Popular Searches Footer */}
          {filteredProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h4 className="font-medium mb-4 text-center">Related Searches</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch(search);
                    }}
                    className="text-sm bg-gray-100 hover:bg-[var(--sage-green)] hover:text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[var(--sage-green)] hover:bg-[var(--forest-green)] text-white p-3 rounded-full shadow-lg z-50"
          data-testid="button-back-to-top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}