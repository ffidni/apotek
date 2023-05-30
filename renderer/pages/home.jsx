import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Context } from "../components/Context";
import { getItem } from "../utils/db";
import { show } from "../utils/toast";
import Format from "date-fns/format";

function Home() {
  const { user, setUser } = useContext(Context);
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  async function getLogs(date = "") {
    console.log(date);
    const result = await getItem("log", date);
    if (result.status === 200) {
      setLogs(result.response);
    } else {
      show("Logs gagal dimuat.", true);
    }
  }

  useEffect(() => {
    const session = window.sessionStorage.getItem("user");
    let user_session = JSON.parse(session);
    if (!session) {
      router.replace("/login");
    } else {
      setUser(user_session);
      console.log(user);
      if (user_session.type_user === "apoteker") router.replace("/resep");
      else if (user_session.type_user === "kasir") router.replace("/transaksi");
      else getLogs();
    }
  }, []);

  return (
    <div className="w-screen p-20">
      <div className="title">Selamat datang, {user && user.username}</div>
      <div className="form">
        <div className="input">
          <input
            type="date"
            className="input border-2"
            onChange={(e) =>
              getLogs(Format(new Date(e.target.value), "yyyy-MM-dd"))
            }
          />
        </div>
        <div className="list border-2 p-2">
          <div className="header p-2 border-2 flex w-full justify-between">
            <p>Aktifitas</p>
            <p>Waktu</p>
            <p>ID User</p>
          </div>
          <div className="logs mt-2">
            {logs.map((log) => {
              return (
                <div className="content flex p-2 border  justify-between">
                  <p>{log.aktifitas}</p>
                  <p>{log.waktu}</p>
                  <p>{log.id_user}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
