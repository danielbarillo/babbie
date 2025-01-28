import { useChat } from "../store/useStore";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Users } from "lucide-react";
import type { User } from "../types/user";

function MemberList({ members }: { members: User[] }) {
  if (members.length === 0) {
    return <div className="p-3 text-gray-400 text-center">No members</div>;
  }

  return (
    <ul className="p-3 space-y-2">
      {members.map((member) => (
        <li
          key={`member-${member._id || member.username}`}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-[#1f1f1f]"
        >
          <div className="flex-1">
            <div className="font-medium text-blue-300">{member.username}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function UserList() {
  const { currentChannel } = useChat();
  const members = currentChannel?.members || [];

  if (!currentChannel) return null;

  return (
    <div className="hidden lg:flex w-64 flex-col border-l border-[#1f1f1f] bg-[#0C0C0C]">
      <div className="p-4 flex items-center gap-2 text-gray-200">
        <Users className="h-5 w-5" />
        <h2 className="font-semibold">Members</h2>
        <span className="text-sm text-gray-400 ml-auto">
          {members.length}
        </span>
      </div>

      <Separator className="bg-[#1f1f1f]" />

      <ScrollArea className="flex-1">
        <MemberList members={members} />
      </ScrollArea>
    </div>
  );
}