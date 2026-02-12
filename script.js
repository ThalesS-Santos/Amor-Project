import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyDi6EfFy__UC6nAdtFd0L0ubcbKAgKTLHE",
  authDomain: "amor-project-5e7ac.firebaseapp.com",
  projectId: "amor-project-5e7ac",
  storageBucket: "amor-project-5e7ac.firebasestorage.app",
  messagingSenderId: "263355182686",
  appId: "1:263355182686:web:8dc7afcb2fedfb22da8ecf",
  measurementId: "G-09XT1QVNYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// App State
let points = 0;
let completedMissions = []; // Array of objects: { id, photoUrl, timestamp, pointsEarned }
let currentDay = 1;
let currentUser = null;
let userDocRef = null;
let isAdmin = false;
let viewingOtherUser = false; // Flag to prevent saving when viewing others

const successSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3");
const shimmerSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3"); // Bell/Chime
let userInteracted = false;

document.addEventListener('click', () => {
    userInteracted = true;
}, { once: true });

function playShimmer() {
    if (userInteracted) {
        shimmerSound.currentTime = 0;
        shimmerSound.volume = 0.5;
        shimmerSound.play().catch(e => console.log("Audio autoplay prevented", e));
    }
}

// --- 10-Day Journey Data ---
const missionsSchedule = {
  1: [
    { id: 101, shift: 'Manhã', icon: '☀️', title: 'Skincare de Rainha 🧖‍♀️', desc: "Comece cuidando de si mesma.", longDescription: "Ei amor, quero que você comece o dia se sentindo uma rainha. Tire um tempinho para cuidar da sua pele, passar seus cremes favoritos e se sentir radiante. Você brilha! ✨", points: 0, image: "https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 102, shift: 'Manhã', icon: '☀️', title: 'Álbum Favorito 🎶', desc: "Trilha sonora para começar bem.", longDescription: "Minha vida, coloque aquele álbum que você ama e cante junto. Deixe a música encher a casa e o seu coração de alegria. ❤️", points: 0, image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop" },
    { id: 103, shift: 'Tarde', icon: '🌤️', title: 'Leitura Inspiradora 📖', desc: "Viaje para outro mundo.", longDescription: "Princesa, tire um tempo hoje à tarde para ler algo que te inspire. Seja um livro, um artigo ou um blog, apenas mergulhe em novas ideias.", points: 0, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
    { id: 104, shift: 'Tarde', icon: '🌤️', title: 'Hidratação Consciente 💧', desc: "Beba água com intenção.", longDescription: "Ei gatinha, não esqueça de se hidratar. Beba água sentindo que está nutrindo seu corpo lindo. Cuide-se por mim!", points: 0, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop" },
    { id: 105, shift: 'Noite', icon: '🌙', title: 'Flashback Nosso 📸', desc: "Relembre nossos momentos.", longDescription: "Amor, pegue o celular e olhe nossas fotos antigas. Lembre de como começamos e de todo o amor que construímos até aqui. Te amo! ❤️", points: 0, image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop" },
    { id: 106, shift: 'Noite', icon: '🌙', title: 'Bilhete para Si 💌', desc: "Uma carta de amor própria.", longDescription: "Escreva um bilhete carinhoso para você mesma ler amanhã. Diga o quanto você é forte e incrível. Eu assino embaixo! ✨", points: 0, image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop" }
  ],
  2: [
    { id: 201, shift: 'Manhã', icon: '☀️', title: 'Alongamento Matinal 🧘‍♀️', desc: "Desperte o corpo.", longDescription: "Bom dia, flor do dia! Comece alongando esse corpinho lindo. Estique-se bem e prepare-se para mais um dia incrível.", points: 0, image: "https://images.unsplash.com/vector-1764700666457-940f8fd738fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWxvbmdhbWVudG98ZW58MHx8MHx8fDA%3D" },
    { id: 202, shift: 'Manhã', icon: '☀️', title: 'Café Ritual ☕', desc: "Saboreie cada gole.", longDescription: "Ei amor, faça do seu café da manhã um ritual sagrado. Sem pressa, apenas sinta o sabor e o aroma. Você merece esse momento de paz.", points: 0, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop" },
    { id: 203, shift: 'Tarde', icon: '🌤️', title: 'Desenho Livre 🎨', desc: "Solte a criatividade.", longDescription: "Minha artista, pegue papel e caneta e desenhe qualquer coisa. Deixe sua criatividade fluir sem julgamentos. Divirta-se! 🖌️", points: 0, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
    { id: 204, shift: 'Tarde', icon: '🌤️', title: 'Arrumar o Ninho 🛏️', desc: "Cama aconchegante.", longDescription: "Arrume sua cama com todo carinho, deixando-a bem convidativa para a noite. Um ninho aconchegante para a mulher mais linda do mundo.", points: 0, image: "https://plus.unsplash.com/premium_vector-1724484599217-cce27d65a8ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 205, shift: 'Noite', icon: '🌙', title: 'Cinema em Casa 🍿', desc: "Hora da comédia!", longDescription: "Amor, escolha um filme de comédia bem divertido. Quero imaginar você rindo alto do outro lado da tela. Seu sorriso é tudo! ❤️", points: 0, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop" },
    { id: 206, shift: 'Noite', icon: '🌙', title: 'Skin Care de Paz 🌙', desc: "Relaxe antes de dormir.", longDescription: "Faça sua rotina noturna com calma, sentindo a água e os produtos na pele. Prepare-se para sonhar com os anjos (e comigo). 😴", points: 0, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" }
  ],
  3: [
    { id: 301, shift: 'Manhã', icon: '☀️', title: 'Podcast Novo 🎙️', desc: "Ideias novas.", longDescription: "Ei linda, que tal ouvir um podcast sobre algo novo ou algo que você gosta enquanto se arruma? Comece o dia inspirada!", points: 0, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop" },
    { id: 302, shift: 'Manhã', icon: '☀️', title: 'Organização Digital 📱', desc: "Limpeza no celular.", longDescription: "Tire uns minutinhos para organizar a galeria ou apagar apps que não usa. Uma vida digital organizada traz leveza, meu bem.", points: 0, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
    { id: 303, shift: 'Tarde', icon: '🌤️', title: 'Lanche Gourmet 🍓', desc: "Mimo no prato.", longDescription: "Prepare um lanche da tarde caprichado e bonito. Você come com os olhos também! Aproveite cada mordida, princesa. 🫐", points: 0, image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop" },
    { id: 304, shift: 'Tarde', icon: '🌤️', title: 'Curiosidade do Dia 🧠', desc: "Aprenda algo novo.", longDescription: "Pesquise sobre um assunto aleatório que sempre teve curiosidade. O saber não ocupa espaço e deixa você ainda mais interessante. 😉", points: 0, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
    { id: 305, shift: 'Noite', icon: '🌙', title: 'Banho Meia Luz 🕯️', desc: "Relaxamento total.", longDescription: "Tome um banho relaxante apenas com a luz do corredor ou uma vela (com cuidado! mas eu sei que você tem uma vela ai que nunca usou hihi). Deixe a água levar qualquer tensão embora. 🛁", points: 0, image: "https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=800&auto=format&fit=crop" },
    { id: 306, shift: 'Noite', icon: '🌙', title: 'Novo Wallpaper 🖼️', desc: "Tela nova, vida nova.", longDescription: "Escolha uma imagem inspiradora para o fundo do seu celular. Algo que te faça sorrir toda vez que desbloquear a tela. 🌈", points: 0, image: "https://plus.unsplash.com/premium_vector-1720439945329-007bc26b3a08?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D" }
  ],
  4: [
    { id: 401, shift: 'Manhã', icon: '☀️', title: 'Dança da Alegria 💃', desc: "Solte o corpo!", longDescription: "Amor, coloque uma música animada e dance pela casa! Sacuda o esqueleto e comece o dia com pura energia positiva! 🎶", points: 0, image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop" },
    { id: 402, shift: 'Manhã', icon: '☀️', title: 'Hidratação Labial 💋', desc: "Sorriso macio.", longDescription: "Faça uma esfoliação leve ou passe aquelas coisas que você passa. Quero esses lábios macios e prontos para sorrir (e me beijar na volta). 😘", points: 0, image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" },
    { id: 403, shift: 'Tarde', icon: '🌤️', title: 'Série Favorita 📺', desc: "Pausa merecida.", longDescription: "Tire um tempo para ver UM(monte de) episódio(s) daquela série que você adora. Relaxe no sofá e aproveite sua companhia. 🍿", points: 0, image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop" },
    { id: 404, shift: 'Tarde', icon: '🌤️', title: 'Drink de Frutas 🍹', desc: "Refresco colorido.", longDescription: "Prepare um suco ou drink bem colorido e gelado(pode usar seus redbulls para fazer uma super combinação). Brinde à mulher incrível que você é! 🥂", points: 0, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=800&auto=format&fit=crop" },
    { id: 405, shift: 'Noite', icon: '🌙', title: 'Olhar o Céu ✨', desc: "Conexão com o universo.", longDescription: "Vá até a janela ou quintal e olhe para o céu por 5 minutos. Lembre-se que estamos sob o mesmo céu, conectados. 🌌", points: 0, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" },
    { id: 406, shift: 'Noite', icon: '🌙', title: 'Playlist Nossa 🎵', desc: "Músicas que nos definem.", longDescription: "Ouça aquelas músicas que me fazem lembrar de você. Feche os olhos e sinta meu abraço através da melodia. ❤️", points: 0, image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop" }
  ],
  5: [
    { id: 501, shift: 'Manhã', icon: '☀️', title: 'Respiração Zen 🧘', desc: "5 minutos de paz.", longDescription: "Sente-se confortavelmente e foque apenas na sua respiração por 5 minutos. Inspire calma, expire ansiedade. Namastê. 🙏", points: 0, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" },
    { id: 502, shift: 'Manhã', icon: '☀️', title: 'Troca de Lençóis 🛏️', desc: "Cheirinho de limpeza.", longDescription: "Nada melhor que cama limpinha, né? Troque os lençóis e sinta aquele cheirinho de conforto(borrife um tico de perfume na cama tambem, para sentir aquele cheirinho bom todo). Você merece dormir nas nuvens.", points: 0, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop" },
    { id: 503, shift: 'Tarde', icon: '🌤️', title: 'Sonhos Futuros 📝', desc: "O que vem por aí?", longDescription: "Escreva num papel 3(ou mais) sonhos que você quer realizar no futuro. Vamos sonhar juntos depois, mas hoje sonhe alto você mesma! ✨", points: 0, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop" },
    { id: 504, shift: 'Tarde', icon: '🌤️', title: 'Personalizar ✨', desc: "Toque especial.", longDescription: "Pegue um objeto seu e dê um toque pessoal. Pode ser um adesivo no caderno, mudar coisas de lugar... Deixe sua marca! 💖", points: 0, image: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=800&auto=format&fit=crop" },
    { id: 505, shift: 'Noite', icon: '🌙', title: 'Doc. Mundo 🌍', desc: "Viaje sem sair do lugar.", longDescription: "Assista um documentário sobre natureza ou um lugar bonito do mundo. Vamos planejar nossa próxima viagem juntos? ✈️", points: 0, image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=800&auto=format&fit=crop" },
    { id: 506, shift: 'Noite', icon: '🌙', title: 'Massagem nos Pés 🦶', desc: "Relaxe a base.", longDescription: "Amor, faça uma massagem nos seus pés com um creme gostoso(não mais gostoso que você hihihi). Eles te levam para todos os lugares, merecem carinho! 🌸", points: 0, image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=800&auto=format&fit=crop" }
  ],
  6: [
    { id: 601, shift: 'Manhã', icon: '☀️', title: 'Sessão Fotos 📸', desc: "Me sinto linda.", longDescription: "Ei, gata! Tire algumas selfies onde você se sinta maravilhosa. Não precisa postar, é só para você se admirar. Você é linda! 😍", points: 0, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop" },
    { id: 602, shift: 'Manhã', icon: '☀️', title: 'Água com Limão 🍋', desc: "Detox matinal.", longDescription: "Comece o dia com um copo de água com limão. Simples, saudável e refrescante. Cuide desse templo que é seu corpo!", points: 0, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop" },
    { id: 603, shift: 'Tarde', icon: '🌤️', title: 'Poesia ou Letra 📜', desc: "Palavras que tocam.", longDescription: "Leia um poema bonito ou a letra de uma música que mexa com você. Deixe a arte tocar sua alma hoje. 🎶", points: 0, image: "https://images.unsplash.com/photo-1474377207190-a7d8b3334068?q=80&w=800&auto=format&fit=crop" },
    { id: 604, shift: 'Tarde', icon: '🌤️', title: 'Organizar Make ✨', desc: "Beleza organizada.", longDescription: "Dê uma geral na sua área de maquiagem ou trabalho. Limpar os pincéis ou organizar as canetas dá uma paz mental incrível.", points: 0, image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop" },
    { id: 605, shift: 'Noite', icon: '🌙', title: 'Desenho Infância 📺', desc: "Nostalgia pura.", longDescription: "Lembra daquele desenho que você amava? Assista um episódio! Volte a ser criança um pouquinho, meu amor. 🌈", points: 0, image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop" },
    { id: 606, shift: 'Noite', icon: '🌙', title: '10 Coisas em Ti 📝', desc: "Amor por você.", longDescription: "Faça uma lista de 10 coisas que você ama em VOCÊ mesma. Pode ser seu sorriso, sua força... Eu amo tudo em você! ❤️", points: 0, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" }
  ],
  7: [
    { id: 701, shift: 'Manhã', icon: '☀️', title: 'Caminhada Leve 🚶‍♀️', desc: "Movimento suave.", longDescription: "Caminhe um pouco pela casa ou pelo condomínio, sentindo seus passos. Agradeça por suas pernas fortes e por poder ir e vir. 🌿", points: 0, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop" },
    { id: 702, shift: 'Manhã', icon: '☀️', title: 'Máscara Capilar 💇‍♀️', desc: "Cabelo de diva.", longDescription: "Hoje é dia de cuidar desse CABELÃÃÃÃÃO! Faça aquela hidratação poderosa e jogue esse cabelo lindo para lá e para cá.(quaaaanto cabelo) 💆‍♀️", points: 0, image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop" },
    { id: 703, shift: 'Tarde', icon: '🌤️', title: 'Poliglota 🌍', desc: "5 frases novas.", longDescription: "Aprenda 5 frases simples em um idioma que você acha chique. 'Je t'aime' vale, hein? 😉🇫🇷", points: 0, image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
    { id: 704, shift: 'Tarde', icon: '🌤️', title: 'Destralhar Gaveta 🗄️', desc: "Leveza no espaço.", longDescription: "Escolha AQUELA gaveta bagunçada e coloque ordem. Jogar fora o que não serve abre espaço para o novo, amor!", points: 0, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
    { id: 705, shift: 'Noite', icon: '🌙', title: 'Jantar Especial 🍽️', desc: "Mimo no jantar.", longDescription: "Mesmo que seja simples ou delivery, arrume a mesa bonitinha, acenda uma vela. Jante como se estivesse num encontro com a melhor pessoa: você! 🍝", points: 0, image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=800&auto=format&fit=crop" },
    { id: 706, shift: 'Noite', icon: '🌙', title: 'Meditação Sons 🌧️', desc: "Calma da natureza.", longDescription: "Coloque sons de chuva ou floresta, feche os olhos e deixe sua mente viajar para um lugar tranquilo. Durma bem, minha paz. 😴", points: 0, image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop" }
  ],
  8: [
    { id: 801, shift: 'Manhã', icon: '☀️', title: 'Penteado Novo 🎀', desc: "Experimente algo.", longDescription: "Tente prender o cabelo de um jeito diferente hoje. Um coque, uma trança... Mudar o visual muda o ânimo! Você fica linda de qualquer jeito. 😍", points: 0, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
    { id: 802, shift: 'Manhã', icon: '☀️', title: 'Look Poderosa 👗', desc: "Se vista para arrasar.", longDescription: "Monte um look que faz você se sentir invencível, mesmo que não vá sair. Olhe no espelho e diga: 'Eu sou demais!'. 🔥", points: 0, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" },
    { id: 803, shift: 'Tarde', icon: '🌤️', title: 'Receita Doce 🧁', desc: "Adoce a vida.", longDescription: "Aprenda uma receita simples de sobremesa ou faça aquele brigadeiro de colher. A vida precisa ser doce, assim como você! 🍬", points: 0, image: "https://plus.unsplash.com/premium_vector-1714218360965-0d2db461a756?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jZXxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 804, shift: 'Tarde', icon: '🌤️', title: 'Colorir Terapia 🖍️', desc: "Mente quieta.", longDescription: "Pinte um desenho ou mandalas. É uma terapia incrível para acalmar a mente e focar no agora. Escolha cores vivas! 🌈", points: 0, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
    { id: 805, shift: 'Noite', icon: '🌙', title: 'Filme Suspense 🎬', desc: "Prenda a atenção.", longDescription: "Assista um filme de suspense que te prenda do início ao fim. Daqueles de roer as unhas!  🍿", points: 0, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop" },
    { id: 806, shift: 'Noite', icon: '🌙', title: 'Vídeos Engraçados 📹', desc: "Nossas risadas.", longDescription: "Veja vídeos antigos, especialmente os engraçados, ou então veja alguns Reels que te animem muitooooo. Ouvir sua risada é meu som favorito no mundo todo! 😂", points: 0, image: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=800&auto=format&fit=crop" }
  ],
  9: [
    { id: 901, shift: 'Manhã', icon: '☀️', title: 'Alongar Pescoço 💆‍♀️', desc: "Xô tensão.", longDescription: "Bom dia! Dedique uns minutos para alongar bem o pescoço e ombros. Tire o peso do mundo das costas, relaxe... 🍃", points: 0, image: "https://plus.unsplash.com/premium_vector-1682304624592-c1ab90adc36d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVzY28lQzMlQTdvfGVufDB8fDB8fHww" },
    { id: 902, shift: 'Manhã', icon: '☀️', title: 'Perfume Favorito 🌸', desc: "Cheiro de você.", longDescription: "Passe aquele perfume que você ama, só para ficar em casa sentindo esse cheiro maravilhoso. Sinta-se cheirosa e poderosa! ✨", points: 0, image: "https://plus.unsplash.com/premium_vector-1722102206756-a826be5cf319?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcmZ1bWV8ZW58MHx8MHx8fDA%3D" },
    { id: 903, shift: 'Tarde', icon: '🌤️', title: 'Notícias Positivas 📰', desc: "Vibe boa.", longDescription: "Hoje, só leia coisas boas. Procure sites de 'boas notícias' e encha sua mente de esperança e positividade. O mundo tem coisas lindas! 🌍", points: 0, image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop" },
    { id: 904, shift: 'Tarde', icon: '🌤️', title: 'Comida Diferente 🥝', desc: "Paladar novo.", longDescription: "Experimente uma comida que você não come sempre. Sinta a textura, o sabor... Uma pequena aventura gastronômica! 😋", points: 0, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop" },
    { id: 905, shift: 'Noite', icon: '🌙', title: 'Spa de Mãos 💅', desc: "Toque suave.", longDescription: "Esfolie e hidrate bem suas mãos. Elas criam, acariciam e merecem todo cuidado. Deixe-as macias como seda. 🖐️", points: 0, image: "https://plus.unsplash.com/premium_vector-1722180755526-4bb5a6bc83aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhfGVufDB8fDB8fHww" },
    { id: 906, shift: 'Noite', icon: '🌙', title: 'Sem Telas 📵', desc: "Desconecte-se.", longDescription: "Desligue celular e TV 30 minutos antes de dormir. Deixe sua mente desacelerar de verdade. Bons sonhos, meu anjo.(eu sei que você so dorme de TV ligada, mas tente desligar um pouco antes de dormir e quando você sentir o sono vindo, você liga ela de novo) 🌙", points: 0, image: "https://plus.unsplash.com/premium_vector-1761370943946-c02628e603b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VjbHVsYXIlMjBibG9xdWVhZG98ZW58MHx8MHx8fDA%3D" }
  ],
  10: [
    { id: 1001, shift: 'Manhã', icon: '☀️', title: 'Preparar a Casa 🏠', desc: "Estou chegando!", longDescription: "Ei amor, o grande dia! Arrume a casa (ou o quarto) para a minha volta. Deixe tudo pronto para o nosso reencontro! ❤️", points: 0, image: "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 1002, shift: 'Manhã', icon: '☀️', title: 'Ritual Beleza ✨', desc: "Glow up final.", longDescription: "Faça seu ritual de beleza completo hoje. Quero te ver radiante (como sempre) quando eu chegar. Você é a mulher da minha vida! 💄", points: 0, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" },
    { id: 1003, shift: 'Tarde', icon: '🌤️', title: 'Música Abraço 🎶', desc: "Trilha do amor.", longDescription: "Escolha A música que vai tocar na sua cabeça (ou no som) quando a gente se abraçar. 🎵", points: 0, image: "https://plus.unsplash.com/premium_vector-1724232326915-339e3494733e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWNhfGVufDB8fDB8fHww" },
    { id: 1004, shift: 'Tarde', icon: '🌤️', title: 'Brinde à Força 🥂', desc: "Você conseguiu!", longDescription: "Faça um brinde a você mesma! Você passou por esses dias com força e amor. Estou tão orgulhoso de você, minha guerreira! 🏆", points: 0, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop" },
    { id: 1005, shift: 'Noite', icon: '🌙', title: 'Nosso Filme 🎞️', desc: "Clássico nosso.", longDescription: "Assista 'aquele' filme que é a nossa cara.... Eu tô chegando!!! 🦋", points: 0, image: "https://plus.unsplash.com/premium_vector-1718217516943-559e92a9a3cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZpbG1lfGVufDB8fDB8fHww" },
    { id: 1006, shift: 'Noite', icon: '🌙', title: 'Coração Aberto ❤️', desc: "Só vem.", longDescription: "Prepare o coração, respire fundo e sorria. O melhor abraço do mundo está a caminho. TE AMO INFINITO! Até já! ❤️❤️❤️", points: 0, image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=800&auto=format&fit=crop" }
  ]
};

const dailyQuotes = {
    1: { line1: "Hoje é o começo de algo lindo.", line2: "Você merece todo o cuidado do mundo. ❤️" },
    2: { line1: "Sua luz ilumina tudo ao redor.", line2: "Amo cada detalhe da sua existência. ✨" },
    3: { line1: "Você é a minha inspiração diária.", line2: "Que seu dia seja tão doce quanto você. 🍬" },
    4: { line1: "Sua força é admirável, meu amor.", line2: "Estou torcendo por você a cada segundo. 🤞" },
    5: { line1: "Respire fundo e sinta meu abraço.", line2: "O mundo fica melhor com o seu sorriso. 🌍" },
    6: { line1: "Você é poesia em forma de mulher.", line2: "Meu coração bate no ritmo do seu. 💓" },
    7: { line1: "Sua paz é a minha prioridade.", line2: "Você é a obra de arte mais linda que já vi. 🎨" },
    8: { line1: "Nada brilha mais que seus olhos felizes.", line2: "Sou o homem mais sortudo por ter você. 🍀" },
    9: { line1: "Falta pouco para eu te encher de beijos.", line2: "Você é o meu lar, onde quer que eu esteja. 🏡" },
    10: { line1: "Hoje é dia de celebrar você!", line2: "Prepare-se para ser muito mimada. Te amo! ❤️" }
};

const successMessages = [
    "Uau! Você é incrível, amor! ❤️",
    "Você é a melhor namorada do mundo! ✨",
    "Amo ver você feliz desse jeito! 🌸",
    "Meu coração bate mais forte por você! ❤️",
    "Você merece todo o amor do universo, minha vida!"
];


// --- Auth Functions ---

function initAuth() {
    console.log("Inicializando autenticação..."); // Debug
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const loginBtn = document.getElementById('login-btn');

    if(loginBtn) {
        console.log("Botão de login encontrado, adicionando listener.");
        loginBtn.addEventListener('click', signInWithGoogle);
    } else {
        console.error("ERRO: Botão de login não encontrado!");
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            userDocRef = doc(db, "tracker", user.uid);
            
            loginScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            console.log("Usuário logado:", user.displayName);
            
            // Admin Check

            if (user.email === 'thalessena272006@gmail.com') {
                isAdmin = true;
                initAdminUI();
                showCustomAlert("Olá, Chefe! 🛠️", "Painel Administrativo liberado para você.");
            }

            // Update Profile Info for Admin Visibility
            updateUserProfile(user);

            loadProgress();
        } else {
            currentUser = null;
            userDocRef = null;
            isAdmin = false;
            viewingOtherUser = false;
            
            loginScreen.classList.remove('hidden');
            appContainer.classList.add('hidden');
        }
    });
}

async function signInWithGoogle() {
    console.log("Tentando logar com Google..."); // Debug log
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Login bem sucedido:", result.user.displayName);
    } catch (error) {
        console.error("Erro ao logar:", error);
        showCustomAlert("Ops!", `Erro ao fazer login: ${error.message}`);
    }
}

async function signOutUser() {
    showCustomConfirm(
        "Sair da Conta?",
        "Deseja mesmo sair? Sentirei saudades! 🥺",
        async () => {
            try {
                await signOut(auth);
                location.reload();
            } catch (error) {
                console.error("Erro ao sair:", error);
            }
        }
    );
}

async function updateUserProfile(user) {
    if (!userDocRef) return;
    try {
        await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: new Date()
        }, { merge: true });
    } catch (e) {
        console.error("Erro ao atualizar perfil:", e);
    }
}

// --- Navigation Controller ---
window.navigateTo = function(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    // Show selected view
    const target = document.getElementById(`view-${viewId}`);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(viewId)) {
            btn.classList.add('active');
        }
    });

    // Mobile: Close sidebar after selection
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) sidebar.classList.add('collapsed');
    }

    // Refresh data if needed
    if(viewId === 'memories') renderMemories();
};

function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        // Hide toggle button when sidebar is OPEN (not collapsed)
        if (toggleBtn) {
            if (!isCollapsed) {
                toggleBtn.classList.add('hidden-btn');
            } else {
                toggleBtn.classList.remove('hidden-btn');
            }
        }
    }
}

function initSidebarListeners() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('close-sidebar-btn');

    if (toggleBtn) toggleBtn.onclick = toggleSidebar;
    if (closeBtn) closeBtn.onclick = toggleSidebar;
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = signOutUser;
}


// --- Helper Functions ---

function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
}

function calculatePoints(missionShift, hasPhoto) {
    let pts = 0;
    const currentShift = getCurrentShift();
    const isOnTime = currentShift === missionShift;

    // Base Points
    pts = isOnTime ? 100 : 50;

    // Photo Penalty (Half points if no photo)
    if (!hasPhoto) pts = Math.floor(pts / 2);

    return pts;
}

// --- Firebase Persistence ---

async function saveProgress() {
    if (!userDocRef || viewingOtherUser) return; // Block save if viewing others
    try {
        await setDoc(userDocRef, {
            points: points,
            completedMissions: completedMissions,
            currentDay: currentDay,
            lastUpdated: new Date()
        }, { merge: true });
        console.log("Progresso salvo.");
    } catch (e) {
        console.error("Erro ao salvar: ", e);
    }
}

async function loadProgress() {
    if (!userDocRef) return;
    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            points = data.points || 0;
            completedMissions = data.completedMissions || [];
            currentDay = data.currentDay || 1;
        } else {
            points = 0;
            completedMissions = [];
            currentDay = 1;
            saveProgress();
        }
        updateUI();
        renderMissions();
        renderMemories(); 
        
        // Check triggers on load (if they left it pending)
        checkMilestones();
    } catch (e) {
        console.error("Erro ao carregar: ", e);
    }
}

// --- Photo Upload & Mission Logic ---

async function uploadMissionPhoto(file, missionId) {
    if (!currentUser) return null;
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');

    try {
        const storageRef = ref(storage, `users/${currentUser.uid}/day_${currentDay}/${missionId}_${Date.now()}.jpg`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (error) {
        console.error("Upload error:", error);
        showCustomAlert("Erro de Upload", "Não foi possível enviar a foto. Tente novamente! 😔");
        return null;
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

function updateUI() {
    const pointsCounter = document.getElementById('points-counter');
    if(pointsCounter) pointsCounter.textContent = points;
    
    const dailyMissions = missionsSchedule[currentDay] || [];
    const totalDaily = dailyMissions.length;
    const completedDaily = dailyMissions.filter(m => {
        return completedMissions.some(cm => (cm.id === m.id) || (cm === m.id));
    }).length;
    
    document.getElementById('completed-count').textContent = completedDaily;
    document.getElementById('total-count').textContent = totalDaily;
    
    const progressPercent = totalDaily === 0 ? 0 : (completedDaily / totalDaily) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    const btn = document.getElementById('next-day-btn');
    if ((completedDaily === totalDaily && totalDaily > 0) || isAdmin) {
        if(btn) btn.style.display = 'flex';
    } else {
         if(btn) btn.style.display = 'none';
    }

    const dayHeader = document.getElementById('day-header');
    if(dayHeader) dayHeader.textContent = `Dia ${currentDay} de 10`;
    
    updateFooterQuotes();
}

function renderMissions() {
    const grid = document.getElementById('mission-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const todaysMissions = missionsSchedule[currentDay] || [];

    todaysMissions.forEach(mission => {
        const isCompleted = completedMissions.some(cm => (cm.id === mission.id) || (cm === mission.id));
        const card = document.createElement('div');
        card.className = `mission-card ${isCompleted ? 'completed' : ''}`;        
        card.innerHTML = `
            <div class="loading-placeholder" id="loader-${mission.id}"></div>
            <div class="card-bg-overlay" id="bg-${mission.id}" style="opacity: 0"></div>
            <div class="shift-icon" title="Turno: ${mission.shift}">${mission.icon}</div>
            <h3>${mission.title}</h3>
        `;
        
        // Image Preload Logic
        const img = new Image();
        img.src = mission.image;
        img.onload = () => {
            const loader = document.getElementById(`loader-${mission.id}`);
            const bg = document.getElementById(`bg-${mission.id}`);
            if (loader) loader.style.display = 'none';
            if (bg) {
                bg.style.backgroundImage = `url('${mission.image}')`;
                bg.style.opacity = '1';
            }
        };
        img.onerror = () => {
             const loader = document.getElementById(`loader-${mission.id}`);
             const bg = document.getElementById(`bg-${mission.id}`);
             if(loader) loader.style.display = 'none';
             if(bg) {
                 bg.style.background = 'linear-gradient(135deg, #ffb3c1 0%, #d4af37 100%)';
                 bg.style.opacity = '1';
                 bg.innerHTML = '<div class="fallback-icon">✨</div>';
             }
        };
        
        card.onclick = () => openModal(mission);
        grid.appendChild(card);
    });
}

function openModal(mission) {
    const modal = document.getElementById('mission-modal');
    const body = document.getElementById('modal-body');
    const completedEntry = completedMissions.find(cm => (cm.id === mission.id) || (cm === mission.id));
    const isCompleted = !!completedEntry;
    
    // Celebration Effect on Open ✨
    confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffb3c1', '#ff4d6d', '#d4af37'],
        shapes: ['circle', 'heart'],
        scalar: 1.2
    });

    
    const potentialPoints = calculatePoints(mission.shift, true); // Assuming photo
    
    body.innerHTML = `
        <h2>${mission.title}</h2>
        <p>${mission.longDescription}</p>
        <p class="shift-info">Turno sugerido: ${mission.shift} ${mission.icon}</p>

        <!-- Form Section -->
        <div class="modal-form" style="${isCompleted ? 'display:none' : ''}">
            <div class="upload-section">
                <label for="photo-input-${mission.id}" class="photo-upload-label">
                    📸 Tirar Foto / Enviar (+${potentialPoints} PTS)
                </label>
                <input type="file" id="photo-input-${mission.id}" accept="image/*" capture="environment" style="display:none">
                <div id="preview-area-${mission.id}" class="preview-area"></div>
            </div>
            
            <div class="modal-footer">
                <button class="btn-primary" id="btn-complete-photo" disabled>
                    ENVIAR FOTO E CONCLUIR
                </button>
                <button class="btn-secondary" id="btn-complete-no-photo">
                    Concluir sem foto (Metade dos pontos)
                </button>
            </div>
        </div>

        <!-- Completed View -->
        <div class="completed-view" style="${!isCompleted ? 'display:none' : ''}">
            <p style="text-align:center; color:green; font-weight:bold; margin:20px 0;">
                Missão já concluída! ❤️
            </p>
            ${completedEntry && completedEntry.photoUrl ? 
              `<img src="${completedEntry.photoUrl}" style="max-width:100%; border-radius:10px;">` : ''}
        </div>
    `;

    modal.classList.add('active');

    if(!isCompleted) {
        const fileInput = document.getElementById(`photo-input-${mission.id}`);
        const btnPhoto = document.getElementById('btn-complete-photo');
        const btnNoPhoto = document.getElementById('btn-complete-no-photo');
        const previewArea = document.getElementById(`preview-area-${mission.id}`);
        let selectedFile = null;

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewArea.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 10px; margin-top: 10px; max-height: 200px;">`;
                };
                reader.readAsDataURL(file);
                
                btnPhoto.disabled = false;
                btnPhoto.style.opacity = "1";
            }
        });

        // 1. Complete with Photo
        btnPhoto.onclick = async () => {
            if (selectedFile) {
                btnPhoto.textContent = "ENVIANDO... 💖";
                btnPhoto.disabled = true;
                btnNoPhoto.style.display = 'none'; // Hide other option
                
                const photoUrl = await uploadMissionPhoto(selectedFile, mission.id);
                if (photoUrl) {
                    const pts = calculatePoints(mission.shift, true);
                    toggleMission(mission.id, pts, photoUrl);
                    closeModal();
                    showSuccessAlert();
                    successSound.play().catch(e => console.log(e));
                } else {
                    btnPhoto.textContent = "TENTAR NOVAMENTE";
                    btnPhoto.disabled = false;
                }
            }
        };

        // 2. Complete without Photo
        btnNoPhoto.onclick = () => {
            showCustomConfirm(
                "Sem foto? 📸",
                "Tem certeza? Enviar uma foto guarda o momento para sempre e vale o dobro de pontos! ✨",
                () => {
                    const pts = calculatePoints(mission.shift, false);
                    toggleMission(mission.id, pts, null); // No photo
                    closeModal();
                    showSuccessAlert();
                    successSound.play().catch(e => console.log(e));
                }
            );
        };
    }

    document.querySelector('.close-modal').onclick = closeModal;
}

function closeModal() {
    document.getElementById('mission-modal').classList.remove('active');
}

function toggleMission(id, missionPoints, photoUrl = null) {
    if (completedMissions.some(m => m.id === id || m === id)) return;
    
    const entry = {
        id: id,
        photoUrl: photoUrl,
        timestamp: new Date().toISOString(),
        day: currentDay,
        pointsEarned: missionPoints
    };

    completedMissions.push(entry);
    points += missionPoints;
    saveProgress();
    
    renderMissions();
    updateUI();
    updateUI();
    renderMemories(); // Ensure memory is added if photo existed
    triggerHeartRain();
    playShimmer(); // Premium Sound Effect
    checkMilestones(); // Check if this completion triggers a big event
}

const dailyMotivation = {
    1: "O começo é a parte mais importante. Estou orgulhoso de você! ❤️",
    2: "Você é mais forte do que imagina. Continue brilhando! ✨",
    3: "Cada passo seu é uma vitória. Te admiro tanto! 🌹",
    4: "Seu sorriso ilumina meu mundo. Não desista! ☀️",
    5: "Estamos na metade! Você é incrível, meu amor! 🚀",
    6: "Sua dedicação me inspira todos os dias. Te amo! 💖",
    7: "Falta pouco! Você está fazendo tudo com tanto carinho... 🥰",
    8: "Você é a mulher da minha vida. Continue firme! 💍",
    9: "Quase lá! Sinto seu amor em cada missão completada. 🎆",
    10: "Último dia! Prepare-se para o nosso reencontro! 👩‍❤️‍👨"
};

// --- Custom Alert System ---
function showCustomAlert(title, message, callback) {
    const modal = document.getElementById('custom-alert');
    if (!modal) {
        alert(message); // Fallback
        if (callback) callback();
        return;
    }

    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').innerHTML = message.replace(/\n/g, '<br>');
    
    modal.classList.remove('hidden');
    modal.classList.add('active'); // Reusing active class from other modals if exists, or ensures visibility

    const btn = document.getElementById('alert-ok-btn');
    
    // Remove old listeners to avoid stacking
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('active');
        if (callback) callback();
    };
    
    // Premium Sound trigger if available
    try { playShimmer(); } catch(e) {}
}

function showCustomConfirm(title, message, onYes, onNo) {
    const modal = document.getElementById('custom-confirm');
    if (!modal) {
        if(confirm(message)) {
            if(onYes) onYes();
        } else {
            if(onNo) onNo();
        }
        return;
    }

    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').innerHTML = message.replace(/\n/g, '<br>');
    
    modal.classList.remove('hidden');
    modal.classList.add('active');

    const yesBtn = document.getElementById('confirm-yes-btn');
    const noBtn = document.getElementById('confirm-no-btn');
    
    // Clean Listeners
    const newYes = yesBtn.cloneNode(true);
    const newNo = noBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYes, yesBtn);
    noBtn.parentNode.replaceChild(newNo, noBtn);
    
    newYes.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('active');
        if (onYes) onYes();
    };
    
    newNo.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('active');
        if (onNo) onNo();
    };
    
    try { playShimmer(); } catch(e) {}
}


function advanceDay() {
    if (currentDay < 10) {
        // ... (Logic handled inside custom alert flow)
        currentDay++;
        saveProgress();
        renderMissions();
        updateUI();
        
        const msg = dailyMotivation[currentDay] || "Um novo dia cheio de amor para você! ❤️";
        
        showCustomAlert(
            `Bem-vinda ao Dia ${currentDay}! ✨`, 
            msg, 
            () => checkMilestones() 
        );
        
    } else {
        showCustomAlert(
            "Parabéns! 🥂",
            "Você completou toda a jornada de 10 dias! Te amo mil milhões! ❤️"
        );
    }
}

function showSuccessAlert() {
    const msg = successMessages[Math.floor(Math.random() * successMessages.length)];
    showCustomAlert("Sucesso! 🎉", msg);
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

function updateFooterQuotes() {
    const line1 = document.querySelector('.footer-phrase');
    const line2 = document.getElementById('daily-quote');
    
    const quotes = dailyQuotes[currentDay] || dailyQuotes[1];
    
    if(line1) line1.textContent = `"${quotes.line1}"`;
    if(line2) line2.textContent = `"${quotes.line2}"`;
}

// --- Memories Render ---

function renderMemories() {
    const list = document.getElementById('memories-grid');
    if(!list) return;
    
    const memories = completedMissions.filter(m => typeof m === 'object' && m.photoUrl).reverse();

    if (memories.length === 0) {
        list.innerHTML = '<p class="empty-state">Ainda não há memórias. Complete missões com fotos para encher este álbum! ❤️</p>';
        return;
    }

    list.innerHTML = '';
    memories.forEach(mem => {
        let missionData = null;
        for (let day in missionsSchedule) {
            const found = missionsSchedule[day].find(m => m.id === mem.id);
            if (found) {
                missionData = found;
                break;
            }
        }

        if (missionData) {
            const item = document.createElement('div');
            item.className = 'memory-item';
            item.innerHTML = `
                <img src="${mem.photoUrl}" class="memory-thumb" alt="Foto">
                <div class="memory-info">
                    <h4>${missionData.title}</h4>
                    <span>Dia ${mem.day || '?'}</span>
                </div>
            `;
            item.onclick = () => openPolaroid(mem.photoUrl, "Dia " + (mem.day || '?') + " - " + missionData.title);
            list.appendChild(item);
        }
    });
}

function openPolaroid(src, caption) {
    const modal = document.getElementById('polaroid-modal');
    const img = document.getElementById('polaroid-img');
    const txt = document.getElementById('polaroid-caption');
    const close = document.querySelector('.close-polaroid');

    img.src = src;
    txt.textContent = caption;
    modal.classList.add('active');

    close.onclick = () => {
        modal.classList.remove('active');
    };
    
    modal.onclick = (e) => {
        if(e.target === modal) close.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- CSS Particles ---
    function createHeartParticle() {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
        heart.style.fontSize = Math.random() * 1 + 0.5 + 'rem';
        heart.innerText = Math.random() > 0.5 ? '❤️' : '🌸';
        
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 10000); 
    }

    setInterval(createHeartParticle, 2000); // New particle every 2s

    initAuth();
    initSidebarListeners(); // Init Sidebar
    
    const nextDayBtn = document.getElementById('next-day-btn');
    if (nextDayBtn) nextDayBtn.onclick = advanceDay;

    updateFooterQuotes();
    // Default View handled by HTML classes, but explicit init helps
    window.navigateTo('home');
});

// --- Admin System ---

function initAdminUI() {
    // 1. Create Floating Gear Button
    const gearBtn = document.createElement('button');
    gearBtn.innerHTML = '⚙️';
    gearBtn.className = 'admin-gear-btn';
    gearBtn.onclick = toggleAdminPanel;
    document.body.appendChild(gearBtn);

    // 2. Create Admin Panel Container (Hidden)
    const panel = document.createElement('div');
    panel.id = 'admin-panel';
    panel.className = 'admin-panel hidden';
    panel.innerHTML = `
        <div class="admin-header">
            <h2>Painel do Amor (Admin) ❤️</h2>
            <button onclick="toggleAdminPanel()">✖</button>
        </div>
        <div class="admin-content">
            <div class="admin-section">
                <h3>Navegação Livre 🚀</h3>
                <div class="day-selector">
                    <button onclick="adminJumpDay(-1)">◀ Dia Anterior</button>
                    <span id="admin-current-day">Dia ${currentDay}</span>
                    <button onclick="adminJumpDay(1)">Próximo Dia ▶</button>
                </div>
            </div>

            <div class="admin-section">
                <h3>Monitorar Mozão 🕵️‍♀️</h3>
                <button class="btn-primary-small" onclick="loadAllUsers()">Carregar Usuários</button>
                <div id="admin-users-list" class="users-list"></div>
            </div>

            <div id="admin-user-detail" class="hidden">
                <hr>
                <h3 id="detail-username">Progresso de: ...</h3>
                <p>Pontos: <span id="detail-points">0</span></p>
                <p>Missões: <span id="detail-missions">0</span></p>
                <h4>Galeria de Fotos 📸</h4>
                <div id="detail-gallery" class="admin-gallery"></div>
                <button class="btn-secondary-small" onclick="exitUserView()">Sair do Modo Espião</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
}

function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        document.getElementById('admin-current-day').textContent = `Dia ${currentDay}`;
    }
}

async function loadAllUsers() {
    const list = document.getElementById('admin-users-list');
    list.innerHTML = 'Carregando...';

    try {
        const querySnapshot = await getDocs(collection(db, "tracker"));
        list.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const btn = document.createElement('button');
            btn.className = 'user-card-btn';
            
            // Name Display Logic
            // Prioritize displayName, then email, then ID
            let nameLabel = userData.displayName || userData.email || doc.id;
            
            // Date formatting
            let dateStr = '???';
            if (userData.lastLogin) {
                dateStr = new Date(userData.lastLogin.seconds * 1000).toLocaleDateString();
            } else if (userData.lastUpdated) {
                dateStr = new Date(userData.lastUpdated.seconds * 1000).toLocaleDateString();
            }

            btn.innerHTML = `<strong>${nameLabel}</strong> <br> <span style="font-size:0.8em">Visto: ${dateStr}</span>`;
            
            btn.onclick = () => viewUserProgress(doc.id, userData);
            list.appendChild(btn);
        });
    } catch (e) {
        list.textContent = "Erro ao carregar usuários: " + e.message;
    }
}

function viewUserProgress(uid, data) {
    viewingOtherUser = true; // LOCK SAVING
    
    // Update Local State for Viewing
    points = data.points || 0;
    completedMissions = data.completedMissions || [];
    // We DON'T update currentDay to avoid confusing the Admin's navigation context 
    // OR we update it to see what they see. Let's keep Admin's day navigation separate.
    
    // Render UI with User's Data
    updateUI();
    renderMissions();
    renderMemories();

    // Show Details in Admin Panel
    document.getElementById('admin-user-detail').classList.remove('hidden');
    document.getElementById('detail-username').textContent = `Vendo: ${uid}`;
    document.getElementById('detail-points').textContent = points;
    document.getElementById('detail-missions').textContent = completedMissions.length;
    
    renderAdminGallery(completedMissions);
    showCustomAlert("Modo Espião Ativo! 🕵️‍♂️", "Você está vendo os dados de outro usuário.<br>O salvamento automático está <b>DESATIVADO</b>.");
}

function exitUserView() {
    viewingOtherUser = false;
    document.getElementById('admin-user-detail').classList.add('hidden');
    loadProgress(); // Reload Admin's own data (or reset)
    showCustomAlert("Modo Espião Encerrado", "Seus dados foram recarregados. 🕵️‍♂️");
}

function renderAdminGallery(missions) {
    const gallery = document.getElementById('detail-gallery');
    gallery.innerHTML = '';
    
    const photos = missions.filter(m => m.photoUrl);
    if (photos.length === 0) {
        gallery.innerHTML = '<p>Nenhuma foto enviada.</p>';
        return;
    }

    photos.forEach(m => {
        const img = document.createElement('img');
        img.src = m.photoUrl;
        img.className = 'admin-thumb';
        img.onclick = () => window.open(m.photoUrl, '_blank');
        gallery.appendChild(img);
    });
}

function adminJumpDay(delta) {
    const newDay = currentDay + delta;
    if (newDay >= 1 && newDay <= 10) {
        currentDay = newDay;
        document.getElementById('admin-current-day').textContent = `Dia ${currentDay}`;
        // Force Update UI without saving if viewing other
        renderMissions();
        updateUI();
    }
}

// --- Milestone System ---

function checkMilestones() {
    const dailyMissions = missionsSchedule[currentDay] || [];
    const totalDaily = dailyMissions.length;
    const completedDaily = dailyMissions.filter(m => {
        return completedMissions.some(cm => (cm.id === m.id) || (cm === m.id));
    }).length;

    // --- First Mission of the Day Reward ---
    if (completedDaily === 1) {
        // Only show if we haven't already shown it this session (optional, but good UX)
        // For simplicity, we show it. But we must ensure it doesn't block other things.
        // We defer it slightly to let other animations play.
        setTimeout(() => {
             showCustomAlert(
                "Primeira Conquista! 🥇",
                "Você começou o dia com tudo! Tenho muito orgulho de você. Continue assim! ❤️"
            );
        }, 1000);
    }

    // --- Day 5: Halfway ---
    if (currentDay === 5 && completedDaily === totalDaily) {
       setTimeout(() => showMilestone(5), 1500); // Small delay for suspense
    }

    // Trigger Day 10: Final
    if (currentDay === 10 && completedDaily === totalDaily) {
       setTimeout(() => showMilestone(10), 1000);
    }
}

function showMilestone(id) {
    const overlay = document.getElementById(`milestone-${id}`);
    if (overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('active'), 50); // Fade in
        
        // Effects
        playShimmer(); 
        if (id === 5) {
            triggerHeartRain(); // Extra rain
        }
        if (id === 10) {
            const duration = 15 * 1000;
            const end = Date.now() + duration;

            // Premium Confetti Loop
            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#d4af37', '#c9184a', '#ffffff'] // Gold/Red/White
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#d4af37', '#c9184a', '#ffffff']
                });

                if (Date.now() < end && overlay.classList.contains('active')) {
                    requestAnimationFrame(frame);
                }
            }());
            
            loadFinalCarousel();

            // Parallax Interactions
            overlay.addEventListener('mousemove', (e) => {
                const bg = overlay.querySelector('.parallax-bg');
                if(bg) {
                    const x = (e.clientX / window.innerWidth) * 40;
                    const y = (e.clientY / window.innerHeight) * 40;
                    bg.style.transform = `translate(${x}px, ${y}px)`;
                }

                // Heart Trail Effect (Only on Day 10)
                createHeartTrail(e.clientX, e.clientY);
            });
        }
    }
}

function createHeartTrail(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    // Randomize slight rotation for natural feel
    const rotation = Math.random() * 40 - 20; 
    heart.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    const overlay = document.getElementById('milestone-10');
    if(overlay) overlay.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function closeMilestone(id) {
    const overlay = document.getElementById(`milestone-${id}`);
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 800);
        
        // Auto-advance logic for Day 5 (optional, user requested "Continue to Day 6" button text)
        if (id === 5 && !isAdmin) {
            // Optional: Auto advance could go here, but stick to button action
            // advanceDay(); // User likely wants to click the button to just close, then manually advance or have it auto-advance
        }
    }
}

function loadFinalCarousel() {
    const carousel = document.getElementById('final-carousel');
    if (!carousel) return;
    carousel.innerHTML = '';
    
    // Sort by day/time
    const photos = completedMissions.filter(m => m.photoUrl).sort((a,b) => (a.day || 0) - (b.day || 0));

    if (photos.length === 0) {
        carousel.innerHTML = '<p>Você não tirou fotos... mas as memórias estão no coração! ❤️</p>';
        return;
    }

    photos.forEach(p => {
        const img = document.createElement('img');
        img.src = p.photoUrl;
        img.title = `Dia ${p.day}`;
        carousel.appendChild(img);
    });
}

// --- Expose for HTML OnClick ---
window.toggleAdminPanel = toggleAdminPanel;
window.loadAllUsers = loadAllUsers;
window.exitUserView = exitUserView;
window.adminJumpDay = adminJumpDay;
window.closeMilestone = closeMilestone;
