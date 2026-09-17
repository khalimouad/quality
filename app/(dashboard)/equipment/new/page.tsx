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

const equipmentSchema = z.object({
  name: z.string().min(3, "La désignation doit contenir au moins 3 caractères"),
  code: z.string().min(2, "Le code est requis"),
  type: z.string().min(1, "Le type est requis"),
  manufacturer: z.string().optional(),
  serialNumber: z.string().optional(),
  location: z.string().min(1, "La localisation est requise"),
  calibrationFrequency: z.string().min(1, "La fréquence d'étalonnage est requise"),
  lastCalibration: z.string().min(1, "La date du dernier étalonnage est requise"),
  responsible: z.string().min(1, "Le responsable est requis"),
  notes: z.string().optional(),
})

type EquipmentFormData = z.infer<typeof equipmentSchema>

export default function NewEquipmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
  })

  const onSubmit = async (data: EquipmentFormData) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Équipement créé",
      description: "L'équipement a été enregistré avec succès.",
    })
    router.push("/equipment")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/equipment">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvel équipement</h2>
          <p className="text-sm text-gray-500">Ajoutez un équipement au parc et à la métrologie</p>
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
                <Label htmlFor="name">Désignation *</Label>
                <Input
                  id="name"
                  placeholder="Ex : Pied à coulisse numérique"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    placeholder="Ex : EQ-015"
                    {...register("code")}
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setValue("type", v) }}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mesure">Mesure</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Sécurité">Sécurité</SelectItem>
                      <SelectItem value="Laboratoire">Laboratoire</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Fabricant</Label>
                  <Input
                    id="manufacturer"
                    placeholder="Ex : Mitutoyo"
                    {...register("manufacturer")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Numéro de série</Label>
                  <Input
                    id="serialNumber"
                    placeholder="Ex : SN-2024-0098"
                    {...register("serialNumber")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  placeholder="Atelier, laboratoire, zone..."
                  {...register("location")}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Métrologie &amp; suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calibrationFrequency">Fréquence d&apos;étalonnage (mois) *</Label>
                  <Input
                    id="calibrationFrequency"
                    type="number"
                    min="1"
                    placeholder="12"
                    {...register("calibrationFrequency")}
                    className={errors.calibrationFrequency ? "border-red-500" : ""}
                  />
                  {errors.calibrationFrequency && (
                    <p className="text-sm text-red-500">{errors.calibrationFrequency.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastCalibration">Dernier étalonnage *</Label>
                  <Input
                    id="lastCalibration"
                    type="date"
                    {...register("lastCalibration")}
                    className={errors.lastCalibration ? "border-red-500" : ""}
                  />
                  {errors.lastCalibration && (
                    <p className="text-sm text-red-500">{errors.lastCalibration.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">Responsable *</Label>
                <Input
                  id="responsible"
                  placeholder="Nom du responsable"
                  {...register("responsible")}
                  className={errors.responsible ? "border-red-500" : ""}
                />
                {errors.responsible && (
                  <p className="text-sm text-red-500">{errors.responsible.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Observations, conditions d'utilisation, accessoires..."
                  rows={4}
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/equipment">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Créer l&apos;équipement</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
