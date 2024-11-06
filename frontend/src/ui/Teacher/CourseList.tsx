import { Course } from '../../core/types/common';
import { format } from 'date-fns';
import {
  Text,
  VStack,
  HStack,
  Box,
  useColorModeValue,
  Heading,
  Badge,
  Flex,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

interface CourseProps {
  course: Course;
}

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  return (
    <VStack spacing={6} align="stretch" width="full" p={4}>
      <Heading size="xl" textAlign="center" mb={6}>
        My Courses
      </Heading>
      <Box>
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </Box>
    </VStack>
  );
}

const CourseItem: React.FC<CourseProps> = ({ course }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      p={6}
      mb={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="sm"
      bg={bg}
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <VStack align="stretch" spacing={4}>
        <Flex align="center">
          <Box>
            <HStack spacing={3}>
              <Heading size="lg" color={textColor}>
                {course.title}
              </Heading>
              <Badge
                colorScheme={course.is_open ? 'green' : 'red'}
                variant="solid"
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="full"
              >
                {course.is_open ? 'Open' : 'Closed'}
              </Badge>
            </HStack>
            <Text fontSize="sm" color={descriptionColor} mt={1}>
              Created on {format(new Date(course.created_at), 'PPP')}
            </Text>
          </Box>
          <Spacer />
          <Button
            as={Link}
            to={`/course/${course.url}`}
            colorScheme="teal"
            size="md"
          >
            View Course
          </Button>
        </Flex>

        {course.description && (
          <Text color={descriptionColor}>{course.description}</Text>
        )}

        <Box
          p={4}
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderRadius="md"
        >
          <HStack spacing={3}>
            <Text fontWeight="bold" color={textColor}>
              Course Pin:
            </Text>
            <Text
              color={useColorModeValue('blue.600', 'blue.200')}
              fontSize="lg"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {course.course_pin}
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};
