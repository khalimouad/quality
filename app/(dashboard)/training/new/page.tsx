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

const trainingSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  trainer: z.string().min(1, "Le formateur est requis"),
  date: z.string().min(1, "La date est requise"),
  duration: z.string().min(1, "La durée est requise"),
  maxParticipants: z.string().min(1, "Le nombre de participants est requis"),
  location: z.string().optional(),
  objectives: z.string().optional(),
  description: z.string().optional(),
})

type TrainingFormData = z.infer<typeof trainingSchema>

export default function NewTrainingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
  })

  const onSubmit = async (data: TrainingFormData) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Formation créée",
      description: "La session de formation a été enregistrée avec succès.",
    })
    router.push("/training")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/training">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle formation</h2>
          <p className="text-sm text-gray-500">Planifiez une nouvelle session de formation</p>
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
                <Label htmlFor="title">Intitulé de la formation *</Label>
                <Input
                  id="title"
                  placeholder="Ex : Sensibilisation ISO 9001"
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
                  <Select value={category} onValueChange={(v) => { setCategory(v); setValue("category", v) }}>
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qualité">Qualité</SelectItem>
                      <SelectItem value="Sécurité">Sécurité</SelectItem>
                      <SelectItem value="Environnement">Environnement</SelectItem>
                      <SelectItem value="Métier">Métier</SelectItem>
                      <SelectItem value="Réglementaire">Réglementaire</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer">Formateur *</Label>
                  <Input
                    id="trainer"
                    placeholder="Nom ou organisme"
                    {...register("trainer")}
                    className={errors.trainer ? "border-red-500" : ""}
                  />
                  {errors.trainer && (
                    <p className="text-sm text-red-500">{errors.trainer.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  placeholder="Salle, site, à distance..."
                  {...register("location")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Planification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (heures) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="7"
                    {...register("duration")}
                    className={errors.duration ? "border-red-500" : ""}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">{errors.duration.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Participants max. *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="12"
                    {...register("maxParticipants")}
                    className={errors.maxParticipants ? "border-red-500" : ""}
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-red-500">{errors.maxParticipants.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Objectifs pédagogiques</Label>
                <Textarea
                  id="objectives"
                  placeholder="Compétences visées à l'issue de la formation..."
                  rows={3}
                  {...register("objectives")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Programme, prérequis, modalités..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/training">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Créer la formation</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
