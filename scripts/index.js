 // Create floating hearts background using images
 function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartImages = [
        'resources/lib-hearts/heart1.png',
        'resources/lib-hearts/heart2.png',
        'resources/lib-hearts/heart3.png'
    ];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        const img = document.createElement('img');
        img.src = heartImages[Math.floor(Math.random() * heartImages.length)];
        img.alt = 'Floating heart';
        
        heart.appendChild(img);
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = Math.random() * 20 + 's';
        heartsContainer.appendChild(heart);
    }
}

function openMessage() {
    document.getElementById('loveMessage').style.display = 'block';
    document.getElementById('openBtn').style.display = 'none';
}

function redirectToIndex() {
    window.location.href = 'home.html';
}

// Initialize floating hearts
createFloatingHearts();