import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product/product-card";
import { PRODUCT_CATEGORIES, SKIN_TYPES, SKIN_CONCERNS } from "@/lib/constants";
import type { Product } from "@shared/schema";

export default function Products() {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    skinTypes: [] as string[],
    concerns: [] as string[],
    features: [] as string[],
    priceRange: "",
  });

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: searchResults = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const products = searchQuery.length > 2 ? searchResults : allProducts;

  const filteredProducts = products.filter((product: Product) => {
    // Category filter
    if (category && product.category !== category) return false;
    
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
      const price = parseFloat(product.price);
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

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
      case "newest":
        return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const handleFilterChange = (filterType: keyof typeof filters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      skinTypes: [],
      concerns: [],
      features: [],
      priceRange: "",
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Skin Types */}
      <div>
        <h3 className="font-semibold mb-3">Skin Type</h3>
        <div className="space-y-2">
          {Object.entries(SKIN_TYPES).map(([value, label]) => (
            <Label key={value} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.skinTypes.includes(value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange("skinTypes", [...filters.skinTypes, value]);
                  } else {
                    handleFilterChange("skinTypes", filters.skinTypes.filter(t => t !== value));
                  }
                }}
              />
              <span>{label}</span>
            </Label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skin Concerns */}
      <div>
        <h3 className="font-semibold mb-3">Skin Concerns</h3>
        <div className="space-y-2">
          {Object.entries(SKIN_CONCERNS).map(([value, label]) => (
            <Label key={value} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.concerns.includes(value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange("concerns", [...filters.concerns, value]);
                  } else {
                    handleFilterChange("concerns", filters.concerns.filter(c => c !== value));
                  }
                }}
              />
              <span>{label}</span>
            </Label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <h3 className="font-semibold mb-3">Features</h3>
        <div className="space-y-2">
          {[
            { value: "vegan", label: "Vegan" },
            { value: "cruelty-free", label: "Cruelty-Free" },
            { value: "organic", label: "Organic" },
          ].map((feature) => (
            <Label key={feature.value} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.features.includes(feature.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange("features", [...filters.features, feature.value]);
                  } else {
                    handleFilterChange("features", filters.features.filter(f => f !== feature.value));
                  }
                }}
              />
              <span>{feature.label}</span>
            </Label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
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

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[var(--dark-green)] mb-4">
            {category ? PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES] : "All Products"}
          </h1>
          <p className="text-gray-600">
            Discover our sustainable beauty collection featuring plant-powered formulations and eco-friendly packaging
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="mb-6 text-sm text-gray-600">
                  Showing {sortedProducts.length} of {products.length} products
                </div>
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {sortedProducts.map((product: Product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      variant={viewMode}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* No Products Found State */
              <div className="text-center py-16">
                <div className="w-64 h-64 mx-auto mb-8 bg-[var(--cream-beige)] rounded-full flex items-center justify-center">
                  <div className="text-6xl">🍃</div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  {searchQuery ? `No Matches for "${searchQuery}"` : "No Products Found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? "Try adjusting your search terms or filters to find what you're looking for"
                    : "Try adjusting your filters or browse our featured collections"
                  }
                </p>
                
                {/* Suggested Actions */}
                <div className="mb-8 space-y-4">
                  <Button 
                    onClick={clearFilters} 
                    variant="outline"
                    className="mr-4"
                  >
                    Clear All Filters
                  </Button>
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>

                {/* Popular Categories */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Popular Categories:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Object.entries(PRODUCT_CATEGORIES).slice(0, 5).map(([key, label]) => (
                      <Button
                        key={key}
                        variant="ghost"
                        onClick={() => window.location.href = `/products/${key}`}
                        className="bg-[var(--sage-green)] text-white px-4 py-2 rounded-full hover:bg-[var(--forest-green)] transition-colors"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
