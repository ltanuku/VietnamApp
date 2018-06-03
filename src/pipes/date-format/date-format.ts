import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, DecimalPipe } from "@angular/common";

/**import { DecimalPipe } from '@angular/common';
 * Generated class for the DateFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe   implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

  transform(value: string, ...args) {
       
    if (value) {
     
      let dateObj = new Date(value.split(" ")[0]); 

     let datePipe  =new DatePipe("en-US");
     // let date = value instanceof Date ? value : new Date(value);
      return datePipe.transform(dateObj,  'dd/MM/yyyy');
  }
  }
}


@Pipe({
  name: 'icttoLocalDate',
})
export class IctToLocal  implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

  transform(value: string, ...args) {
    
    if (value) {
     
      let dateObj = new Date(value.split(" ")[0]); 

     let datePipe  =new DatePipe("en-US");
     // let date = value instanceof Date ? value : new Date(value);
      return  new Date(dateObj); //datePipe.transform(dateObj,  'dd/MM/yyyy');
  }
  }
}

@Pipe({ name: 'nodata' })
export class displayHyphen implements PipeTransform {
  transform(value:  string, serviceCallCom : boolean ){
  
    if(serviceCallCom == false)
      return "";

    if(value == null || value == "" )
      return value = "-";
    else
      return value;
    
  }
}

@Pipe({ name: 'noImage' })
export class displayDefaultImage implements PipeTransform {
  transform(value:  string ){
  
    if(value == null)
    return value = "./assets/icon/slide-01.jpg";
    else
    return value ;
    
  }
}
/**decimal formating */
@Pipe({ name: 'decimal' })
export class decimal implements PipeTransform {
	transform(value: any, args ?: any){
  
		if(value && value % 1 != 0){
		let decimalPipe = new DecimalPipe("en-us");	
			return decimalPipe.transform(value, '.2-2');
    }else
    return parseInt(value); 
        
  }
}