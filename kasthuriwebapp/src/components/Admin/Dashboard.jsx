import MenuBar from "./MenuBar";
import { AppContext } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import { useContext } from "react";

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);
  return (
    <div>
      <MenuBar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            {/* SIDEBAR CONTENT */}
            <Sidebar activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
