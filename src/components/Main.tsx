import { useEffect, useState } from "react";
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
  creating?: boolean;
};

const Main = ({ auth, handleAuthChange }: IProps): JSX.Element => {
  const [todos, setTodos] = useState<Array<TodoT>>([]);
  const [addingTodo, setAddingTodo] = useState<boolean>(false);
  const navigate = useNavigate();

  const sortTodos = (ts: Array<TodoT>): Array<TodoT> => {
    let uncompletedTodos: Array<TodoT> = [];
    let completedTodos: Array<TodoT> = [];
    ts.forEach((t: TodoT) => {
      t.complete ? completedTodos.push(t) : uncompletedTodos.push(t);
    });

    uncompletedTodos.sort((a: TodoT, b: TodoT) => {
      const a_date: Date = new Date(a.created);
      const b_date: Date = new Date(b.created);
      return b_date.getTime() - a_date.getTime();
    });

    completedTodos.sort((a: TodoT, b: TodoT) => {
      const a_date: Date = new Date(a.created);
      const b_date: Date = new Date(b.created);
      return b_date.getTime() - a_date.getTime();
    });

    return uncompletedTodos.concat(completedTodos);
  };

  const getTodos = async () => {
    // const res = await fetch("https://cynicade.xyz/todo/api/todos", {
      const res = await fetch("http://localhost:3001/todo/api/todos", {
      credentials: "include",
    });

    const data = await res.json();
    setTodos(sortTodos(data.todos));
  };

  useEffect(() => {
    if (!auth) return navigate("/todo");
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, navigate]);

  const addTodo = () => {
    const temp: Array<TodoT> = [...todos];
    const date = new Date();
    const newTodo: TodoT = {
      body: "",
      complete: false,
      created: date.toString(),
      updated: date.toString(),
      id: -1,
      creating: true,
    };
    temp.unshift(newTodo);
    setTodos(temp);
    setAddingTodo(true);
  };

  const handleCreate = async (body: string) => {
    // const res = await fetch("https://cynicade.xyz/todo/api/new", {
      const res = await fetch("http://localhost:3001/todo/api/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        body,
        complete: "false",
      }),
    });

    const data = await res.json();
    const idx = todos.map((t: TodoT) => t.id).indexOf(-1);
    const temp = [...todos];
    temp[idx].body = body;
    temp[idx].id = data.todo.id;
    temp[idx].creating = false;
    setTodos(temp);
    setAddingTodo(false);
  };

  const handleDelete = (id: number) => {
    if (id !== -1) {
      // fetch(`https://cynicade.xyz/todo/api/todo/${id}`, {
        fetch(`http://localhost:3001/todo/api/todo/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }
    setTodos(todos.filter((t: TodoT) => t.id !== id));
  };

  const handleUpdate = (id: number, body: string, complete: boolean) => {
    // fetch(`https://cynicade.xyz/todo/api/todo/${id}`, {
      fetch(`http://localhost:3001/todo/api/todo/${id}`, {
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

    const idx = todos.map((t: TodoT) => t.id).indexOf(id);
    const temp = [...todos];
    temp[idx].body = body;
    temp[idx].complete = complete;
    setTodos(sortTodos(temp));
  };

  const handleLogout = () => {
    // fetch("https://cynicade.xyz/todo/api/logout", {
      fetch("http://localhost:3001/todo/api/logout", {
      credentials: "include",
    });

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
        <h1>Hello! Here is your list:</h1>
        <ul>
          {todos.map(todo => (
            <motion.li
              key={todo.id}
              initial={todo.creating && { y: -50 }}
              animate={{ y: 0 }}
            >
              <Todo
                body={todo.body}
                complete={todo.complete}
                id={todo.id}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                handleCreate={handleCreate}
                create={todo.creating || false}
              />
            </motion.li>
          ))}
        </ul>
        {!addingTodo && (
          <motion.button
            onClick={addTodo}
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
