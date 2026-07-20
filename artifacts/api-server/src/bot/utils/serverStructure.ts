export interface ServerStructure {
  categories: Array<{
    name: string;
    position?: number;
    channels: Array<{
      name: string;
      type: "text" | "voice" | "forum";
      topic?: string;
      slowmode?: number;
    }>;
  }>;
  roles: Array<{
    name: string;
    color?: string;
    hoist?: boolean;
    mentionable?: boolean;
    permissions?: string[];
  }>;
}
