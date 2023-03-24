import React, { useEffect, useState } from 'react';
import { AxiosError, CanceledError } from './services/api-client';
import userServices, { User } from './services/user-services';

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const { request, cancel } = userServices.getAll<User>();
    request
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
        setIsLoading(false);
      });

    return () => cancel();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));

    userServices.delete(user.id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 1, name: 'Siavash' };
    setUsers([newUser, ...users]);

    userServices
      .create(newUser)
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];

    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

    userServices.update(updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };
  return (
    <>
      {error && <p className='text-danger'>{error}</p>}
      {isLoading && <div className='spinner-border'></div>}
      <button className='btn btn-outline-primary mb-3' onClick={addUser}>
        Add
      </button>
      <ul className='list-group'>
        {users.map((user) => (
          <li
            key={user.id}
            className='list-group-item d-flex justify-content-between'
          >
            {user.name}
            <div>
              <button
                className='btn btn-outline-secondary mx-1'
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                className='btn btn-outline-danger'
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
