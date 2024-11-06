import { createFileRoute } from '@tanstack/react-router';
import NoteDocumentList from '../../../../ui/Student/note/NoteDocumentList';
import { useNotes } from '../../../../hooks/student';
import { VStack } from '@chakra-ui/react';
export const Route = createFileRoute('/_layout/(student)/(notes)/note/')({
  component: () => <Wrapper />,
});
import NoteCreateForm from '../../../../ui/Student/note/NoteCreateForm';

const Wrapper = () => {
  const { data: notes, isLoading } = useNotes();

  console.log(notes);
  if (notes === undefined) return <div>Loading...</div>;

  return (
    <>
      <VStack>
        <NoteCreateForm />
        {isLoading ? (
          <div>Loading...</div>
        ) : notes.length == 0 ? (
          <div>No notes found Create New Notes</div>
        ) : (
          <NoteDocumentList documents={notes} onDocumentClick={() => {}} />
        )}
      </VStack>
    </>
  );
};
