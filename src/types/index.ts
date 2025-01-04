export interface Book {
    id: string;
    title: string;
    publishYear: number;
    coverImage: string;
    description: string;
    author: string;
    collageIds: string[];  // References to collages that use this book
}

export interface Collage {
    id: string;
    title: string;
    image: string;
    description: string;
    date: string;
    bookIds: string[];  // References to books used in this collage
    diaryEntryIds: string[];  // References to diary entries mentioning this collage
}

export interface DiaryEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    bookIds: string[];  // References to books mentioned in this entry
    collageIds: string[];  // References to collages mentioned in this entry
    location?: string;
    mood?: string;
} 