"use client"

import { useState, useRef, useEffect } from "react"
import {
  Camera,
  X,
  FileScan,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  ChevronRight,
  Loader2,
  PlusSquare,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils" // Make sure you have a utility for classnames

// --- Mock Data & Types ---
interface GeneratedInvoice {
  id: number
  medicineName: string
  molecule: string
  batchNumber: string
  expiryDate: string
  price: number
  mrp: number
  quantity: number
}

interface CapturedProduct {
  id: number
  images: string[]
}

const mockExtractedDataList: GeneratedInvoice[] = [
  {
    id: 1,
    medicineName: "Dolo 650 Tablet",
    molecule: "Paracetamol",
    batchNumber: "DL008-NEW",
    expiryDate: "2026-10-31",
    price: 30.5,
    mrp: 35,
    quantity: 100,
  },
  {
    id: 2,
    medicineName: "Crocin Advance Tablet",
    molecule: "Paracetamol",
    batchNumber: "CRN-451",
    expiryDate: "2027-05-20",
    price: 45,
    mrp: 50,
    quantity: 50,
  },
]

const mockPhysicalInvoiceDataList: GeneratedInvoice[] = [
  {
    id: 1,
    medicineName: "Dolo 650 Tablet",
    molecule: "Paracetamol",
    batchNumber: "DL008-NEW",
    expiryDate: "2026-10-31",
    price: 29.8, // Mismatch
    mrp: 35,
    quantity: 98, // Mismatch
  },
  {
    id: 2,
    medicineName: "Crocin Advance Tablet",
    molecule: "Paracetamol",
    batchNumber: "CRN-451",
    expiryDate: "2027-05-20",
    price: 45,
    mrp: 50,
    quantity: 50,
  },
]

// --- Main Component ---
export function AddStockFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"capture" | "review" | "verify" | "compare" | "success">("capture")
  const [capturedProducts, setCapturedProducts] = useState<CapturedProduct[]>([{ id: 1, images: [] }])
  const [activeProductIndex, setActiveProductIndex] = useState(0)
  const [generatedInvoices, setGeneratedInvoices] = useState<GeneratedInvoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (step === "capture" || step === "verify") {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream
        })
        .catch((err) => console.error("Camera error:", err))

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          ;(videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [step])

  const handleCaptureImage = () => {
    const newImage = `https://via.placeholder.com/150/0000FF/FFFFFF?text=Img${
      capturedProducts[activeProductIndex].images.length + 1
    }`
    setCapturedProducts((prev) => {
      const updated = [...prev]
      updated[activeProductIndex].images.push(newImage)
      return updated
    })
  }

  const handleDeleteImage = (prodIndex: number, imgIndex: number) => {
    setCapturedProducts((prev) => {
      const updated = [...prev]
      updated[prodIndex].images.splice(imgIndex, 1)
      return updated
    })
  }

  const handleAddProduct = () => {
    setCapturedProducts((prev) => [...prev, { id: Date.now(), images: [] }])
    setActiveProductIndex(capturedProducts.length)
  }

  const handleDeleteProduct = (prodIndex: number) => {
    setCapturedProducts((prev) => prev.filter((_, i) => i !== prodIndex))
    // Adjust active index if necessary
    if (activeProductIndex >= prodIndex) {
      setActiveProductIndex(Math.max(0, activeProductIndex - 1))
    }
  }

  const handleGenerateInvoice = () => {
    setIsLoading(true)
    setTimeout(() => {
      setGeneratedInvoices(mockExtractedDataList)
      setStep("review")
      setIsLoading(false)
    }, 1500)
  }

  const handleScanPhysicalInvoice = () => {
    setIsLoading(true)
    setTimeout(() => {
      setStep("compare")
      setIsLoading(false)
    }, 1500)
  }

  const handleConfirmStock = () => {
    setIsLoading(true)
    setTimeout(() => {
      setStep("success")
      setIsLoading(false)
    }, 1000)
  }

  const renderStep = () => {
    switch (step) {
      case "capture":
        return (
          <CameraCaptureStep
            videoRef={videoRef}
            capturedProducts={capturedProducts}
            activeProductIndex={activeProductIndex}
            onSetActiveProduct={setActiveProductIndex}
            onCapture={handleCaptureImage}
            onDeleteImage={handleDeleteImage}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onGenerate={handleGenerateInvoice}
            isLoading={isLoading}
          />
        )
      case "review":
        return (
          <ReviewInvoiceStep
            invoices={generatedInvoices}
            onProceed={() => setStep("verify")}
            onBack={() => setStep("capture")}
          />
        )
      case "verify":
        return (
          <ScanPhysicalInvoiceStep
            videoRef={videoRef}
            onScan={handleScanPhysicalInvoice}
            onBack={() => setStep("review")}
            isLoading={isLoading}
          />
        )
      case "compare":
        return (
          <CompareStep
            generated={generatedInvoices}
            scanned={mockPhysicalInvoiceDataList}
            onConfirm={handleConfirmStock}
            onBack={() => setStep("verify")}
            isLoading={isLoading}
          />
        )
      case "success":
        return <SuccessStep onClose={onClose} count={generatedInvoices.length} />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        <header className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-semibold">Add New Stock from Invoice</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </header>
        <div className="p-6 overflow-y-auto">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// --- Child Components for each step ---

const CameraCaptureStep = ({
  videoRef,
  capturedProducts,
  activeProductIndex,
  onSetActiveProduct,
  onCapture,
  onDeleteImage,
  onAddProduct,
  onDeleteProduct,
  onGenerate,
  isLoading,
}: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <CardHeader className="text-center px-0 pt-0">
      <CardTitle>Step 1: Capture Product Batches</CardTitle>
      <CardDescription>
        Take pictures for each product. Click 'Add Another Product' for the next item in the invoice.
      </CardDescription>
    </CardHeader>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Camera View */}
      <div className="lg:col-span-2 relative bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <Button onClick={onCapture} size="lg" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Camera className="w-5 h-5 mr-2" />
          Take Image for Product #{activeProductIndex + 1}
        </Button>
      </div>

      {/* Product Batches List */}
      <div className="flex flex-col">
        <h3 className="font-semibold mb-2 text-lg">Product Queue</h3>
        <div className="space-y-3 overflow-y-auto pr-2 flex-grow max-h-[40vh]">
          {capturedProducts.map((prod: CapturedProduct, i: number) => (
            <Card
              key={prod.id}
              onClick={() => onSetActiveProduct(i)}
              className={cn(
                "cursor-pointer transition-all",
                activeProductIndex === i && "border-primary ring-2 ring-primary"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between p-3">
                <CardTitle className="text-base">Product #{i + 1}</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteProduct(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {prod.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {prod.images.map((src: string, imgIndex: number) => (
                      <div key={imgIndex} className="relative group">
                        <img src={src} alt={`captured ${imgIndex}`} className="rounded-md w-full aspect-square object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); onDeleteImage(i, imgIndex); }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images captured yet.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 space-y-2 shrink-0">
          <Button variant="outline" className="w-full" onClick={onAddProduct}>
            <PlusSquare className="w-4 h-4 mr-2" /> Add Another Product
          </Button>
          <Button
            onClick={onGenerate}
            disabled={capturedProducts.some((p) => p.images.length === 0) || isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ChevronRight className="w-5 h-5 mr-2" />}
            Generate Invoice from {capturedProducts.length} Product(s)
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
)

const ReviewInvoiceStep = ({ invoices, onProceed, onBack }: { invoices: GeneratedInvoice[]; onProceed: () => void; onBack: () => void }) => (
  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
    <CardHeader className="text-center px-0 pt-0">
      <CardTitle>Step 2: Review Extracted Details</CardTitle>
      <CardDescription>Verify the details for all products. Expand each section to edit.</CardDescription>
    </CardHeader>
    <Accordion type="multiple" defaultValue={invoices.map(inv => `item-${inv.id}`)} className="w-full">
      {invoices.map(invoice => (
        <AccordionItem value={`item-${invoice.id}`} key={invoice.id}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <Package className="w-5 h-5" />
              <span className="font-semibold text-lg">{invoice.medicineName}</span>
              <span className="text-sm text-muted-foreground">(Batch: {invoice.batchNumber})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Medicine Name</Label><Input defaultValue={invoice.medicineName} /></div>
              <div><Label>Molecule</Label><Input defaultValue={invoice.molecule} /></div>
              <div><Label>Batch Number</Label><Input defaultValue={invoice.batchNumber} /></div>
              <div><Label>Expiry Date</Label><Input type="date" defaultValue={invoice.expiryDate} /></div>
              <div><Label>Purchase Price</Label><Input type="number" defaultValue={invoice.price} /></div>
              <div><Label>MRP</Label><Input type="number" defaultValue={invoice.mrp} /></div>
              <div className="md:col-span-2"><Label>Quantity</Label><Input type="number" defaultValue={invoice.quantity} /></div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      <Button onClick={onProceed} size="lg">Proceed to Verify <ChevronRight className="w-4 h-4 ml-2" /></Button>
    </div>
  </motion.div>
)

const ScanPhysicalInvoiceStep = ({ videoRef, onScan, onBack, isLoading }: any) => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      {/* This component's UI remains the same as it scans one physical invoice */}
      <CardHeader className="text-center px-0 pt-0"><CardTitle>Step 3: Scan Physical Invoice</CardTitle><CardDescription>Use the camera to scan the single supplier invoice that contains all listed products.</CardDescription></CardHeader>
      <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center mx-auto max-w-2xl"><video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" /><div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg m-8" /><div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded">Align invoice within the frame</div></div>
      <div className="flex justify-between mt-6"><Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button><Button onClick={onScan} size="lg" disabled={isLoading}>{isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileScan className="w-5 h-5 mr-2" />}Scan & Compare</Button></div>
    </motion.div>
)

const CompareStep = ({ generated, scanned, onConfirm, onBack, isLoading }: any) => (
  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
    <CardHeader className="text-center px-0 pt-0"><CardTitle>Step 4: Verify Mismatches</CardTitle><CardDescription>Review differences for each product between the captured data and the physical invoice.</CardDescription></CardHeader>
    <div className="space-y-4">
      {generated.map((genItem: GeneratedInvoice, index: number) => {
        const scanItem = scanned.find((s: GeneratedInvoice) => s.id === genItem.id) || {};
        return (
          <Card key={genItem.id}>
            <CardHeader><CardTitle className="text-lg">{genItem.medicineName}</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="grid grid-cols-3 font-semibold p-3 bg-muted text-sm"><div className="pl-2">Field</div><div className="text-center">From Product Images</div><div className="text-center">From Physical Invoice</div></div>
                {Object.keys(genItem).map(key => {
                  if (key === 'id') return null;
                  const isMatch = genItem[key] === scanItem[key];
                  return (
                    <div key={key} className={cn("grid grid-cols-3 p-2 border-t items-center", !isMatch && "bg-red-500/10")}>
                      <div className="font-medium text-sm pl-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                      <div className="text-center text-sm">{String(genItem[key])}</div>
                      <div className="text-center text-sm flex items-center justify-center gap-2">
                        <span>{String(scanItem[key])}</span>
                        {isMatch ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
    <div className="flex justify-between mt-6"><Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Scan</Button><Button onClick={onConfirm} size="lg" disabled={isLoading}>{isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}Confirm & Add All to Stock</Button></div>
  </motion.div>
);

const SuccessStep = ({ onClose, count }: { onClose: () => void; count: number }) => (
  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
    <div className="text-center p-8">
      <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Stock Added Successfully!</h2>
      <p className="text-muted-foreground mb-6">{count} new product batches have been added to your inventory.</p>
      <Button onClick={onClose} size="lg">Done</Button>
    </div>
  </motion.div>
);