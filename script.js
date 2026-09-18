/**
 * DONO RAHIMOVA — 3D LIQUID GLASS & HOLOGRAPHIC PORTFOLIO JAVASCRIPT
 * Features:
 * - Three.js WebGL 3D Canvas Scene with Particle Constellations & Floating 3D Geometric Meshes
 * - Interactive 3D Rotating Glass Cube (Auto-spin, Mouse/Touch Drag, Face snapping)
 * - 3D Card Tilt with Specular Lighting & Parallax Layer Depth
 * - 3D Flip Project Cards (Front visual preview <-> Back Prompt Blueprint)
 * - Scroll Progress Indicator & IntersectionObserver Reveal Animations
 * - Interactive Prompt Playground
 * - Complete Multilingual Support (UZ / RU / EN)
 * - Functional Contact Form & Quick Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THREE.JS REAL WEBGL 3D CANVAS SCENE
     ========================================================================== */
  const initThreeJsScene = () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1.1 Particle Constellation
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#ec4899'); // Neon Pink
    const color2 = new THREE.Color('#8b5cf6'); // Neon Violet
    const color3 = new THREE.Color('#06b6d4'); // Neon Cyan

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 1.2 Floating 3D Geometric Wireframe Torus Knot & Crystals
    const torusKnotGeo = new THREE.TorusKnotGeometry(5, 1.4, 100, 16);
    const torusKnotMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    torusKnot.position.set(18, -4, -10);
    scene.add(torusKnot);

    const icosahedronGeo = new THREE.IcosahedronGeometry(4, 0);
    const icosahedronMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    icosahedron.position.set(-16, 6, -8);
    scene.add(icosahedron);

    const octahedronGeo = new THREE.OctahedronGeometry(3, 0);
    const octahedronMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const octahedron = new THREE.Mesh(octahedronGeo, octahedronMat);
    octahedron.position.set(12, 12, -15);
    scene.add(octahedron);

    // Parallax mouse variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Window Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow idle particle rotation
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Rotate floating geometric shapes
      torusKnot.rotation.x = elapsedTime * 0.2;
      torusKnot.rotation.y = elapsedTime * 0.25;

      icosahedron.rotation.x = elapsedTime * 0.15;
      icosahedron.rotation.z = elapsedTime * 0.18;

      octahedron.rotation.y = elapsedTime * 0.22;
      octahedron.rotation.z = elapsedTime * 0.12;

      // Mouse Parallax Lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Scroll Parallax
      const scrollY = window.scrollY || 0;
      const scrollProgress = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

      camera.position.x = targetX * 3;
      camera.position.y = -targetY * 3 - scrollProgress * 10;
      camera.lookAt(0, -scrollProgress * 10, 0);

      renderer.render(scene, camera);
    };

    animate();
  };

  initThreeJsScene();

  /* ==========================================================================
     2. SCROLL PROGRESS INDICATOR & HEADER BLUR
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = (scrollY / docHeight) * 100;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPct))}%`;
    }

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     4. INTERACTIVE 3D ROTATING GLASS CUBE
     ========================================================================== */
  const cubeViewport = document.getElementById('cube-viewport');
  const cube3d = document.getElementById('cube-3d');
  const cubeAutoRotateBtn = document.getElementById('cube-autorotate-btn');
  const spinBtnText = document.getElementById('spin-btn-text');
  const faceBtns = document.querySelectorAll('.face-btn');

  let isAutoRotating = true;
  let cubeRotX = -15;
  let cubeRotY = 25;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  // Face rotation orientations
  const faceRotations = {
    front: { x: 0, y: 0 },
    right: { x: 0, y: -90 },
    back: { x: 0, y: -180 },
    left: { x: 0, y: 90 },
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 }
  };

  const updateCubeTransform = () => {
    if (cube3d) {
      cube3d.style.transform = `rotateX(${cubeRotX}deg) rotateY(${cubeRotY}deg)`;
    }
  };

  // Auto rotation tick
  const cubeAutoSpinLoop = () => {
    if (isAutoRotating && !isDragging) {
      cubeRotY += 0.45;
      cubeRotX = -15 + Math.sin(Date.now() * 0.001) * 8;
      updateCubeTransform();
    }
    requestAnimationFrame(cubeAutoSpinLoop);
  };
  cubeAutoSpinLoop();

  // Drag controls (Pointer Events for Touch & Mouse)
  if (cubeViewport) {
    cubeViewport.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      cubeViewport.setPointerCapture(e.pointerId);
    });

    cubeViewport.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      cubeRotY += deltaX * 0.5;
      cubeRotX -= deltaY * 0.5;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      updateCubeTransform();
    });

    const stopDragging = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          cubeViewport.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    cubeViewport.addEventListener('pointerup', stopDragging);
    cubeViewport.addEventListener('pointercancel', stopDragging);
  }

  // Auto-rotate Toggle
  if (cubeAutoRotateBtn) {
    cubeAutoRotateBtn.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      if (isAutoRotating) {
        cubeAutoRotateBtn.classList.add('active');
        if (spinBtnText) spinBtnText.textContent = getTranslation('cube_spin_on');
      } else {
        cubeAutoRotateBtn.classList.remove('active');
        if (spinBtnText) spinBtnText.textContent = getTranslation('cube_spin_off');
      }
    });
  }

  // Face Snap Buttons
  faceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const face = btn.getAttribute('data-face');
      if (faceRotations[face]) {
        isAutoRotating = false;
        if (cubeAutoRotateBtn) {
          cubeAutoRotateBtn.classList.remove('active');
          if (spinBtnText) spinBtnText.textContent = getTranslation('cube_spin_off');
        }

        faceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cubeRotX = faceRotations[face].x;
        cubeRotY = faceRotations[face].y;
        if (cube3d) {
          cube3d.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          updateCubeTransform();
          setTimeout(() => {
            if (cube3d) cube3d.style.transition = 'transform 0.1s ease-out';
          }, 650);
        }
      }
    });
  });

  /* ==========================================================================
     5. 3D TILT ON HOLO HERO CARD & TILT ITEMS
     ========================================================================== */
  const tiltContainer = document.getElementById('tilt-container');
  const holoCard = document.getElementById('holo-card');
  const specular = document.getElementById('glass-specular');

  if (tiltContainer && holoCard) {
    tiltContainer.addEventListener('mousemove', (e) => {
      const rect = tiltContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      holoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Dynamic specular light reflection angle
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;
      holoCard.style.setProperty('--specular-angle', `${angle}deg`);

      // Parallax inner layers
      const depthLayers = holoCard.querySelectorAll('.layer-depth');
      depthLayers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth') || 20);
        const transX = ((x - centerX) / centerX) * (depth * 0.25);
        const transY = ((y - centerY) / centerY) * (depth * 0.25);
        layer.style.transform = `translate3d(${transX}px, ${transY}px, ${depth}px)`;
      });
    });

    tiltContainer.addEventListener('mouseleave', () => {
      holoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      holoCard.style.setProperty('--specular-angle', '130deg');

      const depthLayers = holoCard.querySelectorAll('.layer-depth');
      depthLayers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth') || 20);
        layer.style.transform = `translate3d(0, 0, ${depth}px)`;
      });
    });
  }

  // General .tilt-item cards
  const tiltItems = document.querySelectorAll('.tilt-item');
  tiltItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -8;
      const rotY = ((x - centerX) / centerX) * 8;

      item.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      item.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      item.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ==========================================================================
     6. 3D FLIP PROJECT CARDS
     ========================================================================== */
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    // Click on flip trigger or front card
    const triggerBtn = card.querySelector('.flip-trigger-btn');
    const backCloseBtn = card.querySelector('.btn-flip-back');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.add('flipped');
      });
    }

    if (backCloseBtn) {
      backCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
    }

    // Toggle on double-click or card body click
    card.addEventListener('click', (e) => {
      // If clicking interactive child buttons/links, ignore
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input')) return;
      card.classList.toggle('flipped');
    });
  });

  // Copy prompt inside flipped card
  const copyBackBtns = document.querySelectorAll('.btn-copy-back');
  copyBackBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(getTranslation('toast_prompt_copied'));
          btn.textContent = 'Nusxalandi! ✓';
          setTimeout(() => {
            btn.textContent = 'Nusxalash';
          }, 2000);
        });
      }
    });
  });

  /* ==========================================================================
     7. PORTFOLIO FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.flip-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     8. INTERACTIVE PROMPT PLAYGROUND
     ========================================================================== */
  const promptTabs = document.querySelectorAll('.play-tab');
  const promptCodeOutput = document.getElementById('prompt-code-output');
  const promptExplanation = document.getElementById('prompt-explanation');
  const promptCatBadge = document.getElementById('prompt-category-badge');
  const toolLabel = document.getElementById('playground-tool-label');
  const btnCopyPrompt = document.getElementById('btn-copy-prompt');

  const promptDatabase = {
    bot: {
      tool: 'Claude 3.5 Sonnet / OpenAI GPT-4o API',
      category: 'Telegram Bot AI',
      code: `// SYSTEM PROMPT ARXITEKTURASI
You are an advanced enterprise Telegram AI Assistant for a premier brand.
Language fluency: Automatically match client language (Uzbek, English, Russian).
Tone: Warm, consultative, precise, highly efficient.

Rules:
1. Parse customer intent into: [ORDER], [SUPPORT_INQUIRY], [PRICING], [FEEDBACK].
2. For orders: request (item_name, quantity, delivery_address, phone).
3. If uncertain, verify with user before triggering external database query.
4. Output cleanly formatted Markdown suitable for Telegram chat bubbles.`,
      explanation: 'Ushbu prompt mijoz so\'rovlarini avtomatlashtiradi, xatoliklarsiz buyurtma qabul qiladi va 3 tilda muammosiz muloqot qiladi.'
    },
    art: {
      tool: 'Midjourney v6.0 / Flux.1 Dev',
      category: 'Generativ Rasm & Visual Art',
      code: `/imagine prompt: Bioluminescent crystal lotus flowers blooming inside an ancient obsidian subterranean cave, glowing neon magenta and cyan iridescent refractive petals, crystalline dew drops, cinematic volumetric atmospheric god rays, octane render 8k UHD, photorealistic textures --ar 16:9 --style raw --v 6.0 --q 2`,
      explanation: 'Ushbu parametrlar yorug\'lik nurlari, shaffof kristall sinishi va 8K o\'ta aniq fotorealistik tijoriy san\'at yaratishga imkon beradi.'
    },
    cartoon: {
      tool: 'Runway Gen-3 Alpha / Luma Dream Machine',
      category: '3D Multfilm & Animatsiya',
      code: `Camera smooth slow push-in: An adorable fluffy blue creature adventurer exploring a magical bioluminescent forest, holding a warm glowing lantern, Pixar style 3D character design, expressive golden curious eyes, whimsical magical atmosphere, 60fps cinematic render --motion 5`,
      explanation: 'Kameraning sekin yaqinlashishi va qahramonning samimiy emotsiyalari bilan yuqori sifatli 3D multfilm epizodi generatsiya qilinadi.'
    },
    reels: {
      tool: 'Viral Hook & AI Reel Blueprint',
      category: 'Instagram Viral Reel',
      code: `[00:00 - 00:03]: VISUAL HOOK (Kutilmagan transformatsiya: Shaffof holographic interfeys ekranda yonadi)
[VOICEOVER]: "Bu kiyimlarni hech bir dizayner qo'lda chizmagan — barchasi AI yordamida yaratildi!"
[00:03 - 00:15]: DYNAMIC CUTS (3 xil neon moda obrazlari 0.8 soniya ritmida almashadi)
[00:15 - 00:20]: CALL TO ACTION: "To'liq prompt formulasini olish uchun izohlarda 'MODA' deb yozing!"`,
      explanation: 'Birinchi 3 soniyadagi e\'tiborni ushlash mexanizmi va kommentariya faolligini 5 baravarga oshiruvchi konversiya zanjiri.'
    }
  };

  const updatePlayground = (categoryKey) => {
    const data = promptDatabase[categoryKey];
    if (!data) return;

    if (toolLabel) toolLabel.textContent = `Model: ${data.tool}`;
    if (promptCatBadge) promptCatBadge.textContent = `Kategoriya: ${data.category}`;
    if (promptCodeOutput) promptCodeOutput.textContent = data.code;
    if (promptExplanation) {
      promptExplanation.innerHTML = `<strong>Natija:</strong> ${data.explanation}`;
    }
  };

  promptTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      promptTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      updatePlayground(cat);
    });
  });

  // Initial load
  updatePlayground('bot');

  if (btnCopyPrompt) {
    btnCopyPrompt.addEventListener('click', () => {
      if (promptCodeOutput) {
        navigator.clipboard.writeText(promptCodeOutput.textContent).then(() => {
          showToast(getTranslation('toast_prompt_copied'));
          const copyTextSpan = document.getElementById('copy-prompt-text');
          if (copyTextSpan) {
            copyTextSpan.textContent = 'Nusxalandi! ✓';
            setTimeout(() => {
              copyTextSpan.textContent = 'Nusxa olish';
            }, 2000);
          }
        });
      }
    });
  }

  /* ==========================================================================
     9. TYPEWRITER EFFECT
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter');
  let typeIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  const typewriterPhrases = {
    uz: [
      'Telegram Botlar Arxitekturasi',
      'Generativ Rasm & Visual Art',
      '3D Multfilm & Video Generatsiyasi',
      'Instagram Viral Reels & SMM',
      'Najot Ta\'lim Prompt Muhandisi'
    ],
    ru: [
      'Архитектура Telegram ботов',
      'Генеративное AI искусство & Арт',
      '3D Мультфильмы и Видео генерация',
      'Вирусные Reels и SMM в Instagram',
      'Инженер Промптов Najot Ta\'lim'
    ],
    en: [
      'Telegram Bot Architecture',
      'Generative AI Art & Imagery',
      '3D Animation & Video Generation',
      'Instagram Viral Reels & SMM',
      'Najot Ta\'lim Prompt Engineer'
    ]
  };

  let currentLang = 'uz';

  const typeLoop = () => {
    const phrases = typewriterPhrases[currentLang] || typewriterPhrases.uz;
    const currentPhrase = phrases[typeIndex % phrases.length];

    if (isDeleting) {
      charIndex--;
      typingSpeed = 45;
    } else {
      charIndex++;
      typingSpeed = 90;
    }

    if (typewriterElement) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typeIndex++;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeLoop, typingSpeed);
  };
  typeLoop();

  /* ==========================================================================
     10. MULTILINGUAL SUPPORT (UZ / RU / EN)
     ========================================================================== */
  const i18nDictionary = {
    uz: {
      nav_home: 'Bosh sahifa',
      nav_cube: '3D Ekosistema',
      nav_services: 'Yo\'nalishlar',
      nav_portfolio: 'Flip Loyihalar',
      nav_playground: 'Prompt Lab',
      nav_about: 'Men haqimda',
      nav_contact: 'Bog\'lanish',
      call_action: 'Qo\'ng\'iroq',
      hero_status: 'Yangi loyihalar uchun ochiq',
      hero_greeting: 'Salom, men',
      hero_type_prefix: 'Mutaxassislik:',
      hero_desc: 'Zamonaviy AI modellarini biznes va kreativ industriyaga integratsiya qiluvchi Prompt Muhandisi. Sun\'iy intellekt orqali mukammal Telegram botlar, fotorealistik tasvirlar, 3D multfilm animatsiyalari hamda yuqori konversiyali Instagram kontentlarini yarataman.',
      btn_projects: 'Flip Loyihalarni ko\'rish',
      stat_bots: 'BOTLAR',
      stat_art: 'AI ART',
      stat_video: 'REELS/VIDEO',
      card_btn_follow: 'Kuzatish',
      card_btn_msg: 'Xabar',
      cube_tag: '3D INTERAKTIV TAJRIBA',
      cube_title_1: 'Aylanuvchi',
      cube_title_2: '3D Shisha Kub',
      cube_sub: 'Sichqoncha yoki barmoq yordamida kubni ushlab aylantiring va mutaxassislikning 6 ta tomonini o\'rganing',
      cube_spin_on: 'Avto-Aylanish: Yoqilgan',
      cube_spin_off: 'Avto-Aylanish: O\'chirilgan',
      serv_tag: 'XIZMATLAR & IMKONIYATLAR',
      serv_title_1: 'Asosiy',
      serv_title_2: 'Yo\'nalishlarim',
      serv_sub: 'Zamonaviy neyron tarmoqlar yordamida har qanday g\'oyani yuqori sifatli mahsulotga aylantiring',
      serv_1_name: 'Turli xil Telegram Botlar',
      serv_1_desc: 'AI integratsiyalashgan aqlli chat-botlar, savdo va buyurtma botlari, mijozlarga avtomatik xizmat ko\'rsatish (support), tahliliy va to\'lov tizimlariga ulangan murakkab Telegram botlar.',
      serv_2_name: 'Generatsiya Rasm va San\'at',
      serv_2_desc: 'Midjourney v6, Flux, Stable Diffusion va DALL-E orqali fotorealistik reklama tasvirlari, brending grafikalari, mahsulot 3D renderlari va san\'at konseptlarini yaratish.',
      serv_3_name: 'Multfilm & Video Generatsiyasi',
      serv_3_desc: '3D multfilm animatsiyalari, personajlar dizayni, ssenariy bo\'yicha dinamik qisqa filmlar, Runway Gen-3 va Luma yordamida yuqori sifatli harakatli video roliklar.',
      serv_4_name: 'Instani Yurgizish & SMM',
      serv_4_desc: 'Instagram sahifalarini noldan kreativ yuritish, AI yordamida trenddagi viral Reels roliklar, professional vizual grid uslubi, target auditoriyani jalb qilish va kontent-reja.',
      port_tag: '3D FLIP KARTALAR',
      port_title_1: 'Flip',
      port_title_2: 'Loyihalar Galereyasi',
      port_sub: 'Kartaning orqasini o\'girish (Flip) orqali yashirin prompt formulasini va texnologiyalarni ko\'ring',
      filter_all: 'Barchasi',
      filter_bot: 'Telegram Botlar',
      filter_art: 'Generativ Rasm',
      filter_cartoon: '3D Multfilm',
      filter_insta: 'Instagram SMM',
      play_tag: 'INTERAKTIV PROMPT LAB',
      play_title_1: 'Prompt Qanday',
      play_title_2: 'Mo\'jiza Yaratadi?',
      play_sub: 'Toifalardan birini tanlang va Dono Rahimova uslubidagi professional prompt arxitekturasini sinab ko\'ring',
      about_tag: 'PROFIL & TA\'LIM',
      about_title_1: 'Men haqimda &',
      about_title_2: 'Mening Missiyam',
      about_sub: 'Murakkab sun\'iy intellekt modellarini inson g\'oyalari bilan bog\'laydigan ko\'prik',
      about_story_badge: 'Ijodiy Falsafa',
      about_story_title: 'Prompt Engineering — bu shunchaki buyruq yozish emas, bu kelajak tilidir.',
      about_story_p1: 'Men Dono Rahimova, O\'zbekistondagi nufuzli Najot Ta\'lim akademiyasida chuqur bilim va amaliy ko\'nikmalarni egallagan professional Prompt Engineer va AI kontent yaratuvchisiman.',
      about_story_p2: 'Mening maqsadim — zamonaviy sun\'iy intellekt qudrati orqali kompaniyalar va shaxslar uchun biznes jarayonlarni avtomatlashtirish, Telegram botlar yaratish va dunyo miqyosidagi vizual kontentlarni taqdim etish.',
      about_langs_title: 'Muloqot va Prompt Tillarim:',
      about_academy_label: 'Akademiya & Malaka',
      about_academy_desc: 'Prompt Engineering va AI texnologiyalari bo\'yicha intensiv amaliy dastur bitiruvchisi.',
      about_flow_label: 'Tezkor Natija',
      about_flow_title: 'Iterativ & Aniq Yondashuv',
      about_flow_desc: 'Mijoz talabiga ko\'ra bir necha variantda sinovdan o\'tgan, yuqori sifatli natijalar kafolati.',
      about_auto_label: 'Biznes Avtomatlashtirish',
      about_auto_title: '24/7 Aqlli Botlar',
      about_auto_desc: 'Mijozlar bilan doimiy aloqa va savdo konversiyasini oshiruvchi Telegram ekotizimlari.',
      contact_tag: 'BOG\'LANISH VA HAMKORLIK',
      contact_title_1: 'Loyiha Bormi?',
      contact_title_2: 'Birgalikda Yaratamiz!',
      contact_sub: 'Savollaringiz bormi yoki yangi loyiha boshlamoqchimisiz? Men bilan qulay usulda bog\'laning',
      contact_phone_label: 'Telefon qo\'ng\'iroq:',
      contact_phone_hint: 'Har kuni 09:00 dan 21:00 gacha',
      contact_tg_hint: 'Tezkor javob berish kafolatlangan',
      contact_insta_hint: 'AI san\'ati va yangi ishlarim',
      form_title: 'Xabar Yuborish',
      form_desc: 'Ma\'lumotlaringizni qoldiring, tez orada siz bilan bog\'lanaman',
      form_name_label: 'Ismingiz *',
      form_phone_label: 'Telefon raqamingiz yoki Telegram username *',
      form_type_label: 'Qiziqtirgan Yo\'nalish',
      opt_bot: '🤖 Telegram Bot Yaratish',
      opt_art: '🎨 AI Rasm va San\'at Generatsiyasi',
      opt_cartoon: '🎬 3D Multfilm & Video Tayyorlash',
      opt_insta: '📱 Instagram SMM va Reels Yurgizish',
      opt_other: '💡 Konsultatsiya / Boshqa',
      form_msg_label: 'Loyiha haqida qisqacha',
      form_send_btn: 'Xabarni Yuborish',
      toast_copied_phone: 'Telefon raqam nusxalandi: +998 97 754 09 79',
      toast_form_success: 'Xabaringiz muvaffaqiyatli qabul qilindi! Tez orada aloqaga chiqaman.',
      toast_form_error: 'Iltimos, ismingiz va telefon/Telegram ma\'lumotlaringizni to\'ldiring!',
      toast_prompt_copied: 'Prompt buferga nusxalandi!'
    },
    ru: {
      nav_home: 'Главная',
      nav_cube: '3D Экосистема',
      nav_services: 'Направления',
      nav_portfolio: '3D Flip Проекты',
      nav_playground: 'Prompt Lab',
      nav_about: 'Обо мне',
      nav_contact: 'Контакты',
      call_action: 'Позвонить',
      hero_status: 'Открыта к новым проектам',
      hero_greeting: 'Здравствуйте, я',
      hero_type_prefix: 'Специализация:',
      hero_desc: 'Промпт-инженер, интегрирующий передовые технологии ИИ в бизнес и креативную сферу. Создаю умных Telegram-ботов, фотореалистичный арт, 3D мультфильмы и вирусный контент для Instagram.',
      btn_projects: 'Смотреть 3D Проекты',
      stat_bots: 'БОТЫ',
      stat_art: 'ИИ АРТ',
      stat_video: 'REELS/ВИДЕО',
      card_btn_follow: 'Подписаться',
      card_btn_msg: 'Написать',
      cube_tag: '3D ИНТЕРАКТИВНЫЙ ОПЫТ',
      cube_title_1: 'Вращающийся',
      cube_title_2: '3D Стеклянный Куб',
      cube_sub: 'Вращайте куб курсором или пальцем, чтобы изучить 6 граней экспертизы',
      cube_spin_on: 'Авто-Вращение: Вкл',
      cube_spin_off: 'Авто-Вращение: Выкл',
      serv_tag: 'УСЛУГИ И ВОЗМОЖНОСТИ',
      serv_title_1: 'Ключевые',
      serv_title_2: 'Направления',
      serv_sub: 'Превращаю любые смелые идеи в готовые высококачественные цифровые продукты',
      serv_1_name: 'Telegram Боты Любой Сложности',
      serv_1_desc: 'Интеллектуальные боты с интеграцией ChatGPT и Claude, автоприем заказов, круглосуточная техподдержка клиентов и интеграция платежных систем.',
      serv_2_name: 'Генерация Изображений и Арт',
      serv_2_desc: 'Создание фотореалистичных коммерческих изображений, 3D рендеров и брендинга с помощью Midjourney v6, Flux.1 и Stable Diffusion.',
      serv_3_name: '3D Мультфильмы и Генерация Видео',
      serv_3_desc: 'Анимационные 3D мультфильмы, разработка персонажей, динамичные видеоролики на основе сценария в Runway Gen-3 и Luma Dream Machine.',
      serv_4_name: 'Ведение Instagram и SMM',
      serv_4_desc: 'Создание вирусных AI Reels, эстетичной ленты, контент-плана и органическое привлечение целевой аудитории с нуля.',
      port_tag: '3D FLIP КАРТОЧКИ',
      port_title_1: 'Галерея',
      port_title_2: 'Проектов Flip',
      port_sub: 'Переверните карточку (Flip), чтобы увидеть скрытую формулу промпта и архитектуру решений',
      filter_all: 'Все',
      filter_bot: 'Telegram Боты',
      filter_art: 'ИИ Арт',
      filter_cartoon: '3D Мультфильмы',
      filter_insta: 'Instagram SMM',
      play_tag: 'ИНТЕРАКТИВНЫЙ PROMPT LAB',
      play_title_1: 'Как Промпт',
      play_title_2: 'Творит Чудеса?',
      play_sub: 'Выберите категорию и протестируйте архитектуру профессиональных промптов',
      about_tag: 'ПРОФИЛЬ И ОБУЧЕНИЕ',
      about_title_1: 'Обо мне и',
      about_title_2: 'Моей Миссии',
      about_sub: 'Мост между сложными моделями искусственного интеллекта и реальными бизнес-целями',
      about_story_badge: 'Философия Творчества',
      about_story_title: 'Prompt Engineering — это не просто команды, это язык будущего.',
      about_story_p1: 'Я Доно Рахимова — сертифицированный выпускник престижной академии Najot Ta\'lim, профессиональный Prompt Engineer и создатель ИИ-контента.',
      about_story_p2: 'Моя цель — помогать компаниям и брендам масштабироваться, автоматизировать процессы через Telegram ботов и создавать визуальный контент мирового уровня.',
      about_langs_title: 'Языки Общения и Промптинга:',
      about_academy_label: 'Академия & Квалификация',
      about_academy_desc: 'Выпускник интенсивного практического курса по Prompt Engineering и технологиям ИИ.',
      about_flow_label: 'Быстрый Результат',
      about_flow_title: 'Итеративный и Точный Подход',
      about_flow_desc: 'Гарантированное качество и тестирование нескольких вариантов под требования заказчика.',
      about_auto_label: 'Автоматизация Бизнеса',
      about_auto_title: 'Умные Боты 24/7',
      about_auto_desc: 'Экосистемы Telegram, повышающие лояльность клиентов и конверсию продаж.',
      contact_tag: 'СВЯЗЬ И СОТРУДНИЧЕСТВО',
      contact_title_1: 'Есть Проект?',
      contact_title_2: 'Создадим Вместе!',
      contact_sub: 'Хотите обсудить идею или запустить новый проект? Свяжитесь удобным для вас способом',
      contact_phone_label: 'Прямой звонок:',
      contact_phone_hint: 'Ежедневно с 09:00 до 21:00',
      contact_tg_hint: 'Гарантирован быстрый ответ',
      contact_insta_hint: 'Свежие работы и ИИ арт',
      form_title: 'Отправить Сообщение',
      form_desc: 'Оставьте контакты, и я свяжусь с вами в ближайшее время',
      form_name_label: 'Ваше имя *',
      form_phone_label: 'Номер телефона или Telegram username *',
      form_type_label: 'Интересующее Направление',
      opt_bot: '🤖 Разработка Telegram Бота',
      opt_art: '🎨 Генерация ИИ Изображений и Арта',
      opt_cartoon: '🎬 3D Мультфильмы и Видео',
      opt_insta: '📱 Ведение Instagram и Reels',
      opt_other: '💡 Консультация / Другое',
      form_msg_label: 'Кратко о проекте',
      form_send_btn: 'Отправить Заявку',
      toast_copied_phone: 'Номер скопирован: +998 97 754 09 79',
      toast_form_success: 'Ваша заявка успешно принята! Скоро свяжусь с вами.',
      toast_form_error: 'Пожалуйста, заполните имя и телефон/Telegram!',
      toast_prompt_copied: 'Промпт скопирован в буфер обмена!'
    },
    en: {
      nav_home: 'Home',
      nav_cube: '3D Ecosystem',
      nav_services: 'Expertise',
      nav_portfolio: '3D Flip Works',
      nav_playground: 'Prompt Lab',
      nav_about: 'About',
      nav_contact: 'Contact',
      call_action: 'Call Now',
      hero_status: 'Available for new projects',
      hero_greeting: 'Hello, I am',
      hero_type_prefix: 'Specialization:',
      hero_desc: 'Prompt Engineer bridging state-of-the-art AI into business automation and creative industries. Building intelligent Telegram bots, photorealistic artwork, 3D animated cartoons, and high-converting Instagram content.',
      btn_projects: 'Explore 3D Projects',
      stat_bots: 'BOTS',
      stat_art: 'AI ART',
      stat_video: 'REELS/VIDEO',
      card_btn_follow: 'Follow',
      card_btn_msg: 'Message',
      cube_tag: '3D INTERACTIVE EXPERIENCE',
      cube_title_1: 'Rotating',
      cube_title_2: '3D Glass Cube',
      cube_sub: 'Drag and rotate the glass cube with mouse or touch to discover the 6 dimensions of expertise',
      cube_spin_on: 'Auto-Spin: ON',
      cube_spin_off: 'Auto-Spin: OFF',
      serv_tag: 'SERVICES & CAPABILITIES',
      serv_title_1: 'Core',
      serv_title_2: 'Specialties',
      serv_sub: 'Transforming complex ideas into high-caliber digital experiences powered by neural nets',
      serv_1_name: 'Versatile Telegram Bots',
      serv_1_desc: 'Intelligent AI chat-assistants, automated commerce and ordering systems, 24/7 client support, and seamless payment gateway integrations.',
      serv_2_name: 'Generative AI Art & Imagery',
      serv_2_desc: 'Photorealistic commercial visuals, brand concept art, and 3D product renders generated via Midjourney v6, Flux.1, and Stable Diffusion.',
      serv_3_name: '3D Cartoons & Video Generation',
      serv_3_desc: '3D animated cartoons, character design, script-driven dynamic short films powered by Runway Gen-3 and Luma Dream Machine.',
      serv_4_name: 'Instagram Management & SMM',
      serv_4_desc: 'Creative Instagram growth from scratch, viral AI Reels, aesthetic visual grid, audience attraction, and tailored content strategy.',
      port_tag: '3D FLIP CARDS',
      port_title_1: 'Featured',
      port_title_2: '3D Flip Gallery',
      port_sub: 'Flip the card to unveil the exact prompt blueprint and technical architecture',
      filter_all: 'All',
      filter_bot: 'Telegram Bots',
      filter_art: 'Generative Art',
      filter_cartoon: '3D Cartoons',
      filter_insta: 'Instagram SMM',
      play_tag: 'INTERACTIVE PROMPT LAB',
      play_title_1: 'How Does Prompting',
      play_title_2: 'Create Magic?',
      play_sub: 'Select a category to test Dono Rahimova\'s professional prompt architecture blueprint',
      about_tag: 'PROFILE & BACKGROUND',
      about_title_1: 'About Me &',
      about_title_2: 'My Mission',
      about_sub: 'A bridge between advanced neural network models and creative human vision',
      about_story_badge: 'Creative Philosophy',
      about_story_title: 'Prompt Engineering is not just writing commands — it is the language of the future.',
      about_story_p1: 'I am Dono Rahimova, a certified graduate of the prestigious Najot Ta\'lim academy, professional Prompt Engineer and AI content creator.',
      about_story_p2: 'My goal is to empower companies, brands, and creators to automate business workflows with smart Telegram bots and craft world-class visual assets.',
      about_langs_title: 'Communication & Prompting Languages:',
      about_academy_label: 'Academy & Credential',
      about_academy_desc: 'Graduate of the intensive hands-on Prompt Engineering & Applied AI program.',
      about_flow_label: 'Rapid Delivery',
      about_flow_title: 'Iterative & Precise Execution',
      about_flow_desc: 'Multi-variant testing guaranteeing top-tier results tailored to client requirements.',
      about_auto_label: 'Business Automation',
      about_auto_title: '24/7 Smart Bots',
      about_auto_desc: 'Telegram ecosystems enhancing customer retention and conversion rates.',
      contact_tag: 'CONNECT & COLLABORATE',
      contact_title_1: 'Have a Project?',
      contact_title_2: 'Let\'s Create Together!',
      contact_sub: 'Have questions or ready to launch your next AI-driven project? Reach out anytime',
      contact_phone_label: 'Direct Phone Call:',
      contact_phone_hint: 'Every day from 09:00 to 21:00',
      contact_tg_hint: 'Fast response guaranteed',
      contact_insta_hint: 'AI visuals and creative updates',
      form_title: 'Send a Message',
      form_desc: 'Leave your details and I will get in touch with you shortly',
      form_name_label: 'Your Name *',
      form_phone_label: 'Phone Number or Telegram Username *',
      form_type_label: 'Area of Interest',
      opt_bot: '🤖 Telegram Bot Development',
      opt_art: '🎨 Generative AI Art & Imagery',
      opt_cartoon: '🎬 3D Cartoon & Video Production',
      opt_insta: '📱 Instagram SMM & Viral Reels',
      opt_other: '💡 Consultation / Other',
      form_msg_label: 'Brief Project Description',
      form_send_btn: 'Send Inquiry',
      toast_copied_phone: 'Phone number copied: +998 97 754 09 79',
      toast_form_success: 'Inquiry received successfully! I will reach out soon.',
      toast_form_error: 'Please enter your name and phone/Telegram details!',
      toast_prompt_copied: 'Prompt copied to clipboard!'
    }
  };

  const getTranslation = (key) => {
    return (i18nDictionary[currentLang] && i18nDictionary[currentLang][key]) ||
           (i18nDictionary.uz && i18nDictionary.uz[key]) || key;
  };

  const applyLanguage = (lang) => {
    currentLang = lang;
    document.documentElement.lang = lang;

    const translatable = document.querySelectorAll('[data-i18n]');
    translatable.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = getTranslation(key);
      if (text) {
        el.textContent = text;
      }
    });

    // Update form placeholders
    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');
    const msgInput = document.getElementById('user-msg');

    if (nameInput) {
      nameInput.placeholder = lang === 'en' ? 'e.g. Alex' : (lang === 'ru' ? 'Например: Сардор' : 'Masalan: Sardor');
    }
    if (phoneInput) {
      phoneInput.placeholder = lang === 'en' ? '+998 90 123 45 67 or @username' : '+998 90 123 45 67 yoki @username';
    }
    if (msgInput) {
      msgInput.placeholder = lang === 'en' ? 'Your ideas, goals or inquiry...' : (lang === 'ru' ? 'Ваши идеи, требования или вопросы...' : 'G\'oyangiz, talablaringiz yoki savollaringizni yozing...');
    }

    // Update cube spin text
    if (spinBtnText && cubeAutoRotateBtn) {
      spinBtnText.textContent = cubeAutoRotateBtn.classList.contains('active') ? getTranslation('cube_spin_on') : getTranslation('cube_spin_off');
    }

    // Reset typewriter with new language
    charIndex = 0;
    isDeleting = false;
  };

  // Language buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedLang = btn.getAttribute('data-lang');
      applyLanguage(selectedLang);
    });
  });

  /* ==========================================================================
     11. TOAST NOTIFICATION & COPY CONTACT
     ========================================================================== */
  const toastNotify = document.getElementById('toast-notify');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  const showToast = (message) => {
    if (!toastNotify || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotify.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotify.classList.remove('show');
    }, 3200);
  };

  // Copy phone number on card icon click
  const copyCardPhoneBtn = document.getElementById('copy-card-phone');
  if (copyCardPhoneBtn) {
    copyCardPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+998977540979').then(() => {
        showToast(getTranslation('toast_copied_phone'));
      });
    });
  }

  /* ==========================================================================
     12. CONTACT FORM SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name')?.value.trim();
      const phone = document.getElementById('user-phone')?.value.trim();
      const type = document.getElementById('project-type')?.value;
      const message = document.getElementById('user-msg')?.value.trim();

      if (!name || !phone) {
        showToast(getTranslation('toast_form_error'));
        return;
      }

      if (formSubmitBtn) {
        const originalText = formSubmitBtn.innerHTML;
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = `<span>Yuborilmoqda...</span> <div class="live-dot"></div>`;

        setTimeout(() => {
          showToast(getTranslation('toast_form_success'));
          contactForm.reset();
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = originalText;
        }, 1200);
      }
    });
  }

  /* ==========================================================================
     13. MOBILE MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

});
