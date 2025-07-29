import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types/terminal';
import { GeminiService } from '../services/gemini';

interface UseChatCompletionOptions {
  model?: string;
  systemMessage?: string;
}

export function useChatCompletion(options: UseChatCompletionOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    content: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const newUserMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
      // Check if we have an API key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env');
      }

      const systemMessage = options.systemMessage || `You are Nishito, a helpful AI assistant integrated into a terminal emulator. You provide concise, technical responses with occasional wit and charm. You can help with coding, system tasks, and general knowledge.`;

      // Initialize Gemini service
      const geminiService = new GeminiService(apiKey, options.model || 'gemini-pro');

      // Send message with streaming
      const fullResponse = await geminiService.streamChat(
        updatedMessages,
        systemMessage,
        onChunk
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, assistantMessage]);
      return fullResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const mockResponse = useCallback(async (
    content: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const newUserMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);

    // Mock response for demo purposes
    const mockResponses = [
      "I'm here to help! What would you like to know?",
      "That's an interesting question. Let me think about it...",
      "Based on my analysis, here's what I found...",
      "I'd be happy to assist you with that!",
      "Let me help you understand this better...",
    ];

    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Simulate streaming
    for (const char of response) {
      await new Promise(resolve => setTimeout(resolve, 30));
      onChunk?.(char);
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
    
    return response;
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    mockResponse,
    clearMessages,
  };
}