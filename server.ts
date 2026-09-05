import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface DownloadLink {
  label: string;
  url: string;
  quality: string;
  size: string;
  resolution: string;
  format: string;
}

interface EpisodeItem {
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  overview: string;
  embedUrl: string;
  streamUrl?: string;
  downloadLinks: DownloadLink[];
}

interface SeasonItem {
  seasonNumber: number;
  title: string;
  episodes: EpisodeItem[];
  zipPackLinks: DownloadLink[];
}

interface StreamServer {
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
  type: "movie" | "tv";
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
}

let LIVE_CATALOG: MediaItem[] = [];

// Helper to sanitize download URLs
function cleanDownloadUrl(url: string): string {
  if (!url) return "";
  return url.replace(/https?:\/\/(www\.)?mp4moviez\.land/g, "https://mp4moviez.trading");
}

// Helper to verify if a link is REAL (has specific id= parameter, NOT dead domain or ?title=)
function isRealLink(dl: any): boolean {
  if (!dl || !dl.url) return false;
  const url = String(dl.url);
  if (url.includes("dl.php?title=") && !url.includes("id=")) return false;
  return url.includes("id=");
}

// Helper to normalize raw live items from Moovie backend
function normalizeLiveItem(item: any, idx: number): MediaItem {
  const rawId = item.id || `tmdb-${idx}`;
  const tmdbIdNum = rawId.replace(/^tmdb-/, "");
  
  // Poster URL handling
  let poster = item.posterPath || item.poster || item.scrapedPoster || "";
  if (poster && !poster.startsWith("http")) {
    poster = `https://image.tmdb.org/t/p/w500${poster}`;
  }
  if (!poster) {
    poster = `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80`;
  }

  // Backdrop URL handling
  let backdrop = item.backdropPath || item.backdrop || "";
  if (backdrop && !backdrop.startsWith("http")) {
    backdrop = `https://image.tmdb.org/t/p/original${backdrop}`;
  }
  if (!backdrop || backdrop.includes("placeholder")) {
    backdrop = poster;
  }

  let year = 2024;
  if (item.releaseDate) {
    const parsedYear = parseInt(item.releaseDate.slice(0, 4), 10);
    if (!isNaN(parsedYear) && parsedYear > 1900) year = parsedYear;
  } else if (item.year) {
    year = Number(item.year) || 2024;
  }

  const isTv = item.type === "tv" || (item.seasons && item.seasons.length > 0) || (item.numberOfSeasons && item.numberOfSeasons > 0);
  const type: "movie" | "tv" = isTv ? "tv" : "movie";

  // Process REAL movie download links only (no fake fallbacks!)
  const dlLinks: DownloadLink[] = [];
  const seenDlKeys = new Set<string>();

  if (Array.isArray(item.downloadLinks)) {
    for (const dl of item.downloadLinks) {
      if (isRealLink(dl)) {
        const cleanedUrl = cleanDownloadUrl(dl.url);
        const rawLabel = dl.label || "Download";
        const cleanQuality = rawLabel.replace(/^Download\s*/i, "").trim() || dl.quality || "720p";
        const dedupeKey = `${cleanQuality}-${cleanedUrl}`;

        if (!seenDlKeys.has(dedupeKey)) {
          seenDlKeys.add(dedupeKey);
          let size = dl.size || "1.1 GB";
          if (!dl.size) {
            if (cleanQuality.includes("1080p")) size = "2.2 GB";
            else if (cleanQuality.includes("720p")) size = "1.1 GB";
            else if (cleanQuality.includes("480p")) size = "650 MB";
            else if (cleanQuality.includes("360p")) size = "420 MB";
            else if (cleanQuality.includes("240p")) size = "280 MB";
          }

          dlLinks.push({
            label: rawLabel,
            url: cleanedUrl,
            quality: cleanQuality,
            size,
            resolution: cleanQuality.includes("1080") ? "1920x1080" : cleanQuality.includes("720") ? "1280x720" : cleanQuality.includes("480") ? "854x480" : cleanQuality.includes("360") ? "640x360" : "426x240",
            format: dl.format || "MP4"
          });
        }
      }
    }
  }

  // Real servers for embed player
  const servers: StreamServer[] = [
    {
      id: "srv-vidsrc-pro",
      name: "VidSrc Pro Server",
      quality: "1080p FHD",
      badge: "Emerald Fast",
      embedUrl: type === "tv"
        ? `https://vidsrc.to/embed/tv/${tmdbIdNum}/1/1`
        : `https://vidsrc.to/embed/movie/${tmdbIdNum}`,
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    },
    {
      id: "srv-superembed",
      name: "SuperEmbed Ultra",
      quality: "4K UHD",
      badge: "4K VIP",
      embedUrl: type === "tv"
        ? `https://multiembed.mov/?video_id=${tmdbIdNum}&tmdb=1&s=1&e=1`
        : `https://multiembed.mov/?video_id=${tmdbIdNum}&tmdb=1`,
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    },
    {
      id: "srv-cloud-mirror",
      name: "Cloud Mirror CDN",
      quality: "1080p",
      badge: "Low Latency",
      embedUrl: type === "tv"
        ? `https://vidsrc.me/embed/tv?tmdb=${tmdbIdNum}&season=1&episode=1`
        : `https://vidsrc.me/embed/movie?tmdb=${tmdbIdNum}`,
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
  ];

  // TV Seasons & Episodes (REAL LINKS ONLY)
  const seasons: SeasonItem[] = [];
  if (Array.isArray(item.seasons)) {
    for (let sIdx = 0; sIdx < item.seasons.length; sIdx++) {
      const s = item.seasons[sIdx];
      const sNum = s.seasonNumber || (sIdx + 1);

      const episodes: EpisodeItem[] = [];
      if (Array.isArray(s.episodes)) {
        for (let eIdx = 0; eIdx < s.episodes.length; eIdx++) {
          const ep = s.episodes[eIdx];
          const epNum = ep.episodeNumber || (eIdx + 1);

          const epDl: DownloadLink[] = [];
          if (Array.isArray(ep.downloadLinks)) {
            for (const edl of ep.downloadLinks) {
              if (isRealLink(edl)) {
                const cleanedUrl = cleanDownloadUrl(edl.url);
                epDl.push({
                  label: edl.label || `Download Ep ${epNum}`,
                  url: cleanedUrl,
                  quality: edl.label?.replace(/^Download\s*/i, "").trim() || edl.quality || "720p HD",
                  size: edl.size || "450 MB",
                  resolution: "1280x720",
                  format: "MP4"
                });
              }
            }
          }

          episodes.push({
            episodeNumber: epNum,
            title: ep.episodeTitle || ep.title || `Episode ${epNum}`,
            duration: ep.duration || "45m",
            thumbnail: backdrop,
            overview: ep.overview || `Episode ${epNum} of ${s.seasonTitle || "Season " + sNum}.`,
            embedUrl: `https://vidsrc.to/embed/tv/${tmdbIdNum}/${sNum}/${epNum}`,
            streamUrl: ep.streamUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            downloadLinks: epDl
          });
        }
      }

      // Real Zip Pack Links ONLY
      const zipLinks: DownloadLink[] = [];
      const seenZip = new Set<string>();
      if (Array.isArray(s.zipPackLinks)) {
        for (const z of s.zipPackLinks) {
          if (isRealLink(z)) {
            const cleanedUrl = cleanDownloadUrl(z.url);
            if (!seenZip.has(cleanedUrl)) {
              seenZip.add(cleanedUrl);
              zipLinks.push({
                label: z.label || `Season ${sNum} Complete Batch Pack`,
                url: cleanedUrl,
                quality: "Full Season Pack",
                size: z.size || "6.5 GB",
                resolution: "1080p FHD",
                format: "ZIP / RAR"
              });
            }
          }
        }
      }

      seasons.push({
        seasonNumber: sNum,
        title: s.seasonTitle || s.title || `Season ${sNum}`,
        episodes,
        zipPackLinks: zipLinks
      });
    }
  }

  const ratingVal = typeof item.rating === "number" && !isNaN(item.rating) ? Number(item.rating.toFixed(1)) : 7.6;
  const rawQuality = Array.isArray(item.quality) ? item.quality[item.quality.length - 1] : "1080p FHD";

  return {
    id: rawId,
    tmdbId: tmdbIdNum,
    title: item.title || "Untitled Title",
    type,
    year,
    rating: ratingVal,
    quality: rawQuality?.includes("4K") ? "4K UHD" : "1080p FHD",
    duration: type === "tv" ? (seasons.length > 0 ? `${seasons.length} Season${seasons.length > 1 ? "s" : ""}` : "TV Series") : "2h 15m",
    genres: Array.isArray(item.genres) && item.genres.length > 0 ? item.genres : ["Drama", "Action"],
    synopsis: item.synopsis || item.description || "Stream and download in pristine high definition with zero buffering and direct CDN mirrors.",
    poster,
    backdrop,
    releaseDate: item.releaseDate || `${year}-01-01`,
    downloadLinks: dlLinks,
    hasRealDownloads: dlLinks.length > 0,
    servers,
    seasons,
    featured: idx < 8,
    trending: ratingVal >= 7.6 || idx < 40
  };
}

// Load initial live database
function loadInitialDatabase() {
  const localDbPath = path.join(process.cwd(), "server", "live-db.json");
  if (fs.existsSync(localDbPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(localDbPath, "utf-8"));
      LIVE_CATALOG = data;
      console.log(`Loaded ${LIVE_CATALOG.length} live titles from local disk cache.`);
      return;
    } catch (e) {
      console.warn("Failed reading local live-db.json:", e);
    }
  }
}

