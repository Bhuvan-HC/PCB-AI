import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ScanLine,
    Activity,
    BrainCircuit,
    History,
    Cpu,
} from "lucide-react";

function Sidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: LayoutDashboard,
        },
        {
            name: "New PCB Test",
            path: "/new-test",
            icon: ScanLine,
        },
        {
            name: "Measurements",
            path: "/measurements",
            icon: Activity,
        },
        {
            name: "AI Diagnosis",
            path: "/diagnosis",
            icon: BrainCircuit,
        },
        {
            name: "Test History",
            path: "/history",
            icon: History,
        },
        {
            name: "System Status",
            path: "/system-status",
            icon: Cpu,
        },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">PCB</div>

                <div>
                    <h2>PCB AI</h2>
                    <span>Diagnostic System</span>
                </div>
            </div>

            <div className="menu-title">MAIN MENU</div>

            <nav>
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <Icon size={19} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-bottom">
                <div className="system-mini-status">
                    <span className="status-dot"></span>

                    <div>
                        <strong>System Ready</strong>
                        <small>All systems operational</small>
                    </div>
                </div>

                <div className="version">
                    PCB AI v1.0
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;