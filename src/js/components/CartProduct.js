import {select} from '../settings.js';
import AmountWidget from './AmountWidget.js';

//CLASS - CARTPRODUCT - klasa pozycji w koszyku, koszyk zapamiętuje szczegóły zamawianego produktu, tworząc nową instancję klasy CartProduct
class CartProduct{
  constructor(menuProduct, element){ //konstruktor przyjmujący dwa argumenty: menuProduct i element
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id; //zapisanie właściwości thisCartProduct czerpiąc wartości z menuProduct dla właściwości: id, name, price, priceSingle, amount
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
      
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params)); //klonowanie obiektu, aby zachować kopię jego aktualnych wartości

    thisCartProduct.getElements(element); //wywołanie metody getElements i przekazanie jej argumentu element
    thisCartProduct.initAmountWidget(); //wykonanie metody initAmountWidget
    thisCartProduct.initAction(); //wywołanie metody initAction

    //console.log('new CartProduct', thisCartProduct);
    //console.log('productData', menuProduct);
  }
    
  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {}; 

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }

  initAction(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });
      
    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();
      console.log('remove', event);
    });
  }

  initAmountWidget(){ //Obsługa widgetu ilości sztuk - zmiana liczby sztuk danej pozycji w koszyku
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;

      thisCartProduct.dom.price.innerHTML = thisCartProduct.price; //wyświetlenie ceny tego produktu w koszyku
    });
  }

  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {   //właściwość detail - można przekazać dowolne informacje do handlera eventu. W tym przypadku przekazuje odwołanie do tej instancji, dla której kliknięto guzik usuwania
        cartProduct: thisCartProduct,
      },
    });
      
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  getData() { //metoda getData, która zwraca wszystkie informacje o zamawianym produkcie
    const thisCartProduct = this;

    return {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      params: thisCartProduct.params,
    };
  }
}

export default CartProduct;