import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GroupsService } from './groups.service';

interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string | null;
}

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}


  @Post()
  createGroup(@Body() data: any, @Req() req: { user: AuthenticatedUser }) {
    return this.groupsService.createGroup(data, req.user.userId);
  }


  @Get('my-groups')
  getMyGroups(@Req() req: { user: AuthenticatedUser }) {
    return this.groupsService.getUserGroups(req.user.userId);
  }


  @Get(':groupId')
  getGroupDetail(@Param('groupId') groupId: string, @Req() req: { user: AuthenticatedUser }) {
    return this.groupsService.getGroupDetail(parseInt(groupId), req.user.userId);
  }


  @Get(':groupId/members')
  getGroupMembers(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupMembers(parseInt(groupId));
  }


  @Get(':groupId/workouts')
  getGroupWorkouts(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupWorkouts(parseInt(groupId));
  }


  @Put(':groupId/members/:userId/role')
  changeMemberRole(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() data: { role: string },
    @Req() req: { user: AuthenticatedUser }
  ) {
    return this.groupsService.changeMemberRole(
      parseInt(groupId),
      parseInt(userId),
      data.role,
      req.user.userId
    );
  }


  @Delete(':groupId/members/:userId')
  removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Req() req: { user: AuthenticatedUser }
  ) {
    return this.groupsService.removeMemberFromGroup(
      parseInt(groupId),
      parseInt(userId),
      req.user.userId
    );
  }

  @Post(':groupId/leave')
  leaveGroup(@Param('groupId') groupId: string, @Req() req: { user: AuthenticatedUser }) {
    return this.groupsService.leaveGroup(parseInt(groupId), req.user.userId);
  }


  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string, @Req() req: { user: AuthenticatedUser }) {
    return this.groupsService.deleteGroup(parseInt(groupId), req.user.userId);
  }
}