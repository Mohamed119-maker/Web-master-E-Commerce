import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  transform(value: string, splite: string, start: number, end: number, join: string): unknown {
    return value.split(splite).slice(start, end).join(join);
  }

}
