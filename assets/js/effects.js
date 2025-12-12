
/**
 * Particle Network Animation for Hero Section
 */
class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();

        // Config
        this.config = {
            particleColor: 'rgba(15, 23, 42, 0.1)', // #0f172a with low opacity
            lineColor: 'rgba(15, 23, 42, 0.05)',
            particleAmount: 40, // Number of particles
            defaultSpeed: 0.5,
            variantSpeed: 1,
            linkRadius: 150 // Distance to connect particles
        };

        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.w = this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.h = this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.config.particleAmount; i++) {
            this.addParticle();
        }
    }

    addParticle() {
        this.particles.push({
            x: Math.random() * this.w,
            y: Math.random() * this.h,
            vx: (Math.random() - 0.5) * this.config.defaultSpeed,
            vy: (Math.random() - 0.5) * this.config.defaultSpeed,
            size: Math.random() * 2 + 1
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // Update and draw particles
        this.particles.forEach((p, index) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.w) p.vx *= -1;
            if (p.y < 0 || p.y > this.h) p.vy *= -1;

            // Draw Particle
            this.ctx.beginPath();
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw Connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

                if (dist < this.config.linkRadius) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.config.lineColor;
                    this.ctx.lineWidth = 1 - dist / this.config.linkRadius;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * TypeWriter Effect for Taglines
 */
class TypeWriter {
    constructor(elementInfoKey, loop = false) {
        this.el = document.querySelector(`[data-i18n="${elementInfoKey}"]`);
        this.key = elementInfoKey;
        this.loop = loop;
        this.txt = '';
        this.isDeleting = false;
        this.loopNum = 0;
        this.typingSpeed = 100; // Base speed
        if (this.el) {
            // Store original text as the first "to-type" string if needed, 
            // but here we rely on the contentData to get the strings based on lang
            // We'll init by just adding the cursor class
            this.el.classList.add('typing-cursor');
            // Start loop
            this.tick();
        }
    }

    tick() {
        if (!this.el || typeof window.contentData === 'undefined') return;

        // Get current text content target based on language
        let currentLang = localStorage.getItem('selectedLanguage') || 'en';
        // Resolve nested keys? For simplicity, assuming main keys or specific known structure
        // For 'hero_tagline', contentData.personal.tagline[lang]
        // But `data-i18n` logic in main.js usually handles static text. 
        // We want to override that for the effect.

        let fullTxt = '';
        const data = window.contentData;

        // Map common keys to data paths
        if (this.key === 'hero_tagline') fullTxt = data.personal.tagline[currentLang];
        else if (this.key === 'hero_description') fullTxt = data.personal.description[currentLang];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.textContent = this.txt;

        let delta = 150 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = 2000; // Pause at end
            if (this.loop) this.isDeleting = true;
            else {
                // Remove cursor if done? Or keep blinking
                // this.el.classList.remove('typing-cursor'); 
                return; // Stop if not looping
            }
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => this.tick(), delta);
    }
}
