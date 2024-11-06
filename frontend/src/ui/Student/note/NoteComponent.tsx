import {
  Box,
  Collapse,
  Textarea,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { FLAG_SCHEMES } from './flag_schemes';

import { NoteItem } from '../../../core/schemas/common';
import FlagSelector from './FlagSelector';
import TitleComponent from './TitleComponent';

// update notecomponent
const NoteComponent: React.FC<{
  note: NoteItem;
  index: number;
  onUpdateNote: (
    index: number,
    field: keyof NoteItem,
    value: string | number
  ) => void;
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
  isExpanded: boolean;
}> = ({ note, index, onUpdateNote, onToggle, onDelete, isExpanded }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textareaColor = useColorModeValue('inherit', 'whiteAlpha.900');
  const textareaBorderColor = useColorModeValue('gray.200', 'gray.600');
  const textareaHoverBorderColor = useColorModeValue('gray.300', 'gray.500');

  return (
    <Box
      borderWidth={1}
      borderColor={
        note.flag === 0 ? borderColor : FLAG_SCHEMES[note.flag].color
      }
      borderRadius="md"
      p={4}
      mb={2}
      backgroundColor={bgColor}
      transition="all 0.2s"
      _hover={{ backgroundColor: hoverBgColor }}
      position="relative"
    >
      {/* Add Menu to top-right corner */}
      <Box position="absolute" top={2} right={2}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<BiDotsVerticalRounded />}
            variant="ghost"
            size="sm"
            aria-label="Note options"
          />
          <MenuList>
            <MenuItem onClick={() => onDelete(index)} color="red.500">
              Delete Note
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <TitleComponent
        title={note.title}
        isExpanded={isExpanded}
        onToggle={() => onToggle(index)}
        onUpdateTitle={(value) => onUpdateNote(index, 'title', value)}
      />
      <Collapse in={isExpanded}>
        <Box mt={4} ml="42px">
          <Textarea
            value={note.content}
            onChange={(e) => onUpdateNote(index, 'content', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="Add notes here"
            borderRadius={'none'}
            size="sm"
            fontSize={20}
            resize="none"
            minH="unset"
            overflow="hidden"
            border="none"
            borderLeftWidth={2}
            borderLeftStyle="solid"
            borderLeftColor={
              note.flag === 0 ? borderColor : FLAG_SCHEMES[note.flag].color
            }
            color={textareaColor}
            _focus={{
              boxShadow: 'none',
              borderLeftColor: textareaHoverBorderColor,
            }}
          />
        </Box>
      </Collapse>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <FlagSelector
          isVisible={isExpanded}
          currentFlag={note.flag}
          onSelectFlag={(flag) => onUpdateNote(index, 'flag', flag)}
        />
      </Box>
    </Box>
  );
};

export default NoteComponent;
