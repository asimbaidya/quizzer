import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Button } from '@chakra-ui/react';
import useCustomToast from '../../../hooks/useCustomToast';

export const Route = createFileRoute('/_layout/(admin)/dashboard')({
  component: () => <DashBoard />,
});

function DashBoard() {
  const { showToast } = useCustomToast();

  const handleDeleteUnusedImages = () => {
    showToast({
      title: 'Button clicked',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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
