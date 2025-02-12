// Array of flirty messages in English, Tagalog, and Bisaya
const messages = [
    "Pwede ra kayko ma brader, kung ikaw ang hinugdan! 📚❤️",
    "Bahalag way tug, basta ikaw ang rason. 😘",
    "Gimingaw nako nimo ug ayo! 😆❤️",
    "Unsaon mani nakong jacket , kung ikaw akong gustoka ka cuddle? 😍",
    "Murag cellphone akong kinabuhi... Kay ikaw akong signal! 📶💖",
    "Mura kag kapi, kay di kompleto akong adlaw kung wa ka! ☕❤️",
    "Kung ang gugma sakit, willing ko masakitan basta ikaw akong rason. 💔💘",
    "Di nako kinahanglang aircon kay bugnaw na kaayo akong dughan basta naa ka. 🥶❤️",
    "Okey rako mahulog, pero sa imong smile lang🤗",
    "Tinuod ba nga wala pay forever? Pwede ta maghimo ug forever para sa atong duha? 💑"
];


function createHeart() {
    const heart = document.createElement("span");
    heart.innerHTML = "❤️";
    heart.classList.add("heart");
    document.body.appendChild(heart);

    let size = Math.random() * 30 + 30; // Random size between 30px to 60px
    heart.style.fontSize = size + "px";

    let startX = Math.random() * window.innerWidth * 0.8; // Random start position
    let endX = startX + (Math.random() * 200 - 100); // Slight random drift
    let startY = window.innerHeight + 50;
    let endY = -50;

    heart.style.left = startX + "px";
    heart.style.top = startY + "px";

    gsap.to(heart, {
        x: endX - startX,
        y: endY - startY,
        duration: Math.random() * 6 + 4, // Slower float (6 to 10 seconds)
        opacity: 0,
        ease: "power1.inOut",
        onComplete: () => heart.remove()
    });

    heart.addEventListener("click", function() {
        showPopup();
        heart.remove();
    });
}

function showPopup() {
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popup-text");
    popupText.innerText = messages[Math.floor(Math.random() * messages.length)]; // Pick a random message
    popup.style.display = "block";

    gsap.fromTo(popup, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
}

function closePopup() {
    const popup = document.getElementById("popup");
    gsap.to(popup, { scale: 0, opacity: 0, duration: 0.2, ease: "power1.inOut", onComplete: () => {
        popup.style.display = "none";
    }});
}

setInterval(createHeart, 800); // Slower heart spawn rate
