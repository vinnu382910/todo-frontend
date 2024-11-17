import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './index.css'; // Custom styles for red, green, orange, etc.

const CalendarView = ({ tasks }) => {
    const [dateClass, setDateClass] = useState({});

    useEffect(() => {
        const dates = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayFormatted = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        tasks.forEach(task => {
            const taskDate = new Date(task.deadline);
            taskDate.setHours(0, 0, 0, 0); // Set the task date to midnight to avoid time zone issues
            const formattedDate = taskDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

            // Initialize date if it doesn't exist
            if (!dates[formattedDate]) {
                dates[formattedDate] = { count: 0, status: [] };
            }

            // Add the status to the list for that day
            if (task.status === 'completed') {
                dates[formattedDate].status.push('completed');
            } else if (task.status === 'in progress') {
                dates[formattedDate].status.push('inprogress');
            } else if (task.status === 'pending') {
                dates[formattedDate].status.push('pending');
            } else if (task.status === 'done') {
                dates[formattedDate].status.push('done');
            }

            // Increment task count for that date
            dates[formattedDate].count += 1;
        });

        // Handle today's date color
        if (dates[todayFormatted]) {
            dates[todayFormatted].status.push('today');
        } else {
            dates[todayFormatted] = { count: 1, status: ['today'] };
        }

        setDateClass(dates);
    }, [tasks]);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];

            if (dateClass[formattedDate]) {
                console.log(formattedDate)
                const statuses = dateClass[formattedDate].status;
                console.log(statuses)
                // Apply color based on task status
                if (statuses.includes('completed')) {
                    return 'completed'; // Dark Green or Teal
                }
                if (statuses.includes('inprogress')) {
                    return 'inprogress'; // Red
                }
                if (statuses.includes('pending')) {
                    return 'pending'; // Orange
                }
                if (statuses.includes('done')) {
                    return 'done'; // Light Green
                }
                if (statuses.includes('today')) {
                    return 'today'; // Yellow
                }
                if (dateClass[formattedDate].count > 1) {
                    return 'multiple-tasks'; // Blue color for multiple tasks on the same day
                }
            }
        }
        return null;
    };

    return (
        <div className="calendar-view">
            <h2 className='cal-heading'>Tasks On Calendar</h2>
            <div className='colors-boxes-cont'>
                <div className='box-cont'>
                    <div className='completed color-box'>
                    </div>
                    <p>Tasks completed</p>
                </div>
                <div className='box-cont'>
                    <div className='inprogress color-box'>
                    </div>
                    <p>Tasks In Progress</p>
                </div>
                <div className='box-cont'>
                    <div className='pending color-box'>
                    </div>
                    <p>Tasks Pending</p>
                </div>
                <div className='box-cont'>
                    <div className='done color-box'>
                    </div>
                    <p>Tasks Done</p>
                </div>
                <div className='box-cont'>
                    <div className='today color-box'>
                    </div>
                    <p>Today</p>
                </div>
            </div>
            <Calendar
                tileClassName={tileClassName}
            />
        </div>
    );
};

export default CalendarView;
