export interface Product {
    Name: string,
    allergies: string,
    category: string,
    description: string,
    favorited: string,
    healthProblem: string,
    imageUrl: string,
    ingredients: string,
    price: number,
    rate: number,
    rate_num: number,
    stock: number,
}

export interface State {
    firebase: JSON
}