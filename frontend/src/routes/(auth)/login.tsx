import { createFileRoute } from '@tanstack/react-router';
import Login from '../../ui/Common/Login';

export const Route = createFileRoute('/(auth)/login')({
  component: () => <Login />,
});
