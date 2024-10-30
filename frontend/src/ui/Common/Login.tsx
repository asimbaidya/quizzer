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
} from '@chakra-ui/react';
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
      <Button onClick={logout}>logout</Button>
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
    console.log(data);
    login(data.email, data.password);
  };

  if (isLoggedIn()) {
    return <LogOut />;
  }

  return (
    <Box maxWidth="400px" mx="auto" mt="100px">
      <Heading mb="6">Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              {...register('email')}
              onChange={resetLoginError}
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
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          {loginError && <Box color="red.500">{loginError}</Box>}
          <Button type="submit" colorScheme="blue" width="full">
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
