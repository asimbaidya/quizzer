import { Flex, Spinner } from '@chakra-ui/react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

function Layout() {
  return (
    <Flex maxW='large' minH='100vh' bg='ui.darkSlate' h='auto' position='relative'>
      <Outlet />
    </Flex>
  );
}
