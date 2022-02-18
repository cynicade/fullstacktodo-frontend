import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Todo from "./Todo";
import "./styles/Main.scss";
import { motion } from "framer-motion";

interface IProps {
  auth: boolean;
  handleAuthChange: () => void;
}

type TodoT = {
  body: string;
  complete: boolean;
  id: number;
};

const Main = ({ auth, handleAuthChange }: IProps) => {
  const [todos, setTodos] = useState<Array<TodoT>>([]);
  const [addingTodo, setAddingTodo] = useState<boolean>(false);
  const [tempBody, setTempBody] = useState<string>("");
  const navigate = useNavigate();

  const getTodos = async () => {
    const res = await fetch("http://localhost:3001/todos", {
      credentials: "include",
    });

    const data = await res.json();
    setTodos(data.todos);
  };

  useEffect(() => {
    if (!auth) return navigate("/");
    getTodos();
  }, [auth, navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        body: tempBody,
        complete: "false",
      }),
    });

    const data = await res.json();
    console.log(data);
    setTempBody("");
    setAddingTodo(false);
    getTodos();
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setTempBody(e.currentTarget.value);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:3001/todo/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    getTodos();
  };

  const handleUpdate = async (id: number, body: string, complete: boolean) => {
    const res = await fetch(`http://localhost:3001/todo/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        body: body,
        complete: complete ? "true" : "false",
      }),
    });

    const data = await res.json();
    console.log(data);
    getTodos();
  };

  const handleLogout = async () => {
    const res = await fetch("http://localhost:3001/logout", {
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    handleAuthChange();
    return navigate("/");
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <Todo
              body={todo.body}
              complete={todo.complete}
              id={todo.id}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          </li>
        ))}
        {addingTodo && (
          <li>
            <form onSubmit={handleSubmit}>
              <input value={tempBody} onChange={handleChange} autoFocus></input>
            </form>
          </li>
        )}
      </ul>
      <button onClick={() => setAddingTodo(true)}>Add</button>
      <button onClick={handleLogout}>Logout</button>
    </motion.div>
  );
};

export default Main;
