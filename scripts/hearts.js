// Array of flirty messages
const messages = [
   "Pwede ra ko ma-brader, basta ayaw lang i-activate ang friend mode kung imong wifi password ra ang hinungdan. Mas ganahan ko sa high-speed connection, diba?",

"Bahalag way tug, basta ikaw ang hinungdan nga ma-overload akong router sa good vibes. Wala koy data limit sa feelings!",

"Gimingaw na ko nimo, mura kog smartphone nga walay signal—pero kung ikaw mo-recharge, full bars dayon!",

"Unsaon nako pag-jacket? Di ko fashionista, pero kung ikaw ang mo-provide og cozy mode, ready na ko pirme.",

"Murag cellphone akong kinabuhi: kung ikaw ang signal, smooth kaayo ang connection; kon wala, puro interruption.",
"Kung ang gugma sakit, ayaw kabalaka—willing ko modawat basta ikaw ang mo-prescribe sa dosage. Side effects? Uncontrollable laughter!",

"Di nako kinahanglang aircon, kay kung naa ka, natural na ang chill effect sa akong kasingkasing. Climate control? Nah, love control!",

"Okay ra ko mahulog, basta kung mahulog man gani ko, ikaw ang magpahimo ani nga epic fail story nga mapakatawa ta tanan.",

"Tinuod ba nga wala pay forever? Pwede ra ta maghimo og forever nga murag viral meme—simple, kataw-anan, ug di malimtan!"
];

const heartImages = ["heart2.png", "heart3.png", "heart1.png"]; // Different heart colors

document.addEventListener("DOMContentLoaded", function () {
    const heartContainer = document.createElement("div");
    heartContainer.id = "heart-container";
    document.body.appendChild(heartContainer);

    // Function to create floating hearts
    function createHeart() {
        const heart = document.createElement("img");
        heart.src = "resources/lib-hearts/" + heartImages[Math.floor(Math.random() * heartImages.length)];
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

        setTimeout(closePopup, 5000); // Auto-close popup after 5 sec
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
