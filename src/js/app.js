import {settings, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {

  initMenu: function() {
    const thisApp = this; //Instancja dla każdego produktu. Sprawdzenie, czy dane są gotowe do użycia. thisApp pobiera dane z pliku data.js
      
    for(let productData in thisApp.data.products){ //pętla iterująca po products w pliku data
      //new Product(productData, thisApp.data.products[productData]); //dodanie instacji dla każdego produktu wraz z argumentami
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
    
  initCart: function() { //kiedy jest juz klasa Cart(KLASA-wzorzec, def.jak będą wyglądaly instancje tej klasy), w obiekcie app metida initCart będzie inicjować instancję (OBIEKT stworzony wedle wzorca (klasy)) koszyka. Przekażemy jej wrapper (czyli kontener, element okalający) koszyka.
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart (cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
 
  initData: function () { //metoda, która pobiera dane z innych źródeł
    //Instancja dla każdego produktu. Aplikacja ma korzystać z dataSource w pliku data.js jako źródła danych, ale w przyszłości dane będą wczytywane z serwera. Metoda app.initData w przyszłości pozwoli zmienić sposób pobierania danych
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;
    
    fetch(url) //wywołanie AJAX za pomocą funkcji fetch, za pomocą funkcji fetch wysyłamy zapytanie pod podany adres endpointu
      .then(function(rawResponse){  //otrzymaną odpowiedź konwertujemy z JSONa na tablicę
        return rawResponse.json();  
      })
      .then(function(parsedResponse){ //po otrzymaniu skonwertowanej odpowiedzi parsedResponse wyświetlamy ją w konsoli
        console.log('parsedResponse', parsedResponse);

        /*save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /*execute initMenu method */
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
    
  },
  
  init: function()  {
    const thisApp = this;
    //console.log('*** App starting ***');
      
    thisApp.initData(); //Instancja dla każdego produktu (wykonanie metody initData)
    //thisApp.initMenu(); //Instancja dla każdego produktu (wykonanie metody initMenu)
    thisApp.initCart(); //wywołanie metody
  }
};

app.init();