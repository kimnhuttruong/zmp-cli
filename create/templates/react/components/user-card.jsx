import React from 'react';
import { Avatar, Title } from 'zmp-framework/react';

const UserCard = ({ user }) => {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Avatar story online src={user.avatar.startsWith('http') ? user.avatar : null}>{user.avatar}</Avatar>
      <div style={{ marginLeft: 16 }}>
        <Title style={{ marginBottom: 0 }}>{user.name}</Title>
        <div>{user.id}</div>
      </div>
    </div>
  )
};

UserCard.displayName = 'zmp-user-card'

export default UserCard;
