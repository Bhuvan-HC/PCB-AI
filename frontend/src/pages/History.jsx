import { useEffect, useState } from "react";
import {
  History as HistoryIcon,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Cpu,
  MapPin,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory =
        JSON.parse(localStorage.getItem("pcbTestHistory")) || [];

      setHistory(savedHistory);
    } catch (error) {
      console.error("Failed to load test history:", error);
      setHistory([]);
    }
  };

  const saveCurrentTest = () => {
    try {
      const diagnosis =
        JSON.parse(
          sessionStorage.getItem("pcbDiagnosis")
        );

      const measurements =
        JSON.parse(
          sessionStorage.getItem("pcbMeasurements")
        );

      if (!diagnosis) {
        alert(
          "No AI diagnosis is available. Complete a PCB test first."
        );
        return;
      }

      const existingHistory =
        JSON.parse(
          localStorage.getItem("pcbTestHistory")
        ) || [];

      const test = {
        id: `T-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleString(),
        faultType:
          diagnosis.fault_type || "Unknown",
        component:
          diagnosis.component || "Unknown",
        location:
          diagnosis.location || "Unknown",
        confidence:
          Number(diagnosis.confidence || 0),
        healthScore:
          Number(diagnosis.health_score || 0),
        measurements: measurements || {},
      };

      const updatedHistory = [
        test,
        ...existingHistory,
      ];

      localStorage.setItem(
        "pcbTestHistory",
        JSON.stringify(updatedHistory)
      );

      setHistory(updatedHistory);

    } catch (error) {
      console.error(
        "Failed to save current test:",
        error
      );

      alert("Unable to save the current test.");
    }
  };

  const clearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all test history?"
    );

    if (!confirmed) return;

    localStorage.removeItem("pcbTestHistory");
    setHistory([]);
  };

  const viewLatestDiagnosis = () => {
    navigate("/diagnosis");
  };

  const isHealthy = (faultType) => {
    if (!faultType) return false;

    return (
      faultType.toLowerCase() === "healthy" ||
      faultType.toLowerCase() === "none"
    );
  };

  return (
    <div className="history-page">

      {/* HEADER */}
      <div className="history-header">

        <div>
          <span className="eyebrow">
            TEST RECORDS
          </span>

          <h2>Test History</h2>

          <p>
            Review previous PCB inspection and AI
            diagnosis results.
          </p>
        </div>

        <div className="history-header-actions">

          <button
            className="save-test-btn"
            onClick={saveCurrentTest}
          >
            <Activity size={17} />
            Save Current Test
          </button>

          {history.length > 0 && (
            <button
              className="clear-history-btn"
              onClick={clearHistory}
            >
              <Trash2 size={17} />
              Clear History
            </button>
          )}

        </div>

      </div>

      {/* SUMMARY */}
      <div className="history-summary">

        <div className="summary-card">

          <HistoryIcon size={21} />

          <div>
            <span>Total Tests</span>
            <strong>{history.length}</strong>
          </div>

        </div>

        <div className="summary-card">

          <CheckCircle2 size={21} />

          <div>
            <span>Healthy Tests</span>

            <strong>
              {
                history.filter((test) =>
                  isHealthy(test.faultType)
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="summary-card">

          <AlertTriangle size={21} />

          <div>
            <span>Faults Detected</span>

            <strong>
              {
                history.filter(
                  (test) =>
                    !isHealthy(test.faultType)
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="summary-card">

          <Cpu size={21} />

          <div>
            <span>AI Analysis</span>
            <strong>Active</strong>
          </div>

        </div>

      </div>

      {/* EMPTY STATE */}
      {history.length === 0 ? (

        <div className="history-empty">

          <HistoryIcon size={48} />

          <h3>
            No Test History
          </h3>

          <p>
            Complete a PCB test and save the result
            to see it here.
          </p>

          <button
            className="start-test-btn"
            onClick={() =>
              navigate("/new-test")
            }
          >
            Start New PCB Test
          </button>

        </div>

      ) : (

        /* HISTORY TABLE */
        <div className="history-panel">

          <div className="history-panel-header">

            <div>
              <h3>
                Previous Tests
              </h3>

              <p>
                AI diagnosis records stored
                locally on this system.
              </p>
            </div>

            <button
              className="latest-btn"
              onClick={viewLatestDiagnosis}
            >
              <Eye size={16} />
              Latest Diagnosis
            </button>

          </div>

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>

                <tr>
                  <th>TEST ID</th>
                  <th>DATE</th>
                  <th>FAULT</th>
                  <th>COMPONENT</th>
                  <th>LOCATION</th>
                  <th>CONFIDENCE</th>
                  <th>HEALTH</th>
                </tr>

              </thead>

              <tbody>

                {history.map((test) => {

                  const healthy =
                    isHealthy(
                      test.faultType
                    );

                  return (
                    <tr key={test.id}>

                      <td>
                        <strong>
                          {test.id}
                        </strong>
                      </td>

                      <td>
                        {test.date}
                      </td>

                      <td>

                        <span
                          className={
                            healthy
                              ? "status-healthy"
                              : "status-fault"
                          }
                        >

                          {healthy ? (
                            <CheckCircle2
                              size={14}
                            />
                          ) : (
                            <AlertTriangle
                              size={14}
                            />
                          )}

                          {String(
                            test.faultType
                          ).replaceAll(
                            "_",
                            " "
                          )}

                        </span>

                      </td>

                      <td>
                        {test.component}
                      </td>

                      <td>
                        <span className="location-cell">
                          <MapPin
                            size={14}
                          />
                          {test.location}
                        </span>
                      </td>

                      <td>
                        {Number(
                          test.confidence || 0
                        ).toFixed(1)}
                        %
                      </td>

                      <td>

                        <div className="health-cell">

                          <strong>
                            {
                              test.healthScore
                            }
                            /100
                          </strong>

                          <div className="health-bar">
                            <div
                              className="health-fill"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    Number(
                                      test.healthScore ||
                                      0
                                    )
                                  )
                                )}%`,
                              }}
                            />
                          </div>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* STYLES */}
      <style>{`

                .history-page {
                    min-height: 100vh;
                    padding: 32px;
                    background: #f7f9fc;
                    box-sizing: border-box;
                }

                .history-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    margin-bottom: 25px;
                }

                .eyebrow {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1.4px;
                    color: #64748b;
                }

                .history-header h2 {
                    margin: 7px 0 6px;
                    font-size: 30px;
                    color: #0f172a;
                }

                .history-header p {
                    margin: 0;
                    color: #64748b;
                }

                .history-header-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .save-test-btn,
                .clear-history-btn,
                .latest-btn,
                .start-test-btn {
                    border: none;
                    border-radius: 10px;
                    padding: 11px 15px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .save-test-btn {
                    background: #0f172a;
                    color: white;
                }

                .clear-history-btn {
                    background: #fff;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }

                .latest-btn {
                    background: #0f172a;
                    color: white;
                }

                .start-test-btn {
                    margin-top: 15px;
                    background: #0f172a;
                    color: white;
                }

                .history-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 16px;
                    margin-bottom: 22px;
                }

                .summary-card {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    padding: 20px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 15px;
                }

                .summary-card svg {
                    color: #475569;
                }

                .summary-card span {
                    display: block;
                    font-size: 12px;
                    color: #64748b;
                    margin-bottom: 4px;
                }

                .summary-card strong {
                    font-size: 21px;
                    color: #0f172a;
                    text-transform: capitalize;
                }

                .history-panel {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 17px;
                    overflow: hidden;
                }

                .history-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    padding: 22px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .history-panel-header h3 {
                    margin: 0 0 5px;
                    color: #0f172a;
                }

                .history-panel-header p {
                    margin: 0;
                    font-size: 13px;
                    color: #64748b;
                }

                .history-table-wrapper {
                    overflow-x: auto;
                }

                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 950px;
                }

                .history-table th {
                    text-align: left;
                    padding: 14px 18px;
                    background: #f8fafc;
                    font-size: 10px;
                    letter-spacing: .8px;
                    color: #64748b;
                }

                .history-table td {
                    padding: 17px 18px;
                    border-top: 1px solid #f1f5f9;
                    font-size: 13px;
                    color: #475569;
                }

                .history-table td strong {
                    color: #0f172a;
                }

                .status-healthy,
                .status-fault {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 9px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: capitalize;
                }

                .status-healthy {
                    background: #ecfdf5;
                    color: #047857;
                }

                .status-fault {
                    background: #fff7ed;
                    color: #c2410c;
                }

                .location-cell {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                .health-cell {
                    min-width: 90px;
                }

                .health-cell strong {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 12px;
                }

                .health-bar {
                    width: 75px;
                    height: 6px;
                    border-radius: 99px;
                    background: #e2e8f0;
                    overflow: hidden;
                }

                .health-fill {
                    height: 100%;
                    border-radius: 99px;
                    background: #16a34a;
                }

                .history-empty {
                    min-height: 380px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 17px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    color: #64748b;
                }

                .history-empty h3 {
                    margin: 17px 0 7px;
                    color: #0f172a;
                    font-size: 22px;
                }

                .history-empty p {
                    margin: 0;
                }

                @media (max-width: 900px) {

                    .history-summary {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .history-header {
                        flex-direction: column;
                    }

                }

                @media (max-width: 600px) {

                    .history-page {
                        padding: 18px;
                    }

                    .history-summary {
                        grid-template-columns: 1fr;
                    }

                    .history-header-actions {
                        width: 100%;
                    }

                    .save-test-btn,
                    .clear-history-btn {
                        flex: 1;
                    }

                }

            `}</style>

    </div>
  );
}

export default History;