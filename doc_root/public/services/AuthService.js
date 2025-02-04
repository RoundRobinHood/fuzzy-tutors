import {ApiService} from '/services/ApiService.js';
import { API_CONFIG } from '../config/apiConfig.js';
import { SessionManager } from '/services/SessionManager.js';

class AuthService {
    static async register(username, userType, email, password) {
        const response = await ApiService.withRetry(() => 
            ApiService.makeApiCall(API_CONFIG.endpoints.auth.signup, 'POST', {
                username,
                userType,
                email,
                password
            })
        );

        if (response.isSuccessful) {
            await SessionManager.getNewToken();
        }

        return response;
    }

    static async login(usernameOrEmail, isEmail, password) {
        const body = {
            password,
            ...(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })
        };

        const response = await ApiService.withRetry(() => 
            ApiService.makeApiCall(API_CONFIG.endpoints.auth.login, 'POST', body)
        );

        if (response.isSuccessful) {
            await SessionManager.getNewToken();
            SessionManager.redirectToHome();
        }

        return response;
    }

    static async updateProfile(name, email) {
        const response = await ApiService.withRetry(() => 
            ApiService.makeApiCall(API_CONFIG.endpoints.auth.settings, 'PATCH', {
                name,
                email
            })
        );

        if (response.isSuccessful) {
            await SessionManager.getNewToken();
        }

        return response;
    }

    static async getProfile() {
        const response = await ApiService.withRetry(() => 
            ApiService.makeApiCall(API_CONFIG.endpoints.auth.settings, 'GET')
        );

        if (response.isSuccessful) {
            await SessionManager.getNewToken();
        }

        return response;
    }

    static async updatePassword(oldPassword, newPassword) {
        const response = await ApiService.withRetry(() => 
            ApiService.makeApiCall(API_CONFIG.endpoints.auth.changePassword, 'PUT', {
                oldPassword,
                newPassword
            })
        );

        if (response.isSuccessful) {
            await SessionManager.getNewToken();
        }

        return response;
    }

    static async requestPasswordReset(email) {
        const response = await ApiService.makeApiCall(API_CONFIG.endpoints.auth.forgotPassword, 'POST', {
            email
        });

        return response;
    }

    static async resetPassword(token, newPassword) {
        const response = await ApiService.makeApiCall(API_CONFIG.endpoints.auth.forgotPassword, 'PATCH', {
            token,
            password: newPassword,
        })

        return response;
    }
}

export {AuthService};