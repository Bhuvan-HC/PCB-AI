import {
    ScanLine,
    CheckCircle2,
    AlertTriangle,
    Activity,
    ArrowRight,
    Clock3,
    Cpu,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard">

            {/* PAGE HEADER */}
            <div className="dashboard-header">
                <div>
                    <span className="eyebrow">CONTROL CENTER</span>
                    <h2>Diagnostic Dashboard</h2>
                    <p>
                        Monitor PCB inspection, measurements and AI-based fault diagnosis.
                    </p>
                </div>

                <button
                    className="start-test-btn"
                    onClick={() => navigate("/new-test")}
                >
                    <ScanLine size={18} />
                    Start New PCB Test
                </button>
            </div>

            {/* SYSTEM OVERVIEW */}
            <div className="overview-grid">

                <div className="stat-card">
                    <div className="stat-icon blue">
                        <ScanLine size={20} />
                    </div>

                    <div>
                        <span>Total Tests</span>
                        <strong>128</strong>
                        <small>+12 this week</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>Healthy PCBs</span>
                        <strong>94</strong>
                        <small>73.4% of tests</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon red">
                        <AlertTriangle size={20} />
                    </div>

                    <div>
                        <span>Faulty PCBs</span>
                        <strong>34</strong>
                        <small>26.6% of tests</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                        <Activity size={20} />
                    </div>

                    <div>
                        <span>Avg. Confidence</span>
                        <strong>91.8%</strong>
                        <small>AI diagnosis</small>
                    </div>
                </div>

            </div>

            {/* MAIN GRID */}
            <div className="dashboard-main-grid">

                {/* SYSTEM STATUS */}
                <div className="panel system-panel">

                    <div className="panel-header">
                        <div>
                            <h3>System Overview</h3>
                            <p>Current hardware and software status</p>
                        </div>

                        <span className="ready-badge">
                            <span></span>
                            READY
                        </span>
                    </div>

                    <div className="system-list">

                        <div className="system-row">
                            <div className="system-name">
                                <Cpu size={18} />
                                <div>
                                    <strong>ESP32 Controller</strong>
                                    <small>Data acquisition unit</small>
                                </div>
                            </div>
                            <span className="online">Connected</span>
                        </div>

                        <div className="system-row">
                            <div className="system-name">
                                <Zap size={18} />
                                <div>
                                    <strong>Measurement System</strong>
                                    <small>ADS1115 + INA219</small>
                                </div>
                            </div>
                            <span className="online">Ready</span>
                        </div>

                        <div className="system-row">
                            <div className="system-name">
                                <ScanLine size={18} />
                                <div>
                                    <strong>Vision System</strong>
                                    <small>Camera + OpenCV + YOLO</small>
                                </div>
                            </div>
                            <span className="online">Ready</span>
                        </div>

                        <div className="system-row">
                            <div className="system-name">
                                <Activity size={18} />
                                <div>
                                    <strong>AI Diagnostic Model</strong>
                                    <small>Multimodal analysis engine</small>
                                </div>
                            </div>
                            <span className="online">Loaded</span>
                        </div>

                    </div>
                </div>

                {/* QUICK TEST */}
                <div className="panel quick-panel">

                    <div className="panel-header">
                        <div>
                            <h3>Quick Test</h3>
                            <p>Begin an automated inspection</p>
                        </div>
                    </div>

                    <div className="quick-content">

                        <div className="pcb-symbol">
                            <div className="pcb-chip">U1</div>
                            <div className="pcb-line line-one"></div>
                            <div className="pcb-line line-two"></div>
                            <div className="pcb-component c-one">C1</div>
                            <div className="pcb-component c-two">R1</div>
                            <div className="pcb-component c-three">D1</div>
                        </div>

                        <h4>LM7805 Power Supply PCB</h4>

                        <p>
                            Place the PCB in the fixture and start the automated inspection.
                        </p>

                        <button
                            className="quick-start"
                            onClick={() => navigate("/new-test")}
                        >
                            Begin Inspection
                            <ArrowRight size={17} />
                        </button>

                    </div>
                </div>

            </div>

            {/* RECENT TESTS */}
            <div className="panel recent-panel">

                <div className="panel-header">
                    <div>
                        <h3>Recent Tests</h3>
                        <p>Latest PCB diagnostic results</p>
                    </div>

                    <button
                        className="view-history"
                        onClick={() => navigate("/history")}
                    >
                        View All
                        <ArrowRight size={15} />
                    </button>
                </div>

                <div className="table-wrapper">
                    <table>

                        <thead>
                            <tr>
                                <th>TEST ID</th>
                                <th>PCB TYPE</th>
                                <th>RESULT</th>
                                <th>FAULT</th>
                                <th>CONFIDENCE</th>
                                <th>TIME</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>
                                <td className="test-id">T-00128</td>
                                <td>LM7805 Power Supply</td>

                                <td>
                                    <span className="result healthy">
                                        <CheckCircle2 size={14} />
                                        Healthy
                                    </span>
                                </td>

                                <td>—</td>
                                <td>96%</td>

                                <td>
                                    <span className="time">
                                        <Clock3 size={13} />
                                        10 min ago
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td className="test-id">T-00127</td>
                                <td>LM7805 Power Supply</td>

                                <td>
                                    <span className="result faulty">
                                        <AlertTriangle size={14} />
                                        Faulty
                                    </span>
                                </td>

                                <td>C1 — Shorted Capacitor</td>
                                <td>91%</td>

                                <td>
                                    <span className="time">
                                        <Clock3 size={13} />
                                        34 min ago
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td className="test-id">T-00126</td>
                                <td>LM7805 Power Supply</td>

                                <td>
                                    <span className="result faulty">
                                        <AlertTriangle size={14} />
                                        Faulty
                                    </span>
                                </td>

                                <td>R1 — Open Resistor</td>
                                <td>94%</td>

                                <td>
                                    <span className="time">
                                        <Clock3 size={13} />
                                        1 hr ago
                                    </span>
                                </td>
                            </tr>

                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;