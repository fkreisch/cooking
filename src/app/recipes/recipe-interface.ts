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
    like: number;
    opened: number;
    favourite: boolean;
}

export interface RecipeId extends Recipe {
    id: string;
}
