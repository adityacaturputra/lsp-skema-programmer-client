import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import UserDataService from "../services/UserService";
import IUserData from "../types/User";

const User: React.FC = () => {
  const { id }= useParams();
  let navigate = useNavigate();

  const initialUserState = {
    id: null,
    name: "",
    jabatan: "",
    gaji_pokok: 0
  };
  const [currentUser, setCurrentUser] = useState<IUserData>(initialUserState);
  const [message, setMessage] = useState<string>("");

  const getUser = (id: string) => {
    UserDataService.get(id)
      .then((response: any) => {
        setCurrentUser(response.data);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id)
      getUser(id);
  }, [id]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const updateUser = () => {
    UserDataService.update(currentUser.id, currentUser)
      .then((response: any) => {
        console.log(response.data);
        setMessage("The user was updated successfully!");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const deleteUser = () => {
    UserDataService.remove(currentUser.id)
      .then((response: any) => {
        console.log(response.data);
        navigate("/users");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentUser ? (
        <div className="edit-form">
          <h4>Pegawai</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="jabatan">Jabatan</label>
              <input
                type="text"
                className="form-control"
                id="jabatan"
                name="jabatan"
                value={currentUser.jabatan}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gaji_pokok">Gaji Pokok</label>
              <input
                type="text"
                className="form-control"
                id="gaji_pokok"
                name="gaji_pokok"
                value={currentUser.gaji_pokok}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteUser}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateUser}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Klik salah satu Pegawai...</p>
        </div>
      )}
    </div>
  );
};

export default User;
