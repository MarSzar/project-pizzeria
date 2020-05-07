import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

export class Booking {
  constructor(widgetBooking){
    const thisBooking = this;
    
    thisBooking.render(widgetBooking);
    thisBooking.initWidgets();
    thisBooking.getData();  //metoda getData będzie pobierać dane z API używając adresów z parametrami filtrującymi wyniki. Do tego potrzebne są trzy adresy
    thisBooking.tableSelection();
    thisBooking.tableReservation();

    // console.log('thisBooking', thisBooking);
    // console.log('widgetBooking', widgetBooking);
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {  //obiekt params (aby ułatwić przygotowanie parametrów filtrujacych wynik zapytania. Do każdego z adresów - tablice
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [    //wydarzenia jednorazowe
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,      
      ],
      eventsRepeat: [     //wydarzenia cykliczne
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log('getData params', params);

    const urls = {  //obiekt z trzema właściwościami, po jednej dla każdego z adresów:
      booking:            settings.db.url + '/' + settings.db.booking 
                                          + '?' + params.booking.join('&'),                 //będzie zawierać adres endpointu API, który zwróci listę rezerwacji
      eventsCurrent:      settings.db.url + '/' + settings.db.event   
                                          + '?' + params.eventsCurrent.join('&'),          //zwróci listę wydarzeń jednorazowych
      eventsRepeat:       settings.db.url + '/' + settings.db.event   
                                          + '?' + params.eventsRepeat.join('&'),          //zwróci listę wydarzeń cyklicznych
    };

    //console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),      //funkcja fetch połączy się z serwerem API (pozwoli uruchomić kolejną metodę, dopiero kiedy wszystkie trzy pytania zwrócą odpowiedzi)
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),    
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};
    
    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    // console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      // console.log('loop', hourBlock);
    
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);  
    }
  }

  tableSelection(){
    const thisBooking = this;

    //LOOP for every table
    for (let table of thisBooking.dom.tables){

      table.addEventListener('click', function(event){               //dodanie EventListener dla wybranego stolika
        
        event.preventDefault();
        
        for (let table of thisBooking.dom.tables){                   //sprawdzenie, czy stolik nie jest zarezerwowany
          table.classList.remove(classNames.booking.newlyBooked);    //jeśli jest to usuń
        }

        if(!table.classList.contains(classNames.booking.tableBooked || classNames.booking.newlyBooked)){    //jeśli nie jest zajęty lub nie ma nowej rezerwacji to...

          table.classList.add(classNames.booking.newlyBooked);                                              //dodaj rezerwację stolika

          thisBooking.selectedTable = parseInt(table.getAttribute(settings.booking.tableIdAttribute));      //odczytanie wybranego numeru stolika i zamiana na liczbę
          
          console.log('Numer stolika:', thisBooking.selectedTable);
        }

        else{ //albo wyświetl, jeśli jest rezerwacja...
          console.log('Stolik jest już zarezerwowany. Proszę wybrać inny stolik.');
        }
      });
    //END LOOP for every table
    }
  }
  
  tableReservation(){
    const thisBooking = this;

    const button = thisBooking.dom.wrapper.querySelector(select.booking.submitBtn);

    button.addEventListener('click', function(event){
      
      event.preventDefault();

      thisBooking.reservation = {   //dane, które będą wysyłane do serwera
        id: '',
        date: thisBooking.datePicker.value,
        hour: thisBooking.hourPicker.value,
        table: thisBooking.selectedTable,
        repeat: 'false',
        duration: thisBooking.hoursAmount.value,
        ppl: thisBooking.peopleAmount.value,
        starters: [],
      };

      console.log('click, reservation', thisBooking.reservation);

      thisBooking.makeBooked(thisBooking.datePicker.value, thisBooking.hourPicker.value, thisBooking.hoursAmount.value, thisBooking.selectedTable);

      const options = { //opcje, które skonfigurują zapytanie
        method: 'POST', //POST-wysyłanie nowych danych do API
        headers: {       //ustawienie nagłówka, aby serwer wiedział, że wysyłam dane w postaci JSONa
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thisBooking.reservation),    //body - treść którą wysyłam, użycie metody JSON.stringify, aby przekonwertować obiekt payload na ciąg znaków w formacie JSON
      };

      const url = settings.db.url + '/' + settings.db.booking;

      fetch(url, options)   //wysłanie zapytania do serwera 
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    });
  }
   
  updateDOM(){
    const thisBooking = this;

    const currentDate = thisBooking.datePicker.value;
    const currentHour = thisBooking.hourPicker.value;

    if (thisBooking.date !== currentDate || thisBooking.hour !== currentHour) {
      for (let table of thisBooking.dom.tables) {
        table.classList.remove(classNames.booking.newlyBooked);
      }
    }

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(widgetBooking){    
    const thisBooking = this;

    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();    //HTML jest tworzony przy użyciu Handlebars (templates) na podstawie argumentów z bookingWidget (za pomocą szablonu tw. kod HTML i zapisywany jest w stałej generatedHTML)
  
    /* create empty object */
    thisBooking.dom = {}; //w obiekcie thisBooking.dom będą przechowywane wszystkie elementy DOM
    
    thisBooking.dom.wrapper = widgetBooking;    //zapisywanie do obiektu thisBooking.dom właściwość wrapper równą otrzymanemu argumentowi

    thisBooking.dom.wrapper.innerHTML = generatedHTML;    //zawartość wrapppera zamieniać na kod HTML wygenerowany z szablonu

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);  //definicja właściwości thisCart.dom.peopleAmount, która znajduje w thisBooking.dom.wrapper pojedynczy element o selektorze zapisanym w select.booking.peopleAmount
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
}
