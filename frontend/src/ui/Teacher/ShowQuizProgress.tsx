import { StudentQuizProgress } from '../../core/types/common';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';

interface ShowQuizProgressProps {
  progressData: StudentQuizProgress[];
}

export default function ShowQuizProgress({
  progressData,
}: ShowQuizProgressProps) {
  if (progressData.length === 0) {
    return <Text>No student data exists.</Text>;
  }

  return (
    <TableContainer overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Student ID</Th>
            <Th>Email</Th>
            <Th>Received Marks</Th>
            <Th>Total Attempts</Th>
            <Th>Questions Attempted</Th>
            <Th>Total Possible Marks</Th>
            <Th>Weighted Marks</Th>
            {/* <Th>Total Questions</Th>
            <Th>Unlimited Attempts</Th>
            <Th>Allowed Attempts</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {progressData.map((progress) => (
            <Tr key={progress.student_id}>
              <Td>{progress.student_id}</Td>
              <Td whiteSpace="nowrap">{progress.email}</Td>
              <Td>{progress.received_marks}</Td>
              <Td>{progress.total_attempts}</Td>
              <Td>{progress.total_questions_attempted}</Td>
              <Td>{progress.total_possible_marks}</Td>
              <Td>{progress.weighted_marks}</Td>
              {/* <Td>{progress.total_questions}</Td>
              <Td>{progress.is_unlimited_attempt ? 'Yes' : 'No'}</Td>
              <Td>{progress.total_allowed_attempt}</Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
