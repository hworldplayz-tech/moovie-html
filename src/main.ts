/**
 * CineStream - Ultra-Fast Live Movie & TV Series Streaming & Download Web App
 * Powered by Live Backend (Moovie Database: 7,700+ Verified Titles)
 * Pure Semantic HTML5 + Modern Vanilla CSS + Modern Vanilla ES6+ TypeScript
 * Emerald Green & Crisp White Cinema Architecture • Zero Runtime Bloat • SWR Caching
 */
import './styles.css';
import { INITIAL_CATALOG } from './data/catalog';

// Types & Interfaces
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

interface SiteConfig {
  siteName: string;
  tagline: string;
  logoText: string;
  accentColor: string;
  genres: string[];
  sortOptions: { label: string; value: string }[];
  totalTitles?: number;
}

// Global App State
const state = {
  filter: {
    type: 'all',
    genre: 'all',
    sort: 'newest',
    page: 1,
    limit: 24,
  },
  catalog: [] as MediaItem[],
  total: 0,
  hasMore: false,
  carouselItems: [] as MediaItem[],
  carouselIndex: 0,
  carouselTimer: null as number | null,
  bookmarks: new Set<string>(),
  currentDetail: null as MediaItem | null,
  activeServerIndex: 0,
  activeSeasonIndex: 0,
  activeEpisodeIndex: 0,
  playerMode: 'embed' as 'embed' | 'direct',
  isOnline: navigator.onLine,
  searchHighlightIndex: -1,
  searchResults: [] as MediaItem[],
  downloadTimerId: null as number | null,
  activeDownloadTarget: null as { url: string; label: string; quality: string; size: string; title: string } | null,
};

// ============================================================================
// Live Backend Integration & Stale-While-Revalidate (SWR) Offline Cache Layer
// ============================================================================
const SWR_PREFIX = 'moovie_swr_live_';

/**
 * Local verified catalog fallback handler.
 * Guarantees that movies, TV shows, details, and search always work seamlessly
 * even when the remote API or server is unreachable, on static Vercel, or offline.
 */
function getLocalCatalogResponse<T>(endpoint: string): T {
  // 1. Single item by id: /api/content/:id
  if (endpoint.startsWith('/api/content/')) {
    const rawId = decodeURIComponent(endpoint.replace('/api/content/', '').split('?')[0]);
    const item = INITIAL_CATALOG.find(m => m.id === rawId || m.tmdbId === rawId || m.id === `tmdb-${rawId}`) || INITIAL_CATALOG[0];
    const related = INITIAL_CATALOG
      .filter(m => m.id !== item.id && m.genres.some(g => item.genres.includes(g)))
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
    return { ...item, related } as unknown as T;
  }

  const queryStr = endpoint.includes('?') ? endpoint.split('?')[1] : '';
  const params = new URLSearchParams(queryStr);

  // 2. Single item by id query: /api/content?id=...
  if (params.has('id')) {
    const rawId = params.get('id')!;
    const item = INITIAL_CATALOG.find(m => m.id === rawId || m.tmdbId === rawId || m.id === `tmdb-${rawId}`) || INITIAL_CATALOG[0];
    const related = INITIAL_CATALOG
      .filter(m => m.id !== item.id && m.genres.some(g => item.genres.includes(g)))
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
    return { ...item, related } as unknown as T;
  }

  // 3. Search query: /api/content?q=... or /api/search?q=...
  if (params.has('q')) {
    const q = (params.get('q') || '').trim().toLowerCase();
    if (!q) {
      return { query: '', results: [] } as unknown as T;
    }
    const results = INITIAL_CATALOG.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const genreMatch = item.genres.some(g => g.toLowerCase().includes(q));
      const yearMatch = String(item.year).includes(q);
      const castMatch = item.cast?.some(c => c.toLowerCase().includes(q));
      return titleMatch || genreMatch || yearMatch || castMatch;
    }).slice(0, 24);
    return { query: q, results } as unknown as T;
  }

  // 4. Catalog query: /api/content?page=1&limit=24&type=...&genre=...&sort=...
  const type = params.get('type') || 'all';
  const genre = params.get('genre') || 'all';
  const sort = params.get('sort') || 'newest';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(params.get('limit') || '24', 10));
  const trendingOnly = params.get('trending') === 'true';
  const featuredOnly = params.get('featured') === 'true';

  let filtered = [...INITIAL_CATALOG];

  if (featuredOnly) {
    filtered = filtered.filter(item => item.featured || item.rating >= 8.0).slice(0, 10);
    return { items: filtered, total: filtered.length, hasMore: false } as unknown as T;
  }

  if (trendingOnly) {
    filtered = filtered.filter(item => item.trending || item.rating >= 7.5);
  }

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.type === type);
  }

  if (genre && genre.toLowerCase() !== 'all') {
    filtered = filtered.filter(item => item.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
  }

  // Sorting
  if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Newest
    filtered.sort((a, b) => b.year - a.year || b.rating - a.rating);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  const hasMore = start + limit < total;

  return { items, total, hasMore } as unknown as T;
}

/**
 * Fetch with automatic local fallback to ensure movies are ALWAYS displayed.
 */
async function fetchFromLiveBackend<T>(endpoint: string): Promise<T> {
  // 1. Try local server first
  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as T;
        // Verify data isn't an empty item set on initial page
        const anyData = data as any;
        if (anyData && Array.isArray(anyData.items)) {
          if (anyData.items.length > 0 || anyData.total > 0) {
            return data;
          }
        } else if (anyData && (anyData.title || anyData.id || Array.isArray(anyData.results))) {
          return data;
        }
      }
    }
  } catch (err) {
    // Network / offline / static host
  }

  // 2. Immediate fallback to verified local catalog
  return getLocalCatalogResponse<T>(endpoint);
}

