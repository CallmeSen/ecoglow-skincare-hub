import { Link } from "wouter";
import { ArrowLeft, Leaf, Recycle, Truck, Users, TreePine, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImpactStats from "@/components/sustainability/impact-stats";

export default function Sustainability() {
  const initiatives = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "100% Vegan & Cruelty-Free",
      description: "All our products are certified vegan and never tested on animals. We partner with Leaping Bunny for verification.",
      progress: 100,
      color: "bg-[var(--forest-green)]"
    },
    {
      icon: <Recycle className="h-8 w-8" />,
      title: "Sustainable Packaging",
      description: "95% of our packaging is made from recyclable or biodegradable materials. We're working toward 100% by 2026.",
      progress: 95,
      color: "bg-[var(--sage-green)]"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Carbon Neutral Shipping",
      description: "Every order is shipped carbon-neutral through our partnerships with climate action organizations.",
      progress: 100,
      color: "bg-[var(--forest-green)]"
    },
    {
      icon: <TreePine className="h-8 w-8" />,
      title: "Tree Planting Program",
      description: "We plant one tree for every $30 spent. Over 12,000 trees planted and counting across reforestation projects.",
      progress: 85,
      color: "bg-[var(--light-green)]"
    }
  ];

  const certifications = [
    {
      name: "Leaping Bunny",
      description: "Cruelty-Free Certification",
      image: "https://via.placeholder.com/120x80/228B22/FFFFFF?text=Leaping+Bunny"
    },
    {
      name: "USDA Organic",
      description: "Organic Ingredients Certification",
      image: "https://via.placeholder.com/120x80/90EE90/000000?text=USDA+Organic"
    },
    {
      name: "B Corp",
      description: "Certified B Corporation",
      image: "https://via.placeholder.com/120x80/A8CABA/000000?text=B+Corp"
    },
    {
      name: "Climate Neutral",
      description: "Carbon Neutral Certified",
      image: "https://via.placeholder.com/120x80/006400/FFFFFF?text=Climate+Neutral"
    }
  ];

  const supplyChain = [
    {
      stage: "Sourcing",
      description: "Direct partnerships with organic farms practicing regenerative agriculture",
      icon: <Leaf className="h-6 w-6" />,
      details: [
        "Fair trade certified suppliers",
        "Regenerative farming practices",
        "Local sourcing when possible",
        "Regular sustainability audits"
      ]
    },
    {
      stage: "Manufacturing",
      description: "Clean production facilities powered by renewable energy",
      icon: <Droplets className="h-6 w-6" />,
      details: [
        "100% renewable energy",
        "Water conservation systems",
        "Waste reduction programs",
        "Chemical-free processes"
      ]
    },
    {
      stage: "Packaging",
      description: "Minimal, recyclable packaging made from post-consumer materials",
      icon: <Recycle className="h-6 w-6" />,
      details: [
        "Recyclable glass bottles",
        "Biodegradable labels",
        "Minimal plastic use",
        "Compostable shipping materials"
      ]
    },
    {
      stage: "Distribution",
      description: "Carbon-neutral shipping with optimized logistics",
      icon: <Truck className="h-6 w-6" />,
      details: [
        "Carbon offset programs",
        "Optimized shipping routes",
        "Electric vehicle fleet",
        "Local distribution centers"
      ]
    }
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

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-[var(--dark-green)] mb-6">
            Our Commitment to Sustainability
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We believe that beauty should never come at the cost of our planet. 
            Every product, package, and process is designed with environmental responsibility in mind.
          </p>
          
          <div className="inline-flex items-center gap-2 bg-[var(--forest-green)] text-white px-6 py-3 rounded-full">
            <Leaf className="h-5 w-5" />
            <span className="font-semibold">Carbon Negative Since 2023</span>
          </div>
        </div>

        {/* Impact Stats */}
        <ImpactStats />

        {/* Sustainability Initiatives */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[var(--dark-green)] mb-8">
            Our Sustainability Initiatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--sage-green)] rounded-full flex items-center justify-center text-white">
                      {initiative.icon}
                    </div>
                    <CardTitle className="text-xl">{initiative.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{initiative.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{initiative.progress}%</span>
                    </div>
                    <Progress value={initiative.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Information Tabs */}
        <section className="mb-16">
          <Tabs defaultValue="supply-chain" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="packaging">Packaging</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="supply-chain" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Transparent Supply Chain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {supplyChain.map((stage, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-[var(--forest-green)] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                          {stage.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{stage.stage}</h3>
                        <p className="text-gray-600 text-sm mb-4">{stage.description}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {stage.details.map((detail, i) => (
                            <li key={i}>• {detail}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Clean, Sustainable Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Plant-Based Actives</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Bakuchiol from Psoralea corylifolia</li>
                        <li>• Beetroot extract for natural color</li>
                        <li>• Organic botanical oils</li>
                        <li>• Wildcrafted herbal extracts</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Sourcing Standards</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• USDA Organic certified</li>
                        <li>• Fair trade partnerships</li>
                        <li>• Regenerative agriculture</li>
                        <li>• Biodiversity conservation</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">What We Avoid</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Synthetic fragrances</li>
                        <li>• Parabens and sulfates</li>
                        <li>• Animal-derived ingredients</li>
                        <li>• Harmful preservatives</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="packaging" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Sustainable Packaging Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Current Materials</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Recyclable Glass</span>
                            <span className="font-semibold text-[var(--forest-green)]">70%</span>
                          </div>
                          <Progress value={70} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span>Post-Consumer Plastic</span>
                            <span className="font-semibold text-[var(--forest-green)]">20%</span>
                          </div>
                          <Progress value={20} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span>Biodegradable Materials</span>
                            <span className="font-semibold text-[var(--forest-green)]">10%</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Innovation Goals</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-[var(--forest-green)] rounded-full mt-2" />
                            <span>100% recyclable packaging by 2026</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-[var(--forest-green)] rounded-full mt-2" />
                            <span>Refillable product options</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-[var(--forest-green)] rounded-full mt-2" />
                            <span>Compostable shipping materials</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-[var(--forest-green)] rounded-full mt-2" />
                            <span>Ocean plastic collection program</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="impact" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Carbon Footprint</h3>
                      <div className="space-y-4">
                        <div className="bg-[var(--cream-beige)] rounded-lg p-4">
                          <div className="text-2xl font-bold text-[var(--forest-green)] mb-1">-25%</div>
                          <div className="text-sm text-gray-600">Carbon negative operations</div>
                        </div>
                        <div className="bg-[var(--cream-beige)] rounded-lg p-4">
                          <div className="text-2xl font-bold text-[var(--forest-green)] mb-1">500 tons</div>
                          <div className="text-sm text-gray-600">CO2 offset annually</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Conservation Efforts</h3>
                      <div className="space-y-4">
                        <div className="bg-[var(--cream-beige)] rounded-lg p-4">
                          <div className="text-2xl font-bold text-[var(--forest-green)] mb-1">1M gallons</div>
                          <div className="text-sm text-gray-600">Water saved through efficiency</div>
                        </div>
                        <div className="bg-[var(--cream-beige)] rounded-lg p-4">
                          <div className="text-2xl font-bold text-[var(--forest-green)] mb-1">50 acres</div>
                          <div className="text-sm text-gray-600">Habitat protected per year</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[var(--dark-green)] mb-8">
            Our Certifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-20 object-contain mb-4"
                  />
                  <h3 className="font-semibold mb-1">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-[var(--forest-green)] text-white rounded-2xl p-12">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Join Our Sustainability Journey
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Every purchase you make supports our mission to create a more sustainable beauty industry. 
            Together, we can make a difference for our planet.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-[var(--forest-green)] hover:bg-gray-100">
                Shop Sustainable Products
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--forest-green)]">
                Find Your Perfect Match
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
