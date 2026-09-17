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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/newTest.css";

function NewTest() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [started, setStarted] = useState(false);

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const startTest = () => {
        setStarted(true);

        setTimeout(() => {
            navigate("/measurements");
        }, 1200);
    };

    return (
        <div className="new-test-page">

            {/* HEADER */}
            <div className="new-test-header">
                <div>
                    <span className="eyebrow">AUTOMATED INSPECTION</span>
                    <h2>New PCB Test</h2>
                    <p>
                        Configure the PCB inspection and begin automated fault testing.
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

                <div className="test-step">
                    <span>2</span>
                    Visual Inspection
                </div>

                <div className="step-line"></div>

                <div className="test-step">
                    <span>3</span>
                    Electrical Test
                </div>

                <div className="step-line"></div>

                <div className="test-step">
                    <span>4</span>
                    AI Diagnosis
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
                            <h3>PCB Configuration</h3>
                            <p>Select the PCB design to be tested.</p>
                        </div>
                    </div>

                    <label>PCB TYPE</label>

                    <select className="pcb-select">
                        <option>LM7805 5V Regulated Power Supply PCB</option>
                    </select>

                    <div className="fixture-info">
                        <ShieldCheck size={19} />

                        <div>
                            <strong>Fixture Check</strong>
                            <p>
                                Ensure the PCB is correctly positioned and all pogo pins
                                are contacting the designated test points.
                            </p>
                        </div>

                        <CheckCircle2 size={19} className="check-icon" />
                    </div>

                    <div className="test-options">

                        <div className="option">
                            <Zap size={17} />
                            <div>
                                <strong>Power-off Testing</strong>
                                <span>Continuity & resistance checks</span>
                            </div>
                            <input type="checkbox" defaultChecked />
                        </div>

                        <div className="option">
                            <Zap size={17} />
                            <div>
                                <strong>Electrical Testing</strong>
                                <span>Voltage & current measurements</span>
                            </div>
                            <input type="checkbox" defaultChecked />
                        </div>

                        <div className="option">
                            <Camera size={17} />
                            <div>
                                <strong>Visual Inspection</strong>
                                <span>Camera + OpenCV + YOLO</span>
                            </div>
                            <input type="checkbox" defaultChecked />
                        </div>

                        <div className="option">
                            <ScanLine size={17} />
                            <div>
                                <strong>AI Fault Diagnosis</strong>
                                <span>Multimodal fault analysis</span>
                            </div>
                            <input type="checkbox" defaultChecked />
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
                            <h3>PCB Visual Inspection</h3>
                            <p>Upload a clear image of the PCB.</p>
                        </div>
                    </div>

                    {!image ? (
                        <label className="upload-area">

                            <div className="upload-icon">
                                <Upload size={25} />
                            </div>

                            <strong>Upload PCB Image</strong>

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

                            <img src={image} alt="PCB preview" />

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
                        Position the PCB completely inside the camera frame for
                        accurate component detection.
                    </div>

                </div>
            </div>

            {/* BOTTOM ACTION */}
            <div className="test-action-panel">

                <div>
                    <strong>Ready to begin?</strong>
                    <p>
                        The system will perform visual and electrical inspection
                        automatically.
                    </p>
                </div>

                <button
                    className="begin-test-btn"
                    onClick={startTest}
                    disabled={started}
                >
                    {started ? (
                        <>
                            <span className="loading-dot"></span>
                            Initializing Test...
                        </>
                    ) : (
                        <>
                            Start Automated Test
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>

            </div>

        </div>
    );
}

export default NewTest;