import { Routes, Route } from "react-router-dom";
import Lobby from "./Components/Lobby";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Lobby} />
      </Routes>
    </>
  );
}

export default App;
