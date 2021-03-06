import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./components/styles/App.scss";
import Auth from "./components/Auth";
import Main from "./components/Main";

const App = () => {
  const [auth, setAuth] = useState<boolean>(false);

  const handleAuthChange = () => {
    setAuth(!auth);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/todo"
            element={<Auth auth={auth} handleAuthChange={handleAuthChange} />}
          />
          <Route
            path="/todo/main"
            element={<Main auth={auth} handleAuthChange={handleAuthChange} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
