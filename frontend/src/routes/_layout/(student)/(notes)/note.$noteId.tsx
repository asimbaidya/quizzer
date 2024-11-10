import { createFileRoute } from '@tanstack/react-router';
import ToggleNote from '../../../../ui/Student/note/ToggleNote';
import { useNote } from '../../../../hooks/student';
import Loading from '../../../../ui/Common/Loading';

export const Route = createFileRoute('/_layout/(student)/(notes)/note/$noteId')(
  {
    component: () => <ShowNote />,
  }
);

const ShowNote = () => {
  const { noteId } = Route.useParams();

  const { data: note, isLoading } = useNote(Number(noteId));

  if (isLoading) {
    return <Loading />;
  }

  if (!note) {
    return <Loading />;
  }
  return <ToggleNote noteId={Number(noteId)} note={note} />;
};
