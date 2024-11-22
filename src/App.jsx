import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const apikey = "6npt4sdsw2bc";

const users = [
  {
    id: "john",
    name: "Mohammed El gargati",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
  {
    id: "johnn",
    name: "El gargati",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
];

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apikey);

      await chatClient.connectUser(
        selectedUser,
        chatClient.devToken(selectedUser.id)
      );

      const channel = chatClient.channel("messaging", "react-talk", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Talk about React",
        members: [selectedUser.id],
      });
      await channel.watch();
      setChannel(channel);
      setClient(chatClient);
    }

    init();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [selectedUser, client]);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 font-sans">
      <div className="mt-4 mb-6">
        <select
          onChange={(e) => setSelectedUser(users[e.target.value])}
          className="p-3 rounded-lg bg-white shadow-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
        >
          {users.map((user, index) => (
            <option key={user.id} value={index}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <Chat client={client} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
