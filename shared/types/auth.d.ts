export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    institutionId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type UserRole = 'ADMIN' | 'DIRECTOR' | 'RESEARCHER' | 'STUDENT' | 'INSTITUTION' | 'GUEST';
export interface AuthToken {
    token: string;
    refreshToken: string;
    expiresIn: number;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    institutionId?: string;
}
export interface AuthResponse {
    user: User;
    tokens: AuthToken;
}
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface PasswordResetRequest {
    email: string;
}
export interface PasswordResetConfirm {
    token: string;
    newPassword: string;
}
//# sourceMappingURL=auth.d.ts.map