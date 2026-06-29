import axios from 'axios';

// --- INITIALIZE CENTRALIZED CLIENT STORAGE CONFIGURATION ---
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Your backend API Gateway Root
  withCredentials: true, // Crucial: Commands the browser to append and track HttpOnly refresh cookies
});

/**
 * 1. REQUEST INTERCEPTOR
 * Automatically runs right before any HTTP request leaves your app.
 * Injects the latest access token from localStorage into the Authorization Header.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 2. RESPONSE INTERCEPTOR
 * Catches all incoming responses. If a request fails with a 401 (Token Expired),
 * it halts the pipeline, calls the token refresh endpoint, saves the new token,
 * and retries the original user action silently without forcing a logout.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // If the request is successful, pass it straight through to your components
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error status indicates an expired token, and ensure we haven't already retried it once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Flag the request to prevent infinite loops if refresh fails

      try {
        console.log('Access token expired. Attempting background token rotation...');

        // 🔄 Hit the /auth/refresh route relatively using our configured base path URL 
        const response = await axios.post(
          'http://localhost:5000/api/v1/auth/refresh',
          {},
          { withCredentials: true } // Ensures the browser sends the HTTP-Only refresh cookie
        );

        const { accessToken } = response.data;

        // Save the brand new unexpired access token into local storage
        localStorage.setItem('accessToken', accessToken);

        // Update the failed original request headers with the fresh token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        console.log('Token rotation successful. Re-executing interrupted transaction.');
        
        // ↩️ Re-execute and return the initial promise stream using the newly updated config
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token is invalid or session has expired. Evicting user context...', refreshError);
        
        // 🚪 Clean up state and push to registration gate if refresh token is completely dead
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    // Return all other standard API error codes (e.g., 400, 404, 500) straight to your try/catch UI blocks
    return Promise.reject(error);
  }
);

export default axiosInstance;