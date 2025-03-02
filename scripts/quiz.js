const questions = [
    { text: "Would you rather go on a fancy dinner date or a cozy movie night?", images: ["resources/dinner.jpg", "resources/movie.jpg"] },
    { text: "Would you rather receive handwritten love letters or surprise gifts?", images: ["resources/letter.jpg", "resources/gifts.jpg"] },
    { text: "Would you rather go on a spontaneous road trip or a well-planned vacation?", images: ["resources/roadtrip.jpg", "resources/vacation.jpg"] },
    { text: "Would you rather have a picnic in the park or a candlelit dinner at home?", images: ["resources/picnic.jpg", "resources/dinnerhome.jpg"] }
];

const rouletteOptions = [
   "Give yourself five compliments in the mirror!",
"Send yourself a kind and encouraging message!",
"Plan a self-care day this weekend just for you!",
"List three things you love about yourself!",
"Cook your favorite meal and enjoy it mindfully!",
"Write a love letter to yourself!",
"Dance freely to your favorite song and celebrate yourself!",
"Watch the sunset and reflect on your journey!"
];

let currentQuestion = 0;

function loadQuestion() {
    if (currentQuestion < questions.length) {
        document.getElementById("question-container").innerText = questions[currentQuestion].text;
        let options = questions[currentQuestion].text.split(" or ");
        document.getElementById("option1-text").innerText = options[0];
        document.getElementById("option2-text").innerText = options[1];
        document.getElementById("option1-img").src = questions[currentQuestion].images[0];
        document.getElementById("option2-img").src = questions[currentQuestion].images[1];
        updateProgressBar();
    } else {
        document.getElementById("question-container").style.display = "none";
        document.querySelector(".button-container").style.display = "none";
        document.getElementById("roulette-container").style.display = "block";
    }
}

function chooseAnswer(choice) {
    currentQuestion++;
    loadQuestion();
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
}

let totalRotation = 0; // Track total rotation

function spinRoulette() {
    const wheel = document.getElementById("roulette-wheel");
    const resultText = document.getElementById("roulette-result");
    const spinBtn = document.getElementById("spin-btn");
    const popup = document.getElementById("popup-container");
    const rouletteContainer = document.getElementById("roulette-container");
    const spinDuration = 2500; // 3 seconds
    const spins = 10; 
    const degreesPerOption = 360 / rouletteOptions.length;

    // Disable spin button while spinning
    spinBtn.disabled = true;

    // Randomly select an option
    const randomIndex = Math.floor(Math.random() * rouletteOptions.length);
    const selectedOption = rouletteOptions[randomIndex];

    // Calculate the new rotation by adding to previous rotation
    const finalRotation = totalRotation + (spins * 360) + (randomIndex * degreesPerOption);
    totalRotation = finalRotation; // Save new rotation for next spin

    // Apply spinning animation
    wheel.style.transition = `transform ${spinDuration}ms ease-out`;
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    // Show result after spin
    setTimeout(() => {
        resultText.innerText = selectedOption;
        popup.style.display = "flex";  // Show pop-up
        rouletteContainer.style.display = "none";  // Hide roulette section
        confetti();  
        spinBtn.disabled = false;
    }, spinDuration);
}


// Close pop-up and restore roulette section
function closePopup() {
    document.getElementById("popup-container").style.display = "none";
    document.getElementById("roulette-container").style.display = "block"; // Show roulette again
}

function goHome() {
    // Ensure the page properly redirects to home.html
    window.location.href = "home.html";
}

loadQuestion();


// Add music controls to the page
function addMusicControls() {
    const musicButton = document.createElement('button');
    musicButton.id = 'musicToggle';
    musicButton.innerHTML = '🔇'; // Initial state: muted
    musicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        z-index: 1000;
    `;

    document.body.appendChild(musicButton);

    let isPlaying = false;

    musicButton.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicButton.innerHTML = '🔇';
        } else {
            bgMusic.play()
                .then(() => {
                    musicButton.innerHTML = '🔊';
                })
                .catch(err => {
                    console.log('Music playback failed:', err);
                    musicButton.innerHTML = '❌';
                });
        }
        isPlaying = !isPlaying;
    });
}

// Initialize music controls
document.addEventListener('DOMContentLoaded', addMusicControls);