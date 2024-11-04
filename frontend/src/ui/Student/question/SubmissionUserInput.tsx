import { Box, Button, Input, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';

import {
  UserInputSubmissionResponse,
  QuestionSubmission,
} from '../../../core/types/question';
import { UserInputResponseSchema } from '../../../core/schemas/question_submission';

const SubmissionUserInput: React.FC<QuestionSubmission> = ({
  question,
  submission,
}) => {
  const { image_url } = question;
  const { question_text } = question.question_data;
  const is_submitted = false;

  const [userInput, setUserInput] = useState<string>('');

  const handleSubmit = () => {
    const submission: UserInputSubmissionResponse =
      UserInputResponseSchema.parse({
        question_type: 'user_input',
        user_response: userInput,
        is_submitted: true,
      });
    alert(JSON.stringify(submission));
  };

  const handleShowFeedback = () => {
    alert(`Feedback: ${question.feedback}\nScore: ${question.score}`);
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5}>
      <Text fontSize="4xl" mb={4}>
        {question_text}
      </Text>
      {image_url && (
        <Image src={image_url} alt="Question Image" mb={4} mx={'auto'} />
      )}
      {!is_submitted ? (
        <>
          <Input
            placeholder="Type Answer Here"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            mb={4}
            bg={'gray.400'}
            color={'black'}
            borderColor={'green'}
            borderWidth={'2px'}
            fontSize={'xl'}
          />
          {userInput && <Button onClick={handleSubmit}>Submit</Button>}
        </>
      ) : (
        <Button onClick={handleShowFeedback}>Show Feedback</Button>
      )}
    </Box>
  );
};

export default SubmissionUserInput;
