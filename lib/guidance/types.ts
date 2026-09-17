export type Pdca = "PLAN" | "DO" | "CHECK" | "ACT" | "INTRO"

export interface GuideStandard {
  id: string
  name: string
  shortName: string
  domain: string
  color: string
  iconName: string
}

export interface GuideModuleLink {
  label: string
  href: string
}

export interface GuideCell {
  standardId: string
  requirements: string[]
  links?: GuideModuleLink[]
}

export interface GuideChapter {
  id: string
  number: number
  pdca: Pdca
  title: string
  subtitle?: string
  purpose: string
  cells: GuideCell[]
}
