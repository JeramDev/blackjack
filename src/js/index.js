import _ from 'lodash';

const FIGURAS = ['J', 'Q', 'K', 'A'];
const AS = 'A';
const NUM_JUGADORES = 2;
let jugadoresPlantados = 0;

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

const repartirManoInicial = () => {  
  return [baraja.pop(), baraja.pop()];
}

/**
 * Función que saca una carta de la baraja
 * y la añade a la mano del jugador o de la cpu
 * @param {array} mano Mano del jugador actual
 */
const repartirCarta = (jugador) => {
  if (baraja.length > 0)
    jugador.mano.push(baraja.pop());
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

const iniciarJuego = () => {  
  baraja = generarBaraja();
  baraja = barajar();

  // Generar Cpu
  const cpu = {
    id: 'cpu',
    mano: repartirManoInicial(),
    plantado: false
  }  

  // Generar el resto de jugadores
  const jugadores = [];
  for (let i = 1; i < NUM_JUGADORES; i++) {
    let jugador = {
      id: `jugador ${i}`,
      mano: repartirManoInicial(),
      plantado: false
    }
    jugadores.push(jugador);
  }
  
  turno(jugadores, cpu);
}

iniciarJuego();
