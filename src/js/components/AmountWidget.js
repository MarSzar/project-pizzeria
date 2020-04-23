import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

//AmountWidget - widget wyboru ilości produktu//
class AmountWidget extends BaseWidget{
  constructor(element) { //ten konstruktor musi otrzymywać odniesienie do elementu, w którym widget ma zostać zainicjowany. Konstruktor tej klasy będzie zapisywał do właściwości otrzymany (jako argument) element, oraz znajdował w nim trzy elementy 
    super(element, settings.amountWidget.defaultValue);
    
    const thisWidget = this;
      
    thisWidget.getElements(element); /*Wywołanie metody getElements(element)*/
      
    thisWidget.initActions(); /*Wywołanie metody initActions */

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements(){ /*Podobnie jak w klasie Product, metoda getElements, będzie odnajdywała i zapisywała we właściwościach wszystkie elementy DOM, które będą potrzebne. Tym razem, jednak będzie przekazywany tej metodzie argument element otrzymany przez konstruktor*/
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input); //1.element - input z wartością
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease); //2. element - link zmniejszający wartość
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease); //3. element - link zwiększający wartość
  }

  isValid(value){ //będzie zwracać prawdę lub fałsz w zależności od tego czy wartość którą chcemy ustawić dla tego widgetu jest prawidłowa wedle kryteriów, które ustalimy dla każdego z widgetu
    return !isNaN (value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){  //metoda służąca temu, aby bieżąca wartość widgetu zostala wyświetlona na stronie
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions () { //Kolejna metoda initActions - dodanie reakcji na eventy, w tej klasie 3 listenery eventów
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      //thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;