import { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonAlert,
} from '@ionic/react';
import { send, addOutline, documentText } from 'ionicons/icons';
import geminiService, { Message } from '../services/gemini';
import { useHistory } from 'react-router-dom';
import './Chat.css';

const Chat: React.FC = () => {
  const history = useHistory();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewChatAlert, setShowNewChatAlert] = useState(false);
  const [showModelErrorAlert, setShowModelErrorAlert] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    // Load existing conversation history
    const history = geminiService.getConversationHistory();
    setMessages(history);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Get response from Gemini (it will add both user and assistant messages to history)
      const returnedText = await geminiService.sendMessage(userMessage);

      // Reload the conversation history to update UI
      const updatedHistory = geminiService.getConversationHistory();
      setMessages(updatedHistory);

      // If the service returned the internal fallback message, show a friendly alert so user knows
      if (typeof returnedText === 'string' && returnedText.includes("couldn't generate a response")) {
        setShowModelErrorAlert(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorTimestamp = Date.now();
      const errorMsg: Message = {
        id: `error-${errorTimestamp}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: errorTimestamp,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    await geminiService.startNewConversation();
    setMessages([]);
    setShowNewChatAlert(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Roa</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/notes')}>
              <IonIcon icon={documentText} />
            </IonButton>
            <IonButton onClick={() => setShowNewChatAlert(true)}>
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen className="chat-content">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <h2>- Roa Therapist -</h2>
              <p className="memory-note">By You and for You ❤️</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-bubble">
                <div className="message-content">{message.content}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant-message">
              <div className="message-bubble">
                <IonSpinner name="dots" />
              </div>
            </div>
          )}
        </div>
      </IonContent>

      <IonFooter className="chat-footer">
        <div className="input-container">
          <IonTextarea
            value={inputText}
            onIonInput={(e) => setInputText(e.detail.value || '')}
            placeholder="Tell me..."
            autoGrow
            rows={1}
            maxlength={1000}
            className="message-input"
          />
          <IonButton
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="send-button"
          >
            <IonIcon icon={send} />
          </IonButton>
        </div>
      </IonFooter>

      <IonAlert
        isOpen={showNewChatAlert}
        onDidDismiss={() => setShowNewChatAlert(false)}
        header="Start New Chat"
        message="This will start a fresh conversation. Your current chat will be saved in history."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Start New',
            handler: handleNewChat,
          },
        ]}
      />
      <IonAlert
        isOpen={showModelErrorAlert}
        onDidDismiss={() => setShowModelErrorAlert(false)}
        header="Temporary Issue"
        message="The assistant couldn't generate a response right now. Please try again in a moment."
        buttons={[{ text: 'OK', role: 'cancel' }]}
      />
    </IonPage>
  );
};

export default Chat;