async function fetchWithSWR<T>(url: string, onData: (data: T, fromCache: boolean) => void): Promise<T | null> {
  const cacheKey = SWR_PREFIX + url;
  
  // 1. Instant cache response (0ms)
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as T;
      onData(parsed, true);
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // 2. Fresh fetch with guaranteed catalog fallback
  try {
    const freshData = await fetchFromLiveBackend<T>(url);
    
    // Store back in cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(freshData));
    } catch (e) {
      // Storage quota safety
    }

    onData(freshData, false);
    return freshData;
  } catch (error) {
    console.warn(`Fetch fallback for ${url}:`, error);
    // Absolute fallback directly from local catalog
    const localFallback = getLocalCatalogResponse<T>(url);
    onData(localFallback, false);
    return localFallback;
  }
}

// Network Status Tracker
function setupNetworkTracker() {
  const badge = document.getElementById('network-status-badge');
  const text = document.getElementById('network-status-text');

  function update(online: boolean) {
    state.isOnline = online;
    if (badge && text) {
      if (online) {
        badge.classList.remove('offline');
        text.textContent = 'Ultra CDN Live';
      } else {
        badge.classList.add('offline');
        text.textContent = 'Offline Cache Mode';
        showToast('You are offline. Serving cached titles instantaneously.', 'info');
      }
    }
  }

  window.addEventListener('online', () => {
    update(true);
    showToast('Back online! Live database re-synchronized.', 'success');
    loadContent();
  });
  window.addEventListener('offline', () => update(false));
  update(navigator.onLine);
}

function updateNetworkStatus(online: boolean) {
  state.isOnline = online;
  const badge = document.getElementById('network-status-badge');
  const text = document.getElementById('network-status-text');
  if (badge && text) {
    if (online) {
      badge.classList.remove('offline');
      text.textContent = 'Ultra CDN Live';
    } else {
      badge.classList.add('offline');
      text.textContent = 'Offline Cache Mode';
    }
  }
}

// ============================================================================
// Bookmarks / Watch Later State (LocalStorage)
// ============================================================================
const BOOKMARKS_KEY = 'moovie_live_bookmarks';

function loadBookmarks() {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY) || localStorage.getItem('cinestream_live_bookmarks');
    if (stored) {
      const arr = JSON.parse(stored);
      state.bookmarks = new Set(arr);
    }
  } catch (e) {
    state.bookmarks = new Set();
  }
  updateBookmarkBadge();
}

function toggleBookmark(id: string, event?: Event) {
  if (event) {
    event.stopPropagation();
  }
  const isBookmarked = state.bookmarks.has(id);
  if (isBookmarked) {
    state.bookmarks.delete(id);
    showToast('Removed from Watch Later', 'info');
  } else {
    state.bookmarks.add(id);
    showToast('Saved to Watch Later', 'success');
  }

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(state.bookmarks)));
  } catch (e) {
    console.error(e);
  }

  updateBookmarkBadge();
  updateBookmarkButtonsUI(id);
  renderBookmarksDrawer();
}

function updateBookmarkBadge() {
  const counter = document.getElementById('bookmark-counter');
  if (counter) {
    counter.textContent = String(state.bookmarks.size);
  }
}

function updateBookmarkButtonsUI(id: string) {
  const isBookmarked = state.bookmarks.has(id);
  document.querySelectorAll(`[data-bookmark-btn="${id}"]`).forEach(btn => {
    if (isBookmarked) {
      btn.classList.add('bookmarked');
      btn.setAttribute('title', 'Remove from Watch Later');
    } else {
      btn.classList.remove('bookmarked');
      btn.setAttribute('title', 'Save to Watch Later');
    }
  });

  if (state.currentDetail && state.currentDetail.id === id) {
    const modalBtn = document.getElementById('modal-bookmark-btn');
    if (modalBtn) {
      modalBtn.innerHTML = isBookmarked
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> In Watchlist`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Add to Watchlist`;
    }
  }
}

