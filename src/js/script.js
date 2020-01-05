/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{ //Tworzenie klasy, która zawiera konstruktor wyświetlający wiadomość w konsoli//
    constructor(id, data){
      const thisProduct = this;
	  
	  thisProduct.id = id;
	  thisProduct.data = data;
	  
	  thisProduct.renderInMenu();
	  
      console.log('new Product:', thisProduct);
    }
	
	renderInMenu(){
		const thisProduct = this;
		
		/*generate HTML based on template */
		const generratedHTML = templates.menuProduct(thisProduct.data);
		
		/*create element using utils.createElementFromHTML */
		thisProduct.element = utils.createDOMFromHTML(generatedHTML);
		
		/*find menu container */
		const menuContainer = document.querySelector(select.containerOf.menu);
		
		/* add element to menu */
		menuContainer.appendChild(thisProduct.element);
	}
	
  }
  const app = { //Tworzenie pierwszej instancji klasy Product. Metoda obiektu app będzie tworzyć instancje klasy Product//
    initMenu: function(){
      const thisApp = this; //Instancja dla każdego produktu. Sprawdzenie, czy dane są gotowe do użycia//
      console.log('thisApp.data:', thisApp.data); //-||-//
      
      const testProduct = new Product();
      console.log('testProduct:', testProduct);

      //const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);
      //for(let productData in thisApp.data.products){
      //  new Product(productData, thisApp.data.products[productData]);
        
      }
    },
    
	initData: function(){ //Instancja dla każdego produktu. Aplikacja ma korzystać z dataSource w pliku data.js jako źródła danych, ale w przyszłości dane będą wczytywane z serwera. Metoda app.initData w przyszłości pozwoli zmienić sposób pobierania danych//
      const thisApp = this; //-||-//
  
      thisApp.data = dataSource; //-||-//
    },
    
	init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData(); //Instancja dla każdego produktu//
      thisApp.initMenu();
    },
  };
  

  app.init();
}
