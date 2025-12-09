# The Passenger Experience
## Global Aviation Connectivity Visualization

A scrollytelling data visualization exploring international flight connectivity worldwide. Built as part of the Data Visualization course at SUPSI (University of Applied Sciences and Arts of Southern Switzerland).

---

## Research Question

> **How easy is it to travel from one country to another?**

We analyzed flight route data from international airports worldwide to reveal patterns about which destinations are travel hubs, which are hidden gems, and which remain beautifully remote.

---

## Team

| Name | Role |
|------|------|
| **Alan Dominguez** | Data Specialist |
| **Rafaela Dos Santos Farina** | Visualization Specialist |
| **Colin Augustine** | Research Specialist |

**Supervisor:** Professor Giovanni Profeta  
**Institution:** SUPSI — December 2025

---

## Project Structure

```
aviation-project/
│
├── index.html                          # Main HTML file
├── favicon.ico                         # Site favicon
├── README.md                           # This file
│
├── assets/
│   ├── style/
│   │   ├── passenger-experience.css    # Main stylesheet (layout, typography)
│   │   └── window-elements.css         # Airplane window & screen components
│   │
│   └── script/
│       ├── map-controller.js           # D3.js map logic & interactions
│       └── passenger-scroll.js         # GSAP scroll animations
│
├── processed_data/                     # Processed datasets
│   │
│   │── # Core visualization data
│   ├── country_connections_geo.json    # Country pairs with coordinates (D3 map)
│   ├── country_stats.json              # Aggregated country statistics
│   ├── country_connections.csv         # Country-to-country route counts
│   ├── country_ranking.csv             # Countries ranked by connectivity
│   │
│   │── # Airport-level data
│   ├── airport_connectivity.csv        # Individual airport metrics
│   ├── airports_cleaned.csv            # Cleaned airport database
│   ├── airlines_active.csv             # Active airlines list
│   │
│   │── # CDG Hub case study
│   ├── hub_cdg_data.json               # Complete CDG dataset (JSON)
│   ├── hub_cdg_destinations.csv        # Top 20 destinations from CDG
│   ├── hub_cdg_delays_airlines.csv     # Delay stats by airline
│   ├── hub_cdg_delays_hourly.csv       # Delay patterns by time of day
│   ├── hub_cdg_monthly.csv             # Monthly traffic & performance
│   ├── HUB_CDG_SOURCES.md              # Data sources documentation
│   │
│   │── # Supporting data
│   ├── population.xlsx                 # World population data
│   └── Raw Datasets.rar                # Original unprocessed data
│
└── protocols/                          # Methodology documentation
    ├── viz_connected.html              # Top 10 Connected Countries
    ├── viz_gems.html                   # Hidden Gems section
    ├── viz_global_map.html             # Interactive D3 Map
    ├── viz_network.html                # Flourish Network (Rafaela)
    ├── viz_population.html             # Tableau Dashboard (Colin)
    ├── viz_remote.html                 # Remote Destinations
    └── viz_teammate.html               # Teammate placeholder
```

---

## Visualizations

The project follows a scrollytelling narrative with increasing interactivity:

| Section | Title | Type | Interactivity |
|---------|-------|------|---------------|
| 01 | Introduction | Text + Stats | Counter animation |
| 02 | The Most Connected | Bar Chart | Click → map |
| 03 | Country Connections Network | Flourish Embed | Hover nodes |
| 04 | Airports vs Population | Tableau Embed | Filters |
| 05 | Hidden Gems & Remote | Cards | Click → map |
| 06 | Inside a Global Hub (CDG) | Stats + Chart | Observe |
| 07 | Explore the Network | D3.js Map | Full interaction |
| 08 | What We Learned | Summary Cards | Observe |
| 09 | Bon Voyage | Finale | None |

---

## Technologies

### Frontend
- **HTML5** — Semantic structure
- **CSS3** — Custom properties, glassmorphism, animations
- **JavaScript (ES6+)** — Module pattern, async/await

### Libraries
- **D3.js v7** — Interactive world map & data bindings
- **TopoJSON v3** — Efficient geographic data
- **GSAP 3.12** — Scroll-triggered animations
- **ScrollTrigger** — Section-based animation triggers

### External Visualizations
- **Flourish** — Network diagram (Rafaela)
- **Tableau Public** — Geographic dashboard (Colin)

### Data Processing
- **Python 3** — pandas, numpy
- **OpenFlights Database** — Primary data source

---

## Data Sources

### Primary Source
| Dataset | Source | Records |
|---------|--------|---------|
| Routes | [OpenFlights](https://openflights.org/data.html) | ~67,000 routes |
| Airports | [OpenFlights](https://openflights.org/data.html) | ~7,000 airports |
| Airlines | [OpenFlights](https://openflights.org/data.html) | ~6,000 airlines |

### CDG Hub Case Study
Data compiled from multiple public sources:
- Paris Aéroport (Groupe ADP) official statistics
- Wikipedia
- FlightConnections.com
- The Local France (delay statistics)
- Statista

See `processed_data/HUB_CDG_SOURCES.md` for complete source documentation.

### Supporting Data
- World population data (World Bank)
- Country coordinates (Natural Earth)

---

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for CORS compliance)

### Running Locally

**Option 1: Python**
```bash
cd aviation-project
python -m http.server 8000
# Open http://localhost:8000
```

**Option 2: Node.js**
```bash
npx serve .
# Open http://localhost:3000
```

**Option 3: VS Code**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0f172a` | Main background |
| Card | `#1e293b` | Glass cards |
| Cyan | `#06b6d4` | Accent, highlights |
| Teal | `#14b8a6` | Secondary accent |
| Gold | `#fbbf24` | Selected country |
| Orange | `#f97316` | Warm accents |

### Typography
- **Display:** Playfair Display (headings)
- **Body:** Source Sans Pro (text)

### UI Components
- Airplane window frame (hero & finale)
- Seat-back screen bezel (visualizations)
- Glassmorphism cards
- Animated clouds (CSS emoji filters)

---

## Responsive Design

The visualization is optimized for:
- **Desktop:** 1920px+ (full experience)
- **Laptop:** 1024px-1919px (adapted layout)
- **Tablet:** 768px-1023px (stacked sections)
- **Mobile:** < 768px (simplified view)

---

## Key Features

### Interactive Map
- Click countries to see connections
- Click arcs to explore specific routes
- Zoom/pan controls
- Info panel with statistics
- Dropdown country selector

### Scroll Animations
- Progress bar indicator
- Section fade-in effects
- Counter animations
- Parallax cloud movements

### Data Interactions
- Ranking items link to map
- Gem cards link to map
- Remote destinations link to map
- Edge click for route details

---

## Methodology

Each visualization includes a protocol document in the `/protocols` folder documenting:
- Data source and preprocessing
- Design decisions
- Interaction patterns
- Technical implementation

---

## Acknowledgments

- **OpenFlights** for the comprehensive aviation database
- **Natural Earth** for geographic data
- **D3.js community** for examples and documentation
- **Professor Giovanni Profeta** for guidance and feedback

---

## License

This project was created for educational purposes as part of the SUPSI Data Visualization course (December 2025).

---

<div align="center">

**Made with ✈️ by Alan, Rafaela & Colin**

*SUPSI — Data Visualization 2025*

</div>
