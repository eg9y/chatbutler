import { useEffect, useRef, useState } from 'react'

import './App.css'
import { Chat } from './components/Chat/Chat'
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const chatBotId = '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextNodeId, setNextNodeId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>(uuidv4());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  async function onUserSendMessage(message: Message) {
    setIsLoading(true);
    console.log('message', message);
    
    let localNextNodeId = nextNodeId;
    let userMessage = message.content;
    const localMessages = [...messages, message];

    setMessages(localMessages);
  
    let res: {
      message: string,
      nextNodeId: string,
      nextNodeType: string,
    } = {
      message: '',
      nextNodeId: '',
      nextNodeType: '',
    };

    do {
      const body = {
        sessionId,
        userResponse: userMessage,
        previousBlockId: localNextNodeId,
      }
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      };
      
      res = await fetch(`http://localhost:3000/chatbot/${chatBotId}`, options)
        .then(response => response.json())
        .catch(err => {
          console.error(err);
          setIsLoading(false);
          return;
        });
  
      console.log('response: ', res);
      
      if (res.message.trim().length > 0) {
        localMessages.push({
          role: 'assistant',
          content: res.message
        });
        setMessages(localMessages);
      }
  
      localNextNodeId = res.nextNodeId;
      setNextNodeId(res.nextNodeId);
  
      // Clear user message for subsequent requests
      userMessage = '';
  
    } while (!res.message || res.message.trim().length === 0)
  
    setIsLoading(false);
  }

  async function onReset() {
    console.log('placeholder');
    // call remove
    const options = {
      method: 'DELETE',
    };
    const res = await fetch(`http://localhost:3000/chatbot/${sessionId}`, options)
      .then(response => response.text())
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        return;
      });

    if (res === sessionId) {
      setMessages([]);
      setSessionId(uuidv4());
    } else {
      console.error('error resetting session');
    }
  }

  useEffect(() => {
    scrollToBottom();
   
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-0 right-0 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
        <Chat messages={messages} loading={isLoading} onSend={onUserSendMessage} onReset={onReset} />
            <div ref={messagesEndRef} />
          </div>
        </div>
    </>
  )
}

export default App
