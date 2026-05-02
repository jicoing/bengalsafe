// =============================================
// BengalSafe — app.js
// Real-time election safety tracker engine
// =============================================

// ---- Bengal Hotspot Database ----
const BENGAL_HOTSPOTS = [
  { id: 'jadavpur', name: 'Jadavpur', district: 'Kolkata', lat: 22.4986, lng: 88.3686, risk: 'critical', radius: 1500, issues: 'Student clashes, political rallies near Jadavpur University, 8B bus route disruptions', alerts: 0 },
  { id: 'esplanade', name: 'Esplanade / Dharmatala', district: 'Kolkata', lat: 22.5626, lng: 88.3520, risk: 'critical', radius: 1200, issues: 'Major party offices, celebration/protest convergence point, crowd surges', alerts: 0 },
  { id: 'nandigram', name: 'Nandigram', district: 'Purba Medinipur', lat: 22.0264, lng: 88.2216, risk: 'critical', radius: 3000, issues: 'Historical political violence, TMC-BJP tensions, road blockades', alerts: 0 },
  { id: 'rampurhat', name: 'Rampurhat', district: 'Birbhum', lat: 24.1731, lng: 87.7836, risk: 'critical', radius: 2500, issues: 'Recent communal violence, arson history, weak police presence', alerts: 0 },
  { id: 'coochbehar', name: 'Cooch Behar', district: 'Cooch Behar', lat: 26.3246, lng: 89.4482, risk: 'critical', radius: 2000, issues: 'Border tensions, CISF firing history, NRC protests', alerts: 0 },
  { id: 'barrackpore', name: 'Barrackpore', district: 'North 24 Parganas', lat: 22.7584, lng: 88.3704, risk: 'high', radius: 2000, issues: 'Political stronghold clashes, lathi charge incidents', alerts: 0 },
  { id: 'howrah', name: 'Howrah Station Area', district: 'Howrah', lat: 22.5848, lng: 88.3420, risk: 'high', radius: 1500, issues: 'Transit bottleneck, crowd density, bridge closures possible', alerts: 0 },
  { id: 'sealdah', name: 'Sealdah Area', district: 'Kolkata', lat: 22.5676, lng: 88.3728, risk: 'high', radius: 1200, issues: 'Major station, crowd overflow, political processions', alerts: 0 },
  { id: 'berhampore', name: 'Berhampore', district: 'Murshidabad', lat: 24.1009, lng: 88.2519, risk: 'high', radius: 2000, issues: 'Communal sensitivity, inter-party clashes', alerts: 0 },
  { id: 'diamondharbour', name: 'Diamond Harbour', district: 'South 24 Parganas', lat: 22.1912, lng: 88.1873, risk: 'moderate', radius: 1800, issues: 'Political rallies, fishing community tensions', alerts: 0 },
  { id: 'singur', name: 'Singur', district: 'Hooghly', lat: 22.8079, lng: 88.2347, risk: 'high', radius: 2000, issues: 'Land movement legacy, anti-establishment protests', alerts: 0 },
  { id: 'siliguri', name: 'Siliguri', district: 'Darjeeling', lat: 26.7271, lng: 88.3953, risk: 'moderate', radius: 2000, issues: 'Hill area tensions, GTA political movements', alerts: 0 },
  { id: 'kolkata-central', name: 'College Street / Central Kolkata', district: 'Kolkata', lat: 22.5773, lng: 88.3637, risk: 'moderate', radius: 1000, issues: 'Protest marches, student unions, road blocks', alerts: 0 },
  { id: 'saltlake', name: 'Salt Lake / Sector V', district: 'Kolkata', lat: 22.5744, lng: 88.4340, risk: 'low', radius: 2000, issues: 'IT hub — generally calm, police presence', alerts: 0 },
  { id: 'newtown', name: 'New Town / Rajarhat', district: 'Kolkata', lat: 22.5924, lng: 88.4847, risk: 'low', radius: 2500, issues: 'New development area, low political activity', alerts: 0 },
  { id: 'basirhat', name: 'Basirhat', district: 'North 24 Parganas', lat: 22.6537, lng: 88.8666, risk: 'high', radius: 2000, issues: 'Communal tensions, border proximity, past riots', alerts: 0 },
  { id: 'sandeshkhali', name: 'Sandeshkhali', district: 'North 24 Parganas', lat: 22.4611, lng: 88.8750, risk: 'critical', radius: 2500, issues: 'Recent land grab protests, political violence, media attention', alerts: 0 },
  { id: 'durgapur', name: 'Durgapur', district: 'Paschim Bardhaman', lat: 23.5204, lng: 87.3119, risk: 'moderate', radius: 1800, issues: 'Industrial area tensions, union politics', alerts: 0 },
  { id: 'asansol', name: 'Asansol', district: 'Paschim Bardhaman', lat: 23.6889, lng: 86.9661, risk: 'high', radius: 2000, issues: 'Communal clashes history, coal belt tensions', alerts: 0 },
  { id: 'midnapore', name: 'Midnapore Town', district: 'Paschim Medinipur', lat: 22.4263, lng: 87.3193, risk: 'moderate', radius: 1500, issues: 'Maoist presence in outskirts, political rivalries', alerts: 0 },
];



