import { Routes, Route } from "react-router-dom";
import Lobby from "./Components/Lobby";
import Room from "./Components/Room";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Lobby} />
        <Route path="/room/:roomid" Component={Room} />
      </Routes>
    </>
  );
}

export default App;
