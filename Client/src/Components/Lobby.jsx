import { useState, useRef, useEffect, useCallback } from "react";
import { useSocket } from "../Context/SocketProvider";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [room, setRoom] = useState(""); // Use useState with initial values
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();
  const roomRef = useRef(); // Use roomRef instead of roomidRef
  const emailRef = useRef(); // Use emailRef instead of passwordRef
  const [errors, setErrors] = useState({});

  //Handling Join to room
  const handleJoinRoom = useCallback((data) => {
    const { email, room } = data;
    navigate(`/room/${room}`);
  }, [navigate]);

  useEffect(() => {
    roomRef.current.focus();
    socket.on("room:join", handleJoinRoom);
  }, [socket]);

  //Form Validation
  const validation = () => {
    let newErrors = {};

    if (!room) {
      newErrors.room = "Room ID is required";
      roomRef.current.focus();
    } else if (room.length !== 10) {
      newErrors.room = "Room ID should be a 10 digit number";
      roomRef.current.focus();
    }

    if (!email) {
      newErrors.email = "Email is required"; // Updated error message
      emailRef.current.focus();
    } else if (email.length <= 8) {
      newErrors.email = "Email should be greater than 8 characters"; // Updated error message
      emailRef.current.focus();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //Handle FormSubmission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const isValid = await validation();
      if (isValid) {
        socket.emit("room:join", { email, room });
      }
    },
    [socket, room, email]
  );

  return (
    <section className="bg-[#ECECEC] w-full h-screen py-40">
      <div className="w-[450px] bg-white p-4 mx-auto rounded-lg shadow-lg">
        <img
          src="https://cdn.pixabay.com/photo/2021/03/26/21/51/video-conference-6127000_1280.jpg"
          alt="loginimage"
          className="rounded-t-lg"
        />
        <form
          action="post"
          className="flex flex-col mt-2"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-2xl font-semibold">Login</h1>

          <div className="flex flex-col">
            <label htmlFor="Roomid" className="py-3">
              Room ID
            </label>
            <input
              type="text"
              id="Roomid"
              placeholder="Room ID"
              className="py-3 rounded-lg hover:border hover:border-[#60A5FA] focus:outline-none focus:border border border-gray-300 px-3"
              onChange={(e) => setRoom(e.target.value)}
              ref={roomRef}
              value={room}
            />
            {errors.room && (
              <span
                className={`text-red-600 mt-2 text-sm ease-in-out transition-all duration-300 ${
                  errors.room ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.room}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="Email" className="py-3">
              Email
            </label>
            <input
              type="email"
              id="Email"
              placeholder="Email"
              value={email}
              className="py-3 rounded-lg hover:border hover:border-[#60A5FA] focus:outline-none focus:border border border-gray-300 px-3"
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
            />
            {errors.email && (
              <span
                className={`text-red-600 mt-2 text-sm ease-in-out transition-all duration-300 ${
                  errors.email ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex space-x-8 mt-8 mx-auto mb-2">
            <button className="rounded-md w-[100px] hover:shadow text-white text-md font-light bg-blue-400 px-4 py-2">
              Join
            </button>
            <button className="rounded-md w-[100px] hover:shadow border text-md font-light bg-px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Lobby;
