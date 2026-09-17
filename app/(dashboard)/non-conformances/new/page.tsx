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

const ncSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  severity: z.string().min(1, "La sévérité est requise"),
  source: z.string().min(1, "La source est requise"),
  detectedBy: z.string().min(1, "Le détecteur est requis"),
  detectedAt: z.string().min(1, "La date de détection est requise"),
  dueDate: z.string().min(1, "L'échéance est requise"),
  location: z.string().optional(),
  immediateAction: z.string().optional(),
})

type NCFormData = z.infer<typeof ncSchema>

export default function NewNCPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [severity, setSeverity] = useState("")
  const [source, setSource] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NCFormData>({
    resolver: zodResolver(ncSchema),
  })

  const onSubmit = async (data: NCFormData) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Non-conformité créée",
      description: "La non-conformité a été enregistrée avec succès.",
    })
    router.push("/non-conformances")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/non-conformances">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle Non-Conformité</h2>
          <p className="text-sm text-gray-500">Déclarez une nouvelle non-conformité</p>
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
                <Label htmlFor="title">Titre de la NC *</Label>
                <Input
                  id="title"
                  placeholder="Description courte de la non-conformité"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="observation">Observation</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.severity && (
                    <p className="text-sm text-red-500">{errors.severity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Source *</Label>
                  <Select value={source} onValueChange={(v) => { setSource(v); setValue("source", v) }}>
                    <SelectTrigger className={errors.source ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Réception">Réception</SelectItem>
                      <SelectItem value="Audit interne">Audit interne</SelectItem>
                      <SelectItem value="Audit externe">Audit externe</SelectItem>
                      <SelectItem value="Client">Réclamation client</SelectItem>
                      <SelectItem value="Contrôle qualité">Contrôle qualité</SelectItem>
                      <SelectItem value="HSE">HSE</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.source && (
                    <p className="text-sm text-red-500">{errors.source.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lieu / Zone</Label>
                <Input
                  id="location"
                  placeholder="Atelier, poste de travail, zone..."
                  {...register("location")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez précisément la non-conformité observée..."
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="immediateAction">Action immédiate prise</Label>
                <Textarea
                  id="immediateAction"
                  placeholder="Décrivez les actions immédiates prises pour contenir la NC..."
                  rows={3}
                  {...register("immediateAction")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Détection &amp; Échéance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detectedBy">Détecté par *</Label>
                  <Input
                    id="detectedBy"
                    placeholder="Nom de la personne"
                    {...register("detectedBy")}
                    className={errors.detectedBy ? "border-red-500" : ""}
                  />
                  {errors.detectedBy && (
                    <p className="text-sm text-red-500">{errors.detectedBy.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detectedAt">Date de détection *</Label>
                  <Input
                    id="detectedAt"
                    type="date"
                    {...register("detectedAt")}
                    className={errors.detectedAt ? "border-red-500" : ""}
                  />
                  {errors.detectedAt && (
                    <p className="text-sm text-red-500">{errors.detectedAt.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Échéance de traitement *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                  className={errors.dueDate ? "border-red-500" : ""}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/non-conformances">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Créer la NC</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
