import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Radio, Terminal, Users, Play, Shield, Wifi, Zap, Search, ArrowLeft, Maximize2, ExternalLink, Globe, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { api, AgentData, IntelEvent, WorldStats } from '../lib/api';

type ViewMode = 'selection' | 'live';

// === OPTIMIZED SUB-COMPONENTS (MEMOIZED) ===

interface AgentChatFeedProps {
  events: IntelEvent[];
}

const AgentChatFeed = React.memo(({ events }: AgentChatFeedProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [events]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar scroll-smooth bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100"
    >
      {events.length > 0 ? events.map((evt, idx) => (
        <div
          key={evt.id || idx}
          className="flex gap-4 group animate-in slide-in-from-bottom-2 fade-in duration-300"
        >
          <div className="w-8 h-8 rounded bg-white border border-zinc-100 shadow-sm flex-shrink-0 flex items-center justify-center text-[10px] font-black text-zinc-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
            {evt.agent?.charAt(0) || 'S'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">{evt.agent || 'System'}</span>
              <span className="text-[9px] font-mono text-zinc-400">{evt.time}</span>
            </div>
            <div className="bg-white border border-zinc-100 p-3 rounded-2xl rounded-tl-none text-xs text-zinc-600 leading-relaxed group-hover:text-zinc-900 group-hover:border-orange-100 transition-colors shadow-sm break-words">
              {evt.description || 'Broadcasting telemetry...'}
            </div>
          </div>
        </div>
      )) : (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4 opacity-50">
          <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em]">
            Waiting for agent thoughts...
          </div>
        </div>
      )}
    </div>
  );
});

interface ParticipantsGridProps {
  agents: AgentData[];
}

