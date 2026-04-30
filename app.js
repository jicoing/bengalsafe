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

// ---- Social Media Post Templates ----
const ALERT_TEMPLATES = {
  reddit: [
    { title: 'Heavy police deployment spotted near {location}', severity: 'moderate' },
    { title: 'Road completely blocked at {location}, avoid this area', severity: 'high' },
    { title: 'Political rally turning aggressive near {location}', severity: 'critical' },
    { title: 'Shops closing early in {location} area, tensions rising', severity: 'high' },
    { title: 'Traffic diverted near {location} due to procession', severity: 'moderate' },
    { title: 'Teargas reported near {location} — stay away', severity: 'critical' },
    { title: 'Large crowd gathering at {location}, police on alert', severity: 'high' },
    { title: 'Situation calm in {location} for now, but police everywhere', severity: 'low' },
    { title: 'Stone pelting incident reported near {location}', severity: 'critical' },
    { title: 'Party workers creating roadblock at {location}', severity: 'high' },
    { title: '{location}: Internet seems slow, possible throttling?', severity: 'moderate' },
    { title: 'Section 144 reportedly imposed near {location}', severity: 'critical' },
  ],
  twitter: [
    { title: '🚨 BREAKING: Clashes between party workers at {location} #BengalElections', severity: 'critical' },
    { title: 'Massive traffic jam near {location}, all routes blocked #Kolkata', severity: 'high' },
    { title: 'Counting center at {location} surrounded by huge crowd #WBElections2026', severity: 'high' },
    { title: 'Police lathi-charge reported at {location} — multiple injuries #Bengal', severity: 'critical' },
    { title: 'Celebration firecrackers at {location} — but tensions still high #ElectionResults', severity: 'moderate' },
    { title: 'Vehicle vandalism reported near {location}, avoid the area #StaySafe', severity: 'critical' },
    { title: 'All clear at {location} — heavy security presence #BengalSafe', severity: 'low' },
    { title: 'Victory rally at {location} blocking main road for 2km #Bengal', severity: 'high' },
    { title: 'EMG services struggling to reach {location} due to crowds', severity: 'critical' },
    { title: 'Bomb squad called to {location} after suspicious package #Alert', severity: 'critical' },
  ],
  traffic: [
    { title: 'Severe congestion on NH near {location} — 3hr+ delay', severity: 'high' },
    { title: 'Road closure in effect around {location} counting center', severity: 'high' },
    { title: 'Bridge near {location} closed for security — use alternate route', severity: 'moderate' },
    { title: 'Traffic moving slowly through {location} — procession ahead', severity: 'moderate' },
    { title: 'Gridlock at {location} intersection — avoid if possible', severity: 'high' },
    { title: '{location} bypass road clear — use as alternate', severity: 'low' },
  ],
  police: [
    { title: 'Prohibitory orders in {location} — no gathering of 4+ people', severity: 'critical' },
    { title: 'Rapid Action Force deployed at {location}', severity: 'high' },
    { title: 'Section 144 CrPC imposed in {location} area', severity: 'critical' },
    { title: 'Police checkpoint set up at {location} entry points', severity: 'moderate' },
    { title: 'Curfew imposed in parts of {location} till further notice', severity: 'critical' },
    { title: '{location}: Situation under control, enhanced patrol continues', severity: 'low' },
  ],
  news: [
    { title: 'EC orders re-polling at booth near {location} after violence', severity: 'critical' },
    { title: '{location}: Counting trends spark celebrations, security tightened', severity: 'high' },
    { title: 'Governor visits {location}, appeals for peace', severity: 'moderate' },
    { title: 'Internet shutdown in {location} district — official order', severity: 'high' },
    { title: '{location}: Winning candidate\'s office attacked, police investigating', severity: 'critical' },
    { title: 'Local administration declares {location} area sensitive', severity: 'high' },
  ],
};

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
let realAlertCount = 0;
let simAlertCount = 0;

