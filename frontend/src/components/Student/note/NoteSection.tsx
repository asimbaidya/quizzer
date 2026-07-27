import {
  ChevronRight,
  GripVertical,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { useRef, useState } from "react"

import { ImagesService, type NoteItem } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import AutoTextarea from "./AutoTextarea"
import { FLAG_SCHEMES, flagBorder, imageUrl } from "./flag-schemes"

interface Props {
  section: NoteItem
  isExpanded: boolean
  isDragOver: boolean
  dragDisabled: boolean
  onToggle: () => void
  onChange: (field: keyof NoteItem, value: string | number | null) => void
  onDelete: () => void
  onAddBelow: () => void
  onDragStart: () => void
  onDragEnter: () => void
  onDragEnd: () => void
}

export default function NoteSection({
  section,
  isExpanded,
  isDragOver,
  dragDisabled,
  onToggle,
  onChange,
  onDelete,
  onAddBelow,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [draggable, setDraggable] = useState(false)
  const { showErrorToast } = useCustomToast()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      // The generated client types the multipart field as `string`, but the
      // request needs the raw File/Blob at runtime.
      const res = await ImagesService.uploadImage({
        formData: { file: file as unknown as string },
      })
      const fileId = (res as Record<string, string>).file_id
      if (fileId) onChange("image", fileId)
    } catch {
      showErrorToast("Failed to upload image")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const previewText = section.content.trim() || "Empty section"

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: native drag-reorder container, activated via the grip handle
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={() => {
        setDraggable(false)
        onDragEnd()
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        onDragEnter()
      }}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "group relative -mx-2 flex gap-1 rounded-lg px-2 py-1.5 transition-colors",
        "hover:bg-muted/40",
        isDragOver &&
          "before:absolute before:inset-x-2 before:-top-px before:h-0.5 before:rounded-full before:bg-primary",
      )}
    >
      {/* Hover gutter: add-below + drag handle */}
      <div
        className={cn(
          "flex w-9 shrink-0 items-start justify-end gap-0.5 pt-1 text-muted-foreground",
          "opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100",
        )}
      >
        <button
          type="button"
          onClick={onAddBelow}
          aria-label="Add section below"
          disabled={dragDisabled}
          className={cn(
            "rounded p-0.5 hover:bg-muted hover:text-foreground",
            dragDisabled &&
              "cursor-not-allowed opacity-40 hover:bg-transparent",
          )}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Drag to reorder"
          disabled={dragDisabled}
          onMouseDown={() => !dragDisabled && setDraggable(true)}
          onMouseUp={() => setDraggable(false)}
          className={cn(
            "rounded p-0.5 hover:bg-muted hover:text-foreground",
            dragDisabled ? "cursor-not-allowed opacity-40" : "cursor-grab",
          )}
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      {/* Content column, with a colored rail when flagged */}
      <div
        className={cn(
          "min-w-0 flex-1",
          section.flag > 0 && cn("border-l-2 pl-3", flagBorder(section.flag)),
        )}
      >
        <div className="flex items-start gap-1">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
            className={cn(
              "mt-1 rounded p-0.5 text-muted-foreground transition-transform hover:bg-muted hover:text-foreground",
              isExpanded && "rotate-90",
              !isExpanded && "text-foreground",
            )}
          >
            <ChevronRight className="size-4" />
          </button>

          <input
            value={section.title}
            placeholder="Untitled section"
            onChange={(e) => onChange("title", e.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent py-0.5 text-lg font-semibold outline-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Section options"
                className="opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Flag
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onChange("flag", 0)}
                    aria-label="No flag"
                    className={cn(
                      "size-5 rounded-full border border-muted-foreground/40",
                      section.flag === 0 &&
                        "ring-2 ring-ring ring-offset-1 ring-offset-popover",
                    )}
                  />
                  {FLAG_SCHEMES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => onChange("flag", f.value)}
                      aria-label={f.label}
                      className={cn(
                        "size-5 rounded-full",
                        f.dot,
                        section.flag === f.value &&
                          "ring-2 ring-ring ring-offset-1 ring-offset-popover",
                      )}
                    />
                  ))}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 />
                Delete section
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isExpanded ? (
          <div className="flex flex-col gap-3 pl-6 pr-1">
            <AutoTextarea
              value={section.content}
              placeholder="Write something, or leave it blank…"
              onChange={(e) => onChange("content", e.target.value)}
              className="text-[15px] leading-7 text-foreground/90"
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFile}
              className="hidden"
            />
            {section.image ? (
              <div className="group/img relative w-fit">
                <img
                  src={imageUrl(section.image)}
                  alt="note attachment"
                  className="max-h-80 rounded-lg border object-contain"
                />
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="absolute right-2 top-2 opacity-0 shadow-sm transition-opacity group-hover/img:opacity-100"
                  onClick={() => onChange("image", null)}
                  aria-label="Remove image"
                >
                  <X />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
                Add image
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="block w-full truncate pl-6 text-left text-sm text-muted-foreground/80"
          >
            {previewText}
          </button>
        )}
      </div>
    </div>
  )
}
