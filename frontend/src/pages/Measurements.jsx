import { useEffect, useState } from "react";
import {
    Activity,
    Zap,
    Gauge,
    Thermometer,
    Radio,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/measurements.css";

function Measurements() {
    const navigate = useNavigate();

    const [running, setRunning] = useState(true);

    const [values, setValues] = useState({
        inputVoltage: 12.02,
        outputVoltage: 5.01,
        current: 0.18,
        temperature: 29.4,
    });

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setValues((prev) => ({
                inputVoltage: +(12 + (Math.random() * 0.08 - 0.04)).toFixed(2),
                outputVoltage: +(5 + (Math.random() * 0.06 - 0.03)).toFixed(2),
                current: +(0.18 + (Math.random() * 0.04 - 0.02)).toFixed(2),
                temperature: +(29.4 + (Math.random() * 0.8 - 0.4)).toFixed(1),
            }));
        }, 1500);

        return () => clearInterval(interval);
    }, [running]);

    return (
        <div className="measurements-page">

            {/* HEADER */}
            <div className="measurements-header">
                <div>
                    <span className="eyebrow">ELECTRICAL TEST</span>
                    <h2>Live Measurements</h2>
                    <p>
                        Real-time electrical and temperature measurements from the PCB.
                    </p>
                </div>

                <div className="acquisition-status">
                    <span className="pulse-dot"></span>
                    DATA ACQUISITION ACTIVE
                </div>
            </div>

            {/* PROGRESS */}
            <div className="measurement-progress">

                <div className="progress-top">
                    <div>
                        <strong>Automated PCB Test in Progress</strong>
                        <span>Collecting measurements from configured test points</span>
                    </div>

                    <strong>68%</strong>
                </div>

                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>

                <div className="progress-info">
                    <span>Test Point 7 of 10</span>
                    <span>ESP32 → USB → Laptop</span>
                </div>

            </div>

            {/* MEASUREMENT CARDS */}
            <div className="measurement-grid">

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon blue">
                            <Zap size={21} />
                        </div>
                        <span className="normal-badge">NORMAL</span>
                    </div>

                    <span className="measurement-label">INPUT VOLTAGE</span>
                    <strong>{values.inputVoltage} <small>V</small></strong>
                    <p>Expected: 11.5 – 12.5 V</p>
                </div>

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon green">
                            <Gauge size={21} />
                        </div>
                        <span className="normal-badge">NORMAL</span>
                    </div>

                    <span className="measurement-label">OUTPUT VOLTAGE</span>
                    <strong>{values.outputVoltage} <small>V</small></strong>
                    <p>Expected: 4.8 – 5.2 V</p>
                </div>

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon purple">
                            <Activity size={21} />
                        </div>
                        <span className="normal-badge">NORMAL</span>
                    </div>

                    <span className="measurement-label">CURRENT</span>
                    <strong>{values.current} <small>A</small></strong>
                    <p>Expected: &lt; 0.50 A</p>
                </div>

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon orange">
                            <Thermometer size={21} />
                        </div>
                        <span className="normal-badge">NORMAL</span>
                    </div>

                    <span className="measurement-label">TEMPERATURE</span>
                    <strong>{values.temperature} <small>°C</small></strong>
                    <p>Expected: &lt; 60 °C</p>
                </div>

            </div>

            {/* TEST POINTS */}
            <div className="measurement-main-grid">

                <div className="panel measurement-table-panel">

                    <div className="panel-heading">
                        <div>
                            <h3>Test Point Measurements</h3>
                            <p>Electrical values acquired through the multiplexer</p>
                        </div>

                        <span className="live-label">
                            <span></span>
                            LIVE
                        </span>
                    </div>

                    <div className="table-wrapper">
                        <table>

                            <thead>
                                <tr>
                                    <th>POINT</th>
                                    <th>LOCATION</th>
                                    <th>VOLTAGE</th>
                                    <th>RESISTANCE</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className="point-name">TP1</td>
                                    <td>Input Supply</td>
                                    <td>{values.inputVoltage} V</td>
                                    <td>—</td>
                                    <td><span className="table-normal">Normal</span></td>
                                </tr>

                                <tr>
                                    <td className="point-name">TP2</td>
                                    <td>After D1</td>
                                    <td>11.31 V</td>
                                    <td>—</td>
                                    <td><span className="table-normal">Normal</span></td>
                                </tr>

                                <tr>
                                    <td className="point-name">TP3</td>
                                    <td>LM7805 Input</td>
                                    <td>11.29 V</td>
                                    <td>—</td>
                                    <td><span className="table-normal">Normal</span></td>
                                </tr>

                                <tr>
                                    <td className="point-name">TP4</td>
                                    <td>LM7805 Output</td>
                                    <td>{values.outputVoltage} V</td>
                                    <td>—</td>
                                    <td><span className="table-normal">Normal</span></td>
                                </tr>

                                <tr>
                                    <td className="point-name">TP5</td>
                                    <td>C1 Section</td>
                                    <td>5.02 V</td>
                                    <td>1.02 kΩ</td>
                                    <td><span className="table-normal">Normal</span></td>
                                </tr>

                                <tr>
                                    <td className="point-name">TP6</td>
                                    <td>Output Section</td>
                                    <td>5.01 V</td>
                                    <td>980 Ω</td>
                                    <td><span className="table-normal">Normal</span></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* HARDWARE STATUS */}
                <div className="panel hardware-panel">

                    <div className="panel-heading">
                        <div>
                            <h3>Acquisition Hardware</h3>
                            <p>Connected measurement devices</p>
                        </div>
                    </div>

                    <div className="hardware-list">

                        <div className="hardware-item">
                            <Radio size={18} />
                            <div>
                                <strong>ESP32 DevKit V1</strong>
                                <span>USB Serial Connected</span>
                            </div>
                            <CheckCircle2 size={17} />
                        </div>

                        <div className="hardware-item">
                            <Activity size={18} />
                            <div>
                                <strong>ADS1115 ADC</strong>
                                <span>16-bit measurement</span>
                            </div>
                            <CheckCircle2 size={17} />
                        </div>

                        <div className="hardware-item">
                            <Zap size={18} />
                            <div>
                                <strong>INA219</strong>
                                <span>Current monitoring</span>
                            </div>
                            <CheckCircle2 size={17} />
                        </div>

                        <div className="hardware-item">
                            <Gauge size={18} />
                            <div>
                                <strong>CD74HC4067</strong>
                                <span>Test-point selection</span>
                            </div>
                            <CheckCircle2 size={17} />
                        </div>

                        <div className="hardware-item">
                            <Thermometer size={18} />
                            <div>
                                <strong>DS18B20</strong>
                                <span>Temperature monitoring</span>
                            </div>
                            <CheckCircle2 size={17} />
                        </div>

                    </div>

                </div>

            </div>

            {/* ACTION */}
            <div className="measurement-action">

                <div>
                    <strong>Electrical data collection complete?</strong>
                    <p>
                        Continue to AI analysis when all required measurements are available.
                    </p>
                </div>

                <div className="action-buttons">

                    <button
                        className="stop-btn"
                        onClick={() => setRunning(!running)}
                    >
                        {running ? "Pause Acquisition" : "Resume Acquisition"}
                    </button>

                    <button
                        className="analysis-btn"
                        onClick={() => navigate("/diagnosis")}
                    >
                        Continue to AI Diagnosis
                        <ArrowRight size={17} />
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Measurements;