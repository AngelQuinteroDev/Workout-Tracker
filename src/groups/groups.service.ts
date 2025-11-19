
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  // Crear grupo
  async createGroup(
    data: { name: string; description?: string },
    userId: number
  ) {
    const group = await this.prisma.groups.create({
      data: {
        name: data.name,
        description: data.description,
        created_by: userId,
      },
    });

    // El creador es automáticamente admin
    await this.prisma.group_members.create({
      data: {
        user_id: userId,
        group_id: group.id,
        role: 'admin',
      },
    });

    return group;
  }

  // Obtener mis grupos
  async getUserGroups(userId: number) {
    return this.prisma.group_members.findMany({
      where: { user_id: userId },
      include: {
        groups: true,
      },
    });
  }

  // Obtener miembros del grupo
  async getGroupMembers(groupId: number) {
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return this.prisma.group_members.findMany({
      where: { group_id: groupId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ role: 'desc' }, { joined_at: 'asc' }],
    });
  }

  // Obtener detalles completos del grupo
  async getGroupDetail(groupId: number, userId: number) {
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
      include: {
        group_members: {
          include: {
            users: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    // Verificar que el usuario es miembro
    const isMember = group.group_members.some((m) => m.user_id === userId);
    if (!isMember) {
      throw new ForbiddenException('No eres miembro de este grupo');
    }

    // Obtener si el usuario es admin
    const userMember = group.group_members.find((m) => m.user_id === userId);

    return {
      ...group,
      currentUserRole: userMember?.role,
      isAdmin: userMember?.role === 'admin',
      isCreator: group.created_by === userId,
    };
  }

  // Ver si es admin del grupo
  async isGroupAdmin(userId: number, groupId: number): Promise<boolean> {
    const member = await this.prisma.group_members.findUnique({
      where: { user_id_group_id: { user_id: userId, group_id: groupId } },
    });
    return member?.role === 'admin';
  }

  // Cambiar rol de miembro
  async changeMemberRole(
    groupId: number,
    userIdToChange: number,
    newRole: string,
    actorId: number
  ) {
    const isAdmin = await this.isGroupAdmin(actorId, groupId);
    if (!isAdmin) {
      throw new ForbiddenException('Solo admins pueden cambiar roles');
    }

    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (group?.created_by === userIdToChange) {
      throw new ForbiddenException('No puedes cambiar el rol del creador');
    }

    return this.prisma.group_members.update({
      where: { user_id_group_id: { user_id: userIdToChange, group_id: groupId } },
      data: { role: newRole },
      include: { users: true },
    });
  }

  // Eliminar miembro del grupo
  async removeMemberFromGroup(groupId: number, userIdToRemove: number, actorId: number) {
    const isAdmin = await this.isGroupAdmin(actorId, groupId);
    if (!isAdmin) {
      throw new ForbiddenException('Solo admins pueden eliminar miembros');
    }

    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (group?.created_by === userIdToRemove) {
      throw new ForbiddenException('No puedes eliminar al creador');
    }

    return this.prisma.group_members.delete({
      where: { user_id_group_id: { user_id: userIdToRemove, group_id: groupId } },
    });
  }

  // Dejar grupo
  async leaveGroup(groupId: number, userId: number) {
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (group?.created_by === userId) {
      throw new ForbiddenException('El creador no puede dejar el grupo. Elimina el grupo en su lugar.');
    }

    return this.prisma.group_members.delete({
      where: { user_id_group_id: { user_id: userId, group_id: groupId } },
    });
  }

  // Eliminar grupo (solo creador)
  async deleteGroup(groupId: number, userId: number) {
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    if (group.created_by !== userId) {
      throw new ForbiddenException('Solo el creador puede eliminar el grupo');
    }

    return this.prisma.groups.delete({ where: { id: groupId } });
  }

  // Obtener workouts del grupo
  async getGroupWorkouts(groupId: number) {
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return this.prisma.workouts.findMany({
      where: { group_id: groupId },
      include: {
        users: { select: { id: true, name: true } },
        tasks: true,
        comments: { include: { users: { select: { id: true, name: true } } } },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}