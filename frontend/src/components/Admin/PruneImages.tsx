import { useMutation } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

import { AdminService } from "@/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

export default function PruneImages() {
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const mutation = useMutation({
    mutationFn: () => AdminService.deleteUnusedImages(),
    onSuccess: (res) =>
      showSuccessToast((res as { message?: string })?.message ?? "Done"),
    onError: handleError.bind(showErrorToast),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>
          Delete uploaded images no longer referenced by any question or note.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          <Trash2 />
          Prune unused images
        </Button>
      </CardContent>
    </Card>
  )
}
