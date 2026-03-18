import React, { useState, useEffect } from 'react';
import '../../styles/usersRegistered.css';
import { UseTheme } from '../../contexts/ThemeContext';

interface User {
    uid: string;
    email: string;
    isAdmin: boolean;
    isBanned: boolean;
    metadata?: {
        creationTime: string;
    };
}

interface UsersRegisteredProps {
    users: User[];
    handleBanUser: (email: string) => void;
    handleUnbanUser: (uid: string) => void;
}

const UsersRegistered: React.FC<UsersRegisteredProps> = ({ users, handleBanUser, handleUnbanUser }) => {
    const { theme } = UseTheme()
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
        const search = searchTerm.toLowerCase();
        return (
            user.email?.toLowerCase().includes(search) ||
            (search === 'admin' && user.isAdmin) ||
            (search === 'banned' && user.isBanned)
        );
    });

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    return (
        <div className={`ur-container ur-container ${theme}`}>
            <div className="ur-header">
                <h2 className="ur-title">USER_<span>DATABASE</span></h2>
                <input 
                    type="text" 
                    placeholder="SEARCH_BY_EMAIL_ADMIN_OR_BANNED..." 
                    className="ur-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="ur-card-header">REGISTRY_LOGS_ACTIVE</div>

            <div className="ur-list">
                {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                        <div key={user.uid || user.email} className="ur-row">
                            <div className="ur-info">
                                <span className="ur-date">
                                    [{user.metadata?.creationTime 
                                        ? new Date(user.metadata.creationTime).toLocaleDateString() 
                                        : 'N/A'}]
                                </span>
                                <span className={user.isAdmin ? "ur-badge admin" : "ur-badge user"}>
                                    {user.isAdmin ? "ROOT" : "NODE"}
                                </span>
                                <span className="ur-email">{user.email}</span>
                            </div>

                            <div className="ur-actions">
                                {user.isBanned && <span className="ur-banned-label">BANNED</span>}
                                <button 
                                    onClick={() => user.isBanned ? handleUnbanUser(user.uid) : handleBanUser(user.email)} 
                                    className={`ur-btn ${user.isBanned ? 'unban' : 'ban'}`}
                                >
                                    {user.isBanned ? 'RESTORE_ACCESS' : 'BAN_NODE'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="ur-empty">NO_SYSTEM_RECORDS_MATCHING_QUERY</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="ur-pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="ur-pag-btn">PREV</button>
                    <span className="ur-pag-info">{currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="ur-pag-btn">NEXT</button>
                </div>
            )}
        </div>
    );
};

export default UsersRegistered;