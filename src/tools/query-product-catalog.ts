import { retrieveProducts, ProductFilter } from '../services/retrieval';

export function queryProductCatalog(filter: ProductFilter) {
  return retrieveProducts(filter);
}
