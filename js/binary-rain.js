document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('binary-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Binary rain configuration
    const columns = Math.floor(canvas.width / 20); // Adjust spacing between columns
    const drops = [];
    
    // Initialize drops array
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height); // Start drops at random negative positions
    }
    
    // Gold color variations for binary digits
    const goldColors = [
        '#d4af37', // Base gold
        '#d4af37dd', // Gold with transparency
        '#b38728', // Darker gold
        '#e6c456', // Lighter gold
        '#a8892b' // Bronze-gold
    ];
    
    // Binary characters to display (just 0 and 1)
    const binaryChars = ['0', '1'];
    
    function draw() {
        // Semi-transparent black background to create trails
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw binary rain
        for (let i = 0; i < drops.length; i++) {
            // Choose a random binary character
            const binaryChar = binaryChars[Math.floor(Math.random() * binaryChars.length)];
            
            // Choose a gold color variation
            const goldColor = goldColors[Math.floor(Math.random() * goldColors.length)];
            
            // Vary character size slightly
            const fontSize = 14 + Math.floor(Math.random() * 8); // 14-22px
            ctx.font = `${fontSize}px monospace`;
            
            // Add glow effect
            ctx.shadowColor = '#d4af37';
            ctx.shadowBlur = 5 + Math.random() * 10;
            
            // Vary the opacity to create depth
            ctx.fillStyle = goldColor;
            
            // Draw the character
            const x = i * 20;
            const y = drops[i] * 20;
            
            // Only draw if in view
            if (y > 0 && y < canvas.height) {
                ctx.fillText(binaryChar, x, y);
            }
            
            // Reset shadow for next iteration
            ctx.shadowBlur = 0;
            
            // Move the raindrop down
            drops[i]++;
            
            // Randomize reset position
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = -1; // Reset to just above the top
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
});