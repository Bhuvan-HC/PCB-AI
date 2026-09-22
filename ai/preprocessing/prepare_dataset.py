import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Find the ai folder automatically
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "raw",
    "lm7805_synthetic.csv"
)

OUTPUT_DIR = os.path.join(
    BASE_DIR,
    "datasets",
    "processed"
)

OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "lm7805_processed.csv"
)

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Input file:")
print(INPUT_FILE)

# Check input file
if not os.path.exists(INPUT_FILE):
    print("\nERROR: Synthetic CSV was not found.")
    print("Check that lm7805_synthetic.csv exists in datasets/raw.")
    exit()

# Load dataset
df = pd.read_csv(INPUT_FILE)

print("\nDataset loaded successfully.")
print("Original shape:", df.shape)

# Remove duplicate rows
df = df.drop_duplicates()

# Required columns
required_columns = [
    "sample_id",
    "fault_type",
    "fault_component",
    "input_voltage",
    "output_voltage",
    "current",
    "temperature_1",
    "temperature_2",
    "tp1_voltage",
    "tp2_voltage",
    "tp3_voltage",
    "continuity"
]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    print("\nERROR: Missing columns:")
    print(missing_columns)
    exit()

# Numeric columns
numeric_columns = [
    "input_voltage",
    "output_voltage",
    "current",
    "temperature_1",
    "temperature_2",
    "tp1_voltage",
    "tp2_voltage",
    "tp3_voltage",
    "continuity"
]

# Convert to numeric
for column in numeric_columns:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce"
    )

# Remove invalid rows
df = df.dropna(subset=numeric_columns)

# Convert continuity to 0 or 1
df["continuity"] = df["continuity"].apply(
    lambda x: 1 if x >= 0.5 else 0
)

# Encode fault type
fault_encoder = LabelEncoder()

df["fault_label"] = fault_encoder.fit_transform(
    df["fault_type"]
)

# Encode component
component_encoder = LabelEncoder()

df["component_label"] = component_encoder.fit_transform(
    df["fault_component"]
)

# Save processed dataset
df.to_csv(
    OUTPUT_FILE,
    index=False
)

# Save fault labels
fault_labels = pd.DataFrame({
    "fault_type": fault_encoder.classes_,
    "fault_label": range(len(fault_encoder.classes_))
})

fault_labels.to_csv(
    os.path.join(
        OUTPUT_DIR,
        "fault_labels.csv"
    ),
    index=False
)

# Save component labels
component_labels = pd.DataFrame({
    "fault_component": component_encoder.classes_,
    "component_label": range(len(component_encoder.classes_))
})

component_labels.to_csv(
    os.path.join(
        OUTPUT_DIR,
        "component_labels.csv"
    ),
    index=False
)

print("\n================================")
print("PREPROCESSING SUCCESSFUL")
print("================================")

print("\nProcessed dataset:")
print(OUTPUT_FILE)

print("\nFinal shape:")
print(df.shape)

print("\nFault distribution:")
print(df["fault_type"].value_counts())

print("\nFiles created:")
print("1. lm7805_processed.csv")
print("2. fault_labels.csv")
print("3. component_labels.csv")