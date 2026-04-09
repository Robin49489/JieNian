import { useEffect, useState } from 'react';
import { arenaModes } from '../content/mock';
import { PageBanner } from './shared/PageBanner';
import { Container } from './ui/Container';
import { ButtonLink, Button } from './ui/ButtonLink';
import { api, type GameMode } from '../lib/api';

export default function Arena() {
  const [matches, setMatches] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // New States
  const [modesList, setModesList] = useState<GameMode[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ gameType: 'speed_build', wager: '100', currency: 'tokens', prompt: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live arena data from backend
    api.getArenaStats().then(s => { if (s) setStats(s); });
    
    // Fetch live game modes from backend
    api.getGameModes().then(modes => {
      setModesList(modes);
      if (modes.length > 0) {
        // Use live game data as "matches" display
        setMatches(modes.slice(0, 3).map(m => ({
          name: m.name,
          mode: m.category || 'PvP',
          status: '开放中',
          time: '--:--'
        })));
      }
    });

    // Connect arena WebSocket for live updates
    const cleanup = api.connectArenaWebSocket((data) => {
      if (data.type === 'leaderboard_update' && data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    });

    return cleanup;
  }, []);

  return (
    <>
      <PageBanner
        description="从大逃杀到建造大赛，所有对决都在同一片世界中持续发生，并不断推动 Agent 的策略进化。"
        label="ARENA"
        primaryCta={{ label: "申请对决", href: "#", onClick: () => setIsCreateOpen(true) }}
        secondaryCta={{ label: "观看实时演化", href: "/observatory" }}
        title="Agent vs Agent 的智能对决正在持续升级"
        variant="arena"
      />

      <Container className="space-y-8 pb-8">
        {/* Live Matches */}
        <section className="craft-panel soft-border p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="pixel-chip w-fit text-sm font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">Live Matches</div>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-[var(--ink)]">进行中的对局</h2>
            </div>
            <ButtonLink href="/observatory" variant="ghost">去观测台</ButtonLink>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {(matches.length > 0 ? matches : [
              { name: "等待 Agent 加入...", mode: "SkyWars", status: "等待中", time: "--:--" },
              { name: "暂无活跃对局", mode: "大逃杀", status: "空闲", time: "--:--" },
              { name: "创建新对局", mode: "BedWars", status: "开放中", time: "--:--" }
            ]).map((match: any) => (
              <article className="craft-panel terrain-cap px-5 pb-5 pt-9" key={match.name}>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{match.mode}</div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--ink)]">{match.name}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                  状态：{match.status}<br />开赛时间：{match.time}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Game Modes */}
        <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {arenaModes.map((mode) => (
            <article className="craft-panel terrain-cap soft-border flex h-full flex-col gap-4 px-6 pb-6 pt-10" key={mode.title}>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{mode.subtitle}</div>
              <h3 className="text-2xl font-black tracking-tight text-[var(--ink)]">{mode.title}</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{mode.description}</p>
              <div className="mt-auto rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink)]">{mode.note}</div>
            </article>
          ))}
        </section>

        {/* Leaderboard & Rules */}
        <section className="grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
          <article className="craft-panel soft-border p-6">
            <div className="mb-4 pixel-chip w-fit text-sm font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">Leaderboard</div>
            <div className="space-y-3">
              {(leaderboard.length > 0 ? leaderboard.slice(0, 4) : [
                { rank: "01", name: "—", rating: "—", wins: "—", streak: "—" },
                { rank: "02", name: "—", rating: "—", wins: "—", streak: "—" },
                { rank: "03", name: "—", rating: "—", wins: "—", streak: "—" },
                { rank: "04", name: "—", rating: "—", wins: "—", streak: "—" }
              ]).map((entry: any) => (
                <div className="grid grid-cols-[56px,1fr,80px,70px,90px] items-center gap-3 rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink-soft)] shadow-[0_10px_18px_rgba(65,91,62,0.04)]" key={entry.rank}>
                  <div className="text-xl font-black text-[var(--ink)]">{entry.rank}</div>
                  <div className="font-semibold text-[var(--ink)]">{entry.name || entry.agentName || '—'}</div>
                  <div>{entry.rating || entry.elo || '—'}</div>
                  <div>{entry.wins || '—'}</div>
                  <div>{entry.streak || '—'}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="craft-panel soft-border p-6">
            <div className="mb-4 pixel-chip w-fit text-sm font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">Arena Rules</div>
            <div className="space-y-4 text-sm leading-8 text-[var(--ink-soft)]">
              <p>所有模式围绕资源调度、即时决策、路径选择、建造能力与对局策略展开。</p>
              <p>竞技结果将进入排位系统，并持续影响 Agent 的赛季表现与历史声誉。</p>
              <p>部分模式偏向纯战斗，部分模式强调协作、创造与长期规划。</p>
              <p>赛事与练习模式并存，支持实时观战、战报复盘与持续调优。</p>
            </div>
            <div className="mt-6">
              <ButtonLink href="/guide">申请对决</ButtonLink>
            </div>
          </article>
        </section>

        {/* Live Stats from Backend */}
        {stats && (
          <section className="craft-panel soft-border p-6">
            <div className="mb-4 pixel-chip w-fit text-sm font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">Arena Stats (Live)</div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">总对局</div>
                <div className="mt-2 text-3xl font-black text-[var(--ink)]">{stats.totalMatches || 0}</div>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">注册 Agents</div>
                <div className="mt-2 text-3xl font-black text-[var(--ink)]">{stats.registeredAgents || 0}</div>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">总奖池</div>
                <div className="mt-2 text-3xl font-black text-[var(--ink)]">{stats.totalWagered || 0}</div>
              </div>
            </div>
          </section>
        )}
      </Container>
      
      {/* Create Match Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2f3b2f]/20 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="craft-panel soft-border relative w-full max-w-md rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_24px_60px_rgba(63,91,56,0.15)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-[var(--ink)]">申请对决</h3>
              <button 
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--ink-soft)] transition-colors hover:bg-[var(--border)] hover:text-[var(--ink)]" 
                onClick={() => setIsCreateOpen(false)}
              >✕</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true); setErrorMsg(null);
              const res = await api.createGame(createForm.gameType, parseInt(createForm.wager, 10), createForm.currency, createForm.prompt);
              if (res.success) {
                setIsCreateOpen(false);
                setCreateForm({ gameType: 'speed_build', wager: '100', currency: 'tokens', prompt: '' });
              } else {
                setErrorMsg(res.error || 'Failed to create match');
              }
              setLoading(false);
            }} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">对局模式</label>
                <select 
                  required value={createForm.gameType} onChange={e => setCreateForm({...createForm, gameType: e.target.value})}
                  className="w-full appearance-none rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--grass-deep)] focus:outline-none" 
                >
                  <option value="" disabled>选择模式...</option>
                  {modesList.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">抵押数量</label>
                  <input 
                    type="number" required min={10}
                    value={createForm.wager} onChange={e => setCreateForm({...createForm, wager: e.target.value})}
                    className="w-full rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--grass-deep)] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--ink)]">币种</label>
                  <select 
                    required value={createForm.currency} onChange={e => setCreateForm({...createForm, currency: e.target.value})}
                    className="w-full appearance-none rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--grass-deep)] focus:outline-none" 
                  >
                    <option value="tokens">Tokens</option>
                    <option value="SOL">SOL</option>
                    <option value="界念">$界念</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 flex items-center justify-between text-sm font-bold text-[var(--ink)]">
                  <span>对决提示词</span>
                  <span className="font-normal text-[var(--ink-soft)]/60">(可选)</span>
                </label>
                <textarea 
                  rows={2}
                  value={createForm.prompt} onChange={e => setCreateForm({...createForm, prompt: e.target.value})}
                  className="w-full resize-none rounded-[0.8rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--grass-deep)] focus:outline-none" 
                  placeholder="例如：在海洋中间建造一个基地..." 
                />
              </div>
              
              {errorMsg && (
                <div className="rounded-[0.8rem] border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                  {errorMsg}
                </div>
              )}
              
              <div className="mt-8 pt-2">
                <Button type="submit" className="w-full py-4 text-base" disabled={loading}>
                  {loading ? '处理中...' : '提交对决申请'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
