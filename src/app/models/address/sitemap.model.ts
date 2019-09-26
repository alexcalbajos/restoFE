import { Provider } from '../provider/provider.model';
import { City } from './city.model';

export class SitemapPair {
    city: City;
    providers: Array<Provider>;
}
