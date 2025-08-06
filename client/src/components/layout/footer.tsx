import { Link } from "wouter";
import { Leaf, Instagram, Youtube } from "lucide-react";
import { FaTiktok, FaPinterest } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const productLinks = [
    { name: "Serums & Oils", href: "/products/serums" },
    { name: "Vegan Makeup", href: "/products/makeup" },
    { name: "Skincare Kits", href: "/products/kits" },
    { name: "Supplements", href: "/products/supplements" },
    { name: "Gift Cards", href: "/products/gifts" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Track Order", href: "/track" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 eco-gradient" />
              <span className="text-2xl font-serif font-bold">EcoGlow</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Sustainable skincare for the conscious beauty lover. Plant-powered 
              formulations for radiant, healthy skin.
            </p>
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p>📍 123 Eco Beauty Lane, Green Valley, CA 90210</p>
              <p>📧 hello@ecoglow.com</p>
              <p>📞 <a href="tel:+1-555-ECO-GLOW" className="hover:text-white transition-colors">(555) ECO-GLOW</a></p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2 hover:text-[var(--sage-green)]">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:text-[var(--sage-green)]">
                <FaTiktok className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:text-[var(--sage-green)]">
                <FaPinterest className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:text-[var(--sage-green)]">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <Separator className="my-8 bg-gray-800" />
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif font-bold mb-4">
            Join the Sustainable Beauty Movement
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Get exclusive eco-tips, early access to new products, and 10% off your first purchase
          </p>
          
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
            <Button
              type="submit"
              className="bg-[var(--berry-red)] hover:bg-red-700 text-white px-8 py-2 micro-bounce hover-glow"
              data-testid="button-newsletter-subscribe"
            >
              Subscribe & Save
            </Button>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            Join 25,000+ eco-conscious beauty enthusiasts. Unsubscribe anytime.
          </p>
        </div>

        {/* Bottom Bar */}
        <Separator className="mb-8 bg-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 EcoGlow Skincare Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
