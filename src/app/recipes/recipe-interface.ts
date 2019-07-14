export interface Id {
    id: string;
}

export interface Recipe {
    name: string;
    short: string;
    long: string;
    serves: number;
    servesfor: string;
    time: number;
    picture: string;
    steps: [{
        step: string;
    }];
    ingredients: [{
        ingredient: string;
        quanity: string;
    }];
}
export interface RecipeId extends Recipe {
    id: string;
}

export interface Data {
    opened: number;
    rateaverage: number;
    ratecount: number;
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
            avatar: string;
            commentdate: Date;
            comment: string;
        }
    ];
}
export interface DataId extends Data {
    id: string;
}
