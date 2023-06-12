import React, { useState, useEffect, ChangeEvent } from "react";
import UserDataService from "../services/UserService";
import { Link } from "react-router-dom";
import IUserData from '../types/User';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<Array<IUserData>>([]);
  const [currentUser, setCurrentUser] = useState<IUserData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    retrieveUsers();
  }, []);

  const onChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const retrieveUsers = () => {
    UserDataService.getAll()
      .then((response: any) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveUsers();
    setCurrentUser(null);
    setCurrentIndex(-1);
  };

  const setActiveUser = (user: IUserData, index: number) => {
    setCurrentUser(user);
    setCurrentIndex(index);
  };

  const removeAllUsers = () => {
    UserDataService.removeAll()
      .then((response: any) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const findByName = () => {
    UserDataService.findByName(searchName)
      .then((response: any) => {
        setUsers(response.data);
        setCurrentUser(null);
        setCurrentIndex(-1);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const bonus = +currentUser!?.gaji_pokok * (
    currentUser?.jabatan?.toLowerCase()?.includes('manager') ? 1/2 :
    currentUser?.jabatan?.toLowerCase()?.includes('supervisor') ? 4/10 :
    currentUser?.jabatan?.toLowerCase()?.includes('staff') ? 3/10 : 1
  );
  const pph = +currentUser!?.gaji_pokok * 5/100;
  const gaji = +currentUser!?.gaji_pokok + bonus - pph

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Daftar Pegawai</h4>

        <ul className="list-group">
          {users &&
            users.map((user, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveUser(user, index)}
                key={index}
              >
                {user.name}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllUsers}
        >
          Hapus Semua Pegawai
        </button>
      </div>
      <div className="col-md-6">
        {currentUser ? (
          <div>
            <h4>Pegawai</h4>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{" "}
              {currentUser.name}
            </div>
            <div>
              <label>
                <strong>Jabatan:</strong>
              </label>{" "}
              {currentUser.jabatan}
            </div>
            <div>
              <label>
                <strong>Gaji Pokok:</strong>
              </label>{" "}
              {currentUser.gaji_pokok}
            </div>
            <div>
              <label>
                <strong>Bonus:</strong>
              </label>{" "}
              {bonus}
            </div>
            <div>
              <label>
                <strong>PPH:</strong>
              </label>{" "}
              {pph}
            </div>
            <div>
              <label>
                <strong>Gaji (Gaji Pokok + Bonus - PPH) :</strong>
              </label>{" "}
              {gaji}
            </div>

            <Link
              to={"/users/" + currentUser.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Klik salah satu Pegawai...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