const SOURCE_META = {
  reddit: { label: 'Reddit', icon: '🔴', class: 'source-reddit', sub: 'r/kolkata' },
  twitter: { label: 'X/Twitter', icon: '🐦', class: 'source-twitter', sub: '#BengalElections' },
  traffic: { label: 'Traffic', icon: '🚗', class: 'source-traffic', sub: 'Live Feed' },
  police: { label: 'Police', icon: '🚨', class: 'source-police', sub: 'Official' },
  news: { label: 'News', icon: '📰', class: 'source-news', sub: 'Media' },
};

// ---- Risk Colors ----
const RISK_COLORS = {
  critical: { fill: '#ff2255', stroke: '#ff2255', opacity: 0.2, weight: 2 },
  high:     { fill: '#ff6633', stroke: '#ff6633', opacity: 0.18, weight: 1.5 },
  moderate: { fill: '#ffbb33', stroke: '#ffbb33', opacity: 0.15, weight: 1 },
  low:      { fill: '#33dd88', stroke: '#33dd88', opacity: 0.12, weight: 1 },
};

// ---- CORS Proxy for non-CORS APIs ----
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// ---- Severity Keywords ----
const SEVERITY_KEYWORDS = {
  critical: ['violence','violent','clash','clashes','firing','teargas','tear gas','arson','bomb','curfew','section 144','killed','death','deaths','murder','stabbing','riot','riots','attack','attacked','lynching'],
  high: ['protest','rally','blockade','lathi','EVM tampering','stone pelting','vandalism','arrest','arrested','detained','mob','road block','shut down','shutdown','bandh','agitation','unrest'],
  moderate: ['police','security','deployment','traffic','crowd','tension','tensions','force','forces','paramilitary','CISF','RAF','section 144','procession','march'],
  low: ['calm','peaceful','normal','clear','stable','safe','no incident','situation under control']
};

// ---- Real Data Fetching ----
const seenUrls = new Set();

