import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

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
const provider = new GoogleAuthProvider();

// App State
let points = 0;
let completedMissions = [];
let currentDay = 1;
let currentUser = null;
let userDocRef = null;

// --- 10-Day Journey Data ---
const missionsSchedule = {
  1: [
    { id: 101, shift: 'Manhã', icon: '☀️', title: 'Skincare de Rainha 🧖‍♀️', desc: "Comece cuidando de si mesma.", longDescription: "Ei amor, quero que você comece o dia se sentindo uma rainha. Tire um tempinho para cuidar da sua pele, passar seus cremes favoritos e se sentir radiante. Você brilha! ✨", points: 0, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" },
    { id: 102, shift: 'Manhã', icon: '☀️', title: 'Álbum Favorito 🎶', desc: "Trilha sonora para começar bem.", longDescription: "Minha vida, coloque aquele álbum que você ama e cante junto. Deixe a música encher a casa e o seu coração de alegria. ❤️", points: 0, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop" },
    { id: 103, shift: 'Tarde', icon: '🌤️', title: 'Leitura Inspiradora 📖', desc: "Viaje para outro mundo.", longDescription: "Princesa, tire um tempo hoje à tarde para ler algo que te inspire. Seja um livro, um artigo ou um blog, apenas mergulhe em novas ideias.", points: 0, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
    { id: 104, shift: 'Tarde', icon: '🌤️', title: 'Hidratação Consciente 💧', desc: "Beba água com intenção.", longDescription: "Ei gatinha, não esqueça de se hidratar. Beba água sentindo que está nutrindo seu corpo lindo. Cuide-se por mim!", points: 0, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop" },
    { id: 105, shift: 'Noite', icon: '🌙', title: 'Flashback Nosso 📸', desc: "Relembre nossos momentos.", longDescription: "Amor, pegue o celular e olhe nossas fotos antigas. Lembre de como começamos e de todo o amor que construímos até aqui. Te amo! ❤️", points: 0, image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop" },
    { id: 106, shift: 'Noite', icon: '🌙', title: 'Bilhete para Si 💌', desc: "Uma carta de amor própria.", longDescription: "Escreva um bilhete carinhoso para você mesma ler amanhã. Diga o quanto você é forte e incrível. Eu assino embaixo! ✨", points: 0, image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop" }
  ],
  2: [
    { id: 201, shift: 'Manhã', icon: '☀️', title: 'Alongamento Matinal 🧘‍♀️', desc: "Desperte o corpo.", longDescription: "Bom dia, flor do dia! Comece alongando esse corpinho lindo. Estique-se bem e prepare-se para mais um dia incrível.", points: 0, image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop" },
    { id: 202, shift: 'Manhã', icon: '☀️', title: 'Café Ritual ☕', desc: "Saboreie cada gole.", longDescription: "Ei amor, faça do seu café da manhã um ritual sagrado. Sem pressa, apenas sinta o sabor e o aroma. Você merece esse momento de paz.", points: 0, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop" },
    { id: 203, shift: 'Tarde', icon: '🌤️', title: 'Desenho Livre 🎨', desc: "Solte a criatividade.", longDescription: "Minha artista, pegue papel e caneta e desenhe qualquer coisa. Deixe sua criatividade fluir sem julgamentos. Divirta-se! 🖌️", points: 0, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
    { id: 204, shift: 'Tarde', icon: '🌤️', title: 'Arrumar o Ninho 🛏️', desc: "Cama aconchegante.", longDescription: "Arrume sua cama com todo carinho, deixando-a bem convidativa para a noite. Um ninho aconchegante para a mulher mais linda do mundo.", points: 0, image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?q=80&w=800&auto=format&fit=crop" },
    { id: 205, shift: 'Noite', icon: '🌙', title: 'Cinema em Casa 🍿', desc: "Hora da comédia!", longDescription: "Amor, escolha um filme de comédia bem divertido. Quero imaginar você rindo alto do outro lado da tela. Seu sorriso é tudo! ❤️", points: 0, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop" },
    { id: 206, shift: 'Noite', icon: '🌙', title: 'Skin Care de Paz 🌙', desc: "Relaxe antes de dormir.", longDescription: "Faça sua rotina noturna com calma, sentindo a água e os produtos na pele. Prepare-se para sonhar com os anjos (e comigo). 😴", points: 0, image: "https://images.unsplash.com/photo-1556228720-1987aa789c16?q=80&w=800&auto=format&fit=crop" }
  ],
  3: [
    { id: 301, shift: 'Manhã', icon: '☀️', title: 'Podcast Novo 🎙️', desc: "Ideias novas.", longDescription: "Ei linda, que tal ouvir um podcast sobre autodescoberta ou algo que você gosta enquanto se arruma? Comece o dia inspirada!", points: 0, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop" },
    { id: 302, shift: 'Manhã', icon: '☀️', title: 'Organização Digital 📱', desc: "Limpeza no celular.", longDescription: "Tire uns minutinhos para organizar a galeria ou apagar apps que não usa. Uma vida digital organizada traz leveza, meu bem.", points: 0, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
    { id: 303, shift: 'Tarde', icon: '🌤️', title: 'Lanche Gourmet 🍓', desc: "Mimo no prato.", longDescription: "Prepare um lanche da tarde caprichado e bonito. Você come com os olhos também! Aproveite cada mordida, princesa. 🫐", points: 0, image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop" },
    { id: 304, shift: 'Tarde', icon: '🌤️', title: 'Curiosidade do Dia 🧠', desc: "Aprenda algo novo.", longDescription: "Pesquise sobre um assunto aleatório que sempre teve curiosidade. O saber não ocupa espaço e deixa você ainda mais interessante. 😉", points: 0, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
    { id: 305, shift: 'Noite', icon: '🌙', title: 'Banho Meia Luz 🕯️', desc: "Relaxamento total.", longDescription: "Tome um banho relaxante apenas com a luz do corredor ou uma vela (com cuidado!). Deixe a água levar qualquer tensão embora. 🛁", points: 0, image: "https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=800&auto=format&fit=crop" },
    { id: 306, shift: 'Noite', icon: '🌙', title: 'Novo Wallpaper 🖼️', desc: "Tela nova, vida nova.", longDescription: "Escolha uma imagem inspiradora para o fundo do seu celular. Algo que te faça sorrir toda vez que desbloquear a tela. 🌈", points: 0, image: "https://images.unsplash.com/photo-1550989460-e7ae8bdb532a?q=80&w=800&auto=format&fit=crop" }
  ],
  4: [
    { id: 401, shift: 'Manhã', icon: '☀️', title: 'Dança da Alegria 💃', desc: "Solte o corpo!", longDescription: "Amor, coloque uma música animada e dance pela casa! Sacuda o esqueleto e comece o dia com pura energia positiva! 🎶", points: 0, image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop" },
    { id: 402, shift: 'Manhã', icon: '☀️', title: 'Hidratação Labial 💋', desc: "Sorriso macio.", longDescription: "Faça uma esfoliação leve ou passe aquele lip balm potente. Quero esses lábios macios e prontos para sorrir (e me beijar na volta). 😘", points: 0, image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" },
    { id: 403, shift: 'Tarde', icon: '🌤️', title: 'Série Favorita 📺', desc: "Pausa merecida.", longDescription: "Tire um tempo para ver UM episódio daquela série que você adora. Relaxe no sofá e aproveite sua companhia. 🍿", points: 0, image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop" },
    { id: 404, shift: 'Tarde', icon: '🌤️', title: 'Drink de Frutas 🍹', desc: "Refresco colorido.", longDescription: "Prepare um suco ou drink sem álcool bem colorido e gelado. Brinde à mulher incrível que você é! 🥂", points: 0, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=800&auto=format&fit=crop" },
    { id: 405, shift: 'Noite', icon: '🌙', title: 'Olhar o Céu ✨', desc: "Conexão com o universo.", longDescription: "Vá até a janela ou quintal e olhe para o céu por 5 minutos. Lembre-se que estamos sob o mesmo céu, conectados. 🌌", points: 0, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" },
    { id: 406, shift: 'Noite', icon: '🌙', title: 'Playlist Nossa 🎵', desc: "Músicas que nos definem.", longDescription: "Ouça aquelas músicas que me fazem lembrar de você. Feche os olhos e sinta meu abraço através da melodia. ❤️", points: 0, image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop" }
  ],
  5: [
    { id: 501, shift: 'Manhã', icon: '☀️', title: 'Respiração Zen 🧘', desc: "5 minutos de paz.", longDescription: "Sente-se confortavelmente e foque apenas na sua respiração por 5 minutos. Inspire calma, expire ansiedade. Namastê. 🙏", points: 0, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" },
    { id: 502, shift: 'Manhã', icon: '☀️', title: 'Troca de Lençóis 🛏️', desc: "Cheirinho de limpeza.", longDescription: "Nada melhor que cama limpinha, né? Troque os lençóis e sinta aquele cheirinho de conforto. Você merece dormir nas nuvens.", points: 0, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop" },
    { id: 503, shift: 'Tarde', icon: '🌤️', title: 'Sonhos Futuros 📝', desc: "O que vem por aí?", longDescription: "Escreva num papel 3 sonhos que você quer realizar no futuro. Vamos sonhar juntos depois, mas hoje sonhe alto você mesma! ✨", points: 0, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop" },
    { id: 504, shift: 'Tarde', icon: '🌤️', title: 'Personalizar ✨', desc: "Toque especial.", longDescription: "Pegue um objeto seu e dê um toque pessoal. Pode ser um adesivo no caderno, mudar coisas de lugar... Deixe sua marca! 💖", points: 0, image: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=800&auto=format&fit=crop" },
    { id: 505, shift: 'Noite', icon: '🌙', title: 'Doc. Mundo 🌍', desc: "Viaje sem sair do lugar.", longDescription: "Assista um documentário sobre natureza ou um lugar bonito do mundo. Vamos planejar nossa próxima viagem juntos? ✈️", points: 0, image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=800&auto=format&fit=crop" },
    { id: 506, shift: 'Noite', icon: '🌙', title: 'Massagem nos Pés 🦶', desc: "Relaxe a base.", longDescription: "Amor, faça uma massagem nos seus pés com um creme gostoso. Eles te levam para todos os lugares, merecem carinho! 🌸", points: 0, image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=800&auto=format&fit=crop" }
  ],
  6: [
    { id: 601, shift: 'Manhã', icon: '☀️', title: 'Sessão Fotos 📸', desc: "Me sinto linda.", longDescription: "Ei, gata! Tire algumas selfies onde você se sinta maravilhosa. Não precisa postar, é só para você se admirar. Você é linda! 😍", points: 0, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop" },
    { id: 602, shift: 'Manhã', icon: '☀️', title: 'Água com Limão 🍋', desc: "Detox matinal.", longDescription: "Comece o dia com um copo de água com limão. Simples, saudável e refrescante. Cuide desse templo que é seu corpo!", points: 0, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop" },
    { id: 603, shift: 'Tarde', icon: '🌤️', title: 'Poesia ou Letra 📜', desc: "Palavras que tocam.", longDescription: "Leia um poema bonito ou a letra de uma música que mexa com você. Deixe a arte tocar sua alma hoje. 🎶", points: 0, image: "https://images.unsplash.com/photo-1474377207190-a7d8b3334068?q=80&w=800&auto=format&fit=crop" },
    { id: 604, shift: 'Tarde', icon: '🌤️', title: 'Organizar Make ✨', desc: "Beleza organizada.", longDescription: "Dê uma geral na sua área de maquiagem ou trabalho. Limpar os pincéis ou organizar as canetas dá uma paz mental incrível.", points: 0, image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop" },
    { id: 605, shift: 'Noite', icon: '🌙', title: 'Desenho Infância 📺', desc: "Nostalgia pura.", longDescription: "Lembra daquele desenho que você amava? Assista um episódio! Volte a ser criança um pouquinho, meu amor. 🌈", points: 0, image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=800&auto=format&fit=crop" },
    { id: 606, shift: 'Noite', icon: '🌙', title: '10 Coisas em Ti 📝', desc: "Amor por você.", longDescription: "Faça uma lista de 10 coisas que você ama em VOCÊ mesma. Pode ser seu sorriso, sua força... Eu amo tudo em você! ❤️", points: 0, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" }
  ],
  7: [
    { id: 701, shift: 'Manhã', icon: '☀️', title: 'Caminhada Leve 🚶‍♀️', desc: "Movimento suave.", longDescription: "Caminhe um pouco pela casa ou quintal, sentindo seus passos. Agradeça por suas pernas fortes e por poder ir e vir. 🌿", points: 0, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop" },
    { id: 702, shift: 'Manhã', icon: '☀️', title: 'Máscara Capilar 💇‍♀️', desc: "Cabelo de diva.", longDescription: "Hoje é dia de cuidar das madeixas! Faça aquela hidratação poderosa e jogue esse cabelo lindo para lá e para cá. 💆‍♀️", points: 0, image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop" },
    { id: 703, shift: 'Tarde', icon: '🌤️', title: 'Poliglota 🌍', desc: "5 frases novas.", longDescription: "Aprenda 5 frases simples em um idioma que você acha chique. 'Je t'aime' vale, hein? 😉🇫🇷", points: 0, image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
    { id: 704, shift: 'Tarde', icon: '🌤️', title: 'Destralhar Gaveta 🗄️', desc: "Leveza no espaço.", longDescription: "Escolha AQUELA gaveta bagunçada e coloque ordem. Jogar fora o que não serve abre espaço para o novo, amor!", points: 0, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
    { id: 705, shift: 'Noite', icon: '🌙', title: 'Jantar Especial 🍽️', desc: "Mimo no jantar.", longDescription: "Mesmo que seja simples ou delivery, arrume a mesa bonitinha, acenda uma vela. Jante como se estivesse num encontro com a melhor pessoa: você! 🍝", points: 0, image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=800&auto=format&fit=crop" },
    { id: 706, shift: 'Noite', icon: '🌙', title: 'Meditação Sons 🌧️', desc: "Calma da natureza.", longDescription: "Coloque sons de chuva ou floresta, feche os olhos e deixe sua mente viajar para um lugar tranquilo. Durma bem, minha paz. 😴", points: 0, image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop" }
  ],
  8: [
    { id: 801, shift: 'Manhã', icon: '☀️', title: 'Penteado Novo 🎀', desc: "Experimente algo.", longDescription: "Tente prender o cabelo de um jeito diferente hoje. Um coque, uma trança... Mudar o visual muda o ânimo! Você fica linda de qualquer jeito. 😍", points: 0, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
    { id: 802, shift: 'Manhã', icon: '☀️', title: 'Look Poderosa 👗', desc: "Se vista para arrasar.", longDescription: "Monte um look que faz você se sentir invencível, mesmo que não vá sair. Olhe no espelho e diga: 'Eu sou demais!'. 🔥", points: 0, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" },
    { id: 803, shift: 'Tarde', icon: '🌤️', title: 'Receita Doce 🧁', desc: "Adoce a vida.", longDescription: "Aprenda uma receita simples de sobremesa ou faça aquele brigadeiro de colher. A vida precisa ser doce, assim como você! 🍬", points: 0, image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=800&auto=format&fit=crop" },
    { id: 804, shift: 'Tarde', icon: '🌤️', title: 'Colorir Terapia 🖍️', desc: "Mente quieta.", longDescription: "Pinte um desenho ou mandalas. É uma terapia incrível para acalmar a mente e focar no agora. Escolha cores vivas! 🌈", points: 0, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
    { id: 805, shift: 'Noite', icon: '🌙', title: 'Filme Suspense 🎬', desc: "Prenda a atenção.", longDescription: "Assista um filme de suspense que te prenda do início ao fim. Daqueles de roer as unhas! (Mas não roa, tá? haha). 🍿", points: 0, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop" },
    { id: 806, shift: 'Noite', icon: '🌙', title: 'Vídeos Engraçados 📹', desc: "Nossas risadas.", longDescription: "Veja vídeos nossos antigos, especialmente os engraçados. Ouvir sua risada é meu som favorito no mundo todo! 😂", points: 0, image: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=800&auto=format&fit=crop" }
  ],
  9: [
    { id: 901, shift: 'Manhã', icon: '☀️', title: 'Alongar Pescoço 💆‍♀️', desc: "Xô tensão.", longDescription: "Bom dia! Dedique uns minutos para alongar bem o pescoço e ombros. Tire o peso do mundo das costas, relaxe... 🍃", points: 0, image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop" },
    { id: 902, shift: 'Manhã', icon: '☀️', title: 'Perfume Favorito 🌸', desc: "Cheiro de você.", longDescription: "Passe aquele perfume que você ama, só para ficar em casa sentindo esse cheiro maravilhoso. Sinta-se cheirosa e poderosa! ✨", points: 0, image: "https://images.unsplash.com/photo-1594035910387-fea477942698?q=80&w=800&auto=format&fit=crop" },
    { id: 903, shift: 'Tarde', icon: '🌤️', title: 'Notícias Positivas 📰', desc: "Vibe boa.", longDescription: "Hoje, só leia coisas boas. Procure sites de 'boas notícias' e encha sua mente de esperança e positividade. O mundo tem coisas lindas! 🌍", points: 0, image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop" },
    { id: 904, shift: 'Tarde', icon: '🌤️', title: 'Fruta Diferente 🥝', desc: "Paladar novo.", longDescription: "Experimente uma fruta que você não come sempre. Sinta a textura, o sabor... Uma pequena aventura gastronômica! 😋", points: 0, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop" },
    { id: 905, shift: 'Noite', icon: '🌙', title: 'Spa de Mãos 💅', desc: "Toque suave.", longDescription: "Esfolie e hidrate bem suas mãos. Elas criam, acariciam e merecem todo cuidado. Deixe-as macias como seda. 🖐️", points: 0, image: "https://images.unsplash.com/photo-1632733711679-529a96996059?q=80&w=800&auto=format&fit=crop" },
    { id: 906, shift: 'Noite', icon: '🌙', title: 'Sem Telas 📵', desc: "Desconecte-se.", longDescription: "Desligue celular e TV 30 minutos antes de dormir. Deixe sua mente desacelerar de verdade. Bons sonhos, meu anjo. 🌙", points: 0, image: "https://images.unsplash.com/photo-1511295742362-92c96b53b035?q=80&w=800&auto=format&fit=crop" }
  ],
  10: [
    { id: 1001, shift: 'Manhã', icon: '☀️', title: 'Preparar a Casa 🏠', desc: "Estou chegando!", longDescription: "Ei amor, o grande dia! Arrume a casa (ou o quarto) para a minha volta. Deixe tudo pronto para o nosso reencontro! ❤️", points: 0, image: "https://images.unsplash.com/photo-1522771753018-41163c629ce3?q=80&w=800&auto=format&fit=crop" },
    { id: 1002, shift: 'Manhã', icon: '☀️', title: 'Ritual Beleza ✨', desc: "Glow up final.", longDescription: "Faça seu ritual de beleza completo hoje. Quero te ver radiante (como sempre) quando eu chegar. Você é a mulher da minha vida! 💄", points: 0, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" },
    { id: 1003, shift: 'Tarde', icon: '🌤️', title: 'Música Abraço 🎶', desc: "Trilha do amor.", longDescription: "Escolha A música que vai tocar na sua cabeça (ou no som) quando a gente se abraçar. Qual vai ser a trilha sonora do nosso beijo? 🎵", points: 0, image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop" },
    { id: 1004, shift: 'Tarde', icon: '🌤️', title: 'Brinde à Força 🥂', desc: "Você conseguiu!", longDescription: "Faça um brinde a você mesma! Você passou por esses dias com força e amor. Estou tão orgulhoso de você, minha guerreira! 🏆", points: 0, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop" },
    { id: 1005, shift: 'Noite', icon: '🌙', title: 'Nosso Filme 🎞️', desc: "Clássico nosso.", longDescription: "Assista 'aquele' filme que é a nossa cara. Sinta as borboletas no estômago... Eu tô chegando!!! 🦋", points: 0, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop" },
    { id: 1006, shift: 'Noite', icon: '🌙', title: 'Coração Aberto ❤️', desc: "Só vem.", longDescription: "Prepare o coração, respire fundo e sorria. O melhor abraço do mundo está a caminho. TE AMO INFINITO! Até já! ❤️❤️❤️", points: 0, image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=800&auto=format&fit=crop" }
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

// --- Auth Functions ---

function initAuth() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', signInWithGoogle);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            userDocRef = doc(db, "tracker", user.uid); // User specific doc
            
            loginScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            console.log("Usuário logado:", user.displayName);
            loadProgress(); // Load specific user progress
        } else {
            // User is signed out
            currentUser = null;
            userDocRef = null;
            
            loginScreen.classList.remove('hidden');
            appContainer.classList.add('hidden');
        }
    });
}

async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro ao fazer login. Tente novamente.");
    }
}

async function signOutUser() {
    if (confirm("Deseja mesmo sair?")) {
        try {
            await signOut(auth);
            location.reload();
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    }
}

// --- Helper Functions ---

function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
}

function calculatePoints(missionShift) {
    const currentShift = getCurrentShift();
    if (currentShift === missionShift) return 100;
    return 50;
}

// --- Firebase Persistence ---

async function saveProgress() {
    if (!userDocRef) return;
    try {
        await setDoc(userDocRef, {
            points: points,
            completedMissions: completedMissions,
            currentDay: currentDay,
            lastUpdated: new Date()
        }, { merge: true });
        console.log("Progresso salvo para:", currentUser.email);
    } catch (e) {
        console.error("Erro ao salvar progresso: ", e);
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
            console.log("Dados carregados!");
        } else {
            console.log("Novo usuário, criando registro...");
            points = 0;
            completedMissions = [];
            currentDay = 1;
            saveProgress();
        }
        updateUI();
        renderMissions();
    } catch (e) {
        console.error("Erro ao carregar progresso: ", e);
    }
}

function updateUI() {
    const pointsCounter = document.getElementById('points-counter');
    if(pointsCounter) pointsCounter.textContent = points;
    
    const dailyMissions = missionsSchedule[currentDay] || [];
    const totalDaily = dailyMissions.length;
    const completedDaily = dailyMissions.filter(m => completedMissions.includes(m.id)).length;
    
    document.getElementById('completed-count').textContent = completedDaily;
    document.getElementById('total-count').textContent = totalDaily;
    
    const progressPercent = totalDaily === 0 ? 0 : (completedDaily / totalDaily) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    const btn = document.getElementById('next-day-btn');
    if (completedDaily === totalDaily && totalDaily > 0) {
        if(btn) btn.style.display = 'flex';
        triggerHeartRain();
    } else {
         if(btn) btn.style.display = 'none';
    }

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
            <div class="shift-icon" title="Turno: ${mission.shift}">${mission.icon}</div>
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
        <p>${mission.longDescription}</p>
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
    saveProgress();
    renderMissions();
    updateUI();
    triggerHeartRain();
}

function advanceDay() {
    if (currentDay < 10) {
        currentDay++;
        saveProgress();
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
    if(quoteElement) quoteElement.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
}

async function initTheme() {
    // Modify Reset Button to act as Logout if needed, or keep separate
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn) {
        // Change icon to logout or keep as reset? Let's make it logout for safety/clarity with cloud save
        resetBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
        `;
        resetBtn.title = "Sair da Conta";
        
        // Remove old listeners by cloning or just overriding onclick
        resetBtn.onclick = signOutUser;
    }

    let headerActions = document.querySelector('.header-actions');
    if(headerActions && !document.getElementById('next-day-btn')) {
        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-day-btn';
        nextBtn.className = 'action-btn'; 
        nextBtn.innerHTML = '➡️'; 
        nextBtn.title = 'Próximo Dia';
        nextBtn.style.display = 'none';
        nextBtn.onclick = advanceDay;
        headerActions.prepend(nextBtn);
    }
    
    let headerLeft = document.querySelector('.header-left');
    if(headerLeft && !document.getElementById('day-wrapper')) {
        const dayWrapper = document.createElement('div');
        dayWrapper.id = 'day-wrapper';
        dayWrapper.innerHTML = `<h2 id="day-header" style="color: var(--accent-red); font-size: 1.5rem; margin-top: 5px;">Dia 1 de 10</h2>`;
        const h1 = headerLeft.querySelector('h1');
        h1.after(dayWrapper);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initAuth(); // Start Auth Listener
    initTheme();
    showRandomQuote();
});
