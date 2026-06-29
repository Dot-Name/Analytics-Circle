/**
 * Generates or retrieves a persistent browser-specific fingerprint string.
 * This runs completely on the FRONTEND to satisfy the backend's active session restriction checks.
 */
export const getOrCreateDeviceId = () => {
  // 1. Check if we already created and saved a device identifier previously
  let deviceId = localStorage.getItem("app_device_id");
  
  if (!deviceId) {
    // 2. Combine browser traits: screen metrics + a lightweight random token string
    const screenFootprint = `${window.screen.width}x${window.screen.height}`;
    const secureRandomPayload = Math.random().toString(36).substring(2, 9);
    
    // Generates a clean identifier like: "Device-1920x1080-z4k9x2w"
    deviceId = `Device-${screenFootprint}-${secureRandomPayload}`;
    
    // 3. Lock it into localStorage so it stays identical on future visits from this browser
    localStorage.setItem("app_device_id", deviceId);
  }
  
  return deviceId;
};