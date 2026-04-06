import { useState } from "react";
import { mockMembers, mockUpdates } from "../data/mockData";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Heart,
  MessageCircle,
  Mic,
  TrendingUp,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export function Updates() {
  const [rawInput, setRawInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUpdate, setGeneratedUpdate] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);

  const handleGenerateUpdate = () => {
    if (!rawInput.trim()) {
      toast.error("Please enter some information first");
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const generated = `Today brought meaningful progress in Sarah's recovery journey. ${rawInput.trim()} The medical team continues to monitor closely, and spirits remain positive. Thank you all for your continued support and encouraging messages—they mean the world to the entire family.`;
      setGeneratedUpdate(generated);
      setIsGenerating(false);
      toast.success("Update composed by AI");
    }, 2000);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording started (simulated)");
      setTimeout(() => {
        setRawInput(
          "She had a good morning. Physical therapy went well. Pain levels are manageable. Visitors helped lift her spirits.",
        );
        setIsRecording(false);
        toast.success("Voice input captured");
      }, 3000);
    } else {
      toast.info("Recording stopped");
    }
  };

  const handlePostUpdate = () => {
    if (!generatedUpdate) {
      toast.error("Please generate an update first");
      return;
    }
    toast.success("Update posted to the circle");
    setRawInput("");
    setGeneratedUpdate("");
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case "heart":
        return "❤️";
      case "pray":
        return "🙏";
      case "hug":
        return "🤗";
      case "strength":
        return "💪";
      default:
        return "👍";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Daily Updates</h1>
          <p className="text-gray-600">
            Share progress and keep everyone informed
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Create Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Daily Update</DialogTitle>
              <DialogDescription>
                Share information about today. AI will help compose a thoughtful
                update for the circle.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={inputMode}
              onValueChange={(v) => setInputMode(v as "text" | "voice")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="voice">Voice Input</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Raw Notes</label>
                  <Textarea
                    placeholder="Enter quick notes... e.g., 'Good day. PT session went well. Less pain today. Ate full meals.'"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Just jot down the key points. AI will compose a complete
                    update.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={handleVoiceInput}
                      className="w-32 h-32 rounded-full"
                    >
                      <Mic
                        className={`w-12 h-12 ${isRecording ? "animate-pulse" : ""}`}
                      />
                    </Button>
                    <p className="mt-4 text-sm text-gray-600">
                      {isRecording
                        ? "Recording... tap to stop"
                        : "Tap to start voice recording"}
                    </p>
                  </div>
                  {rawInput && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Transcribed:
                      </p>
                      <p className="text-sm text-blue-700">{rawInput}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleGenerateUpdate}
              disabled={isGenerating || !rawInput}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <TrendingUp className="mr-2 h-4 w-4 animate-pulse" />
                  AI is composing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Update with AI
                </>
              )}
            </Button>

            {generatedUpdate && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      AI-Composed
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{generatedUpdate}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePostUpdate} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Post to Circle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedUpdate("")}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Updates Feed */}
      <div className="space-y-4">
        {mockUpdates.map((update) => {
          const author = mockMembers.find((m) => m.id === update.authorId);
          return (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {author?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{author?.name}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {author?.role}
                      </span>
                      {update.isAIGenerated && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          AI-Composed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {update.createdAt.toLocaleDateString()} at{" "}
                      {update.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {update.content}
                </p>

                {update.rawContent && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                      View original notes
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-gray-600 italic">
                        {update.rawContent}
                      </p>
                    </div>
                  </details>
                )}

                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Heart className="w-4 h-4" />
                    React{" "}
                    {update.reactions.length > 0 &&
                      `(${update.reactions.length})`}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Comment{" "}
                    {update.comments.length > 0 &&
                      `(${update.comments.length})`}
                  </Button>
                </div>

                {update.reactions.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Reactions:</span>
                    {Object.entries(
                      update.reactions.reduce(
                        (acc, r) => {
                          acc[r.type] = (acc[r.type] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([type, count]) => (
                      <span key={type} className="flex items-center gap-1">
                        {getReactionIcon(type)} {count}
                      </span>
                    ))}
                  </div>
                )}

                {update.comments.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {update.comments.map((comment) => {
                      const commentAuthor = mockMembers.find(
                        (m) => m.id === comment.authorId,
                      );
                      return (
                        <div
                          key={comment.id}
                          className="flex gap-3 bg-gray-50 p-3 rounded-lg"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {commentAuthor?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {commentAuthor?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comment.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