async function fetchGDELTNews(lightweight = false) {
  try {
    const queries = [
      'bengal election violence',
      'kolkata clash protest',
      'west bengal election tension',
      'bengal election safety'
    ];
    const q = queries[Math.floor(Math.random() * queries.length)];
    const maxRecords = lightweight ? 10 : 20;
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=artlist&format=json&maxrecords=${maxRecords}&sort=datedesc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GDELT ${res.status}`);
    const data = await res.json();
    return (data.articles || []).map(a => ({
      title: a.title || '',
      url: a.url || '',
      date: a.seendate ? new Date(a.seendate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')) : new Date(),
      domain: a.domain || '',
      srcType: 'news',
    }));
  } catch (e) {
    console.warn('GDELT fetch failed:', e.message);
    return [];
  }
}

async function fetchGoogleNews(lightweight = false) {
  try {
    const rssUrl = 'https://news.google.com/rss/search?q=bengal+election+2026+violence+OR+clash+OR+protest&hl=en-IN&gl=IN&ceid=IN:en';
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl));
    if (!res.ok) throw new Error(`GNews RSS2JSON ${res.status}`);
    const data = await res.json();
    
    const limit = lightweight ? 8 : 15;
    return (data.items || []).slice(0, limit).map(item => ({
      title: item.title || '',
      url: item.link || '',
      date: item.pubDate ? new Date(item.pubDate) : new Date(),
      domain: item.source || 'News',
      srcType: 'news'
    }));
  } catch (e) {
    console.warn('Google News fetch failed:', e.message);
    return [];
  }
}

async function fetchTwitterPosts(lightweight = false) {
  try {
    // Use Google News RSS restricted to twitter.com as a reliable client-side workaround
    const query = lightweight ? 'site:twitter.com bengal election' : 'site:twitter.com bengal election OR kolkata clash';
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl));
    if (!res.ok) throw new Error(`Twitter RSS2JSON ${res.status}`);
    const data = await res.json();
    
    return (data.items || []).map(item => ({
      title: item.title || '',
      url: item.link || '',
      date: item.pubDate ? new Date(item.pubDate) : new Date(),
      domain: 'twitter.com',
      srcType: 'twitter'
    }));
  } catch (e) {
    console.warn('Twitter fetch failed:', e.message);
    return [];
  }
}

async function fetchTrafficAlerts(lightweight = false) {
  try {
    const query = lightweight ? 'Kolkata traffic OR jam' : 'Kolkata (traffic OR jam OR accident OR blocked OR road closure)';
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl));
    if (!res.ok) throw new Error(`Traffic RSS2JSON ${res.status}`);
    const data = await res.json();
    
    return (data.items || []).map(item => ({
      title: item.title || '',
      url: item.link || '',
      date: item.pubDate ? new Date(item.pubDate) : new Date(),
      domain: item.source || 'Traffic',
      srcType: 'traffic'
    }));
  } catch (e) {
    console.warn('Traffic fetch failed:', e.message);
    return [];
  }
}

function fetchRedditJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'redditCallback_' + Math.round(1000000 * Math.random());
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };
    
    const script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'jsonp=' + callbackName;
    script.onerror = () => {
      delete window[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      reject(new Error('JSONP failed'));
    };
    document.body.appendChild(script);
  });
}

async function fetchRedditPosts(lightweight = false) {
  const subs = lightweight 
    ? ['kolkata', 'india']
    : ['kolkata', 'india', 'IndiaSpeaks', 'WestBengal', 'IndiaPolitics', 'kolkataTraffic'];
  const limit = lightweight ? 5 : 10;
  const results = [];

  for (const sub of subs) {
    try {
      const redditUrl = `https://www.reddit.com/r/${sub}/search.json?q=bengal+election+OR+west+bengal+OR+kolkata&sort=new&limit=${limit}&restrict_sr=on`;
      const data = await fetchRedditJsonp(redditUrl);
      const posts = (data?.data?.children || []).map(c => ({
        title: c.data.title || '',
        url: `https://reddit.com${c.data.permalink}`,
        date: new Date((c.data.created_utc || 0) * 1000),
        domain: `r/${sub}`,
        srcType: 'reddit',
      }));
      results.push(...posts);
    } catch (e) {
      console.warn(`Reddit fetch failed for r/${sub}:`, e.message);
    }
  }

  return results;
}

function classifySeverity(title) {
  const lower = title.toLowerCase();
  for (const [level, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return level;
    }
  }
  return 'moderate';
}

