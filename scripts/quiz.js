const questions = [
    { text: "Would you rather go on a fancy dinner date or a cozy movie night?", images: ["resources/dinner.jpg", "resources/movie.jpg"] },
    { text: "Would you rather receive handwritten love letters or surprise gifts?", images: ["resources/letter.jpg", "resources/gifts.jpg"] },
    { text: "Would you rather go on a spontaneous road trip or a well-planned vacation?", images: ["resources/roadtrip.jpg", "resources/vacation.jpg"] },
    { text: "Would you rather have a picnic in the park or a candlelit dinner at home?", images: ["resources/picnic.jpg", "resources/dinnerhome.jpg"] }
];

const rouletteOptions = [
    "Give your partner five kisses!",
    "Send your partner a surprise love message!",
    "Plan a fun date this weekend!",
    "Tell your partner three things you love about them!",
    "Cook a meal together tonight!",
    "Write a poem for your partner!",
    "Dance together to your favorite song!",
    "Watch the sunset together!"
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

function spinRoulette() {
    const wheel = document.getElementById("roulette-wheel");
    const resultText = document.getElementById("roulette-result");
    const spinBtn = document.getElementById("spin-btn");
    const spinDuration = 3000; // 3 seconds
    const spins = 10; // Increase the number of spins for a faster effect
    const degreesPerOption = 360 / rouletteOptions.length;

    // Disable the spin button after clicking
    spinBtn.disabled = true;

    // Randomly select an option
    const randomIndex = Math.floor(Math.random() * rouletteOptions.length);
    const selectedOption = rouletteOptions[randomIndex];

    // Calculate the final rotation angle
    const finalRotation = spins * 360 + (randomIndex * degreesPerOption);

    // Apply the spinning animation
    wheel.style.transition = `transform ${spinDuration}ms ease-out`;
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    // Display the result after the spin
    setTimeout(() => {
        resultText.innerText = selectedOption;
        confetti(); // Assuming you have a confetti function for celebration

        // Redirect to index.html after a short delay
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000); // 2 seconds delay before redirecting
    }, spinDuration);
}

function goHome() {
    window.location.href = "index.html";
}

loadQuestion();