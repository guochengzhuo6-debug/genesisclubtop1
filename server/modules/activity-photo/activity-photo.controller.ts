import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NeedLogin } from '@lark-apaas/fullstack-nestjs-core';
import { ActivityPhotoService } from './activity-photo.service';
import type { ActivityPhotoListResp, ActivityPhoto, CreateActivityPhotoReq, UpdateActivityPhotoReq } from '@shared/api.interface';

@Controller('api/activity-photos')
export class ActivityPhotoController {
  constructor(private readonly activityPhotoService: ActivityPhotoService) {}

  /**
   * 获取所有活动照片（按分类分组）
   */
  @Get()
  async findAll(): Promise<ActivityPhotoListResp> {
    return this.activityPhotoService.findAll();
  }

  /**
   * 获取单个活动照片详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActivityPhoto> {
    return this.activityPhotoService.findOne(id);
  }

  /**
   * 创建活动照片
   */
  @NeedLogin()
  @Post()
  async create(@Body() data: CreateActivityPhotoReq): Promise<ActivityPhoto> {
    return this.activityPhotoService.create(data);
  }

  /**
   * 更新活动照片
   */
  @NeedLogin()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateActivityPhotoReq,
  ): Promise<ActivityPhoto> {
    return this.activityPhotoService.update(id, data);
  }

  /**
   * 删除活动照片
   */
  @NeedLogin()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.activityPhotoService.remove(id);
    return { success: true };
  }
}
