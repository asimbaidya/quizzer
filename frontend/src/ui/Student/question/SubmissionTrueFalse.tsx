import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';

import { TrueFalseResponseSchema } from '../../../core/schemas/question_submission';
import {
  QuestionSubmission,
  TrueFalseSubmissionResponse,
} from '../../../core/types/question';

const SubmissionTrueFalse: React.FC<QuestionSubmission> = ({
  question,
  submission,
}) => {
  const { image_url } = question;
  const { question_text, choices } = question.question_data;
  const is_submitted = submission?.made_attempt || false;

  const [userResponse, setUserResponse] = useState<boolean | null>(null);

  const handleSelect = (response: boolean) => {
    setUserResponse(response);
  };

  const handleSubmit = () => {
    const submission: TrueFalseSubmissionResponse =
      TrueFalseResponseSchema.parse({
        question_type: 'true_false',
        user_response: userResponse as boolean,
        is_submitted: true,
      });
    alert(JSON.stringify(submission));
  };

  const handleShowFeedback = () => {
    alert(`Feedback: ${question.feedback}\nScore: ${question.score}`);
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5}>
      <Text fontSize="xl" mb={4}>
        {question_text}
      </Text>
      {image_url && <Image src={image_url} alt="Question Image" mb={4} />}
      {!is_submitted ? (
        <>
          <Flex mb={4}>
            <Button
              mr={2}
              colorScheme={userResponse === true ? 'green' : 'gray'}
              onClick={() => handleSelect(true)}
            >
              True
            </Button>
            <Button
              colorScheme={userResponse === false ? 'green' : 'gray'}
              onClick={() => handleSelect(false)}
            >
              False
            </Button>
          </Flex>
          {userResponse !== null && (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </>
      ) : (
        <Button onClick={handleShowFeedback}>Show Feedback</Button>
      )}
    </Box>
  );
};

export default SubmissionTrueFalse;
