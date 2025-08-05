import { useState } from "react";
import { X, Minus, Plus, Trash2, Truck, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, updateQuantity, removeFromCart, itemCount } = useCart();
  const [shippingType, setShippingType] = useState("standard");

  const shippingOptions = [
    {
      value: "standard",
      label: "Carbon Neutral",
      price: 5,
      time: "5-7 business days",
      icon: <Leaf className="h-4 w-4" />,
    },
    {
      value: "express",
      label: "Express Green",
      price: 10,
      time: "2-3 business days",
      icon: <Truck className="h-4 w-4" />,
    },
  ];

  const selectedShipping = shippingOptions.find(option => option.value === shippingType);
  const shippingCost = selectedShipping?.price || 0;
  const carbonOffset = 0; // Free carbon offset
  const finalTotal = total + shippingCost;
  const treesPlanted = Math.floor(finalTotal / 30) + 1; // 1 tree per $30 spent
  const co2Offset = treesPlanted * 0.6; // 0.6kg CO2 per tree

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-serif text-[var(--dark-green)]">
              Your Cart
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {itemCount > 0 && (
            <Badge variant="secondary" className="w-fit">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <Truck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-gray-600">Add some sustainable beauty products to get started!</p>
              <Button onClick={onClose} className="bg-[var(--forest-green)]">
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.product?.images[0] || "/placeholder-product.jpg"}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ${item.product?.price} each
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-semibold text-[var(--forest-green)]">
                      ${(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Options */}
            <div className="space-y-4">
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Eco-Friendly Shipping</h4>
                <RadioGroup value={shippingType} onValueChange={setShippingType}>
                  {shippingOptions.map((option) => (
                    <Label
                      key={option.value}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <RadioGroupItem value={option.value} />
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <div className="flex-1">
                          <div className="font-medium">
                            {option.label} - ${option.price}
                          </div>
                          <div className="text-sm text-gray-600">{option.time}</div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--forest-green)]">
                  <span>Carbon Offset:</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-[var(--forest-green)]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Sustainability Impact */}
              <div className="bg-[var(--cream-beige)] rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[var(--forest-green)] mb-2">
                  <Leaf className="h-5 w-5" />
                  <span className="font-semibold">Your Eco Impact</span>
                </div>
                <p className="text-sm text-gray-700">
                  🌱 Your order will plant {treesPlanted} {treesPlanted === 1 ? "tree" : "trees"} and offset {co2Offset.toFixed(1)}kg CO2
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full bg-[var(--berry-red)] hover:bg-red-700 text-white"
              >
                Secure Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
