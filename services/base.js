import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://aviata.sportsbookengine.com/v1',
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// if refresh token exist
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 &&!originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken'); 
                if (!refreshToken) throw new Error("No refresh token available");
                
                const { data } = await apiClient.post('/auth/refresh-token', { refreshToken });
                localStorage.setItem('token', data.token); 
                return apiClient(originalRequest);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('token'); 
                window.location.reload(); 
            }
        }
        return Promise.reject(error);
    }
);

