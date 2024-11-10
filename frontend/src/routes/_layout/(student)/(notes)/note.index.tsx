import { createFileRoute } from '@tanstack/react-router';
import NoteDocumentList from '../../../../ui/Student/note/NoteDocumentList';
import { useNotes } from '../../../../hooks/student';
import { VStack } from '@chakra-ui/react';
import Loading from '../../../../ui/Common/Loading';
import NoteCreateForm from '../../../../ui/Student/note/NoteCreateForm';

export const Route = createFileRoute('/_layout/(student)/(notes)/note/')({
  component: () => <Wrapper />,
});

const Wrapper = () => {
  const { data: notes, isLoading } = useNotes();

  // console.log(notes);
  if (notes === undefined) {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

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
