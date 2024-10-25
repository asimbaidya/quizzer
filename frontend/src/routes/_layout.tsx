import { Flex, Spinner } from '@chakra-ui/react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import Sidebar from '../ui/Sidebar/Sidebar';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

function Layout() {
  return (
    <Flex maxW='large' minH='100vh' bg='ui.darkSlate' h='auto' position='relative'>
      <Sidebar />
      <Outlet />
    </Flex>
  );
}
