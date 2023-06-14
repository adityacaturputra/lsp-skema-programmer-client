import React, { useState, useEffect, ChangeEvent } from "react";
import UserDataService from "../services/UserService";
import { Link } from "react-router-dom";
import IUserData from '../types/User';
import { notifications } from "@mantine/notifications";
import nProgress from "nprogress";
import downloadFileWithFuntionality from "../utils/helpers/downloadFileWithFunctionality";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<Array<IUserData>>([]);
  const [currentUser, setCurrentUser] = useState<IUserData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [searchName, setSearchName] = useState<string>("");
  const [monthPayroll, setMonthPayroll] = useState<number>(1);

  useEffect(() => {
    retrieveUsers();
  }, []);

  const onChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };
  const onChangeMonthPayroll = (e: ChangeEvent<HTMLSelectElement>) => {
    const monthPayroll = +e.target.value;
    setMonthPayroll(monthPayroll);
  };

  const retrieveUsers = () => {
    nProgress.start();
    UserDataService.getAll() 
      .then((response: any) => {
        setUsers(response.data);
        nProgress.done();
      })
      .catch((e: Error) => {
        notifications.show({
          title: 'Maaf Terjadi Kegagalan',
          message: e.message,
        })
        nProgress.done();
      });
  };

  const generateReport = () => {
    downloadFileWithFuntionality({
      endpoint: '/users/payrolls/reports',
      filename: 'Laporan Penggajian',
      axiosConfigs: {
        params: {
          month_count: monthPayroll
        }
      }
    })
  }

  const refreshList = () => {
    retrieveUsers();
    setCurrentUser(null);
    setCurrentIndex(-1);
  };

  const setActiveUser = (user: IUserData, index: number) => {
    setCurrentUser(user);
    setCurrentIndex(index);
  };

  const removeUser = () => {
    if(window.confirm("Are you sure you want to remove?")) {
      nProgress.start();
      UserDataService.remove(currentUser?.id)
        .then((response: any) => {
          nProgress.done();
          refreshList();
        })
        .catch((e: Error) => {
          nProgress.done();
          notifications.show({
            title: 'Maaf Terjadi Kegagalan',
            message: e.message,
          })
        });
    }
  };

  const findByName = () => {
    nProgress.start();
    UserDataService.findByName(searchName)
      .then((response: any) => {
        setUsers(response.data);
        setCurrentUser(null);
        setCurrentIndex(-1);
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

  const bonus = +currentUser!?.salary * (
    currentUser?.position?.toLowerCase()?.includes('manager') ? 1/2 :
    currentUser?.position?.toLowerCase()?.includes('supervisor') ? 4/10 :
    currentUser?.position?.toLowerCase()?.includes('staff') ? 3/10 : 0
  );
  const pph = +currentUser!?.salary * 5/100;
  const gaji = +currentUser!?.salary + bonus - pph
  const totalGajiBulan = (+currentUser!?.salary + bonus - pph) * monthPayroll;

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
        <div className="input-group mb-3">
        <select className="form-select" onChange={onChangeMonthPayroll} value={monthPayroll} aria-label="Default select example">
          <option selected value={1}>1 Bulan</option>
          {[2,3,4,5,6,7,8,9,10,11,12,].map(month => (
            <option value={month}>{month} Bulan</option>
          ))}
        </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={generateReport}
            >
              Cetak Penggajian
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
              {currentUser.position}
            </div>
            <div>
              <label>
                <strong>No Telepon:</strong>
              </label>{" "}
              {currentUser.phone}
            </div>
            <div>
              <label>
                <strong>Alamat:</strong>
              </label>{" "}
              {currentUser.address}
            </div>
            <div>
              <label>
                <strong>Gaji Pokok:</strong>
              </label>{" "}
              {currentUser.salary}
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
            <div>
              <label>
                <strong>Total Gaji * {monthPayroll} Bulan :</strong>
              </label>{" "}
              {totalGajiBulan}
            </div>

            <Link
              to={"/users/" + currentUser.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
            <button
              className="badge badge-danger ml-2"
              onClick={removeUser}
            >
              Hapus Pegawai
            </button>
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
