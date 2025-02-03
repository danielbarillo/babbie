import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { MemberList } from "./UserList";
import { Loader2 } from "lucide-react";
import type { User } from "../types/user";

interface UserListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  isLoading?: boolean;
}

export function UserListDialog({ isOpen, onClose, members, isLoading }: UserListDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Channel Members</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <MemberList members={members} showDirectMessageButton />
        )}
      </DialogContent>
    </Dialog>
  );
} 