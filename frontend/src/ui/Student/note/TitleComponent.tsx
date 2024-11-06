import { useState, memo, useCallback } from 'react';

import { Box, Textarea, IconButton, Text } from '@chakra-ui/react';
import { IoCaretForwardSharp, IoCaretDownSharp } from 'react-icons/io5';

// create the titlecomponent
const TitleComponent = memo(
  ({
    title,
    isExpanded,
    onToggle,
    onUpdateTitle,
  }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    onUpdateTitle: (value: string) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsEditing(false);
      }
    }, []);

    return (
      <Box
        display="flex"
        alignItems="center"
        cursor="pointer"
        onClick={() => !isEditing && onToggle()}
        onDoubleClick={() => setIsEditing(true)}
      >
        <IconButton
          aria-label="Toggle Note"
          icon={isExpanded ? <IoCaretDownSharp /> : <IoCaretForwardSharp />}
          variant="ghost"
          size="sm"
          mr={2}
        />
        {isEditing ? (
          <Textarea
            value={title}
            autoFocus
            onBlur={() => setIsEditing(false)}
            onChange={(e) => onUpdateTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="unstyled"
            placeholder="Note Title"
            size="lg"
            resize="none"
            minH="unset"
            overflow="hidden"
            _focus={{ boxShadow: 'none', borderColor: 'gray.300' }}
            fontSize="xl"
            fontWeight="bold"
          />
        ) : (
          <Text fontSize="26" fontWeight="bold">
            {title}
          </Text>
        )}
      </Box>
    );
  }
);

export default TitleComponent;
