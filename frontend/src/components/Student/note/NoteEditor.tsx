import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, MoreVertical, Plus, Save } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { type NoteItem, type NotePublic, StudentService } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"
import { FLAG_SCHEMES } from "./flag-schemes"
import NoteSection from "./NoteSection"

const newSection = (): NoteItem => ({ title: "", content: "", flag: 0 })

export default function NoteEditor({ note }: { note: NotePublic }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const [title, setTitle] = useState(note.title)
  const [sections, setSections] = useState<NoteItem[]>(note.note_data)
  const [expanded, setExpanded] = useState<number[]>(
    note.note_data.map((_, i) => i),
  )
  const [filterFlag, setFilterFlag] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [hasChanges])

  const saveMutation = useMutation({
    mutationFn: () =>
      StudentService.updateNote({
        noteId: note.id,
        requestBody: { title, note_data: sections },
      }),
    onSuccess: () => {
      showSuccessToast("Note saved")
      setHasChanges(false)
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

  const addSection = () => {
    setSections((prev) => [...prev, newSection()])
    setExpanded((prev) => [...prev, sections.length])
    setHasChanges(true)
  }

  const updateSection = (
    index: number,
    field: keyof NoteItem,
    value: string | number | null,
  ) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    )
    setHasChanges(true)
  }

  const deleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
    setExpanded((prev) => prev.filter((i) => i !== index))
    setHasChanges(true)
  }

  const toggle = (index: number) => {
    setExpanded((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  const updateTitle = (value: string) => {
    setTitle(value)
    setHasChanges(true)
  }

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon">
          <Link to="/notes" aria-label="Back to notes">
            <ArrowLeft />
          </Link>
        </Button>
        <Input
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Note title"
          className="border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 md:text-2xl"
        />
        {hasChanges && (
          <LoadingButton
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            <Save />
            Save
          </LoadingButton>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Note options">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
            >
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant={filterFlag === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilterFlag(null)}
        >
          All
        </Button>
        {FLAG_SCHEMES.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() =>
              setFilterFlag((prev) => (prev === f.value ? null : f.value))
            }
            aria-label={`Filter ${f.label}`}
            className={cn(
              "size-6 rounded-full",
              f.dot,
              filterFlag === f.value &&
                "ring-2 ring-ring ring-offset-1 ring-offset-background",
            )}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {visible.length === 0 ? (
          <p className="text-muted-foreground">
            {sections.length === 0
              ? "No sections yet. Add one to start writing."
              : "No sections match this flag."}
          </p>
        ) : (
          visible.map(({ section, index }) => (
            <NoteSection
              key={index}
              section={section}
              index={index}
              isExpanded={expanded.includes(index)}
              onToggle={() => toggle(index)}
              onChange={(field, value) => updateSection(index, field, value)}
              onDelete={() => deleteSection(index)}
            />
          ))
        )}

        {filterFlag === null && (
          <div>
            <Button variant="outline" onClick={addSection}>
              <Plus />
              Add section
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
