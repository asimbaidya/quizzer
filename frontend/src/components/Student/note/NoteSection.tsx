import {
  ChevronDown,
  ChevronRight,
  ImagePlus,
  Loader2,
  MoreVertical,
  X,
} from "lucide-react"
import { useRef, useState } from "react"

import { ImagesService, type NoteItem } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { FLAG_SCHEMES, flagBorder, imageUrl } from "./flag-schemes"

interface Props {
  section: NoteItem
  index: number
  isExpanded: boolean
  onToggle: () => void
  onChange: (field: keyof NoteItem, value: string | number | null) => void
  onDelete: () => void
}

export default function NoteSection({
  section,
  index,
  isExpanded,
  onToggle,
  onChange,
  onDelete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
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

  return (
    <div className={cn("rounded-md border p-4", flagBorder(section.flag))}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </Button>
        <Input
          value={section.title}
          placeholder={`Section ${index + 1} title`}
          onChange={(e) => onChange("title", e.target.value)}
          className="border-none px-0 text-base font-semibold shadow-none focus-visible:ring-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Section options">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Delete section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && (
        <div className="mt-4 flex flex-col gap-4 pl-10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-muted-foreground">Flag</span>
            <button
              type="button"
              onClick={() => onChange("flag", 0)}
              aria-label="No flag"
              className={cn(
                "size-5 rounded-full border border-muted-foreground/40",
                section.flag === 0 &&
                  "ring-2 ring-ring ring-offset-1 ring-offset-background",
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
                    "ring-2 ring-ring ring-offset-1 ring-offset-background",
                )}
              />
            ))}
          </div>

          <textarea
            className="min-h-32 w-full rounded-md border bg-transparent p-3 text-sm"
            placeholder="Write your note…"
            value={section.content}
            onChange={(e) => onChange("content", e.target.value)}
          />

          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFile}
              className="hidden"
            />
            {section.image ? (
              <div className="relative inline-block">
                <img
                  src={imageUrl(section.image)}
                  alt="note attachment"
                  className="max-h-64 rounded-md border object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  className="absolute right-2 top-2"
                  onClick={() => onChange("image", null)}
                  aria-label="Remove image"
                >
                  <X />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ImagePlus />
                )}
                Add image
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
