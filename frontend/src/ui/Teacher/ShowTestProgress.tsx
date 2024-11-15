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
  Select,
  Box,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ShowTestProgressProps {
  progressData: StudentTestProgress[];
}

export default function ShowTestProgress({
  progressData,
}: ShowTestProgressProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (progressData.length === 0) {
    return <Text>No student data exists.</Text>;
  }

  const sortedData = [...progressData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof StudentTestProgress];
    const bValue = b[sortField as keyof StudentTestProgress];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return (
    <Box>
      <Heading size="md" my={4}>
        Test Progress
      </Heading>
      <HStack spacing={4} mb={4}>
        <HStack spacing={2}>
          <Select
            size="sm"
            width="200px"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="weighted_marks">Weighted Marks</option>
            <option value="total_attempts">Total Attempts</option>
            <option value="received_marks">Received Marks</option>
            <option value="total_questions_attempted">
              Questions Attempted
            </option>
          </Select>
          <Select
            size="sm"
            width="120px"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </HStack>
      </HStack>
      <TableContainer overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th isNumeric>Total Questions</Th>
              <Th isNumeric>Questions Done</Th>
              <Th isNumeric>Total Scored</Th>
              <Th isNumeric>Max Possible Score</Th>
              <Th isNumeric>Graded Received</Th>
              <Th isNumeric>Graded Possible</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((progress) => (
              <Tr key={progress.student_id}>
                <Td whiteSpace="nowrap">{progress.email}</Td>
                <Td isNumeric>{progress.total_questions}</Td>
                <Td isNumeric>{progress.total_questions_attempted}</Td>
                <Td isNumeric>{progress.received_marks}</Td>
                <Td isNumeric>{progress.total_possible_marks}</Td>
                <Td isNumeric>{progress.weighted_marks.toFixed(2)}</Td>
                <Td isNumeric>{progress.test_total_mark}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
