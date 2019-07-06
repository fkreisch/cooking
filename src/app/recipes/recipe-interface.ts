export interface Demo {
    record: string;
    details: string;
    fields: [];
}
export interface DemoId extends Demo {
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
    steps: [];
    ingredients: [];
    like: [];
    opened: number;
    favourite: boolean;
}

export interface RecipeId extends Recipe {
    id: string;
}

export interface Id {
    id: string;
}

export interface Like {
    id: string;
    score: number;
}
