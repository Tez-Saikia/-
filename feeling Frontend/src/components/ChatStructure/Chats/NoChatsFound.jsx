import { MessageCircleIcon } from "lucide-react";

function NoChatsFound() {

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">No conversations yet</h4>
        <p className="text-slate-400 text-sm px-6">
         You can reply once a user messages you.
        </p>
      </div>
    </div>
  );
}
export default NoChatsFound;