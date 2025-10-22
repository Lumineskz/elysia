// script.js (User's original logic, now integrated and enhanced)

        // 1. Define the target date and time 
        // Note: This date is set to your local time ('November 7, 2025 08:30:00').
        const targetDate = new Date('October 23, 2025 13:30:00').getTime();

        // Get the elements to update
        const daysEl = document.querySelector('.days');
        const hoursEl = document.querySelector('.hours');
        const minutesEl = document.querySelector('.minutes');
        const secondsEl = document.querySelector('.seconds');
        const countdownSection = document.getElementById('countdown-section');
        const endMessage = document.getElementById('end-message');
        const body = document.body;
        // ADDED: References to falling image and pull message elements
        const fallingImageLayer = document.getElementById('falling-image-layer');
        const pullForm = document.getElementById('pull-form');
        const goodluckMessage = document.getElementById('goodluck-message');
        
        // Ensure you change this to your desired PNG image link!
        const IMAGE_URL = "ticket.webp"; // Placeholder image link
        const NUM_IMAGES_ON_PULL = 10; // Number of images to drop per click

        /**
         * Formats a number to always have two digits (e.g., 5 -> '05')
         * @param {number} num
         * @returns {string}
         */
        function formatTime(num) {
            return num < 10 ? `0${num}` : num;
        }

        // ----------------------------------------
        // --- Falling Image Logic ---
        // ----------------------------------------
        
        /**
         * Creates and animates a single falling image element.
         */
        function createFallingImage() {
            const image = document.createElement('img');
            image.src = IMAGE_URL;
            image.classList.add('falling-image');

            // 1. Set random horizontal start position (0% to 95%)
            const startX = Math.random() * 95;
            image.style.left = `${startX}vw`;

            // 2. Set random animation duration (3s to 8s) for variable fall speed
            const duration = Math.random() * 5 + 3; // 3 to 8 seconds
            image.style.animationDuration = `${duration}s`;

            // 3. Append the image to the falling layer
            fallingImageLayer.appendChild(image);

            // 4. Remove the image after it has fallen to prevent memory leaks
            setTimeout(() => {
                image.remove();
            }, duration * 1000); // Remove after the animation duration
        }

        /**
         * Handles the "I'm Pulling!" button click event.
         * @param {Event} e
         */
        function handlePull(e) {
            e.preventDefault();

            // 1. Generate random falling images
            for (let i = 0; i < NUM_IMAGES_ON_PULL; i++) {
                // Delay each image slightly for a better spread effect
                setTimeout(createFallingImage, i * 150); 
            }

            // 2. Display "Good luck!" message
            goodluckMessage.classList.remove('hidden');
            // Hide the message after 3 seconds
            setTimeout(() => {
                goodluckMessage.classList.add('hidden');
            }, 3000);
        }
        
        // ----------------------------------------
        // --- Confetti & Countdown Logic ---
        // ----------------------------------------

        function runConfetti() {
            // A simple, concentrated burst for the event
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });
            
            // Repeat the effect a few times
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.8, x: 0.5 }
                });
            }, 500);
        }

        // FIX: Declare the variable with 'let' at the top level so it is accessible inside updateCountdown()
        let countdownInterval;
        
        /**
         * Calculates the time remaining and updates the DOM
         */
        function updateCountdown() {
            // Get the current time
            const now = new Date().getTime();

            // Calculate the distance (time difference)
            const distance = targetDate - now;

            // Time calculations for days, hours, minutes, and seconds
            const day = 1000 * 60 * 60 * 24;
            const hour = 1000 * 60 * 60;
            const minute = 1000 * 60;
            const second = 1000;

            const days = Math.floor(distance / (day));
            const hours = Math.floor((distance % (day)) / (hour));
            const minutes = Math.floor((distance % (hour)) / (minute));
            const seconds = Math.floor((distance % (minute)) / (second));

            // Update the HTML elements
            daysEl.textContent = formatTime(days);
            hoursEl.textContent = formatTime(hours);
            minutesEl.textContent = formatTime(minutes);
            secondsEl.textContent = formatTime(seconds);

            // If the countdown is finished, clear the interval and show a message
            if (distance < 0) {
                // This now correctly accesses the 'let' declared variable
                clearInterval(countdownInterval); 
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                
                // Show end message and hide countdown
                countdownSection.classList.add('hidden');
                endMessage.classList.remove('hidden');

                // Change background
                body.classList.add('countdown-finished');
                
                // Run confetti!
                runConfetti();
            }
        }

        pullForm.addEventListener('submit', handlePull);
        // Initial call to display the time immediately
        updateCountdown();

        // ASSIGN: Now we assign the interval to the pre-declared 'let' variable
        countdownInterval = setInterval(updateCountdown, 1000);