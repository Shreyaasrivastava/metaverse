const chatInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");
// --- AI KNOWLEDGE ENGINE ---
      const banasthaliData = {
        history:
          "Banasthali was founded in 1935 by Pandit Hiralal Shastri. It started with just 5 students and has grown into the world's largest residential university for women.",
        courses:
          "We offer a wide range of programs including B.Tech (CS, AI, IT), Law, Arts, and Management. The B.Tech Computer Science program is highly rated on sites like Shiksha and Quora.",
        reviews:
          "According to student reviews on Google and AmbitionBox: The campus culture is disciplined and safe. Many praise the 'Panchmukhi Shiksha' model, though some mention the mess food can be repetitive.",
        food: "People often review Rohit Greens juice and the canteen snacks positively! Official student feedback highlights that the mess provides pure vegetarian food.",
        admission:
          "Admissions are usually based on the 'Banasthali Aptitude Test'. You can find detailed eligibility on the official banasthali.org portal.",
        hostel:
          "Banasthali is fully residential. People on Reddit often discuss the simple lifestyle and the sense of sisterhood in the hostels.",
        contact:
          "You can reach the administration at info@banasthali.ac.in or check the official website for department-specific numbers.",
      };

    async function getAIResponse(input) {
    // Show a "Thinking..." message immediately
    const thinkingDiv = document.createElement("div");
    thinkingDiv.id = "ai-thinking";
    thinkingDiv.innerHTML = `<b style="color:#00e5ff">AI:</b> <i>Searching the web...</i>`;
    chatHistory.appendChild(thinkingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });
        
        const data = await response.json();
        
        // Remove thinking indicator
        const indicator = document.getElementById("ai-thinking");
        if (indicator) indicator.remove();

        // Return the 'reply' or an error string
        return data.reply || data.error || "I couldn't find an answer for that.";
    } catch (error) {
        const indicator = document.getElementById("ai-thinking");
        if (indicator) indicator.remove();
        return "Connection lost. Please check if server.js is running.";
    }
}
    // --- VOICE UTILITY ---
let lastSpokenLocation = "";



function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN');
    if (indianVoice) utterance.voice = indianVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.5;
    window.speechSynthesis.speak(utterance);
}

// --- EVENT LISTENERS (Keep these OUTSIDE the speak function) ---

// 1. Press 'c' to close the modal
// --- NEW COMBINED EVENT LISTENER ---
// --- SIMPLIFIED KEY LISTENER (No Distance Check) ---
document.addEventListener('keydown', (event) => {
    
    // 1. Press 'C' to close modal
    if (event.key === 'c' || event.key === 'C') {
        if (typeof window.closeModal === 'function') {
            window.closeModal();
        }
    }

    // 2. Press 'E' to Enter Diwakar Mandir (WORKS ANYWHERE)
    if ( event.key === 'E') {
        console.log("E pressed! Attempting to teleport...");
        
        // This command switches the page. 
        // MAKE SURE 'diwakar_interior.html' is the exact name of your file.
        window.location.href = 'diwakar_interior.html';
    }
});

// 2. Click to lock controls (re-enter the game)
document.addEventListener('click', () => {
    // Only lock if the modal is NOT open
    const infoModal = document.getElementById('info-modal');
    // Check if controls exists and if modal is hidden (or doesn't exist)
    if (typeof controls !== 'undefined' && !controls.isLocked) {
         if (!infoModal || infoModal.style.display === 'none') {
             controls.lock();
         }
    }
});
window.closeModal = function() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Force the game to take control again
    if (typeof controls !== 'undefined') {
        controls.lock(); 
    }
    
    console.log("Escape or Close triggered: Window hidden.");
};

// --- 1. CORE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaccff);
scene.fog = new THREE.Fog(0xaaccff, 50, 800);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 5, 750);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(50, 100, 50);
sun.castShadow = true;
scene.add(sun, new THREE.AmbientLight(0xffffff, 0.6));

// --- 2. CONTROLS ---
const controls = new THREE.PointerLockControls(camera, document.body);
const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const chatBox = document.getElementById("chat-container");

overlay.addEventListener("click", () => controls.lock());
  

// --- 3. ENVIRONMENT & ROADS ---

// 1. CHANGE ROAD COLORS HERE (Was 0x444444)
const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a }); 
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

const extendedMainRoad = new THREE.Mesh(new THREE.PlaneGeometry(20, 2000), roadMaterial);
extendedMainRoad.rotation.x = -Math.PI / 2;
extendedMainRoad.position.set(0, 0.05, -200);
scene.add(extendedMainRoad);

const sideRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(500, 20), roadMaterial);
sideRoad1.rotation.x = -Math.PI / 2;
sideRoad1.position.set(75, 0.06, 30);
scene.add(sideRoad1);

const sideRoad2 = new THREE.Mesh(new THREE.PlaneGeometry(500, 20), roadMaterial);
sideRoad2.rotation.x = -Math.PI / 2;
sideRoad2.position.set(75, 0.06, -100);
scene.add(sideRoad2);

const r2_left = new THREE.Mesh(new THREE.PlaneGeometry(500, 20), roadMat);
r2_left.rotation.x = -Math.PI / 2;
r2_left.position.set(-75, 0.06, -100);
scene.add(r2_left);

const sideRoad3 = new THREE.Mesh(new THREE.PlaneGeometry(500, 20), roadMaterial);
sideRoad3.rotation.x = -Math.PI / 2;
sideRoad3.position.set(75, 0.06, -250);
scene.add(sideRoad3);

const roadNursingRight = new THREE.Mesh(new THREE.PlaneGeometry(170, 20), roadMat);
roadNursingRight.rotation.x = -Math.PI / 2;
roadNursingRight.position.set(85, 0.06, 350);
scene.add(roadNursingRight);

const roadNursingLeft = new THREE.Mesh(new THREE.PlaneGeometry(150, 20), roadMat);
roadNursingLeft.rotation.x = -Math.PI / 2;
roadNursingLeft.position.set(-85, 0.06, 350);
scene.add(roadNursingLeft);

// 2. CHANGE FLOOR COLOR HERE (Was 0x3a6b35)
// I changed it to 0x0f200f (Very dark green)
const greenFloor = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshStandardMaterial({ color: 0x0f200f }));
greenFloor.rotation.x = -Math.PI / 2;
scene.add(greenFloor);

function createParallelRoad() {
    const roadGeo = new THREE.PlaneGeometry(20, 1000);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const parallelRoad = new THREE.Mesh(roadGeo, roadMat);
    parallelRoad.rotation.x = -Math.PI / 2;
    parallelRoad.position.set(290, 0.05, 0);
    scene.add(parallelRoad);
    const lineGeo = new THREE.PlaneGeometry(1, 1000);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(290, 0.07, 0);
    scene.add(line);
}
createParallelRoad();

// --- 4. HELPERS ---
function addLabel(parent, text, x, y, z, rotY = 0, color = "rgba(128, 0, 0, 0.9)") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 512; canvas.height = 128;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, 256, 80);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
  label.position.set(x, y, z);
  label.rotation.y = rotY;
  parent.add(label);
}

function createHindiLabel(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512; canvas.height = 128;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#a52a2a'; ctx.font = 'bold 60px Arial'; ctx.textAlign = 'center';
    ctx.fillText(text, 256, 85);
    return new THREE.Mesh(new THREE.PlaneGeometry(30, 8), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(canvas)}));
}

// --- 5. BUILDINGS ---

// MAIN GATE
// MAIN GATE & SIDE WALLS
      const gateGroup = new THREE.Group();
      const gateShape = new THREE.Shape();
      gateShape.moveTo(-15, 0);
      gateShape.lineTo(-15, 25);
      gateShape.lineTo(15, 25);
      gateShape.lineTo(15, 0);
      const gateHole = new THREE.Path();
      gateHole.moveTo(-8, 0);
      gateHole.lineTo(-8, 12);
      gateHole.quadraticCurveTo(0, 22, 8, 12);
      gateHole.lineTo(8, 0);
      gateShape.holes.push(gateHole);

      const gateArch = new THREE.Mesh(
        new THREE.ExtrudeGeometry(gateShape, { depth: 3, bevelEnabled: false }),
        new THREE.MeshStandardMaterial({ color: 0x8e8b66 })
      );
      gateGroup.add(gateArch);

      const wallMat = new THREE.MeshStandardMaterial({ color: 0x8e8b66 });
      const wallGeo = new THREE.BoxGeometry(200, 15, 2);
      const leftWall = new THREE.Mesh(wallGeo, wallMat);
      leftWall.position.set(-115, 7.5, 1.5);
      gateGroup.add(leftWall);
      const rightWall = new THREE.Mesh(wallGeo, wallMat);
      rightWall.position.set(115, 7.5, 1.5);
      gateGroup.add(rightWall);
      addLabel(gateGroup, "वनस्थली विद्यापीठ", 0, 20, 3.1, 0);
      gateGroup.position.set(0, 0, 700);
      scene.add(gateGroup);
function createMainGateSign(x, z) {
    const signGroup = new THREE.Group();
    const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 6);
    const leftLeg = new THREE.Mesh(legGeo, legMat); leftLeg.position.set(-4, 3, 0); signGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, legMat); rightLeg.position.set(4, 3, 0); signGroup.add(rightLeg);
    const boardGeo = new THREE.PlaneGeometry(10, 4);
    const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d");
    canvas.width = 512; canvas.height = 256; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#0055aa"; ctx.font = "bold 70px Arial"; ctx.textAlign = "center";
    ctx.fillText("आम रास्ता", 256, 110); ctx.fillText("नहीं है", 256, 200);
    const boardMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide });
    const board = new THREE.Mesh(boardGeo, boardMat); board.position.y = 5.5; signGroup.add(board);
    signGroup.position.set(x, 0, z); scene.add(signGroup);
}
createMainGateSign(-20, 725);

