import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Heart, Package, Leaf, Settings, TreePine, Droplets, Edit2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product/product-card";
import { useWishlist } from "@/hooks/use-wishlist";
import type { WishlistItemWithProduct } from "@/lib/types";
import type { Order, Product } from "@shared/schema";

export default function Account() {
  const [activeSection, setActiveSection] = useState("profile");
  const { items: wishlistItems } = useWishlist();
  
  // Mock user data - in real app, this would come from authentication
  const userData = {
    id: "demo-user",
    email: "user@example.com",
    firstName: "Emma",
    lastName: "Johnson",
    profileImageUrl: "",
    skinType: "combination",
    skinConcerns: ["aging", "hydration"],
    sustainabilityPreference: "very",
    budget: "medium",
    treesPlanted: 12,
    co2Offset: "8.5",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  };

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders", userData.id],
  });

  const sustainabilityStats = [
    {
      icon: <TreePine className="h-8 w-8" />,
      value: userData.treesPlanted,
      label: "Trees Planted",
      description: "Through your purchases",
      color: "text-[var(--forest-green)]",
      bgColor: "bg-[var(--forest-green)]/10"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      value: `${userData.co2Offset}kg`,
      label: "CO2 Offset",
      description: "Carbon neutralized",
      color: "text-[var(--sage-green)]",
      bgColor: "bg-[var(--sage-green)]/10"
    },
    {
      icon: <Droplets className="h-8 w-8" />,
      value: "2,450L",
      label: "Water Saved",
      description: "Through sustainable choices",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Package className="h-8 w-8" />,
      value: orders.length,
      label: "Eco Orders",
      description: "Sustainable purchases",
      color: "text-[var(--dark-green)]",
      bgColor: "bg-[var(--dark-green)]/10"
    }
  ];

  const ecoLevel = Math.min(Math.floor((userData.treesPlanted + parseFloat(userData.co2Offset)) / 5), 10);
  const ecoLevelNames = [
    "Eco Beginner", "Green Enthusiast", "Sustainability Advocate", 
    "Eco Warrior", "Planet Guardian", "Green Champion", 
    "Sustainability Master", "Eco Legend", "Green Guru", "Planet Hero"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.profileImageUrl} />
                    <AvatarFallback className="text-2xl bg-[var(--sage-green)] text-white">
                      {userData.firstName[0]}{userData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white border shadow-md hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-serif font-bold text-[var(--dark-green)] mb-2">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-gray-600 mb-4">{userData.email}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <Badge className="bg-[var(--sage-green)] text-white">
                      {userData.skinType} skin
                    </Badge>
                    <Badge className="bg-[var(--forest-green)] text-white">
                      {ecoLevelNames[ecoLevel]}
                    </Badge>
                    <Badge variant="outline">
                      Member since {userData.createdAt.getFullYear()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Leaf
                          key={star}
                          className={`h-4 w-4 ${
                            star <= ecoLevel / 2 
                              ? "text-[var(--forest-green)] fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      Eco Level {ecoLevel}/10
                    </span>
                  </div>
                </div>

                <Button className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sustainability Impact Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-[var(--dark-green)] mb-4">
            Your Environmental Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sustainabilityStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist ({wishlistItems.length})</TabsTrigger>
            <TabsTrigger value="impact">Sustainability</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={userData.firstName} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={userData.lastName} />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userData.email} />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter your address" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skin Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="skinType">Skin Type</Label>
                    <Select defaultValue={userData.skinType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">Dry</SelectItem>
                        <SelectItem value="oily">Oily</SelectItem>
                        <SelectItem value="combination">Combination</SelectItem>
                        <SelectItem value="sensitive">Sensitive</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Main Skin Concerns</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["aging", "acne", "pigmentation", "hydration", "dullness", "sensitivity"].map((concern) => (
                        <Badge
                          key={concern}
                          variant={userData.skinConcerns.includes(concern) ? "default" : "outline"}
                          className={userData.skinConcerns.includes(concern) ? "bg-[var(--sage-green)] text-white" : ""}
                        >
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select defaultValue={userData.budget}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Under $50/month</SelectItem>
                        <SelectItem value="medium">$50-100/month</SelectItem>
                        <SelectItem value="high">$100+/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sustainability">Sustainability Priority</Label>
                    <Select defaultValue={userData.sustainabilityPreference}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very">Very Important</SelectItem>
                        <SelectItem value="somewhat">Somewhat Important</SelectItem>
                        <SelectItem value="not">Not a Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            className={
                              order.status === "delivered" ? "bg-green-100 text-green-800" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">${parseFloat(order.total).toFixed(2)}</span>
                          <div className="flex items-center gap-2 text-sm text-[var(--forest-green)]">
                            <TreePine className="h-4 w-4" />
                            <span>{order.treesPlanted} trees planted</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start shopping for sustainable beauty products!
                    </p>
                    <Link href="/products">
                      <Button className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item: WishlistItemWithProduct) => (
                      item.product && (
                        <ProductCard key={item.id} product={item.product as Product} />
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">
                      Save products you love for later!
                    </p>
                    <Link href="/products">
                      <Button className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]">
                        Discover Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sustainability Impact Tab */}
          <TabsContent value="impact">
            <div className="space-y-8">
              {/* Progress Towards Next Level */}
              <Card>
                <CardHeader>
                  <CardTitle>Eco Level Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Current Level: {ecoLevelNames[ecoLevel]}</span>
                      <span>Level {ecoLevel}/10</span>
                    </div>
                    <Progress value={(ecoLevel / 10) * 100} className="h-3" />
                    <p className="text-sm text-gray-600">
                      {ecoLevel < 10 
                        ? `Plant ${5 - (ecoLevel % 5)} more trees or offset ${5 - (ecoLevel % 5)}kg more CO2 to reach the next level!`
                        : "Congratulations! You've reached the maximum eco level!"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>This Month's Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--forest-green)] mb-2">3</div>
                      <div className="text-sm text-gray-600">Trees Planted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--sage-green)] mb-2">2.1kg</div>
                      <div className="text-sm text-gray-600">CO2 Offset</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">450L</div>
                      <div className="text-sm text-gray-600">Water Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Sustainability Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-[var(--cream-beige)] rounded-lg">
                      <div className="w-10 h-10 bg-[var(--forest-green)] rounded-full flex items-center justify-center">
                        <TreePine className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Planted 5 trees</div>
                        <div className="text-sm text-gray-600">Last order • 2 days ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-[var(--cream-beige)] rounded-lg">
                      <div className="w-10 h-10 bg-[var(--sage-green)] rounded-full flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Offset 3.2kg CO2</div>
                        <div className="text-sm text-gray-600">Carbon neutral shipping • 1 week ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-[var(--cream-beige)] rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Saved 800L water</div>
                        <div className="text-sm text-gray-600">Sustainable packaging choice • 2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges and Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Eco Badges Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-[var(--forest-green)] rounded-full flex items-center justify-center mx-auto mb-2">
                        <TreePine className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold">Tree Planter</div>
                      <div className="text-xs text-gray-600">10+ trees planted</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-[var(--sage-green)] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold">Carbon Warrior</div>
                      <div className="text-xs text-gray-600">5kg+ CO2 offset</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg opacity-50">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="text-sm font-semibold">Eco Shopper</div>
                      <div className="text-xs text-gray-600">25+ eco orders</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg opacity-50">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="text-sm font-semibold">Influencer</div>
                      <div className="text-xs text-gray-600">Refer 5 friends</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
