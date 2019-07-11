export interface User {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: string;
    lastLogin: Date;
    phoneNumber: string;
    photoURL: string;
    supervisor: boolean;
    favourites: [];
}
export interface UserId extends User {
    id: string;
}
