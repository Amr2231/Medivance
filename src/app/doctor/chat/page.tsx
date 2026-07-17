import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for chat page
export const metadata = {
  title: "Chat | Medivance",
  description: "Communicate with your patients and colleagues in real-time",
};

// dynamically import the ChatPage component with a loading state
const ChatPage = dynamic(
  () =>
    import("@/features/doctor/components/chat/chat-page").then(
      (m) => m.ChatPage,
    ),
  { loading: () => <PulseLoader /> },
);

// Chat Page
export default function Page() {
  return <ChatPage />;
}
