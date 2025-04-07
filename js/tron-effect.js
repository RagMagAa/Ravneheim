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
            } else if (side === 1) { // Right
                this.x = canvas.width;
                this.y = Math.random() * canvas.height;
            } else if (side === 2) { // Bottom
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
            } else { // Left
                this.x = 0;
                this.y = Math.random() * canvas.height;
            }
            
            // Calculate direction (moving away from the edge)
            let angle;
            if (side === 0) angle = Math.PI / 2;
            else if (side === 1) angle = Math.PI;
            else if (side === 2) angle = 3 * Math.PI / 2;
            else angle = 0;
            
            // Add some randomness to the angle
            angle += (Math.random() - 0.5) * Math.PI / 4;
            
            this.vx = Math.cos(angle) * (1 + Math.random() * 2);
            this.vy = Math.sin(angle) * (1 + Math.random() * 2);
            
            this.width = 2 + Math.random() * 3;
            this.length = 100 + Math.random() * 150;
            this.color = trailColors[Math.floor(Math.random() * trailColors.length)];
            this.alpha = 0.2 + Math.random() * 0.4;
            this.history = [];
            this.active = true;
            this.lifeTime = 200 + Math.random() * 300;
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
                // 30% chance to bounce, 70% chance to reset
                if (Math.random() < 0.3) {
                    // Bounce
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                    
                    // Keep in bounds
                    this.x = Math.max(0, Math.min(this.x, canvas.width));
                    this.y = Math.max(0, Math.min(this.y, canvas.height));
                } else {
                    this.active = false;
                }
            }
            
            // Random direction change occasionally
            if (Math.random() < 0.01) {
                const angle = Math.atan2(this.vy, this.vx);
                const newAngle = angle + (Math.random() - 0.5) * Math.PI / 4;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                this.vx = Math.cos(newAngle) * speed;
                this.vy = Math.sin(newAngle) * speed;
            }
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
        // Clear canvas with slight opacity to create fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
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