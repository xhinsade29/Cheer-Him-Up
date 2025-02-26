const cardsData = [
    { type: 'dare', content: 'Sing a love song… but like a crying baby! 😭🎤', image: '../resources/lib-scratch/baby_crying_sing.gif' },
    { type: 'dare', content: 'Dance like a worm trying to escape from a bird!', image: '../resources/lib-scratch/worm_dance.gif' },
    { type: 'dare', content: 'Act like a chicken who just found out it can fly! 🐔✨', image: '../resources/lib-scratch/flying_chicken.jpg' },
    { type: 'dare', content: 'Do a slow-motion fight scene with an invisible enemy! 🥋⚔️', image: '../resources/lib-scratch/slowmo_fight.jpg' },
    { type: 'dare', content: 'Do the alien dance until your next turn! 👽🛸', image: '../resources/lib-scratch/alien_dance.gif' },
    { type: 'dare', content: 'Pretend you are a lost tourist asking for directions… in gibberish! 🗺️🤣', image: '../resources/lib-scratch/lost_tourist1.jpg' },
    { type: 'dare', content: 'Try to sell an invisible product like a TV commercial! 📺😂', image: '../resources/lib-scratch/salesman.jpg' },
    { type: 'dare', content: 'Mimic the person on your right for the next 2 minutes! 🪞😆', image: '../resources/lib-scratch/mirror_mimic.jpg' },
    { type: 'dare', content: 'Tell a joke, but whisper it like its a top-secret mission! 🤫', image: '../resources/lib-scratch/whisper_joke.jpg' },
    { type: 'dare', content: 'Pretend youre on a cooking show and explain how to make Invisible Soup ! 🍲👻', image: '../resources/lib-scratch/cooking_show.jpg' },
    { type: 'dare', content: 'Do 5 jumping jacks while laughing like an evil villain! 😈😂', image: '../resources/lib-scratch/evil_laugh.gif' },
    { type: 'dare', content: 'Hug the nearest object and say, "I will never let go!" 🛟💔', image: '../resources/lib-scratch/never_let_go.gif' },
    { type: 'dare', content: 'Try to make the person next to you laugh within 10 seconds using only your face! 🤪', image: '../resources/lib-scratch/funny_face.gif' },
    { type: 'dare', content: 'Pretend youre a cat stuck in a tree and need help! 🐱🌳', image: '../resources/lib-scratch/cat_stuck.jpg' }
];

// Sound effects
const scratchSound = new Audio('././resources/music-effects/scratch.mp3'); // Add a scratch sound file
const revealSound = new Audio('././resources/music-effects/reveal.mp3'); // Add a reveal sound file
const confettiSound = new Audio('././resources/music-effects/confetti.mp3'); // Add a confetti sound file
const scoreSound = new Audio('././resources/music-effects/score.mp3'); // Add a score sound file

// Adjust scratch sound to be shorter
scratchSound.volume = 0.3;

let currentCards = [];

function shuffleCards() {
    return [...cardsData].sort(() => Math.random() - 0.5);
}

function createCard(content, type, image, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    
    // Add a slight random rotation to each card
    const randomRotation = Math.random() * 6 - 3;
    card.style.transform = `rotate(${randomRotation}deg)`;
    
    // Add animation delay based on index
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.onclick = () => openModal(content, type, image);
    return card;
}

function openModal(content, type, image) {
    const modal = document.getElementById('scratchModal');
    const modalCard = document.getElementById('modalCard');
    modalCard.innerHTML = '';

    const hiddenContent = document.createElement('div');
    hiddenContent.style.display = 'none';
    hiddenContent.classList.add('hidden-content');

    if (image) {
        const img = document.createElement('img');
        img.src = image;
        img.style.width = '100%';
        
        // Add error handling for missing images
        img.onerror = () => {
            console.error(`Failed to load image: ${image}`);
            img.src = '../resources/bg.png'; // Fallback image
        };
        
        // Add loading indicator
        img.onload = () => {
            console.log(`Successfully loaded image: ${image}`);
        };
        
        hiddenContent.appendChild(img);
    }

    // Always show text content
    const text = document.createElement('p');
    text.innerText = content;
    hiddenContent.appendChild(text);

    modalCard.appendChild(hiddenContent);
    initScratchEffect(modalCard, hiddenContent);
    
    // Add animation class
    modal.classList.add('modal-opening');
    modal.style.display = 'flex';
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('scratchModal');
    modal.classList.add('modal-closing');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('modal-opening', 'modal-closing');
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    }, 300);
}

