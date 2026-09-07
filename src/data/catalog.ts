export interface DownloadLink {
  label: string;
  url: string;
  quality: string;
  size: string;
  resolution: string;
  format: string;
}

export interface EpisodeItem {
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  overview: string;
  embedUrl: string;
  streamUrl?: string;
  downloadLinks: DownloadLink[];
}

export interface SeasonItem {
  seasonNumber: number;
  title: string;
  episodes: EpisodeItem[];
  zipPackLinks: DownloadLink[];
}

export interface StreamServer {
  id: string;
  name: string;
  quality: string;
  badge: string;
  embedUrl: string;
  streamUrl?: string;
}

export interface MediaItem {
  id: string;
  tmdbId: string;
  title: string;
  type: 'movie' | 'tv';
  year: number;
  rating: number;
  quality: string;
  duration: string;
  genres: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  releaseDate: string;
  downloadLinks: DownloadLink[];
  hasRealDownloads?: boolean;
  servers: StreamServer[];
  seasons?: SeasonItem[];
  featured?: boolean;
  trending?: boolean;
  director?: string;
  cast?: string[];
  related?: Partial<MediaItem>[];
}

export const INITIAL_CATALOG: MediaItem[] = [
  {
    id: "tmdb-533535",
    tmdbId: "533535",
    title: "Deadpool & Wolverine",
    type: "movie",
    year: 2024,
    rating: 8.1,
    quality: "4K UHD",
    duration: "2h 8m",
    genres: ["Action", "Comedy", "Sci-Fi"],
    synopsis: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/yDHYTjA3R0ne82istFR4WvEdZ2C.jpg",
    releaseDate: "2024-07-26",
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin"],
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K UHD (HEVC HDR)",
        url: "https://dl.vidsrc.me/download/533535/4k",
        quality: "4K UHD",
        size: "6.8 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      },
      {
        label: "Download 1080p FHD (BluRay)",
        url: "https://dl.vidsrc.me/download/533535/1080p",
        quality: "1080p FHD",
        size: "2.4 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      },
      {
        label: "Download 720p HD (Fast Speed)",
        url: "https://dl.vidsrc.me/download/533535/720p",
        quality: "720p HD",
        size: "1.1 GB",
        resolution: "1280x720",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "4K UHD",
        badge: "Ultra Fast",
        embedUrl: "https://vidsrc.to/embed/movie/533535"
      },
      {
        id: "superembed",
        name: "SuperEmbed CDN",
        quality: "1080p FHD",
        badge: "Zero Buffer",
        embedUrl: "https://multiembed.mov/?video_id=533535&tmdb=1"
      },
      {
        id: "embedsu",
        name: "EmbedSU Direct",
        quality: "1080p FHD",
        badge: "Ad-Free",
        embedUrl: "https://embed.su/embed/movie/533535"
      }
    ]
  },
  {
    id: "tmdb-693134",
    tmdbId: "693134",
    title: "Dune: Part Two",
    type: "movie",
    year: 2024,
    rating: 8.6,
    quality: "4K UHD",
    duration: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    synopsis: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
    releaseDate: "2024-03-01",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K IMAX HDR",
        url: "https://dl.vidsrc.me/download/693134/4k",
        quality: "4K UHD",
        size: "8.2 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      },
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/693134/1080p",
        quality: "1080p FHD",
        size: "2.8 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      },
      {
        label: "Download 720p HD",
        url: "https://dl.vidsrc.me/download/693134/720p",
        quality: "720p HD",
        size: "1.3 GB",
        resolution: "1280x720",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "4K UHD",
        badge: "Ultra Fast",
        embedUrl: "https://vidsrc.to/embed/movie/693134"
      },
      {
        id: "superembed",
        name: "SuperEmbed CDN",
        quality: "1080p FHD",
        badge: "Zero Buffer",
        embedUrl: "https://multiembed.mov/?video_id=693134&tmdb=1"
      }
    ]
  },
  {
    id: "tmdb-1022789",
    tmdbId: "1022789",
    title: "Inside Out 2",
    type: "movie",
    year: 2024,
    rating: 7.7,
    quality: "4K UHD",
    duration: "1h 36m",
    genres: ["Animation", "Comedy", "Family"],
    synopsis: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up with Envy, Ennui, and Embarrassment.",
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/stKGOmvdvtgninMj9Gha09LgtAE.jpg",
    releaseDate: "2024-06-14",
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Maya Hawke", "Kensington Tallman", "Liza Lapira"],
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 1080p FHD (WebRip)",
        url: "https://dl.vidsrc.me/download/1022789/1080p",
        quality: "1080p FHD",
        size: "1.9 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      },
      {
        label: "Download 720p HD",
        url: "https://dl.vidsrc.me/download/1022789/720p",
        quality: "720p HD",
        size: "950 MB",
        resolution: "1280x720",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "4K UHD",
        badge: "Ultra Fast",
        embedUrl: "https://vidsrc.to/embed/movie/1022789"
      },
      {
        id: "superembed",
        name: "SuperEmbed CDN",
        quality: "1080p FHD",
        badge: "Zero Buffer",
        embedUrl: "https://multiembed.mov/?video_id=1022789&tmdb=1"
      }
    ]
  },
  {
    id: "tmdb-558449",
    tmdbId: "558449",
    title: "Gladiator II",
    type: "movie",
    year: 2024,
    rating: 7.3,
    quality: "4K UHD",
    duration: "2h 28m",
    genres: ["Action", "Adventure", "Drama"],
    synopsis: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. With rage in his heart and the future of the Empire at stake, Lucius must look to his past to find strength.",
    poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL69ovr.jpg",
    releaseDate: "2024-11-22",
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen"],
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K UHD Remux",
        url: "https://dl.vidsrc.me/download/558449/4k",
        quality: "4K UHD",
        size: "7.5 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      },
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/558449/1080p",
        quality: "1080p FHD",
        size: "2.5 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "4K UHD",
        badge: "Ultra Fast",
        embedUrl: "https://vidsrc.to/embed/movie/558449"
      }
    ]
  },
  {
    id: "tmdb-945961",
    tmdbId: "945961",
    title: "Alien: Romulus",
    type: "movie",
    year: 2024,
    rating: 7.3,
    quality: "1080p FHD",
    duration: "1h 59m",
    genres: ["Horror", "Sci-Fi"],
    synopsis: "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
    poster: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao8l3urDDujmmQh.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg",
    releaseDate: "2024-08-16",
    director: "Fede Álvarez",
    cast: ["Cailee Spaeny", "David Jonsson", "Archie Renaux", "Isabela Merced"],
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/945961/1080p",
        quality: "1080p FHD",
        size: "2.2 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "1080p FHD",
        badge: "Fast CDN",
        embedUrl: "https://vidsrc.to/embed/movie/945961"
      }
    ]
  },
  {
    id: "tmdb-872585",
    tmdbId: "872585",
    title: "Oppenheimer",
    type: "movie",
    year: 2023,
    rating: 8.9,
    quality: "4K UHD",
    duration: "3h 0m",
    genres: ["Drama", "History"],
    synopsis: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, exploring the moral consequences and political fallout that defined the atomic era.",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fm6K9vY92Yr8zbqfgQIALVJ669m.jpg",
    releaseDate: "2023-07-21",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K UHD IMAX",
        url: "https://dl.vidsrc.me/download/872585/4k",
        quality: "4K UHD",
        size: "9.1 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      },
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/872585/1080p",
        quality: "1080p FHD",
        size: "3.2 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "4K UHD",
        badge: "Ultra Fast",
        embedUrl: "https://vidsrc.to/embed/movie/872585"
      }
    ]
  },
  {
    id: "tmdb-157336",
    tmdbId: "157336",
    title: "Interstellar",
    type: "movie",
    year: 2014,
    rating: 8.7,
    quality: "4K UHD",
    duration: "2h 49m",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    synopsis: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rAiYTsqOdikIpKVlhgHGl4qZ5Hm.jpg",
    releaseDate: "2014-11-07",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K IMAX Remux",
        url: "https://dl.vidsrc.me/download/157336/4k",
        quality: "4K UHD",
        size: "8.5 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      },
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/157336/1080p",
        quality: "1080p FHD",
        size: "2.6 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro (High Speed)",
        quality: "4K UHD",
        badge: "Ultra Fast",
        embedUrl: "https://vidsrc.to/embed/movie/157336"
      }
    ]
  },
  {
    id: "tmdb-27205",
    tmdbId: "27205",
    title: "Inception",
    type: "movie",
    year: 2010,
    rating: 8.8,
    quality: "4K UHD",
    duration: "2h 28m",
    genres: ["Action", "Sci-Fi", "Adventure"],
    synopsis: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2010-07-16",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K UHD",
        url: "https://dl.vidsrc.me/download/27205/4k",
        quality: "4K UHD",
        size: "7.1 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro",
        quality: "4K UHD",
        badge: "Fast CDN",
        embedUrl: "https://vidsrc.to/embed/movie/27205"
      }
    ]
  },
  {
    id: "tmdb-155",
    tmdbId: "155",
    title: "The Dark Knight",
    type: "movie",
    year: 2008,
    rating: 9.0,
    quality: "4K UHD",
    duration: "2h 32m",
    genres: ["Action", "Crime", "Drama"],
    synopsis: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    releaseDate: "2008-07-18",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Michael Caine", "Gary Oldman"],
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K UHD",
        url: "https://dl.vidsrc.me/download/155/4k",
        quality: "4K UHD",
        size: "7.8 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro",
        quality: "4K UHD",
        badge: "Fast CDN",
        embedUrl: "https://vidsrc.to/embed/movie/155"
      }
    ]
  },
  {
    id: "tmdb-569094",
    tmdbId: "569094",
    title: "Spider-Man: Across the Spider-Verse",
    type: "movie",
    year: 2023,
    rating: 8.4,
    quality: "4K UHD",
    duration: "2h 20m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    synopsis: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    releaseDate: "2023-06-02",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"],
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/569094/1080p",
        quality: "1080p FHD",
        size: "2.4 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro",
        quality: "4K UHD",
        badge: "Fast CDN",
        embedUrl: "https://vidsrc.to/embed/movie/569094"
      }
    ]
  },
  {
    id: "tmdb-414906",
    tmdbId: "414906",
    title: "The Batman",
    type: "movie",
    year: 2022,
    rating: 7.7,
    quality: "4K UHD",
    duration: "2h 56m",
    genres: ["Crime", "Mystery", "Action"],
    synopsis: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    releaseDate: "2022-03-04",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright"],
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 1080p FHD",
        url: "https://dl.vidsrc.me/download/414906/1080p",
        quality: "1080p FHD",
        size: "2.9 GB",
        resolution: "1920x1080",
        format: "MP4 / x264"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro",
        quality: "4K UHD",
        badge: "Fast CDN",
        embedUrl: "https://vidsrc.to/embed/movie/414906"
      }
    ]
  },
  {
    id: "tmdb-76600",
    tmdbId: "76600",
    title: "Avatar: The Way of Water",
    type: "movie",
    year: 2022,
    rating: 7.6,
    quality: "4K UHD",
    duration: "3h 12m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    synopsis: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    releaseDate: "2022-12-16",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldaña", "Sigourney Weaver", "Stephen Lang"],
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download 4K HDR",
        url: "https://dl.vidsrc.me/download/76600/4k",
        quality: "4K UHD",
        size: "8.9 GB",
        resolution: "3840x2160",
        format: "MKV / x265"
      }
    ],
    servers: [
      {
        id: "vidsrc-embed",
        name: "VidSrc Pro",
        quality: "4K UHD",
        badge: "Fast CDN",
        embedUrl: "https://vidsrc.to/embed/movie/76600"
      }
    ]
  },
  {
    id: "tmdb-tv-94997",
    tmdbId: "94997",
    title: "House of the Dragon",
    type: "tv",
    year: 2024,
    rating: 8.4,
    quality: "4K UHD",
    duration: "2 Seasons",
    genres: ["Action", "Drama", "Fantasy"],
    synopsis: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne.",
    poster: "https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/etj5CuMuam3hGQ3QIzegACFL0F6.jpg",
    releaseDate: "2022-08-21",
    featured: true,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download Season 2 Complete 1080p Pack",
        url: "https://dl.vidsrc.me/download/tv/94997/s2-pack",
        quality: "1080p FHD",
        size: "7.8 GB",
        resolution: "1920x1080",
        format: "ZIP / MP4"
      }
    ],
    servers: [
      {
        id: "vidsrc-tv",
        name: "VidSrc TV HD",
        quality: "1080p FHD",
        badge: "Auto Next",
        embedUrl: "https://vidsrc.to/embed/tv/94997/1/1"
      }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        zipPackLinks: [
          {
            label: "Download Season 1 Pack (1080p)",
            url: "https://dl.vidsrc.me/download/tv/94997/s1-pack",
            quality: "1080p FHD",
            size: "8.5 GB",
            resolution: "1920x1080",
            format: "ZIP / MP4"
          }
        ],
        episodes: [
          {
            episodeNumber: 1,
            title: "The Heirs of the Dragon",
            duration: "66m",
            thumbnail: "https://image.tmdb.org/t/p/w500/1XddMrkpB0So5yZsUqBkeq7k3oA.jpg",
            overview: "Viserys hosts a tournament to celebrate the birth of his second child. Rhaenyra welcomes her uncle Daemon back to the Red Keep.",
            embedUrl: "https://vidsrc.to/embed/tv/94997/1/1",
            downloadLinks: [
              {
                label: "Download S1E1 1080p",
                url: "https://dl.vidsrc.me/download/tv/94997/1/1",
                quality: "1080p FHD",
                size: "950 MB",
                resolution: "1920x1080",
                format: "MP4"
              }
            ]
          },
          {
            episodeNumber: 2,
            title: "The Rogue Prince",
            duration: "54m",
            thumbnail: "https://image.tmdb.org/t/p/w500/1XddMrkpB0So5yZsUqBkeq7k3oA.jpg",
            overview: "Rhaenyra oversteps at the Small Council. Viserys is urged to secure the succession through marriage.",
            embedUrl: "https://vidsrc.to/embed/tv/94997/1/2",
            downloadLinks: [
              {
                label: "Download S1E2 1080p",
                url: "https://dl.vidsrc.me/download/tv/94997/1/2",
                quality: "1080p FHD",
                size: "850 MB",
                resolution: "1920x1080",
                format: "MP4"
              }
            ]
          }
        ]
      },
      {
        seasonNumber: 2,
        title: "Season 2",
        zipPackLinks: [
          {
            label: "Download Season 2 Pack (1080p)",
            url: "https://dl.vidsrc.me/download/tv/94997/s2-pack",
            quality: "1080p FHD",
            size: "7.8 GB",
            resolution: "1920x1080",
            format: "ZIP / MP4"
          }
        ],
        episodes: [
          {
            episodeNumber: 1,
            title: "A Son for a Son",
            duration: "61m",
            thumbnail: "https://image.tmdb.org/t/p/w500/1XddMrkpB0So5yZsUqBkeq7k3oA.jpg",
            overview: "Rhaenyra mourns Lucerys while Daemon seeks vengeance against Aemond and the Greens.",
            embedUrl: "https://vidsrc.to/embed/tv/94997/2/1",
            downloadLinks: [
              {
                label: "Download S2E1 1080p",
                url: "https://dl.vidsrc.me/download/tv/94997/2/1",
                quality: "1080p FHD",
                size: "950 MB",
                resolution: "1920x1080",
                format: "MP4"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "tmdb-tv-100088",
    tmdbId: "100088",
    title: "The Last of Us",
    type: "tv",
    year: 2023,
    rating: 8.6,
    quality: "4K UHD",
    duration: "1 Season",
    genres: ["Drama", "Sci-Fi", "Action"],
    synopsis: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrRI.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    releaseDate: "2023-01-15",
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download Complete Season 1 (1080p)",
        url: "https://dl.vidsrc.me/download/tv/100088/s1-pack",
        quality: "1080p FHD",
        size: "9.2 GB",
        resolution: "1920x1080",
        format: "ZIP / MP4"
      }
    ],
    servers: [
      {
        id: "vidsrc-tv",
        name: "VidSrc TV HD",
        quality: "1080p FHD",
        badge: "Auto Next",
        embedUrl: "https://vidsrc.to/embed/tv/100088/1/1"
      }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        zipPackLinks: [],
        episodes: [
          {
            episodeNumber: 1,
            title: "When You're Lost in the Darkness",
            duration: "81m",
            thumbnail: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrRI.jpg",
            overview: "Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with a mission that could change everything.",
            embedUrl: "https://vidsrc.to/embed/tv/100088/1/1",
            downloadLinks: [
              {
                label: "Download S1E1 1080p",
                url: "https://dl.vidsrc.me/download/tv/100088/1/1",
                quality: "1080p FHD",
                size: "1.2 GB",
                resolution: "1920x1080",
                format: "MP4"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "tmdb-tv-66732",
    tmdbId: "66732",
    title: "Stranger Things",
    type: "tv",
    year: 2022,
    rating: 8.6,
    quality: "4K UHD",
    duration: "4 Seasons",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    releaseDate: "2016-07-15",
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download Season 4 1080p Pack",
        url: "https://dl.vidsrc.me/download/tv/66732/s4-pack",
        quality: "1080p FHD",
        size: "11.5 GB",
        resolution: "1920x1080",
        format: "ZIP / MP4"
      }
    ],
    servers: [
      {
        id: "vidsrc-tv",
        name: "VidSrc TV",
        quality: "1080p FHD",
        badge: "Zero Buffer",
        embedUrl: "https://vidsrc.to/embed/tv/66732/1/1"
      }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        zipPackLinks: [],
        episodes: [
          {
            episodeNumber: 1,
            title: "Chapter One: The Vanishing of Will Byers",
            duration: "48m",
            thumbnail: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            overview: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
            embedUrl: "https://vidsrc.to/embed/tv/66732/1/1",
            downloadLinks: []
          }
        ]
      }
    ]
  },
  {
    id: "tmdb-tv-76479",
    tmdbId: "76479",
    title: "The Boys",
    type: "tv",
    year: 2024,
    rating: 8.4,
    quality: "4K UHD",
    duration: "4 Seasons",
    genres: ["Action", "Sci-Fi", "Comedy"],
    synopsis: "A fun and irreverent take on what happens when superheroes—who are as popular as celebrities, as influential as politicians, and as revered as gods—abuse their superpowers rather than use them for good.",
    poster: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nxxCPRgtzxUH8GR4F2zg4b1y95K.jpg",
    releaseDate: "2019-07-26",
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download Season 4 1080p Pack",
        url: "https://dl.vidsrc.me/download/tv/76479/s4-pack",
        quality: "1080p FHD",
        size: "8.2 GB",
        resolution: "1920x1080",
        format: "ZIP / MP4"
      }
    ],
    servers: [
      {
        id: "vidsrc-tv",
        name: "VidSrc TV",
        quality: "1080p FHD",
        badge: "Zero Buffer",
        embedUrl: "https://vidsrc.to/embed/tv/76479/1/1"
      }
    ]
  },
  {
    id: "tmdb-tv-93405",
    tmdbId: "93405",
    title: "Squid Game",
    type: "tv",
    year: 2024,
    rating: 8.3,
    quality: "4K UHD",
    duration: "2 Seasons",
    genres: ["Action", "Mystery", "Drama"],
    synopsis: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes: a survival game that has a whopping 45.6 billion won prize.",
    poster: "https://image.tmdb.org/t/p/w500/dDlG1m7lG9LpIskwU4h6Z4UoV1W.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/2meX1nMdScFOoV4370rqHWFDx0U.jpg",
    releaseDate: "2021-09-17",
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [],
    servers: [
      {
        id: "vidsrc-tv",
        name: "VidSrc TV",
        quality: "1080p FHD",
        badge: "Auto Next",
        embedUrl: "https://vidsrc.to/embed/tv/93405/1/1"
      }
    ]
  },
  {
    id: "tmdb-tv-1399",
    tmdbId: "1399",
    title: "Game of Thrones",
    type: "tv",
    year: 2019,
    rating: 9.2,
    quality: "4K UHD",
    duration: "8 Seasons",
    genres: ["Drama", "Fantasy", "Action"],
    synopsis: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    releaseDate: "2011-04-17",
    featured: false,
    trending: true,
    hasRealDownloads: true,
    downloadLinks: [
      {
        label: "Download Complete Series Pack (1080p)",
        url: "https://dl.vidsrc.me/download/tv/1399/full-pack",
        quality: "1080p FHD",
        size: "38 GB",
        resolution: "1920x1080",
        format: "ZIP / MP4"
      }
    ],
    servers: [
      {
        id: "vidsrc-tv",
        name: "VidSrc TV",
        quality: "1080p FHD",
        badge: "Auto Next",
        embedUrl: "https://vidsrc.to/embed/tv/1399/1/1"
      }
    ]
  }
];
