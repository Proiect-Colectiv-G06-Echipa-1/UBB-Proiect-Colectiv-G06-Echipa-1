// src/components/TaskCard.tsx
import { useState } from 'react';
import type { Task, TaskFormData } from '../lib/types';
import { taskSchema, taskStatuses } from '../lib/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Trash2, Save, X, AlertTriangle } from 'lucide-react'; 
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onSave: (data: TaskFormData) => void;
  onDelete: () => void; 
}

export function TaskCard({ task, onSave, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: task,
  });

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    onSave(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(task);
    setIsEditing(false);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.taskCard}>
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.warningIcon}>
                <AlertTriangle size={24} />
              </div>
              <h3>Delete Task?</h3>
            </div>
            <p>Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteBtn} 
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.cardHeader}>
          <div className={styles.titleGroup}>
            {isEditing ? (
              <>
                <input
                  type="number"
                  className={`${styles.energyInput} ${errors.energy ? styles.inputError : ''}`}
                  {...register('energy', { valueAsNumber: true })}
                />
                <input
                  type="text"
                  className={`${styles.titleInput} ${errors.title ? styles.inputError : ''}`}
                  {...register('title')}
                />
              </>
            ) : (
              <>
                <span className={styles.energyCircle}>{task.energy}</span>
                <h1 className={styles.title}>{task.title}</h1>
              </>
            )}
          </div>

          <div className={styles.iconGroup}>
            {isEditing ? (
              <>
                <button type="submit" className={styles.iconButton} disabled={!isDirty}>
                  <Save size={20} />
                </button>
                <button type="button" className={styles.iconButton} onClick={handleCancel}>
                  <X size={20} />
                </button>
              </>
            ) : (
              <button type="button" className={styles.iconButton} onClick={() => setIsEditing(true)}>
                <Edit size={20} />
              </button>
            )}
            
            <button 
              type="button" 
              className={`${styles.iconButton} ${styles.deleteButton}`}
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        {errors.energy && <span className={styles.errorMessage}>{errors.energy.message}</span>}
        {errors.title && <span className={styles.errorMessage}>{errors.title.message}</span>}

        <div className={styles.formGrid}>
             <div className={styles.formField}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              disabled={!isEditing}
              {...register('description')}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="createdDate">Created</label>
            <input 
              type="date"
              id="createdDate"
              disabled={!isEditing}
              {...register('createdDate')}
            />
            {errors.createdDate && <span className={styles.errorMessage}>{errors.createdDate.message}</span>}
          </div>

          <div className={styles.formField}>
            <label htmlFor="deadline">Deadline</label>
            <input 
              type="date"
              id="deadline"
              disabled={!isEditing}
              {...register('deadline')}
            />
            {errors.deadline && <span className={styles.errorMessage}>{errors.deadline.message}</span>}
          </div>

          <div className={styles.formField}>
            <label htmlFor="status">Status</label>
            <select id="status" disabled={!isEditing} {...register('status')}>
              {taskStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}