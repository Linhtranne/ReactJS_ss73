import React, { useState, useEffect } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TaskForm from './form';
import TaskList from './list';
import Modal from './modal';
import { Task } from '../interface/types';
import "../assets/css/index.css"
import  axios from "axios"

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modal, setModal] = useState<{ show: boolean, type: string, task?: Task }>({ show: false, type: '' });
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTask = (taskName: string) => {
    if (taskName.trim() === '') {
      setModal({ show: true, type: 'error', task: { id: 0, name: 'Tên công việc không được phép để trống.', completed: false } });
      return;
    }
    if (tasks.some(task => task.name === taskName)) {
      setModal({ show: true, type: 'error', task: { id: 0, name: 'Tên công việc không được phép trùng.', completed: false } });
      return;
    }
    const newTask = { id: Date.now(), name: taskName, completed: false };
    axios.post('http://localhost:3001/tasks', newTask)
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error(error));
  };

  const toggleTaskCompletion = (taskId: number) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      axios.patch(`http://localhost:3001/tasks/${taskId}`, { completed: !task.completed })
        .then(response => setTasks(tasks.map(task => task.id === taskId ? response.data : task)))
        .catch(error => console.error(error));
    }
  };

  const deleteTask = (taskId: number) => {
    axios.delete(`http://localhost:3001/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setModal({ show: false, type: '' });
      })
      .catch(error => console.error(error));
  };

  const updateTask = (taskId: number, taskName: string) => {
    if (taskName.trim() === '') {
      setModal({ show: true, type: 'error', task: { id: 0, name: 'Tên công việc không được phép để trống.', completed: false } });
      return;
    }
    if (tasks.some(task => task.name === taskName && task.id !== taskId)) {
      setModal({ show: true, type: 'error', task: { id: 0, name: 'Tên công việc không được phép trùng.', completed: false } });
      return;
    }
    axios.patch(`http://localhost:3001/tasks/${taskId}`, { name: taskName })
      .then(response => setTasks(tasks.map(task => task.id === taskId ? response.data : task)))
      .catch(error => console.error(error));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="card-body p-5">
                <TaskForm addTask={addTask} />
                <ul className="nav nav-tabs mb-4 pb-2">
                  <li className="nav-item" role="presentation">
                    <a className={`nav-link ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tất cả</a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className={`nav-link ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Đã hoàn thành</a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className={`nav-link ${filter === 'incomplete' ? 'active' : ''}`} onClick={() => setFilter('incomplete')}>Chưa hoàn thành</a>
                  </li>
                </ul>
                <TaskList
                  tasks={filteredTasks}
                  toggleTaskCompletion={toggleTaskCompletion}
                  setModal={setModal}
                  updateTask={updateTask}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal.show && (
        <Modal
          type={modal.type}
          task={modal.task}
          deleteTask={deleteTask}
          closeModal={() => setModal({ show: false, type: '' })}
        />
      )}
    </section>
  );
};

export default App;