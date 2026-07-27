import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useState } from "react"

import { type NotePublic, StudentService } from "@/client"
import { flagScheme } from "@/components/Student/note/flag-schemes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"

export const Route = createFileRoute("/_layout/notes/")({
  component: Notes,
  head: () => ({ meta: [{ title: "Notes - Quizzer" }] }),
})

function Notes() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => StudentService.getNotes(),
  })

  const createMutation = useMutation({
    mutationFn: () =>
      StudentService.createNote({
        requestBody: { title: title.trim(), note_data: [] },
      }),
    onSuccess: () => {
      showSuccessToast("Note created")
      setTitle("")
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
    onError: handleError.bind(showErrorToast),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notes</h1>
          <p className="text-muted-foreground">Your personal study notes.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New note</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                autoFocus
                placeholder="Untitled"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && title.trim() !== "") {
                    createMutation.mutate()
                  }
                }}
              />
            </div>
            <DialogFooter>
              <LoadingButton
                loading={createMutation.isPending}
                disabled={title.trim() === ""}
                onClick={() => createMutation.mutate()}
              >
                Create
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : !notes || notes.length === 0 ? (
        <p className="text-muted-foreground">No notes yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note: NotePublic) => {
            const flags = [
              ...new Set(
                note.note_data.filter((s) => s.flag > 0).map((s) => s.flag),
              ),
            ]
            const preview = note.note_data
              .map((s) => s.content.trim())
              .find((c) => c.length > 0)
            return (
              <Link
                key={note.id}
                to="/notes/$noteId"
                params={{ noteId: note.id }}
                className="group"
              >
                <Card className="h-full transition-colors group-hover:border-primary/60">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="truncate">
                        {note.title || "Untitled"}
                      </CardTitle>
                      {flags.length > 0 && (
                        <div className="mt-1 flex shrink-0 gap-1">
                          {flags.map((flag) => (
                            <span
                              key={flag}
                              className={cn(
                                "size-2.5 rounded-full",
                                flagScheme(flag)?.dot,
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem] pt-1">
                      {preview || "No content yet."}
                    </CardDescription>
                    <p className="pt-2 text-xs text-muted-foreground">
                      {note.note_data.length} section
                      {note.note_data.length === 1 ? "" : "s"}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
