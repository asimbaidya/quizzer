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
  Select,
  Box,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ShowQuizProgressProps {
  progressData: StudentQuizProgress[];
}

export default function ShowQuizProgress({
  progressData,
}: ShowQuizProgressProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (progressData.length === 0) {
    return <Text>No student data exists.</Text>;
  }

  const sortedData = [...progressData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof StudentQuizProgress];
    const bValue = b[sortField as keyof StudentQuizProgress];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return (
    <Box>
      <HStack spacing={4} mb={4}>
        <Select
          placeholder="Sort by"
          size="sm"
          width="200px"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="weighted_marks">Weighted Marks</option>
          <option value="total_attempts">Total Attempts</option>
        </Select>
        <Select
          size="sm"
          width="150px"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </HStack>
      <TableContainer overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Email</Th>
              <Th>Marks</Th>
              <Th>Attempts</Th>
              <Th>Questions Done</Th>
              <Th>Possible Marks</Th>
              <Th>Weighted Marks</Th>
              <Th>Total Questions</Th>
              <Th>Unlimited</Th>
              <Th>Max Attempts</Th>
              <Th>Quiz Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((progress) => (
              <Tr key={progress.student_id}>
                <Td>{progress.student_id}</Td>
                <Td whiteSpace="nowrap">{progress.email}</Td>
                <Td>{progress.received_marks}</Td>
                <Td>{progress.total_attempts}</Td>
                <Td>{progress.total_questions_attempted}</Td>
                <Td>{progress.total_possible_marks}</Td>
                <Td>{progress.weighted_marks.toFixed(2)}</Td>
                <Td>{progress.total_questions}</Td>
                <Td>{progress.is_unlimited_attempt ? 'Yes' : 'No'}</Td>
                <Td>{progress.total_allowed_attempt}</Td>
                <Td>{progress.quiz_total_mark}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
