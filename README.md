# BengalSafe — Bengal Election Safety Tracker

A real-time election safety tracking application for West Bengal, India. Designed to help citizens stay informed about danger zones, traffic disruptions, and potential conflicts during the May 4th, 2026 election results day.

## Features

- **Interactive Map** — Leaflet-powered map showing risk zones across West Bengal
- **Heatmap Visualization** — Visual density of incidents and danger areas
- **Live Alert Feed** — Simulated real-time alerts from multiple sources (Reddit, Twitter, Traffic, Police, News)
- **Risk Zones** — Color-coded zones (Critical, High, Moderate, Safe) with radius indicators
- **Emergency Contacts** — Quick access to police, ambulance, fire, and emergency numbers
- **Safer Corridors** — Recommended routes to avoid conflicts
- **Areas to Avoid** — Known high-risk locations to stay away from
- **Countdown Timer** — Days/hours until election results are announced

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom styling with CSS variables, glassmorphism effects
- **JavaScript (ES6+)** — Vanilla JS with Leaflet.js mapping library
- **Leaflet.js** — Open-source mobile-friendly mapping library
- **Leaflet Heat** — Heatmap plugin for visualization

## Getting Started

1. Clone or download the repository
2. Open `index.html` in your browser
3. The application will load with simulated data

No build steps or server required — runs directly in the browser.

## Project Structure

```
bengalelections/
├── index.html     # Main HTML file
├── app.js         # Application logic and state management
├── style.css     # Styles and theming
└── README.md     # This file
```

## Data Sources

The application includes:
- 20 predefined hotspot locations across West Bengal
- 5 alert source types with 50+ alert templates
- Risk assessment for each location based on historical data

## Disclaimer

This is a demonstration/awareness project with **simulated data**. It is not connected to any real election monitoring system. The data is fictional and generated for demonstration purposes only.

## License

MIT License