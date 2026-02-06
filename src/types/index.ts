export type UserRole = 'USER' | 'ADMIN' | 'OWNER' | 'SUPERUSER';
export type EnvelopeStatus = 'DRAFT' | 'SENT' | 'COMPLETED' | 'VOIDED' | 'DECLINED' | 'EXPIRED';
export type ContactSource = 'ENVELOPE' | 'PUBLIC_FORM' | 'MANUAL';
export type StoragePreference = 'INTERNAL' | 'GOOGLE_DRIVE' | 'ONEDRIVE' | 'DROPBOX';
export type PresenceStatus = 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';

export interface AuthensureConfig {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  debug?: boolean;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  company?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  website?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  presenceStatus: PresenceStatus;
  lastActiveAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  defaultSignatureType?: string;
  allowedSignatureTypes?: string[];
  requireMfa?: boolean;
  sessionTimeout?: number;
  brandingEnabled?: boolean;
  primaryColor?: string;
  logoUrl?: string;
}

export interface Envelope {
  id: string;
  name: string;
  status: EnvelopeStatus;
  message?: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  completedAt?: string;
  voidedAt?: string;
  voidReason?: string;
  documents: Document[];
  recipients: Recipient[];
}

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  fileCid?: string;
  mimeType: string;
  size: number;
  pageCount?: number;
  envelopeId: string;
  fields: DocumentField[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentField {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  required: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  recipientId?: string;
  value?: string;
}

export interface Recipient {
  id: string;
  email: string;
  name: string;
  role: string;
  orderIndex: number;
  status: 'PENDING' | 'SENT' | 'VIEWED' | 'SIGNED' | 'DECLINED';
  signedAt?: string;
  viewedAt?: string;
  signingToken?: string;
  envelopeId: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdById: string;
  isPublic: boolean;
  usageCount: number;
  documents: TemplateDocument[];
  roles: TemplateRole[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDocument {
  id: string;
  name: string;
  fileUrl: string;
  templateId: string;
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  required: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  roleId?: string;
}

export interface TemplateRole {
  id: string;
  name: string;
  orderIndex: number;
  templateId: string;
}

export interface Contact {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  notes?: string;
  source: ContactSource;
  organizationId: string;
  addedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  bySource: Record<ContactSource, number>;
  addedLast24h: number;
  change24h: number;
  changePercent: number;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  rateLimit?: number;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  key: string;
}

export interface ApiKeyStats {
  totalKeys: number;
  activeKeys: number;
  totalRequests: number;
  requestsToday: number;
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  isActive: boolean;
  secret: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export type WebhookEvent = 
  | 'envelope.created'
  | 'envelope.sent'
  | 'envelope.viewed'
  | 'envelope.signed'
  | 'envelope.completed'
  | 'envelope.declined'
  | 'envelope.voided'
  | 'recipient.signed'
  | 'recipient.declined'
  | 'document.uploaded';

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  statusCode?: number;
  response?: string;
  success: boolean;
  attemptCount: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  user: User;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  joinedAt: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  invitedById: string;
  organizationId: string;
  createdAt: string;
}

export interface SavedSignature {
  id: string;
  name: string;
  imageData: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  browser?: string;
  os?: string;
  device?: string;
  isCurrent: boolean;
  createdAt: string;
  lastActiveAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  requiresMfa?: boolean;
  mfaToken?: string;
  availableMfaMethods?: string[];
}

export interface AuthensureErrorResponse {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface CreateEnvelopeParams {
  name: string;
  message?: string;
}

export interface AddRecipientParams {
  email: string;
  name: string;
  role?: string;
}

export interface CreateContactParams {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateContactParams {
  name?: string;
  company?: string;
  phone?: string;
  notes?: string;
}

export interface CreateApiKeyParams {
  name: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt?: string;
}

export interface CreateWebhookParams {
  url: string;
  events: WebhookEvent[];
}

export interface UpdateWebhookParams {
  url?: string;
  events?: WebhookEvent[];
  isActive?: boolean;
}

export interface InviteMemberParams {
  email: string;
  role: UserRole;
}

export interface AcceptInvitationParams {
  name: string;
  password: string;
}

export interface CreateTemplateParams {
  name: string;
  description?: string;
}

export interface UseTemplateParams {
  name: string;
  recipients: Array<{
    roleId: string;
    email: string;
    name: string;
  }>;
}

export interface UpdateProfileParams {
  name?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface UpdateOrganizationParams {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
}
