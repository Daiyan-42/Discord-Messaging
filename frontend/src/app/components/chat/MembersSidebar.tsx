import { useApp } from "../../contexts/AppContext";
import { StatusIndicator } from "../common/StatusIndicator";

export function MembersSidebar() {
  const { users } = useApp();

  const onlineUsers = users.filter((u) => u.status === "online");
  const offlineUsers = users.filter((u) => u.status !== "online");

  return (
    <div className="w-60 bg-[#2b2d31] border-l border-[#1e1f22] flex-col hidden xl:flex">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-[#949ba4] uppercase tracking-wide mb-3">
          Online — {onlineUsers.length}
        </h3>
        <div className="space-y-1">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35363c] cursor-pointer transition-colors group">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-sm overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    user.displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <StatusIndicator status={user.status} size="sm" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#dbdee1] font-medium truncate group-hover:text-white transition-colors">{user.displayName}</div>
              </div>
            </div>
          ))}
        </div>

        {offlineUsers.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-[#949ba4] uppercase tracking-wide mt-6 mb-3">
              Offline — {offlineUsers.length}
            </h3>
            <div className="space-y-1">
              {offlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35363c] cursor-pointer transition-colors opacity-30 hover:opacity-50 group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <StatusIndicator status="offline" size="sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#dbdee1] font-medium truncate">{user.displayName}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}