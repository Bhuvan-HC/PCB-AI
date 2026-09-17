import {
    AlertTriangle,
    CheckCircle2,
    BrainCircuit,
    MapPin,
    Activity,
    Thermometer,
    Zap,
    ArrowRight,
    RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/diagnosis.css";

function Diagnosis() {
    const navigate = useNavigate();

    return (
        <div className="diagnosis-page">

            {/* HEADER */}
            <div className="diagnosis-header">
                <div>
                    <span className="eyebrow">AI ANALYSIS</span>
                    <h2>Fault Diagnosis</h2>
                    <p>
                        Multimodal analysis of visual and electrical PCB data.
                    </p>
                </div>

                <div className="analysis-complete">
                    <CheckCircle2 size={16} />
                    ANALYSIS COMPLETE
                </div>
            </div>

            {/* RESULT BANNER */}
            <div className="result-banner">

                <div className="result-status">
                    <div className="fault-icon">
                        <AlertTriangle size={27} />
                    </div>

                    <div>
                        <span>PCB STATUS</span>
                        <h3>FAULTY</h3>
                        <p>Abnormal behavior detected during automated testing.</p>
                    </div>
                </div>

                <div className="health-score">
                    <span>HEALTH SCORE</span>
                    <strong>45<span>/100</span></strong>
                </div>

            </div>

            {/* MAIN GRID */}
            <div className="diagnosis-grid">

                {/* PCB IMAGE */}
                <div className="panel pcb-diagnosis-panel">

                    <div className="panel-heading">
                        <div>
                            <h3>Fault Localization</h3>
                            <p>Suspected component identified by AI</p>
                        </div>

                        <span className="confidence-small">
                            91% Confidence
                        </span>
                    </div>

                    <div className="pcb-diagnosis-image">

                        <div className="pcb-board">

                            <div className="pcb-label r1">R1</div>

                            <div className="pcb-label d1">D1</div>

                            <div className="pcb-label u1">U1</div>

                            <div className="pcb-label c2">C2</div>

                            {/* SUSPECTED COMPONENT */}
                            <div className="suspected-component">
                                <span>C1</span>
                            </div>

                            <div className="fault-marker">
                                <div></div>
                            </div>

                            <div className="fault-line"></div>

                            <div className="fault-callout">
                                <strong>C1</strong>
                                <span>Suspected Fault</span>
                            </div>

                        </div>

                    </div>

                    <div className="location-result">
                        <MapPin size={17} />

                        <div>
                            <span>FAULT LOCATION</span>
                            <strong>C1 — Input Filter Capacitor</strong>
                        </div>
                    </div>

                </div>

                {/* DIAGNOSIS RESULT */}
                <div className="panel diagnosis-result-panel">

                    <div className="panel-heading">
                        <div>
                            <h3>AI Diagnosis</h3>
                            <p>Most probable fault identified</p>
                        </div>

                        <BrainCircuit size={20} className="ai-icon" />
                    </div>

                    <div className="fault-result">

                        <span className="result-label">PROBABLE FAULT</span>

                        <h3>Shorted Capacitor</h3>

                        <div className="component-tag">
                            C1
                        </div>

                        <div className="confidence-box">

                            <div>
                                <span>AI CONFIDENCE</span>
                                <strong>91%</strong>
                            </div>

                            <div className="confidence-bar">
                                <div></div>
                            </div>

                        </div>

                    </div>

                    <div className="diagnosis-details">

                        <div>
                            <span>FAULT TYPE</span>
                            <strong>Short Circuit</strong>
                        </div>

                        <div>
                            <span>CIRCUIT SECTION</span>
                            <strong>Input Filter</strong>
                        </div>

                        <div>
                            <span>COMPONENT</span>
                            <strong>C1 Capacitor</strong>
                        </div>

                        <div>
                            <span>TEST ID</span>
                            <strong>T-00129</strong>
                        </div>

                    </div>

                </div>

            </div>

            {/* EVIDENCE */}
            <div className="panel evidence-panel">

                <div className="panel-heading">
                    <div>
                        <h3>Supporting Evidence</h3>
                        <p>Measurements contributing to the AI diagnosis</p>
                    </div>
                </div>

                <div className="evidence-grid">

                    <div className="evidence-card abnormal">
                        <div className="evidence-icon">
                            <Zap size={18} />
                        </div>

                        <div>
                            <span>OUTPUT VOLTAGE</span>
                            <strong>3.42 V</strong>
                            <small>Expected: 4.8 – 5.2 V</small>
                        </div>

                        <AlertTriangle size={17} />
                    </div>

                    <div className="evidence-card abnormal">
                        <div className="evidence-icon">
                            <Activity size={18} />
                        </div>

                        <div>
                            <span>PCB CURRENT</span>
                            <strong>0.82 A</strong>
                            <small>Expected: &lt; 0.50 A</small>
                        </div>

                        <AlertTriangle size={17} />
                    </div>

                    <div className="evidence-card abnormal">
                        <div className="evidence-icon">
                            <Thermometer size={18} />
                        </div>

                        <div>
                            <span>C1 TEMPERATURE</span>
                            <strong>58.6 °C</strong>
                            <small>Expected: &lt; 40 °C</small>
                        </div>

                        <AlertTriangle size={17} />
                    </div>

                    <div className="evidence-card normal">
                        <div className="evidence-icon">
                            <CheckCircle2 size={18} />
                        </div>

                        <div>
                            <span>INPUT VOLTAGE</span>
                            <strong>12.01 V</strong>
                            <small>Within expected range</small>
                        </div>

                        <CheckCircle2 size={17} />
                    </div>

                </div>

            </div>

            {/* AI REASONING */}
            <div className="panel reasoning-panel">

                <div className="reasoning-title">
                    <BrainCircuit size={19} />
                    <div>
                        <h3>AI Analysis Summary</h3>
                        <p>Combined visual and electrical evidence</p>
                    </div>
                </div>

                <div className="reasoning-content">

                    <div className="reasoning-step">
                        <span>01</span>
                        <p>
                            Input supply voltage is within the expected operating range.
                        </p>
                    </div>

                    <div className="reasoning-step">
                        <span>02</span>
                        <p>
                            Output voltage is significantly below the expected 5V level.
                        </p>
                    </div>

                    <div className="reasoning-step">
                        <span>03</span>
                        <p>
                            Current consumption is higher than the normal reference condition.
                        </p>
                    </div>

                    <div className="reasoning-step">
                        <span>04</span>
                        <p>
                            Temperature near C1 is elevated and electrical measurements
                            indicate abnormal behavior in the capacitor section.
                        </p>
                    </div>

                    <div className="reasoning-step final">
                        <span>05</span>
                        <p>
                            Combined evidence indicates C1 as the most probable faulty
                            component with a short-circuit fault.
                        </p>
                    </div>

                </div>

            </div>

            {/* ACTIONS */}
            <div className="diagnosis-actions">

                <button
                    className="secondary-action"
                    onClick={() => navigate("/new-test")}
                >
                    <RotateCcw size={16} />
                    Run New Test
                </button>

                <button
                    className="primary-action"
                    onClick={() => navigate("/history")}
                >
                    View Test History
                    <ArrowRight size={16} />
                </button>

            </div>

        </div>
    );
}

export default Diagnosis;