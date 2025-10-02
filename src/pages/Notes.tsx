import { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonInput,
  IonTextarea,
  IonButtons,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAlert,
  IonBackButton,
} from '@ionic/react';
import { add, close, trash, checkmark } from 'ionicons/icons';
import { StorageService, Note, Task } from '../services/storage';
import './Notes.css';

const storage = new StorageService();

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const allNotes = await storage.getAllNotes();
    setNotes(allNotes);
  };

  const handleOpenNewNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setTasks([]);
    setShowNoteModal(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setTasks(note.tasks);
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) return;

    const now = Date.now();
    const note: Note = {
      id: editingNote?.id || `note-${now}`,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tasks: tasks,
      createdAt: editingNote?.createdAt || now,
      updatedAt: now,
    };

    await storage.saveNote(note);
    await loadNotes();
    setShowNoteModal(false);
    resetForm();
  };

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      await storage.deleteNote(noteToDelete);
      await loadNotes();
      setNoteToDelete(null);
      setShowDeleteAlert(false);
    }
  };

  const confirmDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteAlert(true);
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setTasks([]);
    setNewTaskText('');
    setEditingNote(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCompletedTasksCount = (note: Note) => {
    const completed = note.tasks.filter(t => t.completed).length;
    return `${completed}/${note.tasks.length}`;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/chat" />
          </IonButtons>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="notes-content">
        <div className="notes-container">
          {notes.length === 0 && (
            <div className="empty-notes">
              <h2>No Notes Yet</h2>
              <p>Create quick notes and tasks to organize your thoughts.</p>
              <p className="ai-note">Notes Help Roa Therapist</p>
            </div>
          )}

          {notes.map((note) => (
            <IonCard key={note.id} className="note-card" onClick={() => handleOpenEditNote(note)}>
              <IonCardHeader>
                <div className="note-header">
                  <IonCardTitle>{note.title}</IonCardTitle>
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteNote(note.id);
                    }}
                  >
                    <IonIcon icon={trash} />
                  </IonButton>
                </div>
                <p className="note-date">{formatDate(note.updatedAt)}</p>
              </IonCardHeader>
              <IonCardContent>
                {note.content && <p className="note-content">{note.content}</p>}
                {note.tasks.length > 0 && (
                  <div className="task-summary">
                    <IonIcon icon={checkmark} />
                    <span>Tasks: {getCompletedTasksCount(note)}</span>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleOpenNewNote}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      {/* Note Editor Modal */}
      <IonModal isOpen={showNoteModal} onDidDismiss={() => setShowNoteModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{editingNote ? 'Edit Note' : 'New Note'}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowNoteModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="note-modal-content">
          <div className="note-form">
            <IonInput
              value={noteTitle}
              onIonInput={(e) => setNoteTitle(e.detail.value || '')}
              placeholder="Note Title"
              className="note-title-input"
            />

            <IonTextarea
              value={noteContent}
              onIonInput={(e) => setNoteContent(e.detail.value || '')}
              placeholder="Write your thoughts here..."
              autoGrow
              rows={4}
              className="note-content-input"
            />

            <div className="tasks-section">
              <h3>Tasks</h3>
              
              <div className="add-task">
                <IonInput
                  value={newTaskText}
                  onIonInput={(e) => setNewTaskText(e.detail.value || '')}
                  placeholder="Add a task..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTask();
                    }
                  }}
                />
                <IonButton onClick={handleAddTask} size="small">
                  <IonIcon icon={add} />
                </IonButton>
              </div>

              <IonList className="tasks-list">
                {tasks.map((task) => (
                  <IonItemSliding key={task.id}>
                    <IonItem className="task-item">
                      <IonCheckbox
                        checked={task.completed}
                        onIonChange={() => handleToggleTask(task.id)}
                        slot="start"
                      />
                      <IonLabel className={task.completed ? 'completed-task' : ''}>
                        {task.text}
                      </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            </div>

            <IonButton
              expand="block"
              onClick={handleSaveNote}
              disabled={!noteTitle.trim()}
              className="save-note-button"
            >
              {editingNote ? 'Update Note' : 'Save Note'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Delete Note"
        message="Are you sure you want to delete this note?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: handleDeleteNote,
          },
        ]}
      />
    </IonPage>
  );
};

export default Notes;
