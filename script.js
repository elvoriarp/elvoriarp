// Configuration
const CONFIG = {
    DISCORD_SERVER_ID: "1426868630058041455", // Remplacez par votre ID
    DISCORD_INVITE_LINK: "https://discord.gg/qgQTWftztY",
    SERVER_IP: "connect.elvoriarp.com",
    SERVER_MAX_PLAYERS: 128,
    DISCORD_WIDGET_THEME: "dark"
};

// État de l'application
const STATE = {
    playersOnline: 0,
    discordStats: {
        members: 0,
        online: 0,
        voice: 0
    },
    notifications: [],
    isMenuOpen: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initParticles();
    initCounters();
    initDiscordWidget();
    initCopyButtons();
    initBackToTop();
    initNotifications();
    initPlayerStats();
    initSmoothScrolling();
    initFormValidation();
});

// Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    const progressBar = document.querySelector('.loader-progress');
    
    // Animation de progression
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                
                // Notification de bienvenue
                showNotification('Bienvenue sur Elvoria RP!', 'Bonne visite sur notre site.', 'success');
            }, 500);
        }
    }, 100);
}

// Navigation
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Menu mobile
    navToggle.addEventListener('click', () => {
        STATE.isMenuOpen = !STATE.isMenuOpen;
        navToggle.classList.toggle('active', STATE.isMenuOpen);
        navMenu.classList.toggle('active', STATE.isMenuOpen);
        document.body.style.overflow = STATE.isMenuOpen ? 'hidden' : '';
    });
    
    // Fermer menu au clic sur lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            STATE.isMenuOpen = false;
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Effets particules
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: 0, y: 0 };
    
    // Redimensionnement
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    // Classe particule
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(0, 212, 255, ${Math.random() * 0.3 + 0.1})`;
            this.originalSize = this.size;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebond sur les bords
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
            
            // Interaction souris
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.size = this.originalSize * 2;
                const force = (100 - distance) / 100;
                this.x -= dx * force * 0.05;
                this.y -= dy * force * 0.05;
            } else {
                this.size = this.originalSize;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Effet glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Création des particules
    function createParticles() {
        particles = [];
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Connexions entre particules
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Événements
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = 0;
        mouse.y = 0;
    });
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
    
    // Initialisation
    resizeCanvas();
    createParticles();
    animate();
}

// Compteurs animés
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 secondes
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Widget Discord
function initDiscordWidget() {
    const discordMembers = document.getElementById('discordMembers');
    const discordOnline = document.getElementById('discordOnline');
    const discordVoice = document.getElementById('discordVoice');
    
    // Fonction pour récupérer les stats Discord
    async function fetchDiscordStats() {
        try {
            // Utilisation du widget Discord officiel
            const response = await fetch(`https://discord.com/api/guilds/${CONFIG.DISCORD_SERVER_ID}/widget.json`);
            
            if (!response.ok) throw new Error('Erreur API Discord');
            
            const data = await response.json();
            
            // Mise à jour des statistiques
            STATE.discordStats = {
                members: data.members ? data.members.length : 0,
                online: data.presence_count || 0,
                voice: data.members ? data.members.filter(m => m.channel_id).length : 0
            };
            
            updateDiscordDisplay();
            
        } catch (error) {
            console.warn('Impossible de récupérer les stats Discord:', error);
            // Données de démonstration
            STATE.discordStats = {
                members: 1420,
                online: 256,
                voice: 42
            };
            updateDiscordDisplay();
        }
    }
    
    // Mise à jour de l'affichage
    function updateDiscordDisplay() {
        if (discordMembers) {
            discordMembers.textContent = STATE.discordStats.members.toLocaleString();
        }
        if (discordOnline) {
            discordOnline.textContent = STATE.discordStats.online.toLocaleString();
        }
        if (discordVoice) {
            discordVoice.textContent = STATE.discordStats.voice.toLocaleString();
        }
        
        // Mise à jour du statut
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            if (STATE.discordStats.online > 100) {
                statusDot.style.background = '#3ba55d'; // Vert
            } else if (STATE.discordStats.online > 50) {
                statusDot.style.background = '#faa81a'; // Jaune
            } else {
                statusDot.style.background = '#ed4245'; // Rouge
            }
        }
    }
    
    // Initialisation et mise à jour périodique
    fetchDiscordStats();
    setInterval(fetchDiscordStats, 60000); // Toutes les minutes
    
    // Redirection Discord
    document.querySelectorAll('.discord-btn').forEach(btn => {
        if (btn.href === '#') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(CONFIG.DISCORD_INVITE_LINK, '_blank');
            });
        }
    });
}

