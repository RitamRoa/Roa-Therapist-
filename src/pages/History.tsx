import { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { trashOutline, chatbubbleOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage';
import { Conversation } from '../services/gemini';
import './History.css';

const History: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const storage = new StorageService();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const convs = await storage.getAllConversations();
    setConversations(convs);
  };

  const deleteConversation = async (id: string) => {
    await storage.deleteConversation(id);
    loadConversations();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getPreview = (conv: Conversation): string => {
    if (conv.messages.length === 0) return 'No messages';
    const lastMessage = conv.messages[conv.messages.length - 1];
    return lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Conversation History</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="history-content">
        <div className="history-container">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <IonIcon icon={chatbubbleOutline} className="empty-icon" />
              <h2>No Conversations Yet</h2>
              <p>Your conversation history will appear here once you start chatting.</p>
            </div>
          ) : (
            <>
              <IonCard className="info-card">
                <IonCardContent>
                  <IonText color="primary">
                    <h3>📚 Your Journey</h3>
                  </IonText>
                  <p>You have {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} saved. 
                  I learn from each conversation to better support you.</p>
                </IonCardContent>
              </IonCard>

              <IonList className="conversations-list">
                {conversations.map((conv) => (
                  <IonItemSliding key={conv.id}>
                    <IonItem className="conversation-item">
                      <div className="conversation-icon">
                        <IonIcon icon={chatbubbleOutline} />
                      </div>
                      <IonLabel>
                        <h2>{formatDate(conv.timestamp)}</h2>
                        <p>{conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}</p>
                        <p className="preview">{getPreview(conv)}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => deleteConversation(conv.id)}>
                        <IonIcon icon={trashOutline} />
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default History;
