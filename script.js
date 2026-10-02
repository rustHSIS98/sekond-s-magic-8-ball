const ball = document.getElementById("ball");
const answer = document.getElementById("answer");

const answers = ["Yes", "No"];

let shaking = false;

function getRandomAnswer() {
    return answers[Math.floor(Math.random() * answers.length)];
}

function shakeBall() {
    if (shaking) return;

    shaking = true;

    answer.textContent = "";

    ball.classList.remove("shaking");

    void ball.offsetWidth;

    ball.classList.add("shaking");

    setTimeout(() => {
        answer.textContent = getRandomAnswer();
        shaking = false;
    }, 650);
}


// Enable motion sensors when the ball is tapped.

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
            }
        } catch {
            // Motion permission was denied.
        }
    } else {
        window.addEventListener(
            "devicemotion",
            handleMotion
        );
    }
}


// Detect physical shaking.

let lastX = null;
let lastY = null;
let lastZ = null;

let lastShake = 0;

const SHAKE_THRESHOLD = 18;
const SHAKE_COOLDOWN = 900;

function handleMotion(event) {
    const acceleration = event.accelerationIncludingGravity;

    if (!acceleration) return;

    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;

    if (x === null || y === null || z === null) return;

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

    const now = Date.now();

    if (
        movement > SHAKE_THRESHOLD &&
        now - lastShake > SHAKE_COOLDOWN
    ) {
        lastShake = now;
        shakeBall();
    }
}


// Tap = request motion permission.
// It also gives a result if motion permission isn't needed.

ball.addEventListener("click", async () => {
    await enableMotion();

    shakeBall();
});


// Offline support.

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js");
    });
}