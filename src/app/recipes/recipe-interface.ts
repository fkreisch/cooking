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
    opened: number;
}
export interface RecipeId extends Recipe {
    id: string;
}

export interface Rate {
    rate: [
        {
            uid: string;
            score: number;
        }
    ];

}
export interface RateId extends Rate {
    id: string;
}
