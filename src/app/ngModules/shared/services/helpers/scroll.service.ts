import * as $ from 'jquery';

import { Injectable } from '@angular/core';

@Injectable()
export class ScrollService {
    scrollTo(target: string, container: string = 'html, body', offSet: number = 0): void {
        const scrollTop: number = container === 'html, body' ?
            $(target).offset().top - offSet :
            $(target).offset().top - $(container).offset().top + $(container).scrollTop() - offSet;

        $(container).animate({ scrollTop }, 700);
    }
}
