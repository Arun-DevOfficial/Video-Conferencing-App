import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../Context/SocketProvider";
import ReactPlayer from "react-player";
import Peer from "../Service/peer";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const socket = useSocket();
  const [RemoteSocketId, setRemoteSocketId] = useState(null);
  const [mystream, setmyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const navigate = useNavigate();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} Joined Room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Set the local stream first
      setmyStream(stream);

      // Now get the offer
      const offer = await Peer.getOffer();

      // Emit the offer to the socket
      socket.emit("user:call", { to: RemoteSocketId, offer });
    } catch (error) {
      // Handle errors, e.g., user denying access to the camera and microphone
      console.error("Error accessing media devices:", error);
    }
  }, [RemoteSocketId, socket, setmyStream]);

  const handleinCommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setmyStream(stream);
      console.log(`Incomming Call`, from, offer);
      const ans = await Peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      if (ans) {
        Peer.setLocalDescription(ans);
        console.log("Call Accepted..");
        for (const track of mystream.getTrack()) {
          Peer.peer.addTrack(track, mystream);
        }
      }
    },
    [mystream]
  );

  useEffect(() => {
    Peer.peer.addEventListener("track", async (ev) => {
      const demoStream = ev.streams;
      setRemoteStream(demoStream);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleinCommingCall);
    socket.on("call:accepted", handleCallAccepted);
    return () => {
      socket.off("user:joined", handleUserJoined); // Change from 'on' to 'off' to remove the event listener
      socket.off("incomming:call", handleinCommingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleinCommingCall, handleCallAccepted]);

  return (
    <>
      <section className="bg-gradient-to-r from-[#cdf5fd] to-[#fff] h-screen p-5">
        <div className="w-3/4 mx-auto flex justify-center items-start mt-40 gap-x-12">
          <div>
            {mystream && (
              <>
                <ReactPlayer
                  url={mystream}
                  width="1000px"
                  height="570px"
                  playing
                  muted
                  // controls="true"
                  className="w-full h-auto rounded-lg"
                />
                <h1 className="font-semibold text-md text-2xl">
                  In Call Progress
                </h1>
              </>
            )}
            {remoteStream && (
              <>
                <h1 className="font-semibold text-md">In Call Progress</h1>
                <ReactPlayer
                  url={remoteStream}
                  width="720px"
                  playing
                  muted
                  // controls={true}
                  className="w-full h-auto rounded-lg"
                />
              </>
            )}
          </div>
          <div>
            <h1 className="font-bold text-4xl">Meeting Room</h1>
            <h1 className="font-light text-md">
              {RemoteSocketId ? "Connected" : "No one in room"}
            </h1>
            {RemoteSocketId && (
              <>
                <button
                  onClick={handleCallUser}
                  className="mt-4 bg-sky-500 w-20 px-4 py-2 rounded-lg text-md font-medium text-white"
                >
                  Call
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="ml-4 mt-4 bg-red-500 w-20 px-4 py-2 rounded-lg text-md font-medium text-white"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Room;
