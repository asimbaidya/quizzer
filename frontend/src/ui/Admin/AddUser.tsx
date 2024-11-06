import {
  Box,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
  FormLabel,
  Select,
  Button,
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCreateSchema } from '../../core/schemas/common';
import useCustomToast from '../../hooks/useCustomToast';

type UserFormData = z.infer<typeof UserCreateSchema>;

export default function AddUser() {
  const { showToast } = useCustomToast();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserCreateSchema),
  });

  const onSubmit = (data: UserFormData) => {
    const { confirm_password, ...submitData } = data; // exclude confirm_password
    // Handle form submission with submitData
    showToast({
      title: 'User Added',
      description: `${JSON.stringify(submitData, null, 2)}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
      minHeight="100vh"
      bgGradient="linear(to-r,blue.800, purple.500)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
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
          Add User
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
                <option value="admin">Admin</option>
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

            <Button type="submit" colorScheme="blue">
              Add User
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
