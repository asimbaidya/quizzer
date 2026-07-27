import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useState } from "react"

import { type NotePublic, StudentService } from "@/client"
import { Badge } from "@/components/ui/badge"
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
            const flagged = note.note_data.filter((s) => s.flag > 0).length
            return (
              <Link
                key={note.id}
                to="/notes/$noteId"
                params={{ noteId: note.id }}
              >
                <Card className="h-full transition-colors hover:border-primary">
                  <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="secondary">
                        {note.note_data.length} section
                        {note.note_data.length === 1 ? "" : "s"}
                      </Badge>
                      {flagged > 0 && (
                        <Badge variant="outline">{flagged} flagged</Badge>
                      )}
                    </CardDescription>
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
