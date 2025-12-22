import { SearchParams, Recommendation, Tip, Destination } from '../types/index.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Search & Recommendations
  async getRecommendations(params: SearchParams): Promise<Recommendation[]> {
    const result = await this.request<{ recommendations: Recommendation[] }>(
      '/search',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return result.recommendations;
  }

  async getTrendingTips(): Promise<Tip[]> {
    const result = await this.request<{ tips: Tip[] }>('/search/trending');
    return result.tips;
  }

  // Destinations
  async getDestinations(): Promise<Destination[]> {
    const result = await this.request<{ destinations: Destination[] }>(
      '/destinations'
    );
    return result.destinations;
  }

  async getDestination(id: string): Promise<Destination> {
    const result = await this.request<{ destination: Destination }>(
      `/destinations/${id}`
    );
    return result.destination;
  }

  // Tips
  async getTips(season?: string, destinationId?: string): Promise<Tip[]> {
    const params = new URLSearchParams();
    if (season) params.append('season', season);
    if (destinationId) params.append('destination_id', destinationId);

    const result = await this.request<{ tips: Tip[] }>(
      `/tips?${params.toString()}`
    );
    return result.tips;
  }

  async createTip(tip: Partial<Tip>): Promise<Tip> {
    const result = await this.request<{ tip: Tip }>('/tips', {
      method: 'POST',
      body: JSON.stringify(tip),
    });
    return result.tip;
  }

  async voteTip(
    tipId: string,
    voteType: 'up' | 'down'
  ): Promise<Tip> {
    const result = await this.request<{ tip: Tip }>(
      `/tips/${tipId}/vote`,
      {
        method: 'POST',
        body: JSON.stringify({ vote_type: voteType }),
      }
    );
    return result.tip;
  }

  async deleteTip(tipId: string): Promise<void> {
    await this.request(`/tips/${tipId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
