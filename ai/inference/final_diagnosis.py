from typing import Any


FAULT_COMPONENT_MAP = {
    "open_resistor": "R1",
    "shorted_capacitor": "C1",
    "faulty_diode": "D1",
    "broken_track": "PCB_TRACK",
    "wrong_resistor": "R1",
    "solder_bridge": "PCB_SECTION",
    "healthy": "None",
}


def combine_diagnosis(
    electrical_diagnosis: dict[str, Any],
    visual_detections: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Combine the electrical ML diagnosis with future YOLO
    component detections.

    The electrical diagnosis remains the primary fault classifier.
    YOLO provides visual component/location evidence.
    """

    fault_type = electrical_diagnosis.get("fault_type", "unknown")
    electrical_component = electrical_diagnosis.get(
        "component",
        FAULT_COMPONENT_MAP.get(fault_type, "Unknown"),
    )
    electrical_location = electrical_diagnosis.get(
        "location",
        "Unknown",
    )
    electrical_confidence = float(
        electrical_diagnosis.get("confidence", 0.0)
    )
    health_score = electrical_diagnosis.get("health_score")

    visual_component = None
    visual_confidence = 0.0
    visual_location = None

    if visual_detections:
        best_detection = max(
            visual_detections,
            key=lambda detection: float(
                detection.get("confidence", 0.0)
            ),
        )

        visual_component = best_detection.get("component")
        visual_confidence = float(
            best_detection.get("confidence", 0.0)
        )
        visual_location = best_detection.get("location")

    component_match = (
        visual_component == electrical_component
        if visual_component and electrical_component
        else False
    )

    if component_match:
        final_confidence = min(
            1.0,
            (electrical_confidence * 0.6)
            + (visual_confidence * 0.4),
        )
        evidence_status = "Electrical and visual evidence agree."
    elif visual_component:
        final_confidence = electrical_confidence * 0.7
        evidence_status = (
            "Electrical and visual evidence are available "
            "but identify different components."
        )
    else:
        final_confidence = electrical_confidence
        evidence_status = (
            "Only electrical diagnosis is currently available."
        )

    return {
        "fault_type": fault_type,
        "component": electrical_component,
        "location": electrical_location,
        "confidence": round(final_confidence, 4),
        "health_score": health_score,
        "visual_evidence": {
            "component": visual_component,
            "confidence": round(visual_confidence, 4),
            "location": visual_location,
        },
        "component_match": component_match,
        "evidence_status": evidence_status,
    }