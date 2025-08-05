import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Leaf, FlaskConical, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product/product-card";
import QuizModal from "@/components/quiz/quiz-modal";
import ImpactStats from "@/components/sustainability/impact-stats";
import type { Product, BlogPost } from "@shared/schema";

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { featured: true }],
  });

  const { data: trendingProducts = [], isLoading: trendingLoading } = useQuery({
    queryKey: ["/api/products", { trending: true }],
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog", { featured: true }],
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 139, 34, 0.3), rgba(34, 139, 34, 0.3)), url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in">
            Sustainable Beauty for 2025
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Plant-powered skincare with bakuchiol serums, vegan makeup, and eco-friendly formulations
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setIsQuizOpen(true)}
              className="bg-[var(--berry-red)] hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
            >
              Discover Your Routine
            </Button>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white hover:bg-white hover:text-[var(--forest-green)] text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
              >
                Shop Trending Products
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[var(--cream-beige)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-[var(--dark-green)] mb-4">
              Trending 2025 Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our bestselling sustainable skincare featuring bakuchiol serums, vegan makeup, and eco-friendly kits
            </p>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sustainability Impact */}
      <ImpactStats />

      {/* Product Quiz CTA */}
      <section className="py-16 bg-[var(--sage-green)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-[var(--dark-green)] mb-6">
              Find Your Perfect Routine
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Take our AI-powered quiz to get personalized product recommendations based on your skin type, concerns, and sustainability preferences
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--forest-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FlaskConical className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Skin Analysis</h3>
                  <p className="text-gray-600">AI-powered assessment of your skin type and concerns</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--forest-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Eco Preferences</h3>
                  <p className="text-gray-600">Match products to your sustainability values</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--forest-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Custom Bundle</h3>
                  <p className="text-gray-600">Receive a personalized routine with exclusive discounts</p>
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={() => setIsQuizOpen(true)}
                className="bg-[var(--berry-red)] hover:bg-red-700 text-white px-12 py-4 text-xl font-semibold transform hover:scale-105 transition-all"
              >
                Start Your 2-Minute Quiz
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-[var(--dark-green)] mb-4">
              Sustainable Beauty Insights
            </h2>
            <p className="text-lg text-gray-600">Latest trends, tips, and science behind clean beauty</p>
          </div>
          
          {blogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featuredImage || "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="text-sm text-[var(--forest-green)] font-semibold mb-2 uppercase tracking-wide">
                        {post.category}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--forest-green)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.readTime} min read</span>
                        <span className="text-[var(--forest-green)] font-semibold hover:text-[var(--dark-green)]">
                          Read More →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-[var(--forest-green)] text-[var(--forest-green)] hover:bg-[var(--forest-green)] hover:text-white">
                Read More Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-[var(--dark-green)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Join the Sustainable Beauty Movement</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get exclusive eco-tips, early access to new products, and 10% off your first purchase
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white text-gray-800 border-0"
            />
            <Button
              type="submit"
              className="bg-[var(--berry-red)] hover:bg-red-700 px-8 py-3 font-semibold"
            >
              Subscribe & Save
            </Button>
          </form>
          
          <p className="text-sm opacity-75 mt-4">Join 25,000+ eco-conscious beauty enthusiasts. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}
