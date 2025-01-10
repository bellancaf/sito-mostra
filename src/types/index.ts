export interface Location {
    country: string;
    city: string;
    coordinates: [number, number]; // [latitude, longitude]
    name: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    publishYear: number;
    coverImage: string;
    description: string;
    diaryIds: string[];
    location?: Location; // Making it optional since some books might not have location data
}

export interface Collage {
    id: string;
    title: string;
    image: string;
    description: string;
    date: string;
    bookIds: string[];  // References to books used in this collage
}

export interface DiaryEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    bookIds: string[];  // References to books mentioned in this entry
    location?: string;
    mood?: string;
} 