import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Share2, TrendingUp, ChevronDown, MapPin, Building2, Heart, Sparkles, QrCode, Phone, Mail, CheckCircle, Zap, Rocket, Globe, Calendar, Handshake, X, Crown, BookOpen, MessageCircle, Trophy } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useScrollReveal } from '@lark-apaas/client-toolkit/hooks/useScrollReveal';
import { capabilityClient } from '@lark-apaas/client-toolkit';
import { logger } from '@lark-apaas/client-toolkit/logger';



// 会员数据接口
interface IMember {
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

// 核心价值数据
const coreValues = [
  {
    icon: Rocket,
    title: 'Study',
    subtitle: '学习成长',
    description: '前沿洞察、CXO闭门课、AI行业沙龙、名企游学、CXO实战营，助力持续突破',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Globe,
    title: 'Social',
    subtitle: '价值社交',
    description: '原点同学见面日、闭门私董会、AI行业交流领袖晚宴，链接同频伙伴',
    color: 'from-violet-500 to-purple-400'
  },
  {
    icon: Zap,
    title: 'Sale',
    subtitle: '商业链接',
    description: '投资人见面会、商机对接会、AI产品SHOW、企业家主讲，共创商业价值',
    color: 'from-amber-500 to-orange-400'
  }
];

// 入会流程
const joinSteps = [
  { step: 1, title: '扫码申请', desc: '填写入会申请表' },
  { step: 2, title: '入会审核', desc: '原点同学会审核' },
  { step: 3, title: '权益确认', desc: '签署会员服务协议' },
  { step: 4, title: '正式入会', desc: '创建会员专属海报&加入社群' }
];

const HomePage: React.FC = () => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 滚动到指定锚点
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 获取会员数据
  const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await capabilityClient
          .load('3s_member_list_query')
          .call<{
            records: Array<{
              id: string;
              record: {
                '序号'?: { text: string };
                '会员姓名'?: { text: string };
                '附件'?: Array<{ tmpUrl: string; name: string; size: number; type: string }>;
                '个人简介'?: { text: string };
                '企业'?: { text: string };
                '职级'?: { text: string };
                '公司简介'?: { text: string };
                '兴趣爱好'?: string[];
                '家乡'?: string;
                '公司所属行业'?: { text: string };
                '偏好的活动类型'?: string;
                '入会核心需求'?: { text: string };
                '希望合作方向'?: { text: string };
                '我能提供的资源'?: { text: string };
              };
            }>;
            hasMore: boolean;
            total: number;
          }>('searchRecords', {
            pageSize: 500
          });
        
        logger.info('Members response:', response);
        
