export interface User {
    uid: string;
    name: string;
    email: string;
    lastLogin: Date;
    photoURL: string;
    supervisor: boolean;
    favourites: [{
        recipeid: string;
    }];
}
export interface UserId extends User {
    id: string;
}
