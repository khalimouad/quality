"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const complaintSchema = z.object({
  subject: z.string().min(5, "L'objet doit contenir au moins 5 caractères"),
  type: z.string().min(1, "Le type est requis"),
  claimantName: z.string().min(2, "Le nom du plaignant est requis"),
  contact: z.string().min(2, "Le contact est requis"),
  product: z.string().optional(),
  severity: z.string().min(1, "La sévérité est requise"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  receivedDate: z.string().min(1, "La date de réception est requise"),
})

type ComplaintFormData = z.infer<typeof complaintSchema>

export default function NewComplaintPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState("")
  const [severity, setSeverity] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
  })

  const onSubmit = async (_data: ComplaintFormData) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Réclamation enregistrée",
      description: "La réclamation a été enregistrée avec succès.",
    })
    router.push("/complaints")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/complaints">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle réclamation</h2>
          <p className="text-sm text-gray-500">Enregistrez une réclamation client ou fournisseur</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Objet de la réclamation *</Label>
                <Input
                  id="subject"
                  placeholder="Description courte de la réclamation"
                  {...register("subject")}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setValue("type", v) }}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="supplier">Fournisseur</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Sévérité *</Label>
                  <Select value={severity} onValueChange={(v) => { setSeverity(v); setValue("severity", v) }}>
                    <SelectTrigger className={errors.severity ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critique</SelectItem>
                      <SelectItem value="major">Majeure</SelectItem>
                      <SelectItem value="minor">Mineure</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.severity && (
                    <p className="text-sm text-red-500">{errors.severity.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plaignant &amp; Produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="claimantName">Nom du plaignant *</Label>
                  <Input
                    id="claimantName"
                    placeholder="Client ou fournisseur"
                    {...register("claimantName")}
                    className={errors.claimantName ? "border-red-500" : ""}
                  />
                  {errors.claimantName && (
                    <p className="text-sm text-red-500">{errors.claimantName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact *</Label>
                  <Input
                    id="contact"
                    placeholder="Email ou téléphone"
                    {...register("contact")}
                    className={errors.contact ? "border-red-500" : ""}
                  />
                  {errors.contact && (
                    <p className="text-sm text-red-500">{errors.contact.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produit / Service concerné</Label>
                <Input
                  id="product"
                  placeholder="Référence du produit ou de la prestation"
                  {...register("product")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez précisément la réclamation..."
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivedDate">Date de réception *</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  {...register("receivedDate")}
                  className={errors.receivedDate ? "border-red-500" : ""}
                />
                {errors.receivedDate && (
                  <p className="text-sm text-red-500">{errors.receivedDate.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/complaints">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Créer la réclamation</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
