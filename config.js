export default {
  appName: "SatLomas",
  stationParameters: [
    {
      id: "altitude",
      name: "Altitud (msnm)",
    },
    {
      id: "ambient_temperature",
      name: "Temperatura de Ambiente (°C)",
    },
    {
      id: "atmospheric_pressure",
      name: "Presión Atmosférica (hPa)",
    },
    {
      id: "internal_temperature",
      name: "Temperatura Interna (°C)",
    },
    {
      id: "PM1_0",
      name: "Material Particulado (PM1.0)",
    },
    {
      id: "PM2_5",
      name: "Material Particulado (PM2.5)",
    },
    {
      id: "PM4_0",
      name: "Material Particulado (PM4.0)",
    },
    {
      id: "PM10_0",
      name: "Material Particulado (PM10.0)",
    },
    {
      id: "relative_humidity",
      name: "Humedad Relativa (%)",
    },
    {
      id: "tip_count",
      name: "Conteo de Tipping Bucket",
    },
    {
      id: "wind_speed",
      name: "Velocidad del Viento (m/s)",
    },
    {
      id: "wind_direction",
      name: "Dirección del Viento (grados)",
    },
  ],
  refreshIntervalMs: 1000 * 60,
  measurementContentTypes: [
    { id: "vi_lomas_changes", name: "Vegetación de Lomas" },
    { id: "lomas_changes", name: "Pérdida de Lomas" },
  ],
};
