import React, { useState } from 'react';
import NavHome from '../Home/NavHome';
import Footer from '../Home/Footer';
import { Eye, EyeOff } from 'lucide-react';

const Profile = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')));
    const [formData, setFormData] = useState({
        fullname: currentUser?.fullname || '',
        avatarURL: currentUser?.avatarURL || '',
        oldPassword: '',
        newPassword: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatarURL || '');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const dataToUpdate = {
            fullname: formData.fullname,
        };

        // Xử lý đổi mật khẩu
        if (formData.newPassword) {
            // Lấy lại thông tin user mới nhất từ server để đảm bảo mật khẩu là chính xác
            const userRes = await fetch(`http://localhost:9999/users/${currentUser.id}`);
            const freshUserData = await userRes.json();

            if (formData.oldPassword !== freshUserData.password) {
                setMessage({ type: 'danger', text: 'Old password is incorrect.' });
                return;
            }
            dataToUpdate.password = formData.newPassword;
        }

        if (avatarFile) {
            const reader = new FileReader();
            reader.readAsDataURL(avatarFile);
            reader.onloadend = () => {
                dataToUpdate.avatarURL = reader.result;
                updateProfile(dataToUpdate);
            };
        } else {
            dataToUpdate.avatarURL = formData.avatarURL;
            updateProfile(dataToUpdate);
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await fetch(`http://localhost:9999/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to update profile.');
            
            const updatedUser = await response.json();
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));

        } catch (error) {
            setMessage({ type: 'danger', text: 'Error updating profile.' });
        }
    };
    
    const getAvatarFallback = (name) => {
        if (!name) return '';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-light">
            <NavHome />
            <main className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-primary" style={{ height: '150px' }}></div>
                            <div className="card-body p-4 position-relative">
                                <div className="text-center" style={{ marginTop: '-75px' }}>
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="rounded-circle border border-5 border-white" width="150" height="150" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="rounded-circle border border-5 border-white bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', fontSize: '3rem' }}>
                                            {getAvatarFallback(currentUser.fullname)}
                                        </div>
                                    )}
                                </div>
                                
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="mb-3">
                                        <label htmlFor="avatarFile" className="form-label">Change Avatar</label>
                                        <input type="file" className="form-control" id="avatarFile" onChange={handleFileChange} accept="image/*" />
                                    </div>
                                     <div className="mb-3">
                                        <label htmlFor="avatarURL" className="form-label">Or paste image URL</label>
                                        <input type="text" className="form-control" id="avatarURL" name="avatarURL" value={formData.avatarURL} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fullname" className="form-label">Full Name</label>
                                        <input type="text" className="form-control" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} />
                                    </div>
                                    <hr className="my-4" />
                                    <div className="mb-3">
                                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                                        <input type="password" placeholder="Enter old password to change" className="form-control" id="oldPassword" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="newPassword" className="form-label">New Password (leave blank if no change)</label>
                                        <input type={showPassword ? "text" : "password"} className="form-control" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-link position-absolute end-0 top-50 translate-middle-y mt-3">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    
                                    <div className="row mt-4">
                                        <div className="col"><p className="text-muted mb-0"><strong>Username:</strong> {currentUser.username}</p></div>
                                        <div className="col"><p className="text-muted mb-0"><strong>Email:</strong> {currentUser.email}</p></div>
                                    </div>
                                    <div className="row">
                                         <div className="col"><p className="text-muted mb-0"><strong>Role:</strong> {currentUser.role}</p></div>
                                         <div className="col"><p className="text-muted mb-0"><strong>Status:</strong> {currentUser.action}</p></div>
                                    </div>

                                    {message.text && <div className={`alert alert-${message.type} mt-4`}>{message.text}</div>}

                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn btn-secondary">Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                    <p className="text-muted text-center mt-3 small">ID: {currentUser.id}</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