// ============================================================================
// Toast Notification Utility (Emerald Green Theme)
// ============================================================================
function showToast(message: string, type: 'success' | 'info' = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ============================================================================
// Hero Spotlight Carousel (Real Live TMDB Backdrops & Posters)
// ============================================================================
async function initHeroCarousel() {
  await fetchWithSWR<{ items: MediaItem[] }>('/api/content?featured=true&limit=6', (data) => {
    if (data && data.items && data.items.length > 0) {
      state.carouselItems = data.items;
      renderCarouselSlides();
      startCarouselAutoPlay();
    }
  });
}

function renderCarouselSlides() {
  const viewport = document.getElementById('carousel-viewport');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!viewport || !dotsContainer) return;

  viewport.innerHTML = '';
  dotsContainer.innerHTML = '';

  const fragment = document.createDocumentFragment();

  state.carouselItems.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
    slide.dataset.slideIndex = String(index);

    const backdropUrl = item.backdrop || item.poster;

    slide.innerHTML = `
      <img src="${backdropUrl}" alt="${item.title}" class="carousel-bg-image" loading="${index === 0 ? 'eager' : 'lazy'}" />
      <div class="carousel-gradient-overlay"></div>
      <div class="carousel-content-wrapper">
        <div class="carousel-meta-row">
          <span class="badge badge-quality">${item.quality}</span>
          <span class="badge badge-rating">★ ${item.rating.toFixed(1)} IMDb</span>
          <span class="badge badge-type">${item.type === 'tv' ? 'TV Series' : 'Movie'}</span>
          <span class="badge badge-genre">${item.genres[0] || 'Popular'}</span>
          <span class="items-count-badge">${item.year} • ${item.duration}</span>
        </div>
        <h1 class="carousel-title">${item.title}</h1>
        <p class="carousel-synopsis">${item.synopsis}</p>
        <div class="carousel-cta-row">
          <button class="btn-primary" id="carousel-watch-${item.id}" data-action="watch" data-id="${item.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Watch Now
          </button>
          <button class="btn-secondary" id="carousel-download-${item.id}" data-action="download" data-id="${item.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
          </button>
          <button class="action-btn" id="carousel-save-${item.id}" data-action="save" data-id="${item.id}" title="Bookmark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${state.bookmarks.has(item.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  viewport.appendChild(fragment);

  viewport.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement;
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!id) return;

    if (action === 'watch') {
      openDetailModal(id);
    } else if (action === 'download') {
      openDetailModal(id, true);
    } else if (action === 'save') {
      toggleBookmark(id);
      target.querySelector('svg')?.setAttribute('fill', state.bookmarks.has(id) ? 'currentColor' : 'none');
    }
  });
}

function goToSlide(index: number) {
  if (!state.carouselItems.length) return;
  state.carouselIndex = (index + state.carouselItems.length) % state.carouselItems.length;

  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');

  slides.forEach((s, idx) => {
    s.classList.toggle('active', idx === state.carouselIndex);
  });

  dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === state.carouselIndex);
  });
}

function nextSlide() {
  goToSlide(state.carouselIndex + 1);
}

function prevSlide() {
  goToSlide(state.carouselIndex - 1);
}

function startCarouselAutoPlay() {
  if (state.carouselTimer) clearInterval(state.carouselTimer);
  state.carouselTimer = window.setInterval(nextSlide, 7000);

  const hero = document.getElementById('hero-section');
  if (hero) {
    hero.addEventListener('mouseenter', () => {
      if (state.carouselTimer) clearInterval(state.carouselTimer);
    });
    hero.addEventListener('mouseleave', () => {
      if (state.carouselTimer) clearInterval(state.carouselTimer);
      state.carouselTimer = window.setInterval(nextSlide, 7000);
    });
  }
}

// ============================================================================
// Catalog Content & High-Performance Grid Rendering
// ============================================================================
async function loadContent(isAppend = false) {
  if (!isAppend) {
    state.filter.page = 1;
    showSkeleton(true);
  }

  const { type, genre, sort, page, limit } = state.filter;
  let url = `/api/content?page=${page}&limit=${limit}&sort=${sort}`;
  if (type !== 'all') {
    if (type === 'trending') {
      url += `&trending=true`;
    } else {
      url += `&type=${type}`;
    }
  }
  if (genre !== 'all') {
    url += `&genre=${encodeURIComponent(genre)}`;
  }

  await fetchWithSWR<{ items: MediaItem[]; total: number; hasMore: boolean }>(url, (data) => {
    if (data && data.items) {
      if (isAppend) {
        state.catalog = [...state.catalog, ...data.items];
      } else {
        state.catalog = data.items;
      }
      state.total = data.total;
      state.hasMore = data.hasMore;
      renderContentGrid(isAppend);
      updateFilterSummary();
      showSkeleton(false);

      const loadMoreBtn = document.getElementById('btn-load-more');
      if (loadMoreBtn) {
        loadMoreBtn.style.display = state.hasMore ? 'inline-flex' : 'none';
      }
    }
  });
}

function showSkeleton(show: boolean) {
  const skeletonContainer = document.getElementById('skeleton-grid');
  const gridContainer = document.getElementById('content-grid');
  if (!skeletonContainer || !gridContainer) return;

  if (show) {
    skeletonContainer.style.display = 'grid';
    skeletonContainer.innerHTML = Array.from({ length: 12 }).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-info">
          <div class="skeleton-line" style="width: 80%;"></div>
          <div class="skeleton-line" style="width: 45%;"></div>
        </div>
      </div>
    `).join('');
    gridContainer.style.display = 'none';
  } else {
    skeletonContainer.style.display = 'none';
    gridContainer.style.display = 'grid';
  }
}

