import { createFileRoute } from '@tanstack/react-router';
import Signup from '../../ui/Common/SignUp';

export const Route = createFileRoute('/(auth)/signup')({
  component: () => () => <Signup />,
});
