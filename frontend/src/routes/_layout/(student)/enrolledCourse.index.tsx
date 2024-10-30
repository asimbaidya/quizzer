import { createFileRoute } from '@tanstack/react-router';
import EnrolledCourses from '../../../ui/Student/EnrolledCourses';

export const Route = createFileRoute('/_layout/(student)/enrolledCourse/')({
  component: () => <EnrolledCourses />,
});
