import React, { useContext, useEffect } from "react";
import { ProSidebar, SidebarHeader, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaStethoscope,
  FaUser,
  FaHome,
  FaPills,
  FaChartBar,
  FaNotesMedical,
  FaMoneyBil,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { Context } from "./Context";
import Link from "next/link";

const Sidebar = ({ children }) => {
  const router = useRouter();
  const { user, setUser } = useContext(Context);
  const navs = [
    {
      title: "Log",
      path: "/home",
      icon: <FaHome className="text-xl" />,
      type_user: "admin",
    },
    {
      title: "User",
      path: "/user",
      icon: <FaUser className="text-xl" />,
      type_user: "admin",
    },
    {
      title: "Obat",
      path: "/obat",
      icon: <FaPills className="text-xl" />,
      type_user: "admin",
    },
    {
      title: "Laporan",
      path: "/laporan",
      icon: <FaChartBar className="text-xl" />,
      type_user: "admin",
    },
    {
      title: "Resep",
      path: "/resep",
      icon: <FaNotesMedical className="text-xl" />,
      type_user: "apoteker",
    },
    {
      title: "Transaksi",
      path: "/transaksi",
      icon: <FaUser className="text-xl" />,
      type_user: "kasir",
    },
    {
      title: "Logout",
      path: "/login",
      icon: <FaArrowLeft className="text-xl" />,
      type_user: "all",
    },
  ];
  const disabledPages = ["/login", "/register"];

  useEffect(() => {
    const session = window.sessionStorage.getItem("user");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  return (
    <div className="flex h-screen">
      {!disabledPages.includes(router.asPath) && (
        <ProSidebar className="shadow-xl">
          <SidebarHeader className="flex items-center  justify-center py-5 gap-3">
            <FaStethoscope className="text-4xl" />
            <p className="text-lg">
              Apotek <span className="text-3xl text-green-400">XYZ</span>
            </p>
          </SidebarHeader>
          <Menu>
            {navs.map((nav) => {
              return (
                user &&
                (user.type_user === nav.type_user ||
                  nav.type_user === "all") && (
                  <MenuItem
                    icon={nav.icon}
                    className={`hover:bg-green-100 ${
                      router.asPath === nav.path && "bg-green-300"
                    }`}
                  >
                    <Link href={nav.path}>{nav.title}</Link>
                  </MenuItem>
                )
              );
            })}
          </Menu>
        </ProSidebar>
      )}

      {children}
    </div>
  );
};

export default Sidebar;
