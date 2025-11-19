
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  // Crear workout
  async createWorkout(
    userId: number,
    data: { title: string; description?: string; duration_minutes?: number; groupId?: number }
  ) {
    return this.prisma.workouts.create({
      data: {
        user_id: userId,
        group_id: data.groupId,
        title: data.title,
        description: data.description,
        duration_minutes: data.duration_minutes,
      },
      include: { 
        comments: {
          include: {
            users: { select: { id: true, name: true, email: true } }, // ← Cambio: user → users
          },
        },
        tasks: true,
      },
    });
  }

  // Obtener mis workouts
  async getUserWorkouts(userId: number) {
    return this.prisma.workouts.findMany({
      where: { user_id: userId },
      include: {
        comments: {
          include: {
            users: { select: { id: true, name: true, email: true } }, // ← Cambio: user → users
          },
        },
        tasks: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // Obtener workouts de un grupo
  async getGroupWorkouts(groupId: number) {
    return this.prisma.workouts.findMany({
      where: { group_id: groupId },
      include: {
        users: { select: { id: true, name: true, email: true } }, // ← Relación a user que creó
        comments: {
          include: {
            users: { select: { id: true, name: true, email: true } }, // ← Cambio: user → users
          },
        },
        tasks: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // Obtener workout por ID
  async getWorkout(workoutId: number) {
    const workout = await this.prisma.workouts.findUnique({
      where: { id: workoutId },
      include: {
        comments: {
          include: {
            users: { select: { id: true, name: true, email: true } }, // ← Cambio: user → users
          },
        },
        tasks: true,
        users: { select: { id: true, name: true, email: true } }, // ← Relación a user
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout no encontrado');
    }

    return workout;
  }

  // Marcar workout como completado
  async completeWorkout(workoutId: number, userId: number) {
    const workout = await this.getWorkout(workoutId);

    if (workout.user_id !== userId) {
      throw new ForbiddenException('No puedes marcar este workout');
    }

    // Marca todas las tareas como completadas
    await this.prisma.tasks.updateMany({
      where: { workout_id: workoutId },
      data: { completed: true, completed_at: new Date() },
    });

    return this.prisma.workouts.update({
      where: { id: workoutId },
      data: { completed: true, completed_at: new Date() },
      include: {
        comments: {
          include: {
            users: { select: { id: true, name: true, email: true } }, // ← Cambio: user → users
          },
        },
        tasks: true,
      },
    });
  }

  // Eliminar workout
  async deleteWorkout(workoutId: number, userId: number) {
    const workout = await this.getWorkout(workoutId);

    if (workout.user_id !== userId) {
      throw new ForbiddenException('No puedes eliminar este workout');
    }

    return this.prisma.workouts.delete({ where: { id: workoutId } });
  }
}