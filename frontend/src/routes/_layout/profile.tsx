import { createFileRoute } from '@tanstack/react-router';
import Profile from '../../ui/Profile/Profile';

export const Route = createFileRoute('/_layout/profile')({
  component: () => <Profile />,
});
