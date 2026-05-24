// ---- plugin:multi_table_manage_crud_agg_analysis_1 ----
// ============================================================
// 插件 multi_table_manage_crud_agg_analysis_1 (活动精彩瞬间) 的类型定义
// 由 get_plugin_ai_json 自动生成
// ============================================================

export interface MultiTableManageCrudAggAnalysisOneInput {
  /** 分页大小，最大值为 500 */
  pageSize?: number;
  /** 指定返回的字段名称列表，如果不填默认返回所有字段 */
  fieldNames?: string[];
  /** 排序条件列表，支持多重排序 */
  sort?: {
    fieldName: string;
    desc: boolean;
  }[];
  /** 筛选条件,严格参考“筛选条件说明”填写 */
  filter?: {
    conditions: {
      value: string[];
      fieldName: string;
      operator: string;
    }[];
    conjunction: string;
  };
  /** 分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 pageToken */
  pageToken?: string;
}

/**
 * capabilityClient.load('multi_table_manage_crud_agg_analysis_1').call<MultiTableManageCrudAggAnalysisOneOutput>('searchRecords', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { records, hasMore, pageToken, ... } = result;
 */
export interface MultiTableManageCrudAggAnalysisOneOutput {
  /** 记录列表 */
  records: {
    id: string;
    record: {
      '活动名称': {
        text: string;
      };
      '精彩瞬间': {
        size: number;
        tmpUrl: string;
        type: string;
        name: string;
      }[];
    };
  }[];
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 下一页的分页标记 */
  pageToken?: string;
  /** 总记录数 */
  total?: number;
}
// ---- end:multi_table_manage_crud_agg_analysis_1 ----

// ---- plugin:3s_member_list_query ----
// ============================================================
// 插件 3s_member_list_query (3S企业家Club会员列表查询) 的类型定义
// 由 get_plugin_ai_json 自动生成
// ============================================================

export interface S3MemberListQueryInput {
  /** 分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 pageToken */
  pageToken?: string;
  /** 分页大小，最大值为 500 */
  pageSize?: number;
  /** 指定返回的字段名称列表，如果不填默认返回所有字段 */
  fieldNames?: string[];
  /** 排序条件列表，支持多重排序 */
  sort?: {
    fieldName: string;
    desc: boolean;
  }[];
  /** 筛选条件,严格参考“筛选条件说明”填写 */
  filter?: {
    conjunction: string;
    conditions: {
      value: string[];
      fieldName: string;
      operator: string;
    }[];
  };
}

/**
 * capabilityClient.load('3s_member_list_query').call<S3MemberListQueryOutput>('searchRecords', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { hasMore, pageToken, total, ... } = result;
 */
export interface S3MemberListQueryOutput {
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 下一页的分页标记 */
  pageToken?: string;
  /** 总记录数 */
  total?: number;
  /** 记录列表 */
  records: {
    id: string;
    record: {
      '公司简介': unknown;
      '个人简介': unknown;
      '企业': unknown;
      '职级': unknown;
      '兴趣爱好': string[];
      '公司所属行业': unknown;
      '偏好的活动类型': string;
      '希望合作方向': unknown;
      '序号': {
        text: string;
      };
      '附件': {
        tmpUrl: string;
        type: string;
        name: string;
        size: number;
      }[];
      '家乡': string;
      '入会核心需求': unknown;
      '我能提供的资源': unknown;
      '会员姓名': unknown;
    };
  }[];
}
// ---- end:3s_member_list_query ----