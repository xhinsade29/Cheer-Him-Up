// Array of flirty messages
const messages = [
    "Pwede ra kayko ma brader, kung ikaw ang hinungdan! 📚❤️",
    "Bahalag way tug, basta ikaw ang rason. 😘",
    "Gimingaw nako nimo ug ayo! 😆❤️",
    "Unsaon mani nakong jacket, kung ikaw akong gustoka ka cuddle? 😍",
    "Murag cellphone akong kinabuhi... Kay ikaw akong signal! 📶💖",
    "Mura kag kapi, kay di kompleto akong adlaw kung wa! ☕❤️",
    "Kung ang gugma sakit, willing ko masakitan basta ikaw akong rason. 💔💘",
    "Di nako kinahanglang aircon kay bugnaw na kaayo akong dughan basta naa ka. 🥶❤️",
    "Okey rako mahulog, pero sa imong smile lang 🤗",
    "Tinuod ba nga wala pay forever? Pwede ta maghimo ug forever para sa atong duha? 💑"
];

const heartImages = ["heart2.png", "heart3.png", "heart.png"]; // Different heart colors

document.addEventListener("DOMContentLoaded", function () {
    const heartContainer = document.createElement("div");
    heartContainer.id = "heart-container";
    document.body.appendChild(heartContainer);

    // Function to create floating hearts
    function createHeart() {
        const heart = document.createElement("img");
        heart.src = "resources/" + heartImages[Math.floor(Math.random() * heartImages.length)];
        heart.classList.add("heart");
        document.body.appendChild(heart); // Append hearts to the body (so they go over the video)

        let size = Math.random() * 40 + 40; // Random size
        heart.style.width = size + "px";
        heart.style.height = size + "px";

        let startX = Math.random() * window.innerWidth; 
        let endX = startX + (Math.random() * 100 - 50);
        let startY = -50; // Start above the screen
        let endY = window.innerHeight; // Falls to bottom

        heart.style.position = "absolute";
        heart.style.left = startX + "px";
        heart.style.top = startY + "px";
        heart.style.zIndex = "5"; // Make sure hearts are above the video

        gsap.to(heart, {
            x: endX - startX,
            y: endY - startY,
            rotation: Math.random() * 360,
            duration: Math.random() * 5 + 3,
            opacity: 0,
            ease: "power1.inOut",
            onComplete: () => heart.remove()
        });

        heart.addEventListener("click", function () {
            playSound();
            showPopup();
            gsap.to(heart, { scale: 0, opacity: 0, duration: 0.3, ease: "power1.inOut", onComplete: () => heart.remove() });
        });
    }

    // Function to play sound
    function playSound() {
        let audio = new Audio("resources/pop.mp3");
        audio.volume = 0.5;
        audio.play().catch(error => console.warn("Audio file not found or can't be played:", error));
    }

    // Function to show popup message
    function showPopup() {
        const popup = document.getElementById("popup");
        const popupText = document.getElementById("popup-text");

        if (!popup || !popupText) {
            console.error("Popup or popup-text element not found!");
            return;
        }

        popupText.innerText = messages[Math.floor(Math.random() * messages.length)];
        popup.style.display = "block";

        gsap.fromTo(popup, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });

        setTimeout(closePopup, 3000); // Auto-close popup after 3 sec
    }

    // Function to close the popup
    function closePopup() {
        const popup = document.getElementById("popup");
        if (!popup) return;

        gsap.to(popup, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power1.inOut",
            onComplete: () => {
                popup.style.display = "none";
            }
        });
    }

    // Spawn hearts every second
    setInterval(createHeart, 350);
});
