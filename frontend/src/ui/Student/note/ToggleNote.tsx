import { useState, useMemo, memo, useEffect, useCallback } from 'react';
import { updateNote } from '../../../core/services/student';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { Link } from '@tanstack/react-router';

import {
  Box,
  Button,
  VStack,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { BiDotsVerticalRounded } from 'react-icons/bi';

import FlagFilter from './FlagFilter';
import NoteComponent from './NoteComponent';

import { NoteItemSchema } from '../../../core/schemas/common';

import { NoteItem, NotesDocument } from '../../../core/schemas/common';
import { deleteNote } from '../../../core/services/student';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

interface NoteItemProps {
  noteId: number;
  note: NotesDocument;
}
const ToggleNote: React.FC<NoteItemProps> = ({ noteId, note }) => {
  // delete func
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
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
      navigate({ to: '/note' });
    },
    onError: (error) => {
      showToast({
        title: 'Error deleting note',
        status: 'error',
        description: error.message,
      });
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      noteId,
      noteData,
      signal,
    }: {
      noteId: number;
      noteData: any;
      signal: AbortSignal;
    }) => updateNote(noteId, noteData, signal),
    onSuccess: () => {
      setHasChanges(false);
      setIsSaving(false);
      showToast({
        title: 'Note saved successfully',
        status: 'success',
      });
    },
    onError: (error) => {
      setIsSaving(false);
      showToast({
        title: 'Failed to save note',
        status: 'error',
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    },
  });

  const [document, setDocument] = useState<NotesDocument>({
    title: note.title,
    note_data: note.note_data,
  });
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // add beforeunload event handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        return '';
      }
    };

    // preventing reload if unchanges data are not saved yet
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  const handleAddNote = useCallback(() => {
    setDocument((prev) => ({
      ...prev,
      note_data: [...prev.note_data, NoteItemSchema.parse({})],
    }));
    setHasChanges(true);
  }, []);

  const handleToggle = useCallback((index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const handleUpdateNote = useCallback(
    (index: number, field: keyof NoteItem, value: string | number) => {
      setDocument((prev) => ({
        ...prev,
        note_data: prev.note_data.map((note, i) =>
          i === index ? { ...note, [field]: value } : note
        ),
      }));
      setHasChanges(true);
    },
    []
  );

  const handleDeleteNote = useCallback((index: number) => {
    setDocument((prev) => ({
      ...prev,
      note_data: prev.note_data.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  }, []);

  // save entire document to database
  const handleSaveDocument = async () => {
    // alert(JSON.stringify(document, null, 2));
    // alert(noteId);
    mutation.mutate({
      noteId,
      noteData: document,
      signal: new AbortController().signal,
    });
  };

  const handleDeleteDocument = () => {
    deleteMutation.mutate({
      noteId: Number(noteId),
      signal: new AbortController().signal,
    });
  };

  const filteredNotes = useMemo(() => {
    return selectedFlag === null
      ? document.note_data
      : document.note_data.filter((note) => note.flag === selectedFlag);
  }, [document.note_data, selectedFlag]);

  const containerBgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="md"
      backgroundColor={containerBgColor}
      boxShadow="lg"
    >
      {/* row 1: header with document title, menu and filter */}
      <VStack spacing={6} align="stretch">
        <HStack justify="space-around" align="center">
          <IconButton
            as={Link}
            aria-label="Back to Dashboard"
            icon={<IoArrowBackCircleSharp />}
            variant="outline"
            to="/note"
          />
          <HStack spacing={2} justify={'center'}>
            <Heading size="lg" flex={1}>
              {document.title}
            </Heading>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BiDotsVerticalRounded />}
              variant="outline"
              aria-label="Document options"
            />
            <MenuList>
              <MenuItem onClick={handleDeleteDocument} color="red.500">
                Delete Document
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {/* row 2: notes section */}
        <Box>
          <VStack align="stretch" spacing={4}>
            <FlagFilter
              selectedFlag={selectedFlag}
              onFlagSelect={setSelectedFlag}
            />
            {filteredNotes.map((note, index) => (
              <NoteComponent
                key={index}
                note={note}
                index={document.note_data.indexOf(note)}
                onUpdateNote={handleUpdateNote}
                onToggle={handleToggle}
                onDelete={handleDeleteNote}
                isExpanded={expandedIndices.includes(
                  document.note_data.indexOf(note)
                )}
              />
            ))}
            <HStack justify="flex-start" spacing={4}>
              {selectedFlag === null && (
                <Button onClick={handleAddNote} colorScheme="teal">
                  Add Note
                </Button>
              )}
              {hasChanges && (
                <Button
                  colorScheme="blue"
                  isLoading={isSaving}
                  onClick={handleSaveDocument}
                >
                  Save to Database
                </Button>
              )}
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ToggleNote;
