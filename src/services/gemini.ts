import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage } from '../types/terminal';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelName: string = 'gemini-pro') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async streamChat(
    messages: ChatMessage[], 
    systemMessage: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      // Convert messages to Gemini format
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Get the latest user message
      const latestMessage = messages[messages.length - 1];
      const prompt = systemMessage + '\n\n' + latestMessage.content;

      // Start a chat session
      const chat = this.model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
      });

      // Send message and get streaming response
      const result = await chat.sendMessageStream(prompt);
      
      let fullResponse = '';
      
      // Process the stream
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onChunk?.(chunkText);
      }

      return fullResponse;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async sendMessage(
    messages: ChatMessage[], 
    systemMessage: string
  ): Promise<string> {
    try {
      // Convert messages to Gemini format
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Get the latest user message
      const latestMessage = messages[messages.length - 1];
      const prompt = systemMessage + '\n\n' + latestMessage.content;

      // Start a chat session
      const chat = this.model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
      });

      // Send message and get response
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}