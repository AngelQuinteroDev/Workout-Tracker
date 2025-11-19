import { Controller, Post, Get, Param, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { WorkoutsService } from './workouts.service';

interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string | null;
}

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private workoutsService: WorkoutsService) {}


  @Post()
  async create(@Body() data: any, @Req() req: { user: AuthenticatedUser }) {
    return this.workoutsService.createWorkout(req.user.userId, data);
  }


  @Get('my-workouts')
  async getMyWorkouts(@Req() req: { user: AuthenticatedUser }) {
    return this.workoutsService.getUserWorkouts(req.user.userId);
  }


  @Get(':id')
  async getWorkout(@Param('id') id: string) {
    return this.workoutsService.getWorkout(parseInt(id));
  }


  @Post(':id/complete')
  async completeWorkout(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }) {
    return this.workoutsService.completeWorkout(parseInt(id), req.user.userId);
  }


  @Delete(':id')
  async deleteWorkout(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }) {
    return this.workoutsService.deleteWorkout(parseInt(id), req.user.userId);
  }
}