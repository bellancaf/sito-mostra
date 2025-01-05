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
    },
    {
        id: "5", 
        title: "Floorplan via degli oleandri",
        author: "Unknown",
        publishYear: 1960,
        coverImage: "/images/books/floorplan.jpg",
        description: "Architectural floorplan of via degli oleandri.",
        collageIds: []
    },
    {
        id: "6",
        title: "London Zine",
        author: "Various",
        publishYear: 2023,
        coverImage: "/images/books/london-zine.jpg", 
        description: "A smart and heartfelt zine discovered in a Dalston bookshop.",
        collageIds: []
    }
];

export const collages: Collage[] = [
    {
        id: "1",
        title: "Bimba",
        image: "/images/collages/bimba.jpg",
        description: "A place where I spent infinite hours, the house of my great auntie. Zia Bina. The memories have disappeared a bit. I remember the livingroom, the kitchen. I never met her husband, eveyone told me he was a cool guy. I found the floorplans in an old box and filled it with new memories, new ideas. The words from the zine I found in Dalston are pungent and nicely aggressive, who knows maybe Zia would have liked them. She was a cool one. ",
        date: "2024-27-12",
        bookIds: ["5", "6"],
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
        title: "Tragedy & Statistic",
        image: "/images/collages/tragedy_statistic.jpg",
        description: "Stalin’s misattributed quote is always relevant. Opulence and struggle, more and more evident. On one side the names of the wealthy who died in the sea last year. Huge media coverage, tragedies. On the other a hidden bar chart on top of a brutalist building in the Paris banlieus, those washed up on the shores of Dunkirk are statistics. We don’t know their names, only a few mourn them in the deafening silence of the institutions and the public discourse. A didascalic piece, a bit on the nose maybe but it was simply vomited out after a pretty intense week in Dunkirk, the emotions took over and came out straight, almost banal.",
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
        date: "2024-12-31",
        title: "Metamorphosis of Ideas",
        content: "Revisited The Metamorphosis today, this time alongside The Castle. The way these works interact with each other is fascinating. The themes of transformation and institutional power create an interesting dialogue...",
        bookIds: ["1", "4"],
        collageIds: ["3"],
        location: "City Library",
        mood: "Inspired"
    },
    {
        id: "diary4",
        date: "2024-12-31",
        title: "Roman Treasures",
        content: "Found a treasure trove in a Roman warehouse today - a pack of 'Poliglotta Moderno' from 1905-6, like an ancient Duolingo. A textured map of Cortina D'ampezzo brought back memories of a less-than-pleasant family ski trip. The real gem was a book on Italian folklore - spent the evening reading about Attittadoras, Sardinian euthanasia practitioners, while cooking udons. Also picked up some Socialist Party Cards, a 1936 guide to thermal baths, and a bag of vintage photos. 45€ might have been steep, but these pieces feel priceless...",
        bookIds: [],
        collageIds: [],
        location: "Rome Warehouse Shop",
        mood: "Excited"
    },
    {
        id: "diary5",
        date: "2024-12-30",
        title: "Livorno's Hidden Gems",
        content: "Met Carlo, an ex-military guy from Veneto, in front of the Accademia. Got some fascinating books from his son's collection - one about global revolutionary movements (had to show my appreciation for that one), industrial Rome post-WWII, and oddly, a One Piece manga. But the real discovery was this magical place near the basketball arena - a second-hand store supporting local organizations. Found a goldmine of Livorno history: the football club's story from 1913-1997, city history books, WWII photo collections. These places are like time capsules, telling stories about the city through what people once owned. All for 10€ - definitely making this a weekly stop.",
        bookIds: [],
        collageIds: [],
        location: "Livorno Second-hand Stores",
        mood: "Enthusiastic"
    },
    {
        id: "diary6",
        date: "2024-04-21", 
        title: "Chongqing Market Discovery",
        content: "I finally find the market, it took me almost one hour to get there. Walking randomly inside this city that makes absolutely no sense. I met a few elderly playing cards on plastic tables under the highway. The little grass patches filling with green the concrete structures. The area was very quiet, the cars on top of us. Surreal. I get to the second hand market, needless to say I am the only westener, that creates a lot of curiosity",
        bookIds: [],
        collageIds: [],
        location: "Chongqing Second-hand Market",
        mood: "Curious"
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