import { HttpClient } from '../http-client';
import type {
  TeamMember,
  TeamInvitation,
  UserRole,
  InviteMemberParams,
  AcceptInvitationParams,
} from '../types';

export class TeamsResource {
  constructor(private http: HttpClient) {}

  async getMembers(): Promise<{ members: TeamMember[] }> {
    return this.http.get<{ members: TeamMember[] }>('/teams/members');
  }

  async inviteMember(params: InviteMemberParams): Promise<TeamInvitation> {
    return this.http.post<TeamInvitation>('/teams/invite', params);
  }

  async acceptInvitation(token: string, params: AcceptInvitationParams): Promise<{ success: boolean; userId: string }> {
    return this.http.post(`/teams/invite/${token}/accept`, params);
  }

  async getPendingInvitations(): Promise<{ invitations: TeamInvitation[] }> {
    return this.http.get<{ invitations: TeamInvitation[] }>('/teams/invitations');
  }

  async cancelInvitation(invitationId: string): Promise<{ success: boolean }> {
    return this.http.delete(`/teams/invitations/${invitationId}`);
  }

  async resendInvitation(invitationId: string): Promise<{ success: boolean }> {
    return this.http.post(`/teams/invitations/${invitationId}/resend`);
  }

  async updateMemberRole(memberId: string, role: UserRole): Promise<{ success: boolean }> {
    return this.http.patch(`/teams/members/${memberId}/role`, { role });
  }

  async removeMember(memberId: string): Promise<{ success: boolean }> {
    return this.http.delete(`/teams/members/${memberId}`);
  }

  async suspendMember(memberId: string): Promise<{ success: boolean }> {
    return this.http.post(`/teams/members/${memberId}/suspend`);
  }

  async reactivateMember(memberId: string): Promise<{ success: boolean }> {
    return this.http.post(`/teams/members/${memberId}/reactivate`);
  }
}
