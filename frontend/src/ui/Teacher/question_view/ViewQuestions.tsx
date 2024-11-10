import { useState } from 'react';
import {
  Box,
  Select,
  Text,
  FormControl,
  FormLabel,
  Heading,
} from '@chakra-ui/react';
import { Question } from '../../../core/types/question';
import { QuestionType } from '../../../core/types/common';
import ViewMultipleChoice from './ViewMultipleChoice';
import ViewSingleChoice from './ViewSingleChoice';
import ViewTrueFalse from './ViewTrueFalse';
import ViewUserInput from './ViewUserInput';

export default function ViewQuestions({
  questions,
  totalGradedMark,
}: {
  questions: Question[];
  totalGradedMark: number;
}) {
  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string | 'all'>('all');

  if (questions === undefined || questions?.length == 0) {
    return <Heading>No Question Found, Add Question from the Tabs</Heading>;
  }

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.total_marks,
    0
  );
  const tags = Array.from(new Set(questions.map((question) => question.tag)));

  const filteredQuestions = questions.filter((question) => {
    return (
      (filterType === 'all' || question.question_type === filterType) &&
      (filterTag === 'all' || question.tag === filterTag)
    );
  });

  return (
    <Box>
      <Box
        display="flex"
        mb={4}
        justifyContent="space-between"
        alignItems={'center'}
        borderColor={'gray.600'}
        border={'1px solid'}
        borderRadius={'md'}
        p={8}
      >
        <FormControl display="flex" alignItems="center" ml={50}>
          <FormLabel mb="0">Filter by Type:</FormLabel>
          <Select
            onChange={(e) =>
              setFilterType(e.target.value as QuestionType | 'all')
            }
            width="auto"
          >
            <option value="all">All</option>
            <option value="single_choice">Single Choice</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="user_input">User Input</option>
            <option value="true_false">True/False</option>
          </Select>
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Filter by Tag:</FormLabel>
          <Select onChange={(e) => setFilterTag(e.target.value)} width="auto">
            <option value="all">All</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <Text>Total Possible Score: {totalMarks}</Text>
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <Text>Total Graded Marks: {totalGradedMark}</Text>
        </FormControl>
      </Box>

      {filteredQuestions.map((question, index) => {
        switch (question.question_type) {
          case 'single_choice':
            return <ViewSingleChoice key={index} question={question} />;
          case 'multiple_choice':
            return <ViewMultipleChoice key={index} question={question} />;
          case 'user_input':
            return <ViewUserInput key={index} question={question} />;
          case 'true_false':
            return <ViewTrueFalse key={index} question={question} />;
          default:
            return null;
        }
      })}
    </Box>
  );
}