async function fetchGDELTNews() {
  try {
    const queries = [
      'bengal election violence',
      'kolkata clash protest',
      'west bengal election tension',
      'bengal election safety'
    ];
    const q = queries[Math.floor(Math.random() * queries.length)];
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=artlist&format=json&maxrecords=20&sort=datedesc`;
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

async function fetchGoogleNews() {
  try {
    const rssUrl = 'https://news.google.com/rss/search?q=bengal+election+2026+violence+OR+clash+OR+protest&hl=en-IN&gl=IN&ceid=IN:en';
    const res = await fetch(CORS_PROXY + encodeURIComponent(rssUrl));
    if (!res.ok) throw new Error(`GNews ${res.status}`);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item');
    const results = [];
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const source = item.querySelector('source')?.textContent || '';
      results.push({ title, url: link, date: pubDate ? new Date(pubDate) : new Date(), domain: source, srcType: 'news' });
    });
    return results.slice(0, 15);
  } catch (e) {
    console.warn('Google News fetch failed:', e.message);
    return [];
  }
}

async function fetchRedditPosts() {
  try {
    const subs = ['kolkata', 'india', 'IndiaSpeaks'];
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const redditUrl = `https://www.reddit.com/r/${sub}/search.json?q=bengal+election&sort=new&limit=10&restrict_sr=on`;
    const res = await fetch(CORS_PROXY + encodeURIComponent(redditUrl));
    if (!res.ok) throw new Error(`Reddit ${res.status}`);
    const data = await res.json();
    return (data?.data?.children || []).map(c => ({
      title: c.data.title || '',
      url: `https://reddit.com${c.data.permalink}`,
      date: new Date((c.data.created_utc || 0) * 1000),
      domain: `r/${sub}`,
      srcType: 'reddit',
    }));
  } catch (e) {
    console.warn('Reddit fetch failed:', e.message);
    return [];
  }
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

  return {
    id: ++alertIdCounter,
    source,
    title: article.title,
    severity,
    location: spot.name,
    district: spot.district,
    lat: spot.lat,
    lng: spot.lng,
    timestamp: articleTime,
    timeAgo: minsAgo < 60 ? `${minsAgo}m ago` : minsAgo < 1440 ? `${Math.floor(minsAgo/60)}h ago` : `${Math.floor(minsAgo/1440)}d ago`,
    realData: true,
    articleUrl: article.url || null,
  };
}

