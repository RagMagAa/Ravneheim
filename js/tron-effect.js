document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('tron-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Light trail configuration
    const trails = [];
    const maxTrails = 10;
    const trailColors = ['#d4af37', '#a88a36', '#8c7223'];
    
    class Trail {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Start from a random edge of the screen
            const side = Math.floor(Math.random() * 4);
            
            if (side === 0) { // Top
                this.x = Math.random() * canvas.width;
                this.y = 0;
                // Force vertical movement downward
                this.vx = 0;
                this.vy = 1 + Math.random() * 2;
            } else if (side === 1) { // Right
                this.x = canvas.width;
                this.y = Math.random() * canvas.height;
                // Force horizontal movement leftward
                this.vx = -(1 + Math.random() * 2);
                this.vy = 0;
            } else if (side === 2) { // Bottom
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
                // Force vertical movement upward
                this.vx = 0;
                this.vy = -(1 + Math.random() * 2);
            } else { // Left
                this.x = 0;
                this.y = Math.random() * canvas.height;
                // Force horizontal movement rightward
                this.vx = 1 + Math.random() * 2;
                this.vy = 0;
            }
            
            this.width = 2 + Math.random() * 2; // Slightly thinner trails
            this.length = 150 + Math.random() * 250; // Longer trails
            this.color = trailColors[Math.floor(Math.random() * trailColors.length)];
            this.alpha = 0.3 + Math.random() * 0.5; // Slightly higher alpha
            this.history = [];
            this.active = true;
            this.lifeTime = 300 + Math.random() * 400; // Longer lifetime
            this.age = 0;
        }
        
        update() {
            if (!this.active) return;
            
            this.age++;
            if (this.age > this.lifeTime) {
                this.active = false;
                return;
            }
            
            // Add current position to history
            this.history.unshift({ x: this.x, y: this.y });
            
            // Limit history length
            if (this.history.length > this.length) {
                this.history.pop();
            }
            
            // Move
            this.x += this.vx;
            this.y += this.vy;
            
            // Check if out of bounds
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.active = false; // Always reset when hitting edge
            }
            
            // No random direction changes - we want straight lines only
        }
        
        draw() {
            if (!this.active || this.history.length < 2) return;
            
            // Draw the trail
            for (let i = 0; i < this.history.length - 1; i++) {
                const ratio = 1 - i / this.history.length;
                const p1 = this.history[i];
                const p2 = this.history[i + 1];
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = this.alpha * ratio;
                ctx.lineWidth = this.width * ratio;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            
            // Draw the head of the trail
            const head = this.history[0];
            ctx.beginPath();
            ctx.arc(head.x, head.y, this.width, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Initialize trails
    for (let i = 0; i < maxTrails; i++) {
        trails.push(new Trail());
    }
    
    function animate() {
        // Clear canvas completely on each frame to remove "trail of trails" effect
        ctx.fillStyle = '#0a0a0a'; // Solid black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all trails
        trails.forEach(trail => {
            trail.update();
            trail.draw();
            
            // Reset inactive trails
            if (!trail.active) {
                trail.reset();
            }
        });
        
        // Add new trail occasionally
        if (trails.length < maxTrails && Math.random() < 0.01) {
            trails.push(new Trail());
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
});