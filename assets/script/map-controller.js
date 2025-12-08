/**
 * MAP CONTROLLER - D3 Map Management
 * ===================================
 * Handles D3 map initialization, interactions, and animations
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        width: 1400,
        height: 700,
        initialScale: 200,
        transitionDuration: 1800,
        colors: {
            land: '#1e293b',
            landHover: '#334155',
            borders: '#334155',
            selected: '#fbbf24',
            destination: '#14b8a6',
            arcStart: '#06b6d4',
            arcEnd: '#f97316'
        },
        regions: {
            global: { coords: [0, 20], scale: 200 },
            usa: { coords: [-95, 38], scale: 600 },
            europe: { coords: [10, 50], scale: 800 },
            asia: { coords: [105, 35], scale: 400 },
            middleeast: { coords: [50, 25], scale: 600 },
            africa: { coords: [20, 0], scale: 400 },
            southamerica: { coords: [-60, -15], scale: 400 },
            oceania: { coords: [140, -25], scale: 400 }
        }
    };

    // ============================================
    // STATE
    // ============================================
    let mapState = {
        initialized: false,
        svg: null,
        g: null,
        projection: null,
        path: null,
        zoom: null,
        worldData: null,
        connectionsData: null,
        statsData: null,
        selectedCountry: null,
        selectedEdge: null
    };

    // ============================================
    // ISO COUNTRY CODE MAPPING
    // ============================================
    const countryIdToName = {
        '840': 'United States', '124': 'Canada', '484': 'Mexico',
        '826': 'United Kingdom', '276': 'Germany', '250': 'France',
        '724': 'Spain', '380': 'Italy', '528': 'Netherlands',
        '756': 'Switzerland', '56': 'Belgium', '40': 'Austria',
        '620': 'Portugal', '300': 'Greece', '792': 'Turkey',
        '643': 'Russia', '156': 'China', '392': 'Japan',
        '410': 'South Korea', '356': 'India', '764': 'Thailand',
        '702': 'Singapore', '458': 'Malaysia', '360': 'Indonesia',
        '608': 'Philippines', '704': 'Vietnam', '36': 'Australia',
        '554': 'New Zealand', '784': 'United Arab Emirates',
        '682': 'Saudi Arabia', '634': 'Qatar', '376': 'Israel',
        '818': 'Egypt', '710': 'South Africa', '504': 'Morocco',
        '404': 'Kenya', '566': 'Nigeria', '76': 'Brazil',
        '32': 'Argentina', '152': 'Chile', '170': 'Colombia',
        '604': 'Peru', '208': 'Denmark', '578': 'Norway',
        '752': 'Sweden', '246': 'Finland', '616': 'Poland',
        '203': 'Czech Republic', '348': 'Hungary', '642': 'Romania',
        '100': 'Bulgaria', '191': 'Croatia', '372': 'Ireland',
        '352': 'Iceland', '804': 'Ukraine', '344': 'Hong Kong',
        '158': 'Taiwan', '50': 'Bangladesh', '586': 'Pakistan',
        '144': 'Sri Lanka', '104': 'Myanmar', '116': 'Cambodia',
        '634': 'Qatar', '414': 'Kuwait', '512': 'Oman',
        '48': 'Bahrain', '400': 'Jordan', '422': 'Lebanon'
    };

    // Country flags emoji mapping
    const countryFlags = {
        'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Germany': '🇩🇪',
        'France': '🇫🇷', 'Spain': '🇪🇸', 'Italy': '🇮🇹',
        'China': '🇨🇳', 'Japan': '🇯🇵', 'Canada': '🇨🇦',
        'Australia': '🇦🇺', 'Brazil': '🇧🇷', 'India': '🇮🇳',
        'Mexico': '🇲🇽', 'Netherlands': '🇳🇱', 'Switzerland': '🇨🇭',
        'Singapore': '🇸🇬', 'South Korea': '🇰🇷', 'Turkey': '🇹🇷',
        'United Arab Emirates': '🇦🇪', 'Thailand': '🇹🇭', 'Russia': '🇷🇺',
        'Indonesia': '🇮🇩', 'Malaysia': '🇲🇾', 'Philippines': '🇵🇭',
        'Vietnam': '🇻🇳', 'South Africa': '🇿🇦', 'Egypt': '🇪🇬',
        'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦', 'Israel': '🇮🇱',
        'Greece': '🇬🇷', 'Portugal': '🇵🇹', 'Ireland': '🇮🇪',
        'Poland': '🇵🇱', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
        'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Austria': '🇦🇹',
        'Belgium': '🇧🇪', 'Argentina': '🇦🇷', 'Chile': '🇨🇱',
        'Colombia': '🇨🇴', 'Peru': '🇵🇪', 'New Zealand': '🇳🇿',
        'Morocco': '🇲🇦', 'Kenya': '🇰🇪', 'Nigeria': '🇳🇬'
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    function initMap(containerId = '#d3-map-container') {
        console.log('🗺️ Initializing D3 map...');

        const container = d3.select(containerId);
        if (container.empty()) {
            console.error('Map container not found:', containerId);
            return;
        }

        // Clear any existing content
        container.selectAll('svg').remove();

        // Get container dimensions
        const containerNode = container.node();
        const rect = containerNode.getBoundingClientRect();
        const width = rect.width || CONFIG.width;
        const height = rect.height || CONFIG.height;

        // Create SVG
        mapState.svg = container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${CONFIG.width} ${CONFIG.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('position', 'absolute')
            .style('top', '0')
            .style('left', '0');

        // Create main group for zoom/pan
        mapState.g = mapState.svg.append('g');

        // Create layer groups
        mapState.mapGroup = mapState.g.append('g').attr('class', 'map-group');
        mapState.connectionsGroup = mapState.g.append('g').attr('class', 'connections-group');
        mapState.labelsGroup = mapState.g.append('g').attr('class', 'labels-group');

        // Setup projection
        mapState.projection = d3.geoNaturalEarth1()
            .scale(CONFIG.initialScale)
            .translate([CONFIG.width / 2, CONFIG.height / 2]);

        mapState.path = d3.geoPath().projection(mapState.projection);

        // Setup zoom
        mapState.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                mapState.g.attr('transform', event.transform);
            });

        mapState.svg.call(mapState.zoom);

        // Load data
        loadMapData();
    }

    // ============================================
    // DATA LOADING
    // ============================================
    function loadMapData() {
        Promise.all([
            d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
            d3.json('processed_data/country_connections_geo.json'),
            d3.json('processed_data/country_stats.json')
        ]).then(([world, connections, stats]) => {
            mapState.worldData = world;
            mapState.connectionsData = connections;
            mapState.statsData = stats;
            mapState.initialized = true;

            // Hide loading indicator
            d3.select('.loading-indicator').style('display', 'none');

            // Draw map
            drawCountries();
            populateCountrySelect();

            console.log('✅ Map data loaded successfully');
            console.log(`   - ${Object.keys(stats).length} countries`);
            console.log(`   - ${connections.length} connections`);

        }).catch(error => {
            console.error('❌ Error loading map data:', error);
            d3.select('.loading-indicator').html(`
                <div style="color: #ef4444; text-align: center;">
                    <p>Error loading map data</p>
                    <p style="font-size: 0.75rem; opacity: 0.7;">Check console for details</p>
                </div>
            `);
        });
    }

    // ============================================
    // DRAWING FUNCTIONS
    // ============================================
    function drawCountries() {
        const countries = topojson.feature(mapState.worldData, mapState.worldData.objects.countries);

        mapState.mapGroup.selectAll('.country')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', mapState.path)
            .on('click', (event, d) => {
                const countryName = getCountryName(d);
                if (countryName && mapState.statsData[countryName]) {
                    selectCountry(countryName);
                }
            })
            .on('mouseover', (event, d) => {
                const countryName = getCountryName(d);
                if (countryName && mapState.statsData[countryName]) {
                    showTooltip(event, countryName);
                }
            })
            .on('mouseout', hideTooltip);
    }

    function getCountryName(feature) {
        const id = String(feature.id);
        if (countryIdToName[id]) {
            return countryIdToName[id];
        }

        // Fallback: centroid proximity matching
        const centroid = mapState.path.centroid(feature);
        if (!centroid || !isFinite(centroid[0]) || !isFinite(centroid[1])) {
            return null;
        }

        let closestCountry = null;
        let minDistance = Infinity;

        for (const [name, stats] of Object.entries(mapState.statsData)) {
            if (!stats.coords || stats.coords[0] === 0) continue;
            const projected = mapState.projection(stats.coords);
            if (!projected) continue;

            const distance = Math.sqrt(
                Math.pow(projected[0] - centroid[0], 2) +
                Math.pow(projected[1] - centroid[1], 2)
            );

            if (distance < minDistance && distance < 100) {
                minDistance = distance;
                closestCountry = name;
            }
        }

        return closestCountry;
    }

    // ============================================
    // COUNTRY SELECTION
    // ============================================
    function selectCountry(countryName) {
        if (!mapState.initialized) return;

        mapState.selectedCountry = countryName;

        // Update dropdown
        const select = document.getElementById('country-select');
        if (select) select.value = countryName;

        // Clear previous connections
        mapState.connectionsGroup.selectAll('*').remove();
        mapState.labelsGroup.selectAll('*').remove();

        // Reset country styles
        mapState.mapGroup.selectAll('.country')
            .classed('selected', false)
            .classed('destination', false);

        // Get max routes from slider
        const maxRoutesInput = document.getElementById('max-routes');
        const maxRoutes = maxRoutesInput ? parseInt(maxRoutesInput.value) : 20;

        // Filter and sort connections
        const countryConnections = mapState.connectionsData
            .filter(d => d.source === countryName)
            .sort((a, b) => b.num_routes - a.num_routes)
            .slice(0, maxRoutes);

        // Highlight countries
        const destinationCountries = new Set(countryConnections.map(d => d.dest));

        mapState.mapGroup.selectAll('.country')
            .each(function(d) {
                const name = getCountryName(d);
                if (name === countryName) {
                    d3.select(this).classed('selected', true);
                } else if (destinationCountries.has(name)) {
                    d3.select(this).classed('destination', true);
                }
            });

        // Draw connections
        drawConnections(countryConnections);

        // Show info panel
        showInfoPanel(countryName);

        // Fly to country
        const stats = mapState.statsData[countryName];
        if (stats && stats.coords && stats.coords[0] !== 0) {
            flyTo(stats.coords[0], stats.coords[1], 3);
        }
    }

    function drawConnections(connections) {
        if (connections.length === 0) return;

        const colorScale = d3.scaleLinear()
            .domain([0, connections.length - 1])
            .range([CONFIG.colors.arcStart, CONFIG.colors.arcEnd]);

        connections.forEach((conn, i) => {
            const source = mapState.projection(conn.source_coords);
            const dest = mapState.projection(conn.dest_coords);

            if (source && dest && isFinite(source[0]) && isFinite(dest[0])) {
                const dx = dest[0] - source[0];
                const dy = dest[1] - source[1];
                const dr = Math.sqrt(dx * dx + dy * dy) * 0.7;

                const arcPath = `M ${source[0]},${source[1]} A ${dr},${dr} 0 0,1 ${dest[0]},${dest[1]}`;

                mapState.connectionsGroup.append('path')
                    .attr('class', 'connection-arc')
                    .attr('d', arcPath)
                    .attr('data-source', conn.source)
                    .attr('data-dest', conn.dest)
                    .style('stroke', colorScale(i))
                    .style('opacity', 0)
                    .style('cursor', 'pointer')
                    .on('mouseover', function(event) {
                        d3.select(this).style('opacity', 1).style('stroke-width', 3);
                        showConnectionTooltip(event, conn);
                    })
                    .on('mouseout', function() {
                        // Only reset if not selected
                        if (!d3.select(this).classed('selected-edge')) {
                            d3.select(this).style('opacity', 0.6).style('stroke-width', 1.5);
                        }
                        hideTooltip();
                    })
                    .on('click', function(event) {
                        event.stopPropagation();
                        selectEdge(conn, this);
                    })
                    .transition()
                    .delay(i * 30)
                    .duration(500)
                    .style('opacity', 0.6);
            }
        });
    }

    // ============================================
    // EDGE SELECTION
    // ============================================
    function selectEdge(conn, element) {
        // Store selected edge
        mapState.selectedEdge = conn;
        
        // Reset all edges visual state
        mapState.connectionsGroup.selectAll('.connection-arc')
            .classed('selected-edge', false)
            .style('stroke-width', 1.5)
            .style('opacity', 0.6);
        
        // Highlight selected edge
        d3.select(element)
            .classed('selected-edge', true)
            .style('stroke-width', 4)
            .style('opacity', 1)
            .style('stroke', '#fbbf24'); // Golden highlight
        
        // Center map on the edge (midpoint between countries)
        const midLon = (conn.source_coords[0] + conn.dest_coords[0]) / 2;
        const midLat = (conn.source_coords[1] + conn.dest_coords[1]) / 2;
        
        // Calculate appropriate zoom based on distance
        const distance = Math.sqrt(
            Math.pow(conn.dest_coords[0] - conn.source_coords[0], 2) +
            Math.pow(conn.dest_coords[1] - conn.source_coords[1], 2)
        );
        const zoomLevel = Math.max(1.5, Math.min(4, 150 / distance));
        
        flyTo(midLon, midLat, zoomLevel);
        
        // Show edge info panel
        showEdgeInfoPanel(conn);
    }
    
    function showEdgeInfoPanel(conn) {
        const panel = d3.select('#info-panel');
        const sourceFlag = countryFlags[conn.source] || '🌍';
        const destFlag = countryFlags[conn.dest] || '🌍';
        
        // Get stats for both countries
        const sourceStats = mapState.statsData[conn.source] || {};
        const destStats = mapState.statsData[conn.dest] || {};
        
        // Find top airports from source that might connect to dest
        const sourceAirports = sourceStats.top_airports || [];
        const destAirports = destStats.top_airports || [];
        
        let html = `
            <h3 style="font-size: 1rem; line-height: 1.3;">
                <span class="flag">${sourceFlag}</span> ${conn.source}
                <span style="color: #06b6d4; margin: 0 0.3rem;">→</span>
                <span class="flag">${destFlag}</span> ${conn.dest}
            </h3>
            <div class="info-stat" style="margin-top: 1rem; padding: 0.75rem; background: rgba(6, 182, 212, 0.1); border-radius: 8px;">
                <div class="info-stat-label">Direct Routes</div>
                <div class="info-stat-value" style="font-size: 1.5rem; color: #06b6d4;">${conn.num_routes}</div>
            </div>
        `;
        
        // Source country info
        html += `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(148,163,184,0.2);">
                <h4 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.5rem;">
                    ${sourceFlag} From ${conn.source}
                </h4>
                <div style="font-size: 0.8rem; color: #94a3b8;">
                    Total connections: <span style="color: #f1f5f9;">${sourceStats.num_countries_connected || 'N/A'}</span> countries
                </div>
        `;
        
        if (sourceAirports.length > 0) {
            html += `
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">
                    Main airports: 
                    <span style="color: #94a3b8;">${sourceAirports.slice(0, 2).map(a => a.iata).join(', ')}</span>
                </div>
            `;
        }
        html += `</div>`;
        
        // Destination country info
        html += `
            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(148,163,184,0.1);">
                <h4 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.5rem;">
                    ${destFlag} To ${conn.dest}
                </h4>
                <div style="font-size: 0.8rem; color: #94a3b8;">
                    Total connections: <span style="color: #f1f5f9;">${destStats.num_countries_connected || 'N/A'}</span> countries
                </div>
        `;
        
        if (destAirports.length > 0) {
            html += `
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">
                    Main airports: 
                    <span style="color: #94a3b8;">${destAirports.slice(0, 2).map(a => a.iata).join(', ')}</span>
                </div>
            `;
        }
        html += `</div>`;
        
        // Back to country button
        html += `
            <button id="back-to-country" style="
                margin-top: 1rem;
                width: 100%;
                padding: 0.5rem;
                background: rgba(148, 163, 184, 0.1);
                border: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 6px;
                color: #94a3b8;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.background='rgba(148, 163, 184, 0.2)'" 
               onmouseout="this.style.background='rgba(148, 163, 184, 0.1)'"
               onclick="window.backToCountrySelection()">
                ← Back to ${conn.source}
            </button>
        `;
        
        panel.html(html).classed('visible', true);
    }
    
    // Global function to go back to country view
    window.backToCountrySelection = function() {
        if (mapState.selectedEdge) {
            selectCountry(mapState.selectedEdge.source);
            mapState.selectedEdge = null;
        }
    };

    // ============================================
    // FLY TO REGION
    // ============================================
    function flyTo(lon, lat, scale = 3) {
        if (!mapState.initialized || !mapState.svg) return;

        const transform = d3.zoomIdentity
            .translate(CONFIG.width / 2, CONFIG.height / 2)
            .scale(scale)
            .translate(-mapState.projection([lon, lat])[0], -mapState.projection([lon, lat])[1]);

        mapState.svg.transition()
            .duration(CONFIG.transitionDuration)
            .ease(d3.easeCubicInOut)
            .call(mapState.zoom.transform, transform);
    }

    function flyToRegion(regionName) {
        const region = CONFIG.regions[regionName];
        if (region) {
            flyTo(region.coords[0], region.coords[1], region.scale / CONFIG.initialScale);
        }
    }

    function resetView() {
        if (!mapState.initialized || !mapState.svg) return;

        mapState.svg.transition()
            .duration(CONFIG.transitionDuration)
            .ease(d3.easeCubicInOut)
            .call(mapState.zoom.transform, d3.zoomIdentity);
    }

    // ============================================
    // INFO PANEL
    // ============================================
    function showInfoPanel(countryName) {
        const stats = mapState.statsData[countryName];
        if (!stats) return;

        const panel = d3.select('#info-panel');
        const flag = countryFlags[countryName] || '🌍';

        let html = `
            <h3>
                <span class="flag">${flag}</span>
                ${countryName}
            </h3>
            <div class="info-stat">
                <div class="info-stat-label">Connected Countries</div>
                <div class="info-stat-value">${stats.num_countries_connected}</div>
            </div>
            <div class="info-stat">
                <div class="info-stat-label">Total Routes</div>
                <div class="info-stat-value">${stats.total_routes.toLocaleString()}</div>
            </div>
            <div class="info-stat">
                <div class="info-stat-label">International Airports</div>
                <div class="info-stat-value">${stats.num_airports}</div>
            </div>
        `;

        if (stats.top_airports && stats.top_airports.length > 0) {
            html += `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(148,163,184,0.2);">
                    <h4 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.5rem;">Major Airports</h4>
                    ${stats.top_airports.slice(0, 3).map(airport => `
                        <div style="margin: 0.5rem 0; padding: 0.4rem; background: rgba(255,255,255,0.03); border-radius: 4px; font-size: 0.8rem;">
                            <div style="color: #f1f5f9; font-weight: 500;">${airport.name.substring(0, 30)}${airport.name.length > 30 ? '...' : ''}</div>
                            <div style="margin-top: 0.2rem; color: #64748b;">
                                <span style="color: #06b6d4; font-weight: 600;">${airport.iata}</span> · 
                                ${airport.destinations} destinations
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        panel.html(html).classed('visible', true);
    }

    // ============================================
    // TOOLTIPS
    // ============================================
    function showTooltip(event, countryName) {
        const stats = mapState.statsData[countryName];
        if (!stats) return;

        const flag = countryFlags[countryName] || '🌍';
        const tooltip = d3.select('#map-tooltip');

        let html = `
            <h3>${flag} ${countryName}</h3>
            <div class="stat">
                <span class="stat-label">Connected to:</span>
                <span class="stat-value">${stats.num_countries_connected} countries</span>
            </div>
            <div class="stat">
                <span class="stat-label">Total routes:</span>
                <span class="stat-value">${stats.total_routes.toLocaleString()}</span>
            </div>
        `;

        if (stats.top_destinations && stats.top_destinations.length > 0) {
            html += `
                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(148,163,184,0.2);">
                    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.4rem;">Top Destinations</div>
                    ${stats.top_destinations.slice(0, 3).map(dest => `
                        <div style="font-size: 0.8rem; color: #94a3b8; padding: 0.2rem 0;">
                            ${dest.country} (${dest.routes} routes)
                        </div>
                    `).join('')}
                </div>
            `;
        }

        tooltip
            .html(html)
            .classed('visible', true)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    function showConnectionTooltip(event, conn) {
        const tooltip = d3.select('#map-tooltip');

        const html = `
            <h3>Route Connection</h3>
            <div class="stat">
                <span class="stat-label">From:</span>
                <span>${conn.source}</span>
            </div>
            <div class="stat">
                <span class="stat-label">To:</span>
                <span>${conn.dest}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Routes:</span>
                <span class="stat-value">${conn.num_routes}</span>
            </div>
        `;

        tooltip
            .html(html)
            .classed('visible', true)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    function hideTooltip() {
        d3.select('#map-tooltip').classed('visible', false);
    }

    // ============================================
    // COUNTRY SELECT DROPDOWN
    // ============================================
    function populateCountrySelect() {
        const select = d3.select('#country-select');
        if (select.empty()) return;

        const countries = Object.keys(mapState.statsData).sort();

        select.selectAll('option.country-option')
            .data(countries)
            .enter()
            .append('option')
            .attr('class', 'country-option')
            .attr('value', d => d)
            .text(d => d);

        select.on('change', function() {
            if (this.value) {
                selectCountry(this.value);
            }
        });
    }

    // ============================================
    // CONTROL BINDINGS
    // ============================================
    function bindControls() {
        // Zoom controls
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const zoomReset = document.getElementById('zoom-reset');
        const resetBtn = document.getElementById('reset-btn');
        const maxRoutes = document.getElementById('max-routes');
        const routesValue = document.getElementById('routes-value');

        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                if (mapState.svg) {
                    mapState.svg.transition().duration(300).call(mapState.zoom.scaleBy, 1.5);
                }
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                if (mapState.svg) {
                    mapState.svg.transition().duration(300).call(mapState.zoom.scaleBy, 0.67);
                }
            });
        }

        if (zoomReset) {
            zoomReset.addEventListener('click', resetView);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                mapState.selectedCountry = null;
                const select = document.getElementById('country-select');
                if (select) select.value = '';
                
                if (mapState.connectionsGroup) {
                    mapState.connectionsGroup.selectAll('*').remove();
                }
                if (mapState.labelsGroup) {
                    mapState.labelsGroup.selectAll('*').remove();
                }
                if (mapState.mapGroup) {
                    mapState.mapGroup.selectAll('.country')
                        .classed('selected', false)
                        .classed('destination', false);
                }
                
                d3.select('#info-panel').classed('visible', false);
                resetView();
            });
        }

        if (maxRoutes && routesValue) {
            // Use both 'input' and 'change' events for better compatibility
            const updateRoutes = function() {
                routesValue.textContent = this.value;
                console.log('📊 Routes slider changed to:', this.value);
                if (mapState.selectedCountry) {
                    selectCountry(mapState.selectedCountry);
                }
            };
            
            maxRoutes.addEventListener('input', updateRoutes);
            maxRoutes.addEventListener('change', updateRoutes);
        }

        // Ranking items click handler
        setupRankingClicks();
        setupGemClicks();
        setupRemoteClicks();
    }

    // ============================================
    // RANKING ITEM CLICKS
    // ============================================
    function setupRankingClicks() {
        const rankingItems = document.querySelectorAll('.ranking-item[data-country]');
        rankingItems.forEach(item => {
            item.addEventListener('click', () => {
                const country = item.dataset.country;
                console.log('📍 Ranking click:', country);
                
                if (country) {
                    // Scroll to map first
                    const mapSection = document.getElementById('global-map-section');
                    if (mapSection) {
                        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Select country after scroll completes (with delay)
                    setTimeout(() => {
                        if (mapState.initialized && mapState.statsData[country]) {
                            console.log('✅ Selecting country:', country);
                            selectCountry(country);
                        } else {
                            console.warn('⚠️ Map not ready or country not found:', country);
                        }
                    }, 800);
                }
            });
        });
    }

    // ============================================
    // GEM CARD CLICKS
    // ============================================
    function setupGemClicks() {
        const gemCards = document.querySelectorAll('.gem-card[data-country]');
        gemCards.forEach(card => {
            card.addEventListener('click', () => {
                const country = card.dataset.country;
                console.log('💎 Gem click:', country);
                
                if (country) {
                    // Scroll to map first
                    const mapSection = document.getElementById('global-map-section');
                    if (mapSection) {
                        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Select country after scroll completes (with delay)
                    setTimeout(() => {
                        if (mapState.initialized && mapState.statsData[country]) {
                            console.log('✅ Selecting country:', country);
                            selectCountry(country);
                        } else {
                            console.warn('⚠️ Map not ready or country not found:', country);
                        }
                    }, 800);
                }
            });
        });
    }

    // ============================================
    // REMOTE ITEM CLICKS
    // ============================================
    function setupRemoteClicks() {
        const remoteItems = document.querySelectorAll('.remote-item[data-country]');
        remoteItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const country = item.dataset.country;
                console.log('🏝️ Remote click:', country);
                
                if (country) {
                    // Scroll to map first
                    const mapSection = document.getElementById('global-map-section');
                    if (mapSection) {
                        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Select country after scroll completes (with delay)
                    setTimeout(() => {
                        if (mapState.initialized && mapState.statsData[country]) {
                            console.log('✅ Selecting country:', country);
                            selectCountry(country);
                        } else {
                            console.warn('⚠️ Map not ready or country not found:', country);
                        }
                    }, 800);
                }
            });
        });
    }

    // ============================================
    // CLEAR SELECTION
    // ============================================
    function clearSelection() {
        mapState.selectedCountry = null;
        
        if (mapState.connectionsGroup) {
            mapState.connectionsGroup.selectAll('*').remove();
        }
        if (mapState.labelsGroup) {
            mapState.labelsGroup.selectAll('*').remove();
        }
        if (mapState.mapGroup) {
            mapState.mapGroup.selectAll('.country')
                .classed('selected', false)
                .classed('destination', false);
        }
        
        d3.select('#info-panel').classed('visible', false);
    }

    // ============================================
    // PUBLIC API
    // ============================================
    window.MapController = {
        init: initMap,
        selectCountry: selectCountry,
        flyTo: flyTo,
        flyToRegion: flyToRegion,
        resetView: resetView,
        clearSelection: clearSelection,
        bindControls: bindControls,
        getState: () => mapState,
        isInitialized: () => mapState.initialized
    };

    // ============================================
    // AUTO-INIT ON DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize main map
        initMap('#d3-map-container');
        
        // Bind control buttons
        bindControls();

        console.log('🎮 Map controller ready');
    });

})();
