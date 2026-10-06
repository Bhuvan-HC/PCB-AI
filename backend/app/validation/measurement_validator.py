from typing import Any


def validate_measurements(data: dict[str, Any]) -> dict[str, Any]:
    """
    Validate PCB electrical measurements before AI diagnosis.

    These are engineering sanity limits for the current prototype.
    They are not final fault thresholds.
    """

    warnings = []

    input_voltage = float(data.get("input_voltage", 0.0))
    output_voltage = float(data.get("output_voltage", 0.0))
    current = float(data.get("current", 0.0))
    temperature_1 = float(data.get("temperature_1", 0.0))
    temperature_2 = float(data.get("temperature_2", 0.0))

    tp1_voltage = float(data.get("tp1_voltage", 0.0))
    tp2_voltage = float(data.get("tp2_voltage", 0.0))
    tp3_voltage = float(data.get("tp3_voltage", 0.0))

    continuity = int(data.get("continuity", 0))

    if not 0.0 <= input_voltage <= 20.0:
        warnings.append("Input voltage is outside the expected 0–20 V range.")

    if not 0.0 <= output_voltage <= 15.0:
        warnings.append("Output voltage is outside the expected 0–15 V range.")

    if not 0.0 <= current <= 5.0:
        warnings.append("Current is outside the expected 0–5 A range.")

    if not -40.0 <= temperature_1 <= 150.0:
        warnings.append("Temperature 1 is outside the expected sensor range.")

    if not -40.0 <= temperature_2 <= 150.0:
        warnings.append("Temperature 2 is outside the expected sensor range.")

    for name, voltage in {
        "TP1": tp1_voltage,
        "TP2": tp2_voltage,
        "TP3": tp3_voltage,
    }.items():
        if not 0.0 <= voltage <= 20.0:
            warnings.append(
                f"{name} voltage is outside the expected 0–20 V range."
            )

    if continuity not in (0, 1):
        warnings.append("Continuity must be either 0 or 1.")

    return {
        "valid": len(warnings) == 0,
        "warnings": warnings,
        "measurement_count": 9,
    }