export interface Artworks{
    url: string;
}

export interface Screenshots{
    url: string;
}

export interface Cover{
    url: string;
}



export interface IGDB {
    name: string;
    cover: string | null;
    artworks: Artworks[] | null;
    screenshots: Screenshots[] | null;
}

export interface IGDBGame {
    name: string;
    image: string | null;
}

export type IGDBGameList = IGDBGame[];