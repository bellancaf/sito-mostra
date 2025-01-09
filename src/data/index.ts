import { Book, Collage, DiaryEntry } from '../types';

export const books: Book[] = [
    {
        id: "1",
        title: "La Guerre d'Algerie 54-62",
        author: "Tresor",
        publishYear: 1988,
        coverImage: "/images/books/la_guerre_dalgerie_54-62.jpg",
        description: "A salesman wakes up one morning to find himself transformed into a giant insect.",
        collageIds: ["1", "3"]
    },
    {
        id: "2",
        title: "Parcours Enchantés",
        author: "Gilles Beutrolles",
        publishYear: 2010,
        coverImage: "/images/books/parcours_enchantes.jpg",
        description: "A man is arrested and prosecuted by a remote authority without ever knowing the crime he committed.",
        collageIds: ["1"]
    },
    {
        id: "3",
        title: "Algerie Guerre Sans Images",
        author: "Michel von Graffenried",
        publishYear: 1980,
        coverImage: "/images/books/algerie_guerre_sans_images.jpg",
        description: "A photobook about the Algerian war",
        collageIds: ["2", "7"]
    },
    {
        id: "4",
        title: "Les années mémoire 1920",
        author: "Larousse",
        publishYear: 1987,
        coverImage: "/images/books/les_annees_memoire_1920.jpg",
        description: "A fun recollection of the 1920s",
        collageIds: ["3"]
    },
    {
        id: "5", 
        title: "Floorplan via degli oleandri",
        author: "Unknown",
        publishYear: 1960,
        coverImage: "/images/books/condono_via_oleandri.jpg",
        description: "Architectural floorplan of via degli oleandri.",
        collageIds: []
    },
    {
        id: "6",
        title: "Programming Zine",
        author: "Various",
        publishYear: 2023,
        coverImage: "/images/books/programming_zine.jpg", 
        description: "A smart and heartfelt cyberfeminist zine discovered in a Dalston bookshop.",
        collageIds: ["1"]
    },
    {
        id: "7",
        title: "Noi e il Mondo",
        author: "La tribuna",
        publishYear: 1927,
        coverImage: "/images/books/noi_mondo_nov_27.jpg", 
        description: "November 1927, a number of articles on <races>, some fun comments on the italian cinema production and a deep dive on living on an oil ship and what was the fashion about beards and man hairstyle. There's also a little commentary on women's wearing pants.",
        collageIds: ["diary1"]
    },
    {
        id: "8",
        title: "Family photos, Rome 1960s.",
        author: "-",
        publishYear: 1960,
        coverImage: "/images/books/photos_rome_1960.jpg", 
        description: "So interestingly similar, the poses, the places, the clothes. Some scribbles on the back help me navigate some of it but not much more to go by.",
        collageIds: ["diary4"]
    },
    {
        id: "9",
        title: "Revue mondiale 1970",
        author: "-",
        publishYear: 1972,
        coverImage: "/images/books/revue_mondiale_1970.jpg", 
        description: "A review of 1970. A recent history work published in 1972, a fantastic insight of what the institutionalised media in France thought of the world.",
        collageIds: ["8"]
    },
    {
        id: "10",
        title: "Histoire vécue de la résistance",
        author: "-",
        publishYear: 1970,
        coverImage: "/images/books/histoire_vecue_de_la_resistance.jpg", 
        description: "An amazing collection of small zines, found letters, newspapers and other documents. It tells the story of the resistence in France during WWII. Definitely part of the effort to talk about how everyonie was part of the resistance and nobody was collaborating but still...",
        collageIds: ["7"]
    },
    {
        id: "11",
        title: "Folklore Vivant",
        author: "-",
        publishYear: 1970,
        coverImage: "/images/books/folklore_vivant.jpg", 
        description: "It is always fascinating to see how some groups of people talk about themselves and their traditions. Here is about France of the second part of the 1900 talking about itself and its recent past.",
        collageIds: ["7"]
    },
    {
        id: "12",
        title: "Parcours Enchantés",
        author: "-",
        publishYear: 1970,
        coverImage: "/images/books/parcours_enchantes.jpg", 
        description: "So much space, water and trees spent for silly people burning the world as they touch their expensive grass..",
        collageIds: ["2"]
    },
    {
        id: "13",
        title: "Bluff, atroce nuit",
        author: "-",
        publishYear: 1960,
        coverImage: "/images/books/bluff_atroce_nuit.jpg", 
        description: "A graphic novel with photos? The actors are weirdly plastic-y, the stories are about these incredibly conforming, boringly problematic love stories. Issa weird.",
        collageIds: ["2"]
    },
    {
        id: "14",
        title: "Cartes postales et colelction",
        author: "PC",
        publishYear: 1989,
        coverImage: "/images/books/cartes_postales_1989.jpg",
        description: "A collection of postcards and ads from the 80s in France.",
        collageIds: ["1", "9"]
    }
];

