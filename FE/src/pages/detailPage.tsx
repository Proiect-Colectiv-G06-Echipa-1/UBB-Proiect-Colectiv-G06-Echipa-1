// src/pages/detailsPage.tsx
import './detailPage.css'; 
import { initialTask } from '../lib/dummyData';
import { TaskCard } from '../components/taskCard';
import { useState } from 'react'; // Import useState
import type { Task } from '../lib/types';
import type { TaskFormData } from '../lib/types';
import { DependencyTree } from '../components/dependencyTree';
import { dummyTreeData } from '../lib/dummyData';

export function DetailPage() {
const [task, setTask] = useState<Task | null>(initialTask);

const handleSaveTask = (updatedTaskData: TaskFormData) => {
    if (!task) return; 

    const updatedTask = { ...task, ...updatedTaskData };
    
    console.log('✅ SAVING TO BACKEND:', updatedTask);
    setTask(updatedTask); 
    alert('Task saved successfully!');
  };
const handleDeleteTask = () => {
    console.log('❌ DELETING TASK:', task?.id);
    setTask(null); 
  };
  return (
    <div className="app-container">

      <div className="top-tree-icon">
      </div>

      <div className="left-pane"> 
        <div className="sticky-note-icon"></div>
        
        {task ? (
          <TaskCard 
            task={task} 
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
          />
        ) : (
          <div className="task-deleted-message">
            <h2>Task Deleted</h2>
            <button onClick={() => setTask(initialTask)}>Restore Task</button>
          </div>
        )}
        
      </div>

      <div className="right-pane"> 
        
        <div className="next-text">
          Next &rarr;
        </div>

        <div>
           <DependencyTree node={dummyTreeData} />
        </div>
        
      </div>
    </div>
  );
}