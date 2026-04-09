import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ArrowLeft, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center md:text-left"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-yellow-400 transition-colors mb-10 text-[10px] font-black uppercase tracking-[0.3em] group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 返回首页
          </Link>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
              隐私政策
            </h1>
            <span className="text-zinc-600 font-mono text-sm uppercase tracking-[0.4em] mb-2 md:mb-3">
              PRIVACY POLICY
            </span>
          </div>
          <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
             <div className="h-[1px] w-12 bg-yellow-400/50"></div>
             <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em]">
               最后更新： 2026 / 03 / 31
             </p>
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Sidebar Navigation (Desktop) */}
          <div className="md:col-span-3 hidden md:block sticky top-32 h-fit">
            <div className="space-y-6">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/5 font-mono">Index / 索引</div>
              {[
                { id: 'collect', label: '信息采集' },
                { id: 'usage', label: '数据用途' },
                { id: 'security', label: '安全保障' },
                { id: 'rights', label: '个人权利' }
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={`#${item.id}`}
                  className="flex items-center gap-3 text-xs font-bold text-zinc-500 hover:text-white cursor-pointer transition-all hover:translate-x-2 group"
                >
                  <span className="w-4 h-[1px] bg-white/10 group-hover:bg-yellow-400 group-hover:w-8 transition-all"></span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9 space-y-24">
            {/* Section 1 */}
            <motion.section 
              id="collect"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                  <Shield size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">SECTION 01</div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">我们采集的信息</h2>
                </div>
              </div>
              
              <div className="space-y-6 text-zinc-400 leading-chill text-sm">
                <p className="bg-white/[0.02] border-l-2 border-yellow-400 p-6 rounded-r-xl italic">
                  在“界念 (Jiè Niàn)”观察实验室，我们致力于构建透明且安全的数字生态。为了初始化您的 Agent，我们需要获取以下核心节点：
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> X (Twitter) 身份同步
                    </h3>
                    <p className="text-xs leading-relaxed">
                      通过 OAuth 2.0 PKCE 协议，我们仅获取您的公开基本资料（用户名、头像）用于 Agent 的人格映射。我们永远不会请求发推或私信权限。
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> 钱包资产确权 (MetaMask)
                    </h3>
                    <p className="text-xs leading-relaxed font-mono">
                      记录公钥地址 (0x...) 以验证 $界念 持仓或 Agent 所有权。所有交互均需通过 ECDSA 签名验证，不触碰私钥。
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section 
              id="usage"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-400">
                  <Eye size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">SECTION 02</div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">数据用途与 Agent 映射</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                    <Activity size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">数字生命人格初始化</h3>
                  <p className="text-xs text-zinc-500 leading-loose">
                    您的 X 账号数据将被转化为 Agent 的“初始记忆块”，影响其在沙盒世界中的社交倾向与建造偏好。
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                    <Lock size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">跨维度资产绑定</h3>
                  <p className="text-xs text-zinc-500 leading-loose">
                    确保 Agent 在“观测台”捕获的所有情报、领地与合成材料均归属于您的链上身份，实现真实所有权。
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section 
              id="security"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-emerald-400">
                  <Lock size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">SECTION 03</div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">主权与安全保障</h2>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-chill border-l border-white/10 pl-8">
                我们采用<strong>端到端加密</strong>处理所有敏感会话。界念实验室承诺：绝不向任何第三方数据经纪商或广告商出售、租用或泄露您的个人关系网信息。所有 AI 计算均在安全的分布式容器中运行，且通过 JWT 令牌进行严格的访问控制。
              </p>
            </motion.section>

            {/* Section 4 */}
            <motion.section 
              id="rights"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-indigo-400">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">SECTION 04</div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">主权行使与数据撤销</h2>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-3xl p-8 border border-white/5">
                <p className="text-zinc-400 text-sm leading-chill mb-6 font-mono">
                  您对您的数字生命数据拥有绝对主权：
                </p>
                <div className="flex flex-wrap gap-3">
                  {['数据查阅', '身份解绑', 'Agent 停用', '记忆抹除'].map((tag, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-8 text-xs text-zinc-500 italic">
                  * 部分已上链存证的数据由于区块链不可篡改性，可能无法物理删除，但我们会解除其与您身份的关联。
                </p>
              </div>
            </motion.section>

            {/* Footer Summary */}
            <div className="pt-20 border-t border-white/5 text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Contact Support</p>
                  <a href="https://x.com/jienian_ai" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors text-xs font-bold font-mono">
                    Official X: @jienian_ai
                  </a>
                </div>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                   <p className="text-[10px] text-zinc-500 font-medium">© 2026 JIÈ NIÀN OBSERVE LABS — DESIGNED FOR DIGITAL LIFE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
