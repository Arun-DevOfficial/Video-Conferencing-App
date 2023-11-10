import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../Context/SocketProvider";

const Room = () => {
  const [RemoteSocketId, setRemoteSocketId] = useState(null);
  const socket = useSocket();

  const handleUserJoined = useCallback((email) => {
    console.log(`${email} Joined Room`);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    return () => {
      socket.off("user:joined", handleUserJoined); // Change from 'on' to 'off' to remove the event listener
    };
  }, [socket, handleUserJoined]);

  return (
    <>
      <section>
        <div>
          <h1>Room page</h1>
          <h1>{RemoteSocketId ? "Connected" : "No one in room"}</h1>
        </div>
      </section>
    </>
  );
};

export default Room;
