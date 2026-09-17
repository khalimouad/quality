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

const documentSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  status: z.string().min(1, "Le statut est requis"),
  version: z.string().min(1, "La version est requise"),
  owner: z.string().min(1, "Le responsable est requis"),
  description: z.string().optional(),
  reviewDate: z.string().min(1, "La date de révision est requise"),
})

type DocumentFormData = z.infer<typeof documentSchema>

export default function NewDocumentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      version: "v1.0",
      status: "draft",
    },
  })

  const onSubmit = async (data: DocumentFormData) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Document créé",
      description: `Le document "${data.title}" a été créé avec succès.`,
    })
    router.push("/documents")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/documents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouveau document</h2>
          <p className="text-sm text-gray-500">Créez un nouveau document qualité</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence *</Label>
                  <Input
                    id="reference"
                    placeholder="PRO-QUA-001"
                    {...register("reference")}
                    className={errors.reference ? "border-red-500" : ""}
                  />
                  {errors.reference && (
                    <p className="text-sm text-red-500">{errors.reference.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    placeholder="v1.0"
                    {...register("version")}
                    className={errors.version ? "border-red-500" : ""}
                  />
                  {errors.version && (
                    <p className="text-sm text-red-500">{errors.version.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre du document *</Label>
                <Input
                  id="title"
                  placeholder="Intitulé complet du document"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="Procédure">Procédure</SelectItem>
                      <SelectItem value="Instruction">Instruction de travail</SelectItem>
                      <SelectItem value="Formulaire">Formulaire</SelectItem>
                      <SelectItem value="Politique">Politique</SelectItem>
                      <SelectItem value="Plan">Plan qualité</SelectItem>
                      <SelectItem value="Enregistrement">Enregistrement</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Statut *</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => {
                      setStatus(v)
                      setValue("status", v)
                    }}
                    defaultValue="draft"
                  >
                    <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="review">En révision</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="obsolete">Obsolète</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Responsable *</Label>
                  <Input
                    id="owner"
                    placeholder="Nom du responsable"
                    {...register("owner")}
                    className={errors.owner ? "border-red-500" : ""}
                  />
                  {errors.owner && (
                    <p className="text-sm text-red-500">{errors.owner.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewDate">Date de révision *</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    {...register("reviewDate")}
                    className={errors.reviewDate ? "border-red-500" : ""}
                  />
                  {errors.reviewDate && (
                    <p className="text-sm text-red-500">{errors.reviewDate.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Objet</Label>
                <Textarea
                  id="description"
                  placeholder="Description du document, son objet et son champ d'application..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/documents">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