function matchLocation(title) {
  const lower = title.toLowerCase();
  for (const spot of BENGAL_HOTSPOTS) {
    if (lower.includes(spot.name.toLowerCase())) return spot;
    if (spot.district && lower.includes(spot.district.toLowerCase())) return spot;
  }
  // Check for common aliases
  if (lower.includes('kolkata') || lower.includes('calcutta')) return BENGAL_HOTSPOTS.find(s => s.id === 'esplanade') || BENGAL_HOTSPOTS[0];
  if (lower.includes('bengal')) {
    // Assign to a random hotspot weighted by risk
    const riskWeights = BENGAL_HOTSPOTS.map(s => s.risk === 'critical' ? 4 : s.risk === 'high' ? 3 : s.risk === 'moderate' ? 2 : 1);
    return BENGAL_HOTSPOTS[weightedRandomIndex(riskWeights)];
  }
  return BENGAL_HOTSPOTS[Math.floor(Math.random() * BENGAL_HOTSPOTS.length)];
}

function mapSourceType(article) {
  if (article.srcType === 'reddit') return 'reddit';
  const d = (article.domain || '').toLowerCase();
  if (d.includes('twitter') || d.includes('x.com')) return 'twitter';
  if (d.includes('police') || d.includes('gov')) return 'police';
  if (d.includes('traffic') || d.includes('maps')) return 'traffic';
  return 'news';
}

function articleToAlert(article) {
  const spot = matchLocation(article.title);
  const severity = classifySeverity(article.title);
  const source = mapSourceType(article);
  const now = Date.now();
  const articleTime = article.date instanceof Date ? article.date.getTime() : now;
  const minsAgo = Math.max(1, Math.round((now - articleTime) / 60000));
  spot.alerts++;

  const offsetLat = spot.lat + (Math.random() - 0.5) * 0.02;
  const offsetLng = spot.lng + (Math.random() - 0.5) * 0.02;

  return {
    id: ++alertIdCounter,
    source,
    title: article.title,
    severity,
    location: spot.name,
    district: spot.district,
    lat: offsetLat,
    lng: offsetLng,
    timestamp: articleTime,
    timeAgo: minsAgo < 60 ? `${minsAgo}m ago` : minsAgo < 1440 ? `${Math.floor(minsAgo/60)}h ago` : `${Math.floor(minsAgo/1440)}d ago`,
    articleUrl: article.url || null,
  };
}

let isFirstLoad = true;

let fetchAttempts = 0;
const MAX_RETRIES = 3;

