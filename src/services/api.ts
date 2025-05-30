
import { University, Program, Passer, ApplicantStats, ApiResponse } from '../types';

const API_BASE_URL = 'https://utbk2025-api.mnct.eu.org';

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    return response.json();
  }

  async getUniversities(page: number = 1, pageSize: number = 6, name?: string): Promise<ApiResponse<University[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (name) {
      params.append('name', name);
    }

    return this.fetchApi<ApiResponse<University[]>>(`/universities?${params}`);
  }

  async getUniversity(ptnCode: string): Promise<ApiResponse<University>> {
    return this.fetchApi<ApiResponse<University>>(`/universities/${ptnCode}`);
  }

  async getPrograms(ptnCode: string): Promise<ApiResponse<Program[]>> {
    return this.fetchApi<ApiResponse<Program[]>>(`/universities/${ptnCode}/programs`);
  }

  async getPassers(
    ptnCode: string, 
    programCode: string, 
    page: number = 1, 
    pageSize: number = 10,
    name?: string
  ): Promise<ApiResponse<Passer[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (name) {
      params.append('name', name);
    }

    return this.fetchApi<ApiResponse<Passer[]>>(`/universities/${ptnCode}/programs/${programCode}/passers?${params}`);
  }

  async getStats(): Promise<ApiResponse<ApplicantStats>> {
    return this.fetchApi<ApiResponse<ApplicantStats>>('/stats');
  }
}

export const apiService = new ApiService();
