const ball = document.getElementById("ball");
const answer = document.getElementById("answer");
const statusText = document.getElementById("status");
const shakeButton = document.getElementById("shakeButton");

const answers = ["Yes", "No"];

let shaking = false;

function getRandomAnswer() {
    const index = Math.floor(Math.random() * answers.length);

    return answers[index];
}

function shakeBall() {
    if (shaking) return;

    shaking = true;

    answer.textContent = "...";
    statusText.textContent = "Shaking...";

    ball.classList.remove("shaking");

    void ball.offsetWidth;

    ball.classList.add("shaking");

    setTimeout(() => {
        answer.textContent = getRandomAnswer();

        statusText.textContent = "Ask another question and shake again.";

        shaking = false;
    }, 750);
}


// Tap the ball.
ball.addEventListener("click", shakeBall);


// SHAKE DETECTION

let lastX = null;
let lastY = null;
let lastZ = null;

const SHAKE_THRESHOLD = 18;

function handleMotion(event) {
    const acceleration = event.accelerationIncludingGravity;

    if (!acceleration) return;

    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;

    if (lastX === null) {
        lastX = x;
        lastY = y;
        lastZ = z;

        return;
    }

    const movement =
        Math.abs(x - lastX) +
        Math.abs(y - lastY) +
        Math.abs(z - lastZ);

    lastX = x;
    lastY = y;
    lastZ = z;

    if (movement > SHAKE_THRESHOLD) {
        shakeBall();
    }
}


// iPhone motion permission.

async function enableMotion() {
    if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
    ) {
        try {
            const permission =
                await DeviceMotionEvent.requestPermission();

            if (permission === "granted") {
                window.addEventListener(
                    "devicemotion",
                    handleMotion
                );

                statusText.textContent = "Shake your phone.";
            } else {
                statusText.textContent =
                    "Motion access denied. Tap the ball instead.";
            }

        } catch {
            statusText.textContent =
                "Motion access unavailable. Tap the ball instead.";
        }

    } else {
        window.addEventListener(
            "devicemotion",
            handleMotion
        );

        statusText.textContent = "Shake your phone.";
    }
}


// The first button press enables motion detection.

shakeButton.addEventListener(
    "click",
    enableMotion,
    { once: true }
);


// SERVICE WORKER

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("sw.js")
            .catch(error => {
                console.log(
                    "Service worker failed:",
                    error
                );
            });

    });
}