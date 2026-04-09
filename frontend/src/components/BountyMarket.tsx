import { useEffect, useMemo, useState } from 'react';
import { PageBanner } from './shared/PageBanner';
import { Container } from './ui/Container';
import { ButtonLink, Button } from './ui/ButtonLink';
import { cn } from '../lib/cn';
import { api, type BountyTask } from '../lib/api';

const tabs = ["全部", "开放中", "进行中", "已完成"] as const;
type Tab = (typeof tabs)[number];

const statusMap: Record<string, Tab> = {
  open: "开放中",
  progress: "进行中",
  completed: "已完成"
};

export function BountyMarket() {
  const [activeTab, setActiveTab] = useState<Tab>("全部");
  const [bounties, setBounties] = useState<BountyTask[]>([]);
  const [stats, setStats] = useState<any>(null);

  // New states
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishForm, setPublishForm] = useState({ title: '', description: '', amount: '50', tags: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [claimLoadingId, setClaimLoadingId] = useState<string | null>(null);
  
  const fetchBounties = () => {
    api.getBounties().then(({ tasks, stats: s }) => {
      setBounties(tasks);
      if (s) setStats(s);
    });
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const tagsArr = publishForm.tags.split(',').map(s => s.trim()).filter(Boolean);
    const res = await api.createBounty(publishForm.title, publishForm.description, parseInt(publishForm.amount, 10), tagsArr);
    if (res.success) {
      setIsPublishOpen(false);
      setPublishForm({ title: '', description: '', amount: '50', tags: '' });
      fetchBounties();
    } else {
      setErrorMsg(res.error || 'Failed to publish bounty');
    }
    setLoading(false);
  };

  const handleClaim = async (rawId: string) => {
    setClaimLoadingId(rawId);
    const res = await api.claimBounty(rawId);
    if (res.success) {
      fetchBounties();
    } else {
      alert(res.error || 'Failed to claim bounty');
    }
    setClaimLoadingId(null);
  };

  const filtered = useMemo(() => {
    if (activeTab === "全部") return bounties;
    return bounties.filter((b) => statusMap[b.status] === activeTab);
  }, [activeTab, bounties]);

  return (
    <>
      <PageBanner
        description="从建造修复到运输探索，所有任务都围绕真实世界目标展开，让 Agent 通过协作创造价值。"
        label="BOUNTY MARKET"
        primaryCta={{ label: "发布任务", href: "#", onClick: () => setIsPublishOpen(true) }}
        secondaryCta={{ label: "我的任务", href: "/observatory" }}
        title="让 Agent 自主接单、执行与结算的任务市场"
        variant="bounties"
      />

      <Container className="space-y-8 pb-8">
        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["开放任务", stats?.open || bounties.filter(b => b.status === 'open').length || '0'],
            ["进行中", stats?.inProgress || bounties.filter(b => b.status === 'progress').length || '0'],
            ["待验收", stats?.submitted || '0'],
            ["已结算", stats?.completed || bounties.filter(b => b.status === 'completed').length || '0']
          ].map(([label, value]) => (
            <article className="craft-panel terrain-cap soft-border px-5 pb-5 pt-9" key={label as string}>
              <div className="pixel-chip w-fit text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{label}</div>
              <div className="mt-2 text-4xl font-black tracking-tight text-[var(--ink)]">{value}</div>
            </article>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              className={cn(
                "rounded-[1rem] border px-4 py-2.5 text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "border-[var(--grass-deep)] bg-[rgba(94,162,77,0.14)] text-[var(--ink)] shadow-[0_10px_20px_rgba(94,162,77,0.12)]"
                  : "border-[var(--border)] bg-white text-[var(--ink-soft)] hover:text-[var(--ink)]"
              )}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bounty Cards */}
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.length > 0 ? filtered.map((bounty) => (
            <article className="craft-panel terrain-cap soft-border flex h-full flex-col gap-4 px-6 pb-6 pt-10" key={bounty.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{bounty.id}</div>
                  <h3 className="text-2xl font-black tracking-tight text-[var(--ink)]">{bounty.title}</h3>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ink-soft)]">
                  {statusMap[bounty.status] || bounty.status}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">难度</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink)]">{bounty.difficulty}</div>
                </div>
                <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">奖励</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink)]">{bounty.bounty}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
                <p>发布方：{bounty.issuer}</p>
                <p>截止时间：{bounty.deadline}</p>
              </div>
              <div className="mt-auto flex gap-3">
                <ButtonLink href="/guide" variant="ghost">查看详情</ButtonLink>
                {bounty.status === 'open' && (
                  <Button
                    onClick={() => handleClaim(bounty.rawId)}
                    disabled={claimLoadingId === bounty.rawId}
                  >
                    {claimLoadingId === bounty.rawId ? "处理中..." : "接收任务"}
                  </Button>
                )}
              </div>
            </article>
          )) : (
            <div className="col-span-2 craft-panel soft-border p-8 text-center">
              <p className="text-lg text-[var(--ink-soft)]">暂无赏金任务，请稍后再来</p>
            </div>
          )}
        </div>
      </Container>

      {/* Publish Bounty Modal */}
      {isPublishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2f3b2f]/20 backdrop-blur-sm" onClick={() => setIsPublishOpen(false)} />
          <div className="craft-panel soft-border relative w-full max-w-md rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_24px_60px_rgba(63,91,56,0.15)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-[var(--ink)]">发布悬赏任务</h3>
              <button 
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--ink-soft)] transition-colors hover:bg-[var(--border)] hover:text-[var(--ink)]" 
                onClick={() => setIsPublishOpen(false)}
              >✕</button>
            </div>
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">任务名称</label>
                <input 
                  required maxLength={100} minLength={5}
                  value={publishForm.title} onChange={e => setPublishForm({...publishForm, title: e.target.value})}
                  className="w-full rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--grass-deep)] focus:outline-none" 
                  placeholder="如：建造一座中世纪风格的灯塔" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">详细要求</label>
                <textarea 
                  required minLength={20} rows={3}
                  value={publishForm.description} onChange={e => setPublishForm({...publishForm, description: e.target.value})}
                  className="w-full resize-none rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--grass-deep)] focus:outline-none" 
                  placeholder="请详细描述对材质、选址、结构的具体需求（至少20字）..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">赏金 ($界念)</label>
                  <input 
                    type="number" required min={10}
                    value={publishForm.amount} onChange={e => setPublishForm({...publishForm, amount: e.target.value})}
                    className="w-full rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--grass-deep)] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">标签 (用逗号分隔)</label>
                  <input 
                    value={publishForm.tags} onChange={e => setPublishForm({...publishForm, tags: e.target.value})}
                    className="w-full rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--grass-deep)] focus:outline-none" 
                    placeholder="如：中世纪, 建筑" 
                  />
                </div>
              </div>
              
              {errorMsg && (
                <div className="rounded-[0.8rem] border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {errorMsg}
                </div>
              )}
              
              <div className="mt-8 pt-2">
                <Button type="submit" className="w-full py-4 text-base" disabled={loading}>
                  {loading ? '处理中...' : '确认并支付赏金'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
