import { FLAG_SCHEMES } from './flag_schemes';

import {
  HStack,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from '@chakra-ui/react';
import { FaFlag } from 'react-icons/fa';
import { LuFlagOff } from 'react-icons/lu';
import { BiFilterAlt } from 'react-icons/bi';

const FlagFilter: React.FC<{
  selectedFlag: number | null;
  onFlagSelect: (flag: number | null) => void;
}> = ({ selectedFlag, onFlagSelect }) => (
  <HStack spacing={2} justifyContent="flex-end" mb={4}>
    <Menu>
      <Tooltip label="Filter by flag">
        <MenuButton
          as={IconButton}
          icon={<BiFilterAlt />}
          variant="solid"
          colorScheme={selectedFlag !== null ? 'teal' : 'gray'}
        />
      </Tooltip>
      <MenuList>
        <MenuItem onClick={() => onFlagSelect(null)}>All flags</MenuItem>
        <MenuItem onClick={() => onFlagSelect(0)}>
          <HStack>
            <LuFlagOff />
            <Text>No flag</Text>
          </HStack>
        </MenuItem>
        {Object.entries(FLAG_SCHEMES).map(([flag, { scheme }]) => (
          <MenuItem
            key={flag}
            onClick={() => onFlagSelect(Number(flag))}
            color={`${scheme}.500`}
          >
            <HStack>
              <FaFlag />
              <Text>Flag {flag}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </HStack>
);

export default FlagFilter;
