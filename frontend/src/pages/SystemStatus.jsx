import {
    CheckCircle2,
    Wifi,
    Activity,
    Camera,
    BrainCircuit,
    Cpu,
    Zap,
    Thermometer,
    Radio,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";

function SystemStatus() {
    const [refreshing, setRefreshing] = useState(false);

    const refreshStatus = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const systems = [
        {
            name: "ESP32 Controller",
            description: "Main hardware controller",
            icon: Cpu,
            status: "Connected",
            detail: "USB Serial",
        },
        {
            name: "ADS1115 ADC",
            description: "16-bit voltage measurement",
            icon: Activity,
            status: "Connected",
            detail: "I²C Address: 0x48",
        },
        {
            name: "INA219",
            description: "Current & power measurement",
            icon: Zap,
            status: "Connected",
            detail: "I²C Address: 0x40",
        },
        {
            name: "CD74HC4067",
            description: "16-channel test-point multiplexer",
            icon: Radio,
            status: "Connected",
            detail: "Channel 0–15",
        },
        {
            name: "DS18B20 Sensors",
            description: "Component temperature monitoring",
            icon: Thermometer,
            status: "Connected",
            detail: "2 Sensors detected",
        },
        {
            name: "Vision System",
            description: "Camera & PCB visual inspection",
            icon: Camera,
            status: "Ready",
            detail: "OpenCV + YOLO",
        },
        {
            name: "AI Diagnostic Model",
            description: "Fault classification & localization",
            icon: BrainCircuit,
            status: "Ready",
            detail: "Model loaded",
        },
    ];

    return (
        <>
            <style>{`

        .system-page {
          max-width: 1500px;
          margin: 0 auto;
        }

        .system-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
        }

        .system-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #172033;
          margin: 6px 0;
        }

        .system-header p {
          color: #6b7280;
          font-size: 14px;
        }

        .refresh-button {
          height: 42px;
          padding: 0 16px;
          border: 1px solid #dfe5ed;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #374151;
          font-size: 13px;
        }

        .refresh-button:hover {
          background: #f5f7fa;
        }

        .refresh-button .spin {
          animation: system-spin 1s linear infinite;
        }

        @keyframes system-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* OVERALL STATUS */

        .overall-status {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .overall-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .overall-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #ecfdf3;
          color: #16834b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overall-left h3 {
          font-size: 18px;
          color: #172033;
          margin-bottom: 4px;
        }

        .overall-left p {
          color: #7a8494;
          font-size: 13px;
        }

        .overall-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #ecfdf3;
          color: #16834b;
          padding: 8px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        /* GRID */

        .system-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .system-card {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.2s ease;
        }

        .system-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 35, 60, 0.06);
        }

        .system-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .system-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #eef4ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .system-card h3 {
          font-size: 14px;
          color: #172033;
          margin-bottom: 4px;
        }

        .system-card p {
          font-size: 12px;
          color: #7a8494;
          margin-bottom: 6px;
        }

        .system-detail {
          font-size: 11px;
          color: #9aa3b2;
        }

        .system-card-right {
          text-align: right;
        }

        .connected-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #16834b;
          font-size: 12px;
          font-weight: 700;
        }

        /* COMMUNICATION */

        .communication-panel {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 14px;
          padding: 22px;
          margin-top: 22px;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .panel-title-icon {
          color: #2563eb;
        }

        .panel-title h3 {
          color: #172033;
          font-size: 16px;
        }

        .panel-title p {
          color: #7a8494;
          font-size: 12px;
          margin-top: 3px;
        }

        .communication-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .flow-item {
          flex: 1;
          padding: 16px;
          background: #f8fafc;
          border-radius: 10px;
          text-align: center;
        }

        .flow-item strong {
          display: block;
          color: #172033;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .flow-item span {
          color: #7a8494;
          font-size: 11px;
        }

        .flow-arrow {
          color: #9aa3b2;
          font-size: 20px;
        }

        @media (max-width: 850px) {
          .system-grid {
            grid-template-columns: 1fr;
          }

          .communication-flow {
            flex-direction: column;
          }

          .flow-item {
            width: 100%;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }
        }

        @media (max-width: 600px) {
          .system-header {
            align-items: flex-start;
            gap: 15px;
          }

          .overall-status {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }
        }

      `}</style>

            <div className="system-page">

                {/* HEADER */}

                <div className="system-header">
                    <div>
                        <span className="eyebrow">SYSTEM MONITOR</span>

                        <h2>System Status</h2>

                        <p>
                            Monitor hardware, sensors, communication and AI services.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={refreshStatus}
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "spin" : ""}
                        />
                        Refresh Status
                    </button>
                </div>

                {/* OVERALL STATUS */}

                <div className="overall-status">

                    <div className="overall-left">

                        <div className="overall-icon">
                            <CheckCircle2 size={27} />
                        </div>

                        <div>
                            <h3>All Systems Operational</h3>

                            <p>
                                Hardware and software components are ready for PCB testing.
                            </p>
                        </div>

                    </div>

                    <div className="overall-badge">
                        <span className="status-dot"></span>
                        SYSTEM READY
                    </div>

                </div>

                {/* SYSTEM COMPONENTS */}

                <div className="system-grid">

                    {systems.map((system) => {

                        const Icon = system.icon;

                        return (
                            <div
                                className="system-card"
                                key={system.name}
                            >

                                <div className="system-card-left">

                                    <div className="system-card-icon">
                                        <Icon size={21} />
                                    </div>

                                    <div>
                                        <h3>{system.name}</h3>

                                        <p>{system.description}</p>

                                        <span className="system-detail">
                                            {system.detail}
                                        </span>
                                    </div>

                                </div>

                                <div className="system-card-right">

                                    <span className="connected-status">
                                        <CheckCircle2 size={15} />
                                        {system.status}
                                    </span>

                                </div>

                            </div>
                        );

                    })}

                </div>

                {/* COMMUNICATION */}

                <div className="communication-panel">

                    <div className="panel-title">

                        <Wifi
                            size={20}
                            className="panel-title-icon"
                        />

                        <div>
                            <h3>Communication Flow</h3>

                            <p>
                                Data path used during automated PCB testing
                            </p>
                        </div>

                    </div>

                    <div className="communication-flow">

                        <div className="flow-item">
                            <strong>PCB Test Fixture</strong>
                            <span>Test points & sensors</span>
                        </div>

                        <div className="flow-arrow">→</div>

                        <div className="flow-item">
                            <strong>ESP32</strong>
                            <span>Data acquisition</span>
                        </div>

                        <div className="flow-arrow">→</div>

                        <div className="flow-item">
                            <strong>USB Serial</strong>
                            <span>Data transfer</span>
                        </div>

                        <div className="flow-arrow">→</div>

                        <div className="flow-item">
                            <strong>Laptop</strong>
                            <span>AI diagnosis</span>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default SystemStatus;