export const collages: Collage[] = [
    {
        id: "1",
        title: "Bimba",
        image: "/images/collages/bimba.jpg",
        description: "A place where I spent infinite hours, the house of my great auntie. Zia Bina. The memories have disappeared a bit. I remember the livingroom, the kitchen. I never met her husband, eveyone told me he was a cool guy. I found the floorplans in an old box and filled it with new memories, new ideas. The words from the zine I found in Dalston are pungent and nicely aggressive, who knows maybe Zia would have liked them. She was a cool one. ",
        date: "2024-27-12",
        bookIds: ["11", "3", "9"],
        diaryEntryIds: ["diary1"]
    },
    {
        id: "2",
        title: "Touch Grass",
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
        title: "Sandy Pool",
        image: "/images/collages/sandy_pool.jpg",
        description: "Exploring shapes and intermitted narratives.",
        date: "2024-11-20",
        bookIds: ["13"],
        diaryEntryIds: []
    },
    {
        id: "6",
        title: "Commune Paris",
        image: "/images/collages/commune.jpg",
        description: "Power structures in the depths",
        date: "2024-04-05",
        bookIds: ["14", "3"],
        diaryEntryIds: []
    },
    {
        id: "7",
        title: "Grow Veggies",
        image: "/images/collages/grow_veggies.jpg",
        description: "The transforming nature of self-awareness",
        date: "2024-04-08",
        bookIds: ["10", "3"],
        diaryEntryIds: []
    },
    {
        id: "8",
        title: "Carlo Mantello",
        image: "/images/collages/carlo_mantello.jpg",
        description: "Power unbalances, a happy Allende. Going through the photos of and articles of the almanac of 1970 reminded me of a time where a lot of the fights we consider lost and unwinnable, still were possible. A genuine interest in constructing the future.",
        date: "2024-04-12",
        bookIds: ["2", "9"],
        diaryEntryIds: []
    },
    {
        id: "9",
        title: "Scattered",
        image: "/images/collages/scattered.jpg",
        description: "A surreal journey through bureaucratic landscapes",
        date: "2024-04-15",
        bookIds: ["1", "2", "4","14"],
        diaryEntryIds: []
    },
    {
        id: "10",
        title: "Inconnue",
        image: "/images/collages/inconnue.jpg",
        description: "Many images of these two women from the 60s.",
        date: "2025-01-09",
        bookIds: ["7", "8"],
        diaryEntryIds: ["diary1", "diary4"]
    }
];

export const diaryEntries: DiaryEntry[] = [
    {
        id: "diary1",
        date: "2025-01-05",
        title: "Sassetta",
        content: "Nonna Albina's house, she was born there. Almost a century ago now. The huge fireplace where kids could sit and a number of personal and family memories. It is an extension of home, one that persisted as we moved houses. Most of the shops have closed now, people died. In a couple of cardboard boxes 10s of kilos of magazines, theatre plays, journals. They have been there forever. Some are from the early 1900s. All taken. I will spend countless hours going through them now. A mysterious box of stories, prospectives, memories and takes, most of which will sound silly now, who knows how serious they sounded back then.",
        bookIds: [],
        collageIds: [],
        location: "Sassetta",
        mood: "Nostalgic"
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