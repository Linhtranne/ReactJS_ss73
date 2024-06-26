import React, { useState } from 'react';
import { Task } from '../interface/types';

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (taskId: number) => void;
  setModal: (modal: { show: boolean, type: string, task?: Task }) => void;
  updateTask: (taskId: number, taskName: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTaskCompletion, setModal, updateTask }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskName, setTaskName] = useState<string>('');

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskName(task.name);
  };

  const handleSave = (taskId: number) => {
    updateTask(taskId, taskName);
    setEditingTask(null);
    setTaskName('');
  };

  return (
    <ul className="list-group mb-0">
      {tasks.map(task => (
        <li
          key={task.id}
          className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
          style={{ backgroundColor: '#f4f6f7' }}
        >
          <div>
            <input
              className="form-check-input me-2"
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {editingTask?.id === task.id ? (
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            ) : (
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</span>
            )}
          </div>
          <div className="d-flex gap-3">
            {editingTask?.id === task.id ? (
              <i className="fas fa-check text-success" onClick={() => handleSave(task.id)}></i>
            ) : (
              <>
                <i className="fas fa-pen-to-square text-warning" onClick={() => handleEdit(task)}></i>
                <i className="far fa-trash-can text-danger" onClick={() => setModal({ show: true, type: 'delete', task })}></i>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;