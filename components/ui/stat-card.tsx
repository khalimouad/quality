import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  /** Tailwind text color for icon, e.g. "text-blue-600" */
  iconColor?: string
  /** Tailwind bg color for icon container, e.g. "bg-blue-50" */
  iconBg?: string
  change?: string
  trend?: "up" | "down" | "neutral"
  /** When true, an upward trend is good (green); default false (up = red, for NC/risks) */
  trendUpIsGood?: boolean
  hint?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  change,
  trend = "neutral",
  trendUpIsGood = false,
  hint,
}: StatCardProps) {
  const goodColor = "text-green-600"
  const badColor = "text-red-600"
  const trendColor =
    trend === "neutral"
      ? "text-gray-500"
      : trend === "up"
      ? trendUpIsGood
        ? goodColor
        : badColor
      : trendUpIsGood
      ? badColor
      : goodColor

  return (
    <Card className="border-gray-200 transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {value}
            </p>
            {(change || hint) && (
              <div className="mt-2 flex items-center gap-1">
                {change && (
                  <>
                    {trend === "up" ? (
                      <TrendingUp className={cn("h-4 w-4", trendColor)} />
                    ) : trend === "down" ? (
                      <TrendingDown className={cn("h-4 w-4", trendColor)} />
                    ) : (
                      <Minus className={cn("h-4 w-4", trendColor)} />
                    )}
                    <span className={cn("text-xs font-semibold", trendColor)}>
                      {change}
                    </span>
                  </>
                )}
                {hint && <span className="text-xs text-gray-400">{hint}</span>}
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              iconBg
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
