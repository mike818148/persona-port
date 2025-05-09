"use client";

import { useState, useEffect } from "react";
import { Send, Bot, User, Settings, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChat } from "@ai-sdk/react";
import Markdown from "react-markdown";

export default function ChatbotPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState("openai");

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
  } = useChat({
    maxSteps: 3,
    body: {
      model: selectedModel,
    },
  });

  const commonQuestions = [
    "🛠️ What are Mike's technical skills?",
    "👷‍♂️ What kind of roles is Mike looking for right now?",
    "📁 Can you show me some of Mike's projects?",
    "🧠 What is Mike like to work with?",
    "🧳 What's Mike's professional background?",
    "💼 Can I schedule a meeting with Mike?",
  ];

  const handleQuestionClick = (question: string) => {
    append({
      role: "user",
      content: question,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen p-4 mx-auto max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold">AI Assistant</h1>

        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages([])}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
          <span className="text-sm text-gray-500 mr-2">Model:</span>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="deepseek">DeepSeek</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-gray-500 mb-6">
        Ask me anything or select a common question below
      </p>

      <Separator className="my-4" />

      {/* Chat Messages */}
      <Card className="flex-grow mb-4 p-4 overflow-y-auto max-h-[60vh]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
            <Bot size={48} className="mb-4 text-primary" />
            <h3 className="text-lg font-medium">How can I help you today?</h3>
            <p className="mt-2 mb-6">
              Select a common question or type your own message below.
            </p>

            {/* Common Questions (floating in message area) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-3xl">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-3 px-4 whitespace-normal break-words"
                  onClick={() => handleQuestionClick(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } p-3 rounded-lg`}
                  >
                    {message.role === "user" ? (
                      <User className="h-5 w-5 mt-1 flex-shrink-0" />
                    ) : (
                      <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                    )}
                    <div className="whitespace-pre-wrap">
                      <Markdown>{message.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%] bg-muted p-3 rounded-lg">
                  <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-foreground text-background"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </form>
    </div>
  );
}
