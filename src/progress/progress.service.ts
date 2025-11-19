import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface GroupProgressResponse {
  group: {
    id: number;
    name: string;
    description: string | null;
    createdBy: number;
  };
  totalMembers: number;
  totalWorkouts: number;
  completedWorkouts: number;
  totalTasks: number;
  completedTasks: number;
  groupPercentage: number;
  membersProgress: Array<{
    user: { id: number; name: string; email: string };
    role: string | null;
    userId: number;
    groupId: number;
    totalWorkouts: number;
    completedWorkouts: number;
    totalTasks: number;
    completedTasks: number;
    percentage: number;
  }>;
}

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}


  async getUserProgress(userId: number) {
    const workouts = await this.prisma.workouts.findMany({
      where: { user_id: userId },
      include: { tasks: true },
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let totalWorkouts = 0;
    let completedWorkouts = 0;

    workouts.forEach(workout => {
      totalWorkouts += 1;
      if (workout.completed) completedWorkouts += 1;

      workout.tasks.forEach(task => {
        totalTasks += 1;
        if (task.completed) completedTasks += 1;
      });
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      userId,
      totalWorkouts,
      completedWorkouts,
      pendingWorkouts: totalWorkouts - completedWorkouts,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      percentage,
    };
  }


  async getUserGroupProgress(userId: number, groupId: number) {

    const isMember = await this.prisma.group_members.findUnique({
      where: { user_id_group_id: { user_id: userId, group_id: groupId } },
    });

    if (!isMember) {
      throw new NotFoundException('No eres miembro de este grupo');
    }


    const workouts = await this.prisma.workouts.findMany({
      where: { user_id: userId, group_id: groupId },
      include: { tasks: true },
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let totalWorkouts = 0;
    let completedWorkouts = 0;

    workouts.forEach(workout => {
      totalWorkouts += 1;
      if (workout.completed) completedWorkouts += 1;

      workout.tasks.forEach(task => {
        totalTasks += 1;
        if (task.completed) completedTasks += 1;
      });
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      userId,
      groupId,
      totalWorkouts,
      completedWorkouts,
      totalTasks,
      completedTasks,
      percentage,
    };
  }


  async getGroupProgress(groupId: number): Promise<GroupProgressResponse> {
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }


    const members = await this.prisma.group_members.findMany({
      where: { group_id: groupId },
    });


    const membersProgress = await Promise.all(
      members.map(async member => {
        const progress = await this.getUserGroupProgress(member.user_id, groupId);
        const user = await this.prisma.users.findUnique({
          where: { id: member.user_id },
          select: { id: true, name: true, email: true },
        });

        return {
          user: user || { id: 0, name: 'Unknown', email: 'unknown@example.com' },
          role: member.role,
          ...progress,
        };
      })
    );


    const totalMembersProgress = membersProgress.reduce(
      (acc, member) => {
        acc.totalWorkouts += member.totalWorkouts;
        acc.completedWorkouts += member.completedWorkouts;
        acc.totalTasks += member.totalTasks;
        acc.completedTasks += member.completedTasks;
        return acc;
      },
      { totalWorkouts: 0, completedWorkouts: 0, totalTasks: 0, completedTasks: 0 }
    );

    const groupPercentage = totalMembersProgress.totalTasks > 0
      ? Math.round((totalMembersProgress.completedTasks / totalMembersProgress.totalTasks) * 100)
      : 0;

    return {
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        createdBy: group.created_by,
      },
      totalMembers: members.length,
      ...totalMembersProgress,
      groupPercentage,
      membersProgress,
    };
  }


  async getGroupRanking(groupId: number) {
    const groupProgress = await this.getGroupProgress(groupId);

    const ranking = groupProgress.membersProgress
      .sort((a, b) => b.percentage - a.percentage)
      .map((member, index) => ({
        rank: index + 1,
        ...member,
      }));

    return {
      group: groupProgress.group,
      ranking,
    };
  }
}