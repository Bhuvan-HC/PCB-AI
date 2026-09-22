import { useState } from "react";
import {
    Upload,
    Camera,
    ScanLine,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    Image as ImageIcon,
    BrainCircuit,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/newTest.css";

function NewTest() {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [started, setStarted] = useState(false);
    const [stage, setStage] = useState("ready");
    const [error, setError] = useState("");

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setImageFile(file);
        setImage(URL.createObjectURL(file));
        setError("");
        setStage("ready");
    };

    const analyzePCBImage = async () => {
        if (!imageFile) {
            return {
                status: "skipped",
                message: "No PCB image uploaded.",
            };
        }

        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch(
            "http://127.0.0.1:8000/vision/analyze",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(
                `OpenCV server returned HTTP ${response.status}`
            );
        }

        return await response.json();
    };

    const runAIDiagnosis = async (measurementData) => {
        const response = await fetch(
            "http://127.0.0.1:8000/diagnosis/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(measurementData),
            }
        );

        if (!response.ok) {
            throw new Error(
                `AI server returned HTTP ${response.status}`
            );
        }

        return await response.json();
    };

    const startTest = async () => {
        setStarted(true);
        setError("");
        setStage("preparing");

        const measurementData = {
            input_voltage: 12.0,
            output_voltage: 5.0,
            current: 0.18,
            temperature_1: 30.0,
            temperature_2: 31.0,
            tp1_voltage: 12.0,
            tp2_voltage: 11.3,
            tp3_voltage: 5.0,
            continuity: 1,
        };

        try {
            // ------------------------------------------
            // STAGE 1
            // ------------------------------------------
            setStage("vision");

            const visionResult = await analyzePCBImage();

            console.log(
                "OpenCV Vision Result:",
                visionResult
            );

            sessionStorage.setItem(
                "pcbVision",
                JSON.stringify(visionResult)
            );

            // Keep this stage visible for the user.
            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            // ------------------------------------------
            // STAGE 2
            // ------------------------------------------
            setStage("ai");

            const diagnosisResult =
                await runAIDiagnosis(measurementData);

            console.log(
                "AI Diagnosis Result:",
                diagnosisResult
            );

            if (!diagnosisResult.diagnosis) {
                throw new Error(
                    "AI backend did not return a diagnosis."
                );
            }

            sessionStorage.setItem(
                "pcbDiagnosis",
                JSON.stringify(
                    diagnosisResult.diagnosis
                )
            );

            sessionStorage.setItem(
                "pcbMeasurements",
                JSON.stringify(
                    measurementData
                )
            );

            sessionStorage.setItem(
                "pcbImageLoaded",
                imageFile ? "true" : "false"
            );

            sessionStorage.setItem(
                "pcbTestTime",
                new Date().toISOString()
            );

            // ------------------------------------------
            // STAGE 3
            // ------------------------------------------
            setStage("completed");

            await new Promise((resolve) =>
                setTimeout(resolve, 1200)
            );

            navigate("/measurements");

        } catch (err) {
            console.error(
                "PCB automated test failed:",
                err
            );

            setError(
                err.message ||
                "Unable to complete the automated test."
            );

            setStage("error");
            setStarted(false);
        }
    };

    const getStageTitle = () => {
        switch (stage) {
            case "preparing":
                return "Preparing Automated Test";

            case "vision":
                return "Analyzing PCB Image with OpenCV";

            case "ai":
                return "Running AI Electrical Diagnosis";

            case "completed":
                return "Inspection Completed";

            case "error":
                return "Inspection Failed";

            default:
                return "Ready to Begin";
        }
    };

    const getStageDescription = () => {
        switch (stage) {
            case "preparing":
                return "Initializing the PCB inspection pipeline.";

            case "vision":
                return "Processing the uploaded PCB image and detecting image regions.";

            case "ai":
                return "Sending electrical measurements to the trained machine-learning model.";

            case "completed":
                return "Visual preprocessing and AI electrical diagnosis completed successfully.";

            case "error":
                return "The automated inspection could not be completed.";

            default:
                return "Upload a PCB image and start the automated test.";

        }
    };

    return (
        <div className="new-test-page">

            {/* HEADER */}
            <div className="new-test-header">

                <div>
                    <span className="eyebrow">
                        AUTOMATED INSPECTION
                    </span>

                    <h2>New PCB Test</h2>

                    <p>
                        Configure the PCB inspection and begin
                        automated fault testing.
                    </p>
                </div>

                <div className="test-id">
                    <span>TEST ID</span>
                    <strong>T-00129</strong>
                </div>

            </div>

            {/* STEP INDICATOR */}
            <div className="test-steps">

                <div className="test-step active">
                    <span>1</span>
                    PCB Setup
                </div>

                <div className="step-line"></div>

                <div
                    className={
                        stage === "vision" ||
                            stage === "ai" ||
                            stage === "completed"
                            ? "test-step active"
                            : "test-step"
                    }
                >
                    <span>2</span>
                    Visual Inspection
                </div>

                <div className="step-line"></div>

                <div
                    className={
                        stage === "ai" ||
                            stage === "completed"
                            ? "test-step active"
                            : "test-step"
                    }
                >
                    <span>3</span>
                    Electrical Test
                </div>

                <div className="step-line"></div>

                <div
                    className={
                        stage === "completed"
                            ? "test-step active"
                            : "test-step"
                    }
                >
                    <span>4</span>
                    AI Diagnosis
                </div>

            </div>

            {/* ERROR */}
            {error && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "15px 18px",
                        borderRadius: "12px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#b91c1c",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "14px",
                    }}
                >
                    <AlertCircle size={20} />

                    <div>
                        <strong>
                            Automated test failed
                        </strong>

                        <div style={{ marginTop: "4px" }}>
                            {error}
                        </div>
                    </div>
                </div>
            )}

            {/* INSPECTION STATUS */}
            <div
                style={{
                    marginBottom: "22px",
                    padding: "20px",
                    borderRadius: "15px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                        "0 5px 20px rgba(15, 23, 42, 0.04)",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                    }}
                >

                    <div
                        style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                stage === "error"
                                    ? "#fef2f2"
                                    : stage === "completed"
                                        ? "#ecfdf5"
                                        : "#eff6ff",
                            color:
                                stage === "error"
                                    ? "#dc2626"
                                    : stage === "completed"
                                        ? "#059669"
                                        : "#2563eb",
                        }}
                    >
                        {stage === "completed" ? (
                            <CheckCircle2 size={24} />
                        ) : stage === "error" ? (
                            <AlertCircle size={24} />
                        ) : started ? (
                            <Loader2
                                size={24}
                                style={{
                                    animation:
                                        "spin 1s linear infinite",
                                }}
                            />
                        ) : (
                            <BrainCircuit size={24} />
                        )}
                    </div>

                    <div>

                        <strong
                            style={{
                                display: "block",
                                fontSize: "16px",
                                color: "#0f172a",
                            }}
                        >
                            {getStageTitle()}
                        </strong>

                        <span
                            style={{
                                display: "block",
                                marginTop: "4px",
                                fontSize: "13px",
                                color: "#64748b",
                            }}
                        >
                            {getStageDescription()}
                        </span>

                    </div>

                </div>

                {/* STAGE STATUS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap: "10px",
                        marginTop: "18px",
                    }}
                >

                    <div
                        style={{
                            padding: "12px",
                            borderRadius: "10px",
                            background:
                                stage === "vision" ||
                                    stage === "ai" ||
                                    stage === "completed"
                                    ? "#ecfdf5"
                                    : "#f8fafc",
                            color:
                                stage === "vision" ||
                                    stage === "ai" ||
                                    stage === "completed"
                                    ? "#047857"
                                    : "#64748b",
                            fontSize: "12px",
                            fontWeight: "700",
                            textAlign: "center",
                        }}
                    >
                        {stage === "vision" ? "● " : ""}
                        OpenCV
                        {stage === "vision"
                            ? " — RUNNING"
                            : stage === "completed"
                                ? " — DONE"
                                : " — WAITING"}
                    </div>

                    <div
                        style={{
                            padding: "12px",
                            borderRadius: "10px",
                            background:
                                stage === "ai"
                                    ? "#eff6ff"
                                    : stage === "completed"
                                        ? "#ecfdf5"
                                        : "#f8fafc",
                            color:
                                stage === "ai"
                                    ? "#1d4ed8"
                                    : stage === "completed"
                                        ? "#047857"
                                        : "#64748b",
                            fontSize: "12px",
                            fontWeight: "700",
                            textAlign: "center",
                        }}
                    >
                        {stage === "ai" ? "● " : ""}
                        AI MODEL
                        {stage === "ai"
                            ? " — RUNNING"
                            : stage === "completed"
                                ? " — DONE"
                                : " — WAITING"}
                    </div>

                    <div
                        style={{
                            padding: "12px",
                            borderRadius: "10px",
                            background:
                                stage === "completed"
                                    ? "#ecfdf5"
                                    : "#f8fafc",
                            color:
                                stage === "completed"
                                    ? "#047857"
                                    : "#64748b",
                            fontSize: "12px",
                            fontWeight: "700",
                            textAlign: "center",
                        }}
                    >
                        RESULT
                        {stage === "completed"
                            ? " — READY"
                            : " — WAITING"}
                    </div>

                </div>

            </div>

            {/* CONTENT */}
            <div className="new-test-grid">

                {/* LEFT */}
                <div className="test-config-panel">

                    <div className="section-heading">

                        <div className="section-icon">
                            <ScanLine size={18} />
                        </div>

                        <div>
                            <h3>
                                PCB Configuration
                            </h3>

                            <p>
                                Select the PCB design to be tested.
                            </p>
                        </div>

                    </div>

                    <label>PCB TYPE</label>

                    <select className="pcb-select">

                        <option>
                            LM7805 5V Regulated Power Supply PCB
                        </option>

                    </select>

                    <div className="fixture-info">

                        <ShieldCheck size={19} />

                        <div>
                            <strong>
                                Fixture Check
                            </strong>

                            <p>
                                Ensure the PCB is correctly
                                positioned and all pogo pins
                                are contacting the designated
                                test points.
                            </p>
                        </div>

                        <CheckCircle2
                            size={19}
                            className="check-icon"
                        />

                    </div>

                    <div className="test-options">

                        <div className="option">

                            <Zap size={17} />

                            <div>
                                <strong>
                                    Power-off Testing
                                </strong>

                                <span>
                                    Continuity & resistance checks
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>

                        <div className="option">

                            <Zap size={17} />

                            <div>
                                <strong>
                                    Electrical Testing
                                </strong>

                                <span>
                                    Voltage & current measurements
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>

                        <div className="option">

                            <Camera size={17} />

                            <div>
                                <strong>
                                    Visual Inspection
                                </strong>

                                <span>
                                    Camera + OpenCV + YOLO
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>

                        <div className="option">

                            <ScanLine size={17} />

                            <div>
                                <strong>
                                    AI Fault Diagnosis
                                </strong>

                                <span>
                                    Electrical AI analysis
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="image-panel">

                    <div className="section-heading">

                        <div className="section-icon">
                            <Camera size={18} />
                        </div>

                        <div>
                            <h3>
                                PCB Visual Inspection
                            </h3>

                            <p>
                                Upload a clear image of the PCB.
                            </p>
                        </div>

                    </div>

                    {!image ? (

                        <label className="upload-area">

                            <div className="upload-icon">
                                <Upload size={25} />
                            </div>

                            <strong>
                                Upload PCB Image
                            </strong>

                            <span>
                                PNG, JPG or JPEG
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />

                            <div className="upload-buttons">

                                <span>
                                    <Upload size={15} />
                                    Choose Image
                                </span>

                                <span>
                                    <Camera size={15} />
                                    Camera
                                </span>

                            </div>

                        </label>

                    ) : (

                        <div className="image-preview">

                            <img
                                src={image}
                                alt="PCB preview"
                            />

                            <div className="image-overlay">

                                <span>
                                    <CheckCircle2 size={15} />
                                    Image Loaded
                                </span>

                                <label className="change-image">

                                    Change Image

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                    />

                                </label>

                            </div>

                        </div>

                    )}

                    <div className="image-note">

                        <ImageIcon size={15} />

                        Position the PCB completely inside
                        the camera frame for accurate
                        component detection.

                    </div>

                </div>

            </div>

            {/* BOTTOM ACTION */}
            <div className="test-action-panel">

                <div>

                    <strong>
                        Ready to begin?
                    </strong>

                    <p>
                        The system will perform OpenCV image
                        analysis and electrical AI diagnosis.
                    </p>

                </div>

                <button
                    className="begin-test-btn"
                    onClick={startTest}
                    disabled={started}
                >

                    {started ? (
                        <>
                            <Loader2
                                size={18}
                                style={{
                                    animation:
                                        "spin 1s linear infinite",
                                }}
                            />

                            Running Inspection...
                        </>
                    ) : (
                        <>
                            Start Automated Test
                            <ArrowRight size={18} />
                        </>
                    )}

                </button>

            </div>

            <style>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>

        </div>
    );
}

export default NewTest;