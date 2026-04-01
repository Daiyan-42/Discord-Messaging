import { Users, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center bg-[#313338]">
      <div className="w-24 h-24 rounded-full bg-[#5865f2] flex items-center justify-center mb-6">
        <MessageCircle className="w-12 h-12 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-3">
        Welcome to Discord!
      </h1>
      
      <p className="text-[#b5bac1] max-w-md mb-8">
        Select a server from the sidebar to start chatting with your friends and communities.
      </p>

      <div className="flex gap-3">
        <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white">
          <Users className="w-4 h-4 mr-2" />
          Find a Server
        </Button>
        <Button variant="outline" className="border-[#3f4147] text-[#dbdee1] hover:bg-[#35363c] bg-[#2b2d31]">
          Create My Own
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#2b2d31] flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Instant Messaging</h3>
          <p className="text-sm text-[#949ba4]">Chat in real-time with friends</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#2b2d31] flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎮</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Communities</h3>
          <p className="text-sm text-[#949ba4]">Join servers and channels</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#2b2d31] flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Rich Features</h3>
          <p className="text-sm text-[#949ba4]">Reactions, pins, and more</p>
        </div>
      </div>
    </div>
  );
}