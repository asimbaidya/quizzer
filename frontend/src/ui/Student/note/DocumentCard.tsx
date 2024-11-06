import {
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Button,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';

import { memo, useMemo } from 'react';
import { deleteNote } from '../../../core/services/student';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { useQueryClient } from '@tanstack/react-query';

import { Link } from '@tanstack/react-router';

import { NotesDocument } from '../../../core/schemas/common';

interface DocumentCardProps {
  document: NotesDocument;
  onClick: () => void;
}

const DocumentCard = memo(({ document, onClick }: DocumentCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ noteId, signal }: { noteId: number; signal: AbortSignal }) =>
      deleteNote(noteId, signal),
    onSuccess: () => {
      showToast({
        title: 'Note deleted',
        status: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
    onError: (error) => {
      showToast({
        title: 'Error deleting note',
        status: 'error',
        description: error.message,
      });
    },
  });

  const stats = useMemo(() => {
    const flagCounts = document.note_data.reduce(
      (acc, note) => {
        if (note.flag > 0) {
          acc.flagged++;
          acc.counts[note.flag] = (acc.counts[note.flag] || 0) + 1;
        }
        return acc;
      },
      { flagged: 0, counts: {} as Record<number, number> }
    );

    return {
      total: document.note_data.length,
      ...flagCounts,
    };
  }, [document.note_data]);

  const handleDelete = async () => {
    mutation.mutate({
      noteId: Number(document.id),
      signal: new AbortController().signal,
    });
  };

  return (
    <Grid
      templateColumns="5fr 1fr"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'lg',
      }}
      gap={4}
    >
      <GridItem>
        <VStack align="stretch" spacing={2}>
          <Heading size="md" noOfLines={1}>
            {document.title}
          </Heading>
          <HStack spacing={2}>
            <Badge colorScheme="blue">{stats.total} notes</Badge>
            {document.updated_at ? (
              <Badge colorScheme="green">
                Updated: {new Date(document.updated_at).toLocaleDateString()}
              </Badge>
            ) : (
              <Badge colorScheme="purple">New</Badge>
            )}
            {stats.flagged > 0 && (
              <Badge colorScheme="red">{stats.flagged} flagged</Badge>
            )}
          </HStack>
        </VStack>
      </GridItem>

      <GridItem display="flex" alignItems="center" justifyContent="center">
        <HStack spacing={2}>
          <Button
            as={Link}
            colorScheme="teal"
            size="md"
            onClick={onClick}
            w="full"
            maxW="100px"
            to={document.url}
          >
            Visit Note
          </Button>
          <Button
            colorScheme="red"
            size="md"
            onClick={handleDelete}
            w="full"
            maxW="100px"
          >
            Delete
          </Button>
        </HStack>
      </GridItem>
    </Grid>
  );
});

export default DocumentCard;
