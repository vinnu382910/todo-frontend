import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css'

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    // Handle form input changes
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission (PUT request to update user)
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const { name, email, password, confirmPassword } = formData;

        // Simple password validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'https://todo-backend-5453.onrender.com/user/update',
                { name, email, password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            setSuccess("Profile updated successfully");
            setLoading(false);
        } catch (err) {
            setError("Error updating profile", err);
            setLoading(false);
        }
    };

    return (
        <div className="update-profile-container">
            <h2 className='update-profile-heading'>Update Profile</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={onSubmit} className="update-profile-form">
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChangeInput}
                        required
                        className="input-field"
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChangeInput}
                        required
                        className="input-field"
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChangeInput}
                        className="input-field"
                    />
                </label>
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={onChangeInput}
                        className="input-field"
                    />
                </label>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
            <Link to='/home'>
                <button className="back-button">Back</button>
            </Link>
        </div>
    );
};

export default UpdateProfile;
