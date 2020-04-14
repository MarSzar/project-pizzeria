import {select, classNames, settings, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

//CART - klasa ta będzie obsługiwała koszyk i wszystkie jego funkcjonalności
class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = []; //w tej tablicy będą przechowywane produkty dodane do koszyka
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee; //cena dostawy - cena stała, nadanie wartości zapisanej w odpowiedniej właściwości obiektu settings

    thisCart.getElements(element); //wywołanie metody getElements
    thisCart.initActions(); //wywołanie metody initActions

  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {}; //w obiekcie thisCart.dom będziemy przechowywać wszystkie elementy DOM, wyszukane w komponencie koszyka 

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger); //definicja właściwości thisCart.dom.toggleTrigger, która znajduje w thisCart.dom.wrapper pojedynczy element o slektorze zapisanym w select.cart.toggleTrigger
    
    thisCart.dom.productList = element.querySelector(select.cart.productList);  //zdefiniowanie thisCart.dom.productList
    
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee']; //tworzenie tablicy zawierajace cztery stringi (ciągi znaków) - każdy jest kluczem w obiekcie select.cart
      
    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);  //znalezienie i dodanie do obiektu thisCart.dom
    thisCart.dom.address = element.querySelector(select.cart.address); //-//-
  }

  initActions(){ //metoda, ktora rozwija i zwija koszyk przy kliknięciu pokazując/ukrywając szczegóły koszyka
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {   //deklaracja thisCart i dodanie listener eventu 'click' na elemencie thisCart.dom.toggleTrigger
    
      event.preventDefault(); //wyrażenie, które powstrzyma domyślną akcję
    
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);   //handler listenera ma toggle'ować klasę zapisaną w classNames.cart.wrapperActive na elemencie thisCart.dom.wrapper
    });

    //aktualizacja sum po zmianie ilości
    thisCart.dom.productList.addEventListener('updated', function(){  //nasłuchiwanie na liście produktów, w której umieszczamy produkty, w których znajduje się widget liczby sztuk, który generuje ten event. Dzięki właściwości bubbles "słychać" go na tej liści i można wtedy wykonać metode update
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(){ //listener eventu remove
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){ //słuchanie eventu 'submit'
        
      event.preventDefault(); //aby wysłanie formularza nie przeładowało strony

      thisCart.sendOrder(); //wywołanie metody
    });
  }
    
  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let product of thisCart.products) { //pętla iterująca po thisCart.products
      thisCart.subtotalPrice += product.price; //suma cen pozycji w koszyku = zwiększenie o cenę tego produktu
      console.log('price of products', product.price);
      thisCart.totalNumber += product.amount; //suma liczby sztuk zamawianych produktów = zwiększenie o jego liczbę
      console.log('amount of products', product.amount);
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee; //totalPrice = "subtotal" (suma cen pozycji w koszyku) + cena dostawy
    console.log('thisCart.totalPrice', thisCart.totalPrice);

    //wyświetlanie aktualnych sum
    for(let key of thisCart.renderTotalsKeys){ //ta sama pęla jak w metodzie getElements iterująca po thisCart.renderTotalKeys
      for(let elem of thisCart.dom[key]){ //pętla iterujaca po każdym elemencie z kolekcji, zapisanej wcześniej pod jednym z kluczy w thisCart.renderTotalsKeys. Dla każdego z tych elemenctów ustawiana jest właściwość koszyka, który ma taki sam klucz
        elem.innerHTML = thisCart[key];
      }
    }
  }

  add(menuProduct){
    const thisCart = this;
      
    //GENEROWANIE ELEMENTÓW DOM

    /*generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct); //za pomocą szablonu tw. kod HTML i zapisujemy go w stałej generatedHTML. Do szblonu przekazywany jest cały obiekt produktu

    /*change generateHTML into DOM elements */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);  //nast. ten kod zamieniany jest na elementy DOM i zapisany w następnej stałej generatedDOM

    /* add generatedDOM products to menu cart */
    thisCart.dom.productList.appendChild(generatedDOM); //dodaj.te elementy DOM do thisCard.dom.productList
    
    //thisCart.products.push(menuProduct); //--> po stworzeniu klasy CartProduct zmiana na:
    thisCart.products.push(new CartProduct(menuProduct,generatedDOM)); //stworzenie nowej instancji klasy new CartProduct i dodanie jej do tablicy thisCart.products
    //console.log('thisCart.products', thisCart.products);

    thisCart.update(); //wywołanie metody update
  }

  remove(cartProduct){
    const thisCart = this; //zadeklarowanie stałej thisCart
      
    const index = thisCart.products.indexOf(cartProduct); //zadeklarowanie stałej index, której wartością jest indeks cartProduct w tablicy thisCart.products
    console.log('index:', index);
    console.log('value at index:', thisCart.products[index]);

    thisCart.products.splice(index, 1); //użycie metody splice do usunięcie elementu o tym indeksie z tablicy thisCart.products
      
    cartProduct.dom.wrapper.remove(); //usunięcie z DOM elementu cart.Product.dom.wrapper
      
    thisCart.update(); //wywołanie metody update w celu przeliczenia sum po usunięciu produktu
  }
  
  //metoda sendOrder - w niej zdefiniowanie kilku stałych, które są potrzebne do wysłania zapytania do API
  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = { //payload-ładunek, dane, które będą wysyłane do serwera
      totalPrice: thisCart.totalPrice,
      phone: thisCart.dom.phone,
      address: thisCart.dom.address,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for (let product of thisCart.products) {
                       
      payload.products.push(product.getData());
    }


    const options = { //opcje, które skonfigurują zapytanie
      method: 'POST', //POST-wysyłanie nowych danych do API
      headers: {      //ustawienie nagłówka, aby serwer wiedział, że wysyłam dane w postaci JSONa
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),    //body - treść którą wysyłam, użycie metody JSON.stringify, aby przekonwertować obiekt payload na ciąg znaków w formacie JSON
    };

    fetch(url, options)   //wysłanie zapytania do serwera 
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;