import { useEffect, useRef, useState } from 'preact/hooks';

import { Chat } from './components/Chat/Chat'
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';

function App({
  chatbotId
}: {
  chatbotId: string
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextNodeId, setNextNodeId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>(uuidv4());

  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Create WebSocket connection
    if (!ws.current) {
      ws.current = new WebSocket(import.meta.env.VITE_CHAT_SERVER_WS || 'ws://localhost:3000');
    }
    
    ws.current.onopen = () => {
      console.log('ws opened');
      setTimeout(() => {
        ws.current!.send(JSON.stringify({ event: 'message', sessionId }));
        console.log('message sent');
      }, 1000);
    };

    ws.current.onclose = () => {
      console.log('ws closed');
    }

    ws.current.onerror = (error) => {
      console.log('WebSocket error', error);
    };
    

    // Listen for messages from the server
    ws.current.onmessage = async (e) => {
      if (typeof e.data === 'string') {
        // Parse the JSON data from the server
        const data = JSON.parse(e.data);
        console.log('got data', data);

        const message = data.message;
        const nextNodeId = data.nextNodeId;
        setNextNodeId(nextNodeId);
        if (message.trim().length > 0) {
          setMessages(prevMessages => [...prevMessages, {
            role: 'assistant',
            content: message,
          }]);
          setIsLoading(false);
        } 

        if (data.nextNodeType !== "inputText") {
          await runNextNode(sessionId, '', nextNodeId, chatbotId);
        }
      }
    };

    return () => {
      // Close WebSocket when component unmounts
      // ws.current?.close();
    };
  }, []);

  async function onUserSendMessage(message: Message) {
    setIsLoading(true);
    console.log('message', message);
    
    let userMessage = message.content;
    const localMessages = [...messages, message];

    setMessages(localMessages);

    
    try {
      const res: {
        message: string;
        nextNodeId: string;
        nextNodeType: string;
      } = await runNextNode(sessionId, userMessage, nextNodeId, chatbotId);
      userMessage = '';
      console.log(res);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  async function onReset() {
    setIsLoading(true);
    console.log('placeholder');
    // call remove
    const options = {
      method: 'DELETE',
    };
    const res = await fetch(`${import.meta.env.VITE_CHAT_SERVER}/chatbot/${sessionId}`, options)
      .then(response => response.text())
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        return;
      });

    if (res === sessionId) {
      setMessages([]);
      setSessionId(uuidv4());
      ws.current?.send(JSON.stringify({ event: 'message', sessionId }));
    } else {
      console.error('error resetting session');
    }
    setIsLoading(false);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <div className="fixed bottom-0 right-0 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
        <Chat messages={messages} loading={isLoading} onSend={onUserSendMessage} onReset={onReset} />
            <div ref={messagesEndRef} />
          </div>
        </div>
  )
}

export default App

async function runNextNode(sessionId: string, userMessage: string, nextNodeId: string, chatbotId: string) {
  const body = {
    sessionId,
    userResponse: userMessage,
    previousBlockId: nextNodeId,
  };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  const res: {
    message: string;
    nextNodeId: string;
    nextNodeType: string;
  } = await fetch(`${import.meta.env.VITE_CHAT_SERVER}/chatbot/${chatbotId}`, options)
    .then(response => response.json())
  return res;
}

