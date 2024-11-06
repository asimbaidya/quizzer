import { memo } from 'react';

import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import DocumentCard from './DocumentCard';

import { NotesDocument } from '../../../core/schemas/common';

interface NoteDocumentListProps {
  documents: NotesDocument[];
  onDocumentClick: (document: NotesDocument) => void;
}

const NoteDocumentList = memo(
  ({ documents, onDocumentClick }: NoteDocumentListProps) => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    return (
      <Box bg={bgColor} p={6} minH="100vh">
        <VStack spacing={4} w="full" maxW="1200px" mx="auto" align="stretch">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id ?? doc.title}
              document={doc}
              onClick={() => onDocumentClick(doc)}
            />
          ))}
        </VStack>
      </Box>
    );
  }
);

export default NoteDocumentList;
