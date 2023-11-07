// FOR TOUCH SCREEN
/*let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
    // Use the first touch point for this gesture
    const touch = event.touches[0];
    touchStartX = touch.clientX;
}

function handleTouchMove(event) {
    // Prevent default behavior for smoother touch actions
    event.preventDefault();
    // Only track one finger
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchEndX = touch.clientX;
    }
}

function handleTouchEnd(event) {
    // Determine swipe direction
    const threshold = 50; // Define what distance is a 'swipe'
    const restraint = 100; // Define the vertical restraint - make it a bit forgiving in vertical direction
    const allowedTime = 500; // Define the maximum time allowed to travel that distance
    const elapsedTime = new Date().getTime() - touchStartTime; // How long did the touch last?

    if (elapsedTime <= allowedTime) {
        let xDist = touchStartX - touchEndX;
        let yDist = touchStartY - touchEndY;
        if (Math.abs(xDist) > threshold && Math.abs(yDist) <= restraint) { // Horizontal move
            if (xDist > 0) {
                // Swipe left
                playerX -= 1; // Adjust accordingly for your game's logic
            } else {
                // Swipe right
                playerX += 1; // Adjust accordingly for your game's logic
            }
        }
    }
}

// Add the event listeners
game.addEventListener('touchstart', handleTouchStart, false);
game.addEventListener('touchmove', handleTouchMove, false);
game.addEventListener('touchend', handleTouchEnd, false);*/