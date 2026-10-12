import { useEffect, useState } from "react";

import {
    Activity,
    Zap,
    Gauge,
    Thermometer,
    Radio,
    CheckCircle2,
    ArrowRight,
    BrainCircuit,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "../styles/measurements.css";

function Measurements() {
    const navigate = useNavigate();

    // Preserve LM7805 as the default PCB.
    const [pcbType] = useState(
        () => sessionStorage.getItem("pcbType") || "LM7805"
    );

    const isLM2596S = pcbType === "LM2596S";

    const [running, setRunning] = useState(true);
    const [diagnosis, setDiagnosis] = useState(null);

    const [values, setValues] = useState(() => {
        const saved = sessionStorage.getItem("pcbMeasurements");

        if (saved) {
            try {
                const measurements = JSON.parse(saved);

                return {
                    inputVoltage: Number(
                        measurements.input_voltage ?? 12.02
                    ),
                    outputVoltage: Number(
                        measurements.output_voltage ?? 5.01
                    ),
                    current: Number(measurements.current ?? 0.18),
                    temperature: Number(
                        measurements.temperature_1 ?? 29.4
                    ),
                };
            } catch (error) {
                console.error(
                    "Failed to load saved measurements:",
                    error
                );
            }
        }

        return {
            inputVoltage: 12.02,
            outputVoltage: 5.01,
            current: 0.18,
            temperature: 29.4,
        };
    });

    // Simulation only: replace with ESP32 measurements later.
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setValues((previous) => ({
                inputVoltage: +(
                    previous.inputVoltage +
                    (Math.random() * 0.08 - 0.04)
                ).toFixed(2),

                outputVoltage: +(
                    previous.outputVoltage +
                    (Math.random() * 0.06 - 0.03)
                ).toFixed(2),

                current: +(
                    previous.current +
                    (Math.random() * 0.04 - 0.02)
                ).toFixed(2),

                temperature: +(
                    previous.temperature +
                    (Math.random() * 0.8 - 0.4)
                ).toFixed(1),
            }));
        }, 1500);

        return () => clearInterval(interval);
    }, [running]);

    // Load the diagnosis returned by the backend.
    useEffect(() => {
        const savedDiagnosis = sessionStorage.getItem("pcbDiagnosis");

        if (savedDiagnosis) {
            try {
                setDiagnosis(JSON.parse(savedDiagnosis));
            } catch (error) {
                console.error(
                    "Failed to load AI diagnosis:",
                    error
                );
            }
        }
    }, []);

    const continueToDiagnosis = () => {
        // These values are simulated display values, not hardware readings.
        const savedMeasurements = {
            input_voltage: values.inputVoltage,
            output_voltage: values.outputVoltage,
            current: values.current,
            temperature_1: values.temperature,
            temperature_2: values.temperature,
            tp1_voltage: values.inputVoltage,
            tp2_voltage: isLM2596S
                ? values.inputVoltage
                : +(values.inputVoltage - 0.7).toFixed(2),
            tp3_voltage: values.outputVoltage,
            continuity: 1,
            pcb_type: pcbType,
            measurement_mode: "simulation",
        };

        sessionStorage.setItem(
            "pcbMeasurements",
            JSON.stringify(savedMeasurements)
        );

        navigate("/diagnosis");
    };

    const testPoints = isLM2596S
        ? [
            {
                point: "TP1",
                location: "Input Supply",
                voltage: values.inputVoltage,
                resistance: "—",
            },
            {
                point: "TP2",
                location: "Switching / Diode Section",
                voltage: +(values.inputVoltage - 0.7).toFixed(2),
                resistance: "—",
            },
            {
                point: "TP3",
                location: "Regulated Output",
                voltage: values.outputVoltage,
                resistance: "—",
            },
        ]
        : [
            {
                point: "TP1",
                location: "Input Supply",
                voltage: values.inputVoltage,
                resistance: "—",
            },
            {
                point: "TP2",
                location: "After D1",
                voltage: 11.31,
                resistance: "—",
            },
            {
                point: "TP3",
                location: "LM7805 Input",
                voltage: 11.29,
                resistance: "—",
            },
            {
                point: "TP4",
                location: "LM7805 Output",
                voltage: values.outputVoltage,
                resistance: "—",
            },
            {
                point: "TP5",
                location: "C1 Section",
                voltage: 5.02,
                resistance: "1.02 kΩ",
            },
            {
                point: "TP6",
                location: "Output Section",
                voltage: 5.01,
                resistance: "980 Ω",
            },
        ];

    return (
        <div className="measurements-page">
            {/* HEADER */}
            <div className="measurements-header">
                <div>
                    <span className="eyebrow">ELECTRICAL TEST</span>

                    <h2>Live Measurements</h2>

                    <p>
                        {pcbType} electrical and temperature measurements.
                    </p>
                </div>

                <div className="acquisition-status">
                    <span className="pulse-dot"></span>
                    {running
                        ? "SIMULATED DATA ACTIVE"
                        : "DATA ACQUISITION PAUSED"}
                </div>
            </div>

            {/* SIMULATION NOTICE */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    color: "#9a3412",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                }}
            >
                <Activity size={18} />

                <span>
                    <strong>Simulation Mode:</strong>{" "}
                    Values are generated by software and are not actual
                    hardware measurements. ESP32 integration is pending.
                </span>
            </div>

            {/* PROGRESS */}
            <div className="measurement-progress">
                <div className="progress-top">
                    <div>
                        <strong>
                            Automated PCB Test
                        </strong>

                        <span>
                            {pcbType} measurement simulation
                        </span>
                    </div>

                    <strong>{running ? "68%" : "Paused"}</strong>
                </div>

                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>

                <div className="progress-info">
                    <span>
                        {testPoints.length} configured display points
                    </span>

                    <span>Simulation → FastAPI → AI</span>
                </div>
            </div>

            {/* MEASUREMENT CARDS */}
            <div className="measurement-grid">
                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon blue">
                            <Zap size={21} />
                        </div>

                        <span className="normal-badge">SIMULATED</span>
                    </div>

                    <span className="measurement-label">
                        INPUT VOLTAGE
                    </span>

                    <strong>
                        {values.inputVoltage.toFixed(2)}
                        <small> V</small>
                    </strong>

                    <p>Nominal example: 12 V</p>
                </div>

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon green">
                            <Gauge size={21} />
                        </div>

                        <span className="normal-badge">SIMULATED</span>
                    </div>

                    <span className="measurement-label">
                        OUTPUT VOLTAGE
                    </span>

                    <strong>
                        {values.outputVoltage.toFixed(2)}
                        <small> V</small>
                    </strong>

                    <p>Nominal example: 5 V</p>
                </div>

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon purple">
                            <Activity size={21} />
                        </div>

                        <span className="normal-badge">SIMULATED</span>
                    </div>

                    <span className="measurement-label">
                        CURRENT
                    </span>

                    <strong>
                        {values.current.toFixed(2)}
                        <small> A</small>
                    </strong>

                    <p>Software-generated example</p>
                </div>

                <div className="measurement-card">
                    <div className="measurement-card-top">
                        <div className="measurement-icon orange">
                            <Thermometer size={21} />
                        </div>

                        <span className="normal-badge">SIMULATED</span>
                    </div>

                    <span className="measurement-label">
                        TEMPERATURE
                    </span>

                    <strong>
                        {values.temperature.toFixed(1)}
                        <small> °C</small>
                    </strong>

                    <p>Example temperature only</p>
                </div>
            </div>

            {/* TEST POINTS AND HARDWARE */}
            <div className="measurement-main-grid">
                <div className="panel measurement-table-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>Test Point Measurements</h3>

                            <p>
                                {pcbType} simulated test-point values
                            </p>
                        </div>

                        <span className="live-label">
                            <span></span>
                            SIMULATION
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
                                {testPoints.map((point) => (
                                    <tr key={point.point}>
                                        <td className="point-name">
                                            {point.point}
                                        </td>

                                        <td>{point.location}</td>

                                        <td>
                                            {Number(point.voltage).toFixed(2)} V
                                        </td>

                                        <td>{point.resistance}</td>

                                        <td>
                                            <span className="table-normal">
                                                Simulated
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* HARDWARE STATUS */}
                <div className="panel hardware-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>Acquisition Hardware</h3>

                            <p>Hardware integration status</p>
                        </div>
                    </div>

                    <div className="hardware-list">
                        {[
                            {
                                name: "ESP32 DevKit V1",
                                icon: <Radio size={18} />,
                            },
                            {
                                name: "ADS1115 ADC",
                                icon: <Activity size={18} />,
                            },
                            {
                                name: "INA219",
                                icon: <Zap size={18} />,
                            },
                            {
                                name: "CD74HC4067",
                                icon: <Gauge size={18} />,
                            },
                            {
                                name: "DS18B20",
                                icon: <Thermometer size={18} />,
                            },
                        ].map((item) => (
                            <div className="hardware-item" key={item.name}>
                                {item.icon}

                                <div>
                                    <strong>{item.name}</strong>

                                    <span>
                                        Awaiting hardware integration
                                    </span>
                                </div>

                                <span
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        color: "#d97706",
                                    }}
                                >
                                    SIM
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI STATUS */}
            <div
                style={{
                    marginTop: "22px",
                    padding: "20px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "13px",
                    }}
                >
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <BrainCircuit size={21} />
                    </div>

                    <div>
                        <strong>AI Diagnosis</strong>

                        <p
                            style={{
                                margin: "4px 0 0",
                                color: "#64748b",
                                fontSize: "13px",
                            }}
                        >
                            {diagnosis
                                ? `${pcbType} diagnosis result available`
                                : "No diagnosis result available"}
                        </p>
                    </div>
                </div>

                {diagnosis && (
                    <span
                        style={{
                            padding: "8px 12px",
                            borderRadius: "999px",
                            background: "#ecfdf5",
                            color: "#047857",
                            fontSize: "12px",
                            fontWeight: "700",
                        }}
                    >
                        RESULT READY
                    </span>
                )}
            </div>

            {/* ACTION */}
            <div className="measurement-action">
                <div>
                    <strong>Continue to diagnosis?</strong>

                    <p>
                        The diagnosis was generated during the New PCB Test.
                        The display simulation does not rerun the AI model.
                    </p>
                </div>

                <div className="action-buttons">
                    <button
                        className="stop-btn"
                        onClick={() => setRunning(!running)}
                    >
                        {running
                            ? "Pause Simulation"
                            : "Resume Simulation"}
                    </button>

                    <button
                        className="analysis-btn"
                        onClick={continueToDiagnosis}
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