async function fetchAndProcessAlerts() {
  const [gdelt, gnews, reddit] = await Promise.allSettled([
    fetchGDELTNews(), fetchGoogleNews(), fetchRedditPosts()
  ]);

  const allArticles = [
    ...(gdelt.status === 'fulfilled' ? gdelt.value : []),
    ...(gnews.status === 'fulfilled' ? gnews.value : []),
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
  ];

  let newCount = 0;
  for (const article of allArticles) {
    if (!article.title || article.title.length < 10) continue;
    if (seenUrls.has(article.url)) continue;
    seenUrls.add(article.url);

    const alert = articleToAlert(article);
    alerts.unshift(alert);
    addIncidentMarker(alert);
    realAlertCount++;
    newCount++;
  }

  // If no real data came through, generate a simulated one as fallback
  if (newCount === 0) {
    const alert = generateAlert();
    alert.realData = false;
    alerts.unshift(alert);
    addIncidentMarker(alert);
    simAlertCount++;
  }

  // Cap alerts
  while (alerts.length > 150) alerts.pop();

  renderAlerts();
  updateStats();
  updateLastRefresh();

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

  // Load initial simulated alerts as placeholder, then fetch real data
  generateInitialAlerts();
  fetchAndProcessAlerts(); // First real fetch

  // Poll real data every 60 seconds
  setInterval(fetchAndProcessAlerts, 60000);
  // Fallback: generate a simulated alert every 45s if feed is quiet
  setInterval(() => {
    if (alerts.length < 5) {
      const alert = generateAlert();
      alert.realData = false;
      alerts.unshift(alert);
      addIncidentMarker(alert);
      simAlertCount++;
      renderAlerts();
    }
  }, 45000);
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

  const offsetLat = spot.lat + (Math.random() - 0.5) * 0.02;
  const offsetLng = spot.lng + (Math.random() - 0.5) * 0.02;

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

  const marker = L.marker([offsetLat, offsetLng], { icon }).addTo(map);
  marker.bindPopup(`
    <div class="popup-title">${alert.title}</div>
    <span class="popup-risk ${alert.severity}">${alert.severity.toUpperCase()}</span>
    <div class="popup-detail">📍 ${alert.location}, ${alert.district || ''}</div>
    <div class="popup-detail">${SOURCE_META[alert.source].icon} ${SOURCE_META[alert.source].label} • ${alert.timeAgo}</div>
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
// ALERT ENGINE
// ============================================
function generateAlert() {
  const sources = Object.keys(ALERT_TEMPLATES);
  const weights = [0.25, 0.25, 0.2, 0.15, 0.15]; // reddit, twitter, traffic, police, news
  const source = weightedRandom(sources, weights);
  const templates = ALERT_TEMPLATES[source];
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Bias towards higher-risk locations
  const riskWeights = BENGAL_HOTSPOTS.map(s =>
    s.risk === 'critical' ? 4 : s.risk === 'high' ? 3 : s.risk === 'moderate' ? 2 : 1
  );
  const spotIdx = weightedRandomIndex(riskWeights);
  const spot = BENGAL_HOTSPOTS[spotIdx];

  const title = template.title.replace(/\{location\}/g, spot.name);
  const minsAgo = Math.floor(Math.random() * 15) + 1;

  spot.alerts++;

  const alert = {
    id: ++alertIdCounter,
    source,
    title,
    severity: template.severity,
    location: spot.name,
    district: spot.district,
    lat: spot.lat,
    lng: spot.lng,
    timestamp: Date.now() - minsAgo * 60000,
    timeAgo: minsAgo === 1 ? '1 min ago' : `${minsAgo} mins ago`,
    realData: false,
    articleUrl: null,
  };

  return alert;
}

function generateInitialAlerts() {
  for (let i = 0; i < 15; i++) {
    const alert = generateAlert();
    alerts.unshift(alert);
    addIncidentMarker(alert);
  }
  renderAlerts();
}

function generateRandomAlert() {
  const alert = generateAlert();
  alerts.unshift(alert);

  // Keep max 100 alerts
  if (alerts.length > 100) alerts.pop();

  addIncidentMarker(alert);
  renderAlerts();
  updateStats();

  // Flash header on critical
  if (alert.severity === 'critical') {
    const header = document.getElementById('header');
    header.style.borderBottom = '1px solid rgba(255, 34, 85, 0.5)';
    setTimeout(() => {
      header.style.borderBottom = '1px solid var(--border-glass)';
    }, 2000);
  }
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
    const badge = a.realData ? '<span class="data-badge live">LIVE</span>' : '<span class="data-badge sim">SIM</span>';
    const clickAttr = a.realData && a.articleUrl
      ? `onclick="window.open('${a.articleUrl}', '_blank')"`
      : `onclick="flyToAlert(${a.lat}, ${a.lng}, '${a.location}')"`;
    const linkClass = a.realData && a.articleUrl ? 'alert-card has-link' : 'alert-card';
    return `
    <div class="${linkClass}" ${clickAttr} id="alert-${a.id}">
      <div class="alert-severity ${a.severity}"></div>
      <div class="alert-body">
        <div class="alert-header">
          <span class="alert-source ${SOURCE_META[a.source].class}">
            ${SOURCE_META[a.source].icon} ${SOURCE_META[a.source].label}
          </span>
          ${badge}
          <span class="alert-time">${a.timeAgo}</span>
        </div>
        <div class="alert-title">${a.title}</div>
        <div class="alert-location">📍 ${a.location}, ${a.district}${a.realData && a.articleUrl ? ' <span class="link-hint">↗ Read</span>' : ''}</div>
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
