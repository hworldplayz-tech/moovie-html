export interface DownloadLink {
  quality: string;
  resolution: string;
  size: string;
  format: string;
  url: string;
}

export interface Episode {
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  overview: string;
  streamUrl: string;
  downloadLinks: DownloadLink[];
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface StreamServer {
  id: string;
  name: string;
  quality: string;
  badge: string;
  streamUrl: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  year: number;
  rating: number;
  quality: '4K UHD' | '1080p FHD' | 'HD';
  duration: string;
  genres: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  featured?: boolean;
  trending?: boolean;
  director?: string;
  creator?: string;
  cast: string[];
  releaseDate: string;
  servers: StreamServer[];
  seasons?: Season[];
  downloadLinks: DownloadLink[];
  relatedIds: string[];
}

export const CATALOG_ITEMS: MediaItem[] = [
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    type: "movie",
    year: 2024,
    rating: 8.6,
    quality: "4K UHD",
    duration: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: true,
    trending: true,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"],
    releaseDate: "March 1, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR 60fps", badge: "Fastest", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
      { id: "srv-2", name: "CloudFlare VIP Server", quality: "1080p FHD Ultra", badge: "Low Latency", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: "srv-3", name: "EdgeCast Direct 3", quality: "1080p High", badge: "Backup", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "6.85 GB", format: "MKV (HEVC 10-bit HDR)", url: "#download-4k" },
      { quality: "1080p Full HD", resolution: "1920x1080", size: "2.40 GB", format: "MP4 (x264 5.1 Audio)", url: "#download-1080p" },
      { quality: "720p HD", resolution: "1280x720", size: "1.15 GB", format: "MP4 (x264 Fast)", url: "#download-720p" }
    ],
    relatedIds: ["interstellar", "blade-runner-2049", "oppenheimer", "the-batman"]
  },
  {
    id: "arcane-s2",
    title: "Arcane: League of Legends",
    type: "tv",
    year: 2024,
    rating: 9.0,
    quality: "4K UHD",
    duration: "2 Seasons (18 Episodes)",
    genres: ["Animation", "Sci-Fi", "Action", "Drama"],
    synopsis: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    featured: true,
    trending: true,
    creator: "Christian Linke, Alex Yee",
    cast: ["Hailee Steinfeld", "Ella Purnell", "Kevin Alejandro", "Katie Leung"],
    releaseDate: "November 9, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
      { id: "srv-2", name: "CloudFlare VIP Server", quality: "1080p FHD", badge: "Fast", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1: Hextech Revolution",
        episodes: [
          { episodeNumber: 1, title: "Welcome to the Playground", duration: "43m", thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80", overview: "Orphan sisters Vi and Powder cause turmoil in the undercity following an adventurous heist in Piltover.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "950 MB", format: "MP4", url: "#" }, { quality: "720p", resolution: "1280x720", size: "480 MB", format: "MP4", url: "#" }] },
          { episodeNumber: 2, title: "Some Mysteries Are Better Left Unsolved", duration: "40m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80", overview: "Jayce faces intense scrutiny from the Academy council for dabbling with illegal magical Hextech science.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "910 MB", format: "MP4", url: "#" }] },
          { episodeNumber: 3, title: "The Base Violence Necessary for Change", duration: "44m", thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80", overview: "An old feud reaches a catastrophic boiling point as Silco unleashes Shimmer upon Zaun.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "980 MB", format: "MP4", url: "#" }] }
        ]
      },
      {
        seasonNumber: 2,
        title: "Season 2: The Final Reckoning",
        episodes: [
          { episodeNumber: 1, title: "Heavy Is The Crown", duration: "48m", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80", overview: "In the wake of Jinx's devastating rocket attack on the Council, Piltover mobilizes for total war.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.1 GB", format: "MP4", url: "#" }] },
          { episodeNumber: 2, title: "Watch It All Burn", duration: "45m", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80", overview: "Vi joins the Enforcers alongside Caitlyn while Jinx becomes an accidental folk symbol for Zaunite rebellion.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.05 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Complete Season 2 (4K)", resolution: "3840x2160", size: "14.2 GB", format: "MKV Pack", url: "#dl-s2-4k" },
      { quality: "Complete Season 1 (1080p)", resolution: "1920x1080", size: "8.4 GB", format: "MP4 Pack", url: "#dl-s1-1080p" }
    ],
    relatedIds: ["cyberpunk-edgerunners", "fallout", "spider-verse", "stranger-things"]
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    type: "movie",
    year: 2023,
    rating: 8.9,
    quality: "4K UHD",
    duration: "3h 00m",
    genres: ["Drama", "Biography", "History"],
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project, followed by political turmoil during the Red Scare.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    featured: true,
    trending: false,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh"],
    releaseDate: "July 21, 2023",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR IMAX", badge: "Original Aspect", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: "srv-2", name: "CloudFlare VIP Server", quality: "1080p FHD", badge: "Ultra Fast", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      { quality: "4K IMAX Enhanced", resolution: "3840x2160", size: "8.10 GB", format: "MKV (HDR10)", url: "#" },
      { quality: "1080p Bluray", resolution: "1920x1080", size: "2.85 GB", format: "MP4 (x264)", url: "#" },
      { quality: "720p HD", resolution: "1280x720", size: "1.30 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["interstellar", "inception", "dune-part-two", "shogun"]
  },
  {
    id: "shogun",
    title: "Shōgun",
    type: "tv",
    year: 2024,
    rating: 8.7,
    quality: "4K UHD",
    duration: "1 Season (10 Episodes)",
    genres: ["Drama", "Action", "Adventure", "History"],
    synopsis: "When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power and devastate his formidable enemies.",
    poster: "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=80",
    featured: true,
    trending: true,
    creator: "Rachel Kondo, Justin Marks",
    cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai", "Tadanobu Asano"],
    releaseDate: "February 27, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K Dolby Vision", badge: "Recommended", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
      { id: "srv-2", name: "VIP Server 2", quality: "1080p FHD", badge: "Low Latency", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1: Anjin",
        episodes: [
          { episodeNumber: 1, title: "Chapter One: Anjin", duration: "70m", thumbnail: "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=300&auto=format&fit=crop&q=80", overview: "John Blackthorne arrives in feudal Japan and is taken prisoner by the local daimyo before Lord Toranaga summons him.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.4 GB", format: "MKV", url: "#" }] },
          { episodeNumber: 2, title: "Chapter Two: Servants of Two Masters", duration: "59m", thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300&auto=format&fit=crop&q=80", overview: "Blackthorne's arrival in Osaka stirs political rivalries within the Council of Regents as Toranaga plots his move.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.2 GB", format: "MKV", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Complete Season 1 (4K HDR)", resolution: "3840x2160", size: "19.5 GB", format: "MKV Pack", url: "#" },
      { quality: "Complete Season 1 (1080p)", resolution: "1920x1080", size: "9.2 GB", format: "MP4 Pack", url: "#" }
    ],
    relatedIds: ["house-of-the-dragon", "succession", "the-last-of-us", "oppenheimer"]
  },
  {
    id: "interstellar",
    title: "Interstellar",
    type: "movie",
    year: 2014,
    rating: 8.7,
    quality: "4K UHD",
    duration: "2h 49m",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    releaseDate: "November 7, 2014",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K UHD 60fps", badge: "Ultra", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: "srv-2", name: "VIP Server 2", quality: "1080p FHD", badge: "Fast", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "7.40 GB", format: "MKV (HDR10)", url: "#" },
      { quality: "1080p Full HD", resolution: "1920x1080", size: "2.60 GB", format: "MP4 (x264)", url: "#" }
    ],
    relatedIds: ["dune-part-two", "oppenheimer", "blade-runner-2049", "inception"]
  },
  {
    id: "fallout",
    title: "Fallout",
    type: "tv",
    year: 2024,
    rating: 8.4,
    quality: "4K UHD",
    duration: "1 Season (8 Episodes)",
    genres: ["Sci-Fi", "Action", "Adventure", "Comedy"],
    synopsis: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation, mutants and bandits.",
    poster: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Geneva Robertson-Dworet, Graham Wagner",
    cast: ["Ella Purnell", "Aaron Moten", "Walton Goggins", "Kyle MacLachlan"],
    releaseDate: "April 10, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: "srv-2", name: "CloudFlare VIP Server", quality: "1080p", badge: "Direct", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1: The Wasteland",
        episodes: [
          { episodeNumber: 1, title: "The End", duration: "74m", thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80", overview: "A peaceful nuclear shelter is breached by surface raiders, forcing vault dweller Lucy into the unforgiving wasteland.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.3 GB", format: "MP4", url: "#" }] },
          { episodeNumber: 2, title: "The Target", duration: "65m", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80", overview: "Maximus dons the Power Armor of the Brotherhood of Steel while The Ghoul tracks a lucrative bounty.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.1 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Season 1 Complete (4K)", resolution: "3840x2160", size: "16.4 GB", format: "MKV Pack", url: "#" },
      { quality: "Season 1 Complete (1080p)", resolution: "1920x1080", size: "7.8 GB", format: "MP4 Pack", url: "#" }
    ],
    relatedIds: ["the-last-of-us", "arcane-s2", "cyberpunk-edgerunners", "the-boys"]
  },
  {
    id: "spider-verse",
    title: "Spider-Man: Across the Spider-Verse",
    type: "movie",
    year: 2023,
    rating: 8.7,
    quality: "4K UHD",
    duration: "2h 20m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    director: "Joaquim Dos Santos, Kemp Powers",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Daniel Kaluuya"],
    releaseDate: "June 2, 2023",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "60 FPS", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
      { id: "srv-2", name: "VIP Server 2", quality: "1080p FHD", badge: "Low Latency", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "6.2 GB", format: "MKV (HDR10)", url: "#" },
      { quality: "1080p FHD", resolution: "1920x1080", size: "2.3 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["arcane-s2", "cyberpunk-edgerunners", "the-batman", "dune-part-two"]
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    type: "tv",
    year: 2023,
    rating: 8.8,
    quality: "4K UHD",
    duration: "1 Season (9 Episodes)",
    genres: ["Drama", "Action", "Adventure", "Sci-Fi"],
    synopsis: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope across a ravaged United States.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Craig Mazin, Neil Druckmann",
    cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna", "Anna Torv"],
    releaseDate: "January 15, 2023",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "High Bitrate", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "When You're Lost in the Darkness", duration: "81m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80", overview: "Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with a mission that could change everything.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.5 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Season 1 Complete (4K)", resolution: "3840x2160", size: "18.5 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["fallout", "shogun", "house-of-the-dragon", "stranger-things"]
  },
  {
    id: "the-batman",
    title: "The Batman",
    type: "movie",
    year: 2022,
    rating: 7.8,
    quality: "4K UHD",
    duration: "2h 56m",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright", "Colin Farrell"],
    releaseDate: "March 4, 2022",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K UHD", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "7.1 GB", format: "MKV", url: "#" },
      { quality: "1080p FHD", resolution: "1920x1080", size: "2.7 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["oppenheimer", "blade-runner-2049", "john-wick-4", "dune-part-two"]
  },
  {
    id: "john-wick-4",
    title: "John Wick: Chapter 4",
    type: "movie",
    year: 2023,
    rating: 7.7,
    quality: "4K UHD",
    duration: "2h 49m",
    genres: ["Action", "Crime", "Thriller"],
    synopsis: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    director: "Chad Stahelski",
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård", "Laurence Fishburne"],
    releaseDate: "March 24, 2023",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K 60fps", badge: "Action Max", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "6.9 GB", format: "MKV", url: "#" },
      { quality: "1080p FHD", resolution: "1920x1080", size: "2.5 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["the-batman", "dune-part-two", "the-boys", "fallout"]
  },
  {
    id: "cyberpunk-edgerunners",
    title: "Cyberpunk: Edgerunners",
    type: "tv",
    year: 2022,
    rating: 8.3,
    quality: "1080p FHD",
    duration: "1 Season (10 Episodes)",
    genres: ["Animation", "Sci-Fi", "Action"],
    synopsis: "A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner: a mercenary outlaw.",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    creator: "Studio Trigger, CD PROJEKT RED",
    cast: ["KENN", "Aoi Yuuki", "Hiroki Touchi", "Michiko Kaiden"],
    releaseDate: "September 13, 2022",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "1080p 60fps", badge: "Studio Trigger Cut", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Let You Down", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80", overview: "David Martinez's life in Night City spirals out of control after a drive-by shooting.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "650 MB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Complete Series (1080p)", resolution: "1920x1080", size: "6.2 GB", format: "MP4 Pack", url: "#" }
    ],
    relatedIds: ["arcane-s2", "blade-runner-2049", "spider-verse", "severance"]
  },
  {
    id: "blade-runner-2049",
    title: "Blade Runner 2049",
    type: "movie",
    year: 2017,
    rating: 8.0,
    quality: "4K UHD",
    duration: "2h 44m",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Sylvia Hoeks"],
    releaseDate: "October 6, 2017",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K UHD", badge: "Deakins Master", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "7.8 GB", format: "MKV", url: "#" },
      { quality: "1080p FHD", resolution: "1920x1080", size: "2.6 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["dune-part-two", "interstellar", "cyberpunk-edgerunners", "inception"]
  },
  {
    id: "severance",
    title: "Severance",
    type: "tv",
    year: 2022,
    rating: 8.7,
    quality: "4K UHD",
    duration: "2 Seasons (19 Episodes)",
    genres: ["Drama", "Mystery", "Sci-Fi", "Thriller"],
    synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    poster: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Dan Erickson",
    cast: ["Adam Scott", "Zach Cherry", "Britt Lower", "Patricia Arquette", "John Turturro"],
    releaseDate: "February 18, 2022",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "Lumon Certified", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Good News About Hell", duration: "57m", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80", overview: "Mark Scout leads a severed macrodata refinement department at Lumon Industries.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.1 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Complete Season 1 (4K)", resolution: "3840x2160", size: "15.0 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["succession", "black-mirror", "inception", "the-bear"]
  },
  {
    id: "the-boys",
    title: "The Boys",
    type: "tv",
    year: 2024,
    rating: 8.7,
    quality: "4K UHD",
    duration: "4 Seasons (32 Episodes)",
    genres: ["Action", "Comedy", "Drama", "Sci-Fi"],
    synopsis: "A fun and irreverent take on what happens when superheroes—who are as popular as celebrities—abuse their superpowers rather than use them for good.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Eric Kripke",
    cast: ["Karl Urban", "Jack Quaid", "Antony Starr", "Erin Moriarty"],
    releaseDate: "June 13, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 4,
        title: "Season 4",
        episodes: [
          { episodeNumber: 1, title: "Department of Dirty Tricks", duration: "59m", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80", overview: "The world is on the brink. Victoria Neuman is closer than ever to the Oval Office and under the muscular thumb of Homelander.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.2 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Season 4 Complete (4K)", resolution: "3840x2160", size: "17.2 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["fallout", "arcane-s2", "the-batman", "john-wick-4"]
  },
  {
    id: "inception",
    title: "Inception",
    type: "movie",
    year: 2010,
    rating: 8.8,
    quality: "4K UHD",
    duration: "2h 28m",
    genres: ["Action", "Sci-Fi", "Adventure"],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy", "Ken Watanabe"],
    releaseDate: "July 16, 2010",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K UHD", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "6.5 GB", format: "MKV", url: "#" },
      { quality: "1080p FHD", resolution: "1920x1080", size: "2.2 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["interstellar", "oppenheimer", "blade-runner-2049", "severance"]
  },
  {
    id: "house-of-the-dragon",
    title: "House of the Dragon",
    type: "tv",
    year: 2024,
    rating: 8.4,
    quality: "4K UHD",
    duration: "2 Seasons (18 Episodes)",
    genres: ["Fantasy", "Action", "Drama", "Adventure"],
    synopsis: "An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Ryan J. Condal, George R.R. Martin",
    cast: ["Emma D'Arcy", "Matt Smith", "Olivia Cooke", "Rhys Ifans"],
    releaseDate: "June 16, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 2,
        title: "Season 2: Dance of the Dragons",
        episodes: [
          { episodeNumber: 1, title: "A Son for a Son", duration: "64m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80", overview: "Rhaenyra struggles to cope with the loss of Lucerys while Daemon schemes bloody retaliation in King's Landing.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.3 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Season 2 Complete (4K)", resolution: "3840x2160", size: "16.8 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["shogun", "arcane-s2", "the-last-of-us", "dune-part-two"]
  },
  {
    id: "inside-out-2",
    title: "Inside Out 2",
    type: "movie",
    year: 2024,
    rating: 7.6,
    quality: "1080p FHD",
    duration: "1h 36m",
    genres: ["Animation", "Comedy", "Adventure", "Drama"],
    synopsis: "Joy, Sadness, Anger, Fear and Disgust have been running a successful operation by all accounts. However, when Anxiety, Envy, Ennui and Embarrassment show up, headquarters undergoes a sudden demolition.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Maya Hawke", "Kensington Tallman", "Liza Lapira"],
    releaseDate: "June 14, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "1080p FHD", badge: "Family Safe", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    downloadLinks: [
      { quality: "1080p Full HD", resolution: "1920x1080", size: "1.8 GB", format: "MP4", url: "#" },
      { quality: "720p HD", resolution: "1280x720", size: "900 MB", format: "MP4", url: "#" }
    ],
    relatedIds: ["spider-verse", "arcane-s2", "ted-lasso"]
  },
  {
    id: "ted-lasso",
    title: "Ted Lasso",
    type: "tv",
    year: 2023,
    rating: 8.8,
    quality: "1080p FHD",
    duration: "3 Seasons (34 Episodes)",
    genres: ["Comedy", "Drama", "Sports"],
    synopsis: "American college football coach Ted Lasso heads to London to manage AFC Richmond, a struggling English Premier League football team.",
    poster: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    creator: "Brendan Hunt, Joe Kelly, Bill Lawrence, Jason Sudeikis",
    cast: ["Jason Sudeikis", "Hannah Waddingham", "Brett Goldstein", "Juno Temple"],
    releaseDate: "March 15, 2023",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "1080p FHD", badge: "Fast", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Pilot", duration: "32m", thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80", overview: "American football coach Ted Lasso arrives in the UK to take charge of AFC Richmond.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "750 MB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Complete Series (1080p)", resolution: "1920x1080", size: "18.4 GB", format: "MP4 Pack", url: "#" }
    ],
    relatedIds: ["the-bear", "succession", "inside-out-2"]
  },
  {
    id: "the-bear",
    title: "The Bear",
    type: "tv",
    year: 2024,
    rating: 8.6,
    quality: "4K UHD",
    duration: "3 Seasons (28 Episodes)",
    genres: ["Drama", "Comedy"],
    synopsis: "A young fine-dining chef returns home to Chicago to run his family Italian beef sandwich shop after a tragic death in his family.",
    poster: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Christopher Storer",
    cast: ["Jeremy Allen White", "Ebon Moss-Bachrach", "Ayo Edebiri", "Liza Colón-Zayas"],
    releaseDate: "June 27, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 3,
        title: "Season 3",
        episodes: [
          { episodeNumber: 1, title: "Tomorrow", duration: "37m", thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80", overview: "Carmy pushes himself harder than ever, demanding culinary excellence from his crew.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "900 MB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Season 3 Complete (4K)", resolution: "3840x2160", size: "14.0 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["succession", "severance", "shogun", "ted-lasso"]
  },
  {
    id: "parasite",
    title: "Parasite",
    type: "movie",
    year: 2019,
    rating: 8.5,
    quality: "4K UHD",
    duration: "2h 12m",
    genres: ["Drama", "Thriller", "Comedy"],
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
    releaseDate: "November 8, 2019",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K UHD", badge: "Palme d'Or Master", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ],
    downloadLinks: [
      { quality: "4K Ultra HD", resolution: "3840x2160", size: "5.9 GB", format: "MKV", url: "#" },
      { quality: "1080p FHD", resolution: "1920x1080", size: "2.1 GB", format: "MP4", url: "#" }
    ],
    relatedIds: ["oppenheimer", "severance", "the-menu", "squid-game"]
  },
  {
    id: "squid-game",
    title: "Squid Game",
    type: "tv",
    year: 2024,
    rating: 8.0,
    quality: "4K UHD",
    duration: "2 Seasons (15 Episodes)",
    genres: ["Action", "Drama", "Mystery", "Thriller"],
    synopsis: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: true,
    creator: "Hwang Dong-hyuk",
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon", "Jung Ho-yeon"],
    releaseDate: "December 26, 2024",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "VIP", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Red Light, Green Light", duration: "60m", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80", overview: "Hoping to win easy money, Gi-hun agrees to play an enigmatic game, but its deadly reality soon becomes clear.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.2 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Complete Series (4K)", resolution: "3840x2160", size: "15.8 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["parasite", "the-boys", "stranger-things", "arcane-s2"]
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "tv",
    year: 2024,
    rating: 8.7,
    quality: "4K UHD",
    duration: "4 Seasons (34 Episodes)",
    genres: ["Drama", "Fantasy", "Horror", "Sci-Fi"],
    synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    featured: false,
    trending: false,
    creator: "The Duffer Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
    releaseDate: "July 1, 2022",
    servers: [
      { id: "srv-1", name: "FastStream CDN 1", quality: "4K HDR", badge: "Dolby Atmos", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ],
    seasons: [
      {
        seasonNumber: 4,
        title: "Season 4",
        episodes: [
          { episodeNumber: 1, title: "Chapter One: The Hellfire Club", duration: "76m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80", overview: "El struggles to fit in at school in California, while Hawkins High gets ready for championship basketball.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", downloadLinks: [{ quality: "1080p", resolution: "1920x1080", size: "1.4 GB", format: "MP4", url: "#" }] }
        ]
      }
    ],
    downloadLinks: [
      { quality: "Season 4 Complete (4K)", resolution: "3840x2160", size: "22.5 GB", format: "MKV Pack", url: "#" }
    ],
    relatedIds: ["fallout", "the-last-of-us", "arcane-s2", "cyberpunk-edgerunners"]
  }
];
