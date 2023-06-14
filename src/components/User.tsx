import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import UserDataService from "../services/UserService";
import IUserData from "../types/User";
import { notifications } from "@mantine/notifications";
import nProgress from "nprogress";

const User: React.FC = () => {
  const { id }= useParams();
  let navigate = useNavigate();

  const initialUserState = {
    id: null,
    name: "",
    position: "",
    salary: 0,
    phone: "",
    address: "",
  };
  const [currentUser, setCurrentUser] = useState<IUserData>(initialUserState);
  const [message, setMessage] = useState<string>("");

  const getUser = (id: string) => {
    nProgress.start();
    UserDataService.get(id)
      .then((response: any) => {
        setCurrentUser(response.data);
        nProgress.done();
      })
      .catch((e: Error) => {
        nProgress.done();
        notifications.show({
          title: 'Maaf Terjadi Kegagalan',
          message: e.message,
        })
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
    nProgress.start();
    UserDataService.update(currentUser.id, currentUser)
      .then((response: any) => {
        setMessage("The user was updated successfully!");
        nProgress.done();
      })
      .catch((e: Error) => {
        console.log(e)
        notifications.show({
          title: 'Maaf Terjadi Kegagalan',
          message: e.message,
        })
        nProgress.done();
      });
  };

  const deleteUser = () => {
    nProgress.start();
    UserDataService.remove(currentUser.id)
      .then((response: any) => {
        nProgress.done();
        navigate("/users");
      })
      .catch((e: Error) => {
        nProgress.done();
        notifications.show({
          title: 'Maaf Terjadi Kegagalan',
          message: e.message,
        })
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
              <label htmlFor="position">Jabatan</label>
              <input
                type="text"
                className="form-control"
                id="position"
                name="position"
                value={currentUser.position}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Gaji Pokok</label>
              <input
                type="text"
                className="form-control"
                id="salary"
                name="salary"
                value={currentUser.salary}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">No Telepon</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={currentUser.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Alamat</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={currentUser.address}
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
