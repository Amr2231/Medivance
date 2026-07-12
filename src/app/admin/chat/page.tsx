import { ChatPage } from "@/features/doctor/components/chat/chat-page";

// metadata for admin chat page
export const metadata = {
  title: "Chat | Medivance",
  description: "Communicate with your patients and colleagues in real-time",
};

// Admin Chat Page
export default function AdminChatPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <ChatPage />
    </div>
  );
}
