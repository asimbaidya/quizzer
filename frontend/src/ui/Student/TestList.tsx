import { Box, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import { TestWithUrlAndStatus } from '../../core/types/common';
import TestCard from './TestCard';

const TestList = ({ tests }: { tests: TestWithUrlAndStatus[] }) => {
  console.log(tests);

  return (
    <Box p={5} userSelect={'none'}>
      <Heading mb={6} textAlign="center">
        Available Tests
      </Heading>
      <Stack spacing={6}>
        {tests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </Stack>
    </Box>
  );
};

export default TestList;
