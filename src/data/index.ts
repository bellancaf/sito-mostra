import { Book, Collage, DiaryEntry } from '../types';

export const books: Book[] = [
    {
        id: "1",
        title: "The Metamorphosis",
        author: "Franz Kafka",
        publishYear: 1915,
        coverImage: "/images/books/metamorphosis.jpg",
        description: "A salesman wakes up one morning to find himself transformed into a giant insect.",
        collageIds: ["1", "3"]
    },
    {
        id: "2",
        title: "The Trial",
        author: "Franz Kafka",
        publishYear: 1925,
        coverImage: "/images/books/the-trial.jpg",
        description: "A man is arrested and prosecuted by a remote authority without ever knowing the crime he committed.",
        collageIds: ["1"]
    },
    {
        id: "3",
        title: "Notes from Underground",
        author: "Fyodor Dostoevsky",
        publishYear: 1864,
        coverImage: "/images/books/notes-underground.jpg",
        description: "The memoirs of an unnamed narrator who has withdrawn from society into an underground existence.",
        collageIds: ["2"]
    },
    {
        id: "4",
        title: "The Castle",
        author: "Franz Kafka",
        publishYear: 1926,
        coverImage: "/images/books/the-castle.jpg",
        description: "A land surveyor known as K. arrives in a village and struggles to gain access to the mysterious authorities who govern it from a castle.",
        collageIds: ["2", "3"]
    }
];

export const collages: Collage[] = [
    {
        id: "1",
        title: "Urban Decay",
        image: "/images/collages/bimba.jpg",
        description: "A meditation on city life and its fragments",
        date: "2024-03-15",
        bookIds: ["1", "2"],
        diaryEntryIds: ["diary1"]
    },
    {
        id: "2",
        title: "Underground Dreams",
        image: "/images/collages/touch_grass.jpg",
        description: "Exploring the subterranean realms of consciousness",
        date: "2024-03-20",
        bookIds: ["3", "4"],
        diaryEntryIds: ["diary2"]
    },
    {
        id: "3",
        title: "Metamorphic Castle",
        image: "/images/collages/tragedy_statistic.jpg",
        description: "Where transformation meets bureaucracy",
        date: "2024-03-25",
        bookIds: ["1", "4"],
        diaryEntryIds: ["diary3"]
    },
    {
        id: "4",
        title: "Bureaucratic Nightmares",
        image: "/images/collages/2781.jpg",
        description: "The crushing weight of administrative systems",
        date: "2024-03-30",
        bookIds: ["2", "4"],
        diaryEntryIds: []
    },
    {
        id: "5",
        title: "Existential Corridors",
        image: "/images/collages/sandy_pool.jpg",
        description: "Wandering through the maze of existence",
        date: "2024-04-02",
        bookIds: ["1", "3"],
        diaryEntryIds: []
    },
    {
        id: "6",
        title: "Underground Authority",
        image: "/images/collages/commune.jpg",
        description: "Power structures in the depths",
        date: "2024-04-05",
        bookIds: ["2", "3"],
        diaryEntryIds: []
    },
    {
        id: "7",
        title: "Metamorphic Consciousness",
        image: "/images/collages/grow_veggies.jpg",
        description: "The transforming nature of self-awareness",
        date: "2024-04-08",
        bookIds: ["1", "3"],
        diaryEntryIds: []
    },
    {
        id: "8",
        title: "Castle in the Mind",
        image: "/images/collages/carlo_mantello.jpg",
        description: "Mental fortresses and their guardians",
        date: "2024-04-12",
        bookIds: ["2", "4"],
        diaryEntryIds: []
    },
    {
        id: "9",
        title: "Kafka's Dream",
        image: "/images/collages/scattered.jpg",
        description: "A surreal journey through bureaucratic landscapes",
        date: "2024-04-15",
        bookIds: ["1", "2", "4"],
        diaryEntryIds: []
    }
];

export const diaryEntries: DiaryEntry[] = [
    {
        id: "diary1",
        date: "2024-03-15",
        title: "Found Kafka in the Rain",
        content: "Today I stumbled upon a weathered copy of The Metamorphosis in a small bookshop. The pages were yellow and crisp, like autumn leaves. The shop owner mentioned it had been there for decades, waiting for the right reader. As I leafed through it, I couldn't help but notice how the descriptions of Gregor's room perfectly matched the architecture I'd been photographing...",
        bookIds: ["1"],
        collageIds: ["1"],
        location: "Old Town Bookstore",
        mood: "Contemplative"
    },
    {
        id: "diary2",
        date: "2024-03-20",
        title: "Underground Revelations",
        content: "Reading Notes from Underground while actually underground in the metro station. The irony wasn't lost on me. Found an old copy of The Castle in the same secondhand bookstore. The way both books deal with alienation and bureaucracy feels eerily relevant...",
        bookIds: ["3", "4"],
        collageIds: ["2"],
        location: "Metro Station",
        mood: "Introspective"
    },
    {
        id: "diary3",
        date: "2024-03-25",
        title: "Metamorphosis of Ideas",
        content: "Revisited The Metamorphosis today, this time alongside The Castle. The way these works interact with each other is fascinating. The themes of transformation and institutional power create an interesting dialogue...",
        bookIds: ["1", "4"],
        collageIds: ["3"],
        location: "City Library",
        mood: "Inspired"
    }
];

// Helper functions to fetch data
export const getBook = (id: string): Book | undefined => 
    books.find(book => book.id === id);

export const getCollage = (id: string): Collage | undefined => 
    collages.find(collage => collage.id === id);

export const getDiaryEntry = (id: string): DiaryEntry | undefined => 
    diaryEntries.find(entry => entry.id === id);

export const getRelatedBooks = (bookIds: string[]): Book[] => 
    books.filter(book => bookIds.includes(book.id));

export const getRelatedCollages = (collageIds: string[]): Collage[] => 
    collages.filter(collage => collageIds.includes(collage.id));

export const getRelatedDiaryEntries = (entryIds: string[]): DiaryEntry[] => 
    diaryEntries.filter(entry => entryIds.includes(entry.id));

// Define the function
export const getCollagesForBook = (bookId: string): Collage[] => {
    return collages.filter(collage => collage.bookIds.includes(bookId));
}; 