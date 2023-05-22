import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Chat } from './components/Chat/Chat'
import { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function onSend() {
    console.log('placeholder');
  }

  function onReset() {
    console.log('placeholder');
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-0 right-0 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
        <Chat messages={messages} loading={isLoading} onSend={onSend} onReset={onReset} />
            <div ref={messagesEndRef} />
          </div>
        </div>
    </>
  )
}

export default App
