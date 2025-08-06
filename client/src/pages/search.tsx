import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Filter, X, Sparkles, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/product-card";
import { PRODUCT_CATEGORIES, SKIN_TYPES, SKIN_CONCERNS } from "@/lib/constants";
import type { Product } from "@shared/schema";

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    categories: [] as string[],
    skinTypes: [] as string[],
    concerns: [] as string[],
    features: [] as string[],
    priceRange: "",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
  }, []);

  const { data: searchResults = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = searchQuery.length > 0 ? searchResults : allProducts;

  const filteredProducts = products.filter((product: Product) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
    
    // Skin type filter
    if (filters.skinTypes.length > 0) {
      const hasMatchingSkinType = filters.skinTypes.some(type => 
        product.skinTypes && product.skinTypes.includes(type)
      );
      if (!hasMatchingSkinType) return false;
    }
    
    // Concerns filter
    if (filters.concerns.length > 0) {
      const hasMatchingConcern = filters.concerns.some(concern => 
        product.concerns && product.concerns.includes(concern)
      );
      if (!hasMatchingConcern) return false;
    }
    
    // Features filter
    if (filters.features.length > 0) {
      if (filters.features.includes("vegan") && !product.isVegan) return false;
      if (filters.features.includes("cruelty-free") && !product.isCrueltyFree) return false;
      if (filters.features.includes("organic") && !product.isOrganic) return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const price = parseFloat(product.price.toString());
      switch (filters.priceRange) {
        case "under-25":
          if (price >= 25) return false;
          break;
        case "25-50":
          if (price < 25 || price >= 50) return false;
          break;
        case "50-100":
          if (price < 50 || price >= 100) return false;
          break;
        case "over-100":
          if (price < 100) return false;
          break;
      }
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
      case "price-high":
        return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return parseFloat((b.rating || "0").toString()) - parseFloat((a.rating || "0").toString());
      default:
        return 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const updateFilter = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentArray = prev[filterType] as string[];
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      return { ...prev, [filterType]: newArray };
    });

    // Update active filters for display
    if (checked) {
      setActiveFilters(prev => [...prev, value]);
    } else {
      setActiveFilters(prev => prev.filter(item => item !== value));
    }
  };

  const updatePriceFilter = (value: string) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
    if (value && !activeFilters.includes(value)) {
      setActiveFilters(prev => [...prev.filter(f => !f.includes('$')), value]);
    }
  };

  const clearFilter = (filterValue: string) => {
    // Remove from active filters
    setActiveFilters(prev => prev.filter(item => item !== filterValue));
    
    // Remove from filters object
    setFilters(prev => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach(key => {
        if (key === 'priceRange' && newFilters[key] === filterValue) {
          newFilters[key] = '';
        } else if (Array.isArray(newFilters[key as keyof typeof newFilters])) {
          (newFilters[key as keyof typeof newFilters] as string[]) = 
            (newFilters[key as keyof typeof newFilters] as string[]).filter(item => item !== filterValue);
        }
      });
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      skinTypes: [],
      concerns: [],
      features: [],
      priceRange: "",
    });
    setActiveFilters([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--forest-green)] mb-4">
          Search Products
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              data-testid="input-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, ingredients, or brands..."
              className="pl-10"
            />
          </div>
          <Button data-testid="button-search" type="submit" className="bg-[var(--forest-green)] hover:bg-green-700">
            Search
          </Button>
        </form>

        {/* Search Query Display */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Showing results for: </span>
            <Badge variant="secondary">{searchQuery}</Badge>
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              {activeFilters.length > 0 && (
                <Button
                  data-testid="button-clear-filters"
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {filter}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => clearFilter(filter)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Category</Label>
              {Object.entries(PRODUCT_CATEGORIES).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${key}`}
                    checked={filters.categories.includes(key)}
                    onCheckedChange={(checked) =>
                      updateFilter("categories", key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${key}`} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Skin Type Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Skin Type</Label>
              {Object.entries(SKIN_TYPES).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skintype-${key}`}
                    checked={filters.skinTypes.includes(key)}
                    onCheckedChange={(checked) =>
                      updateFilter("skinTypes", key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`skintype-${key}`} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Skin Concerns Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Skin Concerns</Label>
              {Object.entries(SKIN_CONCERNS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`concern-${key}`}
                    checked={filters.concerns.includes(key)}
                    onCheckedChange={(checked) =>
                      updateFilter("concerns", key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`concern-${key}`} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Features Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Features</Label>
              {[
                { value: "vegan", label: "Vegan" },
                { value: "cruelty-free", label: "Cruelty-Free" },
                { value: "organic", label: "Organic" },
              ].map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature.value}`}
                    checked={filters.features.includes(feature.value)}
                    onCheckedChange={(checked) =>
                      updateFilter("features", feature.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`feature-${feature.value}`} className="text-sm">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Price Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range</Label>
              <Select value={filters.priceRange} onValueChange={updatePriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-25">Under $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="over-100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button & Sort */}
          <div className="flex items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                {/* Mobile filters content would go here - same as desktop */}
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {sortedProducts.length} products found
              </span>
              
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  data-testid="button-grid-view"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none border-r"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  data-testid="button-list-view"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={viewMode === "grid" 
                  ? "loading-skeleton rounded-lg h-96"
                  : "loading-skeleton rounded-lg h-32"
                } />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children"
              : "space-y-4 stagger-children"
            }>
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try adjusting your search or filters.`
                  : "Start searching to discover our eco-friendly skincare products."
                }
              </p>
              {activeFilters.length > 0 && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}