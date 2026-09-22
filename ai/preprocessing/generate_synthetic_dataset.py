import os
import numpy as np
import pandas as pd

np.random.seed(42)

# Get the AI folder automatically
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

OUTPUT_DIR = os.path.join(BASE_DIR, "datasets", "raw")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "lm7805_synthetic.csv")

os.makedirs(OUTPUT_DIR, exist_ok=True)

samples_per_class = 200

rows = []


def add_samples(fault_type, fault_component, values):
    for i in range(samples_per_class):
        row = {
            "sample_id": f"{fault_type}_{i+1:04d}",
            "fault_type": fault_type,
            "fault_component": fault_component,
            "input_voltage": np.random.normal(values["input_voltage"][0],
                                              values["input_voltage"][1]),
            "output_voltage": np.random.normal(values["output_voltage"][0],
                                               values["output_voltage"][1]),
            "current": np.random.normal(values["current"][0],
                                        values["current"][1]),
            "temperature_1": np.random.normal(values["temperature_1"][0],
                                              values["temperature_1"][1]),
            "temperature_2": np.random.normal(values["temperature_2"][0],
                                              values["temperature_2"][1]),
            "tp1_voltage": np.random.normal(values["tp1_voltage"][0],
                                            values["tp1_voltage"][1]),
            "tp2_voltage": np.random.normal(values["tp2_voltage"][0],
                                            values["tp2_voltage"][1]),
            "tp3_voltage": np.random.normal(values["tp3_voltage"][0],
                                            values["tp3_voltage"][1]),
            "continuity": values["continuity"]
        }

        rows.append(row)


# Healthy PCB
add_samples("healthy", "none", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (5.0, 0.08),
    "current": (0.18, 0.02),
    "temperature_1": (30, 2),
    "temperature_2": (31, 2),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (11.3, 0.1),
    "tp3_voltage": (5.0, 0.08),
    "continuity": 1
})

# Open resistor
add_samples("open_resistor", "R1", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (1.2, 0.25),
    "current": (0.03, 0.01),
    "temperature_1": (28, 2),
    "temperature_2": (29, 2),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (6.0, 0.3),
    "tp3_voltage": (1.2, 0.25),
    "continuity": 0
})

# Shorted capacitor
add_samples("shorted_capacitor", "C1", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (0.8, 0.25),
    "current": (0.55, 0.06),
    "temperature_1": (48, 4),
    "temperature_2": (40, 3),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (8.0, 0.4),
    "tp3_voltage": (0.8, 0.25),
    "continuity": 0
})

# Faulty diode
add_samples("faulty_diode", "D1", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (3.7, 0.3),
    "current": (0.10, 0.02),
    "temperature_1": (35, 3),
    "temperature_2": (33, 2),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (4.5, 0.3),
    "tp3_voltage": (3.7, 0.3),
    "continuity": 1
})

# Broken PCB track
add_samples("broken_track", "PCB_TRACK", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (0.2, 0.1),
    "current": (0.01, 0.005),
    "temperature_1": (28, 2),
    "temperature_2": (28, 2),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (0.1, 0.05),
    "tp3_voltage": (0.2, 0.1),
    "continuity": 0
})

# Wrong resistor value
add_samples("wrong_resistor", "R1", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (4.2, 0.25),
    "current": (0.12, 0.02),
    "temperature_1": (33, 2),
    "temperature_2": (32, 2),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (9.5, 0.3),
    "tp3_voltage": (4.2, 0.25),
    "continuity": 1
})

# Solder bridge
add_samples("solder_bridge", "PCB_SECTION", {
    "input_voltage": (12.0, 0.15),
    "output_voltage": (2.0, 0.35),
    "current": (0.42, 0.05),
    "temperature_1": (43, 4),
    "temperature_2": (38, 3),
    "tp1_voltage": (12.0, 0.1),
    "tp2_voltage": (7.0, 0.5),
    "tp3_voltage": (2.0, 0.35),
    "continuity": 0
})


df = pd.DataFrame(rows)

# Keep values within reasonable measurement ranges
numeric_columns = [
    "input_voltage",
    "output_voltage",
    "current",
    "temperature_1",
    "temperature_2",
    "tp1_voltage",
    "tp2_voltage",
    "tp3_voltage"
]

for column in numeric_columns:
    df[column] = df[column].clip(lower=0)

df.to_csv(OUTPUT_FILE, index=False)

print("Synthetic dataset generated successfully.")
print(f"File: {OUTPUT_FILE}")
print(f"Total samples: {len(df)}")
print("\nSamples per fault:")
print(df["fault_type"].value_counts())