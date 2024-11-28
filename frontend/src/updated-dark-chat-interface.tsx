import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Hash, Lock, MessageSquare, Send, Users } from "lucide-react"

export default function Component() {
  return (
    <div className="flex h-screen bg-[#0C0C0C] text-gray-200">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-[#1f1f1f] bg-[#0C0C0C]">
        <div className="p-4 font-semibold text-lg text-gray-200">Chappy</div>
        <Separator className="bg-[#1f1f1f]" />
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-400 px-2">Kanaler</div>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-[#1f1f1f]">
                <Hash className="h-4 w-4" />
                koda
                <span className="ml-auto bg-[#1f1f1f] text-gray-300 rounded-full px-2 py-0.5 text-xs">3</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-[#1f1f1f]">
                <MessageSquare className="h-4 w-4" />
                random
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-[#1f1f1f]">
                <Lock className="h-4 w-4" />
                grupp1
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 bg-[#1f1f1f] text-gray-200 hover:bg-[#2a2a2a]">
                <Users className="h-4 w-4" />
                grupp2
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-[#1f1f1f]">
                <Lock className="h-4 w-4" />
                grupp3
              </Button>
            </div>
            <Separator className="bg-[#1f1f1f]" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-400 px-2">DM</div>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-[#1f1f1f]">PratgladPelle</Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-[#1f1f1f]">SocialaSara</Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-[#1f1f1f]">TrevligaTommy</Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-[#1f1f1f]">VänligaVera</Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-[#1f1f1f]">GladaGustav</Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0C0C0C]">
        {/* Header */}
        <div className="border-b border-[#1f1f1f] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-200">
            <Users className="h-5 w-5" />
            <span className="font-medium">grupp2</span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#1f1f1f] hover:text-gray-100">
            Logga ut
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <Card className="p-4 max-w-md bg-[#1a2733] border-[#1f1f1f]">
              <div className="flex justify-between items-start gap-2">
                <div className="font-medium text-blue-300">VänligaVera</div>
                <div className="text-xs text-gray-400">17:46</div>
              </div>
              <div className="text-gray-200">hejsan</div>
            </Card>

            <Card className="p-4 max-w-md bg-[#1f2d33] border-[#1f1f1f] ml-auto">
              <div className="flex justify-between items-start gap-2">
                <div className="font-medium text-green-300">MunterMoa</div>
                <div className="text-xs text-gray-400">17:47</div>
              </div>
              <div className="text-gray-200">tjena!</div>
            </Card>

            <Card className="p-4 max-w-md bg-[#2d2633] border-[#1f1f1f]">
              <div className="flex justify-between items-start gap-2">
                <div className="font-medium text-purple-300">GladaGustav</div>
                <div className="text-xs text-gray-400">17:48</div>
              </div>
              <div className="text-gray-200">hallå!</div>
            </Card>
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-[#1f1f1f] p-4">
          <form className="flex gap-2">
            <Input 
              placeholder="Skriv ett meddelande..." 
              className="flex-1 bg-[#141414] border-[#1f1f1f] text-gray-200 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500"
            />
            <Button type="submit" className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-200">
              <Send className="h-4 w-4" />
              <span className="sr-only">Skicka</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}