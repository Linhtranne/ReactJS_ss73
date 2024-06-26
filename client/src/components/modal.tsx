import React from 'react';
import { Task } from '../interface/types';

interface ModalProps {
  type: string;
  task?: Task;
  deleteTask: (taskId: number) => void;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ type, task, deleteTask, closeModal }) => {
  return (
    <div className="overlay">
      <div className="modal-custom">
        <div className="modal-header-custom">
          <h5>{type === 'delete' ? 'Xác nhận' : 'Cảnh báo'}</h5>
          <i className="fas fa-xmark" onClick={closeModal}></i>
        </div>
        <div className="modal-body-custom">
          <p>{type === 'delete' ? `Bạn chắc chắn muốn xóa công việc ${task?.name}?` : task?.name}</p>
        </div>
        <div className="modal-footer-footer">
          {type === 'delete' ? (
            <>
              <button className="btn btn-light" onClick={closeModal}>Hủy</button>
              <button className="btn btn-danger" onClick={() => task && deleteTask(task.id)}>Xóa</button>
            </>
          ) : (
            <button className="btn btn-light" onClick={closeModal}>Đóng</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;