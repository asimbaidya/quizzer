import { createFileRoute } from '@tanstack/react-router';
import ToggleNote from '../../../../ui/Student/note/ToggleNote';
import { useNote } from '../../../../hooks/student';

export const Route = createFileRoute('/_layout/(student)/(notes)/note/$noteId')(
  {
    component: () => <ShowNote />,
  }
);

const ShowNote = () => {
  const { noteId } = Route.useParams();

  const { data: note } = useNote(Number(noteId));
  console.log(note);

  if (!note) {
    return <div>Loading...</div>;
  } else {
    console.log('note', note);
  }
  return <ToggleNote noteId={Number(noteId)} note={note} />;
};
