import { InjectionToken } from '@angular/core';

export const STATIC_CONFIG: any = new InjectionToken('static_config');

export class StaticConfig {
    brandId: number;
    brandName: string;
    applicationId: string;
    authorization: string;
    apiAuthToken: string;
    frontEndBuffer: number;
    workableId: number;
    esMail: string;
    frMail: string;
}

// tslint:disable-next-line:variable-name
export const static_config: StaticConfig = {
    brandId: 1,
    brandName: 'Resto-in',
    applicationId: 'sWbJmL6n2b3RLeR',
    authorization: 'Basic YW5ndWxhcjpidVM5a1g1bmQ0UWZTdlY=',
    apiAuthToken: 'cmVzdG9pbjozN2Y1MjVlMmI2ZmM=',
    frontEndBuffer: 300,
    workableId: 43714,
    esMail: 'info@resto-in.es',
    frMail: 'info@resto-in.fr'
};
