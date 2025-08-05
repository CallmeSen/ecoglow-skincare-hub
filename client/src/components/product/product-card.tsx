import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, Star, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const renderSustainabilityBadges = () => {
    const badges = [];
    if (product.isVegan) badges.push("Vegan");
    if (product.isCrueltyFree) badges.push("Cruelty-Free");
    if (product.isOrganic) badges.push("Organic");
    if (product.trending) badges.push("Trending");
    if (product.featured) badges.push("Featured");
    
    return badges.slice(0, 2).map((badge) => (
      <Badge
        key={badge}
        variant="secondary"
        className={`text-xs ${
          badge === "Trending" ? "bg-[var(--gold-light)] text-[var(--dark-green)]" :
          badge === "Featured" ? "bg-[var(--light-green)] text-[var(--dark-green)]" :
          "bg-[var(--sage-green)] text-white"
        }`}
      >
        {badge}
      </Badge>
    ));
  };

  return (
    <Card className={`product-card group cursor-pointer overflow-hidden bg-white shadow-lg ${className}`}>
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {renderSustainabilityBadges()}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${
              isWishlisted ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>

          {/* Sustainability Score */}
          {product.sustainabilityScore > 80 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[var(--forest-green)]/90 text-white px-2 py-1 rounded-full text-xs">
              <Leaf className="h-3 w-3" />
              <span>{product.sustainabilityScore}% Eco</span>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(parseFloat(product.rating))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount})</span>
          </div>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--forest-green)] transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[var(--forest-green)]">
                ${product.price}
              </span>
              {product.stock < 10 && product.stock > 0 && (
                <span className="text-xs text-orange-500">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)] text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Key Benefits */}
          {product.benefits.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-1">
                {product.benefits.slice(0, 3).map((benefit) => (
                  <Badge
                    key={benefit}
                    variant="outline"
                    className="text-xs text-[var(--forest-green)] border-[var(--sage-green)]"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
