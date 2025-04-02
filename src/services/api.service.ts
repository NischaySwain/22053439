import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';
const CLIENT_ID = 'dc6888c6-0ce7-4e12-85f1-dffa7c389b8d';
const CLIENT_SECRET = 'aaHtUQagfQrYdUeQ';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAwMTA4LCJpYXQiOjE3NDM1OTk4MDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRjNjg4OGM2LTBjZTctNGUxMi04NWYxLWRmZmE3YzM4OWI4ZCIsInN1YiI6IjIyMDUzNDM5QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MzQzOUBraWl0LmFjLmluIiwibmFtZSI6Im5pc2NoYXkgc3dhaW4iLCJyb2xsTm8iOiIyMjA1MzQzOSIsImFjY2Vzc0NvZGUiOiJud3B3cloiLCJjbGllbnRJRCI6ImRjNjg4OGM2LTBjZTctNGUxMi04NWYxLWRmZmE3YzM4OWI4ZCIsImNsaWVudFNlY3JldCI6ImFhSHRVUWFnZlFyWWRVZVEifQ.runffSevviv6cLugPk7nQtARh2BwYARza45x4w_ZBkU';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
});

// Add request interceptor for logging
api.interceptors.request.use(
    config => {
        // Add authentication parameters to query string for all requests
        config.params = {
            ...config.params,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        };
        console.log('Request:', config.method?.toUpperCase(), config.url, config.params);
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        console.log('Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
);

export interface User {
    id: string;
    name: string;
}

export interface Post {
    id: number;
    userId: number;
    content: string;
}

export interface Comment {
    id: number;
    postId: number;
    content: string;
}

// Mock data in case the API is unreachable due to CORS
const MOCK_USERS = [
    { id: "1", name: "John Doe" },
    { id: "10", name: "Helen Moore" },
    { id: "11", name: "Ivy Taylor" },
    { id: "12", name: "Jack Anderson" },
    { id: "13", name: "Kathy Thomas" }
];

const MOCK_POSTS = [
    { id: 246, userId: 1, content: "Post about ant" },
    { id: 161, userId: 1, content: "Post about elephant" },
    { id: 158, userId: 1, content: "Post about ocean" },
    { id: 370, userId: 1, content: "Post about monkey" },
    { id: 344, userId: 1, content: "Post about ocean" }
];

export const ApiService = {
    getUsers: async (): Promise<User[]> => {
        try {
            const response = await api.get('/users');
            return response.data.users || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            console.log('Returning mock users due to API error');
            return MOCK_USERS;
        }
    },

    getPosts: async (userId?: string): Promise<Post[]> => {
        try {
            const url = userId ? `/users/${userId}/posts` : '/users/1/posts';
            const response = await api.get(url);
            return response.data.posts || [];
        } catch (error) {
            console.error('Error fetching posts:', error);
            console.log('Returning mock posts due to API error');
            return MOCK_POSTS;
        }
    },

    getComments: async (postId: number): Promise<Comment[]> => {
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            return response.data.comments || [];
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }
}; 