import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import {
  ArrowLeft,
  Check,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { type NoteItem, type NotePublic, StudentService } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"
import AutoTextarea from "./AutoTextarea"
import { FLAG_SCHEMES } from "./flag-schemes"
import NoteSection from "./NoteSection"

const newSection = (): NoteItem => ({ title: "", content: "", flag: 0 })

// Reorder a copy of `arr`, moving the item at `from` to `to`.
function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export default function NoteEditor({ note }: { note: NotePublic }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const [title, setTitle] = useState(note.title)
  const [sections, setSections] = useState<NoteItem[]>(note.note_data)
  // Expansion tracked positionally, parallel to `sections`, so it survives
  // reordering, insertion, and deletion.
  const [expanded, setExpanded] = useState<boolean[]>(
    note.note_data.map(() => true),
  )
  const [filterFlag, setFilterFlag] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)

  // Native drag-and-drop reordering state.
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const saveMutation = useMutation({
    mutationFn: () =>
      StudentService.updateNote({
        noteId: note.id,
        requestBody: { title, note_data: sections },
      }),
    onSuccess: () => {
      setDirty(false)
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      queryClient.invalidateQueries({ queryKey: ["note", note.id] })
    },
    onError: handleError.bind(showErrorToast),
  })

  const deleteMutation = useMutation({
    mutationFn: () => StudentService.deleteNote({ noteId: note.id }),
    onSuccess: () => {
      showSuccessToast("Note deleted")
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      navigate({ to: "/notes" })
    },
    onError: handleError.bind(showErrorToast),
  })

  // Debounced autosave: fire ~900ms after the last edit. Skips the initial
  // mount so opening a note doesn't immediately re-save it.
  const isFirst = useRef(true)
  // biome-ignore lint/correctness/useExhaustiveDependencies: debounce keyed on title/sections only
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setDirty(true)
    const t = setTimeout(() => saveMutation.mutate(), 900)
    return () => clearTimeout(t)
  }, [title, sections])

  // Cmd/Ctrl+S forces an immediate save.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        if (dirty) saveMutation.mutate()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dirty, saveMutation])

  // Warn before leaving with an in-flight or pending save.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty || saveMutation.isPending) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty, saveMutation.isPending])

  const addSectionAt = (at: number) => {
    setSections((prev) => {
      const next = [...prev]
      next.splice(at, 0, newSection())
      return next
    })
    setExpanded((prev) => {
      const next = [...prev]
      next.splice(at, 0, true)
      return next
    })
  }

  const updateSection = (
    index: number,
    field: keyof NoteItem,
    value: string | number | null,
  ) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    )
  }

  const deleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
    setExpanded((prev) => prev.filter((_, i) => i !== index))
  }

  const toggle = (index: number) => {
    setExpanded((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  const commitDrag = () => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      setSections((prev) => move(prev, dragIndex, overIndex))
      setExpanded((prev) => move(prev, dragIndex, overIndex))
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  const locked = filterFlag !== null

  // Render original indices so edits map back to the real section.
  const visible = useMemo(
    () =>
      sections
        .map((section, index) => ({ section, index }))
        .filter(
          ({ section }) => filterFlag === null || section.flag === filterFlag,
        ),
    [sections, filterFlag],
  )

  const flaggedCount = sections.filter((s) => s.flag > 0).length

  const status = saveMutation.isPending ? "saving" : dirty ? "editing" : "saved"

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
        >
          <Link to="/notes" aria-label="Back to notes">
            <ArrowLeft />
            Notes
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {status === "saving" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : status === "editing" ? (
              <>
                <span className="size-1.5 rounded-full bg-amber-500" />
                Unsaved
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                Saved
              </>
            )}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Note options">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
              >
                <Trash2 />
                Delete note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title */}
      <AutoTextarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="text-4xl font-bold leading-tight tracking-tight"
      />

      {/* Flag filter — only when something is flagged */}
      {flaggedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterFlag(null)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
              filterFlag === null
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            All
          </button>
          {FLAG_SCHEMES.map((f) => {
            const count = sections.filter((s) => s.flag === f.value).length
            if (count === 0) return null
            return (
              <button
                key={f.value}
                type="button"
                onClick={() =>
                  setFilterFlag((prev) => (prev === f.value ? null : f.value))
                }
                aria-label={`Filter ${f.label} (${count})`}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                  filterFlag === f.value
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <span className={cn("size-2.5 rounded-full", f.dot)} />
                {count}
              </button>
            )
          })}
        </div>
      )}

      {/* Sections */}
      <div className="flex flex-col">
        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {sections.length === 0
              ? "This note is empty. Add a section to start writing."
              : "No sections match this flag."}
          </p>
        ) : (
          visible.map(({ section, index }) => (
            <NoteSection
              key={index}
              section={section}
              isExpanded={expanded[index] ?? true}
              isDragOver={overIndex === index && dragIndex !== index}
              dragDisabled={locked}
              onToggle={() => toggle(index)}
              onChange={(field, value) => updateSection(index, field, value)}
              onDelete={() => deleteSection(index)}
              onAddBelow={() => addSectionAt(index + 1)}
              onDragStart={() => setDragIndex(index)}
              onDragEnter={() => dragIndex !== null && setOverIndex(index)}
              onDragEnd={commitDrag}
            />
          ))
        )}

        {!locked && (
          <button
            type="button"
            onClick={() => addSectionAt(sections.length)}
            className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <Plus className="size-4" />
            Add section
          </button>
        )}
      </div>
    </div>
  )
}
