# The Passenger Experience
## Global Aviation Connectivity Visualization

A scrollytelling data visualization exploring how international airports connect the world.

**SUPSI Data Visualization Course** · December 2025  
**Professor:** Giovanni Profeta

---

## Team

| Member | Role |
|--------|------|
| **Alan Dominguez** | Lead Developer, Data Analysis, D3.js Map |
| **Rafaela Dos Santos Farina** | Flourish Visualizations (Network, Hubs Chart) |
| **Colin Augustine** | Tableau Visualizations, Data Support |

---

## Project Structure

```
aviation-project/
├── index.html                    # Main scrollytelling page
├── README.md                     # This file
├── assets/
│   ├── script/
│   │   ├── map-controller.js     # D3.js interactive map
│   │   └── passenger-scroll.js   # GSAP scroll animations
│   └── style/
│       ├── passenger-experience.css  # Main styles
│       └── window-elements.css       # Component styles
├── processed_data/
│   ├── country_connections_geo.json  # Main connectivity dataset
│   ├── country_stats.json            # Country statistics
│   ├── continental_hubs_2024.json    # Hub airports data
│   ├── continental_hubs_summary.csv  # Hub summary table
│   ├── hub_airports_by_continent.json
│   ├── hub_cdg_data.json
│   └── *.md                          # Source documentation
└── protocols/
    ├── viz_global_map.html           # D3 Map metadata
    ├── viz_network.html              # Network viz metadata
    ├── viz_continental_hubs.html     # Hubs section metadata
    ├── viz_gems.html                 # Hidden gems metadata
    └── viz_*.html                    # Other protocols
```

---

## Sections Overview

| # | Section | Visualization | Author |
|---|---------|---------------|--------|
| 01 | The World at Your Fingertips | Stats counters | Alan |
| 02 | Explore Global Connectivity | D3.js Interactive Map | Alan |
| 03 | Hidden Gems & Remote | Clickable Cards → Map | Alan |
| 04 | Country Connections Network | Flourish Network | Rafaela |
| 05 | Global Airport Distribution | Flourish Map | Colin/Rafaela |
| 06 | Continental Aviation Hubs | Interactive Tabs + Flourish | Alan/Rafaela |
| 07 | What We Learned + Next Steps | Key findings | Team |

---

## Version History

### v10 (Current) - December 10, 2025
- **Hub Multiselect System:** Checkboxes replace tabs for comparing multiple hubs
- **All Hubs Default View:** Shows all 6 continental hubs by default
- **Dynamic Comparison:** Title changes based on selection (e.g., "Paris vs Dubai vs Sydney")
- **Flourish Chart Integration:** Real line chart embedded (visualisation/26746807)
- **Responsive Cards Grid:** 6 hub cards that show/hide based on selection
- **Increased delay:** Hidden gems click delay changed to 800ms for smoother scroll

### v9 - December 10, 2025
- **Compact Layout:** Reduced vertical spacing for D3 map and Hidden Gems sections
- **Hidden Gems Redesign:** 4-column grid layout with flags, clickable cards that navigate to D3 map
- **Flourish Integration:** Replaced Tableau with Flourish map (visualisation/26727077)
- **Continental Aviation Hubs:** New interactive section with 6 hub tabs (CDG, ATL, DXB, GRU, CMN, SYD)
- **Flourish Sync Preparation:** JavaScript API ready for Flourish chart → Hub tab synchronization
- **Next Steps Section:** Added future research directions
- **New Protocol:** `viz_continental_hubs.html` metadata page

### v8 - December 9, 2025
- Sidebar layout optimization (15%/85% split)
- Color scheme refinement (violet/orange palette)
- Remote items spacing fixes

### v7 - December 7, 2025
- CDG hub case study section
- Data links and protocol pages
- Teammate embed integration

### Earlier versions
- D3 map development, GSAP animations, glassmorphism UI

---

## Interactive Features

### D3 Map (Section 02)
- Click any country to see flight connections
- Top 10 sidebar with quick selection
- Zoom controls and route slider
- Arced flight paths with animations

### Hidden Gems (Section 03)
- **Click any card** → Scrolls to map and highlights that country
- Works for both "Well-Connected" and "Remote" cards

### Continental Hubs (Section 06)
- **Tab navigation** between 6 continental hubs
- Each tab shows: airport name, stats, description
- Placeholder ready for Flourish line chart

---

## Technical Implementation

### CSS Customization Points

**D3 Map Height** (`assets/style/window-elements.css`):
```css
/* Line 1384 - Base height */
.map-main .seat-screen {
    height: 600px;
}

/* Line 1939 - Compact mode */
.compact-layout .map-main .seat-screen {
    height: 500px;
}
```

### JavaScript API

The page exposes a global API for external control:

```javascript
// Select a hub tab programmatically
window.selectHub('cdg');  // Options: cdg, atl, dxb, gru, cmn, syd

// Sync from Flourish selection
window.syncHubFromFlourish('France');  // Accepts country/airport names

// Full API object
window.PassengerExperience = {
    selectHub: function(hubId),
    syncHubFromFlourish: function(selection),
    hubMapping: { 'France': 'cdg', ... }
};
```

### Flourish Integration

The page listens for `postMessage` events from Flourish iframes:

```javascript
// Flourish chart should emit:
{
    type: 'selection',
    value: 'France'  // or 'CDG', 'Paris', etc.
}
```

Rafaela can configure the Flourish chart to send these messages on click.

---

## Data Sources

### Connectivity Data
- OpenFlights database (routes, airports)
- Manual verification of country mappings

### Hub Airport Statistics (2024)
| Airport | Source | Quality |
|---------|--------|---------|
| CDG | Paris Aéroport / Groupe ADP | Official |
| ATL | Atlanta Airport Statistics | Official |
| DXB | Dubai Airports Annual Review | Official |
| GRU | GRU Airport / CEIC Data | Estimated |
| SYD | Sydney Airport Corporation | Official |
| CMN | ONDA Morocco | Estimated |

Full source documentation in `processed_data/*.md` files.

---

## Dependencies

- **D3.js v7** - Interactive map
- **TopoJSON v3** - Geographic data
- **GSAP 3.12** - Scroll animations
- **Flourish** - External embeds
- **Google Fonts** - Playfair Display, Source Sans Pro

---

## Local Development

```bash
# Serve locally (Python)
python -m http.server 8000

# Or with Node
npx serve .
```

Open `http://localhost:8000` in browser.

---

## Deployment

The project is static HTML/CSS/JS and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

Ensure `processed_data/` folder is included for D3 map data.

---

## License

Academic project for SUPSI. Data sources credited in protocol pages.

---

## Contact

For questions about this project, contact the team through SUPSI channels.
