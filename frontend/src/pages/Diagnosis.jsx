import { useEffect, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Cpu,
    MapPin,
    Activity,
    ArrowLeft,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Diagnosis() {
    const navigate = useNavigate();

    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedDiagnosis = sessionStorage.getItem("pcbDiagnosis");

        if (savedDiagnosis) {
            try {
                const parsedDiagnosis = JSON.parse(savedDiagnosis);
                setDiagnosis(parsedDiagnosis);
            } catch (error) {
                console.error("Failed to read diagnosis:", error);
                setDiagnosis(null);
            }
        }

        setLoading(false);
    }, []);

    const clearDiagnosis = () => {
        sessionStorage.removeItem("pcbDiagnosis");
        setDiagnosis(null);
    };

    if (loading) {
        return (
            <div className="diagnosis-page">
                <div className="diagnosis-loading">
                    <RefreshCw size={28} className="spin" />
                    <h2>Loading AI Diagnosis...</h2>
                    <p>Reading the latest PCB analysis.</p>
                </div>
            </div>
        );
    }

    if (!diagnosis) {
        return (
            <div className="diagnosis-page">
                <div className="diagnosis-header">
                    <div>
                        <span className="eyebrow">AI ANALYSIS</span>
                        <h2>PCB Fault Diagnosis</h2>
                        <p>
                            No diagnosis result is currently available.
                        </p>
                    </div>
                </div>

                <div className="diagnosis-empty">
                    <AlertTriangle size={42} />

                    <h3>No Diagnosis Available</h3>

                    <p>
                        Start a new PCB test first so the AI system can
                        analyse the electrical measurements.
                    </p>

                    <button
                        className="diagnosis-primary-btn"
                        onClick={() => navigate("/new-test")}
                    >
                        Start New PCB Test
                    </button>
                </div>
            </div>
        );
    }

    const faultType = diagnosis.fault_type || "Unknown";
    const component = diagnosis.component || "Unknown";
    const location = diagnosis.location || "Unknown";
    const confidence = Number(diagnosis.confidence || 0);
    const healthScore = Number(diagnosis.health_score || 0);

    const isHealthy =
        faultType.toLowerCase() === "healthy" ||
        faultType.toLowerCase() === "none";

    return (
        <div className="diagnosis-page">

            {/* HEADER */}
            <div className="diagnosis-header">
                <div>
                    <span className="eyebrow">AI ANALYSIS</span>

                    <h2>PCB Fault Diagnosis</h2>

                    <p>
                        AI-powered analysis of the electrical measurements
                        collected from the PCB.
                    </p>
                </div>

                <div className="diagnosis-status">
                    {isHealthy ? (
                        <>
                            <CheckCircle2 size={18} />
                            HEALTHY
                        </>
                    ) : (
                        <>
                            <AlertTriangle size={18} />
                            FAULT DETECTED
                        </>
                    )}
                </div>
            </div>

            {/* MAIN RESULT */}
            <div className="diagnosis-main-card">

                <div className="diagnosis-result-icon">
                    {isHealthy ? (
                        <CheckCircle2 size={42} />
                    ) : (
                        <AlertTriangle size={42} />
                    )}
                </div>

                <div className="diagnosis-result-content">
                    <span className="result-label">
                        MOST PROBABLE FAULT
                    </span>

                    <h1>{faultType.replaceAll("_", " ")}</h1>

                    <p>
                        The AI model identified this condition from the
                        available electrical measurements.
                    </p>
                </div>

                <div className="confidence-box">
                    <span>CONFIDENCE</span>

                    <strong>
                        {confidence.toFixed(1)}%
                    </strong>
                </div>

            </div>

            {/* DIAGNOSIS DETAILS */}
            <div className="diagnosis-grid">

                <div className="diagnosis-card">
                    <div className="diagnosis-card-icon">
                        <Cpu size={22} />
                    </div>

                    <span>COMPONENT</span>

                    <strong>{component}</strong>

                    <p>
                        Suspected component associated with the detected
                        condition.
                    </p>
                </div>

                <div className="diagnosis-card">
                    <div className="diagnosis-card-icon">
                        <MapPin size={22} />
                    </div>

                    <span>LOCATION</span>

                    <strong>{location}</strong>

                    <p>
                        Estimated PCB area associated with the diagnosis.
                    </p>
                </div>

                <div className="diagnosis-card">
                    <div className="diagnosis-card-icon">
                        <Activity size={22} />
                    </div>

                    <span>HEALTH SCORE</span>

                    <strong>{healthScore}/100</strong>

                    <div className="health-progress">
                        <div
                            className="health-progress-fill"
                            style={{
                                width: `${Math.max(
                                    0,
                                    Math.min(100, healthScore)
                                )}%`,
                            }}
                        ></div>
                    </div>

                    <p>
                        Estimated condition of the PCB based on the
                        diagnosis model.
                    </p>
                </div>

            </div>

            {/* AI INFORMATION */}
            <div className="diagnosis-information">

                <div className="information-heading">
                    <ShieldCheck size={21} />

                    <div>
                        <h3>AI Diagnosis Summary</h3>

                        <p>
                            The result is based on the current measurement
                            dataset and trained machine-learning model.
                        </p>
                    </div>
                </div>

                <div className="information-row">
                    <span>Fault classification</span>
                    <strong>
                        {faultType.replaceAll("_", " ")}
                    </strong>
                </div>

                <div className="information-row">
                    <span>Suspected component</span>
                    <strong>{component}</strong>
                </div>

                <div className="information-row">
                    <span>PCB location</span>
                    <strong>{location}</strong>
                </div>

                <div className="information-row">
                    <span>Model confidence</span>
                    <strong>{confidence.toFixed(1)}%</strong>
                </div>

            </div>

            {/* ACTIONS */}
            <div className="diagnosis-actions">

                <button
                    className="secondary-btn"
                    onClick={() => navigate("/measurements")}
                >
                    <ArrowLeft size={17} />
                    Back to Measurements
                </button>

                <button
                    className="secondary-btn"
                    onClick={clearDiagnosis}
                >
                    Clear Result
                </button>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/new-test")}
                >
                    Run New PCB Test
                </button>

            </div>

            {/* PAGE STYLES */}
            <style>{`
                .diagnosis-page {
                    padding: 32px;
                    min-height: 100vh;
                    background: #f7f9fc;
                    box-sizing: border-box;
                }

                .diagnosis-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 24px;
                    margin-bottom: 28px;
                }

                .eyebrow {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #64748b;
                }

                .diagnosis-header h2 {
                    margin: 7px 0 6px;
                    font-size: 30px;
                    color: #0f172a;
                }

                .diagnosis-header p {
                    margin: 0;
                    color: #64748b;
                }

                .diagnosis-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 15px;
                    border-radius: 999px;
                    background: #ecfdf5;
                    color: #047857;
                    font-size: 12px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .diagnosis-main-card {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    gap: 22px;
                    padding: 28px;
                    margin-bottom: 22px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05);
                }

                .diagnosis-result-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff7ed;
                    color: #ea580c;
                }

                .diagnosis-result-content .result-label {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1.2px;
                    color: #64748b;
                }

                .diagnosis-result-content h1 {
                    margin: 7px 0;
                    font-size: 28px;
                    text-transform: capitalize;
                    color: #0f172a;
                }

                .diagnosis-result-content p {
                    margin: 0;
                    color: #64748b;
                }

                .confidence-box {
                    min-width: 120px;
                    text-align: center;
                    padding: 15px;
                    border-radius: 14px;
                    background: #f8fafc;
                }

                .confidence-box span {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    color: #64748b;
                    margin-bottom: 5px;
                }

                .confidence-box strong {
                    font-size: 25px;
                    color: #0f172a;
                }

                .diagnosis-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                    margin-bottom: 22px;
                }

                .diagnosis-card {
                    padding: 23px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                }

                .diagnosis-card-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    color: #475569;
                    margin-bottom: 18px;
                }

                .diagnosis-card > span {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    color: #64748b;
                    margin-bottom: 7px;
                }

                .diagnosis-card > strong {
                    display: block;
                    font-size: 20px;
                    text-transform: capitalize;
                    color: #0f172a;
                }

                .diagnosis-card p {
                    margin: 10px 0 0;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #64748b;
                }

                .health-progress {
                    width: 100%;
                    height: 8px;
                    margin-top: 13px;
                    overflow: hidden;
                    border-radius: 99px;
                    background: #e2e8f0;
                }

                .health-progress-fill {
                    height: 100%;
                    border-radius: 99px;
                    background: #16a34a;
                    transition: width 0.5s ease;
                }

                .diagnosis-information {
                    padding: 24px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    margin-bottom: 22px;
                }

                .information-heading {
                    display: flex;
                    gap: 13px;
                    align-items: flex-start;
                    padding-bottom: 16px;
                    margin-bottom: 5px;
                    border-bottom: 1px solid #e2e8f0;
                    color: #475569;
                }

                .information-heading h3 {
                    margin: 0 0 4px;
                    color: #0f172a;
                }

                .information-heading p {
                    margin: 0;
                    font-size: 13px;
                    color: #64748b;
                }

                .information-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 14px 0;
                    border-bottom: 1px solid #f1f5f9;
                }

                .information-row:last-child {
                    border-bottom: none;
                }

                .information-row span {
                    color: #64748b;
                }

                .information-row strong {
                    color: #0f172a;
                    text-transform: capitalize;
                    text-align: right;
                }

                .diagnosis-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .primary-btn,
                .secondary-btn,
                .diagnosis-primary-btn {
                    border: none;
                    border-radius: 10px;
                    padding: 12px 17px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .primary-btn,
                .diagnosis-primary-btn {
                    background: #0f172a;
                    color: white;
                }

                .secondary-btn {
                    background: white;
                    color: #334155;
                    border: 1px solid #cbd5e1;
                }

                .diagnosis-empty {
                    min-height: 360px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 30px;
                    color: #64748b;
                }

                .diagnosis-empty h3 {
                    margin: 18px 0 8px;
                    color: #0f172a;
                    font-size: 22px;
                }

                .diagnosis-empty p {
                    max-width: 500px;
                    line-height: 1.6;
                }

                .diagnosis-loading {
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                }

                .diagnosis-loading h2 {
                    margin: 15px 0 5px;
                    color: #0f172a;
                }

                .diagnosis-loading p {
                    margin: 0;
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 900px) {
                    .diagnosis-main-card {
                        grid-template-columns: 1fr;
                    }

                    .confidence-box {
                        width: fit-content;
                    }

                    .diagnosis-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 600px) {
                    .diagnosis-page {
                        padding: 18px;
                    }

                    .diagnosis-header {
                        flex-direction: column;
                    }

                    .information-row {
                        flex-direction: column;
                        gap: 5px;
                    }

                    .information-row strong {
                        text-align: left;
                    }

                    .diagnosis-actions {
                        justify-content: stretch;
                    }

                    .primary-btn,
                    .secondary-btn {
                        width: 100%;
                    }
                }
            `}</style>

        </div>
    );
}

export default Diagnosis;