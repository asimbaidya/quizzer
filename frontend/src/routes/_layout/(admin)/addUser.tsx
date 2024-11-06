import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { addUser } from '../../../core/services/admin';
import AddUser from '../../../ui/Admin/AddUser';

export const Route = createFileRoute('/_layout/(admin)/addUser')({
  component: () => <AdminAddUser />,
});

function AdminAddUser() {
  return (
    <Container maxW="full">
      <AddUser />
    </Container>
  );
}
