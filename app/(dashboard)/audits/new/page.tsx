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

const auditSchema = z.object({
  title: z.string().min(5, "Titre requis"),
  type: z.string().min(1, "Type requis"),
  scope: z.string().min(5, "Champ d'application requis"),
  auditor: z.string().min(1, "Auditeur requis"),
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().min(1, "Date de fin requise"),
  objectives: z.string().optional(),
  referential: z.string().optional(),
})

type AuditFormData = z.infer<typeof auditSchema>

export default function NewAuditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
  })

  const onSubmit = async (data: AuditFormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast({
      title: "Audit planifié",
      description: "L'audit a été planifié avec succès.",
    })
    router.push("/audits")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/audits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planifier un audit</h2>
          <p className="text-sm text-gray-500">Programmez un nouvel audit</p>
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
                  <Label>Type d&apos;audit *</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setValue("type", v) }}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Audit interne</SelectItem>
                      <SelectItem value="external">Audit externe</SelectItem>
                      <SelectItem value="supplier">Audit fournisseur</SelectItem>
                      <SelectItem value="certification">Audit de certification</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referential">Référentiel</Label>
                  <Input id="referential" placeholder="ISO 9001, ISO 14001..." {...register("referential")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre de l&apos;audit *</Label>
                <Input
                  id="title"
                  placeholder="Intitulé de l'audit"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Champ d&apos;application *</Label>
                <Input
                  id="scope"
                  placeholder="Processus, départements, sites concernés..."
                  {...register("scope")}
                  className={errors.scope ? "border-red-500" : ""}
                />
                {errors.scope && <p className="text-sm text-red-500">{errors.scope.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Planification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auditor">Auditeur / Organisme *</Label>
                <Input
                  id="auditor"
                  placeholder="Nom de l'auditeur ou de l'organisme"
                  {...register("auditor")}
                  className={errors.auditor ? "border-red-500" : ""}
                />
                {errors.auditor && <p className="text-sm text-red-500">{errors.auditor.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objectifs de l&apos;audit</Label>
                <Textarea
                  id="objectives"
                  placeholder="Décrivez les objectifs de cet audit..."
                  rows={3}
                  {...register("objectives")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/audits">
              <Button variant="outline" type="button">Annuler</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Planification...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Planifier l&apos;audit</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
