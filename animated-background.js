// animated-background.js

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = "-1";
canvas.style.width = "100%";
canvas.style.height = "100%";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: null,
  y: null,
  radius: 120
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(173, 216, 230, 0.8)"; // light skyblue
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
      if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
      if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
    }

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

let particlesArray;

function init() {
  particlesArray = [];
  const numParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * (canvas.width - size * 2);
    const y = Math.random() * (canvas.height - size * 2);
    const directionX = (Math.random() - 0.5) * 1.5;
    const directionY = (Math.random() - 0.5) * 1.5;
    particlesArray.push(new Particle(x, y, directionX, directionY, size));
  }
}

function connect() {
  let opacity;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < 5000) {
        opacity = 1 - distance / 5000;
        ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`; // violet-ish
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }

  connect();
}

init();
animate();