// NAV MANDIR
const nav = new THREE.Group();
const navCenter = new THREE.Mesh(new THREE.BoxGeometry(30, 35, 20), new THREE.MeshStandardMaterial({ color: 0xffffff }));
navCenter.position.y = 17.5; nav.add(navCenter);
const glassMat = new THREE.MeshStandardMaterial({ color: 0x0066cc, metalness: 0.9, roughness: 0.1 });
const glassWall = new THREE.Mesh(new THREE.PlaneGeometry(18, 30), glassMat); glassWall.position.set(0, 18, 10.1); nav.add(glassWall);
const wingMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
const leftWingNav = new THREE.Mesh(new THREE.BoxGeometry(20, 30, 15), wingMat); leftWingNav.position.set(-25, 15, -2); nav.add(leftWingNav);
const rightWingNav = new THREE.Mesh(new THREE.BoxGeometry(20, 30, 15), wingMat); rightWingNav.position.set(25, 15, -2); nav.add(rightWingNav);
const canopy = new THREE.Mesh(new THREE.BoxGeometry(22, 2, 10), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
canopy.position.set(0, 0, 14); nav.add(canopy);
nav.rotation.y = 0; nav.position.set(130, 0, -10); scene.add(nav);
addLabel(nav, "प्रभा मन्दिर", 0, 38, 10.2, 0);

// OPPOSITE DEPT
const oppositeDept = new THREE.Group();
const oppCenter = new THREE.Mesh(new THREE.BoxGeometry(30, 35, 20), new THREE.MeshStandardMaterial({ color: 0xffffff }));
oppCenter.position.y = 17.5; oppositeDept.add(oppCenter);
const oppGlassWall = new THREE.Mesh(new THREE.PlaneGeometry(18, 30), glassMat); oppGlassWall.position.set(0, 18, 10.1); oppositeDept.add(oppGlassWall);
const oppLeftWing = new THREE.Mesh(new THREE.BoxGeometry(20, 30, 15), wingMat); oppLeftWing.position.set(-25, 15, -2); oppositeDept.add(oppLeftWing);
const oppRightWing = new THREE.Mesh(new THREE.BoxGeometry(20, 30, 15), wingMat); oppRightWing.position.set(25, 15, -2); oppositeDept.add(oppRightWing);
const oppCanopy = new THREE.Mesh(new THREE.BoxGeometry(22, 2, 10), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
oppCanopy.position.set(0, 10, 14); oppositeDept.add(oppCanopy);
oppositeDept.rotation.y = Math.PI; oppositeDept.position.set(130, 0, 70); scene.add(oppositeDept);
addLabel(oppositeDept, "प्रज्ञा मन्दिर", 0, 38, 10.2, 0);

// APAJI INSTITUTE
const apaji = new THREE.Group();
      apaji.name = "apaji_building";
      const apajiMat = new THREE.MeshStandardMaterial({ color: 0x8e8b66 });
      const centerBlock = new THREE.Mesh(
        new THREE.BoxGeometry(40, 25, 20),
        apajiMat
      );
      centerBlock.position.y = 12.5;
      apaji.add(centerBlock);
      const leftWing = new THREE.Mesh(
        new THREE.BoxGeometry(20, 25, 40),
        apajiMat
      );
      leftWing.position.set(-30, 12.5, 0);
      apaji.add(leftWing);
      const rightWing = new THREE.Mesh(
        new THREE.BoxGeometry(20, 25, 40),
        apajiMat
      );
      rightWing.position.set(30, 12.5, 0);
      apaji.add(rightWing);
      const porch = new THREE.Mesh(
        new THREE.BoxGeometry(12, 2, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      porch.position.set(0, 12, 12);
      apaji.add(porch);

      for (let row = 0; row < 3; row++) {
        for (let col = -1; col <= 1; col++) {
          const win = new THREE.Mesh(
            new THREE.PlaneGeometry(5, 4),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
          );
          win.position.set(col * 12, 6 + row * 8, 10.1);
          apaji.add(win);
        }
      }
      apaji.rotation.y = -Math.PI / 2;
      apaji.position.set(150, 0, -195);
      scene.add(apaji); // Aligned with r2
      addLabel(apaji, "अपाजी संस्थान", 0, 30, 10.5, 0);
      // ... [Existing animate function ends here] ...

        // ==========================================
        // NEW INTERACTION CODE (The Binding)
        // ==========================================

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // This detects the click
       window.addEventListener('click', (event) => {
    // 1. Setup mouse coordinates
    if (controls.isLocked) {
        mouse.x = 0; mouse.y = 0;
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // 2. Raycast to find what we clicked
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        let buildingFound = "";

        // 3. Identify the building by its group name
        obj.traverseAncestors((ancestor) => {
            if (ancestor.name === "apaji_building") buildingFound = "apaji";
            if (ancestor.name === "post_office") buildingFound = "po";
            if (ancestor.name === "sbi_bank") buildingFound = "sbi";
        });

        // 4. Open the correct info window
        if (buildingFound === "apaji") {
            showApajiInfo();
        } else if (buildingFound === "po") {
            showPostOfficeInfo();
        } else if (buildingFound === "sbi") {
            showSBIInfo();
        }
    }
});
        // This opens the window
        // This function must be attached to 'window' to be "seen" by the button
        // This makes the function global so the HTML button 'onclick' can find it

    // Also update your show function to ensure it unlocks the mouse
    function showApajiInfo() {
        const modal = document.getElementById('info-modal');
        const content = document.getElementById('modal-content');
        
        content.innerText = "The Apaji Institute of Mathematics & Applied Computer Technology is one of the technology/engineering-focused units associated with Banasthali. It provides infrastructure like modern computer labs, servers, and high-speed internet for students and offers courses in tech and IT-related fields.";
        
        modal.style.display = 'block';
        
        // Voice feedback
        speak("Opening Apaji Institute information.");
        
        // Unlock the mouse so the cursor appears for clicking
        if (typeof controls !== 'undefined') {
            controls.unlock();
        }
    }
    // This listener waits for you to click the screen to start walking again
    controls.addEventListener('lock', function () {
        // Hide the overlay and the info-modal when you start walking
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('info-modal').style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        // Show the overlay again if you aren't in a modal
        const modal = document.getElementById('info-modal');
        if (modal.style.display !== 'block') {
            document.getElementById('overlay').style.display = 'block';
        }
    });
    function animate() {
    requestAnimationFrame(animate);

    // Movement ONLY works when the mouse is locked (walking mode)
    if (controls.isLocked) {
        // Your movement logic (velocity/direction) goes here
        updateMovement(); 
    }

    renderer.render(scene, camera);
}
   window.closeModal = function() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'none';
    
    // 1. Tell the browser to look at the main window again
    window.focus(); 

    // 2. Re-lock the mouse
    if (controls) {
        controls.lock(); 
    }
};

// VANI MANDIR
const vani = new THREE.Group();
const mainFacade = new THREE.Mesh(new THREE.BoxGeometry(80, 28, 20), new THREE.MeshStandardMaterial({ color: 0xeee8aa })); mainFacade.position.y = 14; vani.add(mainFacade);
const entrance = new THREE.Mesh(new THREE.BoxGeometry(20, 2, 8), new THREE.MeshStandardMaterial({ color: 0xa52a2a })); entrance.position.set(0, 12, 12); vani.add(entrance);
for (let row = 0; row < 3; row++) {
  for (let col = -3; col <= 3; col++) {
    if (col === 0 && row === 0) continue;
    const win = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    win.position.set(col * 10, 6 + row * 8, 10.1); vani.add(win);
  }
}
vani.rotation.y = -Math.PI / 2; vani.position.set(150, 0, -370); scene.add(vani);
addLabel(vani, "वाणी मन्दिर", 0, 32, 10.2, 0);
// --- 6. MOVEMENT CONTROLS (Fixed logic) ---
      const keys = {};

      // 1. UPDATED KEYDOWN LISTENER
      document.addEventListener("keydown", (e) => {
        // If user presses 'Enter' or 'C', release the mouse to allow typing
        if ((e.code === "Enter" || e.code === "KeyC") && controls.isLocked) {
          controls.unlock();
          // Small delay to ensure the browser has released the pointer before focusing
          setTimeout(() => {
            chatInput.focus();
          }, 100);
          return;
        }

        // Prevent W,A,S,D movement if the user is currently typing
        if (document.activeElement === chatInput) return;

        keys[e.code] = true;
      });

      // 2. UPDATED LOCK/UNLOCK EVENT LISTENERS
      controls.addEventListener("lock", () => {
        overlay.style.display = "none";
        hud.style.display = "block";
        chatBox.style.display = "flex";
        // Blur the input so keys don't get stuck in the box while walking
        chatInput.blur();
      });

      controls.addEventListener("unlock", () => {
        hud.style.display = "block";
      
      });

      // 3. STOP PROPAGATION (Crucial)
      // This prevents the game from re-locking the mouse the moment you click the input box
      chatBox.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });

      document.addEventListener("keyup", (e) => {
        keys[e.code] = false;
      });
      // This ensures that clicking inside the chat box doesn't trigger the game start
      chatInput.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });

     // Inside your <script> in tour.html