        if (response.records && response.records.length > 0) {
          // 按序号排序展示会员
          const formattedMembers: IMember[] = response.records.map((item) => ({
            id: item.id,
            sortOrder: parseInt(item.record['序号']?.text || '9999', 10),
            name: item.record['会员姓名']?.text || '未知',
            avatar: item.record['附件']?.[0]?.tmpUrl || '',
            bio: item.record['个人简介']?.text || '',
            company: item.record['企业']?.text || '',
            position: item.record['职级']?.text || '',
            companyIntro: item.record['公司简介']?.text || '',
            hobbies: item.record['兴趣爱好'] || [],
            hometown: item.record['家乡'] || '',
            industry: item.record['公司所属行业']?.text || '',
            preferredActivity: item.record['偏好的活动类型'] || '',
            joinReason: item.record['入会核心需求']?.text || '',
            cooperationDirection: item.record['希望合作方向']?.text || '',
            resources: item.record['我能提供的资源']?.text || ''
          })).sort((a, b) => a.sortOrder - b.sortOrder);
          
          logger.info('Formatted members:', formattedMembers.length);
          setMembers(formattedMembers);
        } else {
          logger.info('No records found');
          setMembers([]);
        }
      } catch (err) {
        logger.error('Failed to fetch members:', err);
        setError('数据加载失败，请稍后重试');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

  // 页面加载时自动获取数据
  useEffect(() => {
    fetchMembers();
    fetchActivityMoments();
  }, []);

  // 活动实景数据
  const [activityMoments, setActivityMoments] = useState<Array<{
    id: string;
    activityName: string;
    photos: Array<{ name: string; tmpUrl: string; type: string }>;
  }>>([]);
  const [momentsLoading, setMomentsLoading] = useState(true);

  // 从飞书表格获取活动精彩瞬间
  const [momentsError, setMomentsError] = useState<string | null>(null);
  
  const fetchActivityMoments = async () => {
    try {
      setMomentsLoading(true);
      setMomentsError(null);
      const response = await capabilityClient
        .load('multi_table_manage_crud_agg_analysis_1')
        .call<{
          records: Array<{
            id: string;
            record: {
              '活动名称'?: { text: string };
              '精彩瞬间'?: Array<{ name: string; tmpUrl: string; type: string; size: number }>;
            };
          }>;
          hasMore: boolean;
          total: number;
        }>('searchRecords', {
          pageSize: 100
        });
      
      logger.info('Activity moments response:', response);
      
      if (response.records && response.records.length > 0) {
        // 活动名称映射替换
        const nameMapping: Record<string, string> = {
          '名企游学｜走进腾讯名企游学': '名企游学｜CEO/CTO走进大厂系列'
        };
        
        const formatted = response.records.map(item => ({
          id: item.id,
          activityName: nameMapping[item.record['活动名称']?.text || ''] || item.record['活动名称']?.text || '精彩活动',
          photos: item.record['精彩瞬间'] || []
        })).filter(item => item.photos.length > 0);
        
        setActivityMoments(formatted);
      }
    } catch (err: any) {
      logger.error('Failed to fetch activity moments:', err);
      // 判断错误类型，提供友好提示
      if (err.message?.includes('app not found')) {
        setMomentsError('活动数据暂时无法加载，请稍后重试');
      } else {
        setMomentsError('数据加载失败，请稍后重试');
      }
    } finally {
      setMomentsLoading(false);
    }
  };

  // 滚动显示动画
  useScrollReveal({ containerRef });

  return (
    <>
      <style jsx>{`
        .scroll-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        @media (min-width: 768px) {
          .scroll-reveal {
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          .scroll-reveal.animate-in {
            animation: fadeInUp 0.6s ease-out;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(265 89% 55%) 50%, hsl(199 89% 48%) 100%);
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }
        
        .member-card-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .member-card:hover .member-card-overlay {
          opacity: 1;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(265 89% 55%) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div ref={containerRef} className="w-full space-y-0">
        {/* Hero Section - 年轻化渐变背景 */}
        <section id="hero" className="w-full relative min-h-[600px] sm:min-h-[700px] flex items-center justify-center overflow-hidden bg-[hsl(210_40%_98%)]">
          <div className="absolute inset-0 hero-gradient opacity-10" />
          
          {/* 装饰性渐变圆 */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center px-4 sm:px-6 py-20 max-w-5xl mx-auto">
            <Badge variant="outline" className="mb-6 text-sm px-4 py-2 border-blue-500/30 text-blue-600 bg-blue-50/50 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              泛AI与科技领域创业者社区
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="gradient-text">原点</span>
              <span className="text-slate-800">同学会</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed font-light">Study · Social · Sale</p>
            
            <p className="text-base sm:text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              汇聚创业者、创始人、CXO，共建高质量商业生态圈
              <br className="hidden sm:block" />
              链接能看懂未来、共创生意的同行者与合伙人
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 font-semibold px-8 shadow-lg shadow-blue-500/25 border-0"
                onClick={() => scrollToSection('about')}
              >
                探索社区
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-100 px-8"
                onClick={() => scrollToSection('join')}
              >
                立即加入
              </Button>
            </div>
          </div>
          
          <div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 float-animation cursor-pointer"
            onClick={() => scrollToSection('about')}
          >
            <ChevronDown className="w-8 h-8 text-slate-400" />
          </div>
        </section>

        {/* About Section - 清爽留白 */}
        <section id="about" className="w-full py-16 md:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50/50">
                关于我们
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                构建<span className="gradient-text">AI创业</span>生态圈
              </h2>
              <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
                原点同学会是以原点学堂为根基的创业社区，专注于泛AI与科技领域创始人、董监高、CXO的学习成长与价值链接
              </p>
            </div>
            
            {/* 核心价值卡片 - 精简版 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {coreValues.map((value, index) => (
                <Card 
                  key={index} 
                  className="card-hover border-0 shadow-lg shadow-slate-200/40 bg-white overflow-hidden group"
                >
                  <CardContent className="p-5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <value.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="mb-2">
                      <span className="text-xl font-bold gradient-text">{value.title}</span>
                      <span className="text-base text-slate-600 ml-2">{value.subtitle}</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* 活动场景 - 现代卡片 */}
            <div className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-slate-300/50">
              <img
                src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/af2b7fee-af2f-4852-8eb7-4fc36fe90744/raw"
                alt="企业家交流场景"
                className="w-full h-[300px] md:h-[450px] object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent flex items-center">
                <div className="p-8 md:p-16 max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    丰富的社区活动
                  </h3>
                  <ul className="space-y-4 text-white/80">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                      <span>专题培训 · CXO名企游学 · 行业交流沙龙</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400" />
                      <span>社交链接 ·  会员见面日 · AI领袖交流晚宴</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
                      <span>商机对接 · 产品发布会 · 闭门私董会</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 活动实景展示 - 从飞书表格获取 */}
            {activityMoments.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full" />
                  <h3 className="text-xl font-bold text-slate-800">活动精彩瞬间</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{activityMoments.length} 场活动实拍</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                  {activityMoments.slice(0, 6).map((moment, mIndex) => (
                    <div key={moment.id} className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                      <div className="flex items-start gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-base font-semibold text-slate-800 block leading-tight">{moment.activityName}</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full shrink-0">{moment.photos.length} 张</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {moment.photos.slice(0, 4).map((photo, idx) => (
                          <div 
                            key={idx} 
                            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                          >
                            <Image
                              src={photo.tmpUrl}
                              alt={`${moment.activityName} - ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                            {idx === 3 && moment.photos.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-base font-semibold">
                                +{moment.photos.length - 4}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {momentsLoading && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-5">
                  <Skeleton className="w-1.5 h-7" />
                  <Skeleton className="h-7 w-36" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Skeleton className="w-7 h-7 rounded-lg" />
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-12 ml-auto" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <Skeleton key={j} className="aspect-square rounded-lg" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {momentsError && !momentsLoading && (
              <div className="mt-10 text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-400 text-sm">{momentsError}</p>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section - 会员权益 */}
        <section id="benefits" className="w-full py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50/50">
                会员权益
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                六大<span className="gradient-text">专属权益</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                加入原点同学会，解锁稀缺创业资源与服务
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 权益一 */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-50/80 to-violet-50/80 border border-blue-100 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  <span className="text-blue-600">权益一</span>「超级组织人脉圈100+董监高」
                </h4>
                <p className="text-sm text-slate-600 mb-2 font-medium">一张超级组织人脉圈入场券，跻身百位AI领域董监高精英圈层</p>
                <p className="text-xs text-slate-500 leading-relaxed">我们汇聚AI产业链上下游企业核心决策者，从技术研发、产品落地、市场推广到资本对接，行业集聚效应显著，链接产业创新力量。</p>
              </div>

              {/* 权益二 */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-50/80 to-purple-50/80 border border-violet-100 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  <span className="text-violet-600">权益二</span>「年度50+场高质量活动」
                </h4>
                <p className="text-sm text-slate-600 mb-2 font-medium">来这里寻合作、找搭子、聊技术、共学习</p>
                <p className="text-xs text-slate-500 leading-relaxed">企业家同学会全年举办50+场活动，从学习交流到资源对接，从技术切磋到合作落地。在这里，寻合作、找搭子、聊技术、共成长，让成长不停歇，让商机不期而遇。</p>
              </div>

              {/* 权益三 */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-cyan-100 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  <span className="text-cyan-600">权益三</span>「商机精准对接·合作高效促成」
                </h4>
                <p className="text-sm text-slate-600 mb-2 font-medium">全年CXO商机对接会常态化举办，真实订单需求实时发布</p>
                <p className="text-xs text-slate-500 leading-relaxed">全程为你精准匹配资源、链接商机，让企业的产品与服务找到合适的落地场景，让商业合作更高效。</p>
              </div>

              {/* 权益四 */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-100 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  <span className="text-amber-600">权益四</span>「产品推广赋能·业务增长加速」
                </h4>
                <p className="text-sm text-slate-600 mb-2 font-medium">线上/下多渠道产品曝光，加速业务发展</p>
                <p className="text-xs text-slate-500 leading-relaxed">线上多渠道品牌曝光，为会员企业打造专属宣传阵地；线下每季度举办产品发布会，为企业产品推广、品牌升级提供优质平台，助力企业业务快速增长。</p>
              </div>

              {/* 权益五 */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-100 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  <span className="text-emerald-600">权益五</span>「创业服务加持+五道口自由办公」
                </h4>
                <p className="text-sm text-slate-600 mb-2 font-medium">解锁稀缺创业权益服务包，为创业之路保驾护航</p>
                <p className="text-xs text-slate-500 leading-relaxed">坐拥五道口黄金自由座办公空间，会客区、日咖夜酒供应等配套齐全，享注册地址使用等，为创业之路保驾护航。</p>
              </div>

              {/* 权益六 */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-rose-50/80 to-pink-50/80 border border-rose-100 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-rose-500/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  <span className="text-rose-600">权益六</span>「融资需求对接·资本直链赋能」
                </h4>
                <p className="text-sm text-slate-600 mb-2 font-medium">全程护航企业融资发展，为创业项目注入强动力</p>
                <p className="text-xs text-slate-500 leading-relaxed">集聚专业投资人导师，为会员企业直链10+优质投资机构，从融资咨询到资本对接，全程助力企业解决融资难题，为创业项目注入资本活水。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Tiers Section - 加入同学会专属席位 */}
        <section id="tiers" className="w-full py-16 md:py-20 bg-gradient-to-br from-cyan-50/30 via-white to-rose-50/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cyan-200/60 shadow-sm mb-6">
                <span className="text-lg">🎫</span>
                <span className="text-cyan-600 text-sm font-medium">专属席位</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                选择你的<span className="bg-gradient-to-r from-cyan-500 to-rose-400 bg-clip-text text-transparent">加入方式</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-base">
                无论你是刚起步的探索者，还是寻求突破的创业者，这里都有适合你的位置
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 席位一：365成长会员 */}
              <div className="group relative rounded-3xl p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/50 overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-2xl -translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative">
                  {/* 标签 */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-xs font-semibold mb-6">
                    <span>🚀</span>
                    新手入门
                  </div>
                  
                  {/* 标题区 */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">365 成长会员</h3>
                  <p className="text-slate-400 text-sm mb-6">专为初创探索者打造，零审核门槛，一键开通即刻使用</p>
                  
                  {/* 价格 */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-slate-400 text-lg">¥</span>
                    <span className="text-5xl font-bold text-slate-800">365</span>
                    <span className="text-slate-400 text-sm ml-1">/年</span>
                  </div>

                  {/* 权益列表 */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-emerald-100/50">
                      <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm font-medium">通行认证</p>
                        <p className="text-slate-400 text-xs mt-0.5">全量解锁学堂基础学习资源，随心学习</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-emerald-100/50">
                      <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm font-medium">优先参与活动</p>
                        <p className="text-slate-400 text-xs mt-0.5">优先参与学堂各类公开活动（活动报名费需自理）</p>
                      </div>
                    </div>
                  </div>

                  {/* 按钮 */}
                  <Button 
                    className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-lg shadow-emerald-300/30 transition-all hover:shadow-xl hover:shadow-emerald-300/40"
                    onClick={() => scrollToSection('join')}
                  >
                    立即开通 🌟
                  </Button>
                </div>
              </div>

              {/* 席位二：创业0-1认证会员 */}
              <div className="group relative rounded-3xl p-8 bg-white border border-cyan-100 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100/50 overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-100/60 to-teal-100/60 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative">
                  {/* 标签 */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-white text-xs font-semibold mb-6">
                    <span>🚀</span>
                    成长加速
                  </div>
                  
                  {/* 标题区 */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">创业 0-1 认证会员</h3>
                  <p className="text-slate-400 text-sm mb-6">面向企业核心高管、OPC 青年创业者（需身份审核）</p>
                  
                  {/* 价格 */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-slate-400 text-lg">¥</span>
                    <span className="text-5xl font-bold text-slate-800">399</span>
                    <span className="text-slate-400 text-sm ml-1">/年</span>
                  </div>

                  {/* 权益列表 */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50/50 border border-cyan-100/50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center shrink-0 shadow-sm">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm font-medium">享365会员权益</p>
                        <p className="text-slate-400 text-xs mt-0.5">全量解锁学堂基础学习资源</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50/50 border border-cyan-100/50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center shrink-0 shadow-sm">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm font-medium">专属会员社区深度服务</p>
                        <p className="text-slate-400 text-xs mt-0.5">进入专属社群，获取深度资源链接</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50/50 border border-cyan-100/50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center shrink-0 shadow-sm">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm font-medium">企业家同学会专享活动</p>
                        <p className="text-slate-400 text-xs mt-0.5">含闭门私享类活动，深度交流</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50/50 border border-cyan-100/50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center shrink-0 shadow-sm">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm font-medium">免费参与精品课程/活动</p>
                        <p className="text-slate-400 text-xs mt-0.5">不定期举办，部分稀缺名额需限时抢占</p>
                      </div>
                    </div>
                  </div>

                  {/* 按钮 */}
                  <Button 
                    className="w-full h-11 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors"
                    onClick={() => scrollToSection('join')}
                  >开启认证 🎯</Button>
                </div>
              </div>

              {/* 席位三：企业家Plus会员 */}
              <div className="group relative rounded-3xl p-8 bg-gradient-to-br from-rose-50 to-violet-50 border border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-xl hover:shadow-rose-100/50 overflow-hidden">
                {/* 推荐标签 */}
                <div className="absolute top-4 right-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-rose-400 to-violet-400 text-white text-xs font-semibold shadow-lg shadow-rose-300/30">
                    <span>⭐</span>
                    人气之选
                  </div>
                </div>
                
                {/* 背景装饰 */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-rose-200/40 to-violet-200/40 rounded-full blur-2xl -translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative">
                  {/* 标签 */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-400 to-violet-400 text-white text-xs font-semibold mb-6">
                    <Crown className="w-3 h-3" />
                    深度链接
                  </div>
                  
                  {/* 标题区 */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">企业家 Plus 会员</h3>
                  <p className="text-slate-400 text-sm mb-6">适合寻求突破与链接的你</p>
                  
                  {/* 价格 */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-slate-400 text-lg">¥</span>
                    <span className="text-5xl font-bold text-slate-800">8999</span>
                    <span className="text-slate-400 text-sm ml-1">/年</span>
                  </div>

                  {/* 权益列表 - 滚动区域 */}
                  <div className="space-y-2.5 mb-8 max-h-[200px] overflow-y-auto pr-1">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-rose-400 text-sm">👔</span>
                      <span className="text-slate-600 text-sm">两名高管入会</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-rose-400 text-sm">✦</span>
                      <span className="text-slate-600 text-sm">创业 0-1 全部权益</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-violet-400 text-sm">✦</span>
                      <span className="text-slate-600 text-sm">全年 50+ 场活动免费参与</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-rose-400 text-sm">✦</span>
                      <span className="text-slate-600 text-sm">超级组织人脉圈 100+ 董监高链接</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-violet-400 text-sm">✦</span>
                      <span className="text-slate-600 text-sm">商机对接会 + 融资直链资本</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-rose-400 text-sm">✦</span>
                      <span className="text-slate-600 text-sm">稀缺权益：公司注册+自由办公+免费咖啡</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 border border-rose-100">
                      <span className="text-violet-400 text-sm">✦</span>
                      <span className="text-slate-600 text-sm">产品推广赋能+品牌曝光</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gradient-to-r from-rose-50 to-violet-50 border border-rose-200">
                      <span className="text-rose-500 text-sm">🎁</span>
                      <span className="text-slate-700 text-sm font-medium">附赠：OPC创业加速服务包</span>
                    </div>
                  </div>

                  {/* 按钮 */}
                  <Button 
                    className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-rose-400 to-violet-400 hover:from-rose-500 hover:to-violet-500 text-white rounded-full shadow-lg shadow-rose-300/30 transition-all hover:shadow-xl hover:shadow-rose-300/40"
                    onClick={() => scrollToSection('join')}
                  >
                    开启深度链接 🚀
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Members Section - 清爽网格 */}
        <section id="members" className="w-full py-16 md:py-20 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50/50">
                会员风采
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                优秀<span className="gradient-text">创业伙伴</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                汇聚各领域杰出创业者，共筑商业生态圈
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full mx-auto mb-3" />
                      <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mx-auto mb-2" />
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-slate-500">
                <p>{error}</p>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>暂无会员数据</p>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {members.slice(0, 20).map((member, index) => (
                  <Card 
                    key={member.id} 
                    className="card-hover overflow-hidden member-card border-0 shadow-lg shadow-slate-200/50 bg-white"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="relative mb-2 sm:mb-3 lg:mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-violet-100 ring-2 sm:ring-4 ring-white shadow-md sm:shadow-lg">
                          {member.avatar ? (
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
                              <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-center mb-0.5 sm:mb-1 text-slate-800 truncate px-1">{member.name}</h3>
                      
                      {(member.company || member.position) && (
                        <p className="text-xs sm:text-sm text-slate-500 text-center mb-2 sm:mb-3 truncate px-1">
                          {member.position}{member.position && member.company ? ' · ' : ''}{member.company}
                        </p>
                      )}
                      
                      {member.industry && (
                        <div className="flex justify-center mb-2 sm:mb-3">
                          <Badge variant="secondary" className="text-[10px] sm:text-xs bg-blue-50 text-blue-600 border-0 px-1.5 py-0">
                            <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                            <span className="truncate max-w-[100px] sm:max-w-[160px]">{member.industry}</span>
                          </Badge>
                        </div>
                      )}
                      
                      {member.bio && (
                        <p className="text-xs sm:text-sm text-slate-400 text-center line-clamp-2 mb-2 sm:mb-3 px-1">
                          {member.bio}
                        </p>
                      )}
                      
                      {(member.hobbies?.length || member.hometown) && (
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
                          {member.hometown && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs border-slate-200 text-slate-500 px-1 py-0">
                              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
                              <span className="truncate max-w-[40px] sm:max-w-[50px]">{member.hometown}</span>
                            </Badge>
                          )}
                          {member.hobbies?.slice(0, 1).map((hobby, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] sm:text-xs border-slate-200 text-slate-500 px-1 py-0">
                              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
                              <span className="truncate max-w-[40px] sm:max-w-[50px]">{hobby}</span>
                            </Badge>
                          ))}
                          {member.hobbies && member.hobbies.length > 1 && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs border-slate-200 text-slate-500 px-1 py-0">
                              +{member.hobbies.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* 更多会员提示 */}
              <div className="text-center mt-8">
                <p className="text-lg text-slate-500 font-medium">
                  等同学会成员<span className="text-blue-600 font-bold text-xl">150+</span>
                </p>
              </div>
              </>
            )}
          </div>
        </section>

        {/* Join Section - 清爽现代 */}
        <section id="join" className="w-full py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50/50">
                加入我们
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                开启你的<span className="gradient-text">创业之旅</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                扫码申请加入原点同学会，与优秀创业者同行
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-lg">
                    <Image
                      src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/eb6a9131-6e57-490d-a13b-4a52d3707d6b/raw"
                      alt="入会申请二维码"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-center text-sm text-slate-500">
                    扫码填写入会申请表
                  </p>
                </div>
              </div>
              
              {/* Steps & Contact */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-slate-800">入会流程</h3>
                  <div className="space-y-4">
                    {joinSteps.map((item) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                          <span className="text-sm font-semibold text-white">{item.step}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{item.title}</h4>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">联系我们</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-500" />
                      </div>
                      <span>15734067786</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-violet-500" />
                      </div>
                      <span>lmz@dsbz.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 bg-slate-50 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 原点同学会 · 专注泛AI与科技领域创业者社区
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
