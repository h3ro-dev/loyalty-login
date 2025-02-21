export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      nft_holdings: {
        Row: {
          block_number: number
          created_at: string
          id: string
          micro_nfts: number
          project_name: Database["public"]["Enums"]["project_name"]
          staked_micro_nfts: number
          total_micro_nfts: number
          total_nfts: number
          unstaked_micro_nfts: number
          updated_at: string
          user_id: string
          wallet_address: string
          wallet_id: string
        }
        Insert: {
          block_number: number
          created_at?: string
          id?: string
          micro_nfts: number
          project_name: Database["public"]["Enums"]["project_name"]
          staked_micro_nfts?: number
          total_micro_nfts?: number
          total_nfts: number
          unstaked_micro_nfts?: number
          updated_at?: string
          user_id: string
          wallet_address: string
          wallet_id: string
        }
        Update: {
          block_number?: number
          created_at?: string
          id?: string
          micro_nfts?: number
          project_name?: Database["public"]["Enums"]["project_name"]
          staked_micro_nfts?: number
          total_micro_nfts?: number
          total_nfts?: number
          unstaked_micro_nfts?: number
          updated_at?: string
          user_id?: string
          wallet_address?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nft_holdings_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      token_holdings: {
        Row: {
          created_at: string
          id: string
          piggy_bank_tokens: number
          project_name: Database["public"]["Enums"]["project_name"]
          staked_debt_tokens: number
          total_tokens: number
          updated_at: string
          wallet_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          piggy_bank_tokens: number
          project_name: Database["public"]["Enums"]["project_name"]
          staked_debt_tokens?: number
          total_tokens: number
          updated_at?: string
          wallet_id: string
        }
        Update: {
          created_at?: string
          id?: string
          piggy_bank_tokens?: number
          project_name?: Database["public"]["Enums"]["project_name"]
          staked_debt_tokens?: number
          total_tokens?: number
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_holdings_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          address: string
          created_at: string
          id: string
          nickname: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          nickname?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          nickname?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
      }
    }
    Enums: {
      project_name:
        | "DEBT"
        | "CHRS"
        | "ALUM"
        | "BAUX"
        | "BGLD"
        | "OIL"
        | "DCM"
        | "DATA"
        | "DLG"
        | "GDLG"
        | "GROW"
        | "FARM"
        | "NATG"
        | "NGAS"
        | "XPLR"
        | "EXPL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
