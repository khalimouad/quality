"use client"

import * as React from "react"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DataTableColumn<T> {
  /** Unique key for the column */
  key: string
  /** Header label */
  header: string
  /** Custom cell renderer. Falls back to row[key] if omitted. */
  cell?: (row: T) => React.ReactNode
  /** Value used for sorting / default rendering */
  sortValue?: (row: T) => string | number | Date
  /** Whether the column is sortable (default true if sortValue provided) */
  sortable?: boolean
  align?: "left" | "center" | "right"
  className?: string
  headerClassName?: string
  /** Hide on mobile */
  hideOnMobile?: boolean
}

export interface DataTableFilter {
  key: string
  label: string
  options: { value: string; label: string }[]
  /** Returns the comparable value for a row */
  value: (row: any) => string // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface BulkAction<T> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (selected: T[]) => void
  variant?: "default" | "destructive" | "outline"
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  getRowId: (row: T) => string
  searchPlaceholder?: string
  /** Fields to match against the global search box */
  searchAccessor?: (row: T) => string
  filters?: DataTableFilter[]
  pageSize?: number
  pageSizeOptions?: number[]
  onRowClick?: (row: T) => void
  rowActions?: (row: T) => React.ReactNode
  bulkActions?: BulkAction<T>[]
  emptyMessage?: string
  /** Optional extra toolbar content rendered on the right */
  toolbarActions?: React.ReactNode
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchPlaceholder = "Rechercher...",
  searchAccessor,
  filters = [],
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onRowClick,
  rowActions,
  bulkActions,
  emptyMessage = "Aucun résultat.",
  toolbarActions,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({})
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  // Filtering
  const filtered = React.useMemo(() => {
    let rows = data
    if (search.trim() && searchAccessor) {
      const q = search.toLowerCase()
      rows = rows.filter((r) => searchAccessor(r).toLowerCase().includes(q))
    }
    for (const f of filters) {
      const val = filterValues[f.key]
      if (val && val !== "all") {
        rows = rows.filter((r) => f.value(r) === val)
      }
    }
    return rows
  }, [data, search, searchAccessor, filters, filterValues])

  // Sorting
  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return filtered
    const acc = col.sortValue
    return [...filtered].sort((a, b) => {
      const av = acc(a)
      const bv = acc(b)
      let cmp = 0
      if (av instanceof Date && bv instanceof Date) cmp = av.getTime() - bv.getTime()
      else if (typeof av === "number" && typeof bv === "number") cmp = av - bv
      else cmp = String(av).localeCompare(String(bv), "fr")
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, columns])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize)

  React.useEffect(() => {
    setPage(0)
  }, [search, filterValues, pageSize])

  const toggleSort = (key: string) => {
    const col = columns.find((c) => c.key === key)
    if (!col?.sortValue || col.sortable === false) return
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  // Selection
  const pageIds = paged.map(getRowId)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const somePageSelected = pageIds.some((id) => selected.has(id))

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })
  }
  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectedRows = data.filter((r) => selected.has(getRowId(r)))
  const activeFilterCount =
    Object.values(filterValues).filter((v) => v && v !== "all").length + (search ? 1 : 0)

  const clearFilters = () => {
    setSearch("")
    setFilterValues({})
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters.map((f) => (
            <Select
              key={f.key}
              value={filterValues[f.key] ?? "all"}
              onValueChange={(v) =>
                setFilterValues((prev) => ({ ...prev, [f.key]: v }))
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{f.label} : tous</SelectItem>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>
        {toolbarActions && <div className="flex items-center gap-2">{toolbarActions}</div>}
      </div>

      {/* Bulk action bar */}
      {bulkActions && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
          <span className="text-sm font-medium text-blue-900">
            {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant === "destructive" ? "destructive" : "outline"}
                onClick={() => action.onClick(selectedRows)}
                className="h-8"
              >
                {action.icon && <action.icon className="mr-1.5 h-3.5 w-3.5" />}
                {action.label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 text-blue-700"
            onClick={() => setSelected(new Set())}
          >
            Désélectionner
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="border-b">
              {bulkActions && (
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={!allPageSelected && somePageSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key
                const canSort = !!col.sortValue && col.sortable !== false
                return (
                  <th
                    key={col.key}
                    onClick={() => canSort && toggleSort(col.key)}
                    className={cn(
                      "px-4 py-3 text-left align-middle font-semibold text-gray-600",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      canSort && "cursor-pointer select-none hover:text-gray-900",
                      col.hideOnMobile && "hidden md:table-cell",
                      col.headerClassName
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        col.align === "center" && "justify-center",
                        col.align === "right" && "justify-end"
                      )}
                    >
                      {col.header}
                      {canSort &&
                        (isSorted ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" />
                        ))}
                    </span>
                  </th>
                )
              })}
              {rowActions && <th className="w-16 px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (bulkActions ? 1 : 0) + (rowActions ? 1 : 0)
                  }
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Inbox className="h-10 w-10" />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const id = getRowId(row)
                const isSelected = selected.has(id)
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b transition-colors last:border-0",
                      onRowClick && "cursor-pointer",
                      isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
                    )}
                  >
                    {bulkActions && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(id)}
                          aria-label="Sélectionner la ligne"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 align-middle",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          col.hideOnMobile && "hidden md:table-cell",
                          col.className
                        )}
                      >
                        {col.cell
                          ? col.cell(row)
                          : ((row as Record<string, React.ReactNode>)[col.key] ?? "—")}
                      </td>
                    ))}
                    {rowActions && (
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {rowActions(row)}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-gray-500">
          {sorted.length === 0
            ? "0 résultat"
            : `${currentPage * pageSize + 1}–${Math.min(
                (currentPage + 1) * pageSize,
                sorted.length
              )} sur ${sorted.length}`}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Lignes</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 0}
              onClick={() => setPage(0)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm text-gray-600">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
