import { Link } from "wouter";
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, Truck, Leaf, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();
  const [shippingType, setShippingType] = useState("standard");
  const [promoCode, setPromoCode] = useState("");

  const shippingOptions = [
    {
      value: "standard",
      label: "Standard Shipping (Carbon Neutral)",
      price: 5,
      time: "5-7 business days",
      icon: <Leaf className="h-4 w-4" />,
      description: "Free carbon offset included"
    },
    {
      value: "express",
      label: "Express Shipping (Green)",
      price: 15,
      time: "2-3 business days",
      icon: <Truck className="h-4 w-4" />,
      description: "Expedited with carbon offset"
    },
    {
      value: "overnight",
      label: "Overnight (Premium Green)",
      price: 25,
      time: "Next business day",
      icon: <Truck className="h-4 w-4" />,
      description: "Fastest option with environmental protection"
    }
  ];

  const selectedShipping = shippingOptions.find(option => option.value === shippingType);
  const shippingCost = selectedShipping?.price || 0;
  const subtotal = total;
  const carbonOffset = 0; // Free
  const promoDiscount = 0; // TODO: Implement promo code logic
  const finalTotal = subtotal + shippingCost - promoDiscount;

  // Sustainability calculations
  const treesPlanted = Math.floor(finalTotal / 30) + 1;
  const co2Offset = treesPlanted * 0.6;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handlePromoCode = () => {
    // TODO: Implement promo code validation
    console.log("Applying promo code:", promoCode);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[var(--dark-green)] mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any sustainable beauty products yet. 
              Start shopping and make a positive impact!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
                  Browse Products
                </Button>
              </Link>
              <Link href="/quiz">
                <Button size="lg" variant="outline" className="border-[var(--sage-green)] text-[var(--sage-green)]">
                  Take Skin Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[var(--dark-green)] mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product?.images[0] || "/placeholder-product.jpg"}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-lg hover:text-[var(--forest-green)] transition-colors mb-1">
                          {item.product?.name}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 mb-2">
                        ${item.product?.price} each
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-500">Carbon footprint:</span>
                        <span className="text-sm text-[var(--forest-green)]">
                          {item.product?.carbonFootprint}kg CO2e
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[3rem] text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[var(--forest-green)]">
                        ${(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Shipping Options */}
                <div>
                  <h3 className="font-semibold mb-3">Shipping Options</h3>
                  <RadioGroup value={shippingType} onValueChange={setShippingType}>
                    {shippingOptions.map((option) => (
                      <Label
                        key={option.value}
                        className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem value={option.value} className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {option.icon}
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {option.time} • ${option.price}
                          </div>
                          <div className="text-xs text-[var(--forest-green)]">
                            {option.description}
                          </div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Promo Code */}
                <div>
                  <h3 className="font-semibold mb-3">Promo Code</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={handlePromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--forest-green)]">
                    <span>Carbon Offset</span>
                    <span>Free</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[var(--forest-green)]">
                      <span>Promo Discount</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[var(--forest-green)]">${finalTotal.toFixed(2)}</span>
                </div>

                {/* Sustainability Impact */}
                <div className="bg-[var(--cream-beige)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-5 w-5 text-[var(--forest-green)]" />
                    <span className="font-semibold">Your Eco Impact</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-[var(--forest-green)]">
                        {treesPlanted}
                      </div>
                      <div className="text-xs text-gray-600">
                        {treesPlanted === 1 ? "Tree" : "Trees"} Planted
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--forest-green)]">
                        {co2Offset.toFixed(1)}kg
                      </div>
                      <div className="text-xs text-gray-600">CO2 Offset</div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full bg-[var(--berry-red)] hover:bg-red-700 text-white"
                    data-testid="button-checkout"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Security Notice */}
                <div className="text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span>🔒</span>
                    <span>Secure checkout</span>
                  </div>
                  <span>SSL encrypted • PCI compliant</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
