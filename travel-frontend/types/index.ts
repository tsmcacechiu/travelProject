export interface Article {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Guide {
  id: number;
  title: string;
  destination: string;
  content: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
