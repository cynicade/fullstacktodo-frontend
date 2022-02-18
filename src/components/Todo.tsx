import { FormEvent, SyntheticEvent, useState } from "react";

interface IProps {
  body: string;
  complete: boolean;
  id: number;
  handleDelete: (id: number) => void;
  handleUpdate: (id: number, body: string, complete: boolean) => void;
}

const Todo = ({ body, complete, id, handleDelete, handleUpdate }: IProps) => {
  const [editing, setEditing] = useState(false);
  const [newBody, setNewBody] = useState(body);

  const handleDeleteClick = () => {
    handleDelete(id);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCompleteClick = () => {
    handleUpdate(id, body, !complete);
  };

  const handleEditSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setEditing(false);
    newBody === "" ? handleDelete(id) : handleUpdate(id, newBody, complete);
  };

  const handleBodyChange = (e: FormEvent<HTMLInputElement>) => {
    setNewBody(e.currentTarget.value);
  };

  const editingForm = (
    <form onSubmit={handleEditSubmit}>
      <input value={newBody} onChange={handleBodyChange} autoFocus></input>
      <button type="submit">Done</button>
    </form>
  );

  return (
    <div>
      {editing ? editingForm : body}
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleCompleteClick}>Complete</button>
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default Todo;
