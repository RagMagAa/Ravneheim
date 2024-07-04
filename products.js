document.addEventListener('DOMContentLoaded', () => {
    const productGrids = document.querySelectorAll('.product-grid');

    function adjustDividerHeight() {
        productGrids.forEach(grid => {
            const divider = grid.querySelector('.vertical-divider');
            const leftColumn = grid.querySelector('.product-column:first-child');
            const rightColumn = grid.querySelector('.product-column:last-child');
            
            const height = Math.max(leftColumn.offsetHeight, rightColumn.offsetHeight);
            divider.style.height = `${height}px`;
        });
    }

    adjustDividerHeight();
    window.addEventListener('resize', adjustDividerHeight);
});