chatInput.addEventListener("keydown", async (e) => { // Added 'async'
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
        e.stopPropagation();
        
        const userMsg = chatInput.value;
        chatInput.value = "";
        
        // 1. Add User Message to History
        chatHistory.innerHTML += `<div><b style="color:#ffcc00">You:</b> ${userMsg}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // 2. WAIT for the AI Response
        const aiMsg = await getAIResponse(userMsg); // Added 'await'
        
        // 3. Add AI Message to History
        chatHistory.innerHTML += `<div><b style="color:#00e5ff">AI:</b> ${aiMsg}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // 4. Voice Utility
        speak(aiMsg);
    }
});

// POST OFFICE
function createPostOffice() {
    const poGroup = new THREE.Group();
    poGroup.name = "post_office"; // Added for interaction identification
    
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(new THREE.BoxGeometry(25, 12, 15), bodyMat); 
    body.position.y = 6; 
    poGroup.add(body);
    
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb22222 });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(26, 1, 16), roofMat); 
    roof.position.y = 12; 
    poGroup.add(roof);
    
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const door = new THREE.Mesh(new THREE.PlaneGeometry(4, 7), doorMat); 
    door.position.set(-2, 3.5, 7.51); 
    poGroup.add(door);
    
    const signCanvas = document.createElement("canvas"); 
    const signCtx = signCanvas.getContext("2d");
    signCanvas.width = 256; signCanvas.height = 128; 
    signCtx.fillStyle = "#ff0000"; signCtx.fillRect(0, 0, 256, 128);
    signCtx.fillStyle = "#ffff00"; signCtx.font = "bold 40px Arial"; signCtx.textAlign = "center";
    signCtx.fillText("POST", 128, 50); signCtx.fillText("OFFICE", 128, 100);
    
    const signBoard = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 4), 
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) })
    );
    signBoard.position.set(6, 8, 7.52); 
    poGroup.add(signBoard);
    
    poGroup.rotation.y = Math.PI / 2; 
    poGroup.position.set(-35, 0, 610); 
    scene.add(poGroup);
    
    addLabel(poGroup, "Post Office", 0, 16, 7.6, 0);
}
createPostOffice();
function showPostOfficeInfo() {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.innerText = "Banasthali Post Office";
    content.innerText = "A post office is a government or authorized organization that provides services related to mail, parcels, money, and public communication. Its main purpose is to help people send and receive letters, documents, and goods safely.";
    
    modal.style.display = 'block';
    speak("Welcome to the Post Office.");
    if (controls) controls.unlock();
}

// SBI
function createSBIFacility() {
    const sbiGroup = new THREE.Group();
    sbiGroup.name = "sbi_bank"; // Added for interaction identification
    
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const sbiBlue = new THREE.MeshStandardMaterial({ color: 0x00a9e0 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    
    const bankBody = new THREE.Mesh(new THREE.BoxGeometry(30, 18, 20), wallMat); 
    bankBody.position.y = 9; sbiGroup.add(bankBody);
    
    const header = new THREE.Mesh(new THREE.BoxGeometry(31, 4, 21), sbiBlue); 
    header.position.y = 16; sbiGroup.add(header);
    
    const bankGate = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), glassMat); 
    bankGate.position.set(0, 5, 10.1); sbiGroup.add(bankGate);
    
    for (let i = -1; i <= 1; i++) { 
        if (i === 0) continue; 
        const win = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), glassMat); 
        win.position.set(i * 10, 8, 10.1); sbiGroup.add(win); 
    }
    
    const bankCanvas = document.createElement("canvas"); 
    const bCtx = bankCanvas.getContext("2d");
    bankCanvas.width = 512; bankCanvas.height = 128; bCtx.fillStyle = "#00a9e0"; bCtx.fillRect(0, 0, 512, 128);
    bCtx.fillStyle = "white"; bCtx.font = "bold 50px Arial"; bCtx.textAlign = "center"; 
    bCtx.fillText("STATE BANK OF INDIA", 256, 80);
    
    const bankSign = new THREE.Mesh(new THREE.PlaneGeometry(22, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bankCanvas) }));
    bankSign.position.set(0, 16, 10.6); sbiGroup.add(bankSign);
    
    const atmGroup = new THREE.Group();
    const atmBody = new THREE.Mesh(new THREE.BoxGeometry(10, 12, 10), wallMat); 
    atmBody.position.set(25, 6, 0); atmGroup.add(atmBody);
    
    const atmGate = new THREE.Mesh(new THREE.PlaneGeometry(5, 8), glassMat); 
    atmGate.position.set(25, 4, 5.1); atmGroup.add(atmGate);
    
    const atmHeader = new THREE.Mesh(new THREE.BoxGeometry(11, 2, 11), sbiBlue); 
    atmHeader.position.set(25, 12, 0); atmGroup.add(atmHeader);
    
    const atmSignCanvas = document.createElement("canvas"); 
    const aCtx = atmSignCanvas.getContext("2d");
    atmSignCanvas.width = 256; atmSignCanvas.height = 128; aCtx.fillStyle = "#00a9e0"; aCtx.fillRect(0, 0, 256, 128);
    aCtx.fillStyle = "white"; aCtx.font = "bold 80px Arial"; aCtx.textAlign = "center"; 
    aCtx.fillText("ATM", 128, 90);
    
    const atmSign = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(atmSignCanvas) }));
    atmSign.position.set(25, 12, 5.6); atmGroup.add(atmSign); 
    
    sbiGroup.add(atmGroup);
    sbiGroup.rotation.y = Math.PI / 2; 
    sbiGroup.position.set(-50, 0, 550); 
    scene.add(sbiGroup);
    
    addLabel(sbiGroup, "SBI Bank", 0, 20, 0, 0);
}
function showSBIInfo() {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.innerText = "SBI Bank & ATM";
    content.innerText = "State Bank of India (SBI) is a multinational, public sector banking and financial services body. The campus branch provides full banking facilities for students and staff, including savings accounts, educational loans, and a 24/7 ATM service for cash withdrawals.";
    
    modal.style.display = 'block';
    speak("Welcome to State Bank of India. How can we help you today?");
    
    if (controls) controls.unlock();
}

// KVK
function createKrishiVigyanKendra() {
    const kvkGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
    const body = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 16), wallMat); body.position.y = 6; kvkGroup.add(body);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const door = new THREE.Mesh(new THREE.PlaneGeometry(5, 8), glassMat); door.position.set(-3, 4, 8.01); kvkGroup.add(door);
    const window = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), glassMat); window.position.set(5, 7, 8.01); kvkGroup.add(window);
    const stairMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    for (let i = 0; i < 3; i++) { const step = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 2), stairMat); step.position.set(-3, 0.25 + i * 0.5, 9 + i); kvkGroup.add(step); }
    const signCanvas = document.createElement("canvas"); const sCtx = signCanvas.getContext("2d");
    signCanvas.width = 512; signCanvas.height = 128; sCtx.fillStyle = "#ffcc00"; sCtx.fillRect(0, 0, 512, 128); sCtx.strokeStyle = "#003399"; sCtx.lineWidth = 15; sCtx.strokeRect(0, 0, 512, 128);
    sCtx.fillStyle = "#003399"; sCtx.font = "bold 38px Arial"; sCtx.textAlign = "center"; sCtx.fillText("कृषि विज्ञान केंद्र", 256, 60); sCtx.font = "bold 22px Arial"; sCtx.fillText("KRISHI VIGYAN KENDRA", 256, 100);
    const roofSign = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) }));
    roofSign.position.set(0, 14, 7.5); kvkGroup.add(roofSign);
    kvkGroup.rotation.y = Math.PI / 2; kvkGroup.position.set(-70, 0, 470); scene.add(kvkGroup);
}
createKrishiVigyanKendra();

// AROGYA MANDIR
function createArogyaMandir() {
    const hospitalGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(40, 15, 20), wallMat); mainBody.position.y = 7.5; hospitalGroup.add(mainBody);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(40.2, 0.5, 20.2), new THREE.MeshStandardMaterial({ color: 0x8b0000 })); trim.position.y = 14.8; hospitalGroup.add(trim);
    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(18, 1.5, 12), new THREE.MeshStandardMaterial({ color: 0xffffff })); porchRoof.position.set(0, 12, 12); hospitalGroup.add(porchRoof);
    const pillarGeo = new THREE.BoxGeometry(1, 12, 1);
    const p1 = new THREE.Mesh(pillarGeo, wallMat); p1.position.set(-8, 6, 17); hospitalGroup.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, wallMat); p2.position.set(8, 6, 17); hospitalGroup.add(p2);
    const signCanvas = document.createElement("canvas"); const sCtx = signCanvas.getContext("2d");
    signCanvas.width = 1024; signCanvas.height = 256; sCtx.fillStyle = "#111111"; sCtx.fillRect(0, 0, 1024, 256); sCtx.fillStyle = "#ffffff"; sCtx.font = "bold 80px Arial"; sCtx.textAlign = "center"; sCtx.fillText("आरोग्य मन्दिर", 512, 150);
    const topBanner = new THREE.Mesh(new THREE.PlaneGeometry(25, 6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas), side: THREE.DoubleSide }));
    topBanner.position.set(0, 18, 10.1); hospitalGroup.add(topBanner);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const mainEntrance = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), glassMat); mainEntrance.position.set(0, 5, 10.1); hospitalGroup.add(mainEntrance);
    const windowGeo = new THREE.PlaneGeometry(6, 5);
    const winLeft = new THREE.Mesh(windowGeo, glassMat); winLeft.position.set(-12, 8, 10.1); hospitalGroup.add(winLeft);
    const winRight = new THREE.Mesh(windowGeo, glassMat); winRight.position.set(12, 8, 10.1); hospitalGroup.add(winRight);
    hospitalGroup.rotation.y = Math.PI / 2; hospitalGroup.position.set(-60, 0, 420); scene.add(hospitalGroup);
}
createArogyaMandir();

