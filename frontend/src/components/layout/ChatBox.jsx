import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Send, X } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const socket = io.connect(BACKEND_URL);

const ChatBox = ({ room, user, recipientId, closeChat }) => {
  const [msg, setMsg] = useState("");
  const [messageList, setMessageList] = useState([]);

  // 1. Join Room & Log it
  useEffect(() => {
    if (room && user) {
        console.log(`🔌 ${user.name} joining room: ${room}`); // 👈 Check Console for this!
        socket.emit("join_room", room);
    }
  }, [room, user]);

  // 2. Listen for Messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
        console.log("📩 Message received:", data); // 👈 Check if message arrives
        setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
        socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

const sendMessage = async (e) => {
    e.preventDefault();
    if (msg !== "") {
      const messageData = {
        room: room,
        author: user.name,
        message: msg,
        recipientId: recipientId, // 👈 2. Add this line!
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMsg("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col z-50 overflow-hidden font-sans">
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center shadow-md">
        <span className="font-bold text-sm">Live Support: {room.split('_')[1]?.substring(0,4)}...</span> 
        <button onClick={closeChat}><X size={18}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
         {messageList.map((m, i) => (
            <div key={i} className={`flex flex-col ${user.name === m.author ? 'items-end' : 'items-start'}`}>
               <div className={`max-w-[85%] text-sm p-3 rounded-2xl shadow-sm ${user.name === m.author ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border'}`}>
                  <p>{m.message}</p>
               </div>
               <span className="text-[10px] text-gray-400 mt-1">{m.time}</span>
            </div>
         ))}
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
        <input className="flex-1 border rounded-full px-4 py-2 text-sm outline-none" placeholder="Type a message..." value={msg} onChange={(e)=>setMsg(e.target.value)} />
        <button type="submit" disabled={!msg} className="bg-blue-600 text-white p-2 rounded-full"><Send size={18}/></button>
      </form>
    </div>
  );
};

export default ChatBox;