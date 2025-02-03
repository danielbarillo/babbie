import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import type { Channel } from "../types/channel";
import axios from "axios";

export default function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching channels with token:", token);

        const response = await axios.get("/api/channels", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            : {},
        });

        console.log("Channels response:", response.data);
        setChannels(response.data);
      } catch (error) {
        console.error("Error fetching channels:", error);
        setError("Failed to load channels");
      } finally {
        setIsLoading(false);
      }
    };

    console.log("Channel ID before API call:", channelId);
    fetchChannels();

    // Listen for channel updates via WebSocket
    if (socket) {
      socket.on("channel_updated", fetchChannels);
      socket.on("channel_created", fetchChannels);
      socket.on("channel_deleted", fetchChannels);

      return () => {
        socket.off("channel_updated");
        socket.off("channel_created");
        socket.off("channel_deleted");
      };
    }
  }, [socket, token]);

  const handleChannelClick = (channel) => {
    console.log("Channel:", channel);
    setCurrentChannel(channel);
    navigate(`/channels/${channel}`);
  };

  if (isLoading) {
    return <div>Loading channels...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (channels.length === 0) {
    return <div>No channels available</div>;
  }

  return (
    <div className="channels-container">
      <h2>Channels</h2>
      <ul className="channel-list">
        {channels.map((channel) => (
          <li
            key={channel._id}
            className="channel-item"
            onClick={() => handleChannelClick(channel._id)}
          >
            <span className="channel-name">{channel.name}</span>
            {channel.isPrivate && (
              <span className="private-badge">Private</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