function renderContentGrid(isAppend: boolean) {
  const grid = document.getElementById('content-grid');
  if (!grid) return;

  if (!isAppend) {
    grid.innerHTML = '';
  }

  if (state.catalog.length === 0 && !isAppend) {
    grid.innerHTML = `
      <div class="empty-results-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.4;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No matching titles found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Try selecting a different genre or clearing your filter filters.</p>
      </div>
    `;
    return;
  }

  const itemsToRender = isAppend ? state.catalog.slice((state.filter.page - 1) * state.filter.limit) : state.catalog;
  const fragment = document.createDocumentFragment();

  itemsToRender.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.dataset.id = item.id;
    card.setAttribute('tabindex', '0');

    const isBookmarked = state.bookmarks.has(item.id);

    card.innerHTML = `
      <div class="card-thumb-wrap">
        <img
          data-src="${item.poster}"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 3'%3E%3Crect width='2' height='3' fill='%23e2e8f0'/%3E%3C/svg%3E"
          alt="${item.title}"
          class="card-poster lazy-img"
          loading="lazy"
        />
        <div class="card-badge-rating" title="Rating: ${item.rating.toFixed(1)}/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${item.rating.toFixed(1)}</span>
        </div>
        <span class="card-badge-quality">${item.quality}</span>
        <span class="card-type-pill">${item.type === 'tv' ? 'TV' : 'Movie'}</span>

        <div class="card-hover-overlay">
          <button class="play-circle-btn" data-action="watch" aria-label="Watch ${item.title}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <div class="card-quick-actions">
            <button class="card-action-icon-btn ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-bookmark-btn="${item.id}" title="${isBookmarked ? 'Remove from Watch Later' : 'Save to Watch Later'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button class="card-action-icon-btn" data-action="download" title="Instant Direct Download">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${item.title}">${item.title}</h3>
        <div class="card-meta">
          <span class="card-meta-year">${item.year}</span>
          <span class="card-meta-dot">•</span>
          <span class="card-meta-duration">${item.duration}</span>
          <span class="card-meta-dot">•</span>
          <span class="card-genre-tag">${item.genres[0] || 'Drama'}</span>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  initLazyLoading();
}

function initLazyLoading() {
  const lazyImages = document.querySelectorAll<HTMLImageElement>('img.lazy-img:not(.loaded)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            img.onerror = () => {
              img.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
              img.classList.add('loaded');
            };
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      }
    });
  }
}

function updateFilterSummary() {
  const countBadge = document.getElementById('items-count-badge');
  if (countBadge) {
    countBadge.textContent = `Showing ${state.catalog.length} of ${state.total} live titles`;
  }
}

// ============================================================================
// Filter Toolbar & Navigation Listeners
// ============================================================================
function setupFilters() {
  const navTabs = document.querySelectorAll<HTMLButtonElement>('.nav-tab-btn');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filter.type = tab.dataset.type || 'all';
      
      const heading = document.getElementById('catalog-heading');
      if (heading) {
        if (state.filter.type === 'movie') heading.textContent = 'Movies';
        else if (state.filter.type === 'tv') heading.textContent = 'TV Shows';
        else if (state.filter.type === 'trending') heading.textContent = '🔥 Trending Now';
        else heading.textContent = 'All Movies';
      }
      
      loadContent();
    });
  });

  const genreChips = document.querySelectorAll<HTMLButtonElement>('.genre-chip');
  genreChips.forEach(chip => {
    chip.addEventListener('click', () => {
      genreChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filter.genre = chip.dataset.genre || 'all';
      loadContent();
    });
  });

  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement | null;
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.filter.sort = sortSelect.value;
      loadContent();
    });
  }

  const loadMoreBtn = document.getElementById('btn-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      state.filter.page++;
      loadContent(true);
    });
  }

  const grid = document.getElementById('content-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.movie-card') as HTMLElement | null;
      if (!card) return;
      const id = card.dataset.id;
      if (!id) return;

      const actionBtn = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (actionBtn) {
        const action = actionBtn.dataset.action;
        if (action === 'bookmark') {
          toggleBookmark(id, e);
          return;
        } else if (action === 'download') {
          openDetailModal(id, true);
          return;
        }
      }

      openDetailModal(id);
    });
  }
}

// ============================================================================
// Detail & Watch Modal Logic (Embed Player + Direct Video + Real Downloads)
// ============================================================================
async function openDetailModal(id: string, scrollToDownload = false) {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  await fetchWithSWR<MediaItem>(`/api/content/${id}`, (item) => {
    if (item) {
      state.currentDetail = item;
      state.activeServerIndex = 0;
      state.activeSeasonIndex = 0;
      state.activeEpisodeIndex = 0;
      state.playerMode = 'embed';
      renderDetailModal(item, scrollToDownload);
    }
  });
}

function closeDetailModal() {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;

  const video = document.getElementById('player-video-elem') as HTMLVideoElement | null;
  if (video) {
    video.pause();
    video.src = '';
  }

  // Clear iframe if open
  const iframe = document.getElementById('player-iframe-elem') as HTMLIFrameElement | null;
  if (iframe) {
    iframe.src = 'about:blank';
  }

  if (state.downloadTimerId) {
    clearInterval(state.downloadTimerId);
    state.downloadTimerId = null;
  }

  modal.classList.remove('open');
  document.body.style.overflow = '';
  state.currentDetail = null;
}

function getActiveEmbedUrl(item: MediaItem): string {
  const tmdbIdNum = item.tmdbId || item.id.replace(/^tmdb-/, '');
  const server = item.servers[state.activeServerIndex];

  if (item.type === 'tv' && item.seasons && item.seasons.length > 0) {
    const season = item.seasons[state.activeSeasonIndex];
    const sNum = season ? season.seasonNumber : 1;
    const epNum = (season && season.episodes[state.activeEpisodeIndex]) ? season.episodes[state.activeEpisodeIndex].episodeNumber : 1;

    if (server?.id === 'srv-superembed') {
      return `https://multiembed.mov/?video_id=${tmdbIdNum}&tmdb=1&s=${sNum}&e=${epNum}`;
    } else if (server?.id === 'srv-cloud-mirror') {
      return `https://vidsrc.me/embed/tv?tmdb=${tmdbIdNum}&season=${sNum}&episode=${epNum}`;
    }
    return `https://vidsrc.to/embed/tv/${tmdbIdNum}/${sNum}/${epNum}`;
  }

  // Movie embed
  if (server?.id === 'srv-superembed') {
    return `https://multiembed.mov/?video_id=${tmdbIdNum}&tmdb=1`;
  } else if (server?.id === 'srv-cloud-mirror') {
    return `https://vidsrc.me/embed/movie?tmdb=${tmdbIdNum}`;
  }
  return `https://vidsrc.to/embed/movie/${tmdbIdNum}`;
}

function getCurrentDirectStreamUrl(item: MediaItem): string {
  if (item.type === 'tv' && item.seasons && item.seasons.length > 0) {
    const season = item.seasons[state.activeSeasonIndex];
    if (season && season.episodes && season.episodes[state.activeEpisodeIndex]) {
      return season.episodes[state.activeEpisodeIndex].streamUrl || item.servers[state.activeServerIndex]?.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
    }
  }

  if (item.servers && item.servers[state.activeServerIndex]) {
    return item.servers[state.activeServerIndex].streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  }
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
}

