import useAuth, { isLoggedIn } from '../../hooks/useAuth';
import { Button } from '@chakra-ui/react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Type for the form data
type LoginFormData = z.infer<typeof loginSchema>;

function LogOut() {
  const { logout, user } = useAuth();
  return (
    <>
      <Button onClick={logout}>Logout</Button>
    </>
  );
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const { login, loginError, setLoginError } = useAuth();

  // Function to reset login error
  const resetLoginError = () => {
    setLoginError(null);
  };

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password);
  };

  if (isLoggedIn()) {
    return <LogOut />;
  }

  return (
    // Add Gradient Background Wrapper with Lighter Gradient
    <Box
      minHeight="100vh"
      bgGradient="linear(to-r, teal.100, blue.300)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Existing Form Container with Blurry Dark Background */}
      <Box
        maxWidth="500px" // Increased width
        width="90%"
        p={8} // Increased padding
        borderRadius="lg"
        bg="rgba(0, 0, 0, 0.6)" // Semi-transparent dark background
        color="white" // Light text color for contrast
        boxShadow="xl"
        backdropFilter="blur(10px)" // Blur effect
      >
        <Heading mb="6" textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                {...register('email')}
                onChange={resetLoginError}
                bg="rgba(255, 255, 255, 0.2)" // Semi-transparent input background
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
                color="white" // Text color for contrast
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                {...register('password')}
                onChange={resetLoginError}
                bg="rgba(255, 255, 255, 0.2)" // Semi-transparent input background
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
                color="white" // Text color for contrast
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            {loginError && (
              <Box color="red.300">{JSON.stringify(loginError)}</Box>
            )}
            <Button type="submit" colorScheme="blue" width="full">
              Login
            </Button>
          </VStack>
        </form>
        <Box mt={6} textAlign="center">
          <Text>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{ color: 'blue.300', textDecoration: 'underline' }}
            >
              Signup
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
