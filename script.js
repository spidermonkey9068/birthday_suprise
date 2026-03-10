window.onload = () => {
    document.body.style.opacity = 1;
};
// ===== BASIC TEST =====
console.log("3D Scene Starting...");

// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const music = document.getElementById("music");
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        musicStarted = true;

        music.volume = 0;
        music.play().catch(err => console.log("Audio blocked:", err));

        // smooth fade-in
        const fade = setInterval(() => {
            if (music.volume < 1) {
                music.volume += 0.02;
            } else {
                clearInterval(fade);
            }
        }, 150);
    }
}

// Start music on first interaction
window.addEventListener("click", startMusic);
window.addEventListener("touchstart", startMusic);

camera.position.set(0, 6, 35);  // start far away

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ===== LIGHTING =====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// ===== STARRY SKY =====
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 15000; i++) {
    starVertices.push(
        THREE.MathUtils.randFloatSpread(300),
        THREE.MathUtils.randFloatSpread(300),
        THREE.MathUtils.randFloatSpread(300)
    );
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ===== RESIZE FIX =====
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// ===== TABLE =====
const tableGeometry = new THREE.CylinderGeometry(6, 6, 1, 32);
const tableMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e2c1c,
    roughness: 0.8
});

const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.y = -1;

scene.add(table);

// ===== CAKE MATERIAL =====
const cakeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4
});

// Bottom Layer
const bottomLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.5, 1, 32),
    cakeMaterial
);
bottomLayer.position.y = 0;

// Top Layer
const topLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.8, 32),
    cakeMaterial
);
topLayer.position.y = 1;

scene.add(bottomLayer);
scene.add(topLayer);

// ===== CANDLES =====
const candleFlames = [];
const flameMeshes = [];
for (let i = 0; i < 8; i++) {

    // Candle body
    const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: 0xffdede })
    );

    candle.position.set(
        Math.cos(i) * 1.5,   // circular placement
        1.8,                 // height on cake
        Math.sin(i) * 1.5
    );

    scene.add(candle);

    // Candle flame light
    const flame = new THREE.PointLight(0xffaa33, 2, 8);
flame.position.copy(candle.position);
flame.position.y += 0.5;

scene.add(flame);
    candleFlames.push(flame);
    // 🔥 Flame Mesh
const flameGeometry = new THREE.ConeGeometry(0.12, 0.35, 16);

const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa33
});

const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);

flameMesh.position.copy(candle.position);
flameMesh.position.y += 0.9;

scene.add(flameMesh);
flameMeshes.push(flameMesh);
}

// ===== IMPROVED VIRTUAL BOUQUET =====
const bouquetGroup = new THREE.Group();

const flowerCount = 20; // more flowers = fuller look

// 🌿 Stems
for (let i = 0; i < flowerCount; i++) {

    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3, 8),
        new THREE.MeshStandardMaterial({ color: 0x2e8b57 })
    );

    stem.position.set(
        (Math.random() - 0.5) * 0.8,
        0,
        (Math.random() - 0.5) * 0.8
    );

    stem.rotation.z = (Math.random() - 0.5) * 0.5;

    bouquetGroup.add(stem);
}

// 🌸 Flower Heads (with pink variations)
for (let i = 0; i < flowerCount; i++) {

    const pinkShades = [0xff69b4, 0xff1493, 0xff85c1, 0xff4da6];
    const randomPink = pinkShades[Math.floor(Math.random() * pinkShades.length)];

    const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshStandardMaterial({
            color: randomPink,
            roughness: 0.3
        })
    );

    flower.position.set(
        (Math.random() - 0.5) * 2,
        1.8 + Math.random() * 0.5,
        (Math.random() - 0.5) * 2
    );

    bouquetGroup.add(flower);
}
// 🤍 Baby white flowers
for (let i = 0; i < 15; i++) {

    const babyFlower = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5
        })
    );

    babyFlower.position.set(
        (Math.random() - 0.5) * 2.2,
        1.6 + Math.random(),
        (Math.random() - 0.5) * 2.2
    );

    bouquetGroup.add(babyFlower);
}
// 📦 Smaller Wrapping Cone
const wrap = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 3, 32),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })
);

wrap.rotation.x = Math.PI;
wrap.position.y = -0.8;

bouquetGroup.add(wrap);
// 🎀 Golden Ribbon
const ribbon = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.05, 16, 100),
    new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2
    })
);

ribbon.rotation.x = Math.PI / 2;
ribbon.position.y = -0.5;

bouquetGroup.add(ribbon);
// 📍 Position on table (lying)
bouquetGroup.rotation.y = -Math.PI / 6;  // slight angle toward camera
bouquetGroup.rotation.x = 0.2;           // slight tilt for realism
bouquetGroup.position.set(5, 0.4, 2);

