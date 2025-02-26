document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const startButton = document.getElementById("start-game");
    const instructionsButton = document.getElementById("instructions");
    const instructionsPopup = document.getElementById("instructions-popup");
    const closeInstructions = document.getElementById("close-instructions");
    const messagePopup = document.getElementById("message-popup");
    // Removed closePopup reference since we're removing the button
    const gameOverPopup = document.getElementById("game-over");
    const playAgainButton = document.getElementById("play-again");
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("high-score");
    const timerElement = document.getElementById("timer");
    const levelElement = document.getElementById("level");
    const finalScoreElement = document.getElementById("final-score");
    const heartsCaughtElement = document.getElementById("hearts-caught");
    const finalLevelElement = document.getElementById("final-level");
    const performanceMessageElement = document.getElementById("performance-message");
    const medalElement = document.getElementById("medal");
    const backButton = document.getElementById("back-btn");
    const pauseButton = document.getElementById("pause-btn");
    const playButton = document.getElementById("play-btn");
    const restartButton = document.getElementById("restart-btn");
    const quitButton = document.getElementById("quit-btn");
    const pausePopup = document.getElementById("pause-popup");
    const resumeGameButton = document.getElementById("resume-game");
    const quitGameButton = document.getElementById("quit-game");
    
    // Game configuration
    const config = {
        maxHearts: 15,
        heartSpawnRate: 800, // ms
        // Reduced time duration for each level
        gameDuration: {
            1: 45, // Level 1: 45 seconds
            2: 40, // Level 2: 40 seconds
            3: 35  // Level 3: 35 seconds
        },
        maxLevel: 3, // Limit to 3 levels
        levels: [
            { speed: 3, points: 1 },
            { speed: 5, points: 2 }, // Increased speed for level 2
            { speed: 8, points: 3 } // Increased speed for level 3
        ],
        specialHeartChance: 0.20, // 20% chance for special hearts
        specialHeartPoints: 5,
        encouragingMessageDuration: 2000 // Duration in ms for encouraging messages
    };
    
    // Game state
    let gameActive = false;
    let gamePaused = false;
    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let level = 1;
    let timeRemaining = config.gameDuration[1]; // Start with level 1 duration
    let heartsCaught = 0;
    let spawnInterval;
    let timerInterval;
    let activeHearts = [];
    let messageTimeout; // For tracking message popup timeout
    
    /// Encouraging game messages array
    const messages = [
        "Awesome catch!",
        "Great job!",
        "Fantastic!",
        "Amazing reflexes!",
        "You're on fire!",
        "Keep it up!",
        "Spectacular!",
        "Incredible!",
        "Perfect timing!",
        "Brilliant move!",
        "Superb!",
        "You're a natural!",
        "Excellent!",
        "Wow, so fast!",
        "Unstoppable!",
        "Heart-catching pro!",
        "Impressive!",
        "Magnificent!",
        "Skillful catch!",
        "You're crushing it!"
    ];

    
    // Heart images
    const heartImages = [
        "resources/lib-hearts/heart1.png", 
        "resources/lib-hearts/heart2.png", 
        "resources/lib-hearts/heart3.png"
    ];
    
    // Display high score
    highScoreElement.textContent = `(Best: ${highScore})`;
    
    // Create background bubbles
    function createBubbles() {
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement("div");
            bubble.classList.add("bubble");
            
            // Random size and position
            const size = Math.random() * 100 + 50;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}vw`;
            
            // Random duration and delay
            const duration = Math.random() * 15 + 20;
            const delay = Math.random() * 10;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            
            document.body.appendChild(bubble);
        }
    }
    
    // Load saved game progress
    function loadGameProgress() {
        const savedProgress = JSON.parse(localStorage.getItem("heartsGameProgress") || "null");
        if (savedProgress) {
            score = savedProgress.score || 0;
            level = savedProgress.level || 1;
            heartsCaught = savedProgress.heartsCaught || 0;
            timeRemaining = savedProgress.timeRemaining || config.gameDuration[level];
            
            // Update UI with saved progress
            scoreElement.textContent = score;
            levelElement.textContent = `Level ${level}`;
            timerElement.textContent = timeRemaining;
            
            // Show continue game option
            startButton.textContent = "Continue Game";
        }
    }
    
    // Save game progress
    function saveGameProgress() {
        if (gameActive || gamePaused) {
            const gameProgress = {
                score,
                level,
                heartsCaught,
                timeRemaining
            };
            localStorage.setItem("heartsGameProgress", JSON.stringify(gameProgress));
        }
    }
    
    // Clear saved game progress
    function clearGameProgress() {
        localStorage.removeItem("heartsGameProgress");
    }
    
    // Initialize the game
    function initGame() {
        createBubbles();
        
        // Update high score from localStorage
        highScore = localStorage.getItem("highScore") || 0;
        highScoreElement.textContent = `(Best: ${highScore})`;
        
        // Load any saved game progress
        loadGameProgress();
        
        // Event listeners
        startButton.addEventListener("click", startGame);
        instructionsButton.addEventListener("click", showInstructions);
        closeInstructions.addEventListener("click", hideInstructions);
        // Removed closePopup event listener since we're removing the button
        playAgainButton.addEventListener("click", resetGame);
        backButton.addEventListener("click", handleBackButton);
        pauseButton.addEventListener("click", pauseGame);
        playButton.addEventListener("click", resumeGame);
        restartButton.addEventListener("click", restartGame);
        quitButton.addEventListener("click", quitGame);
        resumeGameButton.addEventListener("click", resumeGame);
        quitGameButton.addEventListener("click", quitGame);
        
        // Add click event to message popup to dismiss it
        messagePopup.addEventListener("click", hideMessagePopup);
    }
    
    // Handle back button click
    function handleBackButton() {
        // Save game progress before navigating away
        saveGameProgress();
        window.location.href = 'home.html';
    }
    
    // Start the game
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        gamePaused = false;
        
        // If not continuing a saved game, reset values
        if (startButton.textContent !== "Continue Game") {
            score = 0;
            heartsCaught = 0;
            level = 1;
            timeRemaining = config.gameDuration[level];
        }
        
        // Clear saved progress as we're now playing
        clearGameProgress();
        
        // Update UI
        scoreElement.textContent = score;
        timerElement.textContent = timeRemaining;
        levelElement.textContent = `Level ${level}`;
        
        // Hide start button, show instructions button
        startButton.style.display = "none";
        instructionsButton.style.display = "none";
        
        // Show game action buttons
        pauseButton.style.display = "block";
        restartButton.style.display = "block";
        quitButton.style.display = "block";
        
        // Start spawning hearts
        spawnInterval = setInterval(createHeart, config.heartSpawnRate);
        
        // Start timer
        timerInterval = setInterval(updateTimer, 1000);
        
        // Play start sound
        playSound("start");
    }
    
    // Pause the game
    function pauseGame() {
        if (!gameActive || gamePaused) return;
        
        gamePaused = true;
        
        // Clear intervals
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        
        // Clear any message timeout
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        
        // Pause all heart animations
        activeHearts.forEach(heart => {
            const animation = gsap.getTweensOf(heart)[0];
            if (animation) {
                animation.pause();
            }
        });
        
        // Show pause UI
        pauseButton.style.display = "none";
        playButton.style.display = "block";
        
        // Show pause popup
        pausePopup.style.display = "block";
        gsap.fromTo(pausePopup, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
        // Save game progress
        saveGameProgress();
    }
    
    // Resume the game
    function resumeGame() {
        if (!gamePaused) return;
        
        gamePaused = false;
        
        // Hide pause popup
        gsap.to(pausePopup, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power1.in",
            onComplete: () => {
                pausePopup.style.display = "none";
            }
        });
        
        // Resume all heart animations
        activeHearts.forEach(heart => {
            const animation = gsap.getTweensOf(heart)[0];
            if (animation) {
                animation.resume();
            }
        });
        
        // Restart intervals
        spawnInterval = setInterval(createHeart, config.heartSpawnRate);
        timerInterval = setInterval(updateTimer, 1000);
        
        // Update UI
        playButton.style.display = "none";
        pauseButton.style.display = "block";
    }
    
    // Restart the game
    function restartGame() {
        // Clear all intervals
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        
        // Clear any message timeout
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        
        // Clear all hearts
        activeHearts.forEach(heart => heart.remove());
        activeHearts = [];
        
        // Reset game state
        score = 0;
        heartsCaught = 0;
        level = 1;
        timeRemaining = config.gameDuration[level];
        gameActive = false;
        gamePaused = false;
        
        // Update UI
        scoreElement.textContent = score;
        timerElement.textContent = timeRemaining;
        levelElement.textContent = `Level ${level}`;
        
        // Hide action buttons
        pauseButton.style.display = "none";
        playButton.style.display = "none";
        restartButton.style.display = "none";
        quitButton.style.display = "none";
        
        // Show start button and instructions button
        startButton.style.display = "inline-block";
        startButton.textContent = "Start Game";
        instructionsButton.style.display = "inline-block";
        
        // Clear saved progress
        clearGameProgress();
        
        // Play restart sound
        playSound("start");
    }
    
        function quitGame() {
        // Hide pause popup if visible
        if (pausePopup.style.display === "block") {
            gsap.to(pausePopup, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power1.in",
                onComplete: () => {
                    pausePopup.style.display = "none";
                }
            });
        }
        
        // Show custom quit popup
        const quitPopup = document.getElementById("quit-popup");
        quitPopup.style.display = "block";
        gsap.fromTo(quitPopup, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    
        // Event listeners for quit popup buttons
        const confirmQuitButton = document.getElementById("confirm-quit");
        const cancelQuitButton = document.getElementById("cancel-quit");
    
        confirmQuitButton.addEventListener("click", () => {
            restartGame();
            hideQuitPopup();
        });
    
        cancelQuitButton.addEventListener("click", () => {
            if (gamePaused) {
                pauseGame();
            }
            hideQuitPopup();
        });
    }
    
    function hideQuitPopup() {
        const quitPopup = document.getElementById("quit-popup");
        gsap.to(quitPopup, {
            scale: 0.5,
            opacity: 0,
            duration: 0.3,
            ease: "power1.in",
            onComplete: () => {
                quitPopup.style.display = "none";
            }
        });
    }
    
    // Update timer
    function updateTimer() {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            // Level up or end game
            if (level < config.maxLevel) {
                levelUp();
            } else {
                endGame(true); // Game completed successfully
            }
        }
        
        // Make timer pulse when low
        if (timeRemaining <= 10) {
            timerElement.style.color = "#c9184a";
            timerElement.style.animation = "pulse 0.5s infinite alternate";
        } else {
            timerElement.style.color = "";
            timerElement.style.animation = "";
        }
    }
    
    // Level up
    function levelUp() {
        level++;
        timeRemaining = config.gameDuration[level];
        
        // Update UI
        timerElement.textContent = timeRemaining;
        levelElement.textContent = `Level ${level}`;
        
        // Show level up popup
        const popupText = document.getElementById("popup-text");
        popupText.innerHTML = `<strong>Level ${level}!</strong><br>Hearts are moving faster now!`;
        messagePopup.style.display = "block";
        
        // Animate the popup and auto-hide
        gsap.fromTo(messagePopup, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
        // Set timeout to hide the popup
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        messageTimeout = setTimeout(hideMessagePopup, config.encouragingMessageDuration * 1.5); // Slightly longer for level-up
        
        // Play level up sound
        playSound("levelUp");
        
        // Animate level text
        gsap.fromTo(levelElement, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
        // Clear existing hearts
        activeHearts.forEach(heart => heart.remove());
        activeHearts = [];
        
        // Adjust difficulty - spawn rate gets faster with each level
        clearInterval(spawnInterval);
        // Reduce spawn rate by 20% for each level
        const newSpawnRate = config.heartSpawnRate * Math.pow(0.8, level - 1);
        spawnInterval = setInterval(createHeart, newSpawnRate);
    }
    
    // End the game
    function endGame(completed = false) {
        gameActive = false;
        gamePaused = false;
        
        // Clear intervals
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        
        // Clear any message timeout
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        
        // Clear existing hearts
        activeHearts.forEach(heart => heart.remove());
        activeHearts = [];
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.textContent = `(Best: ${highScore})`;
        }
        
        // Update game over popup
        finalScoreElement.textContent = score;
        heartsCaughtElement.textContent = heartsCaught;
        finalLevelElement.textContent = level;
        
        // Choose medal and message based on score and completion
        let medal, message;
        
        if (completed) {
            // Game completed (all levels finished)
            medal = "🏆";
            message = "Congratulations! You completed all levels!";
        } else {
            // Game ended normally
            if (score >= 100) {
                medal = "🥇";
                message = "Amazing! You're a heart-catching master!";
            } else if (score >= 70) {
                medal = "🥈";
                message = "Excellent job! Almost perfect!";
            } else if (score >= 40) {
                medal = "🥉";
                message = "Great work! Keep practicing!";
            } else if (score >= 20) {
                medal = "⭐";
                message = "Good effort! You can do better!";
            } else {
                medal = "👍";
                message = "Nice try! Practice makes perfect!";
            }
        }
        
        medalElement.textContent = medal;
        performanceMessageElement.textContent = message;
        
        // Show game over popup
        gameOverPopup.style.display = "block";
        gsap.fromTo(gameOverPopup, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
        // Hide action buttons
        pauseButton.style.display = "none";
        playButton.style.display = "none";
        restartButton.style.display = "none";
        quitButton.style.display = "none";
        
        // Show buttons again
        startButton.style.display = "inline-block";
        startButton.textContent = "Play Again";
        instructionsButton.style.display = "inline-block";
        
        // Play game over sound
        playSound(completed ? "levelUp" : "gameOver");
        
        // Clear saved progress
        clearGameProgress();
    }
    
    // Reset the game
    function resetGame() {
        // Hide game over popup
        gsap.to(gameOverPopup, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power1.in",
            onComplete: () => {
                gameOverPopup.style.display = "none";
                
                // Start a new game
                startGame();
            }
        });
    }
    
    // Create a heart
    function createHeart() {
        if (!gameActive || gamePaused) return;
        
        // Limit the number of active hearts
        if (activeHearts.length >= config.maxHearts) return;
        
        const heart = document.createElement("img");
        const isSpecial = Math.random() < config.specialHeartChance;
        
        // Choose a random heart image
        heart.src = heartImages[Math.floor(Math.random() * heartImages.length)];
        heart.classList.add("heart");
        
        // Make some hearts special (golden)
        if (isSpecial) {
            heart.classList.add("special-heart");
            heart.dataset.special = "true";
        }
        
        document.body.appendChild(heart);
        activeHearts.push(heart);
        
        // Set random size
        const size = Math.random() * 30 + 40;
        heart.style.width = size + "px";
        
        // Set start and end positions
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() * 200 - 100);
        const startY = -100; // Start above the screen
        const endY = window.innerHeight + 100; // End below the screen
        
        heart.style.position = "absolute";
        heart.style.left = startX + "px";
        heart.style.top = startY + "px";
        
        // Current level configuration
        const levelConfig = config.levels[level - 1];
        const duration = Math.random() * 3 + (8 - levelConfig.speed);
        
        // Animate the heart
        gsap.to(heart, {
            x: endX - startX,
            y: endY,
            rotation: Math.random() * 360,
            duration: duration,
            ease: "power1.in",
            onComplete: () => {
                // Remove heart when animation completes
                const index = activeHearts.indexOf(heart);
                if (index > -1) {
                    activeHearts.splice(index, 1);
                }
                heart.remove();
            }
        });
        
        // Click event
        heart.addEventListener("click", function() {
            if (gamePaused) return; // Don't allow clicking when paused
            
            // Stop the animation
            gsap.killTweensOf(heart);
            
            // Calculate points
            const points = isSpecial ? config.specialHeartPoints : levelConfig.points;
            
            // Update score
            score += points;
            heartsCaught++;
            scoreElement.textContent = score;
            
            // Show points animation
            showPointsAnimation(heart, points);
            
            // Play sound
            playSound(isSpecial ? "special" : "pop");
            
            // Show popup message occasionally
            if (Math.random() < 0.3) {
                showEncouragingMessage();
            }
            
            // Animate heart disappearance
            gsap.to(heart, { 
                scale: 0, 
                opacity: 0, 
                rotation: Math.random() * 180 - 90,
                duration: 0.3, 
                ease: "back.in(1.7)",
                onComplete: () => {
                    // Remove heart
                    const index = activeHearts.indexOf(heart);
                    if (index > -1) {
                        activeHearts.splice(index, 1);
                    }
                    heart.remove();
                }
            });
        });
    }
    
    // Show points animation
    function showPointsAnimation(heart, points) {
        const pointsEl = document.createElement("div");
        pointsEl.textContent = `+${points}`;
        pointsEl.classList.add("points-animation");
        
        // Position the points animation near the heart
        const heartRect = heart.getBoundingClientRect();
        pointsEl.style.left = `${heartRect.left + heartRect.width/2}px`;
        pointsEl.style.top = `${heartRect.top}px`;
        
        document.body.appendChild(pointsEl);
        
        // Animate the points
        gsap.to(pointsEl, {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                pointsEl.remove();
            }
        });
    }
    
    // Show encouraging message popup - MODIFIED to auto-hide without button
    function showEncouragingMessage() {
        // Don't show popup if game is not active or is paused
        if (!gameActive || gamePaused) return;
        
        // Get random message
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Update popup text
        const popupText = document.getElementById("popup-text");
        popupText.textContent = randomMessage;
        
        // Show popup with animation
        messagePopup.style.display = "block";
        gsap.fromTo(messagePopup, 
            { scale: 0.8, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        
        // Clear any existing timeout
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        
        // Auto-hide after configured duration
        messageTimeout = setTimeout(hideMessagePopup, config.encouragingMessageDuration);
    }
    
    // Hide message popup - MODIFIED for smooth transition
    function hideMessagePopup() {
        if (messagePopup.style.display !== "block") return;
        
        gsap.to(messagePopup, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power1.in",
            onComplete: () => {
                messagePopup.style.display = "none";
            }
            });
            }

            // Show instructions popup
            function showInstructions() {
            instructionsPopup.style.display = "block";
            gsap.fromTo(instructionsPopup, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
            }

            // Hide instructions popup
            function hideInstructions() {
            gsap.to(instructionsPopup, {
            scale: 0.5,
            opacity: 0,
            duration: 0.3,
            ease: "power1.in",
            onComplete: () => {
                instructionsPopup.style.display = "none";
            }
            });
            }

            // Play sound effects
            function playSound(type) {
            let sound;
            switch(type) {
            case "pop":
                sound = new Audio("resources/music-effects/pop-.mp3");
                break;
            case "special":
                sound = new Audio("resources/music-effects/special.mp3");
                break;
            case "levelUp":
                sound = new Audio("resources/music-effects/level-up.mp3");
                break;
            case "gameOver":
                sound = new Audio("resources/music-effects/game-over.mp3");
                break;
            case "start":
                sound = new Audio("resources/music-effects/game-start.mp3");
                break;
            }

            if (sound) {
            sound.volume = 0.5; // Set volume to 50%
            sound.play().catch(error => {
                console.log("Audio playback failed:", error);
            });
            }
            }

            // Handle window resize
            window.addEventListener('resize', () => {
            // Adjust positions of active hearts when window is resized
            activeHearts.forEach(heart => {
            const currentX = parseFloat(heart.style.left);
            if (currentX > window.innerWidth) {
                heart.style.left = window.innerWidth - 50 + "px";
            }
            });
            });

            // Initialize the game when the page loads
                initGame();
                });
