import useAuth from '../../hooks/useAuth';

import { Container, Heading } from '@chakra-ui/react';
import Appearance from './Appearance';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { User } from '../../core/types/common';

export default function Profile() {
  const { user } = useAuth();

  if (user) {
    console.log('User:', user);
  }

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        User Settings {user?.email}
      </Heading>
      {user && <UserInfo user={user} />}
      <Appearance />
    </Container>
  );
}

function UserInfo({ user }: { user: User }) {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.100', dark: 'gray.700' };
  const textColor = { light: 'black', dark: 'white' };

  return (
    <Box
      bg={bgColor[colorMode]}
      color={textColor[colorMode]}
      p={4}
      borderRadius="md"
      mb={4}
    >
      <Text fontSize="lg" fontWeight="bold">
        {user.full_name}
      </Text>
      <Text>Email: {user.email}</Text>
      <Text>Joined: {new Date(user.joined_at).toLocaleDateString()}</Text>
      <Text>Role: {user.role}</Text>
    </Box>
  );
}
