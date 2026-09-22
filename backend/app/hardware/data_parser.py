class DataParser:

    @staticmethod
    def parse_line(line: str):
        """
        Convert ESP32 serial data into a dictionary.

        Example input:
        voltage=12.01,current=0.18,temperature=28.4,channel=0
        """

        data = {}

        try:
            parts = line.strip().split(",")

            for part in parts:
                key, value = part.split("=")

                key = key.strip()
                value = value.strip()

                if key in ["voltage", "current", "temperature"]:
                    data[key] = float(value)

                elif key == "channel":
                    data[key] = int(value)

                else:
                    data[key] = value

            return data

        except (ValueError, AttributeError):
            return None