// NURSING
function createNursingFaculty() {
    const nursingGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfffaf0 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(35, 18, 20), wallMat); body.position.y = 9; nursingGroup.add(body);
    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(15, 1, 10), new THREE.MeshStandardMaterial({ color: 0xffffff })); porchRoof.position.set(0, 10, 10); nursingGroup.add(porchRoof);
    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 10);
    const p1 = new THREE.Mesh(pillarGeo, wallMat); p1.position.set(-6, 5, 14); nursingGroup.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, wallMat); p2.position.set(6, 5, 14); nursingGroup.add(p2);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 });
    const entrance = new THREE.Mesh(new THREE.PlaneGeometry(6, 9), glassMat); entrance.position.set(0, 4.5, 10.1); nursingGroup.add(entrance);
    for (let y = 6; y <= 14; y += 6) { for (let x = -12; x <= 12; x += 8) { if (x === 0 && y === 6) continue; const win = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), glassMat); win.position.set(x, y, 10.1); nursingGroup.add(win); } }
    const signCanvas = document.createElement("canvas"); const sCtx = signCanvas.getContext("2d");
    signCanvas.width = 1024; signCanvas.height = 256; sCtx.fillStyle = "#008080"; sCtx.fillRect(0, 0, 1024, 256); sCtx.fillStyle = "white"; sCtx.font = "bold 70px Arial"; sCtx.textAlign = "center"; sCtx.fillText("FACULTY OF NURSING", 512, 120); sCtx.font = "40px Arial"; sCtx.fillText("नरसिंग संकाय", 512, 190);
    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) }));
    signBoard.position.set(0, 14, 10.2); nursingGroup.add(signBoard);
    nursingGroup.rotation.y = -Math.PI / 2; nursingGroup.position.set(50, 0, 390); scene.add(nursingGroup);
}
createNursingFaculty();

// ICICI
function createICICIATM() {
    const atmGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(15, 12, 12); const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeedca5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat); body.position.y = 6; atmGroup.add(body);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 }));
    glass.position.set(0, 4.5, 6.01); atmGroup.add(glass);
    const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d"); canvas.width = 512; canvas.height = 128;
    ctx.fillStyle = "#003399"; ctx.fillRect(0, 0, 512, 128); ctx.fillStyle = "white"; ctx.font = "bold 50px Arial"; ctx.textAlign = "center"; ctx.fillText("ICICI ATM", 256, 85);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }));
    banner.position.set(0, 11, 6.1); atmGroup.add(banner);
    const shed = new THREE.Mesh(new THREE.BoxGeometry(16, 0.2, 5), new THREE.MeshStandardMaterial({ color: 0x666666 }));
    shed.position.set(0, 9.5, 8); shed.rotation.x = 0.2; atmGroup.add(shed);
    atmGroup.position.set(-25, 0, -130); atmGroup.rotation.y = Math.PI / 2; scene.add(atmGroup);
}
createICICIATM();

// DIWAKAR MANDIR
function createDiwakarMandir() {
    const diwakar = new THREE.Group();
    diwakar.name = "Diwakar Mandir"; 
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0e2f44 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const centerBlock = new THREE.Mesh(new THREE.BoxGeometry(25, 30, 18), blueMat); centerBlock.position.y = 15; diwakar.add(centerBlock);
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(30, 25, 15), whiteMat); leftWing.position.set(-27, 12.5, -1); diwakar.add(leftWing);
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(30, 25, 15), whiteMat); rightWing.position.set(27, 12.5, -1); diwakar.add(rightWing);
    const entrance = new THREE.Mesh(new THREE.PlaneGeometry(12, 18), windowMat); entrance.position.set(0, 10, 9.1); diwakar.add(entrance);
    for (let side = -1; side <= 1; side += 2) { for (let row = 0; row < 2; row++) { for (let col = 0; col < 2; col++) { const win = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), windowMat); win.position.set(side * (20 + col * 12), 8 + row * 10, 6.6); diwakar.add(win); } } }
    diwakar.rotation.y = 0; diwakar.position.set(350, 0, -230); scene.add(diwakar);
    addLabel(diwakar, "दिवाकर मन्दिर", 0, 35, 9.2, 0);
}
createDiwakarMandir();

// MARKET BUILDINGS
function createRohitSnacksFacingRoad(atmX, atmZ) {
    const snacksGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 12), new THREE.MeshStandardMaterial({ color: 0xeedca5 })); body.position.y = 6; snacksGroup.add(body);
    const opening = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshStandardMaterial({ color: 0x222222 })); opening.position.set(0, 4.5, 6.01); snacksGroup.add(opening);
    const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d"); canvas.width = 512; canvas.height = 128; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 512, 128); ctx.fillStyle = "#003399"; ctx.font = "bold 38px Arial"; ctx.textAlign = "center"; ctx.fillText("ROHIT SNACKS & MILK", 256, 75);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })); banner.position.set(0, 11, 6.1); snacksGroup.add(banner);
    const shed = new THREE.Mesh(new THREE.BoxGeometry(21, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x444444 })); shed.position.set(0, 9.5, 8); shed.rotation.x = 0.2; snacksGroup.add(shed);
    snacksGroup.position.set(atmX - 30, 0, atmZ); snacksGroup.rotation.y = 0; scene.add(snacksGroup);
}
createRohitSnacksFacingRoad(-20, -130);

function createGanpatiGeneralStore(atmX, atmZ) {
    const shopGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(25, 12, 15), new THREE.MeshStandardMaterial({ color: 0xfdf5e6 })); body.position.y = 6; shopGroup.add(body);
    const entrance = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), new THREE.MeshStandardMaterial({ color: 0x222222 })); entrance.position.set(0, 4.5, -7.51); entrance.rotation.y = Math.PI; shopGroup.add(entrance);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1024; canvas.height = 256; ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 1024, 256); ctx.fillStyle = '#ffd700'; ctx.fillRect(0, 0, 1024, 80); ctx.fillStyle = '#000000'; ctx.font = 'bold 70px Arial'; ctx.textAlign = 'center'; ctx.fillText("GANPATI GENERAL STORE", 512, 160); ctx.font = 'bold 40px Arial'; ctx.fillText("PH: 8107272761", 512, 220);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(24, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })); banner.position.set(0, 11, -7.6); banner.rotation.y = Math.PI; shopGroup.add(banner);
    for(let i = 0; i < 5; i++) { const packet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.2), new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xff0000 : 0xffff00 })); packet.position.set(-8 + (i * 4), 8, -7.8); shopGroup.add(packet); }
    const shed = new THREE.Mesh(new THREE.BoxGeometry(26, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x555555 })); shed.position.set(0, 9.5, -10); shed.rotation.x = -0.2; shopGroup.add(shed);
    shopGroup.position.set(atmX - 30, 0, atmZ + 40); shopGroup.rotation.y = 0; scene.add(shopGroup);
}
createGanpatiGeneralStore(-30, -120);

function createGeneralStore(atmX, atmZ) {
    const shopGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 15), new THREE.MeshStandardMaterial({ color: 0xfdf5e6 })); body.position.y = 6; shopGroup.add(body);
    const entrance = new THREE.Mesh(new THREE.PlaneGeometry(18, 9), new THREE.MeshStandardMaterial({ color: 0x111111 })); entrance.position.set(0, 4.5, -7.51); entrance.rotation.y = Math.PI; shopGroup.add(entrance);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1024; canvas.height = 256; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1024, 256); ctx.strokeStyle = '#d32f2f'; ctx.lineWidth = 15; ctx.strokeRect(0, 0, 1024, 256); ctx.fillStyle = '#d32f2f'; ctx.font = 'bold 100px Arial'; ctx.textAlign = 'center'; ctx.fillText("GENERAL STORE", 512, 160);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(21, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })); banner.position.set(0, 11, -7.6); banner.rotation.y = Math.PI; shopGroup.add(banner);
    const shed = new THREE.Mesh(new THREE.BoxGeometry(24, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x444444 })); shed.position.set(0, 9.5, -10); shed.rotation.x = -0.2; shopGroup.add(shed);
    shopGroup.position.set(atmX - 30, 0, atmZ + 40); scene.add(shopGroup);
}
createGeneralStore(-65, -120);

function createAggarwalStore(atmX, atmZ) {
    const shopGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 15), new THREE.MeshStandardMaterial({ color: 0xe3f2fd })); body.position.y = 6; shopGroup.add(body);
    const entrance = new THREE.Mesh(new THREE.PlaneGeometry(19, 9.5), new THREE.MeshStandardMaterial({ color: 0x1a1a1a })); entrance.position.set(0, 4.75, -7.51); entrance.rotation.y = Math.PI; shopGroup.add(entrance);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1024; canvas.height = 256; ctx.fillStyle = '#ffeb3b'; ctx.fillRect(0, 0, 1024, 256); ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 15; ctx.strokeRect(0, 0, 1024, 256); ctx.fillStyle = '#1b5e20'; ctx.font = 'bold 80px Arial'; ctx.textAlign = 'center'; ctx.fillText("AGGARWAL STATIONARY & STORE", 512, 120); ctx.fillStyle = '#000000'; ctx.font = 'bold 40px Arial'; ctx.fillText("Books • Gifts • Office Supplies", 512, 200);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(21, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })); banner.position.set(0, 11, -7.6); banner.rotation.y = Math.PI; shopGroup.add(banner);
    const shed = new THREE.Mesh(new THREE.BoxGeometry(24, 0.2, 7), new THREE.MeshStandardMaterial({ color: 0x1a237e })); shed.position.set(0, 9.5, -10.5); shed.rotation.x = -0.2; shopGroup.add(shed);
    shopGroup.position.set(atmX - 30, 0, atmZ + 85); scene.add(shopGroup);
}
createAggarwalStore(-100,-165);

