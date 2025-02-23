const cardsData = [
    { type: 'dare', content: 'Sing a love song… but like a crying baby! 😭🎤', image: 'resources/baby_crying_sing.gif' },
    { type: 'dare', content: 'Dance like a worm trying to escape from a bird!', image: 'resources/worm_dance.gif' },
    { type: 'dare', content: 'Act like a chicken who just found out it can fly! 🐔✨', image: 'resources/flying_chicken.jpg' },
    { type: 'dare', content: 'Do a slow-motion fight scene with an invisible enemy! 🥋⚔️', image: 'resources/slowmo_fight.jpg' },
    { type: 'dare', content: 'Do the alien dance until your next turn! 👽🛸', image: 'resources/alien_dance.gif' },
    { type: 'dare', content: 'Pretend you are a lost tourist asking for directions… in gibberish! 🗺️🤣', image: 'resources/lost_tourist1.jpg' },
    { type: 'dare', content: 'Try to sell an invisible product like a TV commercial! 📺😂', image: 'resources/salesman.jpg' },
    { type: 'dare', content: 'Mimic the person on your right for the next 2 minutes! 🪞😆', image: 'resources/mirror_mimic.jpg' },
    { type: 'dare', content: 'Tell a joke, but whisper it like it’s a top-secret mission! 🤫', image: 'resources/whisper_joke.jpg' },
    { type: 'dare', content: 'Pretend you’re on a cooking show and explain how to make "Invisible Soup"! 🍲👻', image: 'resources/cooking_show.jpg' },
    { type: 'dare', content: 'Do 5 jumping jacks while laughing like an evil villain! 😈😂', image: 'resources/evil_laugh.gif' },
    { type: 'dare', content: 'Act like you just saw a ghost but can’t scream! 👻😱', image: 'resources/scared_silent.jpg' },
    { type: 'dare', content: 'Hug the nearest object and say, "I will never let go!" 🛟💔', image: 'resources/never_let_go.gif' },
    { type: 'dare', content: 'Try to make the person next to you laugh within 10 seconds using only your face! 🤪', image: 'resources/funny_face.gif' },
    { type: 'dare', content: 'Pretend you’re a cat stuck in a tree and need help! 🐱🌳', image: 'resources/cat_stuck.jpg' }
];

function shuffleCards() {
    return cardsData.sort(() => Math.random() - 0.5);
}

function createCard(content, type, image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.onclick = () => openModal(content, type, image); // Pass image here
    return card;
}

function openModal(content, type, image) {
    const modal = document.getElementById('scratchModal');
    const modalCard = document.getElementById('modalCard');
    modalCard.innerHTML = ''; // Clear previous content

    const hiddenContent = document.createElement('div');
    hiddenContent.style.display = 'none';

    if (image) { // Display image if available
        const img = document.createElement('img');
        img.src = image;
        img.style.width = '100%';
        hiddenContent.appendChild(img);
    }

    // Always show text content
    const text = document.createElement('p');
    text.innerText = content;
    hiddenContent.appendChild(text);

    modalCard.appendChild(hiddenContent);
    initScratchEffect(modalCard, hiddenContent);
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('scratchModal').style.display = 'none';
}

function initScratchEffect(container, hiddenContent) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 280;
    canvas.height = 360;
    container.appendChild(canvas);

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isScratching = false;

    function scratch(event) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
        const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        createSparkEffect(x, y, container);
        checkScratchCompletion(ctx, canvas, hiddenContent);
    }

    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', (e) => isScratching && scratch(e));
    canvas.addEventListener('touchstart', () => isScratching = true);
    canvas.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', (e) => isScratching && scratch(e));
}

function createSparkEffect(x, y, container) {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 500);
}

function checkScratchCompletion(ctx, canvas, hiddenContent) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearedPixels = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] === 0) clearedPixels++;
    }

    if (clearedPixels > (canvas.width * canvas.height) * 0.5) {
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
            hiddenContent.style.display = 'block';
            triggerConfetti();
            shuffleCards();
            resetGame();
        }, 300);
    }
}

function triggerConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
}

function resetGame() {
    document.getElementById('cardContainer').innerHTML = '';
    shuffleCards().forEach(cardData => {
        document.getElementById('cardContainer').appendChild(
            createCard(cardData.content, cardData.type, cardData.image)
        );
    });
}

window.onload = function () {
    document.getElementById('cardContainer').innerHTML = '';
    shuffleCards().forEach(cardData => {
        document.getElementById('cardContainer').appendChild(
            createCard(cardData.content, cardData.type, cardData.image)
        );
    });
};
