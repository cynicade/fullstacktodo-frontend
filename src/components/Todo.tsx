import { FormEvent, SyntheticEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPencil,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/Todo.scss";

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
    if (newBody === "") handleDelete(id);
    else if (newBody === body) return;
    else handleUpdate(id, newBody, complete);
  };

  const handleBodyChange = (e: FormEvent<HTMLInputElement>) => {
    setNewBody(e.currentTarget.value);
  };

  const editingForm = (
    <form onSubmit={handleEditSubmit}>
      <input value={newBody} onChange={handleBodyChange} autoFocus></input>
      <button type="submit">
        <FontAwesomeIcon icon={faPencil} />
      </button>
    </form>
  );

  return (
    <div className={complete ? "Todo Todo--complete" : "Todo"}>
      {editing ? (
        editingForm
      ) : (
        <>
          <p>{body}</p>
          {!complete && (
            <button onClick={handleEditClick}>
              <FontAwesomeIcon icon={faPencil} />
            </button>
          )}
          <button onClick={handleCompleteClick}>
            {complete ? (
              <FontAwesomeIcon icon={faUndo} />
            ) : (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
          <button onClick={handleDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      )}
    </div>
  );
};

export default Todo;
