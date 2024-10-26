import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { FiHome, FiUser, FiSettings, FiUsers, FiBookOpen, FiFileText, FiWifi, FiBook } from 'react-icons/fi';

const currentUser = { role: 'teacher' };

let items = [
  { icon: FiHome, title: 'Welcome', path: '/' },
  { icon: FiUser, title: 'Profile', path: '/profile' },
];

if (currentUser?.role === 'admin') {
  items.push({ icon: FiSettings, title: 'Dashboard', path: '/dashboard' });
  items.push({ icon: FiUsers, title: 'Add User', path: '/addUser' });
} else if (currentUser?.role === 'teacher') {
  items.push({ icon: FiBookOpen, title: 'Course', path: '/course' });
  items.push({ icon: FiWifi, title: 'Host Live', path: '/hostLive' });
} else if (currentUser?.role === 'student') {
  items.push({ icon: FiBookOpen, title: 'Enrolled Course', path: '/enrolledCourse' });
  items.push({ icon: FiFileText, title: 'Notes', path: '/notes' });
  items.push({ icon: FiWifi, title: 'Join Live', path: '/joinLive' });
}

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue('ui.main', 'ui.light');
  const bgActive = useColorModeValue('#E2E8F0', '#4A5568');

  const listItems = items.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w='100%'
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
      <Icon as={icon} alignSelf='center' />
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
