import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Heart, ShoppingCart, Share2, Truck, Leaf, Shield, ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product/product-card";
import ProductGallery from "@/components/product/product-gallery";
import ARTryOn from "@/components/ar/ar-try-on";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isAROpen, setIsAROpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!product?.category,
  });

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Failed to share:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 aspect-square rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded animate-pulse" />
              <div className="bg-gray-200 h-6 rounded animate-pulse" />
              <div className="bg-gray-200 h-4 rounded animate-pulse" />
              <div className="bg-gray-200 h-32 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProductsFiltered = relatedProducts
    .filter((p: Product) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <Link href="/products" className="hover:text-[var(--forest-green)]">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products/${product.category}`} className="hover:text-[var(--forest-green)]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isVegan && (
                <Badge className="bg-[var(--sage-green)] text-white">Vegan</Badge>
              )}
              {product.isCrueltyFree && (
                <Badge className="bg-[var(--sage-green)] text-white">Cruelty-Free</Badge>
              )}
              {product.isOrganic && (
                <Badge className="bg-[var(--sage-green)] text-white">Organic</Badge>
              )}
              {product.trending && (
                <Badge className="bg-[var(--gold-light)] text-[var(--dark-green)]">Trending</Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(parseFloat(product.rating || '0'))
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-serif font-bold text-[var(--dark-green)] mb-2">
                {product.name}
              </h1>
              <div className="text-4xl font-bold text-[var(--forest-green)] mb-4">
                ${product.price}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Key Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Benefits:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {product.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--forest-green)] hover:bg-[var(--dark-green)]"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={`${isWishlisted ? "text-red-500 border-red-200" : ""}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>

                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* AR Try-On for makeup products */}
              {product.category === "makeup" && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsAROpen(true)}
                  className="w-full border-[var(--sage-green)] text-[var(--sage-green)] hover:bg-[var(--sage-green)] hover:text-white"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Try On with AR
                </Button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Leaf className="h-4 w-4 text-[var(--forest-green)]" />
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-[var(--forest-green)]" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-[var(--forest-green)]" />
                <span>30-Day Return</span>
              </div>
            </div>

            {/* Sustainability Score */}
            {product.sustainabilityScore && product.sustainabilityScore > 0 && (
              <div className="bg-[var(--cream-beige)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-5 w-5 text-[var(--forest-green)]" />
                  <span className="font-semibold">Sustainability Score</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[var(--forest-green)] h-2 rounded-full"
                      style={{ width: `${product.sustainabilityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{product.sustainabilityScore}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Carbon footprint: {product.carbonFootprint}kg CO2e per product
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="description">
                    <AccordionTrigger>Full Description</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {product.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Suitable for:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {product.skinTypes && product.skinTypes.map((type) => (
                              <li key={type}>{type} skin</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Addresses:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {product.concerns && product.concerns.map((concern) => (
                              <li key={concern}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="usage">
                    <AccordionTrigger>How to Use</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700">
                        Apply 2-3 drops to clean skin. Gently massage into face and neck. 
                        Use morning and evening for best results. Always follow with SPF during the day.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="sustainability">
                    <AccordionTrigger>Sustainability</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          This product is part of our commitment to sustainable beauty:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          <li>Packaging made from 100% recyclable materials</li>
                          <li>Carbon-neutral shipping</li>
                          <li>Ethically sourced ingredients</li>
                          <li>No harmful chemicals or parabens</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">All Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.ingredients && product.ingredients.map((ingredient) => (
                    <div key={ingredient} className="flex items-center gap-2 p-2 border rounded">
                      <Leaf className="h-4 w-4 text-[var(--forest-green)]" />
                      <span className="text-sm">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                  <p className="text-gray-600 mb-4">
                    See what our customers are saying about this product
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-6 w-6 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{product.rating}</span>
                    <span className="text-gray-600">({product.reviewCount} reviews)</span>
                  </div>
                  <Button variant="outline">Write a Review</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProductsFiltered.length > 0 && (
          <div>
            <h2 className="text-3xl font-serif font-bold text-[var(--dark-green)] mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsFiltered.map((relatedProduct: Product) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AR Try-On Modal */}
      <ARTryOn 
        isOpen={isAROpen} 
        onClose={() => setIsAROpen(false)} 
        product={product}
      />
    </div>
  );
}
