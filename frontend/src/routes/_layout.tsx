import { Flex, Spinner } from '@chakra-ui/react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import Sidebar from '../ui/Sidebar/Sidebar';
import { isLoggedIn } from '../hooks/useAuth';
import UserMenu from '../ui/Common/UserMenu';

export const Route = createFileRoute('/_layout')({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

function Layout() {
  return (
    <Flex
      maxW="large"
      minH="100vh"
      bg="ui.darkSlate"
      h="auto"
      position="relative"
    >
      <Sidebar />
      <Outlet />
      <UserMenu />
    </Flex>
  );
}
