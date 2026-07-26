import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"

import { TeacherService } from "@/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

export default function CreateQuizDialog({
  courseTitle,
}: {
  courseTitle: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("New Quiz")
  const [totalMark, setTotalMark] = useState(20)
  const [attempts, setAttempts] = useState(1)
  const [unlimited, setUnlimited] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const mutation = useMutation({
    mutationFn: () =>
      TeacherService.createQuiz({
        courseTitle,
        requestBody: {
          title,
          total_mark: totalMark,
          allowed_attempt: attempts,
          is_unlimited_attempt: unlimited,
        },
      }),
    onSuccess: () => {
      showSuccessToast("Quiz created")
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["teacher-course", courseTitle],
      }),
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          New quiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a quiz</DialogTitle>
          <DialogDescription>
            Add questions after creating it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total marks</Label>
              <Input
                type="number"
                value={totalMark}
                onChange={(e) => setTotalMark(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Allowed attempts</Label>
              <Input
                type="number"
                value={attempts}
                disabled={unlimited}
                onChange={(e) => setAttempts(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-left"
            onClick={() => setUnlimited((v) => !v)}
          >
            <Checkbox checked={unlimited} className="pointer-events-none" />
            <span className="text-sm">Unlimited attempts</span>
          </button>
        </div>
        <DialogFooter>
          <LoadingButton
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Create
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
