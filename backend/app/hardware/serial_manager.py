import serial
import threading

from app.hardware.data_parser import DataParser


class SerialManager:
    def __init__(self, port: str, baudrate: int = 115200, on_measurement=None):
        self.port = port
        self.baudrate = baudrate
        self.on_measurement = on_measurement

        self.serial_connection = None
        self.running = False
        self.thread = None

    def connect(self):
        try:
            self.serial_connection = serial.Serial(
                self.port,
                self.baudrate,
                timeout=1
            )

            self.running = True

            self.thread = threading.Thread(
                target=self._read_serial,
                daemon=True
            )

            self.thread.start()

            print(f"Connected to ESP32 on {self.port}")

            return True

        except Exception as e:
            print(f"Serial connection error: {e}")
            return False

    def _read_serial(self):
        while self.running and self.serial_connection:
            try:
                if self.serial_connection.in_waiting:

                    line = self.serial_connection.readline().decode(
                        "utf-8",
                        errors="ignore"
                    ).strip()

                    if line:
                        print(f"ESP32 RAW: {line}")

                        measurement = DataParser.parse_line(line)

                        if measurement:
                            print(f"Parsed measurement: {measurement}")

                            if self.on_measurement:
                                self.on_measurement(measurement)

                        else:
                            print("Invalid measurement data")

            except Exception as e:
                print(f"Serial read error: {e}")
                break

    def disconnect(self):
        self.running = False

        if self.serial_connection:
            self.serial_connection.close()
            self.serial_connection = None

    def send_command(self, command: str):
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.write(
                f"{command}\n".encode("utf-8")
            )