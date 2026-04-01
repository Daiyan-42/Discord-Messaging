import { X, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, useApp } from "../../contexts/AppContext";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";

interface PinnedMessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToMessage: (messageId: string) => void;
  channelId: string;
}

export function PinnedMessagesPanel({
  isOpen,
  onClose,
  onJumpToMessage,
  channelId,
}: PinnedMessagesPanelProps) {
  const { messages, users } = useApp();
  const pinnedMessages = messages.filter((msg) => msg.pinned && msg.channelId === channelId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] bg-[#2b2d31] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 bg-[#2b2d31]">
              <h3 className="text-white font-semibold text-[16px]">Pinned Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-[#b5bac1] hover:text-white hover:bg-[#35363c] h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              {pinnedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                  <div className="text-[#b5bac1] text-sm">
                    <p className="font-semibold mb-2">No Pinned Messages</p>
                    <p className="text-xs text-[#949ba4]">
                      Pins are a great way to keep track of important messages!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  {pinnedMessages.map((message) => {
                    const user = users.find((u) => u.id === message.userId);
                    if (!user) return null;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-3 hover:bg-[#35363c] transition-colors border-b border-[#26272b] group"
                      >
                        <div className="flex gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold">
                                {user.displayName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-medium text-white text-sm">
                                {user.displayName}
                              </span>
                              <span className="text-xs text-[#949ba4]">
                                {formatDistanceToNow(new Date(message.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <p className="text-[#dbdee1] text-sm leading-[1.375rem] break-words">
                              {message.content}
                            </p>

                            {/* Jump Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                onJumpToMessage(message.id);
                                onClose();
                              }}
                              className="mt-2 h-7 px-3 text-xs text-[#00a8fc] hover:text-white hover:bg-[#00a8fc]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ArrowDown className="w-3 h-3 mr-1" />
                              Jump
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}