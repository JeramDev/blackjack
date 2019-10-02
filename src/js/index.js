const baraja = [];

const generarBaraja = () => {  
  const palos = ['Corazones', 'Treboles', 'Picas', 'Rombos'];
  palos.forEach((palo) => {
    generarCartasPalo(palo);
  });  
}

const generarCartasPalo = (palo) => {      
  for (let i = 1; i <= 13; i++) { 
    let carta = {
      valor: 0,
      palo: palo
    };     
    if (i > 10)
      switch (i) {
        case 11:
          carta.valor = 'J';
          break;
        case 12:
          carta.valor = 'Q';
          break
        case 13:
          carta.valor = 'K';
          break
      }
    else if (i == 1)
      carta.valor = 'A';
    else
      carta.valor = i;
    baraja.push(carta);
  }
}

generarBaraja();
console.log(baraja);

const barajar = () => {

}

const repartirCarta = () => {

}