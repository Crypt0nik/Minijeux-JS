const persopose = document.getElementById("persopose");
const marcheImages = document.querySelectorAll(".marche img");
const persomarche3 = document.getElementById("persomarche3"); 
const persomarche4 = document.getElementById("persomarche4"); 
let isMoving = false;
let currentFrame = 0;
let currentFrame2 = 1;
let currentFrame3 = 2;
let currentFrame4 = 3;
let characterX = 0;
const characterSpeed = 8;
const container = document.querySelector(".personnage");
let isFacingLeft = false;

function startWalking() {
    if (!isMoving) {
        isMoving = true;
        persopose.style.opacity = 0; // Masquez l'image de pose
        animateWalking();
    }
}

function stopWalking() {
    isMoving = false;
    persopose.style.opacity = 1; // Affichez l'image de pose
    for (const image of marcheImages) {
        image.style.opacity = 0; // Masquez toutes les images de marche
    }
}

function animateWalking() {
    if (isMoving) {
        for (const image of marcheImages) {
            image.style.transform = isFacingLeft ? "scaleX(-1)" : "scaleX(1)";
        }

        persopose.style.transform = isFacingLeft ? "scaleX(1)" : "scaleX(-1)";

        marcheImages[currentFrame].style.opacity = 0;

        currentFrame = (currentFrame + 1) % marcheImages.length;
        marcheImages[currentFrame].style.opacity = 1;

        marcheImages[currentFrame2].style.opacity = 0;

        currentFrame2 = (currentFrame2 + 1) % marcheImages.length;
        marcheImages[currentFrame2].style.opacity = 1;

        marcheImages[currentFrame3].style.opacity = 0;
        currentFrame3 = (currentFrame3 + 1) % marcheImages.length;
        marcheImages[currentFrame3].style.opacity = 1;

        marcheImages[currentFrame4].style.opacity = 0; // Masquez l'image actuelle
        currentFrame4 = (currentFrame4 + 1) % marcheImages.length;
        marcheImages[currentFrame4].style.opacity = 1; // Affichez la nouvelle image

        setTimeout(animateWalking, 500);
    }
}

function isCharacterInsideContainer() {
    const containerWidth = container.offsetWidth;
    return characterX >= 0 && characterX <= containerWidth - 100; // 100 is the character's width
}

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        startWalking();
        characterX -= characterSpeed;
        isFacingLeft = false; // Personnage se déplace vers la gauche, pas de flipping
        if (!isCharacterInsideContainer()) {
            characterX = Math.max(0, characterX);
        }
        document.querySelector(".personnage").style.transform = `translateX(${characterX}px)`;
        document.querySelector(".monde").scrollLeft -= characterSpeed;
    } else if (event.key === "ArrowRight") {
        startWalking();
        characterX += characterSpeed;
        isFacingLeft = true; // Personnage se déplace vers la droite, flipping
        if (!isCharacterInsideContainer()) {
            characterX = Math.min(container.offsetWidth - 100, characterX);
        }
        document.querySelector(".personnage").style.transform = `translateX(${characterX}px)`;
        document.querySelector(".monde").scrollLeft += characterSpeed;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        stopWalking();
    }
});
