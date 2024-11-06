import { StudentTestProgress } from '../../core/types/common';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Heading,
  VStack,
} from '@chakra-ui/react';

interface ShowTestProgressProps {
  progressData: StudentTestProgress[];
}

export default function ShowTestProgress({
  progressData,
}: ShowTestProgressProps) {
  if (progressData.length === 0) {
    return <Text>No student data exists.</Text>;
  }

  return (
    <>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Test Progress
      </Heading>
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
              {/* <Th>Total Questions</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {progressData.map((progress) => (
              <Tr key={progress.student_id}>
                <Td width={'20px'}>{progress.student_id}</Td>
                <Td whiteSpace="nowrap">{progress.email}</Td>
                <Td>{progress.received_marks}</Td>
                <Td>{progress.total_attempts}</Td>
                <Td>{progress.total_questions_attempted}</Td>
                <Td>{progress.total_possible_marks}</Td>
                <Td>{progress.weighted_marks.toFixed(2)}</Td>
                {/* <Td>{progress.total_questions}</Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
