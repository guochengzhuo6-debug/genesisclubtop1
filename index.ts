import { logger } from '@lark-apaas/client-toolkit/logger';
import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type { ActivityPhotoListResp, ActivityPhoto, CreateActivityPhotoReq, UpdateActivityPhotoReq } from '@shared/api.interface';

/**
 * 获取所有活动照片（按分类分组）
 */
export async function getActivityPhotos(): Promise<ActivityPhotoListResp> {
  try {
    const response = await axiosForBackend<ActivityPhotoListResp>({
      url: '/api/activity-photos',
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    logger.error('获取活动照片失败', error);
    throw error;
  }
}

/**
 * 获取单个活动照片详情
 */
export async function getActivityPhoto(id: string): Promise<ActivityPhoto> {
  try {
    const response = await axiosForBackend<ActivityPhoto>({
      url: `/api/activity-photos/${id}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    logger.error('获取活动照片详情失败', error);
    throw error;
  }
}

/**
 * 创建活动照片
 */
export async function createActivityPhoto(data: CreateActivityPhotoReq): Promise<ActivityPhoto> {
  try {
    const response = await axiosForBackend<ActivityPhoto>({
      url: '/api/activity-photos',
      method: 'POST',
      data
    });
    return response.data;
  } catch (error) {
    logger.error('创建活动照片失败', error);
    throw error;
  }
}

/**
 * 更新活动照片
 */
export async function updateActivityPhoto(id: string, data: UpdateActivityPhotoReq): Promise<ActivityPhoto> {
  try {
    const response = await axiosForBackend<ActivityPhoto>({
      url: `/api/activity-photos/${id}`,
      method: 'PUT',
      data
    });
    return response.data;
  } catch (error) {
    logger.error('更新活动照片失败', error);
    throw error;
  }
}

/**
 * 删除活动照片
 */
export async function deleteActivityPhoto(id: string): Promise<{ success: boolean }> {
  try {
    const response = await axiosForBackend<{ success: boolean }>({
      url: `/api/activity-photos/${id}`,
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    logger.error('删除活动照片失败', error);
    throw error;
  }
}
