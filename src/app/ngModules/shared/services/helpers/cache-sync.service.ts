import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class CacheSyncService {
    add(observable: Observable<any>, cacheKey: string): void {
        observable.subscribe((entity: any) => {
            if (entity) {
                if (!entity.doNotCache) {
                    localStorage.setItem(cacheKey, JSON.stringify(entity));
                }
            } else {
                localStorage.removeItem(cacheKey);
            }
        });
    }
}
