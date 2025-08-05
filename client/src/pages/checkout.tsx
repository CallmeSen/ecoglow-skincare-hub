import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronRight, Lock, Leaf, CreditCard, MapPin, Package, Check, ShoppingCart, Truck, Zap, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, CartItem } from "@shared/schema";

interface CheckoutFormData {
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    shippingMethod: string;
  };
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
    billingAddressSame: boolean;
    billingAddress?: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  ecoOptions: {
    carbonOffset: boolean;
    extraTrees: boolean;
  };
}

const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard",
    price: 5,
    description: "Carbon-Neutral, 3-5 Days",
    icon: Truck,
    ecoBonus: "Plants 1 Tree"
  },
  {
    id: "express",
    name: "Express",
    price: 10,
    description: "Offset Emissions, 1-2 Days", 
    icon: Zap,
    ecoBonus: "Plants 2 Trees"
  }
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      shippingMethod: "standard"
    },
    payment: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      billingAddressSame: true
    },
    ecoOptions: {
      carbonOffset: true,
      extraTrees: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart } = useCart();
  const { toast } = useToast();

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart/demo-user"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setLocation("/cart");
    }
  }, [cartItems, setLocation]);

  const getCartItemsWithProducts = () => {
    return cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return { ...cartItem, product };
    }).filter(item => item.product);
  };

  const cartItemsWithProducts = getCartItemsWithProducts();

  const calculateSubtotal = () => {
    return cartItemsWithProducts.reduce((total, item) => {
      return total + (parseFloat(item.product!.price) * (item.quantity || 1));
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax rate
  };

  const calculateShipping = () => {
    const method = SHIPPING_METHODS.find(m => m.id === formData.shipping.shippingMethod);
    return method ? method.price : 0;
  };

  const calculateEcoFees = () => {
    let fees = 0;
    if (formData.ecoOptions.carbonOffset) fees += 2;
    if (formData.ecoOptions.extraTrees) fees += 3;
    return fees;
  };

  const calculateCarbonOffset = () => {
    return cartItemsWithProducts.length * 0.4; // 0.4kg CO2 per item
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping();
    const ecoFees = calculateEcoFees();
    return subtotal + tax + shipping + ecoFees;
  };

  const handleInputChange = (section: keyof CheckoutFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const shipping = formData.shipping;
        return !!(shipping.firstName && shipping.lastName && shipping.email && 
                 shipping.address && shipping.city && shipping.state && shipping.zipCode);
      case 2:
        const payment = formData.payment;
        return !!(payment.cardNumber && payment.expiryDate && payment.cvv && payment.cardName);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        items: cartItemsWithProducts.map(item => ({
          productId: item.productId,
          quantity: item.quantity || 1,
          price: item.product!.price
        })),
        shipping: formData.shipping,
        payment: { last4: formData.payment.cardNumber.slice(-4) },
        totals: {
          subtotal: calculateSubtotal(),
          tax: calculateTax(calculateSubtotal()),
          shipping: calculateShipping(),
          ecoFees: calculateEcoFees(),
          total: calculateTotal()
        },
        ecoOptions: formData.ecoOptions,
        carbonOffset: calculateCarbonOffset()
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id} - You've offset ${calculateCarbonOffset()}kg CO2!`
      });
      setLocation(`/orders/${order.id}`);
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    }
  });

  const handlePlaceOrder = () => {
    if (validateStep(2)) {
      setIsLoading(true);
      placeOrderMutation.mutate();
    }
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step <= currentStep 
              ? "bg-[var(--sage-green)] border-[var(--sage-green)] text-white" 
              : "border-gray-300 text-gray-300"
          }`}>
            {step < currentStep ? <Check className="h-4 w-4" /> : step}
          </div>
          <span className={`ml-2 text-sm ${
            step <= currentStep ? "text-[var(--dark-green)] font-semibold" : "text-gray-400"
          }`}>
            {step === 1 && "Shipping"}
            {step === 2 && "Payment"} 
            {step === 3 && "Review"}
          </span>
          {index < 2 && <ChevronRight className="h-4 w-4 mx-4 text-gray-300" />}
        </div>
      ))}
    </div>
  );

  const renderShippingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.shipping.firstName}
              onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
              required
              data-testid="input-firstName"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.shipping.lastName}
              onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
              required
              data-testid="input-lastName"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.shipping.email}
            onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
            required
            data-testid="input-email"
          />
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.shipping.address}
            onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
            required
            data-testid="input-address"
          />
        </div>

        <div>
          <Label htmlFor="apartment">Apartment, suite, etc.</Label>
          <Input
            id="apartment"
            value={formData.shipping.apartment}
            onChange={(e) => handleInputChange('shipping', 'apartment', e.target.value)}
            data-testid="input-apartment"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.shipping.city}
              onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
              required
              data-testid="input-city"
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.shipping.state}
              onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
              required
              data-testid="input-state"
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.shipping.zipCode}
              onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
              required
              data-testid="input-zipCode"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.shipping.phone}
            onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
            data-testid="input-phone"
          />
        </div>

        <div>
          <Label>Shipping Method</Label>
          <RadioGroup
            value={formData.shipping.shippingMethod}
            onValueChange={(value) => handleInputChange('shipping', 'shippingMethod', value)}
            className="mt-2"
          >
            {SHIPPING_METHODS.map((method) => (
              <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <method.icon className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">{method.name} - ${method.price}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-[var(--sage-green)] text-white">
                      {method.ecoBonus}
                    </Badge>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number *</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.payment.cardNumber}
            onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
            required
            data-testid="input-cardNumber"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={formData.payment.expiryDate}
              onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
              required
              data-testid="input-expiryDate"
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={formData.payment.cvv}
              onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
              required
              data-testid="input-cvv"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cardName">Name on Card *</Label>
          <Input
            id="cardName"
            value={formData.payment.cardName}
            onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
            required
            data-testid="input-cardName"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="billingAddressSame"
            checked={formData.payment.billingAddressSame}
            onCheckedChange={(checked) => handleInputChange('payment', 'billingAddressSame', checked)}
          />
          <Label htmlFor="billingAddressSame">Billing address same as shipping</Label>
        </div>

        <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
          <Lock className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-800">Your payment information is secure and encrypted</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div>
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {cartItemsWithProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={item.product!.images?.[0] || "/placeholder-product.jpg"}
                  alt={item.product!.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product!.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(parseFloat(item.product!.price) * (item.quantity || 1)).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">${item.product!.price} each</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shipping & Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p>{formData.shipping.firstName} {formData.shipping.lastName}</p>
              <p>{formData.shipping.address}</p>
              {formData.shipping.apartment && <p>{formData.shipping.apartment}</p>}
              <p>{formData.shipping.city}, {formData.shipping.state} {formData.shipping.zipCode}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="text-sm text-gray-600">
              <p>**** **** **** {formData.payment.cardNumber.slice(-4)}</p>
              <p>{formData.payment.cardName}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Eco Options */}
        <div>
          <h3 className="font-semibold mb-4">Sustainability Options</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <span>Carbon Offset (Included)</span>
              </div>
              <span className="text-green-600 font-semibold">
                {calculateCarbonOffset().toFixed(1)}kg CO2 offset
              </span>
            </div>
            {formData.ecoOptions.carbonOffset && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span>Additional Carbon Offset</span>
                <span>+$2.00</span>
              </div>
            )}
            {formData.ecoOptions.extraTrees && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span>Plant Extra Trees</span>
                <span>+$3.00</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOrderSummary = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping();
    const ecoFees = calculateEcoFees();
    const total = calculateTotal();

    return (
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {ecoFees > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Eco Options</span>
                <span>+${ecoFees.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-[var(--berry-red)]">${total.toFixed(2)}</span>
          </div>

          {currentStep < 3 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Eco Options</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="carbonOffset"
                    checked={formData.ecoOptions.carbonOffset}
                    onCheckedChange={(checked) => handleInputChange('ecoOptions', 'carbonOffset', checked)}
                  />
                  <Label htmlFor="carbonOffset" className="text-sm">
                    Extra Carbon Offset (+$2.00)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extraTrees"
                    checked={formData.ecoOptions.extraTrees}
                    onCheckedChange={(checked) => handleInputChange('ecoOptions', 'extraTrees', checked)}
                  />
                  <Label htmlFor="extraTrees" className="text-sm">
                    Plant Extra Trees (+$3.00)
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">
                Your order is carbon neutral! We've offset {calculateCarbonOffset().toFixed(1)}kg CO2
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to continue with checkout</p>
          <Button onClick={() => setLocation("/products")} size="lg">
            Shop Trending Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-6 w-6 text-[var(--sage-green)]" />
            <h1 className="text-3xl font-serif font-bold text-[var(--dark-green)]">
              Secure Checkout
            </h1>
          </div>
          <p className="text-gray-600">Finalize Your Sustainable Order</p>
        </div>

        {renderProgressIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && renderShippingStep()}
            {currentStep === 2 && renderPaymentStep()}
            {currentStep === 3 && renderReviewStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} data-testid="button-previous">
                  Previous
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <Button onClick={nextStep} data-testid="button-next">
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || placeOrderMutation.isPending}
                    className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--berry-red)] text-white px-8 py-3 text-lg font-semibold"
                    data-testid="button-place-order"
                  >
                    {isLoading || placeOrderMutation.isPending ? "Processing..." : "Place Order"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            {renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  );
}