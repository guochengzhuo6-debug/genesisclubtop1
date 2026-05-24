/**
 * 前后端共享类型定义
 * 前端和后端都从此文件导入类型，确保类型一致
 */

// ==================== 活动照片模块 ====================

export interface ActivityPhoto {
  id: string;
  category: 'Study' | 'Social' | 'Sale';
  title?: string;
  photoUrl: string;
  displayOrder: number;
}

export interface ActivityPhotoListResp {
  Study: { title: string; photos: ActivityPhoto[] };
  Social: { title: string; photos: ActivityPhoto[] };
  Sale: { title: string; photos: ActivityPhoto[] };
}

export interface CreateActivityPhotoReq {
  category: 'Study' | 'Social' | 'Sale';
  title?: string;
  photoUrl: string;
  displayOrder?: number;
}

export interface UpdateActivityPhotoReq {
  title?: string;
  photoUrl?: string;
  displayOrder?: number;
}

// ==================== 会员模块 ====================

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  company?: string;
  position?: string;
  companyIntro?: string;
  hobbies?: string[];
  hometown?: string;
  industry?: string;
  preferredActivity?: string;
  joinReason?: string;
  cooperationDirection?: string;
  resources?: string;
}

export interface MemberListResp {
  items: Member[];
  total: number;
}