async function fetchWithRetry(fetchFn, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fetchFn();
      if (result && result.length > 0) return result;
    } catch (e) {
      console.warn(`Fetch attempt ${i + 1} failed:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000 * (i + 1)));
  }
  return [];
}


async function fetchAndProcessAlerts(lightweight = false) {
  if (isFirstLoad && lightweight) {
    const feed = document.getElementById('alert-feed');
    feed.innerHTML = '<div class="loading-message">Fetching latest alerts...</div>';
  }

  const [gdelt, gnews, reddit, twitter, traffic] = await Promise.allSettled([
    fetchWithRetry(() => fetchGDELTNews(lightweight)),
    fetchWithRetry(() => fetchGoogleNews(lightweight)),
    fetchWithRetry(() => fetchRedditPosts(lightweight)),
    fetchWithRetry(() => fetchTwitterPosts(lightweight)),
    fetchWithRetry(() => fetchTrafficAlerts(lightweight))
  ]);

  const allArticles = [
    ...(gdelt.status === 'fulfilled' ? gdelt.value : []),
    ...(gnews.status === 'fulfilled' ? gnews.value : []),
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ...(twitter.status === 'fulfilled' ? twitter.value : []),
    ...(traffic.status === 'fulfilled' ? traffic.value : [])
  ];

  const nowMs = Date.now();
  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

  let newCount = 0;
  for (const article of allArticles) {
    if (!article.title || article.title.length < 10) continue;

    const articleTime = article.date instanceof Date ? article.date.getTime() : nowMs;
    if (nowMs - articleTime > FIVE_DAYS_MS) continue;

    if (seenUrls.has(article.url)) continue;
    seenUrls.add(article.url);

    const alert = articleToAlert(article);
    alerts.unshift(alert);
    addIncidentMarker(alert);
    newCount++;
  }

  // Sort by latest timestamp first
  alerts.sort((a, b) => b.timestamp - a.timestamp);

  // Cap alerts
  while (alerts.length > 150) alerts.pop();

  renderAlerts();
  updateStats();
  updateHistogram();
  updateBreakingNews();
  updateLastRefresh();
  isFirstLoad = false;

  if (newCount === 0 && alerts.length === 0) {
    const feed = document.getElementById('alert-feed');
    feed.innerHTML = '<div class="empty-message">No alerts available. Will retry automatically...</div>';
    setTimeout(() => fetchAndProcessAlerts(false), 30000);
  }

  // Flash header on critical real alerts
  const criticalReal = allArticles.some(a => classifySeverity(a.title) === 'critical');
  if (criticalReal) {
    const header = document.getElementById('header');
    header.style.borderBottom = '2px solid rgba(255, 34, 85, 0.7)';
    setTimeout(() => { header.style.borderBottom = '1px solid var(--border-glass)'; }, 3000);
  }
}

// ---- App State ----
let map;
let heatLayer;
let zoneCircles = [];
let incidentMarkers = [];
let alerts = [];
let activeFilter = 'all';
let showHeatmap = true;
let showZones = true;
let showMarkers = true;
let showTraffic = false;
let trafficLayer;
let alertIdCounter = 0;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initTabs();
  initFilters();
  renderZonesPanel();
  updateCountdown();
  updateStats();

  fetchAndProcessAlerts(true);
  setInterval(() => fetchAndProcessAlerts(false), 60000);
  setInterval(updateCountdown, 1000);
  setInterval(updateStats, 5000);
  setInterval(updateLastRefresh, 30000);
  updateLastRefresh();
});

// ============================================
// MAP ENGINE
// ============================================
function initMap() {
  map = L.map('map', {
    center: [23.0, 87.85],
    zoom: 7,
    zoomControl: true,
    attributionControl: false,
  });

  // Dark map tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  // Initialize traffic layer (but don't add to map yet)
  trafficLayer = L.tileLayer('https://mt1.google.com/vt?lyrs=h,traffic&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Traffic data © Google'
  });

  // Attribution
  L.control.attribution({ position: 'bottomright', prefix: '© OpenStreetMap · CartoDB' }).addTo(map);

  // Draw danger zones
  drawDangerZones();

  // Draw heatmap
  drawHeatmap();
}

function drawDangerZones() {
  zoneCircles.forEach(c => map.removeLayer(c));
  zoneCircles = [];

  BENGAL_HOTSPOTS.forEach(spot => {
    const color = RISK_COLORS[spot.risk];

    // Outer pulse circle
    const outerCircle = L.circle([spot.lat, spot.lng], {
      radius: spot.radius,
      color: color.stroke,
      weight: color.weight,
      opacity: 0.5,
      fillColor: color.fill,
      fillOpacity: color.opacity,
      className: `zone-${spot.risk}`,
    }).addTo(map);

    // Inner core circle
    const innerCircle = L.circle([spot.lat, spot.lng], {
      radius: spot.radius * 0.3,
      color: color.stroke,
      weight: 0,
      fillColor: color.fill,
      fillOpacity: color.opacity * 2,
    }).addTo(map);

    // Popup
    outerCircle.bindPopup(`
      <div class="popup-title">${spot.name}</div>
      <span class="popup-risk ${spot.risk}">${spot.risk.toUpperCase()}</span>
      <div class="popup-detail">📍 ${spot.district}</div>
      <div class="popup-detail">⚠️ ${spot.issues}</div>
      <div class="popup-detail">📊 Active alerts: ${spot.alerts}</div>
    `);

    zoneCircles.push(outerCircle, innerCircle);
  });
}

function drawHeatmap() {
  const heatData = BENGAL_HOTSPOTS.map(spot => {
    const intensity = spot.risk === 'critical' ? 1 : spot.risk === 'high' ? 0.7 : spot.risk === 'moderate' ? 0.4 : 0.15;
    return [spot.lat, spot.lng, intensity];
  });

  heatLayer = L.heatLayer(heatData, {
    radius: 40,
    blur: 30,
    maxZoom: 10,
    gradient: {
      0.1: '#33dd88',
      0.3: '#ffbb33',
      0.6: '#ff6633',
      0.9: '#ff2255',
    },
  }).addTo(map);
}

function addIncidentMarker(alert) {
  const spot = BENGAL_HOTSPOTS.find(s => s.name === alert.location);
  if (!spot) return;

  const severityColors = { critical: '#ff2255', high: '#ff6633', moderate: '#ffbb33', low: '#33dd88' };
  const color = severityColors[alert.severity] || '#ffbb33';

  const icon = L.divIcon({
    html: `<div style="
      width: 12px; height: 12px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4);
      box-shadow: 0 0 10px ${color};
    "></div>`,
    iconSize: [12, 12],
    className: 'incident-marker',
  });

  const marker = L.marker([alert.lat, alert.lng], { icon }).addTo(map);
  const readLink = alert.articleUrl 
    ? `<a href="${alert.articleUrl}" target="_blank" class="popup-read-link">↗ Read</a>` 
    : '';
  marker.bindPopup(`
    <div class="popup-title">${alert.title}</div>
    <span class="popup-risk ${alert.severity}">${alert.severity.toUpperCase()}</span>
    <div class="popup-detail">📍 ${alert.location}, ${alert.district || ''}</div>
    <div class="popup-detail">${SOURCE_META[alert.source].icon} ${SOURCE_META[alert.source].label} • ${alert.timeAgo}</div>
    ${readLink}
  `);

  incidentMarkers.push(marker);

  // Keep max 50 markers
  if (incidentMarkers.length > 50) {
    const old = incidentMarkers.shift();
    map.removeLayer(old);
  }
}

