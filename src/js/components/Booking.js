import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

export class Booking {
  constructor(widgetBooking){
    const thisBooking = this;
    
    thisBooking.render(widgetBooking);
    thisBooking.initWidgets();
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
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}
