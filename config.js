export default {
  stationParameters: [
    {
      id: "temperature",
      name: "Temperatura de Ambiente (°C)"
    },
    {
      id: "humidity",
      name: "Humedad Relativa (%)",
    },
    {
      id: "wind_speed",
      name: "Velocidad del Viento (m/s)",
    },
    {
      id: "wind_direction",
      name: "Dirección del Viento (grados)",
    },
    {
      id: "pressure",
      name: "Presión Atmosférica (mbar)",
    },
    {
      id: "precipitation",
      name: "Precipitaciones (niebla)",
    },
    {
      id: "pm25",
      name: "Material Particulado (PM2.5)",
    },
  ],
  measurementContentTypes: [
    { id: "vi_lomas_changes", name: "Vegetación de Lomas" },
    { id: "lomas_changes", name: "Pérdida de Lomas" },
  ],
};
