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

const supplierSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  code: z.string().min(2, "Le code est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  contactName: z.string().min(2, "Le nom du contact est requis"),
  contactEmail: z.string().email("Adresse e-mail invalide"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  certifications: z.string().optional(),
  notes: z.string().optional(),
})

type SupplierFormData = z.infer<typeof supplierSchema>

export default function NewSupplierPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  })

  const onSubmit = async (_data: SupplierFormData) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Fournisseur créé",
      description: "Le fournisseur a été enregistré avec succès.",
    })
    router.push("/suppliers")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/suppliers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouveau fournisseur</h2>
          <p className="text-sm text-gray-500">Référencez un nouveau fournisseur</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Raison sociale *</Label>
                  <Input
                    id="name"
                    placeholder="Nom de l'entreprise"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code fournisseur *</Label>
                  <Input
                    id="code"
                    placeholder="FRN-015"
                    {...register("code")}
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v)
                    setValue("category", v)
                  }}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matières premières">Matières premières</SelectItem>
                    <SelectItem value="Sous-traitance">Sous-traitance</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Équipement">Équipement</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  placeholder="ISO 9001, ISO 14001, ..."
                  {...register("certifications")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nom du contact *</Label>
                  <Input
                    id="contactName"
                    placeholder="Nom du référent"
                    {...register("contactName")}
                    className={errors.contactName ? "border-red-500" : ""}
                  />
                  {errors.contactName && (
                    <p className="text-sm text-red-500">{errors.contactName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+33 1 23 45 67 89"
                    {...register("contactPhone")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-mail *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@fournisseur.fr"
                  {...register("contactEmail")}
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  placeholder="Adresse postale complète..."
                  rows={2}
                  {...register("address")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes initiales</Label>
                <Textarea
                  id="notes"
                  placeholder="Observations, conditions commerciales, historique..."
                  rows={4}
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/suppliers">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Créer le fournisseur</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