// ---- Toggle Controls ----
function toggleHeatmap() {
  showHeatmap = !showHeatmap;
  document.getElementById('btn-heatmap').classList.toggle('active', showHeatmap);
  if (showHeatmap) map.addLayer(heatLayer);
  else map.removeLayer(heatLayer);
}

function toggleTraffic() {
  showTraffic = !showTraffic;
  document.getElementById('btn-traffic').classList.toggle('active', showTraffic);
  if (showTraffic) map.addLayer(trafficLayer);
  else map.removeLayer(trafficLayer);
}

function toggleZones() {
  showZones = !showZones;
  document.getElementById('btn-zones').classList.toggle('active', showZones);
  zoneCircles.forEach(c => {
    if (showZones) map.addLayer(c);
    else map.removeLayer(c);
  });
}

function toggleMarkers() {
  showMarkers = !showMarkers;
  document.getElementById('btn-markers').classList.toggle('active', showMarkers);
  incidentMarkers.forEach(m => {
    if (showMarkers) map.addLayer(m);
    else map.removeLayer(m);
  });
}



// ============================================
// UI RENDERING
// ============================================
function renderAlerts() {
  const feed = document.getElementById('alert-feed');
  const filtered = activeFilter === 'all'
    ? alerts
    : alerts.filter(a => a.source === activeFilter);

  feed.innerHTML = filtered.slice(0, 50).map(a => {
    const linkClass = a.articleUrl ? 'alert-card has-link' : 'alert-card';
    return `
    <div class="${linkClass}" onclick="flyToAlert(${a.lat}, ${a.lng}, '${a.location}')" id="alert-${a.id}">
      <div class="alert-severity ${a.severity}"></div>
      <div class="alert-body">
        <div class="alert-header">
          <span class="alert-source ${SOURCE_META[a.source].class}">
            ${SOURCE_META[a.source].icon} ${SOURCE_META[a.source].label}
          </span>
          <span class="alert-time">${a.timeAgo}</span>
        </div>
        <div class="alert-title">${a.title}</div>
        <div class="alert-location">📍 ${a.location}, ${a.district}${a.articleUrl ? ` <a href="${a.articleUrl}" target="_blank" class="link-hint" onclick="event.stopPropagation()">↗ Read</a>` : ''}</div>
      </div>
    </div>
  `}).join('');
}

