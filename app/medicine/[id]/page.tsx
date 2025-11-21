"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicalHeader } from "@/components/layout/medical-header"
import Footer from "@/components/layout/footer"

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }
    fetchProduct()
  }, [id])

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  // Fakestore API has only one image, so we wrap it in array
  const images = [product.image]
  const discountPercentage = 0 // Fakestore API has no MRP, so set 0 or mock value

  return (
    <div className="min-h-screen bg-background">
      <MedicalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                width={500}
                height={500}
                className="w-full h-96 object-contain bg-white rounded-lg border"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 offer-badge text-white">{discountPercentage}% OFF</Badge>
              )}
            </div>

            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <Image src={image} alt={`${product.title} ${index + 1}`} width={80} height={80} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-muted-foreground">Category: {product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.rate}</span>
              <span className="text-sm text-muted-foreground">({product.rating.count} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Get by 6pm</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Authentic</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                  <span className="px-4 py-2 text-sm">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon"><Heart className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="directions">Directions</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* For fake fields, just show placeholder text */}
            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Benefits information not available</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="directions" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Directions information not available</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Ingredients information not available</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
