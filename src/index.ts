import { HttpClient } from './http-client';
import {
  AuthResource,
  EnvelopesResource,
  DocumentsResource,
  TemplatesResource,
  ContactsResource,
  UsersResource,
  OrganizationsResource,
  WebhooksResource,
  ApiKeysResource,
  TeamsResource,
  SignaturesResource,
} from './resources';
import type { AuthensureConfig } from './types';

export class Authensure {
  private readonly http: HttpClient;

  public readonly auth: AuthResource;
  public readonly envelopes: EnvelopesResource;
  public readonly documents: DocumentsResource;
  public readonly templates: TemplatesResource;
  public readonly contacts: ContactsResource;
  public readonly users: UsersResource;
  public readonly organizations: OrganizationsResource;
  public readonly webhooks: WebhooksResource;
  public readonly apiKeys: ApiKeysResource;
  public readonly teams: TeamsResource;
  public readonly signatures: SignaturesResource;

  constructor(config: AuthensureConfig = {}) {
    if (!config.apiKey && !config.accessToken) {
      throw new Error('Either apiKey or accessToken must be provided');
    }

    this.http = new HttpClient(config);

    this.auth = new AuthResource(this.http);
    this.envelopes = new EnvelopesResource(this.http);
    this.documents = new DocumentsResource(this.http);
    this.templates = new TemplatesResource(this.http);
    this.contacts = new ContactsResource(this.http);
    this.users = new UsersResource(this.http);
    this.organizations = new OrganizationsResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.apiKeys = new ApiKeysResource(this.http);
    this.teams = new TeamsResource(this.http);
    this.signatures = new SignaturesResource(this.http);
  }

  setAccessToken(token: string): void {
    this.http.setAccessToken(token);
  }

  static createWithApiKey(apiKey: string, options?: Omit<AuthensureConfig, 'apiKey'>): Authensure {
    return new Authensure({ ...options, apiKey });
  }

  static createWithToken(accessToken: string, options?: Omit<AuthensureConfig, 'accessToken'>): Authensure {
    return new Authensure({ ...options, accessToken });
  }
}

export * from './types';
export * from './errors';
export { HttpClient } from './http-client';
export default Authensure;
