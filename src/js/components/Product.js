import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

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
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form); //pobiera całą formę, form -cały formularz w którym może być parę forminput
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs); //pobiera wszystkie formInput (ilości z liczbą), ilości sumuje, input-miejsce do wpisywania cyfr, liczb
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton); //za pomocą elementu querySelector zostanie wyszukany element w html - przycisk Add to card
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem); //za pomocą elementu querySelector zostanie wyszukany element w html - span.price
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
      thisProduct.addToCart();
    });
  }

  processOrder() { //metoda, która obliczy cenę produktu z wybranymi opcjami (potem dodać kod, który będzie dodawał produkt do koszyka, na razie nie zmienia adresu strony i wywołuje przeliczenie ceny produktu)
    const thisProduct = this;
      
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form); //funkcja zwracająca obiekt, w którym kluczami są wartości atrybutów name kontrolek formularza, wartościami będą tablice, zawierające wartości atrybutów vaule wybranych opcji
      
    /* NEW - add empty object */
    thisProduct.params = {};  //zapisanie pustego obiektu {} do właściwości thisProduct.params

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

          /* NEW ! - sprawdzanie czy parametr został dodany do thisProduct.params. Jeśli nie to pod jego kluczem dod. jego label i pusty obiekt options*/
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label; //nast. do wspomnianego obiektu options dodajemy zaznaczoną opcję, używając jej klucza, a jako wartość ustawiając jej label
                      
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
        
        
    }
    /* NEW - multiply price by amount */ 
    //price *= thisProduct.amountWidget.value; //tuż przed wyświetleniem ceny obliczonej z uwzględnieiem opcji pomnożymy ją przez ilość sztuk wybraną w widgecie
    thisProduct.priceSingle = price; //stworzenie ceny jednej sztuki - priceSingle
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value; //stworzenie ceny całkowitej - price. To cena jednej sztuki produktu pomnożona przez cyfrę w widgecie Amount

    /* set the contents of thisProduct.priceElem to be the value of variable price */ //wstawienie wartości zmiennej price do elementu thisProduct.priceElem. (po pętlach wyświetlam cenę)
    //thisProduct.priceElem.innerHTML = price;
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  initAmountWidget(){ /*Nowa metoda - initAmountWidget w klasie Product. Metoda ta będzie tworzyła instancję klasy AmountWidget i zapisywała ją we właściwości produktu */
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){ //NASŁUCHIWANIE EVENTU - druga część informowania producktu, nasłuchiwanie tego eventu w klasie Product
      thisProduct.processOrder();
    });
  }

  addToCart(){ //Nowa metoda w klasie Product - przekazuje ona całą instancję jako argument metody app.cart.add.
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name; //uproszczenie dostępu do danych - "wyciągnięcie" ich do poziomu właściwości instancji
    thisProduct.amount = thisProduct.amountWidget.value;  //-//-//

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      }
    });

    thisProduct.element.dispatchEvent(event);
    
  }
}

export default Product;