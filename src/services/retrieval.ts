import knowledge from '../data/qa-knowledge.json';
import products from '../data/products.json';
import { Product } from '../types';

export function retrieveKnowledge(query: string): string[] {
  const q = query.toLowerCase();
  const hits = knowledge.filter((k) => k.keywords.some((kw) => q.includes(String(kw).toLowerCase())));
  return hits.map((h) => h.answer);
}

export interface ProductFilter {
  keyword?: string;
  category?: string;
  maxPrice?: number;
  suitableFor?: string;
}

export function retrieveProducts(filter: ProductFilter): Product[] {
  return (products as Product[]).filter((p) => {
    const okKeyword = filter.keyword
      ? p.name.includes(filter.keyword) || p.features.some((f) => f.includes(filter.keyword!))
      : true;
    const okCategory = filter.category ? p.category === filter.category : true;
    const okPrice = typeof filter.maxPrice === 'number' ? p.price <= filter.maxPrice : true;
    const okSuitable = filter.suitableFor
      ? p.suitableFor.some((s) => s.includes(filter.suitableFor!))
      : true;
    return okKeyword && okCategory && okPrice && okSuitable;
  });
}
