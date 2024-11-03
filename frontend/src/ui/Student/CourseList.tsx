import { Course } from '../../core/types/common';
import { Text, VStack, HStack } from '@chakra-ui/react';
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
        <CourseComponent key={index} course={course} />
      ))}
    </VStack>
  );
}

const CourseComponent: React.FC<CourseProps> = ({ course }) => {
  return (
    <HStack
      spacing={30}
      align="stretch"
      p={8}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      width="full"
      bg="gray.800"
      borderColor="gray.700" // Border color for dark theme
    >
      <Text fontSize="2xl" fontWeight="bold" color="white">
        {course.title}
      </Text>
      <Text fontSize="md" color="gray.400">
        {course.description}
      </Text>
      <Text fontSize="sm" color={course.is_open ? 'green.300' : 'red.300'}>
        Status: {course.is_open ? 'Open' : 'Closed'}
      </Text>
      <span color="teal.300">
        <Link
          to={course.url}
          style={{
            color: 'teal',
            fontWeight: 'bold',
          }}
        >
          View Course
        </Link>
      </span>
    </HStack>
  );
};
