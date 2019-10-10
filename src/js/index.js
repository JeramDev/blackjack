import _ from 'lodash';

const FIGURAS = ['J', 'Q', 'K'];
const AS = 'A';

const dom = {
  areaJugadores: document.querySelector('.area.jugadores'),
  areaCpu: document.querySelector('.area.cpu')  
}

let jugadores = [];
let jugadoresPlantados = 0;
let indJugadorActual = 0;
let jugadorActual = "";
let baraja = [];

let delayInMilliseconds = 1000;

/**
 * Función para generar un array con los valores posibles de una carta
 * @return Array con los valores
 */
const range = () => {
  let array = [AS];
  for (let i = 2; i <= 10; i++) {
    array.push(i);
  }
  array = array.concat(FIGURAS);
  return array;
}

/**
 * Función para generar la baraja
 */
const generarBaraja = () => {   
  const palos = ['Corazones', 'Treboles', 'Picas', 'Rombos'];
  palos.forEach((palo) => {
    generarCartasPalo(palo);
  });
  return baraja; 
}

/**
 * Función que genera todas las cartas de un palo
 * @param {string} palo Palo del conjunto de cartas
 */
const generarCartasPalo = (palo) => {
  const arrayValores = range();
  let carta;  
  arrayValores.forEach((valorArray) => {    
    carta = {
      valor: valorArray,
      palo: palo
    };
    baraja.push(carta);  
  }); 
}

/**
 * Función para barajar el mazo
 */
const barajar = () => {
  return _.shuffle(baraja);
}

/**
 * Dibuja el contenido de la carta
 * @param {*} carta Carta a dibujar 
 */
const dibujarCarta = (carta) => {
  const cartaDom = document.querySelector(`.carta.carta${carta.valor}${carta.palo[0]}`);
  switch(carta.palo) {
    case 'Corazones':
      cartaDom.className += " roja";
      cartaDom.textContent = carta.valor + "♥"; 
      break;
    case 'Rombos':
      cartaDom.className += " roja";
      cartaDom.textContent = carta.valor + "♦";  
      break;
    case 'Treboles':
      cartaDom.textContent = carta.valor + "♣"; 
      break;
    case 'Picas':
      cartaDom.textContent = carta.valor + "♠"; 
      break;    
  }
}

/**
 * Crea en la web la carta sacada
 */
const crearCarta = (carta) => {
  const cartas = document.querySelector(`.cartas.${jugadorActual.id}`);  
  cartas.innerHTML += 
    `<div class="carta carta${carta.valor}${carta.palo[0]}"></div>`;
  dibujarCarta(carta);
}

/**
 * Saca una carta de la baraja
 */
const sacarCartaBaraja = () => {
  if (baraja.length > 0)
    return baraja.pop();
  else
    alert('No quedan cartas');
}

/**
 * Reparto de la mano inicial.
 * 2 cartas para los jugadores y 1 para cpu.
 */
const repartirManoInicial = () => {
  const manoInicial = [];
  const primeraCarta = sacarCartaBaraja();  
  manoInicial.push(primeraCarta);
  if (jugadorActual.id != "cpu") {
    const segundaCarta = sacarCartaBaraja();
    manoInicial.push(segundaCarta);
  }
  manoInicial.forEach((carta) => {
    crearCarta(carta);
  });    
  return manoInicial;
}

/**
 * Función que saca una carta de la baraja
 * y la añade a la mano del jugador o de la cpu
 * @param {array} mano Mano del jugador actual
 */
const repartirCarta = () => {
  if (baraja.length > 0) {
    const carta = baraja.pop();
    jugadorActual.mano.push(carta);
    crearCarta(carta);
  }
}

/**
 * Calcula el valor de una carta
 * @param {*} carta
 * @returns Valor de la carta 
 */
const calcularValor = (carta) => {
  if (FIGURAS.includes(carta.valor) || carta.valor == 'A') {
    return 10;
  }    
  else {
    return carta.valor;
  }    
}

/**
 * Decidir si un jugador se planta o no
 */
const sePlanta = () => {
  if (!jugadorActual.plantado) {
    let suma = 0;
  
    jugadorActual.mano.forEach((carta) => {    
      suma += calcularValor(carta);    
    });
    
    // Se pasó
    if (suma > 21) {
      jugadorActual.plantado = true;
    }
    // 80% de prob de plantarse
    else if (suma >= 19) {
      const random = Math.ceil(Math.random() * 5);
      if (random != 5);
        jugadorActual.plantado = true;
    }
    // 50% de prob de plantarse
    else if (suma >= 16) {
      const random = Math.ceil(Math.random() * 2);
      if (random == 1);
        jugadorActual.plantado = true;
    }   
    
    if (jugadorActual.plantado) {
      const jugadorDom = document.querySelector(`.${jugadorActual.id} .nombre`);
      jugadorDom.className += " plantado";         
      jugadoresPlantados++;    
      console.log(jugadorActual.id + " puntos: " + suma);   
    }
  }  
}

const calcularGanador = () => {
  console.log("FIN");
}

/**
 * Ronda de todos los jugadores
 */
const ronda = () => {
  if (jugadorActual.plantado) {
    delayInMilliseconds = 0;
  }
  else {
    delayInMilliseconds = 1000;
  }
  setTimeout(() => {
    if (jugadoresPlantados == jugadores.length) {
      calcularGanador();
    }
    else {
      sePlanta();
      if (!jugadorActual.plantado) {
        repartirCarta();
      }
      siguienteJugador();
      ronda(); 
    }   
  }, delayInMilliseconds);    
}

/**
 *  Incluye la cpu y los 7 jugadores.
 *  (jugadores.lenght - 1) para que no coja a la cpu.
 */
const mostrarJugadores = () => {
  dom.areaCpu.innerHTML +=
  `<div class="tablero cpu">
      <div class="nombre cpu">
        CPU
      </div>                
      <div class="cartas cpu">        
      </div>
    </div>`

  for (let i = 0; i < jugadores.length - 1; i++) {
    dom.areaJugadores.innerHTML += 
    `<div class="tablero jugador jugador${i + 1}">
      <div class="nombre jugador">
        Jugador ${i + 1}
      </div>
      <div class="circulo">
        <div class="cartas jugador jugador${i + 1}">          
        </div>
      </div>      
    </div>`      
  }
}

// Marca como actual al siguiente jugador
const siguienteJugador = () => { 
  if (indJugadorActual == jugadores.length) {
    indJugadorActual = 0;
  } 
  jugadorActual = jugadores[indJugadorActual];
  indJugadorActual++;  
}

/**
 * Genera el array de jugadores
 */
const generarJugadores = () => {
  // Generar el resto de jugadores
  for (let i = 1; i <= 7; i++) {
    let jugador = {
      id: `jugador${i}`,
      mano: [],
      plantado: false
    };
    jugadores.push(jugador);
  }

  // Generar Cpu
  const cpu = {
    id: 'cpu',
    mano: [],
    plantado: false
  };
  jugadores.push(cpu);  
}

const iniciarJuego = () => {   
  baraja = generarBaraja();
  baraja = barajar();  
  
  // Generar y mostrar los jugadores
  generarJugadores();
  mostrarJugadores();

  // Selecciona al primer jugador
  siguienteJugador();

  // Reparte dos cartas a cada jugador
  jugadores.forEach((jugador) => {
    jugador.mano = repartirManoInicial();
    siguienteJugador();
  });
  
  // Comienza la simulación  
  ronda();
}

iniciarJuego();
