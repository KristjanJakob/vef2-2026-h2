export type EventItem = {
    id: number | string;
    title: string;
    description?: string | null;
    image?: string | null;
    location?: string | null;
    startsAt?: string | null;
};
  
export type User = {
    id: number | string;
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
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
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