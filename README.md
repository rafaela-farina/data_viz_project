# The Passenger Experience
## Global Aviation Connectivity - Interactive Data Visualization

A scrollytelling web experience that explores international flight connectivity from a tourism perspective, answering the question: *"How easy is it to travel from one country to another?"*

---

## Project Overview

This project visualizes global aviation route data to help travelers understand connectivity patterns between countries. Through an immersive narrative structure inspired by the passenger experience (looking through an airplane window), users explore:

- **The most connected countries** — Where can you reach the most destinations?
- **Hidden gems** — Surprisingly well-connected countries ideal for regional exploration
- **Remote destinations** — The hardest places to reach by air

### Key Features

- **Interactive D3.js world map** with clickable countries and animated route arcs
- **Scroll-driven storytelling** using GSAP ScrollTrigger animations
- **Responsive design** optimized for desktop and mobile devices
- **Glassmorphism UI** with aviation-themed visual design
- **Data transparency** — Each visualization includes dataset downloads and methodology documentation

---

## Live Demo

Open `index.html` in a modern web browser. For local development, use a local server to avoid CORS restrictions:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000
```

---

## Project Structure

```
aviation-project/
│
├── index.html                 # Main HTML file
│
├── assets/
│   ├── style/
│   │   ├── passenger-experience.css   # Main stylesheet
│   │   └── window-elements.css        # Airplane window & screen components
│   │
│   └── script/
│       ├── map-controller.js          # D3.js map logic & interactions
│       └── passenger-scroll.js        # GSAP scroll animations
│
├── processed_data/
│   ├── country_connections_geo.json   # Route connections between countries
│   └── country_stats.json             # Country-level statistics
│
├── protocols/                 # Methodology documentation for each visualization
│   ├── viz_global_map.html
│   ├── viz_connected.html
│   ├── viz_gems.html
│   ├── viz_remote.html
│   └── viz_teammate.html
│
└── README.md
```

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **D3.js v7** | Interactive map visualization |
| **TopoJSON** | Efficient geographic data format |
| **GSAP ScrollTrigger** | Scroll-based animations |
| **CSS Grid & Flexbox** | Responsive layout |
| **CSS backdrop-filter** | Glassmorphism effects |
| **Google Fonts** | Typography (Playfair Display, Source Sans Pro) |

No build process required — pure HTML, CSS, and JavaScript.

---

## Data Sources

- **Flight routes**: OpenFlights.org database
- **Geographic boundaries**: Natural Earth (via world-atlas TopoJSON)
- **Processing**: Routes filtered to international connections only, aggregated by country pairs

See individual protocol files in `/protocols/` for detailed methodology.

---

## Narrative Structure

| Section | Content |
|---------|---------|
| 01 - Hero | Airplane window with animated clouds |
| 02 - Introduction | Project context and key statistics |
| 03 - Interactive Map | D3 world map with country selection |
| 04 - Most Connected | Top 10 countries by connectivity |
| 05 - Hidden Gems | Underrated travel hubs (Qatar, Portugal, Kenya, Panama) |
| 06 - Remote Destinations | Hardest to reach places |
| 07 - Teammate Visualization | Reserved for additional analysis |
| 08 - Key Findings | Summary insights |
| 09 - Finale | Credits and closing |

---

## Authors

- **Alan Dominguez**
- **Rafaela Dos Santos Farina**
- **Colin Augustine**

**Supervisor**: Professor Giovanni Profeta

---

## Course Information

**Institution**: SUPSI (Scuola Universitaria Professionale della Svizzera Italiana)  
**Course**: Data Visualization  
**Date**: December 2025

---

## License

This project was created for academic purposes as part of the SUPSI Data Visualization course.

---

## Acknowledgments

- OpenFlights.org for the route database
- D3.js community for visualization examples
- Natural Earth for geographic data