// Live background sync with https://moovie.linksshare.online
async function syncFromLiveBackend(): Promise<number> {
  try {
    console.log("Syncing with live backend: https://moovie.linksshare.online/ ...");
    const res = await fetch("https://moovie.linksshare.online/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml"
      }
    });
    if (!res.ok) throw new Error(`Moovie backend returned status ${res.status}`);

    const html = await res.text();
    const chunks: string[] = [];
    const scriptRegex = /<script>self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)<\/script>/g;
    let m: RegExpExecArray | null;
    while ((m = scriptRegex.exec(html)) !== null) {
      try {
        chunks.push(JSON.parse("\"" + m[1] + "\""));
      } catch (e) {
        chunks.push(m[1].replace(/\\"/g, "\"").replace(/\\\\/g, "\\"));
      }
    }
    const stream = chunks.join("");
    const marker = "\"initialContent\":";
    const startIdx = stream.indexOf(marker);
    if (startIdx === -1) {
      console.warn("initialContent marker not found in Moovie stream.");
      return LIVE_CATALOG.length;
    }

    const arrStart = startIdx + marker.length;
    let depth = 0, inStr = false, endIdx = -1;
    for (let i = arrStart; i < stream.length; i++) {
      const c = stream[i];
      if (c === "\"" && stream[i - 1] !== "\\") inStr = !inStr;
      else if (!inStr) {
        if (c === "[") depth++;
        else if (c === "]") {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }

    if (endIdx === -1) {
      console.warn("Could not find closing bracket for initialContent.");
      return LIVE_CATALOG.length;
    }

    const rawItems = JSON.parse(stream.slice(arrStart, endIdx + 1));
    LIVE_CATALOG = rawItems.map(normalizeLiveItem);

    // Persist to disk
    const outDir = path.join(process.cwd(), "server");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "live-db.json"), JSON.stringify(LIVE_CATALOG, null, 2));

    console.log(`Live sync complete! Loaded ${LIVE_CATALOG.length} verified titles from Moovie backend.`);
    return LIVE_CATALOG.length;
  } catch (err) {
    console.error("Live sync failed (using cached database):", err);
    return LIVE_CATALOG.length;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  loadInitialDatabase();

  app.use(express.json());

  // Enable CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // GET /api/site-config - Emerald Green & Crisp White theme metadata
  app.get("/api/site-config", (req, res) => {
    // Extract real genres dynamically from live database
    const genreSet = new Set<string>();
    genreSet.add("All");
    LIVE_CATALOG.forEach(item => {
      item.genres?.forEach(g => {
        if (g && g.trim()) genreSet.add(g.trim());
      });
    });

    const standardGenres = [
      "All",
      "Action",
      "Sci-Fi",
      "Drama",
      "Comedy",
      "Adventure",
      "Thriller",
      "Animation",
      "Fantasy",
      "Crime",
      "Horror",
      "Mystery"
    ];

    res.json({
      siteName: "CineStream",
      tagline: "Live 4K Movies & TV Series Stream & Download Hub",
      logoText: "CINESTREAM",
      accentColor: "#10B981", // Emerald Green
      accentHover: "#059669",
      theme: {
        primary: "#10B981",
        background: "#090d0b",
        surface: "#141f1a",
        textPrimary: "#FFFFFF",
        textSecondary: "#9CA3AF"
      },
      genres: standardGenres,
      sortOptions: [
        { label: "Newest Releases", value: "newest" },
        { label: "Top Rated (IMDb)", value: "rating" },
        { label: "Title (A - Z)", value: "title" }
      ],
      streamServers: [
        { id: "srv-vidsrc-pro", name: "VidSrc Pro (Ad-Free)", badge: "Emerald Fast" },
        { id: "srv-superembed", name: "SuperEmbed 4K", badge: "4K VIP" },
        { id: "srv-cloud-mirror", name: "Cloud CDN Mirror", badge: "Low Latency" }
      ],
      totalTitles: LIVE_CATALOG.length
    });
  });

  // GET /api/sync - trigger manual sync with live backend
  app.get("/api/sync", async (req, res) => {
    const total = await syncFromLiveBackend();
    res.json({ status: "success", syncedCount: total });
  });

  // GET /api/content?type=movie|tv&page=1&limit=24&sort=newest&genre=all
  // Also supports /api/content?id={id} and /api/content?q={query}
  app.get("/api/content", (req, res) => {
    // Single item by id query parameter
    if (req.query.id) {
      const qId = String(req.query.id);
      const item = LIVE_CATALOG.find(m => m.id === qId || m.tmdbId === qId || m.id === `tmdb-${qId}`);
      if (!item) {
        return res.status(404).json({ error: "Title not found in CineStream live database" });
      }
      const related = LIVE_CATALOG.filter(
        m => m.id !== item.id && m.genres.some(g => item.genres.includes(g))
      )
        .slice(0, 8)
        .map(m => ({
          id: m.id,
          title: m.title,
          type: m.type,
          year: m.year,
          rating: m.rating,
          quality: m.quality,
          poster: m.poster,
          duration: m.duration,
          genres: m.genres
        }));

      return res.json({
        ...item,
        related
      });
    }

    // Instant search by query parameter
    if (req.query.q !== undefined) {
      const q = ((req.query.q as string) || "").trim().toLowerCase();
      if (!q) {
        return res.json({ query: "", results: [] });
      }
      const results = LIVE_CATALOG.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const genreMatch = item.genres.some(g => g.toLowerCase().includes(q));
        const yearMatch = String(item.year).includes(q);
        return titleMatch || genreMatch || yearMatch;
      }).slice(0, 24);

      return res.json({ query: q, results });
    }

    const type = (req.query.type as string) || "all";
    const genre = (req.query.genre as string) || "all";
    const sort = (req.query.sort as string) || "newest";
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 24);
    const trendingOnly = req.query.trending === "true";
    const featuredOnly = req.query.featured === "true";

    let filtered = [...LIVE_CATALOG];

    if (featuredOnly) {
      filtered = filtered.filter(item => item.featured || item.rating >= 8.0).slice(0, 10);
    } else if (trendingOnly) {
      filtered = filtered.filter(item => item.trending || item.rating >= 7.5);
    }

    if (!featuredOnly) {
      if (type && type !== "all") {
        filtered = filtered.filter(item => item.type === type);
      }

      if (genre && genre.toLowerCase() !== "all") {
        filtered = filtered.filter(item =>
          item.genres.some(g => g.toLowerCase() === genre.toLowerCase())
        );
      }

      if (sort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sort === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        // newest
        filtered.sort((a, b) => b.year - a.year || b.rating - a.rating);
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    res.json({
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages
    });
  });

  // GET /api/content/:id
  app.get("/api/content/:id", (req, res) => {
    const { id } = req.params;
    const item = LIVE_CATALOG.find(m => m.id === id || m.tmdbId === id);
    if (!item) {
      return res.status(404).json({ error: "Title not found in CineStream live database" });
    }

    // Find related items by matching genres
    const related = LIVE_CATALOG.filter(
      m => m.id !== item.id && m.genres.some(g => item.genres.includes(g))
    )
      .slice(0, 8)
      .map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        year: m.year,
        rating: m.rating,
        quality: m.quality,
        poster: m.poster,
        duration: m.duration,
        genres: m.genres
      }));

    res.json({
      ...item,
      related
    });
  });

  // GET /api/search?q={query}
  app.get("/api/search", (req, res) => {
    const q = ((req.query.q as string) || "").trim().toLowerCase();
    if (!q) {
      return res.json({ query: "", results: [] });
    }

    const results = LIVE_CATALOG.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchGenre = item.genres.some(g => g.toLowerCase().includes(q));
      const matchYear = String(item.year).includes(q);
      const matchId = item.id.toLowerCase().includes(q) || item.tmdbId.includes(q);
      return matchTitle || matchGenre || matchYear || matchId;
    })
      .slice(0, 15)
      .map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        year: item.year,
        rating: item.rating,
        quality: item.quality,
        poster: item.poster,
        duration: item.duration,
        genres: item.genres
      }));

    res.json({
      query: q,
      results
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CineStream Live Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
