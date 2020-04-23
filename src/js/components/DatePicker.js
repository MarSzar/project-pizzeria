import {settings, select} from '../settings.js';
import utils from '../utils.js';
import BaseWidget from './BaseWidget.js';

export class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
  
    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);

    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
  
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minTime: thisWidget.minDate,
      maxTime: thisWidget.maxDate,

      'disable': [
        function(date) {
          // return true to disable
          return date.getDay() === 1;
        }
      ],
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },

      onChange: function(selectedDates, dateStr){

        thisWidget.value = dateStr;
      }
    
    });
  }

  parseValue(value){  //będzie wykorzystywana do tego, aby przekształcić wartość którą chcemy ustawić, w odpowiedni typ lub formę
    return value;
  }

  isValid(value){ //będzie zwracać prawdę lub fałsz w zależności od tego czy wartość którą chcemy ustawić dla tego widgetu jest prawidłowa wedle kryteriów, które ustalimy dla każdego z widgetu
    console.log('use this value', value);
    return true;
  }

  renderValue(){
  }
}

export default DatePicker;