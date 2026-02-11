// 10-Day Journey Data
const missionsSchedule = {
  1: [
      { id: 101, shift: 'Manhã', icon: '☀️', title: 'Skincare de Rainha 🧖‍♀️', desc: "Comece o dia cuidando de você com todo carinho.", points: 0, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop" },
      { id: 102, shift: 'Manhã', icon: '☀️', title: 'Música Favorita 🎶', desc: "Ouça aquele álbum que faz seu coração cantar.", points: 0, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop" },
      { id: 103, shift: 'Tarde', icon: '🌤️', title: 'Leitura Leve 📖', desc: "Leia 15 páginas de algo que te inspire.", points: 0, image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop" },
      { id: 104, shift: 'Tarde', icon: '🌤️', title: 'Hidratação Total 💧', desc: "Beba 2L de água para brilhar de dentro para fora.", points: 0, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop" },
      { id: 105, shift: 'Noite', icon: '🌙', title: 'Flashback 2023 📸', desc: "Reveja as fotos do nosso ano e sorria.", points: 0, image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop" },
      { id: 106, shift: 'Noite', icon: '🌙', title: 'Bilhete para Mim 💌', desc: "Escreva algo doce para você mesma ler amanhã.", points: 0, image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop" }
  ],
  2: [
      { id: 201, shift: 'Manhã', icon: '☀️', title: 'Alongamento Gatinho 🧘‍♀️', desc: "Estique o corpo e acorde cada músculo com amor.", points: 0, image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop" },
      { id: 202, shift: 'Manhã', icon: '☀️', title: 'Café sem Pressa ☕', desc: "Saboreie seu café da manhã como um ritual sagrado.", points: 0, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop" },
      { id: 203, shift: 'Tarde', icon: '🌤️', title: 'Artista Interior 🎨', desc: "Desenhe ou pinte algo bobo e divertido.", points: 0, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
      { id: 204, shift: 'Tarde', icon: '🌤️', title: 'Cama de Hotel 🛏️', desc: "Arrume a cama com carinho para a noite.", points: 0, image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?q=80&w=800&auto=format&fit=crop" },
      { id: 205, shift: 'Noite', icon: '🌙', title: 'Comédia Romântica 🍿', desc: "Ria muito com um filme leve e divertido.", points: 0, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop" },
      { id: 206, shift: 'Noite', icon: '🌙', title: 'Skin Care Noturno 🌙', desc: "Prepare sua pele para sonhar com os anjos.", points: 0, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" }
  ],
  3: [
      { id: 301, shift: 'Manhã', icon: '☀️', title: 'Podcast Novo 🎙️', desc: "Ouça algo interessante enquanto se arruma.", points: 0, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop" },
      { id: 302, shift: 'Manhã', icon: '☀️', title: 'Galeria Clean 📱', desc: "Organize as fotos do celular e libere espaço.", points: 0, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
      { id: 303, shift: 'Tarde', icon: '🌤️', title: 'Lanche Estético 🍓', desc: "Prepare um lanche bonito de ver e comer.", points: 0, image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop" },
      { id: 304, shift: 'Tarde', icon: '🌤️', title: 'Curiosidade do Dia 🧠', desc: "Leia um artigo sobre algo que sempre quis saber.", points: 0, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
      { id: 305, shift: 'Noite', icon: '🌙', title: 'Banho Meia Luz 🕯️', desc: "Tome banho com luz baixa para relaxar.", points: 0, image: "https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=800&auto=format&fit=crop" },
      { id: 306, shift: 'Noite', icon: '🌙', title: 'Novo Wallpaper 🖼️', desc: "Mude o fundo do celular para algo inspirador.", points: 0, image: "https://images.unsplash.com/photo-1550989460-e7ae8bdb532a?q=80&w=800&auto=format&fit=crop" }
  ],
  4: [
      { id: 401, shift: 'Manhã', icon: '☀️', title: 'Dança da Alegria 💃', desc: "Dance sua música favorita como se ninguém visse.", points: 0, image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop" },
      { id: 402, shift: 'Manhã', icon: '☀️', title: 'Beijo de Hidratação 💋', desc: "Capriche no lip balm e sorria para o espelho.", points: 0, image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" },
      { id: 403, shift: 'Tarde', icon: '🌤️', title: 'Série Favorita 📺', desc: "Assista 1 episódio daquela série que você ama.", points: 0, image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop" },
      { id: 404, shift: 'Tarde', icon: '🌤️', title: 'Chá Gelado 🍹', desc: "Refresque sua tarde com uma bebida especial.", points: 0, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=800&auto=format&fit=crop" },
      { id: 405, shift: 'Noite', icon: '🌙', title: 'Olhar as Estrelas ✨', desc: "Tire um momento para admirar o céu noturno.", points: 0, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" },
      { id: 406, shift: 'Noite', icon: '🌙', title: 'Nossa Playlist 🎵', desc: "Ouça músicas que lembram a gente.", points: 0, image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop" }
  ],
  5: [
      { id: 501, shift: 'Manhã', icon: '☀️', title: 'Zen em 5 Min 🧘', desc: "Feche os olhos e respire fundo por 5 minutos.", points: 0, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" },
      { id: 502, shift: 'Manhã', icon: '☀️', title: 'Lençóis Frescos 🛏️', desc: "Troque a roupa de cama para dormir nas nuvens.", points: 0, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop" },
      { id: 503, shift: 'Tarde', icon: '🌤️', title: 'Metas do Mês 📝', desc: "Escreva 3 coisas que quer conquistar esse mês.", points: 0, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop" },
      { id: 504, shift: 'Tarde', icon: '🌤️', title: 'Customização ✨', desc: "Dê um toque especial em algo seu.", points: 0, image: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=800&auto=format&fit=crop" },
      { id: 505, shift: 'Noite', icon: '🌙', title: 'Natureza na TV 🌿', desc: "Relaxe vendo paisagens lindas em vídeo.", points: 0, image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=800&auto=format&fit=crop" },
      { id: 506, shift: 'Noite', icon: '🌙', title: 'Pés de Princesa 🦶', desc: "Faça uma massagem relaxante nos seus pés.", points: 0, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" }
  ],
  6: [
      { id: 601, shift: 'Manhã', icon: '☀️', title: 'Selfie Poderosa 📸', desc: "Tire uma foto onde você se sinta linda!", points: 0, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop" },
      { id: 602, shift: 'Manhã', icon: '☀️', title: 'Água com Limão 🍋', desc: "Comece o dia com um detox refrescante.", points: 0, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop" },
      { id: 603, shift: 'Tarde', icon: '🌤️', title: 'Poesia do Dia 📜', desc: "Leia um poema bonito ou letra de música.", points: 0, image: "https://images.unsplash.com/photo-1474377207190-a7d8b3334068?q=80&w=800&auto=format&fit=crop" },
      { id: 604, shift: 'Tarde', icon: '🌤️', title: 'Cantinho Limpo ✨', desc: "Organize seus pincéis ou mesa de trabalho.", points: 0, image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop" },
      { id: 605, shift: 'Noite', icon: '🌙', title: 'Desenho Nostálgico 📺', desc: "Veja um desenho que você amava na infância.", points: 0, image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=800&auto=format&fit=crop" },
      { id: 606, shift: 'Noite', icon: '🌙', title: 'O Que Amo Em Ti 📝', desc: "Escreva o que você mais gosta em mim.", points: 0, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" }
  ],
  7: [
      { id: 701, shift: 'Manhã', icon: '☀️', title: 'Caminhada Zen 🚶‍♀️', desc: "Dê uma volta pela casa ou jardim respirando fundo.", points: 0, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop" },
      { id: 702, shift: 'Manhã', icon: '☀️', title: 'Cabelo de Diva 💇‍♀️', desc: "Faça uma hidratação ou penteado especial.", points: 0, image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop" },
      { id: 703, shift: 'Tarde', icon: '🌤️', title: 'Poliglota 🌍', desc: "Aprenda 3 palavras novas em outra língua.", points: 0, image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
      { id: 704, shift: 'Tarde', icon: '🌤️', title: 'Gaveta Organizada 🗄️', desc: "Arrume uma gaveta bagunçada da sua vida.", points: 0, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
      { id: 705, shift: 'Noite', icon: '🌙', title: 'Jantar à Luz de Velas 🕯️', desc: "Torne seu jantar um momento especial.", points: 0, image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=800&auto=format&fit=crop" },
      { id: 706, shift: 'Noite', icon: '🌙', title: 'Sons de Chuva 🌧️', desc: "Ouça sons relaxantes para desacelerar.", points: 0, image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop" }
  ],
  8: [
      { id: 801, shift: 'Manhã', icon: '☀️', title: 'Penteado Novo 🎀', desc: "Experimente prender o cabelo de um jeito novo.", points: 0, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
      { id: 802, shift: 'Manhã', icon: '☀️', title: 'Look do Futuro 👗', desc: "Planeje uma roupa linda para usar em breve.", points: 0, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" },
      { id: 803, shift: 'Tarde', icon: '🌤️', title: 'Chef Virtual 👩‍🍳', desc: "Assista vídeos de receitas deliciosas.", points: 0, image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=800&auto=format&fit=crop" },
      { id: 804, shift: 'Tarde', icon: '🌤️', title: 'Colorir a Vida 🖍️', desc: "Pinte um desenho para relaxar a mente.", points: 0, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
      { id: 805, shift: 'Noite', icon: '🌙', title: 'Suspense Leve 🎬', desc: "Veja um filme que prenda sua atenção.", points: 0, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop" },
      { id: 806, shift: 'Noite', icon: '🌙', title: 'Vídeos Nossos 📹', desc: "Reveja vídeos antigos nossos e sinta o amor.", points: 0, image: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=800&auto=format&fit=crop" }
  ],
  9: [
      { id: 901, shift: 'Manhã', icon: '☀️', title: 'Alívio Total 💆‍♀️', desc: "Alongue bem o pescoço e as costas.", points: 0, image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop" },
      { id: 902, shift: 'Manhã', icon: '☀️', title: 'Cheiro de Amor 🌸', desc: "Use seu perfume favorito mesmo em casa.", points: 0, image: "https://images.unsplash.com/photo-1594035910387-fea477942698?q=80&w=800&auto=format&fit=crop" },
      { id: 903, shift: 'Tarde', icon: '🌤️', title: 'Boas Notícias 📰', desc: "Leia apenas coisas positivas hoje.", points: 0, image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop" },
      { id: 904, shift: 'Tarde', icon: '🌤️', title: 'Fruta Exótica 🥝', desc: "Coma uma fruta diferente ou de um jeito novo.", points: 0, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop" },
      { id: 905, shift: 'Noite', icon: '🌙', title: 'Mãos de Fada 💅', desc: "Hidrate e cuide bem das suas mãos.", points: 0, image: "https://images.unsplash.com/photo-1632733711679-529a96996059?q=80&w=800&auto=format&fit=crop" },
      { id: 906, shift: 'Noite', icon: '🌙', title: 'Sono Reparador 😴', desc: "Vá para a cama 30min mais cedo hoje.", points: 0, image: "https://images.unsplash.com/photo-1511295742362-92c96b53b035?q=80&w=800&auto=format&fit=crop" }
  ],
  10: [
      { id: 1001, shift: 'Manhã', icon: '☀️', title: 'Preparando o Ninho 🏠', desc: "Arrume o quarto para a minha volta!", points: 0, image: "https://images.unsplash.com/photo-1522771753018-41163c629ce3?q=80&w=800&auto=format&fit=crop" },
      { id: 1002, shift: 'Manhã', icon: '☀️', title: 'Glow Up Final ✨', desc: "Faça seu ritual de beleza completo.", points: 0, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" },
      { id: 1003, shift: 'Tarde', icon: '🌤️', title: 'Música do Reencontro 🎶', desc: "Escolha a música que vai tocar quando eu chegar.", points: 0, image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop" },
      { id: 1004, shift: 'Tarde', icon: '🌤️', title: 'Brinde a Você 🥂', desc: "Celebre essa jornada incrível que você fez.", points: 0, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop" },
      { id: 1005, shift: 'Noite', icon: '🌙', title: 'Nosso Filme 🎞️', desc: "Assista o filme que é a nossa cara.", points: 0, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop" },
      { id: 1006, shift: 'Noite', icon: '🌙', title: 'Coração Aberto ❤️', desc: "Prepare o coração para o melhor abraço do mundo.", points: 0, image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=800&auto=format&fit=crop" }
  ]
};

const quotes = [
    "Ei linda, você é meu maior orgulho! ❤️",
    "Cada detalhe seu me faz te amar ainda mais.",
    "Aproveite seu momento, você merece o mundo.",
    "Seu sorriso é o meu lugar favorito no universo. ✨",
    "Obrigado por ser exatamente quem você é. Amo você!"
];

const successMessages = [
    "Uau! Você é incrível, amor! ❤️",
    "Você é a melhor namorada do mundo! ✨",
    "Amo ver você feliz desse jeito! 🌸",
    "Meu coração bate mais forte por você! ❤️",
    "Você merece todo o amor do universo, minha vida!"
];

let points = parseInt(localStorage.getItem('happinessPoints')) || 0;
let completedMissions = JSON.parse(localStorage.getItem('completedMissions')) || [];
let currentDay = parseInt(localStorage.getItem('currentDay')) || 1;

// Shift Logic
function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
}

function calculatePoints(missionShift) {
    const currentShift = getCurrentShift();
    if (currentShift === missionShift) return 100;
    
    // Check if "Noite" wraps around or if we need specific logic for late night
    // Simplified: if exact string matches, 100, else 50.
    // The prompt says: "Se a missão for do turno 'Manhã' e feita de manhã, vale 100 pts. Se feita depois, 50 pts."
    // So distinct strings check is enough.
    return 50;
}

function updateUI() {
    document.getElementById('points-counter').textContent = points;
    
    // Setup for daily progress
    const dailyMissions = missionsSchedule[currentDay] || [];
    const totalDaily = dailyMissions.length;
    // Count completed missions THAT BELONG TO CURRENT DAY
    const completedDaily = dailyMissions.filter(m => completedMissions.includes(m.id)).length;
    
    const progressPercent = (completedDaily / totalDaily) * 100;
    
    document.getElementById('completed-count').textContent = completedDaily;
    document.getElementById('total-count').textContent = totalDaily;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    // Check if day is complete to allow advancing (optional feature, but good for UX)
    if (completedDaily === totalDaily && totalDaily > 0) {
        document.getElementById('next-day-btn').style.display = 'block';
        triggerHeartRain();
    } else {
         const btn = document.getElementById('next-day-btn');
         if(btn) btn.style.display = 'none';
    }

    // Update Day Header
    const dayHeader = document.getElementById('day-header');
    if(dayHeader) dayHeader.textContent = `Dia ${currentDay} de 10`;
}

function renderMissions() {
    const grid = document.getElementById('mission-grid');
    grid.innerHTML = '';
    
    const todaysMissions = missionsSchedule[currentDay] || [];

    todaysMissions.forEach(mission => {
        const isCompleted = completedMissions.includes(mission.id);
        const card = document.createElement('div');
        card.className = `mission-card ${isCompleted ? 'completed' : ''}`;
        
        card.innerHTML = `
            <div class="card-bg-overlay" style="background-image: url('${mission.image}')"></div>
            <div class="shift-icon">${mission.icon}</div>
            <h3>${mission.title}</h3>
        `;
        
        card.onclick = () => openModal(mission);
        grid.appendChild(card);
    });
}

function openModal(mission) {
    const modal = document.getElementById('mission-modal');
    const body = document.getElementById('modal-body');
    const isCompleted = completedMissions.includes(mission.id);
    
    const potentialPoints = calculatePoints(mission.shift);
    const shiftName = getCurrentShift();
    const isOnTime = shiftName === mission.shift;

    const dynamicDesc = `Amor, agora no turno da <strong>${mission.shift}</strong>, quero que você aproveite: ${mission.desc}`;

    body.innerHTML = `
        <h2>${mission.title}</h2>
        <p>${dynamicDesc}</p>
        <p class="shift-info">Turno sugerido: ${mission.shift} ${mission.icon}</p>
        
        <div class="modal-footer">
            <button class="btn-complete" id="complete-btn" ${isCompleted ? 'disabled' : ''}>
                ${isCompleted ? 'CONCLUÍDA ❤️' : `CONCLUIR AGORA (+${potentialPoints} PTS)`}
            </button>
            ${!isCompleted && isOnTime ? '<p class="bonus-tag">Pontuação Máxima! ✨</p>' : ''}
        </div>
    `;

    modal.classList.add('active');

    if(!isCompleted){
        document.getElementById('complete-btn').onclick = () => {
            toggleMission(mission.id, potentialPoints);
            closeModal();
            showSuccessAlert();
        };
    }

    document.querySelector('.close-modal').onclick = closeModal;
}

function closeModal() {
    document.getElementById('mission-modal').classList.remove('active');
}

function toggleMission(id, missionPoints) {
    if (completedMissions.includes(id)) return;
    completedMissions.push(id);
    points += missionPoints;
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
    localStorage.setItem('happinessPoints', points);
    renderMissions();
    updateUI();
    triggerHeartRain();
}

function advanceDay() {
    if (currentDay < 10) {
        currentDay++;
        localStorage.setItem('currentDay', currentDay);
        renderMissions();
        updateUI();
        alert(`Bem-vinda ao Dia ${currentDay}! Novas missões desbloqueadas! ❤️`);
    } else {
        alert("Você completou toda a jornada de 10 dias! Te amo mil milhões! ❤️");
    }
}

function showSuccessAlert() {
    const msg = successMessages[Math.floor(Math.random() * successMessages.length)];
    alert(msg);
}

function triggerHeartRain() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff8fa3', '#ff4d6d', '#ff0000'],
            shapes: ['heart']
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff8fa3', '#ff4d6d', '#ff0000'],
            shapes: ['heart']
        });
    }, 150);
}

function showRandomQuote() {
    const quoteElement = document.getElementById('daily-quote');
    quoteElement.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
}

function initTheme() {
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Deseja reiniciar toda a jornada de 10 dias?')) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    // Checking for next day button injection if not in HTML
    let headerActions = document.querySelector('.header-actions');
    if(headerActions && !document.getElementById('next-day-btn')) {
        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-day-btn';
        nextBtn.className = 'action-btn';
        nextBtn.innerHTML = '➡️';
        nextBtn.title = 'Próximo Dia';
        nextBtn.style.display = 'none'; // Hidden by default
        nextBtn.onclick = advanceDay;
        headerActions.prepend(nextBtn);
    }
    
    // Inject Day Header if missing
    let headerLeft = document.querySelector('.header-left');
    if(headerLeft && !document.getElementById('day-wrapper')) {
        const dayWrapper = document.createElement('div');
        dayWrapper.id = 'day-wrapper';
        dayWrapper.innerHTML = `<h2 id="day-header" style="color: var(--accent-red); font-size: 1.5rem; margin-top: 5px;">Dia 1 de 10</h2>`;
        // Insert after H1
        const h1 = headerLeft.querySelector('h1');
        h1.after(dayWrapper);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateUI();
    renderMissions();
    showRandomQuote();
});
