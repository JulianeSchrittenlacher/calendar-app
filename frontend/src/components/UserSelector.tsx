import React from 'react';
import {User} from '../types/User';
import '../styles/AppointmentForm.css';

interface UserSelectorProps {
    users: User[];
    selectedUserIds: string[];
    setSelectedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function UserSelector(props: Readonly<UserSelectorProps>) {
    const {users, selectedUserIds, setSelectedUserIds} = props;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userId = e.target.value;
        setSelectedUserIds(prev =>
            e.target.checked
                ? [...prev, userId]
                : prev.filter(id => id !== userId)
        );
    };

    return (
        <label className="form-entries">
            <p>Teilnehmer:</p>
            <ul className="no-bullets">
                {users.map(user => (
                    <li key={user.id}>
                        <label>
                            <input
                                type="checkbox"
                                value={user.id}
                                checked={selectedUserIds.includes(user.id)}
                                onChange={handleCheckboxChange}
                            />
                            {user.name}
                        </label>
                    </li>
                ))}
            </ul>
        </label>
    );
}
