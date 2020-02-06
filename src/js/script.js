/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product'
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart'
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select'
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]'
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]'
      }
    }
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active'
    }
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    )
  };

  class Product {
    //Tworzenie klasy, która zawiera konstruktor wyświetlający wiadomość w konsoli
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu(); //wykonanie metody renderInMenu
      thisProduct.getElements(); //wykonanie metody getElements
      thisProduct.initAccordion(); //wykonanie metody initAccordion
      thisProduct.initOrderForm(); //wywołanie metody initOrderForm
      thisProduct.processOrder(); //wywołanie metodyprocessOrder

      console.log('new Product:', thisProduct);
    }

    renderInMenu() { //metoda, która tworzy (renderuje) nowy kod na stronie
      const thisProduct = this;

      /*generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data); //HTML jest tworzony przy użyciu Handlebars (templates) na podstawie argumentów z menuProducts(Select)

      /*create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); //funkcja createDOMfromHTML znajduje sie w utils w function.js

      /*find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu); //stała, w której jest kontener menu

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element); //funkcja appendChild dodaje wartość thisProduct.element na koniec rodzica, którym jest menuContainer
    }

    getElements(){ //metoda, która wyszukuje elementy DOM - metoda ta odnajduje elementy w kontenerze produktu (jest jak spis treści, dzięki któremu jest pewność, że nie są szukany taki sam element wielokrotnie)
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); //za pomocą elementu querySelector zostanie wyszukany element w html product_name (nazwa dania)
      console.log('thisProduct.accordionTrigger: ', thisProduct.accordionTrigger);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form); //pobiera całą formę, form -cały formularz w którym może być parę forminput
      console.log('thisProduct.form: ', thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs); //pobiera wszystkie formInput (ilości z liczbą), ilości sumuje, input-miejsce do wpisywania cyfr, liczb
      console.log('thisProduct.formInputs: ', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton); //za pomocą elementu querySelector zostanie wyszukany element w html - przycisk Add to card
      console.log('thisProduct.cartButton: ', thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem); //za pomocą elementu querySelector zostanie wyszukany element w html - span.price
      console.log('thisProduct.priceElem: ', thisProduct.priceElem);
    }

    initAccordion() { //metoda, która tworzy akordeon
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
      //clickedTrigger.addEventListener('click', function(event) { //wyszukiwanie elementu, któremu dodajemy listener eventu click
        /* prevent default action for event */
        event.preventDefault(); //wyrażenie, które powstrzyma domyślną akcję
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');
        /* find all active products */
        const activeProducts = document.querySelectorAll('#product-list .product.active');
        /* START LOOP: for each active product */
        for(let activeProduct of activeProducts) {

          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct != thisProduct.element) {
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
      /* END: click event listener to trigger */
      });
    }

    initOrderForm() { //metoda uruchamiana tylko raz dla każdego produktu, odpowiedzialna za dodanie listenerów eventów do formularza, jego kontrolek i guzika dodania do koszyka
      const thisProduct = this;
      
      
      thisProduct.form.addEventListener('submit', function(event){ //handler eventu wywołujący metodę processOrder bez żadnych argumentów, dodatkowo dla eventu submit na formularzu blokujemy domyślną akcję, czyli wysłanie formularza z przeładowaniem strony
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){ //handler eventu wywołujący metodę processOrder bez żadnych argumentów
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){ //handler eventu wywołujący metodę processOrder bez żadnych argumentów, dodatkowo dla eventu click na guziku blokujemy domyślną akcję, czyli zmianę adresu strony po kliknięciu w link (guzik z wyglądu jest guzikiem, w rzeczywistości jest linkiem)
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() { //metoda, która obliczy cenę produktu (potem dodać kod, który będzie dodawał produkt do koszyka, na razie nie zmienia adresu strony i wywołuje przeliczenie ceny produktu )
      const thisProduct = this;
      
      
      const formData = utils.serializeFormToObject(thisProduct.form); //funkcja zwracająca obiekt, w którym kluczami są wartości atrybutów name kontrolek formularza, wartościami będą tablice, zawierające wartości atrybutów vaule wybranych opcji
      console.log('formData', formData);
    }

  }

  const app = {
    initMenu: function() {
      const thisApp = this; //Instancja dla każdego produktu. Sprawdzenie, czy dane są gotowe do użycia. thisApp pobiera dane z pliku data.js
      console.log('thisApp.data:', thisApp.data); //-||-//
  
      for(let productData in thisApp.data.products){ //pętla iterująca po products w pliku data
        new Product(productData, thisApp.data.products[productData]); //dodanie instacji dla każdego produktu wraz z argumentami
      }
    },

    initData: function () { //metoda, która pobiera dane z innych źródeł
      //Instancja dla każdego produktu. Aplikacja ma korzystać z dataSource w pliku data.js jako źródła danych, ale w przyszłości dane będą wczytywane z serwera. Metoda app.initData w przyszłości pozwoli zmienić sposób pobierania danych
      const thisApp = this; //-||-

      thisApp.data = dataSource; //-||- dataSource - stała zadeklarowana w data.js, w której są produkty na pizze
    },

    init: function()  {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData(); //Instancja dla każdego produktu (wykonanie metody initData)
      thisApp.initMenu(); //Instancja dla każdego produktu (wykonanie metody initMenu)
    }
  };
  app.init();
}