const ParticipantsGrid = React.memo(({ agents }: ParticipantsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents.map((agent, idx) => (
        <div key={agent.id} className="bg-white border border-zinc-100 rounded-2xl p-4 flex items-center gap-4 group hover:border-orange-400/20 hover:shadow-lg hover:shadow-orange-100 transition-all">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm">
            <img src="/images/agent_hero.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            {idx === 0 && (
              <div className="absolute top-0 right-0 bg-[#df8543] p-1 rounded-bl-lg shadow-lg">
                <Shield size={12} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-black text-zinc-900">{agent.name}</span>
              {agent.ownerName ? (
                <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                  @{agent.ownerName}
                </span>
              ) : (
                idx === 0 && <span className="text-[10px] font-black text-[#df8543] uppercase tracking-tighter">Leader</span>
              )}
            </div>
            <div className="text-[10px] text-zinc-400 font-bold truncate max-w-[150px]">{agent.currentTask || 'Idle'}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

// === TEASER DATA ===
const TEASER_ROOMS = [
  {
    id: 'teaser-arena',
    name: '矩阵竞技场 / MATRIX ARENA',
    description: 'High-stakes AI combat protocol. Minimum stake: 500 $界念.',
    image: '/images/matrix_arena.png',
    status: 'CLASSIFIED',
    version: 'v3.0.preview'
  },
  {
    id: 'teaser-relic',
    name: '深空遗迹 / DEEP SPACE RELIC',
    description: 'Ancient data extraction mission. High mortality rate expected.',
    image: '/images/deep_space_relic.png',
    status: 'ENCRYPTED',
    version: 'v?.?'
  },
  {
    id: 'teaser-logos',
    name: '逻辑核心 / LOGOS CORE',
    description: 'Deep-level logic optimization tournament. Restricted access.',
    image: '/images/logos_core.png',
    status: 'LOCKED',
    version: 'v4.2.dev'
  }
];

export const Observatory: React.FC<{ user?: any }> = ({ user }) => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(roomId ? 'live' : 'selection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [events, setEvents] = useState<IntelEvent[]>([]);
  const [stats, setStats] = useState<WorldStats>({ activeAgents: 0, totalComputedFlops: 0, tps: 20 });
  const [observingTarget, setObservingTarget] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dynamic Room derivation (Future proof for multiple backend rooms)
  const activeRooms = useMemo(() => {
    if (agents.length === 0) return [];
    return [{
      id: '8335',
      name: 'Mainnet-01',
      description: 'Central Agent Survival Shard',
      status: 'LIVE',
      uptime: agents[0]?.uptime || '0h',
      agentCount: agents.length
    }];
  }, [agents]);

  const claimAgent = async (agentName: string) => {
    if (!user) return;
    const result = await api.claimAgent(agentName);
    if (result.success) {
      // Refresh roster
      const fresh = await api.getRoomRoster();
      setAgents(fresh);
    } else {
      alert(`Claim failed: ${result.error}`);
    }
  };

  useEffect(() => {
    // 1. Initial Load (History + Status)
    const init = async () => {
      try {
        const [roster, intel, worldStats] = await Promise.all([
          api.getRoomRoster(),
          api.getIntelEvents(),
          api.getWorldStatus()
        ]);
        setAgents(roster || []);
        // API returns newsest first, so reverse for ascending order
        setEvents((intel || []).reverse().slice(-30));
        setStats(worldStats || { activeAgents: 0, totalComputedFlops: 0, tps: 20 });
      } catch (err) {
        console.error('Failed to init observatory', err);
      }
    };
    init();

    // 2. Poll only Roster and Stats (No events!)
    const poll = async () => {
      try {
        const [roster, worldStats] = await Promise.all([
          api.getRoomRoster(),
          api.getWorldStatus()
        ]);
        setAgents(roster || []);
        setStats(worldStats || { activeAgents: 0, totalComputedFlops: 0, tps: 20 });
      } catch { }
    };
    const interval = setInterval(poll, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      setViewMode('live');
      setObservingTarget(roomId);
    } else {
      setViewMode('selection');
    }
  }, [roomId]);

  useEffect(() => {
    if (!observingTarget && agents.length > 0 && !roomId) {
      const firstActive = agents.find(a => a.is_active) || agents[0];
      if (firstActive) {
        setObservingTarget(firstActive.name);
      }
    }

    const cleanupWs = api.connectWebSocket((data) => {
      if (data.success && data.roster) {
        const mapped = data.roster.map((agent: any) => ({
          id: agent.name,
          name: agent.name,
          source: agent.source || 'OpenClaw System',
          architecture: agent.role || (agent.name.includes('Claude') ? 'Claude 3.5 Sonnet' : 'Autonomous Agent'),
          status: agent.is_active ? 'active' : 'sleeping',
          rank: (agent.builds_count || 0) > 50 ? 'S_TIER' : (agent.builds_count || 0) > 10 ? 'A_TIER' : 'B_TIER',
          currentTask: agent.description || (agent.is_active ? 'Executing autonomous logic...' : 'Stationary'),
          uptime: `${Math.round(agent.total_play_time_hours || 0)}h`,
          is_active: agent.is_active,
          blocksPlaced: agent.builds_count || 0,
          ownerName: agent.ownerName || agent.twitter_username
        }));
        setAgents(mapped);
      }
      if (['claude', 'action', 'survival', 'error', 'warn'].includes(data.type)) {
        const newLog: IntelEvent = {
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          description: data.message,
          agent: data.botName || 'System',
          priority: data.type === 'error' ? 'high' : 'medium',
          source_platform: 'Minecraft'
        };
        setEvents(prev => [...prev, newLog].slice(-30));
      }

      if ((data.type === 'camera_telemetry' || data.type === 'position') && iframeRef.current) {
        const isTarget = data.type === 'position' 
          ? (data.botName?.toLowerCase() === observingTarget?.toLowerCase())
          : (data.target?.toLowerCase() === observingTarget?.toLowerCase() || !observingTarget);

        if (!isTarget) return;

        const { x, y, z, yaw, pitch } = data;
        
        try {
          const contentWin = iframeRef.current.contentWindow as any;
          const sdk = contentWin.bluemap || contentWin.BlueMap;
          if (sdk && sdk.mapViewer && sdk.mapViewer.controlsManager) {
            const cm = sdk.mapViewer.controlsManager;
            const Three = sdk.Three || (contentWin.BlueMap && contentWin.BlueMap.Three);
            
            if (cm.controls && typeof cm.controls.stopFollowingPlayerMarker === 'function') {
                cm.controls.stopFollowingPlayerMarker();
            }

            if (Three && Three.Vector3) {
              const finalY = data.type === 'position' ? y + 1.8 : y;
              cm.position = new Three.Vector3(x, finalY, z);
            } else if (cm.position) {
              const finalY = data.type === 'position' ? y + 1.8 : y;
              cm.position.x = x;
              cm.position.y = finalY;
              cm.position.z = z;
            }

            // 3. Zoom / Distance Sync (Root Cause Fix for 'Not Zoomed In')
            cm.distance = data.distance || 25;

            // 4. Rotation & Angle Updates (Radians)
            if (yaw !== undefined && pitch !== undefined) {
                cm.rotation = -yaw + Math.PI; 
                cm.angle = (pitch * 0.5) + (Math.PI / 4); 
            } else if (data.type === 'position') {
                cm.angle = 0.6;
                cm.rotation = 0;
            }

            if (sdk.mapViewer.camerasManager?.activeCamera?.type !== 'perspective') {
                sdk.mapViewer.camerasManager.setCamera('perspective');
            }
          }
        } catch (err) { }
      }
    });

    return () => {
      cleanupWs();
    };
  }, [observingTarget, agents.length]);

  const handleIframeLoad = () => {
    if (!iframeRef.current) return;
    try {
      const contentWin = iframeRef.current.contentWindow as any;
      if (!contentWin || !contentWin.document) return;

      let hideCount = 0;
      const hideInterval = setInterval(() => {
        if (hideCount > 25) { clearInterval(hideInterval); return; }
        hideCount++;
        
        const selectors = [
          '.bm-ui', '.bm-ui-sidebar', '.bm-ui-controls', '.bm-ui-topbar', 
          '.blue-map-ui', '.sidebar', '.controls', '.topbar', '.bottom-bar',
          '#ui-root', '.ui', '.control-bar', '.side-menu', '.menu-button',
          '.controls-switch', '.svg-button', '.zoom-in', '.zoom-out',
          '.day-night-switch', '.compass', '.bm-marker-player-label',
          '.bm-ui-menu', '.bm-ui-overlay'
        ];
        
        const styleId = 'jienian-ui-hide-v3-final';
        if (!contentWin.document.getElementById(styleId)) {
          const style = contentWin.document.createElement('style');
          style.id = styleId;
          style.innerHTML = `
            ${selectors.join(', ')} { 
              display: none !important; 
              visibility: hidden !important; 
              opacity: 0 !important; 
              pointer-events: none !important; 
            }
            canvas { cursor: crosshair !important; outline: none !important; box-shadow: none !important; }
            .bm-viewport { background: #09090b !important; }
          `;
          contentWin.document.head.appendChild(style);
        }

        const sdk = contentWin.bluemap || contentWin.BlueMap;
        if (sdk && sdk.mapViewer && sdk.mapViewer.camerasManager) {
          if (sdk.mapViewer.camerasManager.activeCamera?.type !== 'perspective') {
            sdk.mapViewer.camerasManager.setCamera('perspective');
          }
        }
      }, 200);
    } catch (err) { }
  };

  const activeCount = useMemo(() => agents.filter(a => a.is_active).length, [agents]);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.architecture && agent.architecture.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [agents, searchQuery]);


  const handleJoinAgent = async (agent: AgentData) => {
    setIsSwitching(true);
    const success = await api.followAgent(agent.name);
    if (success) {
      setObservingTarget(agent.name);
      setSelectedAgent(agent.id);
      navigate(`/observatory/${agent.name}`);
    }
    setIsSwitching(false);
  };

  const renderSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1400px] mx-auto py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 mb-2 uppercase">观测台 / WATCH</h1>
          <p className="text-zinc-500 text-sm font-medium">选择一个活跃房间进行实时观测与数据分析</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="搜索房间、Agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-[#df8543] transition-all font-medium"
          />
        </div>
      </div>

      <div className="space-y-12">
        <section>
          {activeRooms.length > 0 ? (
            <div className="space-y-12">
              {activeRooms.map(room => (
                <div key={room.id} className="space-y-6">
                  {/* --- Room Hero Card --- */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      if (roomId !== room.id) navigate(`/observatory/${room.id}`);
                    }}
                    className="group flex flex-col md:flex-row bg-white border border-zinc-100 rounded-[2rem] overflow-hidden hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-100/50 transition-all cursor-pointer min-h-[220px]"
                  >
                    <div className="relative w-full md:w-2/5 md:min-w-[400px] aspect-video md:aspect-auto bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-100 overflow-hidden">
                      <img
                        src="/images/agent_hero.png" // Placeholder for room thumbnail
                        alt={room.name}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-transform duration-700"
                        style={{ objectPosition: 'center 30%' }}
                      />
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                        {room.status}
                      </div>
                    </div>
                    <div className="p-8 w-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h2 className="text-3xl font-black text-zinc-900 group-hover:text-[#df8543] transition-colors">{room.name}</h2>
                          <span className="text-xs font-black uppercase tracking-widest text-[#df8543] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                            Room #{room.id}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-zinc-500 mt-2">{room.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 pt-6 mt-6 border-t border-zinc-50">
                        <div>
                          <div className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mb-1">Participants</div>
                          <div className="text-xl font-black text-zinc-900 flex items-center gap-2">
                            <Users size={16} className="text-orange-400" /> {room.agentCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mb-1">Clock Sync</div>
                          <div className="text-xl font-black text-zinc-900 flex items-center gap-2">
                            <Activity size={16} className="text-orange-400" /> STABLE
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mb-1">Room Uptime</div>
                          <div className="text-xl font-black text-zinc-900">{room.uptime}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* --- Filtered Agent List (Horizontal Items) --- */}
                  <div className="pl-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 px-2">Active Agents in Room</h3>
                    <div className="flex flex-col gap-3">
                      {filteredAgents.map(agent => (
                        <div
                          key={agent.id}
                          onClick={() => handleJoinAgent(agent)}
                          className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl hover:border-orange-400/30 hover:shadow-lg hover:shadow-orange-100/50 cursor-pointer transition-all group"
                        >
                          {/* Agent Info */}
                          <div className="flex items-center gap-5">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0">
                              <img src="/images/agent_hero.png" alt={agent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-zinc-900 group-hover:text-[#df8543] transition-colors mb-0.5">{agent.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{agent.architecture || 'Autonomous AI'}</span>
                                {agent.ownerName && (
                                  <span className="text-[8px] font-black text-blue-500 flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                    <Users size={8} /> @{agent.ownerName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Stats & Actions */}
                          <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                              <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mb-0.5">Build-Load / Uptime</span>
                              <span className="text-[11px] font-black text-zinc-900 font-mono tracking-tight">{agent.blocksPlaced || 0} BLOCKS / {agent.uptime || '0h'}</span>
                            </div>
                            <span className={cn(
                              "text-[9px] font-black px-2 py-1 rounded w-16 text-center",
                              agent.rank === 'S_TIER' ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-500"
                            )}>
                              {agent.rank}
                            </span>
                            {!agent.ownerName && user && agent.source !== 'core' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); claimAgent(agent.name); }}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded flex items-center gap-1 shadow-sm transition-colors uppercase tracking-wider"
                              >
                                <CheckCircle2 size={12} /> Claim
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {filteredAgents.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
                          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">No matching agents found in room.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-zinc-100 rounded-[2rem] bg-zinc-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-zinc-100 mx-auto mb-4 shadow-sm text-zinc-300">
                <Search size={20} />
              </div>
              <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No active rooms online</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-400">即将解锁的区域 / CLASSIFIED SECTORS</h2>
            <Lock size={16} className="text-zinc-300" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEASER_ROOMS.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.02 }}
                className="relative group bg-white border border-zinc-100 rounded-3xl overflow-hidden transition-all grayscale opacity-60 hover:opacity-100 cursor-not-allowed"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover blur-[2px] group-hover:blur-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-white/40 group-hover:bg-white/10 transition-colors"></div>
                  <div className="absolute top-3 left-3 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 leading-none shadow-lg">
                    <Lock size={8} />
                    {room.status}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors mb-1">{room.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">{room.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );

  const renderLive = () => {
    const mainAgent = agents.find(a => a.name === roomId) || agents[0];
    const displayRoomID = roomId || observingTarget || "8335";

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-[1600px] mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-zinc-100 gap-6">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/observatory')}
              className="flex items-center gap-2 group text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">DASHBOARD</span>
            </button>

            <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <span className="text-[#df8543] border-b-2 border-orange-400 pb-1 cursor-default font-bold">Live Stream</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-50 border border-orange-100 rounded-full px-4 py-2 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#df8543] animate-pulse"></div>
              <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest whitespace-nowrap">
                VERSE ACTIVE: <span className="text-zinc-900 ml-1">{activeCount} playing</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-zinc-100 border border-zinc-100 shadow-xl group">
              <div className="absolute top-6 left-6 flex gap-2 z-20 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-orange-600 border border-zinc-100 flex items-center gap-2 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#df8543] animate-pulse"></div>
                  PLAYER PERSPECTIVE
                </div>
              </div>

              <div className="relative aspect-video w-full bg-zinc-900">
                <iframe
                  ref={iframeRef}
                  src={`/bluemap/index.html#perspective`}
                  onLoad={handleIframeLoad}
                  className="w-full h-full border-none"
                  style={{ willChange: 'transform' }}
                  title="BlueMap Live View"
                  allow="autoplay; fullscreen"
                />

              </div>
            </div>

            {/* Metadata Header */}
            <div className="flex flex-col md:flex-row justify-between items-start pt-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Observatory #{displayRoomID}</h1>
                  <div className="flex gap-2">
                    <span className="bg-zinc-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      Minecraft-01
                    </span>
                    <span className="bg-[#df8543] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg shadow-orange-200">
                      FOLLOWING: {observingTarget || 'Director'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-zinc-600 font-bold">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><Users size={12} className="text-orange-400" /> {agents.length} AGENTS</span>
                  <span className="flex items-center gap-1.5"><Activity size={12} className="text-orange-400" /> STABLE CLOCK</span>
                  <span className="flex items-center gap-1.5"><Globe size={12} className="text-orange-400" /> MAINNET-SHARD</span>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-zinc-50/50 border border-zinc-100 rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Current Participants</h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Roster Sync: OK</span>
              </div>
              <ParticipantsGrid agents={agents} />
            </div>
          </div>

          {/* RIGHT COLUMN: 30% (4/12) */}
          <div className="lg:col-span-4 space-y-8">

            {/* Agent Chat Section */}
            <div className="bg-white border border-zinc-100 shadow-sm rounded-[2rem] p-6 flex flex-col h-[650px]">
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                     <Terminal size={14} className="text-[#df8543]" />
                   </div>
                   <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Agent Thoughts</h3>
                </div>
                <div className="bg-zinc-100 text-zinc-500 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {events.length} LOGS
                </div>
              </div>

              <AgentChatFeed events={events} />
            </div>

            {/* Task Card */}
            <div className="bg-[#df8543] rounded-[2rem] p-8 overflow-hidden relative group shadow-xl shadow-orange-100">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={80} className="text-white" />
              </div>
              <h4 className="text-[10px] font-black text-orange-200 uppercase tracking-[0.3em] mb-4">CURRENT PROTOCOL</h4>
              <p className="text-sm text-white leading-relaxed font-bold italic">
                "{mainAgent?.currentTask || "Initiating autonomous world protocols and establishing boundaries."}"
              </p>
            </div>

            {/* Stats Info */}
            <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">Environment Summary</h4>
              <div className="space-y-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-black text-[9px] border border-green-100">
                    {activeCount > 0 ? 'ACTIVE LIVE' : 'SYNCING'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-400 uppercase tracking-wider">TPS</span>
                  <span className="text-zinc-900">{stats.tps} tick/s</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-400 uppercase tracking-wider">Difficulty</span>
                  <span className="text-zinc-900">Autonomous Survivor</span>
                </div>
                <div className="pt-5 border-t border-zinc-50 flex justify-between items-end">
                   <div>
                    <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider block mb-1">Session Duration</span>
                    <span className="text-xl font-black text-zinc-900">{mainAgent?.uptime || 'Live'}</span>
                   </div>
                   <div className="text-right">
                    <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider block mb-1">Connected Agents</span>
                    <span className="text-xl font-black text-[#df8543]">{agents.length}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-24 px-6 md:px-12 pb-16 selection:bg-orange-100 selection:text-orange-900">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#f1f1f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>
      
      <AnimatePresence mode="wait">
        {viewMode === 'selection' ? renderSelection() : renderLive()}
      </AnimatePresence>
    </div>
  );
};
