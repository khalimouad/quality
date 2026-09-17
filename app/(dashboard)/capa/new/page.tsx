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

const capaSchema = z.object({
  title: z.string().min(5, "Titre requis (min 5 caractères)"),
  type: z.string().min(1, "Le type est requis"),
  description: z.string().min(10, "Description requise (min 10 caractères)"),
  rootCause: z.string().optional(),
  plannedAction: z.string().min(5, "L'action planifiée est requise"),
  assignedTo: z.string().min(1, "Responsable requis"),
  dueDate: z.string().min(1, "Échéance requise"),
  ncRef: z.string().optional(),
})

type CapaFormData = z.infer<typeof capaSchema>

export default function NewCapaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CapaFormData>({
    resolver: zodResolver(capaSchema),
  })

  const onSubmit = async (data: CapaFormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast({
      title: "CAPA créée",
      description: "L'action corrective/préventive a été enregistrée.",
    })
    router.push("/capa")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/capa">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle CAPA</h2>
          <p className="text-sm text-gray-500">Créez une action corrective ou préventive</p>
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
                  <Label>Type d&apos;action *</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setValue("type", v) }}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrective">Action Corrective</SelectItem>
                      <SelectItem value="preventive">Action Préventive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ncRef">NC liée (optionnel)</Label>
                  <Input id="ncRef" placeholder="NC-2024-XXX" {...register("ncRef")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre de l&apos;action *</Label>
                <Input
                  id="title"
                  placeholder="Intitulé de l'action corrective/préventive"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyse & Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description du problème *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le problème identifié..."
                  rows={3}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rootCause">Analyse des causes (5 Pourquoi, Ishikawa...)</Label>
                <Textarea
                  id="rootCause"
                  placeholder="Analysez les causes profondes du problème..."
                  rows={3}
                  {...register("rootCause")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedAction">Action planifiée *</Label>
                <Textarea
                  id="plannedAction"
                  placeholder="Décrivez les actions à mettre en œuvre..."
                  rows={3}
                  {...register("plannedAction")}
                  className={errors.plannedAction ? "border-red-500" : ""}
                />
                {errors.plannedAction && <p className="text-sm text-red-500">{errors.plannedAction.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Responsabilité & Délai</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Responsable *</Label>
                  <Input
                    id="assignedTo"
                    placeholder="Nom du responsable"
                    {...register("assignedTo")}
                    className={errors.assignedTo ? "border-red-500" : ""}
                  />
                  {errors.assignedTo && <p className="text-sm text-red-500">{errors.assignedTo.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Échéance *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register("dueDate")}
                    className={errors.dueDate ? "border-red-500" : ""}
                  />
                  {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/capa">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Créer la CAPA</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
