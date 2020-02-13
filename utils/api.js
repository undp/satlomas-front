const KNOWN_HOST_PAIRS = [
  ["localhost", "localhost:8000"],
  //["app.geolomas.com", "api.geolomas.com"]
];

export function buildApiUrl(path) {
  let apiHostname = location.host;
  for (const [webHost, apiHost] of KNOWN_HOST_PAIRS) {
    if (location.hostname === webHost) {
      apiHostname = apiHost;
      break;
    }
  }
  return `${location.protocol}//${apiHostname}${path}`;
}
