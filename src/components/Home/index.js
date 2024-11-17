import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import TaskInfo from '../TaskInfo';
import CalendarView from '../CalendarView';
import Popup from 'reactjs-popup';
import { ToastContainer } from "react-toastify";
import 'reactjs-popup/dist/index.css'; // Import the Popup styles
import { IoIosCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import './index.css';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        deadline: '', // New field for deadline
    });

    // Update input handling for the deadline
    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    //Function to update status

    const updateTaskStatus = async (taskId, updatedStatus) => {
        try {
            await axios.put(
                `http://localhost:9090/tasks/${taskId}`,
                { status: updatedStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchTasks(); // Refresh task list after updating the task
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };


    // Function to delete task
    const deleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:9090/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false)
            fetchTasks(); // Refresh task list after deletion
        } catch (error) {
            setLoading(false)
            setError('Failed to delete task');
            console.error('Error deleting task:', error); // Log the error for debugging
        }
    };

    // Function to fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:9090/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load tasks');
            setLoading(false);
        }
    };

    // useEffect to fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Handling form submission (POST API call)
    const onAddTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:9090/tasks',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            fetchTasks(); // Refresh task list after adding a task
            setIsPopupOpen(false); // Close the popup after adding the task
            setFormData({ title: '', description: '', status: 'pending' }); // Reset form data
        } catch (error) {
            setError('Failed to add task');
            console.error('Error adding task:', error); // Log the error for debugging
        }
    };   
    
    // Showing Calendar for mobile device which are less than 780px media width
    const toggleCalendar = () => {
        setShowCalendar((prevState) => !prevState);
      };

    // Filter tasks based on selectedStatus
    const filteredTasks = selectedStatus
        ? tasks.filter(task => task.status === selectedStatus)
        : tasks;

    if (loading) return <div class="loader"></div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="home">
            <Header />
            <TaskInfo taskList={tasks} 
            selectedStatus={selectedStatus} 
            setSelectedStatus={setSelectedStatus} />
            <div className='btns-cont'>
                <div>
                    <button className='showall-btn' onClick={() => setSelectedStatus('')}>Show All</button>
                </div>
                <div>
                    <button className="c-button add-task" onClick={() => setIsPopupOpen(true)}>
                        <span className="c-main">
                            <span className="c-ico">
                                <span className="c-blur"></span>
                                <span className="ico-text">+</span>
                            </span>
                            <span className='btn-text'>Add Task</span>
                        </span>
                    </button>
                </div>
                {/* Popup Form */}
                <Popup
                    contentStyle={{
                        padding: '0px',
                        width: '400px',
                        border: 'none',
                        background: 'azure',
                        borderRadius: '10px',
                    }}
                    open={isPopupOpen}
                    closeOnDocumentClick
                    onClose={() => setIsPopupOpen(false)}
                >
                    <div className="popup-form-cont">
                        <button className="close-btn" onClick={() => setIsPopupOpen(false)}>
                            <IoIosCloseCircle />
                        </button>
                        <h3>Add Task</h3>
                        <form onSubmit={onAddTask}>
                            <label className="input-label">
                                Title:<br />
                                <input
                                    className="input-title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={onChangeInput}
                                    placeholder="Enter Title"
                                    required
                                />
                            </label>
                            <br />
                            <label className="input-label">
                                Description:<br />
                                <textarea
                                    className="input-desc"
                                    name="description"
                                    value={formData.description}
                                    onChange={onChangeInput}
                                    required
                                />
                            </label>
                            <br />
                            <label className="input-label">
                                Status:<br />
                                <select
                                    className="input-title"
                                    name="status"
                                    value={formData.status}
                                    onChange={onChangeInput}
                                    required
                                >
                                    <option value="in progress">In Progress</option>
                                    <option value="done">Done</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <br />
                            </label>
                            <label className="input-label">
                                Deadline:<br />
                                <input
                                    className="input-title"
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline || ''}
                                    onChange={onChangeInput}
                                    required
                                />
                            </label>
                            <br />
                            <button type="submit" className="create-task-btn">
                                Add Task
                            </button>
                        </form>
                    </div>
                </Popup>
            </div>
            <button className={showCalendar?'close-cal-btn':'show-cal-btn'} onClick={toggleCalendar}>
                {showCalendar? 'Close Calendar' : 'Show Calendar'}
            </button>
            <div className='task-cal-cont'>
                <div className='task-main-cont'>
                    <h2 className='task-heading'>Your Tasks</h2>
                    {tasks.length > 0 ? (
                        <div className="task-list-container">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="task-box-cont">
                                    <div className="tittle-cont">
                                        <h3 className="task-title">{task.title}</h3>
                                        <div>
                                            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="task-desc">{task.description}</p>
                                    <p className="task-status">
                                        Status: <span className="status-results">{task.status}</span>
                                    </p>
                                    <p className="task-status">
                                        Updated At: <span className="updated-res">{new Date(task.updatedAt).toLocaleString()}</span>
                                    </p>
                                    <p className="task-status">
                                        Deadline: <span className="deadline-res"> {(() => {
                                                            const date = new Date(task.deadline);
                                                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            const year = date.getFullYear();
                                                            return `${day}/${month}/${year}`;
                                                        })()}
                                                    </span>
                                    </p>
                                    <select
                                        className="update-status"
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                    >
                                        <option value="in progress">In Progress</option>
                                        <option value="done">Done</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='no-tasks'>No tasks found! <span className='no-span'>Add your tasks today and challenge yourself—small steps lead to big progress.</span></p>
                    )}
                </div>
                {
                    showCalendar? (                
                    <div className='calendar-cont-mobile'>
                        <CalendarView tasks={filteredTasks} />
                    </div>) : null
                }
                <div className='calendar-cont'>
                    <CalendarView tasks={filteredTasks} />
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Home;
