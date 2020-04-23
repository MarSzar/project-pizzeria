import {settings, select} from '../settings.js';
import utils from '../utils.js';
import BaseWidget from './BaseWidget.js';

export class HourPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.hours.open);
    
    const thisWidget = this;
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    
    thisWidget.initPlugin();

    thisWidget.value = thisWidget.dom.input.value;
  }
    
  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
      //console.log('thisWidget.value', thisWidget.value);
    });
  }
    
  parseValue(value){  //będzie wykorzystywana do tego, aby przekształcić wartość którą chcemy ustawić, w odpowiedni typ lub formę
    return utils.numberToHour(value);
  }
    
  isValid(){ //będzie zwracać prawdę lub fałsz w zależności od tego czy wartość którą chcemy ustawić dla tego widgetu jest prawidłowa wedle kryteriów, które ustalimy dla każdego z widgetu
    return true;
  }
    
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}

export default HourPicker;