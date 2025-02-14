const cardsData = [
    { type: 'dare', content: 'Sing a song!' },
    { type: 'dare', content: 'Dance for 30 seconds!' },
    { type: 'dare', content: 'Do 10 push-ups!' },
    { type: 'image', content: 'images/image1.jpg' },
    { type: 'image', content: 'images/image2.jpg' },
    { type: 'audio', content: 'audio/audio1.mp3' },
    { type: 'audio', content: 'audio/audio2.mp3' },
    { type: 'dare', content: 'Tell a joke!' },
    { type: 'dare', content: 'Mimic your favorite actor!' },
    { type: 'image', content: 'images/image3.jpg' },
    { type: 'image', content: 'images/image3.jpg' },
    { type: 'image', content: 'images/image3.jpg' },
    { type: 'audio', content: 'audio/audio3.mp3' },
    { type: 'dare', content: 'Do 5 jumping jacks!' }
];

function shuffleCards() {
    return cardsData.sort(() => Math.random() - 0.5);
}

function createCard(content, type) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.onclick = () => openModal(content, type);
    return card;
}

function openModal(content, type) {
    const modal = document.getElementById('scratchModal');
    const modalCard = document.getElementById('modalCard');
    modalCard.innerHTML = '';

    const hiddenContent = document.createElement('div');
    hiddenContent.style.display = 'none';

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = content;
        img.style.width = '100%';
        hiddenContent.appendChild(img);
    } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = content;
        hiddenContent.appendChild(audio);
    } else {
        hiddenContent.textContent = content;
    }

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
        document.getElementById('cardContainer').appendChild(createCard(cardData.content, cardData.type));
    });
}

window.onload = function () {
    document.getElementById('cardContainer').innerHTML = '';
    shuffleCards().forEach(cardData => {
        document.getElementById('cardContainer').appendChild(createCard(cardData.content, cardData.type));
    });
};


function goToHome() {
    window.location.href = 'index.html';
}
