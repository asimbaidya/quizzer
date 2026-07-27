import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { StudentService } from "@/client"
import NoteEditor from "@/components/Student/note/NoteEditor"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/_layout/notes/$noteId")({
  component: NoteDetail,
  head: () => ({ meta: [{ title: "Note - Quizzer" }] }),
})

function NoteDetail() {
  const { noteId } = Route.useParams()
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => StudentService.getNote({ noteId }),
  })

  if (isLoading) return <Skeleton className="h-64 w-full" />

  if (!note) {
    return (
      <p className="text-muted-foreground">
        Note not found.{" "}
        <Link to="/notes" className="underline">
          Back to notes
        </Link>
      </p>
    )
  }

  return <NoteEditor note={note} />
}
