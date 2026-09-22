import {
    Search,
    Filter,
    CheckCircle2,
    AlertTriangle,
    Eye,
} from "lucide-react";
import { useState } from "react";

function History() {
    const [search, setSearch] = useState("");

    const tests = [
        {
            id: "T-00129",
            pcb: "LM7805 Power Supply",
            date: "17 Sep 2026",
            status: "Faulty",
            fault: "Shorted Capacitor",
            component: "C1",
            confidence: "91%",
        },
        {
            id: "T-00128",
            pcb: "LM7805 Power Supply",
            date: "16 Sep 2026",
            status: "Healthy",
            fault: "None",
            component: "-",
            confidence: "96%",
        },
        {
            id: "T-00127",
            pcb: "LM7805 Power Supply",
            date: "16 Sep 2026",
            status: "Faulty",
            fault: "Wrong Resistor Value",
            component: "R1",
            confidence: "88%",
        },
        {
            id: "T-00126",
            pcb: "LM7805 Power Supply",
            date: "15 Sep 2026",
            status: "Healthy",
            fault: "None",
            component: "-",
            confidence: "94%",
        },
        {
            id: "T-00125",
            pcb: "LM7805 Power Supply",
            date: "15 Sep 2026",
            status: "Faulty",
            fault: "Broken PCB Track",
            component: "TP4",
            confidence: "86%",
        },
    ];

    const filteredTests = tests.filter((test) =>
        `${test.id} ${test.pcb} ${test.fault} ${test.component}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <>
            <style>{`

        .history-page {
          max-width: 1500px;
          margin: 0 auto;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
        }

        .history-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #172033;
          margin: 6px 0;
        }

        .history-header p {
          color: #6b7280;
          font-size: 14px;
        }

        .history-summary {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 12px;
          padding: 14px 24px;
          min-width: 120px;
          text-align: center;
        }

        .history-summary strong {
          display: block;
          font-size: 25px;
          color: #172033;
        }

        .history-summary span {
          color: #7a8494;
          font-size: 12px;
        }

        .history-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .history-search {
          width: 500px;
          height: 46px;
          background: white;
          border: 1px solid #dfe5ed;
          border-radius: 9px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 10px;
          color: #7b8494;
        }

        .history-search input {
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          font-size: 14px;
          color: #172033;
          background: transparent;
        }

        .filter-button {
          height: 46px;
          padding: 0 18px;
          border: 1px solid #dfe5ed;
          background: white;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #374151;
        }

        .history-panel {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 14px;
          overflow: hidden;
        }

        .history-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1100px;
        }

        .history-table th {
          text-align: left;
          padding: 16px 20px;
          background: #f8fafc;
          color: #7b8494;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.6px;
        }

        .history-table td {
          padding: 18px 20px;
          border-top: 1px solid #edf0f4;
          color: #4b5563;
          font-size: 13px;
        }

        .history-table tbody tr:hover {
          background: #f8fafc;
        }

        .test-id {
          color: #2563eb;
          font-weight: 700;
        }

        .history-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .history-status.healthy {
          background: #ecfdf3;
          color: #16834b;
        }

        .history-status.faulty {
          background: #fff1f1;
          color: #d33b3b;
        }

        .component-value {
          display: inline-flex;
          justify-content: center;
          min-width: 36px;
          padding: 5px 9px;
          background: #f1f5f9;
          border-radius: 6px;
          color: #263247;
          font-weight: 700;
        }

        .view-button {
          border: 1px solid #dfe5ed;
          background: white;
          border-radius: 7px;
          padding: 7px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          color: #374151;
          font-size: 12px;
        }

        .view-button:hover,
        .filter-button:hover {
          background: #f1f5f9;
        }

        @media (max-width: 700px) {
          .history-header {
            align-items: flex-start;
          }

          .history-summary {
            display: none;
          }

          .history-toolbar {
            flex-direction: column;
          }

          .history-search {
            width: 100%;
          }
        }

      `}</style>

            <div className="history-page">

                <div className="history-header">
                    <div>
                        <span className="eyebrow">TEST RECORDS</span>
                        <h2>Test History</h2>
                        <p>
                            View previous PCB inspection and diagnosis results.
                        </p>
                    </div>

                    <div className="history-summary">
                        <strong>{tests.length}</strong>
                        <span>Total Records</span>
                    </div>
                </div>

                <div className="history-toolbar">

                    <div className="history-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search test ID, PCB or fault..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button className="filter-button">
                        <Filter size={17} />
                        Filter
                    </button>

                </div>

                <div className="history-panel">

                    <div className="history-table-wrapper">

                        <table className="history-table">

                            <thead>
                                <tr>
                                    <th>TEST ID</th>
                                    <th>PCB</th>
                                    <th>DATE</th>
                                    <th>STATUS</th>
                                    <th>FAULT</th>
                                    <th>COMPONENT</th>
                                    <th>CONFIDENCE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredTests.map((test) => (

                                    <tr key={test.id}>

                                        <td>
                                            <strong className="test-id">
                                                {test.id}
                                            </strong>
                                        </td>

                                        <td>{test.pcb}</td>

                                        <td>{test.date}</td>

                                        <td>
                                            <span
                                                className={`history-status ${test.status === "Healthy"
                                                        ? "healthy"
                                                        : "faulty"
                                                    }`}
                                            >
                                                {test.status === "Healthy" ? (
                                                    <CheckCircle2 size={15} />
                                                ) : (
                                                    <AlertTriangle size={15} />
                                                )}

                                                {test.status}
                                            </span>
                                        </td>

                                        <td>{test.fault}</td>

                                        <td>
                                            <span className="component-value">
                                                {test.component}
                                            </span>
                                        </td>

                                        <td>
                                            <strong>{test.confidence}</strong>
                                        </td>

                                        <td>
                                            <button className="view-button">
                                                <Eye size={16} />
                                                View
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </>
    );
}

export default History;