import { Box, Icon } from '@chakra-ui/react';
import { FaCoffee } from 'react-icons/fa'; // You can choose any icon from react-icons

const IconBox = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg="gray.100"
      borderRadius="md"
      boxShadow="md"
    >
      <Icon as={FaCoffee} boxSize={6} color="teal.500" />{' '}
    </Box>
  );
};

export default IconBox;
