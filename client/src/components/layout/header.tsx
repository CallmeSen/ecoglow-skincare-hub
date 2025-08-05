import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingBag, User, Menu, Mic, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useVoiceSearch } from "@/hooks/use-voice-search";
import CartSidebar from "@/components/cart/cart-sidebar";
import VoiceSearch from "@/components/search/voice-search";

export default function Header() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { itemCount } = useCart();
  const { isListening, startListening } = useVoiceSearch();

  const navigation = [
    { name: "Products", href: "/products" },
    { name: "Quiz", href: "/quiz" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Blog", href: "/blog" },
    { name: "Account", href: "/account" },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  const handleVoiceSearch = () => {
    startListening();
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Leaf className="h-8 w-8 text-[var(--forest-green)] group-hover:text-[var(--dark-green)] transition-colors" />
              <span className="text-2xl font-serif font-bold text-[var(--dark-green)]">
                EcoGlow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-[var(--forest-green)] ${
                    isActive(item.href)
                      ? "text-[var(--forest-green)]"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search & Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className={`flex items-center transition-all duration-300 ${
                  isSearchExpanded ? "w-80" : "w-64"
                }`}>
                  <Input
                    type="text"
                    placeholder="Search sustainable beauty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => setIsSearchExpanded(false)}
                    className="pr-20 rounded-full border-[var(--sage-green)] focus:ring-[var(--forest-green)]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceSearch}
                    className={`absolute right-10 h-8 w-8 p-0 rounded-full ${
                      isListening ? "text-red-500 animate-pulse" : "text-[var(--sage-green)]"
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 h-8 w-8 p-0 rounded-full text-[var(--sage-green)]"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Icons */}
              <Link href="/account">
                <Button variant="ghost" size="sm" className="p-2">
                  <Heart className="h-5 w-5 text-[var(--sage-green)]" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2"
              >
                <ShoppingBag className="h-5 w-5 text-[var(--sage-green)]" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-[var(--berry-red)]"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              <Link href="/account">
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-5 w-5 text-[var(--sage-green)]" />
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2">
                    <Menu className="h-5 w-5 text-[var(--sage-green)]" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search..."
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block py-2 px-4 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-[var(--cream-beige)] text-[var(--forest-green)]"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Voice Search Component */}
      <VoiceSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
    </>
  );
}
