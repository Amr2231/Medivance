"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  staggerContainer,
  staggerItem,
  activeIndicatorTransition,
  springSnappy,
  overlayFade,
  pressable,
} from "@/lib/motion/variants";
import {
  DoctorLoadingState,
  DoctorPageShell,
  TableToolbar,
} from "../shared/ui";
import {
  useChatInbox,
  useConversation,
  useSendMessage,
} from "../../hooks/use-chat";
import { searchChatUsersAction } from "../../actions/chat.actions";

// types
type ChatPeer = {
  user_id: number;
  name: string;
  role_name: string;
};

// role -> avatar color, matches the same palette used across the admin
// users table so a person's role reads the same everywhere in the app
const ROLE_AVATAR_STYLES: Record<string, string> = {
  Doctor:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Admin:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Receptionist: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "?";
}

function PeerAvatar({
  name,
  role,
  size = "md",
}: {
  name: string;
  role: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? "h-14 w-14 text-base"
      : size === "sm"
        ? "h-8 w-8 text-[10px]"
        : "h-9 w-9 text-xs";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        dims,
        ROLE_AVATAR_STYLES[role] ??
          "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400",
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

// chat page
export function ChatPage() {
  // hooks
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<ChatPeer | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const { data: inboxData, isLoading } = useChatInbox();
  const { data: usersData } = useQuery({
    queryKey: ["chat-users", userSearch],
    queryFn: () => searchChatUsersAction(userSearch),
    enabled: showUserPicker,
  });
  // queries & mutations
  const { data: convData } = useConversation(selectedUserId ?? 0);
  const { mutate: send, isPending } = useSendMessage();

  const inbox = useMemo(() => inboxData?.data ?? [], [inboxData?.data]);
  const messages = useMemo(() => convData?.data ?? [], [convData?.data]);
  const currentUserId = Number(session?.user?.id ?? 0);

  const filteredInbox = useMemo(() => {
    if (!search.trim()) return inbox;
    const q = search.toLowerCase();
    return inbox.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role_name.toLowerCase().includes(q) ||
        c.last_message.toLowerCase().includes(q),
    );
  }, [inbox, search]);

  const selected =
    inbox.find((c) => c.user_id === selectedUserId) ??
    (selectedPeer?.user_id === selectedUserId ? selectedPeer : null);
  const selectedUnreadCount =
    selected &&
    "unread_count" in selected &&
    typeof selected.unread_count === "number"
      ? selected.unread_count
      : 0;

  // real, derived-from-loaded-messages stats for the info panel — nothing
  // fabricated, just a summary of what's already fetched for this thread
  const conversationStats = useMemo(() => {
    if (messages.length === 0) return null;
    const sorted = [...messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    return {
      total: messages.length,
      firstMessageAt: sorted[0].created_at,
    };
  }, [messages]);

  const selectUser = (peer: ChatPeer) => {
    setSelectedUserId(peer.user_id);
    setSelectedPeer(peer);
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedUserId) return;
    send(
      { receiver_id: selectedUserId, message: draft.trim() },
      { onSuccess: () => setDraft("") },
    );
  };

  if (isLoading) return <DoctorLoadingState />;

  return (
    <DoctorPageShell
      title="Internal Chat"
      description="Secure messaging with staff and radiology"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_260px] gap-4 h-[calc(100vh-220px)] min-h-125">
        {/* Sidebar */}
        <aside
          className={cn(
            "rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 flex-col overflow-hidden",
            selectedUserId ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="p-3 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
            <div className="flex-1">
              <TableToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search conversations..."
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 dark:border-white/10 dark:hover:bg-white/5"
              onClick={() => setShowUserPicker((v) => !v)}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {showUserPicker && (
              <motion.div
                variants={overlayFade}
                initial="hidden"
                animate="show"
                exit="exit"
                className="p-3 border-b border-gray-100 dark:border-white/10 space-y-2 overflow-hidden"
              >
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, or username..."
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {(usersData?.data ?? []).map((user) => (
                    <button
                      key={user.user_id}
                      type="button"
                      className="w-full flex items-center gap-2 text-left px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                      onClick={() => {
                        selectUser({
                          user_id: user.user_id,
                          name: `${user.first_name} ${user.last_name}`,
                          role_name: user.role_name,
                        });
                        setShowUserPicker(false);
                        setUserSearch("");
                      }}
                    >
                      <PeerAvatar
                        name={`${user.first_name} ${user.last_name}`}
                        role={user.role_name}
                        size="sm"
                      />
                      <span>
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {user.role_name} · {user.email}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto">
            {filteredInbox.length === 0 && !search.trim() ? (
              <EmptyState
                icon={MessageSquare}
                title="No conversations yet"
                description="Your chat history will appear here once other staff members message you."
                className="h-full"
              />
            ) : filteredInbox.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={MessageSquare}
                  title="No results"
                  description={`No conversations matching "${search}"`}
                />
              </div>
            ) : (
              <motion.div
                variants={staggerContainer(0.04)}
                initial="hidden"
                animate="show"
              >
                {filteredInbox.map((item) => {
                  const isActive = selectedUserId === item.user_id;
                  return (
                    <motion.button
                      key={item.user_id}
                      type="button"
                      variants={staggerItem}
                      whileHover={{ x: 2 }}
                      onClick={() =>
                        selectUser({
                          user_id: item.user_id,
                          name: item.name,
                          role_name: item.role_name,
                        })
                      }
                      className={cn(
                        "relative w-full text-left px-4 py-3 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                        isActive && "bg-emerald-600/5 dark:bg-emerald-600/10",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="chat-inbox-active-indicator"
                          transition={activeIndicatorTransition}
                          className="absolute inset-y-0 start-0 w-0.5 bg-emerald-600"
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <PeerAvatar name={item.name} role={item.role_name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                              {item.name}
                            </p>
                            <AnimatePresence>
                              {item.unread_count > 0 && (
                                <motion.span
                                  key="unread"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={springSnappy}
                                  className="shrink-0 text-[10px] font-bold bg-emerald-600 text-white rounded-full px-1.5 py-0.5 shadow-glow-sm"
                                >
                                  {item.unread_count}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                            {item.role_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {item.last_message}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </aside>

        {/* Chat section */}
        <section
          className={cn(
            "rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 flex-col overflow-hidden",
            selectedUserId ? "flex" : "hidden lg:flex",
          )}
        >
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a colleague from the inbox or start a new chat."
              />
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.header
                  key={selectedUserId}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center gap-2 px-3 py-3 border-b border-gray-100 dark:border-white/10"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 lg:hidden dark:hover:bg-white/5"
                    onClick={() => setSelectedUserId(0)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  {selected && (
                    <PeerAvatar
                      name={selected.name}
                      role={selected.role_name}
                      size="sm"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {selected?.name ?? "Conversation"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selected?.role_name ?? ""}
                    </p>
                  </div>
                </motion.header>
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No messages yet. Say hello to start the conversation.
                  </p>
                ) : (
                  <AnimatePresence initial={false} mode="popLayout">
                    {messages.map((msg) => {
                      const isMine = msg.sender_id === currentUserId;
                      return (
                        <motion.div
                          key={msg.message_id}
                          layout
                          initial={{
                            opacity: 0,
                            y: 8,
                            x: isMine ? 16 : -16,
                            scale: 0.96,
                          }}
                          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                          transition={springSnappy}
                          className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                              isMine
                                ? "bg-emerald-600 text-white rounded-br-sm shadow-glow-sm"
                                : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-bl-sm",
                            )}
                          >
                            {!isMine && (
                              <p className="text-[10px] font-medium opacity-70 mb-0.5">
                                {msg.sender_name}
                              </p>
                            )}
                            <p>{msg.message}</p>
                            <p
                              className={cn(
                                "text-[10px] mt-1",
                                isMine ? "text-white/70" : "text-gray-400",
                              )}
                            >
                              {formatFullTimestamp(msg.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              <footer className="p-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 dark:hover:bg-white/5"
                  disabled
                  title="Attachments UI (backend pending)"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), handleSend())
                  }
                />
                <motion.div {...pressable} className="shrink-0">
                  <Button
                    onClick={handleSend}
                    disabled={isPending || !draft.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </footer>
            </>
          )}
        </section>

        {/* Conversation info — real summary of the open thread, no fabricated
            "linked patient" panel since chat isn't tied to a patient record */}
        <aside
          className={cn(
            "hidden lg:flex flex-col rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 overflow-hidden",
          )}
        >
          {!selectedUserId || !selected ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-gray-400">
              Select a conversation to see details
            </div>
          ) : (
            <div className="p-5 flex flex-col items-center text-center gap-2 border-b border-gray-100 dark:border-white/10">
              <PeerAvatar
                name={selected.name}
                role={selected.role_name}
                size="lg"
              />
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {selected.name}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700">
                {selected.role_name}
              </span>
            </div>
          )}

          {selectedUserId && selected && (
            <div className="p-5 space-y-4 text-sm">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Messages
                </p>
                <p className="text-gray-800 dark:text-gray-200 tabular-nums">
                  {conversationStats?.total ?? 0} in this thread
                </p>
              </div>
              {conversationStats && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Started
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {formatFullTimestamp(conversationStats.firstMessageAt)}
                  </p>
                </div>
              )}
              {selectedUnreadCount > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Unread
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {selectedUnreadCount} unread message
                    {selectedUnreadCount > 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </DoctorPageShell>
  );
}
