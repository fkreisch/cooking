export interface Id {
    id: string;
}
// RECIPE
export interface Recipe {
    name: string;
    short: string;
    long: string;
    serves: number;
    servesfor: string;
    preptime: number;
    time: number;
    cat1: string;
    cat2: string;
    cat3: string;
    picture: string;
    steps: [{
        step: string;
    }];
    ingredients: [{
        ingredient: string;
        quanity: string;
    }];
    senderId: string;
    senderPhotoURL: string;
    senderName: string;
    sendingDate: any;
    share: boolean;
    favourites: [{
        uid: string;
    }];
    rate: [
        {
            uid: string;
            score: number;
        }
    ];
    comments: [
        {
            uid: string;
            name: string;
            photoURL: string;
            commentdate: any;
            comment: string;
        }
    ];
    rateaverage: number;
    ratecount: number;
    opened: number;
}
export interface RecipeId extends Recipe {
    id: string;
}

export interface Comments {
    uid: string;
    name: string;
    photoURL: string;
    commentdate: Date;
    comment: string;
}

export interface Link {
    elink: string;
    name: string;
    picture: string;
}
export interface LinkId extends Link {
    id: string;
}
