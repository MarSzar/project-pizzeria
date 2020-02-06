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
      thisProduct.initAccordion(); //wykonanie metody initAccordion

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

    initAccordion() { //metoda, która tworzy akordeon
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickedTrigger = thisProduct.element;

      /* START: click event listener to trigger */
      clickedTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
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