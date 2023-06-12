import React, { useState, ChangeEvent } from "react";
import UserDataService from "../services/UserService";
import IUserData from '../types/User';

const AddUser: React.FC = () => {
  const initialUserState = {
    id: null,
    name: "",
    jabatan: "",
    gaji_pokok: 0,
  };
  const [user, setUser] = useState<IUserData>(initialUserState);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const saveUser = () => {
    var data = {
      name: user.name,
      jabatan: user.jabatan,
      gaji_pokok: user.gaji_pokok
    };

    UserDataService.create(data)
      .then((response: any) => {
        setUser({
          id: response.data.id,
          name: response.data.name,
          jabatan: response.data.jabatan,
          gaji_pokok: response.data.gaji_pokok,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
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
            <label htmlFor="jabatan">Jabatan</label>
            <input
              type="text"
              className="form-control"
              id="jabatan"
              required
              value={user.jabatan}
              onChange={handleInputChange}
              name="jabatan"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gaji_pokok">Gaji Pokok</label>
            <input
              type="text"
              className="form-control"
              id="gaji_pokok"
              required
              value={user.gaji_pokok}
              onChange={handleInputChange}
              name="gaji_pokok"
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
