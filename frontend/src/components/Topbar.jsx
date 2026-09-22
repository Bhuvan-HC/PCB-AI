import { Bell, Wifi, UserCircle } from "lucide-react";

function Topbar() {
    return (
        <header className="topbar">
            <div>
                <h1>PCB Fault Diagnostic System</h1>
                <p>Automated inspection & intelligent fault localization</p>
            </div>

            <div className="topbar-right">
                <div className="connection-status">
                    <Wifi size={17} />
                    <span>ESP32 Connected</span>
                    <span className="status-dot"></span>
                </div>

                <button className="icon-button">
                    <Bell size={19} />
                </button>

                <div className="user-profile">
                    <UserCircle size={32} />
                    <div>
                        <strong>Operator</strong>
                        <span>Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;