function initScratchEffect(container, hiddenContent) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    // Create a pattern for the scratch surface
    const scratchPattern = document.createElement('canvas');
    const patternCtx = scratchPattern.getContext('2d');
    scratchPattern.width = 50;
    scratchPattern.height = 50;
    
    // Draw a pattern
    patternCtx.fillStyle = '#a0a0a0';
    patternCtx.fillRect(0, 0, 50, 50);
    patternCtx.fillStyle = '#b3b3b3';
    patternCtx.fillRect(0, 0, 25, 25);
    patternCtx.fillRect(25, 25, 25, 25);
    
    const pattern = ctx.createPattern(scratchPattern, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a ? symbol or "Scratch me!" text on the card
    ctx.font = 'bold 40px Fredoka One, cursive';
    ctx.fillStyle = '#ff4d6d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH!', canvas.width/2, canvas.height/2);

    let isScratching = false;
    let lastX = 0;
    let lastY = 0;
    let scratchAreaCovered = 0;

    function scratch(event) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
        const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
        
        // Play sound effect if just started scratching
        if (!isScratching) {
            scratchSound.currentTime = 0;
            scratchSound.play();
        }
        
        // Create a more dynamic scratch effect with varying sizes based on speed
        const distanceFromLast = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        const brushSize = Math.min(Math.max(15, distanceFromLast * 1.5), 35);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        
        // Draw a line from last position to current position for continuous scratching
        if (lastX && lastY && distanceFromLast < 50) {
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.arc(x, y, brushSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        lastX = x;
        lastY = y;
        
        // Create multiple sparks for a more dramatic effect
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            createSparkEffect(x + offsetX, y + offsetY, container);
        }
        
        checkScratchCompletion(ctx, canvas, hiddenContent);
    }

    // Reset on pointer up
    function endScratch() {
        isScratching = false;
        lastX = 0;
        lastY = 0;
        scratchSound.pause();
    }

    canvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        scratch(e);
    });
    canvas.addEventListener('mouseup', endScratch);
    canvas.addEventListener('mouseleave', endScratch);
    canvas.addEventListener('mousemove', (e) => isScratching && scratch(e));
    
    canvas.addEventListener('touchstart', (e) => {
        isScratching = true;
        scratch(e);
    });
    canvas.addEventListener('touchend', endScratch);
    canvas.addEventListener('touchcancel', endScratch);
    canvas.addEventListener('touchmove', (e) => isScratching && scratch(e));
}

function createSparkEffect(x, y, container) {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    
    // Randomize spark size
    const size = 20 + Math.random() * 30;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 500);
}

function checkScratchCompletion() {
    if (scratchCanvas.width === 0 || scratchCanvas.height === 0) {
        console.error("Canvas has invalid dimensions. Skipping image check.");
        return;
    }

    const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imageData.data;
    let cleared = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) cleared++;
    }

    const approxClearedPercentage = cleared / (totalPixels / 4);

    if (approxClearedPercentage > 0.3) {
        revealCard();
    }
}



