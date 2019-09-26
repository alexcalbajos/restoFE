import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'ri-rating-starts',
    templateUrl: 'rating-starts.component.html',
    styleUrls: ['rating-starts.component.scss']
})

export class RatingStarsComponent implements OnInit, OnChanges {
    @Input() score: number;
    @Input() maxScore: number = 5;
    @Input() forDisplay: boolean = false;
    @Output() readonly rateChanged: EventEmitter<number> = new EventEmitter<number>();
    range: Array<number> = [];
    marked: number = -1;

    ngOnInit(): void {
        for (let i: number = 0; i < this.maxScore; i++) {
            this.range.push(i);
        }
    }

    ngOnChanges(): void {
        this.score = this.score / 2;
    }

    mark(index: number): void {
        this.marked = this.marked === index ? index - 1 : index;
        this.score = this.marked + 1;
        this.rateChanged.emit(this.score);
    }

    getClass(index: number): string {
        if (!this.forDisplay) {
            if (index <= this.marked) {
                return 'selected';
            } else {
                return 'unselected';
            }
        } else {
            if (this.score >= index + 1) {
                return 'selected';
            } else if (this.score > index && this.score < index + 1) {
                return 'selected';
            } else {
                return 'unselected';
            }
        }
    }
}
