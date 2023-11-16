const screenWidth = window.innerWidth; // Obtient la largeur de l'écran
const targetX = screenWidth / 3; // Position x au tiers de l'écran
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

        setTimeout(animateWalking, 400);
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
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        stopWalking();
    }
});

const sautImages = document.querySelectorAll(".saut img");
let isTapping = false;
let currentTappingFrame = 0;

function startTapping() {
    if (!isTapping) {
        isTapping = true;
        persopose.style.display = "none"; // Cachez l'image de pose

        // Ajout de la fonction jump
        jump();
        animateTapping();
    }
}

function jump() {
    const jumpHeight = 100; // Ajustez la hauteur du saut selon vos besoins
    const jumpDuration = 500; // Ajustez la durée du saut selon vos besoins

    const character = document.querySelector(".personnage");
    const characterInitialTop = character.getBoundingClientRect().top;

    let startTime;

    function jumpStep(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        const progress = timestamp - startTime;
        const newY = characterInitialTop - easeInOutQuad(progress, 0, jumpHeight, jumpDuration);

        character.style.top = `${newY}px`;

        if (progress < jumpDuration) {
            requestAnimationFrame(jumpStep);
        } else {
            // Fin du saut, réinitialiser la position et vérifier la collision
            character.style.top = "0";
            checkCollision();
        }
    }

    requestAnimationFrame(jumpStep);
}

// Fonction d'interpolation pour le saut (EaseInOutQuad)
function easeInOutQuad(t, b, c, d, isDescend = false) {
    t /= d / 2;
    if (t < 1) {
        return isDescend
            ? (c / 4) * t * t + b  // Division par 4 pour ajuster la descente
            : (c / 2) * t * t + b;
    }
}

function animateTapping() {
    if (isTapping) {
        sautImages[currentTappingFrame].style.display = "block"; // Affichez l'image actuelle

        setTimeout(function() {
            sautImages[currentTappingFrame].style.display = "none"; // Cachez l'image actuelle

            currentTappingFrame = (currentTappingFrame + 1) % sautImages.length;
            if (currentTappingFrame === 0) {
                stopTapping(); // Arrêtez l'animation une fois que toutes les images ont été affichées
            } else {
                animateTapping(); // Affichez la prochaine image
            }
        }, 190); // Ajustez la durée d'affichage de chaque image (en millisecondes)
    }
}

function stopTapping() {
    isTapping = false;
    persopose.style.display = "block"; // Affichez l'image de pose
}



window.addEventListener("keydown", (event) => {
    if (event.key === " " && !isTapping) { // Barre d'espace
        startTapping();
    }
});

const blocs = document.querySelectorAll(".bloc");
const surprises = document.querySelectorAll(".surprise");

function checkCollision() {
    const characterRect = document.querySelector(".personnage").getBoundingClientRect();

    blocs.forEach((bloc, index) => {
        const blocRect = bloc.getBoundingClientRect();
        const surprise = document.querySelector(`.surprise-${index + 1}`);
        

        // Vérifiez si le personnage frappe en dessous du bloc pendant le saut
        const hitZoneBottom = blocRect.top + 10;
        const hitZoneTop = blocRect.bottom - 10;

        if (
            (characterRect.bottom >= hitZoneTop && characterRect.bottom <= hitZoneBottom) ||
            (isTapping && characterRect.bottom >= hitZoneTop && characterRect.top <= hitZoneBottom)
        ) {
            // Vérifiez si le personnage est proche de la position x cible
            if (characterRect.left <= targetXFromLeft && characterRect.right >= targetXFromLeft) {
                if (!surprise.classList.contains("activated")) {
                    surprise.style.display = "block";
                }
            }
        } else {
            surprise.style.display = "none";
            surprise.classList.remove("activated");
        }
    });
}


setInterval(checkCollision, 1);


function animate() {
    checkCollision();
    requestAnimationFrame(animate);
}

animate();