function triggerConfetti() {
    // Play confetti sound
    confettiSound.play();
    
    // Create multiple confetti elements for a fuller effect
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    document.body.appendChild(confetti);
    
    // Add some actual confetti pieces
    for (let i = 0; i < 100; i++) {
        createConfettiPiece();
    }
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

function createConfettiPiece() {
    const colors = ['#ff4d6d', '#ff758c', '#ffb3c1', '#ffcdd2', '#ffffff'];
    const confettiPiece = document.createElement('div');
    const size = Math.random() * 10 + 5;
    
    confettiPiece.style.position = 'fixed';
    confettiPiece.style.width = `${size}px`;
    confettiPiece.style.height = `${size}px`;
    confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confettiPiece.style.top = '-20px';
    confettiPiece.style.left = `${Math.random() * 100}vw`;
    confettiPiece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confettiPiece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiPiece.style.zIndex = '1000';
    confettiPiece.style.pointerEvents = 'none';
    
    // Random animation duration and delay
    const duration = Math.random() * 3 + 1;
    const delay = Math.random() * 0.5;
    
    confettiPiece.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
    
    document.body.appendChild(confettiPiece);
    
    setTimeout(() => {
        confettiPiece.remove();
    }, (duration + delay) * 1000);
}

function resetGame() {
    document.getElementById('cardContainer').innerHTML = '';
    currentCards = shuffleCards();
    
    currentCards.forEach((cardData, index) => {
        document.getElementById('cardContainer').appendChild(
            createCard(cardData.content, cardData.type, cardData.image, index)
        );
    });
}

// Add confetti piece styles
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    .confetti-piece {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #ff4d6d;
        animation: confettiFall 2s linear forwards;
    }
`;
document.head.appendChild(confettiStyles);

// Initialize sound effects
function initSoundEffects() {
    scratchSound.src = 'resources/sounds/scratch.mp3';
    revealSound.src = 'resources/sounds/reveal.mp3';
    confettiSound.src = 'resources/sounds/confetti.mp3';
    scoreSound.src = 'resources/sounds/score.mp3';

    // Preload sounds
    [scratchSound, revealSound, confettiSound, scoreSound].forEach(sound => {
        sound.load();
        sound.volume = 0.3;
    });
}

// Add theme toggle functionality
const themeToggle = document.createElement('div');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<div class="theme-icon">🌙</div>';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Add dark mode styles
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
    body.dark-mode {
        background: linear-gradient(135deg, #2c1338, #1a0f24);
    }
    
    body.dark-mode .card {
        background: linear-gradient(135deg, #3a1f47, #2c1338);
    }
    
    body.dark-mode .modal-content {
        background: linear-gradient(135deg, #3a1f47, #2c1338);
        color: white;
    }
    
    body.dark-mode #modalCard p {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    body.dark-mode .difficulty-btn {
        background: rgba(255, 255, 255, 0.1);
    }
    
    body.dark-mode .difficulty-btn:hover,
    body.dark-mode .difficulty-btn.active {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(darkModeStyles);

// Initialize the game with sound effects
window.addEventListener('load', () => {
    initSoundEffects();
    resetGame();
    
    // Save theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
});

// Save theme preference when changed
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

window.onload = function () {
    // Define custom animation for confetti pieces
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes flashTitle {
            0%, 100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
            50% { text-shadow: 0 0 20px rgba(255, 77, 109, 0.8); }
        }
        
        h1 {
            animation: flashTitle 3s infinite;
        }
        
        .modal-opening {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        .modal-closing {
            animation: fadeOut 0.3s ease-in-out;
        }
        
        @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Load sounds
    if (!scratchSound.src) {
        // If sound file doesn't exist, create a placeholder
        console.log("Sound files not found. Game will run without sound effects.");
    }
    
    resetGame();
    
        // Add mobile touch instructions
        const instructions = document.createElement('p');
        instructions.className = 'touch-instructions';
        instructions.innerHTML = '📱 Scratch the card with your finger to reveal the dare!';
        instructions.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.9rem;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;
        document.body.appendChild(instructions);
    
        // Show instructions only on touch devices
        if ('ontouchstart' in window) {
            instructions.style.opacity = '1';
            setTimeout(() => {
                instructions.style.opacity = '0';
                setTimeout(() => instructions.remove(), 300);
            }, 3000);
        }
    
        // Add sound toggle button
        const soundToggle = document.createElement('div');
        soundToggle.className = 'sound-toggle';
        soundToggle.innerHTML = '<div class="sound-icon">🔊</div>';
        soundToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(soundToggle);
    
        let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        updateSoundIcon();
    
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('soundEnabled', soundEnabled);
            updateSoundIcon();
            
            // Update all audio elements
            [scratchSound, revealSound, confettiSound, scoreSound].forEach(sound => {
                sound.muted = !soundEnabled;
            });
        });
    
        function updateSoundIcon() {
            const icon = soundToggle.querySelector('.sound-icon');
            icon.textContent = soundEnabled ? '🔊' : '🔇';
            soundToggle.style.background = soundEnabled ? 
                'rgba(255, 255, 255, 0.2)' : 'rgba(255, 77, 109, 0.2)';
        }
    
        // Add score persistence
        let highScore = parseInt(localStorage.getItem('highScore')) || 0;
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'high-score';
        scoreDisplay.innerHTML = `High Score: ${highScore}`;
        scoreDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 0.9rem;
        `;
        document.body.appendChild(scoreDisplay);
    
        // Update high score when current score changes
        function updateHighScore() {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                scoreDisplay.innerHTML = `High Score: ${highScore}`;
                
                // Add celebration effect
                scoreDisplay.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    scoreDisplay.style.animation = '';
                }, 500);
            }
        }
    
        // Add pulse animation for high score
        const pulseAnimation = document.createElement('style');
        pulseAnimation.textContent = `
            @keyframes pulse {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.2); }
                100% { transform: translateX(-50%) scale(1); }
            }
        `;
        document.head.appendChild(pulseAnimation);
    
        // Initialize sounds with current mute state
        [scratchSound, revealSound, confettiSound, scoreSound].forEach(sound => {
            sound.muted = !soundEnabled;
        });
    };

    // Add at the start of scratch.js
window.addEventListener('load', () => {
    console.log('Document location:', document.location.href);
    console.log('Checking image paths...');
    cardsData.forEach(card => {
        const img = new Image();
        img.onload = () => console.log(`✅ Image loaded: ${card.image}`);
        img.onerror = () => console.log(`❌ Image failed: ${card.image}`);
        img.src = card.image;
    });
});


function initializeCanvas() {
    scratchCanvas.width = 300;
    scratchCanvas.height = 200;

    // Ensure the canvas has valid dimensions before drawing
    if (scratchCanvas.width === 0 || scratchCanvas.height === 0) {
        console.error("Canvas dimensions are invalid!");
        return;
    }

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    totalPixels = scratchCanvas.width * scratchCanvas.height;
}