// SHANTA SAUDH
function createShantaSaudhFinal(x, z) {
    const saudhGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc }); const glassMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.6 }); const frameMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c }); const accentMat = new THREE.MeshStandardMaterial({ color: 0xa52a2a }); const doorMat = new THREE.MeshStandardMaterial({ color: 0x4e342e });
    const floorHeight = 12; const bWidth = 60; const bDepth = 25;
    for (let i = 0; i < 3; i++) {
        const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(bWidth, floorHeight, bDepth), wallMat); floorMesh.position.y = (floorHeight / 2) + (i * floorHeight); saudhGroup.add(floorMesh);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 0.2, 0.5, bDepth + 0.2), accentMat); stripe.position.y = (i + 1) * floorHeight; saudhGroup.add(stripe);
        for (let wx = -22; wx <= 22; wx += 11) {
            if (!(i === 0 && wx === 0)) addDetailedWindow(saudhGroup, wx, floorMesh.position.y, (bDepth / 2) + 0.1, 0, glassMat, frameMat);
            if (i > 0) addDetailedWindow(saudhGroup, wx, floorMesh.position.y, -(bDepth / 2) - 0.1, Math.PI, glassMat, frameMat);
        }
    }
    const doorGroup = new THREE.Group(); const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(9, 9.5, 0.5), frameMat); const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(8, 9, 0.6), doorMat); doorGroup.add(doorFrame, doorLeaf); doorGroup.position.set(0, 4.75, (bDepth / 2) + 0.2); saudhGroup.add(doorGroup);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1024; canvas.height = 256; ctx.fillStyle = 'white'; ctx.font = 'bold 90px "Arial"'; ctx.textAlign = 'center'; ctx.shadowColor = "black"; ctx.shadowBlur = 10; ctx.fillStyle = '#a52a2a'; ctx.fillText("श्री शांता सौध", 512, 160);
    const labelMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }); const labelPlane = new THREE.Mesh(new THREE.PlaneGeometry(35, 9), labelMat); labelPlane.position.set(0, 40, (bDepth / 2) + 0.5); saudhGroup.add(labelPlane);
    saudhGroup.rotation.y = Math.PI / 2; saudhGroup.position.set(x, 0, z); scene.add(saudhGroup);
}
function addDetailedWindow(parent, x, y, z, rotationY, glassMat, frameMat) { const winGroup = new THREE.Group(); const glass = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), glassMat); const frame = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7.5, 0.2), frameMat); winGroup.add(frame, glass); winGroup.position.set(x, y, z); winGroup.rotation.y = rotationY; parent.add(winGroup); }
createShantaSaudhFinal(-80, -20);

// SHANTA SADAM
function createShantaSadam(x, z) {
    const sadamGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfaf0e6 }); const glassMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.6 }); const frameMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c }); const accentMat = new THREE.MeshStandardMaterial({ color: 0xa52a2a }); const doorMat = new THREE.MeshStandardMaterial({ color: 0x4e342e });
    const floorHeight = 12; const bWidth = 60; const bDepth = 25;
    for (let i = 0; i < 3; i++) {
        const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(bWidth, floorHeight, bDepth), wallMat); floorMesh.position.y = (floorHeight / 2) + (i * floorHeight); sadamGroup.add(floorMesh);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 0.2, 0.5, bDepth + 0.2), accentMat); stripe.position.y = (i + 1) * floorHeight; sadamGroup.add(stripe);
        for (let wx = -22; wx <= 22; wx += 11) {
            if (!(i === 0 && wx === 0)) addDetailedWindow(sadamGroup, wx, floorMesh.position.y, (bDepth / 2) + 0.1, 0, glassMat, frameMat);
            if (i > 0) addDetailedWindow(sadamGroup, wx, floorMesh.position.y, -(bDepth / 2) - 0.1, Math.PI, glassMat, frameMat);
        }
    }
    const doorGroup = new THREE.Group(); const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(9, 9.5, 0.5), frameMat); const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(8, 9, 0.6), doorMat); doorGroup.add(doorFrame, doorLeaf); doorGroup.position.set(0, 4.75, (bDepth / 2) + 0.2); sadamGroup.add(doorGroup);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1024; canvas.height = 256; ctx.clearRect(0, 0, 1024, 256); ctx.fillStyle = '#a52a2a'; ctx.font = 'bold 100px "Arial"'; ctx.textAlign = 'center'; ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 10; ctx.fillText("श्री शांता सदम", 512, 160);
    const labelMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }); const labelPlane = new THREE.Mesh(new THREE.PlaneGeometry(35, 9), labelMat); labelPlane.position.set(0, 40, (bDepth / 2) + 0.5); sadamGroup.add(labelPlane);
    sadamGroup.rotation.y = -Math.PI / 2; sadamGroup.position.set(x, 0, z); scene.add(sadamGroup);
}
createShantaSadam(-150, -20);

// VYAYAMSHALA
function createVyayamshala() {
    const gymGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); const mainBody = new THREE.Mesh(new THREE.BoxGeometry(60, 20, 25), wallMat); mainBody.position.y = 10; gymGroup.add(mainBody);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c }); const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(35, 2, 15), wallMat); porchRoof.position.set(0, 18, 12); gymGroup.add(porchRoof);
    const leftAccent = new THREE.Mesh(new THREE.BoxGeometry(5, 18, 14.5), stoneMat); leftAccent.position.set(-15, 9, 12); gymGroup.add(leftAccent);
    const rightAccent = new THREE.Mesh(new THREE.BoxGeometry(5, 18, 14.5), stoneMat); rightAccent.position.set(15, 9, 12); gymGroup.add(rightAccent);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.6, metalness: 0.9 }); const glassWindow = new THREE.Mesh(new THREE.PlaneGeometry(25, 15), glassMat); glassWindow.position.set(0, 9, 12.6); gymGroup.add(glassWindow);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 512; canvas.height = 128; ctx.fillStyle = 'rgba(255, 255, 255, 0)'; ctx.fillRect(0, 0, 512, 128); ctx.fillStyle = '#444444'; ctx.font = 'bold 45px Arial'; ctx.textAlign = 'center'; ctx.fillText("अपाजी व्यायामशाला", 256, 80);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })); sign.position.set(0, 19.5, 19.6); gymGroup.add(sign);
    gymGroup.rotation.y = -Math.PI / 2; gymGroup.position.set(-200, 0, -200); scene.add(gymGroup);
}
createVyayamshala();
function createParallelRoad() {
    const roadGroup = new THREE.Group();
    
    // Road dimensions: Very long to pass both buildings, width of 40 units
    const roadWidth = 40;
    const roadLength = 600; 

    // 1. Road Surface (Dark Grey Asphalt)
    const roadMat = new THREE.MeshStandardMaterial({ 
        color: 0x333333, // Charcoal grey
        roughness: 0.8 
    });
    const roadBase = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, roadLength), roadMat);
    
    // Rotate to lie flat on the ground
    roadBase.rotation.x = -Math.PI / 2;
    roadGroup.add(roadBase);

    // 2. Road Markings (Yellow dashed line)
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffdb58 });
   
    for (let i = -roadLength/2; i < roadLength/2; i += 20) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(1, 10), stripeMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.y = 0.05; // Slightly above road to prevent flickering
        stripe.position.z = i; 
        roadGroup.add(stripe);
    }

    // 3. Positioning the Road
    // Based on your buildings being at x = -150 and x = -200, 
    // we place the road at x = -110 so it sits "in front" of the doors.
    roadGroup.position.set(-230, 0.01, -100); 
    
    scene.add(roadGroup);
}

// Call the function
createParallelRoad();

// VIDULA MAIDAN
function createVidulaMaidanPro() {
    const sportsGroup = new THREE.Group();
    const sandMaidan = new THREE.Mesh(new THREE.PlaneGeometry(350, 350), new THREE.MeshStandardMaterial({ color: 0xd2b48c })); sandMaidan.rotation.x = -Math.PI / 2; sandMaidan.position.y = -0.1; sportsGroup.add(sandMaidan);
    const baseGeo = new THREE.BoxGeometry(100, 3, 160); const baseMat = new THREE.MeshStandardMaterial({ color: 0x666666 }); const platform = new THREE.Mesh(baseGeo, baseMat); platform.position.y = 1.5; sportsGroup.add(platform);
    const courtMat = new THREE.MeshStandardMaterial({ color: 0x001a4d, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }); const darkCourt = new THREE.Mesh(new THREE.PlaneGeometry(94, 154), courtMat); darkCourt.rotation.x = -Math.PI / 2; darkCourt.position.y = 3.05; sportsGroup.add(darkCourt);
    function addProfessionalHoop(parent, x, z) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 20), new THREE.MeshStandardMaterial({color:0x111111})); pole.position.set(x, 10, z); const board = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 0.5), new THREE.MeshStandardMaterial({color:0xffffff})); board.position.set(x, 18, z + (z > 0 ? -1 : 1)); parent.add(pole, board); }
    addProfessionalHoop(sportsGroup, 0, 70); addProfessionalHoop(sportsGroup, 0, -70);
    sportsGroup.position.set(-350, 0, -200); scene.add(sportsGroup);
}
createVidulaMaidanPro();

