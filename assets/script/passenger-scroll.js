/**
 * PASSENGER SCROLL - GSAP ScrollTrigger Animations
 * =================================================
 * Handles all scroll-based animations and transitions
 * Do not touch please!
 * Version 1.12 (yes, 12 iterations so far!)
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        animationDuration: 0.8,
        staggerDelay: 0.15,
        scrubAmount: 0.5
    };

    // ============================================
    // INITIALIZE GSAP
    // ============================================
    function initScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        console.log('🎬 Initializing scroll animations...');

        // Setup all animations
        setupProgressBar();
        setupHeroAnimations();
        setupCardAnimations();
        setupScreenAnimations();
        setupStatCounters();
        setupFinaleAnimations();
        setupParallaxEffects();

        console.log('✅ Scroll animations initialized');
    }

    // ============================================
    // PROGRESS BAR
    // ============================================
    function setupProgressBar() {
        gsap.to('.progress-bar', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }

    // ============================================
    // HERO WINDOW ANIMATIONS
    // ============================================
    function setupHeroAnimations() {
        const heroWindow = document.querySelector('#hero-window');
        if (!heroWindow) return;

        // Parallax effect on clouds
        gsap.to('.cloud-1', {
            y: -50,
            scrollTrigger: {
                trigger: '#hero-window',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        gsap.to('.cloud-2', {
            y: -30,
            scrollTrigger: {
                trigger: '#hero-window',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Fade out hero content on scroll
        gsap.to('.window-content', {
            opacity: 0,
            y: -30,
            scrollTrigger: {
                trigger: '#hero-window',
                start: 'center center',
                end: 'bottom top',
                scrub: true
            }
        });

        // Fade out scroll indicator
        gsap.to('.scroll-indicator', {
            opacity: 0,
            scrollTrigger: {
                trigger: '#hero-window',
                start: 'top top',
                end: '+=200',
                scrub: true
            }
        });

        // Scale down window on exit
        gsap.to('#hero-window .airplane-window', {
            scale: 0.9,
            opacity: 0.5,
            scrollTrigger: {
                trigger: '#hero-window',
                start: 'center center',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ============================================
    // GLASS CARD ANIMATIONS
    // ============================================
    function setupCardAnimations() {
        const cards = document.querySelectorAll('.glass-card');

        cards.forEach((card, index) => {
            // Initial state
            gsap.set(card, {
                opacity: 0,
                y: 40
            });

            // Animate in when scrolled into view
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: CONFIG.animationDuration,
                        ease: 'power2.out'
                    });
                    card.classList.add('animate-in');
                }
            });
        });

        // Special handling for findings grid
        const findingCards = document.querySelectorAll('.finding-card');
        findingCards.forEach((card, index) => {
            gsap.set(card, {
                opacity: 0,
                y: 30
            });

            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: CONFIG.animationDuration,
                        delay: index * CONFIG.staggerDelay,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // ============================================
    // SEAT SCREEN ANIMATIONS
    // ============================================
    function setupScreenAnimations() {
        const screens = document.querySelectorAll('.seat-screen');

        screens.forEach((screen) => {
            // Initial state
            gsap.set(screen, {
                opacity: 0,
                scale: 0.95
            });

            // Animate in
            ScrollTrigger.create({
                trigger: screen,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(screen, {
                        opacity: 1,
                        scale: 1,
                        duration: CONFIG.animationDuration,
                        ease: 'power2.out'
                    });
                    screen.classList.add('animate-in');

                    // Check for auto-select country
                    const autoSelect = screen.dataset.autoSelect;
                    if (autoSelect && window.MapController && window.MapController.isInitialized()) {
                        setTimeout(() => {
                            // Only select if this is a regional view
                            if (screen.querySelector('.regional-map')) {
                                // For regional maps, we might want to show a static view
                                // or trigger a selection on the main map
                            }
                        }, 500);
                    }
                }
            });
        });
    }

    // ============================================
    // STAT COUNTER ANIMATIONS
    // ============================================
    function setupStatCounters() {
        const statValues = document.querySelectorAll('.stat-value[data-count]');

        statValues.forEach((stat) => {
            const target = parseInt(stat.dataset.count);
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    animateCounter(stat, target);
                }
            });
        });
    }

    function animateCounter(element, target) {
        const duration = 2;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            
            const current = Math.round(startValue + (target - startValue) * eased);
            
            if (target >= 1000) {
                element.textContent = current.toLocaleString();
            } else {
                element.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure final value is exact
                element.textContent = target >= 1000 ? target.toLocaleString() : target;
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // DESTINATION BAR ANIMATIONS
    // ============================================
    function setupDestinationBars() {
        const bars = document.querySelectorAll('.dest-bar-fill');

        bars.forEach((bar) => {
            const targetWidth = bar.style.width;
            gsap.set(bar, { width: 0 });

            ScrollTrigger.create({
                trigger: bar,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(bar, {
                        width: targetWidth,
                        duration: 1.2,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // ============================================
    // FINALE WINDOW ANIMATIONS
    // ============================================
    function setupFinaleAnimations() {
        const finale = document.querySelector('#finale-window');
        if (!finale) return;

        // Fade in finale content
        gsap.set('#finale-window .finale-content', {
            opacity: 0,
            y: 30
        });

        gsap.set('#finale-window .credits', {
            opacity: 0,
            y: 20
        });

        gsap.set('#finale-window .wing-tip', {
            opacity: 0,
            x: 30
        });

        ScrollTrigger.create({
            trigger: '#finale-window',
            start: 'top 60%',
            onEnter: () => {
                // Animate content
                gsap.to('#finale-window .finale-content', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out'
                });

                // Animate credits with delay
                gsap.to('#finale-window .credits', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.5,
                    ease: 'power2.out'
                });

                // Animate wing
                gsap.to('#finale-window .wing-tip', {
                    opacity: 1,
                    x: 0,
                    duration: 1.5,
                    delay: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    function setupParallaxEffects() {
        // Subtle parallax on section backgrounds
        const sections = document.querySelectorAll('.viz-section');

        sections.forEach((section) => {
            const card = section.querySelector('.glass-card');
            if (!card) return;

            // Slight upward movement on scroll
            gsap.to(card, {
                y: -20,
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ============================================
    // DATA LINKS HOVER EFFECTS
    // ============================================
    function setupDataLinks() {
        const links = document.querySelectorAll('.data-link');

        links.forEach((link) => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    }

    // ============================================
    // SCENE-BASED MAP NAVIGATION
    // ============================================
    function setupSceneNavigation() {
        const scenes = document.querySelectorAll('[data-scene]');

        scenes.forEach((scene) => {
            const sceneName = scene.dataset.scene;

            ScrollTrigger.create({
                trigger: scene,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => handleSceneEnter(sceneName),
                onEnterBack: () => handleSceneEnter(sceneName)
            });
        });
    }

    function handleSceneEnter(sceneName) {
        if (!window.MapController || !window.MapController.isInitialized()) return;

        // Map scene names to map actions
        const sceneActions = {
            'global': () => {
                window.MapController.clearSelection();
                window.MapController.resetView();
            },
            'usa': () => {
                window.MapController.flyToRegion('usa');
            },
            'europe': () => {
                window.MapController.flyToRegion('europe');
            },
            'middleeast': () => {
                window.MapController.flyToRegion('middleeast');
            },
            'asia': () => {
                window.MapController.flyToRegion('asia');
            }
        };

        const action = sceneActions[sceneName];
        if (action) {
            action();
        }
    }

    // ============================================
    // RESPONSIVE HANDLING
    // ============================================
    function handleResponsive() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Simplify animations for mobile
            ScrollTrigger.config({
                limitCallbacks: true,
                syncInterval: 150
            });

            console.log('📱 Mobile mode: simplified animations');
        }
    }

    // ============================================
    // REFRESH ON RESIZE
    // ============================================
    function setupResizeHandler() {
        let resizeTimeout;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
                handleResponsive();
            }, 250);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: target,
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    }

    // ============================================
    // INITIALIZE ON DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure all elements are ready
        setTimeout(() => {
            initScrollAnimations();
            setupDestinationBars();
            setupDataLinks();
            setupResizeHandler();
            handleResponsive();
            
            // Setup scene navigation after map is ready
            setTimeout(() => {
                setupSceneNavigation();
            }, 1000);

        }, 100);
    });

    // ============================================
    // PUBLIC API
    // ============================================
    window.PassengerScroll = {
        refresh: () => ScrollTrigger.refresh(),
        scrollTo: (target) => {
            gsap.to(window, {
                duration: 1,
                scrollTo: target,
                ease: 'power2.inOut'
            });
        }
    };

})();
