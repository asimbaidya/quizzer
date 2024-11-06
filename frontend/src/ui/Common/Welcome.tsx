import useAuth from '../../hooks/useAuth';
import { Container, Heading } from '@chakra-ui/react';

export default function Welcome() {
  const { user } = useAuth();
  return (
    <Container maxW="full" minW="100vh">
      <Heading
        fontSize="8xl"
        textAlign={{ base: 'center', md: 'center' }}
        py={12}
      >
        Welcome to Quizzer
      </Heading>
      {user && (
        <Heading
          fontSize="8xl"
          textAlign={{ base: 'center', md: 'center' }}
          textColor={'teal.700'}
        >
          {user.full_name}
        </Heading>
      )}
    </Container>
  );
}
