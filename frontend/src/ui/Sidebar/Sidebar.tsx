import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, IconButton, Image, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { FiLogOut, FiMenu } from 'react-icons/fi';

import SidebarItems from '../Sidebar/SideBarItems';

const Sidebar = () => {
  const queryClient = useQueryClient();
  const bgColor = useColorModeValue('ui.dark', 'ui.light');
  const textColor = useColorModeValue('ui.light', 'ui.dark');
  const secBgColor = useColorModeValue('ui.darkSlate', 'ui.secondary');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logout = () => {
    console.log('logout');
  };

  const handleLogout = async () => {
    logout();
  };

  return (
    <>
      {/* Mobile */}
      <IconButton onClick={onOpen} display={{ base: 'flex', md: 'none' }} aria-label='Open Menu' position='absolute' fontSize='20px' m={4} icon={<FiMenu />} />
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW='250px'>
          <DrawerCloseButton />
          <DrawerBody py={8}>
            <Flex flexDir='column' justify='space-between'>
              <Box>
                <Image src='example.png' alt='Logo 🚀' p={6} /> {/* TODO: Replace with custom logo */}
                <SidebarItems onClose={onClose} />
                <Flex as='button' onClick={handleLogout} p={2} color='ui.danger' fontWeight='bold' alignItems='center'>
                  <FiLogOut />
                  <Text ml={2}>Log out</Text>
                </Flex>
              </Box>
              {/* modified */}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop */}
      <Box bg={bgColor} p={3} h='100vh' position='sticky' top='0' display={{ base: 'none', md: 'flex' }}>
        <Flex flexDir='column' justify='space-between' bg={secBgColor} p={4} borderRadius={12}>
          <Box>
            <Image src='Logo.png' alt='Logo 🚀' w='180px' maxW='2xs' p={6} /> {/* TODO: */}
            <SidebarItems />
          </Box>
          {/* modified */}
        </Flex>
      </Box>
    </>
  );
};

export default Sidebar;