// TREES
function createLushTree(x, z) {
    const treeGroup = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x4d2926 })); trunk.position.y = 4; treeGroup.add(trunk);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x1a4d1a });
    const leavesBottom = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 12), leafMat); leavesBottom.position.y = 9; treeGroup.add(leavesBottom);
    const leavesTop = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 12), leafMat); leavesTop.position.y = 12; treeGroup.add(leavesTop);
    treeGroup.position.set(x, 0, z); scene.add(treeGroup);
}
for (let z = 800; z > -1200; z -= 40) { if ((z < 30 && z > 0) || (z < -130 && z > -170) || (z < -330 && z > -370)) continue; createLushTree(-15, z); createLushTree(15, z); }

// ROHIT JUICE POINT
function createRohitJuicePointDetailed(atmX, atmZ) {
    const shopGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 12), new THREE.MeshStandardMaterial({ color: 0xeedca5 })); body.position.y = 6; shopGroup.add(body);
    const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d"); canvas.width = 1024; canvas.height = 256; ctx.fillStyle = "#003399"; ctx.fillRect(0, 0, 1024, 256); ctx.fillStyle = "white"; ctx.font = "bold 80px Arial"; ctx.textAlign = "center"; ctx.fillText("ROHIT GREENS AND JUICE POINT", 512, 110); ctx.font = "bold 50px Arial"; ctx.fillStyle = "#ffcc00"; ctx.fillText("ORANGE JUICE : 50/-", 512, 190);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })); banner.position.set(0, 11, 6.1); shopGroup.add(banner);
    const counter = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 3), new THREE.MeshStandardMaterial({ color: 0x8b4513 })); counter.position.set(0, 2, 6); shopGroup.add(counter);
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), new THREE.MeshStandardMaterial({ color: 0xffa500 })); poster.position.set(-8, 5, 6.02); shopGroup.add(poster);
    shopGroup.position.set(atmX - 60, 0, atmZ); shopGroup.rotation.y = 0; scene.add(shopGroup);
}
createRohitJuicePointDetailed(-30, -130);

// POOJA PHOTOSHOP
function createPoojaPhotoshopSimple(atmX, atmZ) {
    const shopGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfffdf5 }); const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 11, 0.5), wallMat); backWall.position.set(0, 5.5, -5); shopGroup.add(backWall);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(21, 0.5, 11), wallMat); roof.position.set(0, 11, 0); shopGroup.add(roof);
    const copier = new THREE.Mesh(new THREE.BoxGeometry(4, 3.5, 3), new THREE.MeshStandardMaterial({ color: 0x333333 })); copier.position.set(-6, 1.75, -2); shopGroup.add(copier);
    const counter = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 2), new THREE.MeshStandardMaterial({ color: 0xdddddd })); counter.position.set(-2, 1.5, 4); shopGroup.add(counter);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1024; canvas.height = 256; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1024, 256); ctx.strokeStyle = '#003399'; ctx.lineWidth = 15; ctx.strokeRect(0, 0, 1024, 256); ctx.fillStyle = '#003399'; ctx.font = 'bold 70px Arial'; ctx.textAlign = 'center'; ctx.fillText("POOJA PHOTOSHOP & SPORTS", 512, 110);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })); banner.position.set(0, 10.5, 5.1); shopGroup.add(banner);
    const shed = new THREE.Mesh(new THREE.BoxGeometry(22, 0.2, 5), new THREE.MeshStandardMaterial({ color: 0x666666 })); shed.position.set(0, 9, 7); shed.rotation.x = 0.2; shopGroup.add(shed);
    shopGroup.position.set(atmX - 95, 0, atmZ); shopGroup.rotation.y = 0; scene.add(shopGroup);
}
createPoojaPhotoshopSimple(-35, -130);

// ATITHI BHAWAN
// --- ATITHI BHAWAN GENERATOR ---
function createAtithiBhawan(x, z) {
    const atithiGroup = new THREE.Group();

    // 1. MAIN BUILDING STRUCTURE (Double Storey)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White/Cream
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 30), wallMat);
    mainBody.position.y = 10;
    atithiGroup.add(mainBody);

    // 2. DOORS & WINDOWS
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    
    // Main Entrance Door
    const door = new THREE.Mesh(new THREE.PlaneGeometry(8, 12), glassMat);
    door.position.set(0, 6, 15.1); // Front face
    atithiGroup.add(door);

    // Windows (Symmetrical on both floors)
    for (let floor = 0; floor < 2; floor++) {
        for (let side = -1; side <= 1; side++) {
            if (side === 0 && floor === 0) continue; // Skip for door
            const win = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), glassMat);
            win.position.set(side * 18, 6 + (floor * 10), 15.1);
            atithiGroup.add(win);
        }
    }

    // 3. FRONT LAWN (Green Area)
    const lawnGeo = new THREE.PlaneGeometry(70, 40);
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57 }); // Lush Green
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0.1, 35); // In front of building
    atithiGroup.add(lawn);

    // 4. FENCING (Around Building and Lawn)
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark Iron
    const fenceHeight = 4;
    
    function createFencePart(w, d, px, pz, rotY = 0) {
        const part = new THREE.Mesh(new THREE.BoxGeometry(w, fenceHeight, d), fenceMat);
        part.position.set(px, fenceHeight/2, pz);
        part.rotation.y = rotY;
        atithiGroup.add(part);
    }

    // Fence Perimeter
    createFencePart(74, 1, 0, 55);       // Front Wall
    createFencePart(1, 70, -36, 20);     // Left Wall
    createFencePart(1, 70, 36, 20);      // Right Wall
    createFencePart(74, 1, 0, -15.5);    // Back Wall

    // 5. MAIN GATE (Opening in front fence)
    const gateGeo = new THREE.BoxGeometry(15, 6, 1.2);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Wooden Gate
    const mainGate = new THREE.Mesh(gateGeo, gateMat);
    mainGate.position.set(0, 3, 55.2);
    atithiGroup.add(mainGate);

    // Label
    addLabel(atithiGroup, "ATITHI BHAWAN", 0, 25, 15, 0);

    // --- PLACEMENT NEAR NURSING ---
    // Nursing is at Z=390. We place Atithi Bhawan nearby.
    atithiGroup.position.set(x, 0, z);
    atithiGroup.rotation.y = -Math.PI / 2; // Facing the Main Road
    scene.add(atithiGroup);
}

// CALL THE FUNCTION
// X=100 (Right side of road), Z=350 (Near Nursing Faculty area)
createAtithiBhawan(100, 250);

// BUSES
function createBanasthaliMetaBuses() {
    // Bus Banane wala Helper Function
    function buildBus(x, z, busName) {
        const busGroup = new THREE.Group();

        // 1. MAIN CHASSIS (Yellow)
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.3 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(9, 11, 28), bodyMat);
        body.position.y = 6.5;
        busGroup.add(body);

        // 2. ORANGE/BROWN STRIPE (Photo style)
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.2, 27.8), stripeMat);
        stripe.position.y = 5.5;
        busGroup.add(stripe);

        // 3. WINDOWS (Glass)
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.6 });
        const windowArea = new THREE.Mesh(new THREE.BoxGeometry(8.2, 4.5, 20), glassMat);
        windowArea.position.set(0, 8.5, -2);
        busGroup.add(windowArea);

        // Front Windshield
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 0.2), glassMat);
        windshield.position.set(0, 8, 14.1);
        busGroup.add(windshield);

        // 4. BANASTHALI LABEL (Blue Strip on top)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512; canvas.height = 64;
        ctx.fillStyle = '#003399'; // Blue background
        ctx.fillRect(0, 0, 512, 64);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 35px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("BANASTHALI VIDYAPITH", 256, 45);

        const labelMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
        const label = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.5), labelMat);
        label.position.set(0, 11.2, 14.15);
        busGroup.add(label);

        // 5. WHEELS
        const wheelGeo = new THREE.CylinderGeometry(2, 2, 2, 16);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const wheelPositions = [[4,2,8], [-4,2,8], [4,2,-8], [-4,2,-8]];
        wheelPositions.forEach(p => {
            const w = new THREE.Mesh(wheelGeo, wheelMat);
            w.rotation.z = Math.PI/2;
            w.position.set(p[0], p[1], p[2]);
            busGroup.add(w);
        });

        busGroup.position.set(x, 0, z);
        scene.add(busGroup);
    }

    // --- EXECUTION ---
    
    // 1. Bus at Arogya Mandir (Main Road side)
    // X coordinate ko road ke hisaab se adjust karein (e.g., -40)
    buildBus(-2, 100, "Arogya_Bus");

    // 2. Bus at Vani Mandir (Main Road side)
    // Vani Mandir ka Z coordinate thoda piche hoga (e.g., -850)
    buildBus(-2, -200, "Vani_Bus");
}

createBanasthaliMetaBuses();

// BIG VIDULA MAIDAN
/**
 * BIG VIDULA MAIDAN - UPDATED TRACK & POSITION
 * Features: Sandy/Skin colored 400m track, Detailed Archery, 
 * Closer to the first Sports Complex.
 */
