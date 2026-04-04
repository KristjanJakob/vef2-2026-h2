export type EventItem = {
    id: string;
    title: string;
    description?: string | null;
    images?: EventImage[];
    location?: Location | null;
    startsAt?: string | null;
    endsAt?: string | null;
    category?: Category | null;
    status?: EventStatus;
};
  
export type User = {
    id: string;
    username: string;
    email?: string;
    role?: string;
};
  
export type LoginResponse = {
    token: string;
    user?: User;
};
  
export type PaginatedEventsResponse = {
    data: EventItem[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
};

export type Category = {
    id: string;
    name: string;
    slug?: string;
};

export type Location = {
    id: string;
    name: string;
    slug?: string;
};

export type EventImage = {
    id: string;
    url: string;
    alt?: string | null;
};

export type MetaListResponse<T> = {
    data: T[];
};
  
export type EventStatus = "PUBLISHED" | "DRAFT";