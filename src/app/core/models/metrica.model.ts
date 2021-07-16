export interface Result {
    uid: string;
    metrica: Metrica
}

export interface Metrica {
    uid?: string;
    name?: string;
    date?: string;
    hour?: string;
    date_create?: Date;
    expression?: string
}