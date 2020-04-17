import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import {Booking} from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
      // if(page.id == pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }
      page.classList.toggle(classNames.pages.active, page.id == pageId); //to samo co zakomentowane wyżej 5 linijek
    }

    /* add class "active" to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },


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
    
    thisApp.initPages();
      
    thisApp.initData(); //Instancja dla każdego produktu (wykonanie metody initData)
    //thisApp.initMenu(); //Instancja dla każdego produktu (wykonanie metody initMenu)
    thisApp.initCart(); //wywołanie metody

    thisApp.initBooking();
  },
 
  initBooking: function() {
    const thisApp = this;
    
    const widgetBooking = document.querySelector(select.containerOf.booking); //widgetBooking-kontener widgetu do rezerwacji stron

    thisApp.booking = new Booking(widgetBooking);
  },
};

app.init();