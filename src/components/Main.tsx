import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
  created: string;
  updated: string;
};

const Main = ({ auth, handleAuthChange }: IProps) => {
  const [todos, setTodos] = useState<Array<TodoT>>([]);
  const [addingTodo, setAddingTodo] = useState<boolean>(false);
  const [tempBody, setTempBody] = useState<string>("");
  const navigate = useNavigate();

  const getTodos = async () => {
    const res = await fetch("http://cynicade.xyz/todo/api/todos", {
      // const res = await fetch("http://localhost:3001/todo/api/todos", {
      credentials: "include",
    });

    const data = await res.json();
    let uncompletedTodos: Array<TodoT> = [];
    let completedTodos: Array<TodoT> = [];
    data.todos.forEach((t: TodoT) => {
      t.complete ? completedTodos.push(t) : uncompletedTodos.push(t);
    });
    uncompletedTodos.sort((a: TodoT, b: TodoT) => {
      const a_date: Date = new Date(a.created);
      const b_date: Date = new Date(b.created);
      return b_date.getTime() - a_date.getTime();
    });
    setTodos(uncompletedTodos.concat(completedTodos));
  };

  useEffect(() => {
    if (!auth) return navigate("/todo");
    getTodos();
  }, [auth, navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (tempBody === "") {
      setAddingTodo(false);
      return;
    }

    const res = await fetch("http://cynicade.xyz/todo/api/new", {
      // const res = await fetch("http://localhost:3001/todo/api/new", {
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
    const res = await fetch(`http://cynicade.xyz/todo/api/todo/${id}`, {
      // const res = await fetch(`http://localhost:3001/todo/api/todo/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    setTodos(todos.filter((t: TodoT) => t.id !== id));
    // getTodos();
  };

  const handleUpdate = async (id: number, body: string, complete: boolean) => {
    const res = await fetch(`http://cynicade.xyz/todo/api/todo/${id}`, {
      // const res = await fetch(`http://localhost:3001/todo/api/todo/${id}`, {
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

    // const idx = todos.map((t: TodoT) => t.id).indexOf(id);
    // const temp = todos;
    // temp[idx].body = body;
    // temp[idx].complete = complete;
    // setTodos(temp);
    // console.log(todos[idx]);

    const data = await res.json();
    console.log(data);
    getTodos();
  };

  const handleLogout = async () => {
    const res = await fetch("http://cynicade.xyz/todo/api/logout", {
      // const res = await fetch("http://localhost:3001/todo/api/logout", {
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    handleAuthChange();
    return navigate("/todo");
  };

  return (
    <>
      <button className="Logout" onClick={handleLogout}>
        Logout
      </button>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="Main"
      >
        <ul>
          {addingTodo && (
            <motion.li initial={{ y: -100 }} animate={{ y: 0 }}>
              <form onSubmit={handleSubmit}>
                <input
                  value={tempBody}
                  onChange={handleChange}
                  autoFocus
                ></input>
              </form>
            </motion.li>
          )}
          {todos.map(todo => (
            <motion.li key={todo.id} exit={{ scale: 0 }}>
              <Todo
                body={todo.body}
                complete={todo.complete}
                id={todo.id}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            </motion.li>
          ))}
        </ul>
        {!addingTodo && (
          <motion.button
            onClick={() => setAddingTodo(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="Main--AddButton"
          >
            <FontAwesomeIcon icon={faPlus} />
          </motion.button>
        )}
      </motion.div>
    </>
  );
};

export default Main;
