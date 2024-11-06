import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Heading,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCreateSchema } from '../../core/schemas/common';
import useCustomToast from '../../hooks/useCustomToast';

type SignupFormData = z.infer<typeof UserCreateSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(UserCreateSchema),
  });

  const { showToast } = useCustomToast();

  const onSubmit = (data: SignupFormData) => {
    const { confirm_password, ...submitData } = data;
    // handle signup logic with submitData (e.g., send to the backend)
    showToast({
      title: 'Signup Successful',
      description: `${JSON.stringify(submitData, null, 2)}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    // Gradient Background Wrapper
    <Box
      minHeight="100vh"
      bgGradient="linear(to-r, pink.100, purple.300)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Form Container with Blurry Dark Background */}
      <Box
        maxWidth="500px"
        width="90%"
        p={8}
        borderRadius="lg"
        bg="rgba(0, 0, 0, 0.6)"
        color="white"
        boxShadow="xl"
        backdropFilter="blur(10px)"
      >
        <Heading mb="6" textAlign="center">
          Signup
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.full_name}>
              <FormLabel htmlFor="full_name">Full Name</FormLabel>
              <Input
                id="full_name"
                {...register('full_name')}
                bg="rgba(255, 255, 255, 0.2)"
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
              />
              <FormErrorMessage>
                {errors.full_name && errors.full_name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                {...register('email')}
                bg="rgba(255, 255, 255, 0.2)"
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.role}>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select
                id="role"
                {...register('role')}
                bg="rgba(255, 255, 255, 0.2)"
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </Select>
              <FormErrorMessage>
                {errors.role && errors.role.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                {...register('password')}
                bg="rgba(255, 255, 255, 0.2)"
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.confirm_password}>
              <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
              <Input
                id="confirm_password"
                type="password"
                {...register('confirm_password')}
                bg="rgba(255, 255, 255, 0.2)"
                border="none"
                _focus={{ bg: 'rgba(255, 255, 255, 0.3)' }}
              />
              <FormErrorMessage>
                {errors.confirm_password && errors.confirm_password.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Signup
            </Button>
          </VStack>
        </form>
        <Box mt={6} textAlign="center">
          <Text>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'blue.300', textDecoration: 'underline' }}
            >
              Login
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
