import { retrieveKnowledge } from '../services/retrieval';

export function queryKnowledgeBase(query: string): string[] {
  return retrieveKnowledge(query);
}