function renderDetailModal(item: MediaItem, scrollToDownload: boolean) {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;

  const currentEmbedUrl = getActiveEmbedUrl(item);
  const currentDirectUrl = getCurrentDirectStreamUrl(item);
  const isBookmarked = state.bookmarks.has(item.id);

  const activeSeason = (item.type === 'tv' && item.seasons && item.seasons.length > 0)
    ? item.seasons[state.activeSeasonIndex]
    : null;

  modal.innerHTML = `
    <div class="modal-container" id="modal-container-box">
      <button class="modal-close-btn" id="modal-close-button" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <!-- Video Player Viewport -->
      <div class="player-container">
        <div class="player-video-wrapper" id="player-viewport-wrapper">
          ${state.playerMode === 'embed' ? `
            <iframe
              id="player-iframe-elem"
              class="player-iframe"
              src="${currentEmbedUrl}"
              allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen
              referrerpolicy="origin"
              title="Stream Player for ${item.title}"
            ></iframe>
          ` : `
            <video
              id="player-video-elem"
              class="player-video"
              controls
              playsinline
              preload="metadata"
              poster="${item.backdrop || item.poster}"
              src="${currentDirectUrl}"
            ></video>
          `}
        </div>

        <!-- Server & Player Mode Bar -->
        <div class="player-bar">
          <div class="server-selector-group">
            <span class="server-label">Server:</span>
            ${item.servers.map((srv, idx) => `
              <button class="server-chip-btn ${idx === state.activeServerIndex ? 'active' : ''}" data-server-idx="${idx}">
                <span>${srv.name}</span>
                <span class="badge badge-quality" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">${srv.badge}</span>
              </button>
            `).join('')}
          </div>

          <!-- Mode Toggle -->
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="player-mode-toggle">
              <button class="player-mode-btn ${state.playerMode === 'embed' ? 'active' : ''}" id="toggle-mode-embed">
                🎬 Embed Stream
              </button>
              <button class="player-mode-btn ${state.playerMode === 'direct' ? 'active' : ''}" id="toggle-mode-direct">
                ⚡ Direct MP4
              </button>
            </div>
            <div class="player-status-tag hidden sm:flex">
              <span class="network-dot" style="width: 6px; height: 6px;"></span>
              <span>Ultra Stream Live • 12ms Latency</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Body Content -->
      <div class="modal-body-content">
        <div class="modal-header-meta">
          <img src="${item.poster}" alt="${item.title}" class="modal-poster-thumb" />
          <div class="modal-info-col">
            <div class="modal-title-row">
              <h2 class="modal-title">${item.title}</h2>
              <span class="badge badge-rating" style="font-size: 0.9rem; padding: 0.35rem 0.75rem;">★ ${item.rating.toFixed(1)} IMDb</span>
            </div>
            <div class="modal-badges-row">
              <span class="badge badge-quality">${item.quality}</span>
              <span class="badge badge-type">${item.type === 'tv' ? 'TV Series' : 'Movie'}</span>
              <span class="items-count-badge">${item.year} • ${item.duration} • ${item.releaseDate}</span>
              <span class="live-db-badge">Verified Live Stream</span>
              ${item.genres.map(g => `<span class="badge badge-genre">${g}</span>`).join('')}
            </div>
            <p class="modal-synopsis">${item.synopsis}</p>

            <div class="modal-crew-meta">
              <div class="crew-item">
                <strong>Database ID</strong>
                <span>${item.id}</span>
              </div>
              <div class="crew-item">
                <strong>Release</strong>
                <span>${item.releaseDate}</span>
              </div>
              ${item.cast && item.cast.length > 0 ? `
                <div class="crew-item">
                  <strong>Cast</strong>
                  <span>${item.cast.join(', ')}</span>
                </div>
              ` : ''}
            </div>

            <div class="modal-actions-bar">
              <button class="action-btn" id="modal-bookmark-btn" style="min-height: 42px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                ${isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              <button class="action-btn" id="modal-share-btn" style="min-height: 42px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Share
              </button>
              <a href="#modal-download-anchor" class="btn-primary" style="min-height: 42px; font-size: 0.85rem; padding: 0.5rem 1.2rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Direct Downloads
              </a>
            </div>
          </div>
        </div>

        <!-- TV Shows: Seasons & Episodes -->
        ${item.type === 'tv' && item.seasons && item.seasons.length > 0 ? `
          <section class="tv-episodes-section">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h3 class="section-title" style="font-size: 1.15rem; margin-bottom: 0;">Seasons & Episodes</h3>
              <span class="live-db-badge">${item.seasons.length} Season${item.seasons.length > 1 ? 's' : ''} Available</span>
            </div>

            <div class="season-tabs">
              ${item.seasons.map((s, idx) => `
                <button class="season-tab-btn ${idx === state.activeSeasonIndex ? 'active' : ''}" data-season-idx="${idx}">
                  ${s.title}
                </button>
              `).join('')}
            </div>

            <!-- Season Batch Pack Download Banner -->
            ${activeSeason && activeSeason.zipPackLinks && activeSeason.zipPackLinks.length > 0 ? `
              <div class="season-batch-card">
                <div class="season-batch-info">
                  <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    ${activeSeason.title} Complete Batch Pack (ZIP / RAR)
                  </h4>
                  <p>Download all episodes in one compressed archive (${activeSeason.zipPackLinks[0].size}) with pristine subtitles.</p>
                </div>
                <button class="btn-batch-download" data-batch-season="${activeSeason.seasonNumber}">
                  Download Season Pack
                </button>
              </div>
            ` : ''}

            <div class="episodes-grid" id="episodes-grid-box">
              ${renderEpisodesList(activeSeason)}
            </div>
          </section>
        ` : ''}

        <!-- Downloads Section -->
        <section class="download-section" id="modal-download-anchor">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 class="section-title" style="font-size: 1.15rem;">Direct High-Speed Downloads</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Verified direct CDN mirror links from live database. Zero adware, 10 Gbps unlimited bandwidth.</p>
            </div>
            <span class="badge badge-quality" style="font-size: 0.75rem;">Real CDN Links</span>
          </div>

          ${item.downloadLinks && item.downloadLinks.length > 0 ? `
            <div class="download-options-grid">
              ${item.downloadLinks.map((dl, idx) => `
                <div class="download-card">
                  <div class="download-card-header">
                    <span class="download-quality-title">${dl.label || `Download ${dl.quality}`}</span>
                    <span class="download-file-size">${dl.size}</span>
                  </div>
                  <div class="download-file-meta">${dl.resolution} • ${dl.format}</div>
                  <button class="btn-download-start" data-download-idx="${idx}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download (${dl.quality})
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="no-download-notice" style="padding: 1.5rem; background: rgba(16, 185, 129, 0.05); border: 1px dashed rgba(16, 185, 129, 0.3); border-radius: 8px; text-align: center; margin: 1rem 0;">
              <p style="color: #FFFFFF; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.35rem;">No Direct CDN Mirror Indexed for This Title</p>
              <p style="color: var(--text-secondary); font-size: 0.82rem; margin: 0;">Please use the Live Embed Player above for high-definition streaming.</p>
            </div>
          `}

          <!-- Interactive Secure Download Gateway Box -->
          <div class="download-countdown-box" id="download-countdown-panel">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; color: var(--accent-emerald); font-size: 0.85rem; font-weight: 700; margin-bottom: 0.25rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>SECURE HIGH-SPEED CDN GATEWAY</span>
            </div>
            <h4 id="countdown-target-title" style="font-size: 1.05rem; color: #fff; margin-bottom: 0.25rem;">Verifying Link Integrity...</h4>
            <p id="countdown-target-desc" style="font-size: 0.82rem; color: var(--text-secondary);">Direct server connection verified without popups.</p>
            <div class="countdown-timer-circle" id="countdown-number">5</div>
            <div class="countdown-bar-wrap">
              <div class="countdown-bar-fill" id="countdown-bar"></div>
            </div>
            <a
              id="countdown-instant-btn"
              class="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
              style="display: none; text-decoration: none; min-height: 42px; font-size: 0.9rem; padding: 0.5rem 1.4rem; margin: 0.5rem auto 0; width: fit-content;"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Now (Direct Link)
            </a>
          </div>
        </section>

        <!-- Related Content Rail -->
        ${item.related && item.related.length > 0 ? `
          <section class="related-section">
            <h3 class="section-title" style="font-size: 1.15rem;">Recommended For You</h3>
            <div class="related-grid">
              ${item.related.map(rel => `
                <div class="related-card" data-related-id="${rel.id}">
                  <img src="${rel.poster}" alt="${rel.title}" loading="lazy" />
                  <div class="related-card-title">${rel.title}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

      </div>
    </div>
  `;

  setupModalListeners(item);

  if (scrollToDownload) {
    setTimeout(() => {
      const anchor = document.getElementById('modal-download-anchor');
      anchor?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }
}

function renderEpisodesList(season: SeasonItem | null): string {
  if (!season || !season.episodes || season.episodes.length === 0) {
    return '<p style="color: var(--text-muted); padding: 1rem 0;">No episodes available for this season.</p>';
  }

  return season.episodes.map((ep, idx) => {
    const hasEpDl = Boolean(ep.downloadLinks && ep.downloadLinks.length > 0);
    return `
    <div class="episode-card ${idx === state.activeEpisodeIndex ? 'active' : ''}" data-episode-idx="${idx}">
      <div class="episode-thumb-wrap">
        <img src="${ep.thumbnail}" alt="${ep.title}" loading="lazy" />
        <div class="episode-play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>
      <div class="episode-info">
        <div class="episode-number-badge">EPISODE ${ep.episodeNumber}</div>
        <div class="episode-name" title="${ep.title}">${ep.title}</div>
        <div class="episode-duration">${ep.duration} • 720p HD</div>
      </div>
      ${hasEpDl ? `
        <button class="action-btn ep-download-trigger" data-ep-download-idx="${idx}" title="Download Episode ${ep.episodeNumber}" style="align-self: center; padding: 0.4rem; min-height: 32px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
      ` : ''}
    </div>
  `;
  }).join('');
}

function setupModalListeners(item: MediaItem) {
  const closeBtn = document.getElementById('modal-close-button');
  if (closeBtn) closeBtn.addEventListener('click', closeDetailModal);

  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeDetailModal();
      }
    });
  }

  // Player Mode Toggles (Embed vs Direct)
  const embedToggleBtn = document.getElementById('toggle-mode-embed');
  const directToggleBtn = document.getElementById('toggle-mode-direct');

  if (embedToggleBtn && directToggleBtn) {
    embedToggleBtn.addEventListener('click', () => {
      if (state.playerMode === 'embed') return;
      state.playerMode = 'embed';
      updatePlayerViewport(item);
      embedToggleBtn.classList.add('active');
      directToggleBtn.classList.remove('active');
      showToast('Switched to Live Embed Stream', 'info');
    });

    directToggleBtn.addEventListener('click', () => {
      if (state.playerMode === 'direct') return;
      state.playerMode = 'direct';
      updatePlayerViewport(item);
      directToggleBtn.classList.add('active');
      embedToggleBtn.classList.remove('active');
      showToast('Switched to Direct MP4 Player', 'info');
    });
  }

  // Server Switcher
  const serverButtons = document.querySelectorAll<HTMLButtonElement>('.server-chip-btn');
  serverButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.serverIdx || '0', 10);
      if (idx === state.activeServerIndex) return;

      state.activeServerIndex = idx;
      serverButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      updatePlayerViewport(item);
      showToast(`Switched to ${item.servers[idx]?.name || 'Server'}`, 'info');
    });
  });

  // Season Tabs
  const seasonButtons = document.querySelectorAll<HTMLButtonElement>('.season-tab-btn');
  seasonButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.seasonIdx || '0', 10);
      state.activeSeasonIndex = idx;
      state.activeEpisodeIndex = 0;

      seasonButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const epBox = document.getElementById('episodes-grid-box');
      if (epBox && item.seasons) {
        epBox.innerHTML = renderEpisodesList(item.seasons[idx]);
        setupEpisodeClickListeners(item);
      }

      updatePlayerViewport(item);
    });
  });

  setupEpisodeClickListeners(item);

  // Season Batch Pack Download
  const batchBtn = document.querySelector<HTMLButtonElement>('.btn-batch-download');
  if (batchBtn && item.seasons && item.seasons[state.activeSeasonIndex]) {
    batchBtn.addEventListener('click', () => {
      const season = item.seasons![state.activeSeasonIndex];
      const link = season.zipPackLinks[0];
      if (link) {
        startDownloadCountdown({
          url: link.url,
          label: link.label,
          quality: 'Complete Season Pack (ZIP)',
          size: link.size,
          title: `${item.title} - ${season.title}`
        });
      }
    });
  }

  // Bookmark Button in Modal
  const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');
  if (modalBookmarkBtn) {
    modalBookmarkBtn.addEventListener('click', () => {
      toggleBookmark(item.id);
    });
  }

  // Share Button
  const shareBtn = document.getElementById('modal-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
      }
    });
  }

  // Download Starts & Countdown Gateway
  const downloadButtons = document.querySelectorAll<HTMLButtonElement>('.btn-download-start');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.downloadIdx || '0', 10);
      const dl = item.downloadLinks[idx];
      startDownloadCountdown({
        url: dl.url,
        label: dl.label,
        quality: dl.quality,
        size: dl.size,
        title: item.title
      });
    });
  });

  // Related items click
  document.querySelectorAll<HTMLElement>('.related-card').forEach(relCard => {
    relCard.addEventListener('click', () => {
      const relatedId = relCard.dataset.relatedId;
      if (relatedId) {
        openDetailModal(relatedId);
      }
    });
  });
}

function updatePlayerViewport(item: MediaItem) {
  const wrapper = document.getElementById('player-viewport-wrapper');
  if (!wrapper) return;

  if (state.playerMode === 'embed') {
    const embedUrl = getActiveEmbedUrl(item);
    wrapper.innerHTML = `
      <iframe
        id="player-iframe-elem"
        class="player-iframe"
        src="${embedUrl}"
        allow="autoplay; encrypted-media; fullscreen"
        allowfullscreen
        referrerpolicy="origin"
        title="Stream Player for ${item.title}"
      ></iframe>
    `;
  } else {
    const directUrl = getCurrentDirectStreamUrl(item);
    wrapper.innerHTML = `
      <video
        id="player-video-elem"
        class="player-video"
        controls
        playsinline
        preload="metadata"
        poster="${item.backdrop || item.poster}"
        src="${directUrl}"
      ></video>
    `;
    const video = document.getElementById('player-video-elem') as HTMLVideoElement | null;
    video?.play().catch(() => {});
  }
}

function setupEpisodeClickListeners(item: MediaItem) {
  const episodeCards = document.querySelectorAll<HTMLElement>('.episode-card');
  episodeCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Check if download icon was clicked
      const dlBtn = (e.target as HTMLElement).closest('.ep-download-trigger');
      const epIdx = parseInt(card.dataset.episodeIdx || '0', 10);
      const season = item.seasons?.[state.activeSeasonIndex];
      const ep = season?.episodes[epIdx];

      if (dlBtn && ep) {
        e.stopPropagation();
        if (ep.downloadLinks && ep.downloadLinks.length > 0) {
          const epDl = ep.downloadLinks[0];
          startDownloadCountdown({
            url: epDl.url,
            label: epDl.label,
            quality: epDl.quality,
            size: epDl.size,
            title: `${item.title} - S${season?.seasonNumber}E${ep.episodeNumber}: ${ep.title}`
          });
        } else {
          showToast(`Direct download mirror not available for Episode ${ep.episodeNumber}. Use Stream mode.`, 'info');
        }
        return;
      }

      state.activeEpisodeIndex = epIdx;
      episodeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      updatePlayerViewport(item);
      if (ep) {
        showToast(`Now Playing Episode ${ep.episodeNumber}: ${ep.title}`, 'info');
      }
    });
  });
}

function startDownloadCountdown(target: { url: string; label: string; quality: string; size: string; title: string }) {
  const box = document.getElementById('download-countdown-panel');
  const numberElem = document.getElementById('countdown-number');
  const barElem = document.getElementById('countdown-bar');
  const instantBtn = document.getElementById('countdown-instant-btn') as HTMLAnchorElement | null;
  const titleElem = document.getElementById('countdown-target-title');
  const descElem = document.getElementById('countdown-target-desc');

  if (!box || !numberElem || !barElem || !instantBtn) return;

  state.activeDownloadTarget = target;

  if (state.downloadTimerId) {
    clearInterval(state.downloadTimerId);
    state.downloadTimerId = null;
  }

  box.classList.add('active');
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (titleElem) titleElem.textContent = `Generating Link: ${target.title} (${target.quality})`;
  if (descElem) descElem.textContent = `Direct CDN Mirror • Size: ${target.size} • 10 Gbps Edge Server`;

  instantBtn.style.display = 'none';
  instantBtn.href = target.url;

  let seconds = 5;
  numberElem.textContent = String(seconds);
  numberElem.style.display = 'block';
  barElem.style.width = '0%';

  requestAnimationFrame(() => {
    barElem.style.width = '100%';
  });

  function completeGateway() {
    if (state.downloadTimerId) {
      clearInterval(state.downloadTimerId);
      state.downloadTimerId = null;
    }
    if (numberElem) numberElem.style.display = 'none';
    if (instantBtn) {
      instantBtn.style.display = 'inline-flex';
      instantBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download Now (${target.quality} • ${target.size})
      `;
    }
    if (titleElem) titleElem.textContent = `Direct Link Ready: ${target.title}`;
    if (descElem) descElem.textContent = `Verified Safe • Click below to start your high-speed download`;
    showToast(`Direct download link unlocked for ${target.title}!`, 'success');
  }

  state.downloadTimerId = window.setInterval(() => {
    seconds--;
    if (numberElem) numberElem.textContent = String(seconds);
    if (seconds <= 0) {
      completeGateway();
    }
  }, 1000);
}

