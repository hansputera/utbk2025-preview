
export interface ApplicantStats {
  totalRegistrants: number;
  totalPassers: number;
  totalFailures: number;
  kipParticipant: number;
}

export interface University {
  code: string;
  name: string;
  passers: number;
  isTopFive: number;
  kipUsers: number;
  kip?: number; // Make this optional since it comes from API response
  country?: string;
  logo?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  // Legacy field for backward compatibility
  id?: string;
  address?: string;
}

export interface Program {
  code: string;
  name: string;
  passers: number;
  isTopFive: number;
  kip: number;
  // Legacy field for backward compatibility
  id?: string;
}

export interface Passer {
  name: string;
  utbkNumber: string;
  program: string;
  id: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}
