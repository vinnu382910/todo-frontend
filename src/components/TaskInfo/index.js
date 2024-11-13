import React from 'react';
import './index.css';

const TaskInfo = ({ taskList, selectedStatus, setSelectedStatus }) => {
  // Count tasks by status
  const taskStatusCounts = {
    pending: taskList.filter(task => task.status === 'pending').length,
    done: taskList.filter(task => task.status === 'done').length,
    inProgress: taskList.filter(task => task.status === 'in progress').length,
    completed: taskList.filter(task => task.status === 'completed').length,
  };

  return (
    <div className="task-info-container">
      <div className="task-boxes">
        <button 
          className={`task-box ${selectedStatus === 'pending' ? 'box-shadow' : ''}`} 
          onClick={() => setSelectedStatus('pending')}
        >
          <h3>Pending</h3>
          <p>{taskStatusCounts.pending}</p>
        </button>
        <button 
          className={`task-box ${selectedStatus === 'in progress' ? 'box-shadow' : ''}`} 
          onClick={() => setSelectedStatus('in progress')}
        >
          <h3>In Progress</h3>
          <p>{taskStatusCounts.inProgress}</p>
        </button>
        <button 
          className={`task-box ${selectedStatus === 'done' ? 'box-shadow' : ''}`} 
          onClick={() => setSelectedStatus('done')}
        >
          <h3>Done</h3>
          <p>{taskStatusCounts.done}</p>
        </button>
        <button 
          className={`task-box ${selectedStatus === 'completed' ? 'box-shadow' : ''}`} 
          onClick={() => setSelectedStatus('completed')}
        >
          <h3>Completed</h3>
          <p>{taskStatusCounts.completed}</p>
        </button>
      </div>
    </div>
  );
};

export default TaskInfo;