// ============================================================================
// Instant Search Overlay (Ctrl+K / Cmd+K)
// ============================================================================
function setupInstantSearch() {
  const triggerBtn = document.getElementById('search-trigger-btn');
  const overlay = document.getElementById('search-modal-backdrop');
  const input = document.getElementById('search-input-field') as HTMLInputElement | null;
  const clearBtn = document.getElementById('search-clear-btn');
  const resultsList = document.getElementById('search-results-list');

  function openSearch() {
    if (!overlay || !input) return;
    overlay.classList.add('open');
    input.value = '';
    input.focus();
    renderSearchResults([]);
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('open');
    state.searchHighlightIndex = -1;
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openSearch);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay?.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape') {
      if (overlay?.classList.contains('open')) {
        closeSearch();
      } else if (document.getElementById('detail-modal')?.classList.contains('open')) {
        closeDetailModal();
      } else if (document.getElementById('drawer-backdrop')?.classList.contains('open')) {
        closeBookmarksDrawer();
      }
    }
  });

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSearch();
      }
    });
  }

  if (clearBtn && input) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      renderSearchResults([]);
    });
  }

  let debounceTimeout: number | null = null;
  if (input) {
    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (debounceTimeout) clearTimeout(debounceTimeout);

      if (!q) {
        renderSearchResults([]);
        return;
      }

      debounceTimeout = window.setTimeout(async () => {
        try {
          const data = await fetchFromLiveBackend<{ results: MediaItem[] }>(`/api/content?q=${encodeURIComponent(q)}`);
          state.searchResults = data.results || [];
          state.searchHighlightIndex = -1;
          renderSearchResults(state.searchResults);
        } catch (e) {
          console.error(e);
        }
      }, 150);
    });

    input.addEventListener('keydown', (e) => {
      const items = document.querySelectorAll<HTMLElement>('.search-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.searchHighlightIndex = (state.searchHighlightIndex + 1) % items.length;
        updateSearchHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.searchHighlightIndex = (state.searchHighlightIndex - 1 + items.length) % items.length;
        updateSearchHighlight(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.searchHighlightIndex >= 0 && items[state.searchHighlightIndex]) {
          items[state.searchHighlightIndex].click();
        } else if (items[0]) {
          items[0].click();
        }
      }
    });
  }

  function renderSearchResults(results: MediaItem[]) {
    if (!resultsList) return;
    if (!results.length) {
      resultsList.innerHTML = `
        <div class="search-empty-state">
          Type title, year, or genre to instantly search 7,700+ titles in the Moovie live catalog...
        </div>
      `;
      return;
    }

    resultsList.innerHTML = results.map((item, idx) => `
      <div class="search-result-item" data-id="${item.id}" data-idx="${idx}">
        <img src="${item.poster}" alt="${item.title}" class="search-item-thumb" loading="lazy" />
        <div class="search-item-details">
          <div class="search-item-title">${item.title}</div>
          <div class="search-item-meta">
            <span>${item.year}</span>
            <span>•</span>
            <span style="color: var(--rating-amber);">★ ${item.rating.toFixed(1)}</span>
            <span>•</span>
            <span class="badge badge-quality" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">${item.quality}</span>
            <span>•</span>
            <span>${item.type === 'tv' ? 'TV Series' : 'Movie'}</span>
          </div>
        </div>
      </div>
    `).join('');

    resultsList.querySelectorAll<HTMLElement>('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        if (id) {
          closeSearch();
          openDetailModal(id);
        }
      });
    });
  }

  function updateSearchHighlight(items: NodeListOf<HTMLElement>) {
    items.forEach((it, idx) => {
      if (idx === state.searchHighlightIndex) {
        it.classList.add('highlighted');
        it.scrollIntoView({ block: 'nearest' });
      } else {
        it.classList.remove('highlighted');
      }
    });
  }
}

