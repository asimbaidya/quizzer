import { Course } from '../../core/types/common';
import { Text, VStack, HStack, Box, useColorModeValue } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

interface CourseProps {
  course: Course;
}
interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  return (
    <VStack spacing={8} align="stretch" width="full" minHeight="100vh" mt={4}>
      {courses.map((course, index) => (
        <CourseItem key={index} course={course} />
      ))}
    </VStack>
  );
}

const CourseItem: React.FC<CourseProps> = ({ course }) => {
  const bg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const statusColor = course.is_open ? 'green.300' : 'red.300';

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      width="full"
      bg={bg}
      borderColor={borderColor}
    >
      <HStack justify="space-between" width="full">
        <Text fontSize="4xl" fontWeight="bold" color={textColor}>
          {course.title}
        </Text>
        <Text fontSize="sm" color={statusColor}>
          Status: {course.is_open ? 'Open' : 'Closed'}
        </Text>
      </HStack>
      <HStack justify="space-between" width="full" mt={4}>
        <Text fontSize="md" color={descriptionColor}>
          {course.description}
        </Text>
        <Link
          to={`/course/${course.url}`}
          style={{
            color: 'teal',
            fontWeight: 'bold',
            fontSize: '1.5em',
          }}
        >
          View Course
        </Link>
      </HStack>
    </Box>
  );
};
