export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  joined_at: string;
}

export interface Course {
  creator_id: number;
  title: string;
  created_at: string;
  is_open: boolean;
  id: number;
  description: string;
  course_pin: string;
}