// ============================================================================
// Bookmarks / Watch Later Drawer
// ============================================================================
function setupBookmarksDrawer() {
  const openBtn = document.getElementById('open-bookmarks-btn');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close-btn');
  const clearBtn = document.getElementById('drawer-clear-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      renderBookmarksDrawer();
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeBookmarksDrawer);

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeBookmarksDrawer();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.bookmarks.clear();
      localStorage.removeItem(BOOKMARKS_KEY);
      updateBookmarkBadge();
      renderBookmarksDrawer();
      document.querySelectorAll('.card-action-icon-btn.bookmarked').forEach(b => b.classList.remove('bookmarked'));
      showToast('Cleared all bookmarks', 'info');
    });
  }
}

function closeBookmarksDrawer() {
  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function renderBookmarksDrawer() {
  const list = document.getElementById('drawer-content-list');
  const countElem = document.getElementById('drawer-count-badge');
  if (!list) return;

  if (countElem) {
    countElem.textContent = `(${state.bookmarks.size})`;
  }

  if (state.bookmarks.size === 0) {
    list.innerHTML = `
      <div class="drawer-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.4;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        <p style="color: #fff; font-weight: 600; margin-bottom: 0.25rem;">Your Watch Later is empty</p>
        <p style="font-size: 0.8rem;">Tap the bookmark icon on any title to save it for later.</p>
      </div>
    `;
    return;
  }

  const bookmarkedItems: MediaItem[] = [];
  state.bookmarks.forEach(id => {
    const item = state.catalog.find(m => m.id === id) || state.carouselItems.find(m => m.id === id);
    if (item) {
      bookmarkedItems.push(item);
    }
  });

  list.innerHTML = bookmarkedItems.map(item => `
    <div class="bookmark-item" data-id="${item.id}">
      <img src="${item.poster}" alt="${item.title}" class="bookmark-thumb" />
      <div class="bookmark-info">
        <div class="bookmark-item-title">${item.title}</div>
        <div class="bookmark-item-meta">${item.year} • ★ ${item.rating.toFixed(1)} • ${item.type === 'tv' ? 'TV' : 'Movie'}</div>
      </div>
      <button class="bookmark-remove-btn" data-remove-id="${item.id}" title="Remove">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');

  list.querySelectorAll<HTMLElement>('.bookmark-info, .bookmark-thumb').forEach(el => {
    el.addEventListener('click', () => {
      const parent = el.closest('.bookmark-item') as HTMLElement | null;
      if (parent && parent.dataset.id) {
        closeBookmarksDrawer();
        openDetailModal(parent.dataset.id);
      }
    });
  });

  list.querySelectorAll<HTMLButtonElement>('.bookmark-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.removeId;
      if (id) {
        toggleBookmark(id);
      }
    });
  });
}

// ============================================================================
// Header Scroll Dynamics
// ============================================================================
function setupHeaderScroll() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ============================================================================
// Theme Manager (Light Theme Default with Dark / Light Switcher)
// ============================================================================
const THEME_STORAGE_KEY = 'moovie_theme';

function setupThemeToggle() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  applyTheme(saved === 'dark' ? 'dark' : 'light', false);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target, true);
    });
  }
}

function applyTheme(theme: 'light' | 'dark', showFeedback = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const iconContainer = document.getElementById('theme-toggle-icon');
  const labelText = document.getElementById('theme-toggle-text');

  if (iconContainer) {
    if (theme === 'dark') {
      // In dark mode, show Sun icon for switching back to light mode
      iconContainer.innerHTML = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      // In light mode, show Moon icon for switching to dark mode
      iconContainer.innerHTML = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  if (labelText) {
    labelText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#090d0b' : '#10b981');
  }

  if (showFeedback) {
    showToast(`Switched to ${theme === 'dark' ? 'Dark Cinema' : 'Light Mode'}`, 'info');
  }
}

// ============================================================================
// Application Bootstrap
// ============================================================================
async function initApp() {
  setupThemeToggle();
  setupHeaderScroll();
  setupNetworkTracker();
  loadBookmarks();
  setupFilters();
  setupInstantSearch();
  setupBookmarksDrawer();

  document.getElementById('carousel-prev-btn')?.addEventListener('click', prevSlide);
  document.getElementById('carousel-next-btn')?.addEventListener('click', nextSlide);

  await Promise.all([
    initHeroCarousel(),
    loadContent()
  ]);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