function renderZonesPanel() {
  const list = document.getElementById('zones-list');
  const sorted = [...BENGAL_HOTSPOTS].sort((a, b) => {
    const order = { critical: 0, high: 1, moderate: 2, low: 3 };
    return order[a.risk] - order[b.risk];
  });

  list.innerHTML = sorted.map(z => `
    <div class="zone-card" onclick="flyToAlert(${z.lat}, ${z.lng}, '${z.name}')">
      <div class="zone-risk-badge ${z.risk}">${z.risk.substring(0, 4).toUpperCase()}</div>
      <div class="zone-info">
        <h4>${z.name}</h4>
        <p>${z.district} — ${z.issues.substring(0, 60)}...</p>
      </div>
      <div class="zone-alerts-count">
        <strong>${z.alerts}</strong>
        alerts
      </div>
    </div>
  `).join('');
}

function flyToAlert(lat, lng, name) {
  map.flyTo([lat, lng], 13, { duration: 1.2 });
}

// ---- Tabs ----
function initTabs() {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');

      if (tab.dataset.tab === 'zones') renderZonesPanel();
    });
  });
}

// ---- Filters ----
function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      renderAlerts();
    });
  });
}

// ---- Stats ----
function updateStats() {
  const criticalCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;
  const highRiskZones = BENGAL_HOTSPOTS.filter(z => z.risk === 'critical' || z.risk === 'high').length;

  document.getElementById('alert-count').textContent = alerts.length;
  document.getElementById('zone-count').textContent = highRiskZones;
}

function updateCountdown() {
  const target = new Date('2026-05-04T08:00:00+05:30');
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('countdown-value').textContent = 'RESULTS DAY';
    document.getElementById('countdown-value').style.color = '#ff2255';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    document.getElementById('countdown-value').textContent = `${days}d ${hours}h ${mins}m`;
  } else {
    document.getElementById('countdown-value').textContent = `${hours}h ${mins}m`;
  }
}

let breakingNewsInterval;
let currentBreakingIndex = 0;

function updateBreakingNews() {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.title.toLowerCase().includes('breaking'));
  const bar = document.getElementById('breaking-news-bar');
  const text = document.getElementById('breaking-text');
  
  if (criticalAlerts.length > 0) {
    bar.style.display = 'flex';
    
    clearInterval(breakingNewsInterval);
    const updateTicker = () => {
      const alert = criticalAlerts[currentBreakingIndex % criticalAlerts.length];
      text.style.opacity = 0;
      setTimeout(() => {
        text.innerHTML = `<strong>${alert.location || 'Bengal'}:</strong> ${alert.title} <span style="color: var(--text-muted); font-size: 0.75rem; margin-left: 10px;">${alert.timeAgo}</span>`;
        text.style.opacity = 1;
      }, 300);
      currentBreakingIndex++;
    };
    
    updateTicker();
    breakingNewsInterval = setInterval(updateTicker, 5000);
  } else {
    if (bar) bar.style.display = 'none';
    clearInterval(breakingNewsInterval);
  }
}

function updateHistogram() {
  let counts = { critical: 0, high: 0, moderate: 0, low: 0 };
  alerts.forEach(a => {
    if (counts[a.severity] !== undefined) {
      counts[a.severity]++;
    }
  });

  const max = Math.max(1, counts.critical, counts.high, counts.moderate, counts.low);

  ['critical', 'high', 'moderate', 'low'].forEach(level => {
    const valEl = document.getElementById(`hist-val-${level}`);
    const barEl = document.getElementById(`hist-bar-${level}`);
    if (valEl && barEl) {
      valEl.textContent = counts[level];
      const pct = (counts[level] / max) * 100;
      barEl.style.height = `${pct}%`;
    }
  });
}

function updateLastRefresh() {
  const now = new Date();
  document.getElementById('last-update').textContent =
    `Last update: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
}

// ============================================
// UTILITIES
// ============================================
function weightedRandom(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

function weightedRandomIndex(weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) return i;
  }
  return weights.length - 1;
}
