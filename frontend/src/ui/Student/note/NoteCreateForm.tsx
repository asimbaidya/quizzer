import {
  Button,
  Input,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createNote } from '../../../core/services/student';
import useCustomToast from '../../../hooks/useCustomToast';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NoteCreateFormData,
  NoteCreateSchema,
} from '../../../core/schemas/common';

const NoteCreateForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();

  const mutatiaon = useMutation({
    mutationFn: ({
      noteData,
      signal,
    }: {
      noteData: any;
      signal: AbortSignal;
    }) => createNote(noteData, signal),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      showToast({
        title: 'Note Created',
        description: 'Note has',
      });
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<NoteCreateFormData>({
    resolver: zodResolver(NoteCreateSchema),
    defaultValues: {
      title: 'Untitled',
      note_data: [],
    },
  });

  const onSubmit: SubmitHandler<NoteCreateFormData> = (data) => {
    mutatiaon.mutate({ noteData: data, signal: new AbortController().signal });
  };

  // open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <Box maxW="500px" mx="auto" p="4">
      <Button colorScheme="teal" onClick={openModal}>
        Create Note
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <Input id="title" {...field} />}
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>

                <ModalFooter>
                  <Button variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button colorScheme="teal" type="submit">
                    Add
                  </Button>
                </ModalFooter>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NoteCreateForm;
