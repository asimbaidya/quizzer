import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { StudentService, UsersService } from "@/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface Note {
  id: string
  title: string
  note_data: { title: string; content: string; flag: number }[]
}

export const Route = createFileRoute("/_layout/notes")({
  component: Notes,
  beforeLoad: async () => {
    const user = await UsersService.readUserMe()
    if (user.role !== "student") throw redirect({ to: "/" })
  },
  head: () => ({ meta: [{ title: "Notes - Quizzer" }] }),
})

function Notes() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => (await StudentService.getNotes()) as unknown as Note[],
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["notes"] })

  const createMutation = useMutation({
    mutationFn: () =>
      StudentService.createNote({
        requestBody: {
          title,
          note_data: [{ title, content, flag: 0 }],
        },
      }),
    onSuccess: () => {
      showSuccessToast("Note created")
      setTitle("")
      setContent("")
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => StudentService.deleteNote({ noteId }),
    onSuccess: () => showSuccessToast("Note deleted"),
    onError: handleError.bind(showErrorToast),
    onSettled: invalidate,
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <textarea
                  className="min-h-32 w-full rounded-md border bg-transparent p-3 text-sm"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <LoadingButton
                loading={createMutation.isPending}
                disabled={title.trim() === ""}
                onClick={() => createMutation.mutate()}
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-28 w-full" />
      ) : !notes || notes.length === 0 ? (
        <p className="text-muted-foreground">No notes yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {note.title}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(note.id)}
                  >
                    <Trash2 />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {note.note_data[0]?.content ?? ""}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
