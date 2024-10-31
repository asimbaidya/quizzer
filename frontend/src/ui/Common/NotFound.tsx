import { Button, Container, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

const NotFound = () => {
  return (
    <>
      <Container
        h="100vh"
        alignItems="stretch"
        justifyContent="center"
        textAlign="center"
        maxW="sm"
        centerContent
      >
        <Text
          fontSize="8xl"
          color="red"
          fontWeight="bold"
          lineHeight="1"
          mb={4}
        >
          404
        </Text>
        <Text fontSize="4xl">NOT FOND</Text>
        <Button
          as={Link}
          to="/"
          color="red"
          borderColor="red"
          variant="outline"
          mt={4}
        >
          Go back
        </Button>
      </Container>
    </>
  );
};

export default NotFound;
