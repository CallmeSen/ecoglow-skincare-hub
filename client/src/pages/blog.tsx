import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar, User, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product/product-card";
import type { BlogPost, Product } from "@shared/schema";

export default function Blog() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: blogPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/blog"],
  });

  const { data: currentPost, isLoading: postLoading } = useQuery({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["/api/products"],
    enabled: !!currentPost?.productIds?.length,
  });

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "skincare-science", label: "Skincare Science" },
    { value: "makeup-trends", label: "Makeup Trends" },
    { value: "sustainability", label: "Sustainability" },
    { value: "ingredients", label: "Ingredients" },
    { value: "tutorials", label: "Tutorials" },
  ];

  const filteredPosts = blogPosts.filter((post: BlogPost) => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const relatedProductsFiltered = relatedProducts.filter((product: Product) =>
    currentPost?.productIds?.includes(product.id)
  );

  // If viewing a specific blog post
  if (slug) {
    if (postLoading) {
      return (
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-200 h-8 rounded mb-6 animate-pulse" />
              <div className="bg-gray-200 h-64 rounded-xl mb-8 animate-pulse" />
              <div className="space-y-4">
                <div className="bg-gray-200 h-4 rounded animate-pulse" />
                <div className="bg-gray-200 h-4 rounded animate-pulse" />
                <div className="bg-gray-200 h-4 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!currentPost) {
      return (
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Blog Post */}
          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-[var(--sage-green)] text-white">
                  {currentPost.category}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{currentPost.readTime} min read</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--dark-green)] mb-4">
                {currentPost.title}
              </h1>
              
              {currentPost.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {currentPost.excerpt}
                </p>
              )}
            </header>

            {/* Featured Image */}
            {currentPost.featuredImage && (
              <div className="mb-8">
                <img
                  src={currentPost.featuredImage}
                  alt={currentPost.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {currentPost.content}
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProductsFiltered.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-serif font-bold text-[var(--dark-green)] mb-6">
                  Products Mentioned in This Article
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProductsFiltered.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Share and Tags */}
            <footer className="border-t pt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex gap-2">
                    <Badge variant="outline">{currentPost.category}</Badge>
                    {currentPost.productIds?.length > 0 && (
                      <Badge variant="outline">Product Guide</Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: currentPost.title,
                        text: currentPost.excerpt,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  Share Article
                </Button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
  }

  // Blog listing page
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--dark-green)] mb-6">
            Sustainable Beauty Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest trends, tips, and science behind clean beauty. 
            Learn how to create an eco-friendly routine that's good for you and the planet.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === "all" && searchQuery === "" && (
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-[var(--dark-green)] mb-6">
              Featured Articles
            </h2>
            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts
                  .filter((post: BlogPost) => post.featured)
                  .slice(0, 3)
                  .map((post: BlogPost) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featuredImage || "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            <Badge className="bg-[var(--sage-green)] text-white">
                              {post.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--forest-green)] transition-colors flex-1">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
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
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[var(--dark-green)] mb-6">
            {selectedCategory === "all" ? "Latest Articles" : categories.find(c => c.value === selectedCategory)?.label}
          </h2>
          
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <div className="mb-6 text-sm text-gray-600">
                Showing {filteredPosts.length} articles
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post: BlogPost) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage || "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <Badge className="bg-[var(--sage-green)] text-white">
                            {post.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} min</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--forest-green)] transition-colors flex-1">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[var(--forest-green)] font-semibold hover:text-[var(--dark-green)]">
                            Read More →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or category filter.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 text-center bg-[var(--cream-beige)] rounded-2xl p-12">
          <h2 className="text-3xl font-serif font-bold text-[var(--dark-green)] mb-4">
            Stay Updated on Sustainable Beauty
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Get the latest articles, tips, and product recommendations delivered to your inbox.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1"
            />
            <Button className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
              Subscribe
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
