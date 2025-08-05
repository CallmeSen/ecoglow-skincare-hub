import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Quiz from "@/pages/quiz";
import Sustainability from "@/pages/sustainability";
import Blog from "@/pages/blog";
import Cart from "@/pages/cart";
import Account from "@/pages/account";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:category" component={Products} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/sustainability" component={Sustainability} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={Blog} />
          <Route path="/cart" component={Cart} />
          <Route path="/account" component={Account} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Router />
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
