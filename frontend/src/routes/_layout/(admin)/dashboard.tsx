import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Button } from '@chakra-ui/react';
import { deleteUnusedImages } from '../../../core/services/admin';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';

export const Route = createFileRoute('/_layout/(admin)/dashboard')({
  component: () => <DashBoard />,
});

function DashBoard() {
  const { showToast } = useCustomToast();

  const mutation = useMutation({
    mutationFn: ({ signal }: { signal: AbortSignal }) =>
      deleteUnusedImages(signal),
    onSuccess: (data: { success: true; detail: string }) => {
      const { success, detail } = data;
      console.log(success, detail);
      showToast({
        title: 'Success',
        description: detail,
        status: success ? 'success' : 'warning',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        title: 'Error',
        description:
          error?.response?.data?.detail || 'Failed to delete unused images.',
        status: 'error',
      });
    },
  });

  const handleDeleteUnusedImages = () => {
    mutation.mutate({ signal: new AbortController().signal });
  };

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Available Admin Actions & Overviews
      </Heading>
      <Button
        width="100%"
        onClick={handleDeleteUnusedImages}
        mt={4}
        colorScheme="purple"
      >
        Delete Unused Images
      </Button>
    </Container>
  );
}
