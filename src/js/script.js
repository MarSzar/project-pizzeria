/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
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
      thisProduct.initAmountWidget(); //wywołanie metody initAmountWidget
      thisProduct.processOrder(); //wywołanie metodyprocessOrder
      
      //console.log('new Product:', thisProduct);
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
      //console.log('thisProduct.accordionTrigger: ', thisProduct.accordionTrigger);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form); //pobiera całą formę, form -cały formularz w którym może być parę forminput
      //console.log('thisProduct.form: ', thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs); //pobiera wszystkie formInput (ilości z liczbą), ilości sumuje, input-miejsce do wpisywania cyfr, liczb
      //console.log('thisProduct.formInputs: ', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton); //za pomocą elementu querySelector zostanie wyszukany element w html - przycisk Add to card
      //console.log('thisProduct.cartButton: ', thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem); //za pomocą elementu querySelector zostanie wyszukany element w html - span.price
      //console.log('thisProduct.priceElem: ', thisProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper); //właściwość thisProduct.imagerWrapper, jej wartością jest pojedynczy element o selektorze zapisany w select.menuProduct.imageWrapper, wyszukany w elemencie thisProduct.element
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget); 
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

    processOrder() { //metoda, która obliczy cenę produktu z wybranymi opcjami (potem dodać kod, który będzie dodawał produkt do koszyka, na razie nie zmienia adresu strony i wywołuje przeliczenie ceny produktu)
      const thisProduct = this;
      
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form); //funkcja zwracająca obiekt, w którym kluczami są wartości atrybutów name kontrolek formularza, wartościami będą tablice, zawierające wartości atrybutów vaule wybranych opcji
      //console.log('formData', formData);
      /* set variable price to equal thisProduct.data.price */ //zapisanie do zmiennej price domyślnej ceny produktu, wziętej z thisProduct.data.price - (na początku tej metody, przed pętlami tworzę zmienną price)
      let price = thisProduct.data.price;
      
      //(dla każdego params i dla każdego options (pętli, która jest w pętli) modyfikuje cenę price (jeśli sa spełnione odpowiednie warunki))
      /* START LOOP: for each paramId in thisProduct.data.params */ //pętla, która iteruje po wszystkich elementach params
      for (let paramId in thisProduct.data.params) {
        /* save the element in thisProduct.data.params with key paramId as const param */ //wyciągam z tablicy wartość klucza za pomocą paramId
        const param = thisProduct.data.params[paramId];
        
        /* START LOOP: for each optionId in param.options */  //pętla w głównej pętli, która iteruje po wszystkich opcjach danego parametru
        for (let optionId in param.options) {
          
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];
          
          /* START IF: if option is selected and option is not default */ //jeśli jest zaznaczona opcja, która nie jest domyślna, to...(-->178)   //jeśli mamy obiekt option, który ma właściwość default równą false, to wynikiem !option.default będzie prawda. Jeśli ten obiekt nie ma takiej właściwości, to samo wyrażenie będzie również prawdziwe, ponieważ !undefined jest truthy
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1; ///spr.czy w paramId jaki indeks ma opcja optionId
          if(optionSelected && !option.default){
            
            /* add price of option to variable price */ //cena produktu musi się zwiększyć o cenę tej opcji 
            price = price + option.price;
          
            /* END IF: if option is selected and option is not default */
          }

          /* START ELSE IF: if option is not selected and option is default */ //jeśli nie jest zaznaczona opcja, która jest domyślna, to...
          else if (!optionSelected && option.default) {
            
            /* deduct price of option from price */ //cena produktu musi się zmniejszyć o cenę tej opcji
            price = price - option.price;
          
          /* END ELSE IF: if option is not selected and option is default */
          }
          
          /* END LOOP: for each optionId in param.options */
        


          /* create const with chosen products images that have paramId and optionId -  stworzenie stałej const, w której zapisane będą wyszukane elementy */ //wszystkie obrazki dla tej opcji, to wszystkie elementy wyszukane w thisProduct.imageWrapper, które pasują do selektora, składającego się z kropki, klucza parameru, myślnika, klucza opcji.
          const activeImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
              
          /* START IF: if product is selected and have image - jeśli opcja jest zaznaczona, to wszystkie obrazki dla tej opcji powinny otrzymać klasę zapisaną w classNames.menuProduct.imageVisible */
          if (optionSelected && activeImage) {
          
            /* add class 'active' for image - dla każdego z tych elementów ma być dodana (w bloku if) odpowiednia klasa */
            activeImage.classList.add(classNames.menuProduct.imageVisible);
          
          /* END IF: if option is selected and option is not default */
          }
            
          /* START ELSE: when product is not selected - w przeciwnym razie, wszystkie obrazki dla tej opcji powinny stracić klasę zapisaną w classNames.menuProduct.imageVisible*/          
          else {
          
            /* but have image - pętla iterująca po znalezionych elementach */
            if (activeImage) {
        
              /* remove class 'active' - dla każdego z tych elementów ma być usunięta (w bloku else) odpowiednia klasa */
              activeImage.classList.remove(classNames.menuProduct.imageVisible);

              /* END IF: if product have image */
            }
                 
          /* END ELSE: if option is not selected and option is default*/
          }

          /* END LOOP: for each paramId in thisProduct.data.params */
        }
        
        /* NEW - multiply price by amount */ 
        price *= thisProduct.amountWidget.value; //tuż przed wyświetleniem ceny obliczonej z uwzględnieiem opcji pomnożymy ją przez ilość sztuk wybraną w widgecie

        /* set the contents of thisProduct.priceElem to be the value of variable price */ //wstawienie wartości zmiennej price do elementu thisProduct.priceElem. (po pętlach wyświetlam cenę)
        thisProduct.priceElem.innerHTML = price;
      }
    }

    initAmountWidget(){ /*Nowa metoda - initAmountWidget w klasie Product. Metoda ta będzie tworzyła instancję klasy AmountWidget i zapisywała ją we właściwości produktu */
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){ //NASŁUCHIWANIE EVENTU - druga część informowania producktu, nasłuchiwanie tego eventu w klasie Product
        thisProduct.processOrder();
      });
    }
  }

  //New class - AmountWidget - widget wyboru ilości produktu//
  class AmountWidget {
    constructor(element) { //ten konstruktor musi otrzymywać odniesienie do elementu, w którym widget ma zostać zainicjowany. Konstruktor tej klasy będzie zapisywał do właściwości otrzymany (jako argument) element, oraz znajdował w nim trzy elementy 
      const thisWidget = this;
      
      thisWidget.getElements(element); /*Wywołanie metody getElements(element)*/
      thisWidget.value = settings.amountWidget.defaultValue; //nadanie pierwotnej wartości thisWidget.value na wypadek gdyby value w kodzie HTML nie zostało podane
      thisWidget.setValue(thisWidget.input.value); /*Wywołanie metody setValue*/
      thisWidget.initActions(); /*Wywołanie metody initActions */

      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
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

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  //NEW CLASS - CART - klasa ta będzie obsługiwała koszyk i wszystkie jego funkcjonalności
  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = []; //w tej tablicy będą przechowywane produkty dodane do koszyka

      thisCart.getElements(element); //wywołanie metody getElements
      thisCart.initActions(); //wywołanie metody initActions

      console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {}; //w obiekcie thisCart.dom będziemy przechowywać wszystkie elementy DOM, wyszukane w komponencie koszyka 

      thisCart.dom.wrapper = element;

      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger); //definicja właściwości thisCart.dom.toggleTrigger, która znajduje w thisCart.dom.wrapper pojedynczy element o slektorze zapisanym w select.cart.toggleTrigger
    }

    initActions(){ //metoda, ktora rozwija i zwija koszyk przy kliknięciu pokazując/ukrywając szczegóły koszyka
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(event) {   //deklaracja thisCart i dodanie listener eventu 'click' na elemencie thisCart.dom.toggleTrigger
    
        event.preventDefault(); //wyrażenie, które powstrzyma domyślną akcję
    
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);   //handler listenera ma toggle'ować klasę zapisaną w classNames.cart.wrapperActive na elemencie thisCart.dom.wrapper
      });
    }
  }

  const app = {

    initCart: function() { //kiedy jest juz klasa Cart(KLASA-wzorzec, def.jak będą wyglądaly instancje tej klasy), w obiekcie app metida initCart będzie inicjować instancję (OBIEKT stworzony wedle wzorca (klasy)) koszyka. Przekażemy jej wrapper (czyli kontener, element okalający) koszyka.
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart (cartElem);
    },

    initMenu: function() {
      const thisApp = this; //Instancja dla każdego produktu. Sprawdzenie, czy dane są gotowe do użycia. thisApp pobiera dane z pliku data.js
      //console.log('thisApp.data:', thisApp.data); //-||-//
  
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
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData(); //Instancja dla każdego produktu (wykonanie metody initData)
      thisApp.initMenu(); //Instancja dla każdego produktu (wykonanie metody initMenu)
      thisApp.initCart(); //wywołanie metody
    }
  };
  app.init();
}