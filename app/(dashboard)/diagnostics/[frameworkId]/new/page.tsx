"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Download,
  ShieldCheck, ShieldAlert, BookOpen, Star, Globe, UtensilsCrossed, Scale,
} from "lucide-react"
import type React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getFrameworkById, extractBaselineScores,
  computeFrameworkScore, toRadarData,
} from "@/lib/diagnostics"
import { accentHex } from "@/lib/diagnostics/types"
import { ClauseScoreInput } from "@/components/diagnostics/clause-score-input"
import { DiagnosticRadar } from "@/components/diagnostics/radar-chart"
import { MaturityBadge } from "@/components/diagnostics/maturity-badge"
import { useToast } from "@/components/ui/use-toast"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck, ShieldAlert, BookOpen, Star, Globe, UtensilsCrossed, Scale,
}

const LEGEND_5 = ["0=Inexistant", "1=Initial", "2=En place", "3=Maîtrisé", "4=Performant", "5=Excellence"]
const LEGEND_4 = ["0=Absent", "1=Faible", "2=Partiel", "3=Bon", "4=Excellent"]

export default function DiagnosticWizardPage() {
  const params = useParams<{ frameworkId: string }>()
  const frameworkId = params?.frameworkId ?? ""
  const router = useRouter()
  const { toast } = useToast()

  const config = getFrameworkById(frameworkId)
  const color = config ? (accentHex[config.accentColor] ?? "#3b82f6") : "#3b82f6"
  const Icon = config ? (ICON_MAP[config.iconName] ?? ShieldCheck) : ShieldCheck

  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!config || initialized) return
    const baseline = extractBaselineScores(config)
    try {
      const saved = localStorage.getItem(`diag_scores_${config.id}`)
      const parsed = saved ? (JSON.parse(saved) as Record<string, number>) : {}
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable client-side after mount
      setScores({ ...baseline, ...parsed })
    } catch {
      setScores(baseline)
    }
    setInitialized(true)
  }, [config, initialized])

  useEffect(() => {
    if (!initialized || Object.keys(scores).length === 0) return
    localStorage.setItem(`diag_scores_${frameworkId}`, JSON.stringify(scores))
  }, [scores, frameworkId, initialized])

  if (!config) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Référentiel introuvable : {frameworkId}</p>
      </div>
    )
  }

  const dimensions = config.dimensions
  const isSummary = step === dimensions.length
  const currentDim = dimensions[step]
  const progressPct = Math.round((step / dimensions.length) * 100)

  const handleScoreChange = (id: string, score: number) => {
    setScores((prev) => ({ ...prev, [id]: score }))
  }

  const computedScore = computeFrameworkScore(config, scores)
  const radarData = toRadarData(computedScore, config)

  const handleFinish = () => {
    toast({ title: "Diagnostic enregistré", description: "Vos scores ont été sauvegardés avec succès." })
    router.push(`/diagnostics/${config.id}`)
  }

  const handleDownload = () => {
    toast({ title: "Export PDF", description: "La génération du rapport PDF est en cours de développement." })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/diagnostics/${config.id}`} className="shrink-0 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title={isSummary ? "Résumé du diagnostic" : `Diagnostic — ${config.shortName}`}
          description={
            isSummary
              ? `Synthèse des ${dimensions.length} dimensions évaluées`
              : `Étape ${step + 1} / ${dimensions.length} — ${currentDim.label}`
          }
          icon={Icon}
        />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progression</span>
          <span>{isSummary ? "Terminé ✓" : `${progressPct}%`}</span>
        </div>
        <Progress value={isSummary ? 100 : progressPct} className="h-2" />
        <div className="flex gap-1">
          {dimensions.map((_, i) => (
            <button
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{
                backgroundColor: color,
                opacity: i < step ? 1 : i === step ? 0.6 : 0.2,
              }}
              onClick={() => setStep(i)}
              title={dimensions[i].label}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {!isSummary ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: currentDim.color }}
              />
              <div>
                <CardTitle className="text-base">{currentDim.label}</CardTitle>
                <CardDescription>{currentDim.items.length} critères à évaluer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
              {(config.maxScore === 5 ? LEGEND_5 : LEGEND_4).map((l) => (
                <span key={l} className="rounded bg-white px-1.5 py-0.5 shadow-sm border border-gray-200">
                  {l}
                </span>
              ))}
            </div>
            <div className="divide-y divide-gray-100">
              {currentDim.items.map((item) => (
                <ClauseScoreInput
                  key={item.id}
                  item={item}
                  maxScore={config.maxScore}
                  value={scores[item.id] ?? item.score}
                  onChange={handleScoreChange}
                  accentColor={color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Radar de maturité</CardTitle>
              <CardDescription>
                Score global{" "}
                <span className="font-bold" style={{ color }}>
                  {computedScore.globalScore.toFixed(2)} / {config.maxScore}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-3">
                <MaturityBadge score={computedScore.globalScore} maxScore={config.maxScore} />
              </div>
              <DiagnosticRadar
                data={radarData}
                maxScore={config.maxScore}
                color={color}
                height={280}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Scores par dimension</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {computedScore.dimensions.map((dim) => (
                <div key={dim.dimensionId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate pr-2">{dim.label}</span>
                    <span className="shrink-0 font-medium text-gray-900">
                      {dim.score.toFixed(2)} / {dim.maxScore}
                    </span>
                  </div>
                  <Progress value={dim.pct} className="h-1.5" />
                </div>
              ))}
              <div className="mt-3 rounded-lg border border-dashed p-3 text-center text-sm text-gray-500">
                {computedScore.gapItems.length} critères identifiés avec un score &lt; 2
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        {!isSummary ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="text-white border-0"
            style={{ backgroundColor: color }}
          >
            {step === dimensions.length - 1 ? (
              <>
                Voir le résumé
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger le rapport
            </Button>
            <Button
              onClick={handleFinish}
              className="text-white border-0"
              style={{ backgroundColor: color }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Enregistrer et fermer
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
