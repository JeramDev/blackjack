import _ from 'lodash';

const FIGURAS = ['J', 'Q', 'K'];
const AS = 'A';

const dom = {
  areaJugadores: document.querySelector('.area.jugadores'),
  areaCpu: document.querySelector('.area.cpu')
}

let jugadores = [];
let jugadoresPlantados = 0;
let indJugadorActual = -1;
let jugadorActual = "";
let baraja = [];

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
 * Función que muestra en la web la carta sacada
 */
const mostrarCarta = (carta) => {
  const cartas = document.querySelector(`.cartas.${jugadorActual.id}`);
  cartas.innerHTML += `<div class="carta">${carta.valor}${carta.palo[0]}</div>`;
}

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
  mostrarCarta(primeraCarta);
  manoInicial.push(primeraCarta);
  if (jugadorActual.id != "cpu") {
    const segundaCarta = sacarCartaBaraja();
    mostrarCarta(segundaCarta);
    manoInicial.push(segundaCarta);
  }    
  return manoInicial;
}

/**
 * Función que saca una carta de la baraja
 * y la añade a la mano del jugador o de la cpu
 * @param {array} mano Mano del jugador actual
 */
const repartirCarta = (jugador) => {
  if (baraja.length > 0) {
    jugador.mano.push(baraja.pop());
  }
}

const calcularValor = (carta) => {
  if (FIGURAS.includes(carta.valor))
    return 10;  
  else
    return carta.valor;
}

const sePlanta = (jugador) => {
  let suma = 0;
  jugador.mano.forEach((carta) => {    
    suma += calcularValor(carta);
  });  
  
  // Se pasó
  if (suma > 21) {
    jugador.plantado = true;
  }
  // 80% de prob de plantarse
  else if (suma >= 19) {
    const random = Math.ceil(Math.random() * 5);
    if (random != 5);
      jugador.plantado = true;
  }
  // 50% de prob de plantarse
  else if (suma >= 16) {
    const random = Math.ceil(Math.random() * 2);
    if (random == 1);
      jugador.plantado = true;
  }  
  
  if (jugador.plantado) {
    jugadoresPlantados++;
    console.log(suma);
  }
}

const calcularGanador = (jugadores, cpu) => {
  console.log("FIN");
}

const turno = (jugadores, cpu) => {  
  if (jugadoresPlantados == NUM_JUGADORES) {
    calcularGanador(jugadores, cpu);
  }
  else {
    jugadores.forEach((jugador) => {
      if (!jugador.plantado) {
        sePlanta(jugador);
        repartirCarta(jugador);      
      }
    });
    if (!cpu.plantado) {
      sePlanta(cpu);
      repartirCarta(cpu);    
    }
    turno(jugadores, cpu);
  }    
}

/**
 *  Incluye la cpu y los 7 jugadores.
 *  (jugadores.lenght - 1) para que no coja a la cpu.
 */
const mostrarJugadores = () => {
  dom.areaCpu.innerHTML += 
    `<div class="nombre cpu">
      CPU
    </div>
    <div class="tablero cpu">                
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
  indJugadorActual++;
  if (indJugadorActual == jugadores.length) {
    indJugadorActual = 0;  
  }
  jugadorActual = jugadores[indJugadorActual];
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
  
  //turno(jugadores, cpu);
}

iniciarJuego();
