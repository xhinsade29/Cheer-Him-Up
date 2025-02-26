const messages = {
    dots: [
        "●●● ●● ●●●●",
        "●● ●●● ●●●●●",
        "●●●● ● ●●●",
        "●● ●●●● ●●",
        "●●● ●●●●●",
        "●●● ●● ●●●",
        "●●●● ● ●●",
        "●● ●●● ●●●",
        "●●●● ●● ●●●",
        "● ●●●● ●●●"
    ],
    decoded: [
        "Rise and Shine ☀️",
        "Believe in Yourself 💖",
        "Stay Strong 💪",
        "Act with Confidence 🔥",
        "Know Your Worth 🌟",
        "Think for Yourself 💭",
        "Shine Bright 💡",
        "Break Free 🎭",
        "Your Power is Within 🚀",
        "Unbreakable Spirit 💞"
    ]
};

let lastMessageIndex = -1;

const container = document.getElementById('numberContainer');
for (let i = 1; i <= 10; i++) {
    const button = document.createElement('button');
    button.className = 'number-btn';
    const span = document.createElement('span');
    span.textContent = i;
    button.appendChild(span);
    button.onclick = () => showMessage(i - 1);
    container.appendChild(button);
}

function showMessage(index) {
    lastMessageIndex = index;
    const card = document.getElementById('messageCard');
    document.getElementById('dotCode').textContent = messages.dots[index];
    document.getElementById('decodedMessage').textContent = '';
    document.getElementById('decodedMessage').classList.remove('show');
    document.getElementById('decodeButton').disabled = false;
    card.style.display = 'block';
    requestAnimationFrame(() => {
        card.classList.add('show-card');
    });
}

function decodeMessage() {
    if (lastMessageIndex === -1) return;
    
    const decodedElement = document.getElementById('decodedMessage');
    const loadingDots = document.getElementById('loadingDots');
    const decodeButton = document.getElementById('decodeButton');

    decodedElement.textContent = '';
    decodedElement.classList.remove('show');
    loadingDots.style.display = 'block';
    decodeButton.disabled = true;

    setTimeout(() => {
        loadingDots.style.display = 'none';
        decodedElement.textContent = messages.decoded[lastMessageIndex];
        decodedElement.classList.add('show');
    }, 2000);
}

function closeMessage() {
    const card = document.getElementById('messageCard');
    card.classList.remove('show-card');
    setTimeout(() => {
        card.style.display = 'none';
        randomizeMessages();
    }, 500);
}

function randomizeMessages() {
    for (let i = messages.dots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [messages.dots[i], messages.dots[j]] = [messages.dots[j], messages.dots[i]];
        [messages.decoded[i], messages.decoded[j]] = [messages.decoded[j], messages.decoded[i]];
    }
}