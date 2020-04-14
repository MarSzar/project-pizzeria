import {settings, select} from '../settings.js';

//AmountWidget - widget wyboru ilości produktu//
class AmountWidget {
  constructor(element) { //ten konstruktor musi otrzymywać odniesienie do elementu, w którym widget ma zostać zainicjowany. Konstruktor tej klasy będzie zapisywał do właściwości otrzymany (jako argument) element, oraz znajdował w nim trzy elementy 
    const thisWidget = this;
      
    thisWidget.getElements(element); /*Wywołanie metody getElements(element)*/
    thisWidget.value = settings.amountWidget.defaultValue; //nadanie pierwotnej wartości thisWidget.value na wypadek gdyby value w kodzie HTML nie zostało podane
    thisWidget.setValue(thisWidget.input.value); /*Wywołanie metody setValue*/
    thisWidget.initActions(); /*Wywołanie metody initActions */

  }

  getElements(element){ /*Podobnie jak w klasie Product, metoda getElements, będzie odnajdywała i zapisywała we właściwościach wszystkie elementy DOM, które będą potrzebne. Tym razem, jednak będzie przekazywany tej metodzie argument element otrzymany przez konstruktor*/
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input); //1.element - input z wartością
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease); //2. element - link zmniejszający wartość
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease); //3. element - link zwiększający wartość
  }

  setValue(value){ //klasa setValue będzie używana do ustawiania nowej wartości widgetu
    const thisWidget = this;

    const newValue = parseInt(value);

    /*TO DO: Add validation */ //dodanie walidacji wyeliminuje problemy t.j. wybranie 999 sztuk, zero lub liczbę-cenę ujemną
    if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
      thisWidget.value = newValue; //metoda ta zapisuje we właściwości thisWidget.value wartość przekazanego argumentu, po przekonwertowaniu go na liczbę
      thisWidget.announce(); //wywołanie metody announce - wywołanie wewnątrz metody setValue
    }

    thisWidget.input.value = thisWidget.value; //nowa wartość inputa równa wartości thisWidget.value. Dzięki temu nowa wartość wyświetli się na stronie
  }

  initActions () { //Kolejna metoda initActions - dodanie reakcji na eventy, w tej klasie 3 listenery eventów
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function() {
      thisWidget.setValue(thisWidget.input.value);
    });

    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce(){ //WYWOŁANIE EVENTU - metoda announce będzie tworzyła instancje klasy Event, wbudowanej w silnik JS (czyli w przeglądarkę). Następnie, ten event zostanie wywołany na kontenerze naszego widgetu
    const thisWidget = this;

    //const event = new Event('updated'); -->
    const event = new CustomEvent('updated', {
      bubbles: true   //włączenie bubbles - bąbelkowanie - dzięki włączeniu ten event po wykonaniu na jakimś elemencie będzie przekazany jego rodzicowi, oraz rodzicowi rodzica, i tak dalej aż do samego <body>, document, window. (event click bąbelkuje domyślnie) 
    });

    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;