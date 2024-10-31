import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  FiHome,
  FiUser,
  FiSettings,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiWifi,
  FiBook,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const currentUser = { role: 'teacher' };

let items = [
  { icon: FiHome, title: 'Welcome', path: '/' },
  { icon: FiUser, title: 'Profile', path: '/profile' },
];

type Items = typeof items;

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue('ui.main', 'ui.light');
  const bgActive = useColorModeValue('#E2E8F0', '#4A5568');

  const { user } = useAuth();

  let final_items: Items = [];
  if (user?.role === 'admin') {
    final_items = [
      ...items,
      { icon: FiSettings, title: 'Dashboard', path: '/dashboard' },
      { icon: FiUsers, title: 'Add User', path: '/addUser' },
    ];
  } else if (user?.role === 'teacher') {
    final_items = [
      ...items,
      { icon: FiBookOpen, title: 'Course', path: '/course' },
      { icon: FiWifi, title: 'Host Live', path: '/hostLive' },
    ];
  } else if (user?.role === 'student') {
    final_items = [
      ...items,
      {
        icon: FiBookOpen,
        title: 'Enrolled Course',
        path: '/enrolledCourses',
      },
      { icon: FiFileText, title: 'Notes', path: '/note' },
      { icon: FiWifi, title: 'Join Live', path: '/joinLive' },
    ];
  }

  const listItems = final_items?.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={2}
      key={title}
      activeProps={{
        style: {
          background: bgActive,
          borderRadius: '12px',
        },
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" />
      <Text ml={2}>{title}</Text>
    </Flex>
  ));

  return (
    <>
      <Box>{listItems}</Box>
    </>
  );
};

export default SidebarItems;
