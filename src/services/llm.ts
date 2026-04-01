export interface LLMProvider {
  generate(prompt: string): Promise<string>;
}

export class MockLLMProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    return `【MVP模拟回复】${prompt}`;
  }
}

export const llmProvider: LLMProvider = new MockLLMProvider();
