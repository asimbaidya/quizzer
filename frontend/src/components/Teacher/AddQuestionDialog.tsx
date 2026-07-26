import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { type QuestionCreate, TeacherService } from "@/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useCustomToast from "@/hooks/useCustomToast"
import type { QuestionType } from "@/lib/quiz"
import { handleError } from "@/utils"

type Choice = { text: string; correct: boolean }
const emptyChoices = (): Choice[] =>
  Array.from({ length: 4 }, () => ({ text: "", correct: false }))

export default function AddQuestionDialog({
  kind,
  courseTitle,
  assessmentId,
  queryKey,
}: {
  kind: "quiz" | "test"
  courseTitle: string
  assessmentId: string
  queryKey: unknown[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<QuestionType>("single_choice")
  const [questionText, setQuestionText] = useState("")
  const [totalMarks, setTotalMarks] = useState(5)
  const [choices, setChoices] = useState<Choice[]>(emptyChoices())
  const [trueFalse, setTrueFalse] = useState<boolean>(true)
  const [correctAnswer, setCorrectAnswer] = useState("")

  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const reset = () => {
    setType("single_choice")
    setQuestionText("")
    setTotalMarks(5)
    setChoices(emptyChoices())
    setTrueFalse(true)
    setCorrectAnswer("")
  }

  const mutation = useMutation({
    mutationFn: (body: QuestionCreate) =>
      kind === "quiz"
        ? TeacherService.createQuestionInQuiz({
            courseTitle,
            quizId: assessmentId,
            requestBody: body,
          })
        : TeacherService.createQuestionInTest({
            courseTitle,
            testId: assessmentId,
            requestBody: body,
          }),
    onSuccess: () => {
      showSuccessToast("Question added")
      reset()
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const submit = () => {
    const question_data: QuestionCreate["question_data"] = {
      question_type: type,
      question_text: questionText,
    }
    if (type === "single_choice" || type === "multiple_choice") {
      question_data.choices = choices
        .filter((c) => c.text.trim() !== "")
        .map((c) => ({ text: c.text, correct: c.correct }))
    } else if (type === "true_false") {
      question_data.true_false_answer = trueFalse
    } else {
      question_data.correct_answer = correctAnswer
    }
    mutation.mutate({
      question_type: type,
      question_data,
      total_marks: totalMarks,
    })
  }

  const updateChoice = (i: number, patch: Partial<Choice>) =>
    setChoices((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as QuestionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_choice">Single choice</SelectItem>
                  <SelectItem value="multiple_choice">
                    Multiple choice
                  </SelectItem>
                  <SelectItem value="true_false">True / False</SelectItem>
                  <SelectItem value="user_input">User input</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marks</Label>
              <Input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question</Label>
            <Input
              value={questionText}
              placeholder="Enter the question"
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          {(type === "single_choice" || type === "multiple_choice") && (
            <div className="space-y-2">
              <Label>Choices (4–6, mark the correct one/s)</Label>
              {choices.map((c, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length editable rows
                <div key={i} className="flex items-center gap-2">
                  <Checkbox
                    checked={c.correct}
                    onCheckedChange={(v) =>
                      updateChoice(i, { correct: Boolean(v) })
                    }
                  />
                  <Input
                    value={c.text}
                    placeholder={`Choice ${i + 1}`}
                    onChange={(e) => updateChoice(i, { text: e.target.value })}
                  />
                  {choices.length > 4 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setChoices((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))}
              {choices.length < 6 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setChoices((prev) => [
                      ...prev,
                      { text: "", correct: false },
                    ])
                  }
                >
                  <Plus /> Add choice
                </Button>
              )}
            </div>
          )}

          {type === "true_false" && (
            <div className="space-y-2">
              <Label>Correct answer</Label>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <Button
                    key={String(v)}
                    type="button"
                    variant={trueFalse === v ? "default" : "outline"}
                    onClick={() => setTrueFalse(v)}
                  >
                    {v ? "True" : "False"}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {type === "user_input" && (
            <div className="space-y-2">
              <Label>Correct answer</Label>
              <Input
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <LoadingButton loading={mutation.isPending} onClick={submit}>
            Add question
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