function createBigVidulaMaidanFinal(x, z) {
    const bigGroup = new THREE.Group();
    const totalWidth = 250;
    const totalDepth = 400;

    // 1. BASE (Main Ground Layer)
    const base = new THREE.Mesh(
        new THREE.PlaneGeometry(totalWidth, totalDepth), 
        new THREE.MeshStandardMaterial({ color: 0x90ee90 }) // Skin/Sand color
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.1;
    bigGroup.add(base);

    // 2. 400m RACING TRACK (Mitti/Skin Color)
    const trackCanvas = document.createElement('canvas');
    trackCanvas.width = 1024; trackCanvas.height = 2048;
    const tCtx = trackCanvas.getContext('2d');
    
    // Track Base Color (Thoda dark mitti/skin tone)
    tCtx.fillStyle = '#c5a381'; 
    tCtx.beginPath();
    tCtx.ellipse(512, 1024, 440, 940, 0, 0, Math.PI * 2);
    tCtx.fill();
    
    // Track White Lines
    tCtx.lineWidth = 15; tCtx.strokeStyle = 'rgba(255,255,255,0.6)'; 
    for(let i=0; i<3; i++) {
        tCtx.beginPath();
        tCtx.ellipse(512, 1024, 440 - (i*20), 940 - (i*20), 0, 0, Math.PI * 2);
        tCtx.stroke();
    }
    
    tCtx.fillStyle = '#5d4037'; tCtx.font = 'bold 70px Arial'; tCtx.textAlign = 'center';
    tCtx.fillText("400m MITTI TRACK", 512, 1900);

    const trackMat = new THREE.MeshStandardMaterial({ 
        map: new THREE.CanvasTexture(trackCanvas), 
        transparent: true,
        polygonOffset: true, polygonOffsetFactor: -1 
    });
    const track = new THREE.Mesh(new THREE.PlaneGeometry(230, 380), trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.y = 0.05;
    bigGroup.add(track);

    // 3. ARCHERY (Right-Back Corner)
    function createRealTarget(tx, tz) {
        const targetGroup = new THREE.Group();
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8), new THREE.MeshStandardMaterial({color: 0x444444}));
        stand.position.y = 4;
        targetGroup.add(stand);

        const colors = [0xffffff, 0x000000, 0x0000ff, 0xff0000, 0xffff00];
        for(let i = 0; i < 5; i++) {
            const ring = new THREE.Mesh(new THREE.CircleGeometry(4 - i*0.7, 32), new THREE.MeshStandardMaterial({color: colors[i]}));
            ring.position.z = 0.05 * i;
            targetGroup.add(ring);
        }
        targetGroup.position.set(tx, 6, tz);
        targetGroup.rotation.y = -0.3;
        bigGroup.add(targetGroup);
    }
    for(let i = 0; i < 3; i++) createRealTarget(85 + (i * 15), -180);

    // 4. IRON FENCING & DOUBLE GATES
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 });

    function addFencingWithGate(zPos, isFront) {
        for (let ix = -totalWidth/2; ix <= totalWidth/2; ix += 5) {
            if (Math.abs(ix) < 20) continue; 
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12), ironMat);
            rod.position.set(ix, 6, zPos);
            bigGroup.add(rod);
        }
        const rail = new THREE.Mesh(new THREE.BoxGeometry(totalWidth, 0.6, 0.6), ironMat);
        rail.position.set(0, 12, zPos);
        bigGroup.add(rail);

        const gate = new THREE.Mesh(new THREE.BoxGeometry(40, 10, 1), new THREE.MeshStandardMaterial({color: 0x000000}));
        gate.position.set(0, 5, zPos);
        bigGroup.add(gate);

        const board = createHindiLabel("विदुला मैदान");
        board.position.set(0, 14, zPos + (isFront ? 0.6 : -0.6));
        bigGroup.add(board);
    }

    // Side Walls
    function addSideFence(xPos) {
        for (let iz = -totalDepth/2; iz <= totalDepth/2; iz += 5) {
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12), ironMat);
            rod.position.set(xPos, 6, iz);
            bigGroup.add(rod);
        }
        const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, totalDepth), ironMat);
        sideRail.position.set(xPos, 12, 0);
        bigGroup.add(sideRail);
    }

    addFencingWithGate(totalDepth/2, true); 
    addFencingWithGate(-totalDepth/2, false);
    addSideFence(totalWidth/2);
    addSideFence(-totalWidth/2);

    // POSITIONING: Shifted closer to the first complex
    // Pehle -600 par tha, ab -400 par rakha hai (Sports complex ke kareeb)
    bigGroup.position.set(x, 0, z);
    scene.add(bigGroup);
}

function createHindiLabel(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512; canvas.height = 128;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#a52a2a'; ctx.font = 'bold 60px Arial'; ctx.textAlign = 'center';
    ctx.fillText(text, 256, 85);
    return new THREE.Mesh(new THREE.PlaneGeometry(30, 8), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(canvas)}));
}

// EXECUTE: X=-350 (Same line), Z=-400 (Closer to the -200 complex)
createBigVidulaMaidanFinal(-400, -550);

// PEETHAM HOSTEL
function createPeethamHostel(x, z) {
    const peethamGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x8e8b66 }); const winMat = new THREE.MeshStandardMaterial({ color: 0x222222 }); const accentMat = new THREE.MeshStandardMaterial({ color: 0x800000 }); const doorMat = new THREE.MeshStandardMaterial({ color: 0x4b2d1f });
    const floorHeight = 12; const bWidth = 55; const bDepth = 25;
    for (let i = 0; i < 2; i++) {
        const floor = new THREE.Mesh(new THREE.BoxGeometry(bWidth, floorHeight, bDepth), wallMat); floor.position.y = (floorHeight / 2) + (i * floorHeight); peethamGroup.add(floor);
        const trim = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 0.6, 1, bDepth + 0.6), accentMat); trim.position.y = (i * floorHeight) + floorHeight; peethamGroup.add(trim);
        for (let wx = -20; wx <= 20; wx += 10) { if (i === 0 && wx === 0) continue; const win = new THREE.Mesh(new THREE.PlaneGeometry(5, 7), winMat); win.position.set(wx, floor.position.y + 1, (bDepth / 2) + 0.1); peethamGroup.add(win); }
    }
    const gate = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), doorMat); gate.position.set(0, 5, (bDepth / 2) + 0.2); peethamGroup.add(gate);
    addLabel(peethamGroup, "PEETHAM", 0, 30, (bDepth / 2) + 1, 0);
    peethamGroup.rotation.y = Math.PI / 2; peethamGroup.position.set(x, 0, z); scene.add(peethamGroup);
}
createPeethamHostel(-200, 80);

// --- INTERACTION LOGIC ---
function createChaitanyamHostel(x, z) {
    const hostelGroup = new THREE.Group();

    // 1. MAIN STRUCTURE (Big Hostel Building)
    const buildingGeo = new THREE.BoxGeometry(60, 25, 30);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xFFF5E1 }); // Light Cream
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.y = 12.5;
    hostelGroup.add(building);

    // 2. ENTRANCE GATE (Facing the Road/Atithi Bhawan)
    const gateGeo = new THREE.BoxGeometry(10, 10, 2);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
    const gate = new THREE.Mesh(gateGeo, gateMat);
    // Road ki taraf face karne ke liye (Z-axis positive face par)
    gate.position.set(0, 5, 15.1); 
    hostelGroup.add(gate);

    // 3. HINDI NAME PLATE (Label)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024; canvas.height = 256;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#800000'; // Dark Red
    ctx.font = 'Bold 90px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('श्री शांता चैतन्यम्', 512, 160);

    const labelTex = new THREE.CanvasTexture(canvas);
    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 4),
        new THREE.MeshBasicMaterial({ map: labelTex, side: THREE.DoubleSide })
    );
    label.position.set(0, 13, 15.2);
    hostelGroup.add(label);

    // 4. WINDOWS (Hostel Look)
    const winGeo = new THREE.PlaneGeometry(2, 3);
    const winMat = new THREE.MeshStandardMaterial({ color: 0x8e8b66 });
    for (let floor = 0; floor < 3; floor++) {
        for (let side = -25; side <= 25; side += 8) {
            if (Math.abs(side) < 6 && floor === 0) continue; // Skip door area
            const win = new THREE.Mesh(winGeo, winMat);
            win.position.set(side, 6 + (floor * 7), 15.1);
            hostelGroup.add(win);
        }
    }

    // --- PLACEMENT: EXACTLY OPPOSITE ATITHI BHAWAN ---
    hostelGroup.position.set(x, 0, z);
    // Atithi Bhawan -Math.PI/2 par hai, toh ise Math.PI/2 karenge taaki face aamne-samne ho
    hostelGroup.rotation.y = Math.PI / 2; 

    scene.add(hostelGroup);
}

// CALLING: Atithi Bhawan (100, 250) ke samne road ke uss paar (-100, 250)
createChaitanyamHostel(-100, 250);

const interacter = new THREE.Raycaster();
const centerPoint = new THREE.Vector2(0, 0); 

