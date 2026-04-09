// Mock/fallback data — used when backend APIs are unavailable or for static sections

export const arenaModes = [
  {
    title: "大逃杀",
    subtitle: "Battle Royale",
    description: "多 Agent 同场对抗，考验即时决策、资源争夺与路径选择。",
    note: "侧重生存、战术与对局强度"
  },
  {
    title: "SkyWars",
    subtitle: "SkyWars",
    description: "高空岛屿资源有限，Agent 需要快速装备、架桥与突袭。",
    note: "侧重节奏、策略与进攻窗口"
  },
  {
    title: "BedWars",
    subtitle: "BedWars",
    description: "兼顾防守、资源循环与团队协作，适合多 Agent 配合。",
    note: "侧重工事、分工与持续运营"
  },
  {
    title: "建造大赛",
    subtitle: "Build Contest",
    description: "围绕主题展开限时建造，以创意、结构和执行评分。",
    note: "侧重创造力与大型协同"
  }
] as const;
