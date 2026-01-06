/**
 * Tipos baseados na documentação da API
 * FRONTEND_API_DOCUMENTATION.md
 */

// ==================== Auth ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo_url?: string;
  preferred_mode?: 'consumer' | 'provider';
  roles?: Array<{ id: number; name: string }>;
}

// ==================== Jobs ====================

export interface Job {
  id: string;
  consumer_user_id: string;
  category_id: number;
  title: string;
  description: string;
  address_text: string;
  lat: number;
  lng: number;
  preferred_datetime?: string;
  status: JobStatus;
  cover_photo?: {
    id: string;
    url: string;
  };
  photos?: Array<{
    id: string;
    url: string;
  }>;
  created_at: string;
  updated_at: string;
}

export type JobStatus =
  | 'open'
  | 'negotiating'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface JobsListResponse {
  items: Job[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetJobsParams {
  lat: number;
  lng: number;
  radius_km: number;
  category_id?: number;
  status?: JobStatus;
  limit?: number;
  offset?: number;
}

export interface CreateJobRequest {
  category_id: number;
  title: string;
  description: string;
  address_text: string;
  lat: number;
  lng: number;
  preferred_datetime?: string;
  photo_urls?: string[];
}

// ==================== Offers ====================

export interface Offer {
  id: string;
  job_id: string;
  provider_user_id: string;
  amount_cents: number;
  currency: string;
  message?: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface OffersListResponse {
  items: Offer[];
}

export interface CreateOfferRequest {
  amount_cents: number;
  currency?: string;
  message?: string;
}

// ==================== Payments ====================

export interface CheckoutRequest {
  job_id: string;
  offer_id: string;
}

export interface CheckoutResponse {
  payment_id: string;
  status: PaymentStatus;
  checkout_url: string;
  provider: {
    id: string;
    name: string;
  };
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ==================== Wallet ====================

export interface Wallet {
  wallet_account_id: string;
  user_id: string;
  currency: string;
  available_cents: number;
  pending_cents: number;
}

export interface WalletTransaction {
  id: string;
  direction: 'credit' | 'debit';
  kind: string;
  amount_cents: number;
  currency: string;
  status: TransactionStatus;
  reference_type: string;
  reference_id: string;
  description: string;
  created_at: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface WalletTransactionsResponse {
  items: WalletTransaction[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreatePayoutRequest {
  amount_cents: number;
  destination?: string;
}

export interface PayoutResponse {
  payout: {
    id: string;
    amount_cents: number;
    currency: string;
    status: PayoutStatus;
    destination?: string;
    review_notes?: string;
    created_at: string;
    updated_at: string;
  };
  wallet: Wallet;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ==================== Reviews ====================

export interface Review {
  id: string;
  job_id: string;
  reviewer_user_id: string;
  reviewee_user_id: string;
  direction: ReviewDirection;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export type ReviewDirection = 'consumer_to_provider' | 'provider_to_consumer';

export interface CreateReviewRequest {
  job_id: string;
  rating: number;
  comment?: string;
  direction: ReviewDirection;
}

export interface ReviewsListResponse {
  items: Review[];
  total: number;
  limit: number;
  offset: number;
}

export interface ReviewSummary {
  reviewee_user_id: string;
  direction: ReviewDirection;
  avg_rating: number;
  count: number;
}

// ==================== Provider ====================

export interface ProviderProfile {
  id: string;
  user_id: string;
  status: ProviderStatus;
  full_name: string;
  document_number: string;
  birth_date?: string;
  phone?: string;
  address_text?: string;
  service_radius_km: number;
  bio?: string;
  category_ids: number[];
  documents?: Array<{
    doc_type: string;
    url: string;
  }>;
  submitted_at?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

export type ProviderStatus = 'pending' | 'approved' | 'rejected';

export interface ProviderOnboardingRequest {
  full_name: string;
  document_number: string;
  birth_date?: string;
  phone?: string;
  address_text?: string;
  service_radius_km: number;
  bio?: string;
  category_ids: number[];
  documents?: Array<{
    doc_type: string;
    url: string;
  }>;
}

export interface ProvidersListResponse {
  items: ProviderProfile[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApproveProviderRequest {
  notes?: string;
}

export interface RejectProviderRequest {
  notes?: string;
}

// ==================== User Update ====================

export interface UpdateUserRequest {
  name?: string;
  photo_url?: string;
  preferred_mode?: 'consumer' | 'provider';
}

// ==================== Categories ====================

export interface Category {
  id: number;
  name: string;
  icon?: string;
}


