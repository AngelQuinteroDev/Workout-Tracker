import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ProgressService, GroupProgressResponse } from './progress.service';

// Interfaz para tipar req.user
interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string | null;
}

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  // GET /progress/me - Mi progreso personal
  @Get('me')
  getMyProgress(@Req() req: { user: AuthenticatedUser }) {
    return this.progressService.getUserProgress(req.user.userId);
  }

  // GET /progress/group/:groupId/me - Mi progreso en el grupo
  @Get('group/:groupId/me')
  getMyGroupProgress(@Param('groupId') groupId: string, @Req() req: { user: AuthenticatedUser }) {
    return this.progressService.getUserGroupProgress(req.user.userId, parseInt(groupId));
  }

  // GET /progress/group/:groupId - Progreso general del grupo
  @Get('group/:groupId')
  getGroupProgress(@Param('groupId') groupId: string): Promise<GroupProgressResponse> {
    return this.progressService.getGroupProgress(parseInt(groupId));
  }

  // GET /progress/group/:groupId/ranking - Ranking del grupo
  @Get('group/:groupId/ranking')
  getGroupRanking(@Param('groupId') groupId: string) {
    return this.progressService.getGroupRanking(parseInt(groupId));
  }
}