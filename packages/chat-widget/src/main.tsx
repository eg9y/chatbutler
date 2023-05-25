import { render } from 'preact';
import App from './App';
import './index.css';

declare global {
  interface Window {
    chatBotId: string;
    initializeChatbot: ({ chatBotId }: { chatBotId: string }) => void;
  }
}

export function initializeChatbot({ chatBotId }: { chatBotId: string }) {
  window.chatBotId = chatBotId;

  const rootElement = document.createElement('div');
  rootElement.id = 'chatbot-root';
  document.body.appendChild(rootElement);
  render(<App chatbotId={chatBotId} />, rootElement);
}

window.initializeChatbot = initializeChatbot

// initializeChatbot({
//   chatBotId: 'c1y7TY43AFzO7AFf0MSdY'
// });
