class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value){ //klasa setValue będzie używana do ustawiania nowej wartości widgetu
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    /*Add validation */ //dodanie walidacji wyeliminuje problemy t.j. wybranie 999 sztuk, zero lub liczbę-cenę ujemną
    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue; //metoda ta zapisuje we właściwości thisWidget.correctValue wartość przekazanego argumentu, po przekonwertowaniu go na liczbę
      thisWidget.announce(); //wywołanie metody announce - wywołanie wewnątrz metody setValue
    }

    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){  //będzie wykorzystywana do tego, aby przekształcić wartość którą chcemy ustawić, w odpowiedni typ lub formę
    return parseInt(value);
  }

  isValid(value){ //będzie zwracać prawdę lub fałsz w zależności od tego czy wartość którą chcemy ustawić dla tego widgetu jest prawidłowa wedle kryteriów, które ustalimy dla każdego z widgetu
    return !isNaN (value);
  }
  
  renderValue(){  //metoda służąca temu, aby bieżąca wartość widgetu zostala wyświetlona na stronie
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce(){ //WYWOŁANIE EVENTU - metoda announce będzie tworzyła instancje klasy Event, wbudowanej w silnik JS (czyli w przeglądarkę). Następnie, ten event zostanie wywołany na kontenerze naszego widgetu
    const thisWidget = this;

    //const event = new Event('updated'); -->
    const event = new CustomEvent('updated', {
      bubbles: true   //włączenie bubbles - bąbelkowanie - dzięki włączeniu ten event po wykonaniu na jakimś elemencie będzie przekazany jego rodzicowi, oraz rodzicowi rodzica, i tak dalej aż do samego <body>, document, window. (event click bąbelkuje domyślnie) 
    });

    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;