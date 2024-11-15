import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { User } from '../../core/types/common';

interface ShowEnrolledStudentsProps {
  students: User[];
}

const ShowEnrolledStudents: React.FC<ShowEnrolledStudentsProps> = ({
  students,
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Full Name</Th>
            <Th>Email</Th>
            <Th>Joined At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <Tr key={student.id}>
              <Td>{student.full_name}</Td>
              <Td>{student.email}</Td>
              <Td>{new Date(student.joined_at).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ShowEnrolledStudents;
