import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText,
} from '@ionic/react';
import { chatbubbleEllipsesOutline, timeOutline, heartOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Peace of Mind</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="home-content">
        <div className="home-container">
          <div className="hero-section">
            <IonIcon icon={heartOutline} className="hero-icon" />
            <h1>Your Mental Health Companion</h1>
            <p className="hero-subtitle">
              I'm here to listen, understand, and support you through your journey.
              I remember our conversations and learn from them to better help you.
            </p>
          </div>

          <div className="cards-container">
            <IonCard className="feature-card" button onClick={() => history.push('/chat')}>
              <IonCardHeader>
                <div className="card-icon-wrapper">
                  <IonIcon icon={chatbubbleEllipsesOutline} className="card-icon" />
                </div>
                <IonCardTitle>Start Conversation</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText color="medium">
                  Talk to me about what's on your mind. I'm here to listen and help.
                </IonText>
              </IonCardContent>
            </IonCard>

            <IonCard className="feature-card" button onClick={() => history.push('/history')}>
              <IonCardHeader>
                <div className="card-icon-wrapper">
                  <IonIcon icon={timeOutline} className="card-icon" />
                </div>
                <IonCardTitle>Conversation History</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText color="medium">
                  Review past conversations and track your progress over time.
                </IonText>
              </IonCardContent>
            </IonCard>
          </div>

          <div className="info-section">
            <IonCard className="info-card">
              <IonCardContent>
                <h3>How I Help You</h3>
                <ul>
                  <li>🧠 <strong>Memory:</strong> I remember our conversations to provide better support</li>
                  <li>💪 <strong>Understanding:</strong> I know you're dealing with work stress and toxic relationships</li>
                  <li>🎯 <strong>Personalized:</strong> My advice adapts to your patterns and preferences</li>
                  <li>🤝 <strong>Always Here:</strong> Talk to me anytime, day or night</li>
                </ul>
              </IonCardContent>
            </IonCard>
          </div>

          <IonButton 
            expand="block" 
            size="large" 
            className="start-button"
            onClick={() => history.push('/chat')}
          >
            Let's Talk
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