scene.add(bouquetGroup);
// ===== PHOTO FRAME GROUP =====
const frameGroup = new THREE.Group();

// Load texture
const textureLoader = new THREE.TextureLoader();
const photoTexture = textureLoader.load("assets/bouquet.jpeg");

// 🖼 Photo Plane
const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4),
    new THREE.MeshBasicMaterial({ map: photoTexture })
);

frameGroup.add(photo);

// 🟫 Frame Border (simple rectangle behind)
const border = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 4.3, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
);

border.position.z = -0.15;
frameGroup.add(border);

// Position on table
frameGroup.position.set(-5, 1.5, 2);

// Slight tilt for realism
frameGroup.rotation.x = -0.2;

// Make it face camera
frameGroup.lookAt(camera.position);

scene.add(frameGroup);
// ===== FLOATING PETALS =====
const petals = [];

for (let i = 0; i < 20; i++) {

    const petal = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xff69b4 })
    );

    petal.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 20
    );

    scene.add(petal);
    petals.push(petal);
}
// ===== FIREWORKS SYSTEM =====
function launchFireworks() {

    for (let i = 0; i < 300; i++) {

        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random())
            })
        );

        particle.position.set(
            (Math.random() - 0.5) * 10,
            8 + Math.random() * 5,
            (Math.random() - 0.5) * 10
        );

        scene.add(particle);

        gsap.to(particle.position, {
            x: particle.position.x + (Math.random() - 0.5) * 20,
            y: particle.position.y + Math.random() * 15,
            z: particle.position.z + (Math.random() - 0.5) * 20,
            duration: 2,
            onComplete: () => scene.remove(particle)
        });
    }
}

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);

    stars.rotation.y += 0.0005;

    petals.forEach(petal => {
        petal.position.y -= 0.02;
        petal.rotation.x += 0.01;

        if (petal.position.y < -1) {
            petal.position.y = 10;
        }
    });
    // 🔥 Candle flicker
candleFlames.forEach(flame => {

    flame.intensity = 1.5 + Math.random() * 1;

    flame.position.x += (Math.random() - 0.5) * 0.02;
    flame.position.z += (Math.random() - 0.5) * 0.02;

});
    // 🔥 Animate flame meshes
flameMeshes.forEach(flame => {

    const flicker = 0.9 + Math.random() * 0.2;

    flame.scale.y = flicker;
    flame.scale.x = 0.9 + Math.random() * 0.2;

    flame.rotation.y += 0.02;

});
    renderer.render(scene, camera);
}

// ===== CINEMATIC INTRO =====
gsap.to(camera.position, {
    z: 12,
    y: 3,
    duration: 4,
    ease: "power2.out"
});

animate();
// =============================
// 🎀 NOTES SYSTEM (FINAL STABLE VERSION)
// =============================


const container = document.querySelector(".notes-container");
const papers = document.querySelectorAll(".paper");

const containerRect = container.getBoundingClientRect();

papers.forEach((paper, index) => {

    // ---------- SAFE RANDOM POSITION ----------
    const noteWidth = 200;
    const noteHeight = 150;
    const margin = 60;

    const maxX = containerRect.width - noteWidth - margin;
    const maxY = containerRect.height - noteHeight - margin;

    const randomX = margin + Math.random() * maxX;
    const randomY = margin + Math.random() * maxY;

    paper.style.position = "absolute";
    paper.style.left = randomX + "px";
    paper.style.top = randomY + "px";
    paper.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    paper.style.zIndex = index + 1;

    // ---------- DRAG SYSTEM ----------
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    paper.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - paper.offsetLeft;
        offsetY = e.clientY - paper.offsetTop;
        paper.style.zIndex = 9999;
        paper.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            paper.style.left = (e.clientX - offsetX) + "px";
            paper.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        paper.style.cursor = "grab";
    });

    // ---------- OPEN / CLOSE ----------
    paper.addEventListener("click", () => {

        if (!paper.classList.contains("open")) {

            paper.classList.add("open");
            paper.innerHTML = paper.dataset.message;

            // 🎆 Special Note Trigger
            if (paper.classList.contains("special")) {

               

                launchFireworks();

                gsap.to(camera.position, {
                    z: 8,
                    duration: 2,
                    ease: "power2.out"
                });

                document.body.style.boxShadow = "inset 0 0 200px rgba(255, 200, 0, 0.6)";

                setTimeout(() => {
                    document.body.style.boxShadow = "none";
                }, 2000);
            }

        } else {

            paper.classList.remove("open");
            paper.innerHTML = "💌 " + paper.dataset.title;
        }

    });

});