function updateInteraction() {
    interacter.setFromCamera(centerPoint, camera);
    const hits = interacter.intersectObjects(scene.children, true);
    let lookingAtMandir = false;
    if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj.parent) {
            if (obj.name === "Diwakar Mandir") {
                lookingAtMandir = true;
                break;
            }
            obj = obj.parent;
        }
    }
    const hud = document.getElementById('hud-text');
    if (lookingAtMandir) {
        hud.style.display = 'block';
        hud.innerHTML = "<b>Diwakar Mandir</b><br>Press [E] to Enter Interior";
        if (keys["KeyE"]) {
             document.exitPointerLock();
             window.location.href = "diwakar_interior.html"; 
        }
    } else {
        hud.style.display = 'none';
    }
}function updateHUD() {
    const p = camera.position;
    const t = document.getElementById("location-text");
    let locEnglish = "";
    let locHindi = "";
    let welcomeMsg = "";

    // --- 1. DIWAKAR MANDIR (Super Sensitive & Priority) ---
    // X > 60 matlab road se halka sa right mudte hi trigger hoga
    // Z range ko -210 se -380 tak rakha hai (kaafi bada area)
    if (p.x > 60 && p.z < -210 && p.z > -380) {
        locEnglish = "Diwakar Mandir"; 
        locHindi = "दिवाकर मन्दिर";
        welcomeMsg = "Welcome to Diwakar Mandir.";
    }

    // --- 2. APAJI INSTITUTE (Ab iski range choti kar di hai) ---
    // Iski Z range sirf -150 se -210 tak hai
    else if (p.x > 60 && p.z < -140 && p.z >= -210) {
        locEnglish = "Apaji Institute"; 
        locHindi = "अपाजी संस्थान";
        welcomeMsg = "Welcome to Apaji Institute.";
    }

    // --- 3. PRABHA MANDIR ---
    else if (p.x > 70 && p.z < 30 && p.z > -40) {
        locEnglish = "Prabha Mandir"; locHindi = "प्रभा मन्दिर";
        welcomeMsg = "Welcome to Prabha Mandir.";
    }

    // --- 4. PRAGYA MANDIR ---
    else if (p.x > 70 && p.z < 120 && p.z > 40) {
        locEnglish = "Pragya Mandir"; locHindi = "प्रज्ञा मन्दिर";
        welcomeMsg = "Welcome to Pragya Mandir.";
    }

    // --- 5. POST OFFICE ---
    else if (p.x < -20 && p.z < 640 && p.z > 580) {
        locEnglish = "Post Office"; locHindi = "डाकघर";
        welcomeMsg = "Welcome to the Post Office.";
    }

    // --- 6. SBI BANK ---
    else if (p.x < -20 && p.z < 580 && p.z > 520) {
        locEnglish = "State Bank of India"; locHindi = "भारतीय स्टेट बैंक";
        welcomeMsg = "Welcome to State Bank of India.";
    }

    // --- 7. AROGYA MANDIR ---
    else if (p.x < -20 && p.z < 460 && p.z > 380) {
        locEnglish = "Arogya Mandir"; locHindi = "आरोग्य मन्दिर";
        welcomeMsg = "Welcome to Arogya Mandir.";
    }

    // --- 8. FACULTY OF NURSING ---
    else if (p.x > 20 && p.x < 70 && p.z < 420 && p.z > 360) {
        locEnglish = "Faculty of Nursing"; locHindi = "नरसिंग संकाय";
        welcomeMsg = "Welcome to the Faculty of Nursing.";
    }

    // --- 9. ATITHI BHAWAN ---
    else if (p.x > 20 && p.x < 70 && p.z < 310 && p.z > 190) {
        locEnglish = "Atithi Bhawan (Guest House)"; locHindi = "अतिथि भवन";
        welcomeMsg = "Welcome to Atithi Bhawan.";
    }

    // --- 10. SHANTA CHAITYAM HOSTEL ---
    else if (p.x < -20 && p.z < 310 && p.z > 190) {
        locEnglish = "Shree Shanta Chaitanyam Hostel"; locHindi = "श्री शांता चैतन्यम् छात्रावास";
        welcomeMsg = "Welcome to Shree Shanta Chaitanyam Hostel.";
    }

    // --- 11. SHANTA SAUDH ---
    else if (p.x < -20 && p.z < 30 && p.z > -70) {
        locEnglish = "Shree Shanta Saudh"; locHindi = "श्री शांता सौध";
        welcomeMsg = "Welcome to Shree Shanta Saudh.";
    }

    // --- 12. NEW MARKET ---
    else if (p.x < -20 && p.z < -50 && p.z > -130) {
        locEnglish = "New Market Shops"; locHindi = "न्यू मार्केट";
        welcomeMsg = "Welcome to New Market here you can find daily useful things.";
    }

    // --- 13. MUKHYA DWAR ---
    else if (Math.abs(p.x) < 40 && p.z > 680 && p.z < 780) {
        locEnglish = "Mukhya Dwar"; locHindi = "मुख्य द्वार";
        welcomeMsg = "Welcome to Mukhya Dwar of bansthali vidyapeeth.";
    }

    // --- 14. MAIN ROAD ---
    else if (Math.abs(p.x) < 20) {
        locEnglish = "Main Road"; locHindi = "मुख्य मार्ग";
    }

    // --- DEFAULT: BLANK ---
    else {
        locEnglish = ""; locHindi = "";
    }

    // --- RENDER HUD ---
    if (t) {
        if (locHindi === "") {
            t.style.display = "none";
        } else {
            t.style.display = "block";
            t.innerHTML = `
                <div style="padding: 10px; line-height: 1.4;">
                    <b style="color:white; font-size:1.3em; display:block; margin-bottom: 5px;">${locHindi}</b>
                    <span style="color:white; font-size:1.1em; font-weight: 500;">${locEnglish}</span>
                </div>`;
        }
    }

    // --- VOICE LOGIC ---
    if (locEnglish !== "" && locEnglish !== "Main Road" && lastSpokenLocation !== locEnglish) {
        speak(welcomeMsg);
        lastSpokenLocation = locEnglish;
    }

    if (locEnglish === "Main Road") {
        lastSpokenLocation = "";
    }
}
      // --- ROBOT & LOOP ---
      let robotCompanion;
      function createRobotCompanion() {
        const group = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.SphereGeometry(0.6, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 })
        );
        group.add(body);
        const visor = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.2, 0.2),
          new THREE.MeshBasicMaterial({ color: 0x00e5ff })
        );
        visor.position.set(0, 0.1, 0.5);
        group.add(visor);
        scene.add(group);
        return group;
      }
      robotCompanion = createRobotCompanion();

      const velocity = new THREE.Vector3();
      const direction = new THREE.Vector3();
      async function initMetaverseAPI() {
    const hud = document.getElementById("weather-hud");
    const hudTemp = document.getElementById("hud-temp");
    const hudDesc = document.getElementById("hud-desc");

    // Show/Hide HUD based on PointerLock (stays in the corner of your screen)
    controls.addEventListener('lock', () => { hud.style.display = 'block'; });
    controls.addEventListener('unlock', () => { hud.style.display = 'none'; });

    // --- BILLBOARD MESH CODE REMOVED FROM HERE ---

    // 1. Fetch API Data
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.4063&longitude=75.8715&current_weather=true');
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;

        // 2. Update the Bottom-Left HUD only
        hudTemp.innerText = `${temp}°C`;
        hudDesc.innerText = code > 3 ? "Cloudy / Overcast" : "Clear Skies";

        // --- CANVAS TEXTURE CODE REMOVED FROM HERE ---

        // 3. Sync Environment (Fog/Sky)
        if (code > 3 && scene.fog) {
            scene.fog.color.setHex(0x999999);
            scene.background.setHex(0x228b22);
        }

    } catch (err) {
        hudDesc.innerText = "Offline Mode";
        console.error("API Connection Failed", err);
    }
}
async function initMetaverseAPI() {
    const hud = document.getElementById("weather-hud");
    const hudTemp = document.getElementById("hud-temp");
    const hudDesc = document.getElementById("hud-desc");

    // Show/Hide HUD based on PointerLock (only show when playing)
    controls.addEventListener('lock', () => { hud.style.display = 'block'; });
    controls.addEventListener('unlock', () => { hud.style.display = 'none'; });

    // 1. Create the 3D Billboard Mesh in the world
    const boardGroup = new THREE.Group();
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0, 0, 0),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    screen.position.z = 0.51;
    screen.name = "WorldWeatherScreen"; // ID for later update
    boardGroup.add(frame, screen);
    boardGroup.position.set(30, 6, 650); // Near Main Gate
    scene.add(boardGroup);

    // 2. Fetch API Data & Update Visuals
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.4063&longitude=75.8715&current_weather=true');
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;

        // Update Top-Left HUD
        hudTemp.innerText = `${temp}°C`;
        hudDesc.innerText = code > 3 ? "Cloudy / Overcast" : "Clear Skies";

        
        ctx.fillStyle = "#800000"; ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = "#ffd700"; ctx.font = "bold 40px Arial"; ctx.textAlign = "center";
        ctx.fillText("BANASTHALI TEMP", 256, 80);
        ctx.fillStyle = "white"; ctx.font = "bold 100px Arial";
        ctx.fillText(`${temp}°C`, 256, 190);

        const texture = new THREE.CanvasTexture(canvas);
        screen.material.map = texture;
        screen.material.needsUpdate = true;

        // Sync Environment (Fog/Sky)
        if (code > 3) {
            scene.fog.color.setHex(0x546e7a);
            scene.background.setHex(0x546e7a);
        }

    } catch (err) {
        hudDesc.innerText = "Banasthali VIdayapith";
        console.error("API Connection Failed", err);
    }
}

// CALL THIS AT THE END OF YOUR SCRIPT
initMetaverseAPI();
function animate() {
        requestAnimationFrame(animate);

        if (controls.isLocked) {
          const delta = 0.016;

          velocity.x -= velocity.x * 50.0 * delta;
          velocity.z -= velocity.z * 50.0 * delta;

          direction.z =
            Number(keys["KeyW"] || false) - Number(keys["KeyS"] || false);
          direction.x =
            Number(keys["KeyD"] || false) - Number(keys["KeyA"] || false);
          direction.normalize();

          const walkSpeed = 2000.0;
          if (keys["KeyW"] || keys["KeyS"])
            velocity.z -= direction.z * walkSpeed * delta;
          if (keys["KeyA"] || keys["KeyD"])
            velocity.x -= direction.x * walkSpeed * delta;

          controls.moveRight(-velocity.x * delta);
          controls.moveForward(-velocity.z * delta);

          if (robotCompanion) {
            const targetPos = new THREE.Vector3(
              camera.position.x + 2,
              4.5,
              camera.position.z - 5
            );
            robotCompanion.position.lerp(targetPos, 0.1);
          }
          updateHUD();
        }
        renderer.render(scene, camera);
      }

      // Final Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 20, 10);
      scene.add(directionalLight);

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      animate();