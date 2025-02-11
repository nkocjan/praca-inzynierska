import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.tsx";

const NKLayout = () => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <div style={{ width: "240px", padding: "20px", minHeight: "100vh" }}>
                <Navbar />
            </div>

            <main style={{ flexGrow: 1, padding: "20px", color: "white" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default NKLayout;