// Boutons de copie
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = btn.getAttribute('data-text') || CONFIG.SERVER_IP;
            
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copié!', `L'adresse ${text} a été copiée dans le presse-papier.`, 'success');
                
                // Animation du bouton
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = '#48bb78';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.color = '';
                }, 2000);
            }).catch(err => {
                showNotification('Erreur', 'Impossible de copier le texte.', 'error');
                console.error('Erreur de copie:', err);
            });
        });
    });
}

// Back to top
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Notifications
function initNotifications() {
    const container = document.getElementById('notificationContainer');
    
    window.showNotification = function(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${title}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        container.appendChild(notification);
        STATE.notifications.push(notification);
        
        // Fermeture automatique
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            removeNotification(notification);
        });
    };
    
    function removeNotification(notification) {
        notification.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = STATE.notifications.indexOf(notification);
            if (index > -1) {
                STATE.notifications.splice(index, 1);
            }
        }, 300);
    }
}

// Statistiques joueurs
function initPlayerStats() {
    const onlineCount = document.getElementById('onlineCount');
    const livePlayers = document.getElementById('livePlayers');
    const playersList = document.getElementById('playersList');
    
    // Simulation de joueurs en ligne (à remplacer par une API réelle)
    function updatePlayerStats() {
        // Nombre aléatoire entre 50 et CONFIG.SERVER_MAX_PLAYERS
        const newCount = Math.floor(Math.random() * (CONFIG.SERVER_MAX_PLAYERS - 50)) + 50;
        STATE.playersOnline = newCount;
        
        // Mise à jour des compteurs
        if (onlineCount) {
            animateCounter(onlineCount, newCount);
        }
        if (livePlayers) {
            livePlayers.textContent = `${newCount}/${CONFIG.SERVER_MAX_PLAYERS}`;
        }
        
        // Mise à jour de la liste des joueurs (simulée)
        if (playersList) {
            updatePlayersList(newCount);
        }
    }
    
    function animateCounter(element, target) {
        const current = parseInt(element.textContent) || 0;
        const diff = target - current;
        const step = diff / 30; // Animation sur 0.5 secondes (30 frames à 60fps)
        let currentValue = current;
        
        const animate = () => {
            currentValue += step;
            if ((step > 0 && currentValue >= target) || (step < 0 && currentValue <= target)) {
                element.textContent = target;
            } else {
                element.textContent = Math.round(currentValue);
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    function updatePlayersList(count) {
        const playerNames = [
            "Alex_RP", "Marc_76", "Sophie_Cop", "Kevin_EMS", "Lucas_Gang",
            "Thomas_Business", "Julie_Journalist", "Paul_Mechanic", "Sarah_Lawyer",
            "David_Taxi", "Emma_Doctor", "Mike_Police", "Laura_Fire", "Chris_Trucker"
        ];
        
        const numPlayers = Math.min(count, 10); // Afficher max 10 joueurs
        let html = '';
        
        for (let i = 0; i < numPlayers; i++) {
            const name = playerNames[Math.floor(Math.random() * playerNames.length)];
            const role = Math.random() > 0.5 ? 'Citoyen' : 'Policier';
            const ping = Math.floor(Math.random() * 50) + 10;
            
            html += `
                <div class="player-item">
                    <div class="player-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="player-info">
                        <span class="player-name">${name}</span>
                        <span class="player-role">${role}</span>
                    </div>
                    <div class="player-ping">${ping}ms</div>
                </div>
            `;
        }
        
        if (count > 10) {
            html += `<div class="player-more">+ ${count - 10} autres joueurs</div>`;
        }
        
        playersList.innerHTML = html;
    }
    
    // Mise à jour initiale et périodique
    updatePlayerStats();
    setInterval(updatePlayerStats, 30000); // Toutes les 30 secondes
}

// Scroll fluide
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Fermer le menu mobile si ouvert
                if (STATE.isMenuOpen) {
                    document.querySelector('.nav-toggle').click();
                }
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Validation des formulaires
function initFormValidation() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Erreur', 'Veuillez entrer une adresse email valide.', 'error');
                emailInput.focus();
                return;
            }
            
            // Simulation d'envoi
            showNotification('Succès', 'Vous êtes maintenant inscrit à la newsletter!', 'success');
            emailInput.value = '';
            
            // Animation du bouton
            const submitBtn = this.querySelector('button');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i>';
            submitBtn.style.background = '#48bb78';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Redirection FiveM
document.addEventListener('click', function(e) {
    if (e.target.closest('[href^="fivem://"]')) {
        e.preventDefault();
        const href = e.target.closest('[href^="fivem://"]').getAttribute('href');
        
        showNotification('Redirection', 'Ouverture de FiveM...', 'info');
        
        // Tentative d'ouverture du lien FiveM
        window.location.href = href;
        
        // Fallback si FiveM n'est pas installé
        setTimeout(() => {
            if (document.hasFocus()) {
                showNotification('Information', 'FiveM n\'est pas installé. Téléchargez-le sur https://fivem.net', 'error');
            }
        }, 1000);
    }
});

// Effets visuels supplémentaires
function initVisualEffects() {
    // Effet de parallaxe
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Effet de hover sur les cartes
    document.querySelectorAll('.stat-card, .feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Effet de typing sur le loader
    const loaderText = document.querySelector('.loader-stats span');
    if (loaderText) {
        const texts = [
            'Chargement des données...',
            'Connexion au serveur...',
            'Préparation des assets...',
            'Presque terminé...'
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            loaderText.textContent = texts[index];
            index = (index + 1) % texts.length;
        }, 800);
        
        // Nettoyer l'intervalle quand le loader disparaît
        setTimeout(() => {
            clearInterval(interval);
        }, 3000);
    }
}

// Initialiser les effets visuels
initVisualEffects();

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}