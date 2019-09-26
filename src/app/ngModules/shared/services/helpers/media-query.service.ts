import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { MqAlias } from '../../../../enums/media-query-alias.enum';

@Injectable()
export class MediaQueryService {
    _mediaChange: BehaviorSubject<MediaChange> = new BehaviorSubject<any>({});
    mediaChange$: Observable<MediaChange> = this._mediaChange.asObservable();

    constructor(private mediaObserver: MediaObserver) { }

    init(): void {
        this.mediaObserver.media$.subscribe((mediaChange: MediaChange) => {
            mediaChange.value = MqAlias[mediaChange.suffix];
            this._mediaChange.next(mediaChange);
        });
    }
}
