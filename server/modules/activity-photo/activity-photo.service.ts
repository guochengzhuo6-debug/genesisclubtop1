import { Injectable } from '@nestjs/common';
import type { ActivityPhoto, ActivityPhotoListResp, CreateActivityPhotoReq, UpdateActivityPhotoReq } from '@shared/api.interface';

@Injectable()
export class ActivityPhotoService {
  constructor() {}

  /**
   * 获取所有活动照片，按分类分组
   */
  async findAll(): Promise<ActivityPhotoListResp> {
    const result: ActivityPhotoListResp = {
      Study: { title: '学习成长 · 精彩活动', photos: [] },
      Social: { title: '价值社交 · 精彩活动', photos: [] },
      Sale: { title: '商业链接 · 精彩活动', photos: [] },
    };

    return result;
  }

  /**
   * 根据ID获取活动照片
   */
  async findOne(id: string): Promise<ActivityPhoto> {
    throw new Error('Not implemented');
  }

  /**
   * 创建活动照片
   */
  async create(data: CreateActivityPhotoReq): Promise<ActivityPhoto> {
    throw new Error('Not implemented');
  }

  /**
   * 更新活动照片
   */
  async update(id: string, data: UpdateActivityPhotoReq): Promise<ActivityPhoto> {
    throw new Error('Not implemented');
  }

  /**
   * 删除活动照片
   */
  async remove(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
