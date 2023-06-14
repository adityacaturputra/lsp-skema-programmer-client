import React, { useState, ChangeEvent } from "react";
import UserDataService from "../services/UserService";
import IUserData from '../types/User';
import { notifications } from "@mantine/notifications";
import nProgress from "nprogress";

const AddUser: React.FC = () => {
  const initialUserState = {
    id: null,
    name: "",
    position: "",
    salary: 0,
    phone: "",
    address: "",
  };
  const [user, setUser] = useState<IUserData>(initialUserState);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  
  const saveUser = () => {
    nProgress.start();
    var data = {
      name: user.name,
      position: user.position,
      salary: user.salary,
      phone: user.phone,
      address: user.address,
    };

    UserDataService.create(data)
      .then((response: any) => {
        setUser({
          id: response.data.id,
          name: response.data.name,
          position: response.data.position,
          salary: response.data.salary,
          phone: response.data.phone,
          address: response.data.address,
        });
        setSubmitted(true);
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

  const newUser = () => {
    setUser(initialUserState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>Pegawai Sukses Ditambah!</h4>
          <button className="btn btn-success" onClick={newUser}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={user.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Jabatan</label>
            <input
              type="text"
              className="form-control"
              id="position"
              required
              value={user.position}
              onChange={handleInputChange}
              name="position"
            />
          </div>
          <div className="form-group">
            <label htmlFor="salary">Gaji Pokok</label>
            <input
              type="text"
              className="form-control"
              id="salary"
              required
              value={user.salary}
              onChange={handleInputChange}
              name="salary"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">No Telepon</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              required
              value={user.phone}
              onChange={handleInputChange}
              name="phone"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Alamat</label>
            <input
              type="text"
              className="form-control"
              id="address"
              required
              value={user.address}
              onChange={handleInputChange}
              name="address"
            />
          </div>

          <button onClick={saveUser} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
