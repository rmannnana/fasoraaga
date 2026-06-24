import axios from 'axios'
import { useAuthStore } from '../features/auth/store/authStore'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Injection du token JWT sur chaque requête
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Gestion du refresh token sur 401
let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error)
        else prom.resolve(token!)
    })
    failedQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return axiosInstance(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                if (!refreshToken) throw new Error('No refresh token')

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'}/auth/token/refresh/`,
                    { refresh: refreshToken }
                )

                useAuthStore.getState().setAccessToken(data.access)
                processQueue(null, data.access)

                originalRequest.headers.Authorization = `Bearer ${data.access}`
                return axiosInstance(originalRequest)
            } catch (err) {
                processQueue(err, null)
                useAuthStore.getState().logout()
                window.location.href = '/auth'
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance