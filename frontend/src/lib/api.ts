// lib/api.ts
/// <reference types="vite/client" />
// Handles API fetching and WebSocket connections for Jiè Niàn frontend

const isProd = import.meta.env.PROD;
const API_BASE_URL = import.meta.env.VITE_API_URL || (isProd ? '' : 'http://localhost:8081');

// For Nginx proxy in production, we use specific paths
const getWsUrl = (path: string) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  
  if (isProd) {
    return `${protocol}//${host}${path}`;
  }

  // Fallback for development
  const base = API_BASE_URL.replace('http:', 'ws:').replace('https:', 'wss:');
  if (path === '/ws/') return base.replace(':8081', ':8080');
  if (path === '/arena-ws/') return base.replace(':8081', ':8082');
  return base;
};

const TELEMETRY_WS_URL = getWsUrl('/ws/');
const ARENA_WS_URL = getWsUrl('/arena-ws/');

console.log('[Jiè Niàn] API Base:', API_BASE_URL || '(relative)');
console.log('[Jiè Niàn] Telemetry WS:', TELEMETRY_WS_URL);
console.log('[Jiè Niàn] Arena WS:', ARENA_WS_URL);

export interface AgentData {
  id: string;
  name: string;
  source: string;
  architecture?: string;
  status: 'active' | 'sleeping' | 'building' | 'exploring' | 'idle';
  rank: string;
  currentTask: string;
  uptime: string;
  is_active: boolean;
  ownerName?: string;
  blocksPlaced?: number;
}

export interface IntelEvent {
  id: string;
  time: string;
  description: string;
  agent?: string;
  source_platform: string;
  priority: string;
}

export interface WorldStats {
  activeAgents: number;
  totalComputedFlops: number;
  tps: number;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  minWagers: {
    tokens: number;
    SOL: number;
    '界念': number;
  };
  category: string;
  difficulty: string;
}

export interface BountyTask {
  id: string;
  rawId: string;
  title: string;
  issuer: string;
  bounty: string;
  status: 'open' | 'progress' | 'completed';
  difficulty: string;
  deadline: string;
}

export const api = {
  // === OBSERVATORY ===
  async getAgentRoster(): Promise<AgentData[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/agents/roster`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && data.roster) {
        return data.roster.map((agent: any) => ({
          id: agent.id || agent.name,
          name: agent.name,
          source: agent.source || 'OpenClaw System',
          architecture: agent.role || (agent.name.includes('Claude') ? 'Claude 3.5 Sonnet' : 'Autonomous Agent'),
          status: agent.is_active ? 'active' : 'sleeping',
          rank: agent.builds_count > 50 ? 'S_TIER' : agent.builds_count > 10 ? 'A_TIER' : 'B_TIER',
          currentTask: agent.description || (agent.is_active ? 'Executing autonomous logic...' : 'Stationary'),
          uptime: `${Math.round(agent.total_play_time_hours || 0)}h`,
          is_active: agent.is_active,
          ownerName: agent.ownerName || agent.twitter_username,
          blocksPlaced: agent.builds_count || 0
        }));
      }
      return [];
    } catch {
      return [];
    }
  },
  
  async getRoomRoster(): Promise<AgentData[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/rooms`);
      if (!res.ok) return this.getAgentRoster(); // Fallback
      const data = await res.json();
      if (data.success && data.roster) {
        return data.roster.map((agent: any) => ({
          id: agent.id || agent.name,
          name: agent.name,
          source: agent.source || 'OpenClaw System',
          architecture: agent.role || (agent.name.includes('Claude') ? 'Claude 3.5 Sonnet' : 'Autonomous Agent'),
          status: agent.is_active ? 'active' : 'sleeping',
          rank: agent.builds_count > 50 ? 'S_TIER' : agent.builds_count > 10 ? 'A_TIER' : 'B_TIER',
          currentTask: agent.description || (agent.is_active ? 'Executing autonomous logic...' : 'Stationary'),
          uptime: `${Math.round(agent.total_play_time_hours || 0)}h`,
          is_active: agent.is_active,
          ownerName: agent.ownerName || agent.twitter_username,
          blocksPlaced: agent.builds_count || 0
        }));
      }
      return this.getAgentRoster();
    } catch {
      return this.getAgentRoster();
    }
  },

  async followAgent(name: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/camera/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' // Remove hardcoded secret
        },
        body: JSON.stringify({ name })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getIntelEvents(): Promise<IntelEvent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/relay/intel`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && data.intel) {
        return data.intel.map((item: any) => ({
          id: item.id,
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }),
          description: item.description || item.content || item.title || 'Unknown activity',
          agent: item.participants?.[0] || item.source_agent || 'System',
          source_platform: item.source_platform || 'Minecraft',
          priority: item.priority || 'low'
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  async getWorldStatus(): Promise<WorldStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/world`);
      if (!res.ok) return { activeAgents: 0, totalComputedFlops: 0, tps: 20 };
      const data = await res.json();
      return {
        activeAgents: data.civilization?.totalAgents || 0,
        totalComputedFlops: (data.civilization?.buildsCompleted || 0) * 1024,
        tps: 20 // Standard server tickrate
      };
    } catch {
      return { activeAgents: 0, totalComputedFlops: 0, tps: 20 };
    }
  },

  // === ARENA ===
  async getArenaStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/arena/status`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.stats : null;
    } catch {
      return null;
    }
  },

  async getGameModes(): Promise<GameMode[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/arena/games`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && data.gameTypes) {
        return data.gameTypes.map((game: any) => ({
          id: game.id,
          name: game.name,
          description: game.description,
          category: game.category,
          difficulty: game.requiresJudge ? '困难' : '普通',
          minWagers: game.minWagers
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  // === BOUNTY MARKET ===
  async getBounties(): Promise<{ tasks: BountyTask[], stats: any }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/arena/bounties`);
      if (!res.ok) return { tasks: [], stats: null };
      const data = await res.json();
      if (data.success && data.bounties) {
        const mappedTasks = data.bounties.map((b: any) => {
          let uiStatus: 'open' | 'progress' | 'completed' = 'open';
          if (b.status === 'claimed' || b.status === 'in_progress' || b.status === 'submitted') {
            uiStatus = 'progress';
          } else if (b.status === 'completed') {
            uiStatus = 'completed';
          }

          let diff = 'Normal';
          if (b.amount > 500) diff = 'Extreme';
          else if (b.amount > 200) diff = 'Hard';
          else if (b.amount < 50) diff = 'Easy';

          return {
            id: b.id.substring(0, 12).toUpperCase(), // Shorten ID for UI
            rawId: b.id,
            title: b.title,
            issuer: b.creatorName || b.creatorId.substring(0, 8),
            bounty: `${b.amount.toLocaleString()} $界念`,
            status: uiStatus,
            difficulty: diff,
            deadline: new Date(b.expiresAt).toLocaleDateString()
          };
        });
        return { tasks: mappedTasks, stats: data.stats };
      }
      return { tasks: [], stats: null };
    } catch {
      return { tasks: [], stats: null };
    }
  },

  async claimAgent(agentName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem('jn_token');
      if (!token) return { success: false, error: 'Not logged in' };

      const res = await fetch(`${API_BASE_URL}/api/v1/agents/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agentName })
      });

      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async createBounty(title: string, description: string, amount: number, tags: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem('jn_token');
      if (!token) return { success: false, error: 'Not logged in' };

      const res = await fetch(`${API_BASE_URL}/api/v1/arena/bounties/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, amount, tags })
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async claimBounty(bountyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem('jn_token');
      if (!token) return { success: false, error: 'Not logged in' };

      const res = await fetch(`${API_BASE_URL}/api/v1/arena/bounties/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bountyId })
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async createGame(gameType: string, wager: number, currency: string, prompt?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem('jn_token');
      if (!token) return { success: false, error: 'Not logged in' };

      const res = await fetch(`${API_BASE_URL}/api/v1/arena/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameType, wager, currency, prompt })
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // === WEBSOCKET LISTENER ===
  connectWebSocket(onMessage: (data: any) => void) {
    const ws = new WebSocket(TELEMETRY_WS_URL);

    ws.onopen = () => {
      console.log('Connected to Jiè Niàn Telemetry WS');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        // ignore invalid payload
      }
    };

    return () => ws.close();
  },

  connectArenaWebSocket(onMessage: (data: any) => void) {
    const ws = new WebSocket(ARENA_WS_URL);

    ws.onopen = () => {
      console.log('Connected to Jiè Niàn Arena WS');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        // ignore
      }
    };

    return () => ws.close();
  }
};
