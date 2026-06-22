export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number: string | null
          balance: number
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          balance?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          balance?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: string | null
          module: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          module: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          module?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      deal_items: {
        Row: {
          created_at: string | null
          deal_id: string | null
          id: string
          price: number
          stock_id: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          price: number
          stock_id?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          price?: number
          stock_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_items_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          created_at: string | null
          customer_id: string | null
          deal_number: string
          deal_type: string | null
          due_date: string | null
          handled_by: string | null
          id: string
          notes: string | null
          status: string | null
          total_deal_price: number
          total_paid: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          deal_number: string
          deal_type?: string | null
          due_date?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          total_deal_price?: number
          total_paid?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          deal_number?: string
          deal_type?: string | null
          due_date?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          total_deal_price?: number
          total_paid?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_ledger: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          ref_id: string | null
          transaction_type: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          ref_id?: string | null
          transaction_type: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          ref_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_ledger_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_ledger_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_products: {
        Row: {
          category: string
          created_at: string | null
          id: string
          price: number
          rank: string | null
          skin_count: number | null
          slug: string
          status: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          price: number
          rank?: string | null
          skin_count?: number | null
          slug: string
          status?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          price?: number
          rank?: string | null
          skin_count?: number | null
          slug?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      incoming_emails: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          otp_code: string | null
          raw_body_snippet: string | null
          received_at: string | null
          recipient_email: string
          sender_email: string
          subject: string
          visibility: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          otp_code?: string | null
          raw_body_snippet?: string | null
          received_at?: string | null
          recipient_email: string
          sender_email: string
          subject: string
          visibility?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          otp_code?: string | null
          raw_body_snippet?: string | null
          received_at?: string | null
          recipient_email?: string
          sender_email?: string
          subject?: string
          visibility?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          account_specs: string | null
          added_by: string | null
          asking_price: number
          capital_price: number
          created_at: string | null
          game_id: string
          id: string
          image_urls: string[] | null
          screenshot_url: string | null
          sold_at: string | null
          sold_price: number | null
          status: Database["public"]["Enums"]["inventory_status"] | null
          title_reference: string | null
          updated_at: string | null
        }
        Insert: {
          account_specs?: string | null
          added_by?: string | null
          asking_price: number
          capital_price: number
          created_at?: string | null
          game_id: string
          id?: string
          image_urls?: string[] | null
          screenshot_url?: string | null
          sold_at?: string | null
          sold_price?: number | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          title_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          account_specs?: string | null
          added_by?: string | null
          asking_price?: number
          capital_price?: number
          created_at?: string | null
          game_id?: string
          id?: string
          image_urls?: string[] | null
          screenshot_url?: string | null
          sold_at?: string | null
          sold_price?: number | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          title_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          deal_id: string | null
          handled_by: string | null
          id: string
          notes: string | null
          payment_type: string
          proof_url: string | null
          status: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          deal_id?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          payment_type: string
          proof_url?: string | null
          status?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          deal_id?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          payment_type?: string
          proof_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          description: string | null
          id: string
          module: string
        }
        Insert: {
          action: string
          description?: string | null
          id?: string
          module: string
        }
        Update: {
          action?: string
          description?: string | null
          id?: string
          module?: string
        }
        Relationships: []
      }
      problem_cases: {
        Row: {
          case_number: string
          chronology: string | null
          created_at: string | null
          customer_id: string | null
          deal_id: string | null
          handled_by: string | null
          id: string
          issue_type: string
          resolution: string | null
          status: string | null
          stock_id: string | null
          updated_at: string | null
        }
        Insert: {
          case_number: string
          chronology?: string | null
          created_at?: string | null
          customer_id?: string | null
          deal_id?: string | null
          handled_by?: string | null
          id?: string
          issue_type: string
          resolution?: string | null
          status?: string | null
          stock_id?: string | null
          updated_at?: string | null
        }
        Update: {
          case_number?: string
          chronology?: string | null
          created_at?: string | null
          customer_id?: string | null
          deal_id?: string | null
          handled_by?: string | null
          id?: string
          issue_type?: string
          resolution?: string | null
          status?: string | null
          stock_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_cases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_cases_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_cases_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_cases_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      public_users: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          role_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      stock_histories: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: string
          stock_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status: string
          stock_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          stock_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_histories_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_histories_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks: {
        Row: {
          account_detail: string | null
          backup_code: string | null
          capital_price: number
          category: string
          created_at: string | null
          current_price: number
          id: string
          login_info: string | null
          managed_by: string | null
          name: string
          notes: string | null
          password_info: string | null
          post_price: number
          purchase_date: string | null
          seller_info: string | null
          sku: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          account_detail?: string | null
          backup_code?: string | null
          capital_price?: number
          category: string
          created_at?: string | null
          current_price?: number
          id?: string
          login_info?: string | null
          managed_by?: string | null
          name: string
          notes?: string | null
          password_info?: string | null
          post_price?: number
          purchase_date?: string | null
          seller_info?: string | null
          sku: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          account_detail?: string | null
          backup_code?: string | null
          capital_price?: number
          category?: string
          created_at?: string | null
          current_price?: number
          id?: string
          login_info?: string | null
          managed_by?: string | null
          name?: string
          notes?: string | null
          password_info?: string | null
          post_price?: number
          purchase_date?: string | null
          seller_info?: string | null
          sku?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stocks_managed_by_fkey"
            columns: ["managed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_in_items: {
        Row: {
          converted_to_stock_id: string | null
          created_at: string | null
          deal_id: string | null
          description: string
          estimated_value: number
          id: string
        }
        Insert: {
          converted_to_stock_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description: string
          estimated_value: number
          id?: string
        }
        Update: {
          converted_to_stock_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string
          estimated_value?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_in_items_converted_to_stock_id_fkey"
            columns: ["converted_to_stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_in_items_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          role_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_account_transfer: {
        Args: {
          p_admin_fee: number
          p_admin_id: string
          p_amount: number
          p_dest_account_id: string
          p_source_account_id: string
        }
        Returns: undefined
      }
      process_payment: {
        Args: {
          p_account_id: string
          p_admin_id: string
          p_amount: number
          p_deal_id: string
          p_notes: string
        }
        Returns: undefined
      }
      process_stock_purchase: {
        Args: {
          p_account_details: string
          p_admin_id: string
          p_capital_price: number
          p_category: string
          p_current_price: number
          p_internal_notes: string
          p_name: string
          p_password: string
          p_payment_account_id: string
          p_post_price: number
          p_purchase_payment_status: Database["public"]["Enums"]["purchase_payment_status"]
          p_seller_info: string
          p_username: string
        }
        Returns: string
      }
    }
    Enums: {
      deal_status:
        | "DRAFT"
        | "BOOKED"
        | "LIMITED_ACCESS"
        | "PAID"
        | "CANCELLED_BY_BUYER"
        | "CANCELLED_BY_SELLER"
        | "REFUND_PARTIAL"
        | "REFUND_FULL"
        | "PROBLEM"
        | "COMPLETED"
      inventory_status: "UNPOSTED" | "AVAILABLE" | "SOLD"
      ledger_transaction_type:
        | "PAYMENT_IN"
        | "PAYMENT_OUT"
        | "REFUND"
        | "CASHBACK"
        | "TRANSFER_IN"
        | "TRANSFER_OUT"
        | "STOCK_PURCHASE"
        | "ADJUSTMENT"
      payment_status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
      payment_type: "IN" | "OUT"
      purchase_payment_status: "LUNAS" | "PENDING"
      stock_status:
        | "AVAILABLE"
        | "BOOKED"
        | "LIMITED_ACCESS"
        | "SOLD"
        | "ON_HOLD"
        | "PROBLEM_ACTION"
        | "PROBLEM_PERMANENT"
        | "CANCELLED"
      user_role: "OWNER" | "ADMIN" | "VIEWER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      deal_status: [
        "DRAFT",
        "BOOKED",
        "LIMITED_ACCESS",
        "PAID",
        "CANCELLED_BY_BUYER",
        "CANCELLED_BY_SELLER",
        "REFUND_PARTIAL",
        "REFUND_FULL",
        "PROBLEM",
        "COMPLETED",
      ],
      inventory_status: ["UNPOSTED", "AVAILABLE", "SOLD"],
      ledger_transaction_type: [
        "PAYMENT_IN",
        "PAYMENT_OUT",
        "REFUND",
        "CASHBACK",
        "TRANSFER_IN",
        "TRANSFER_OUT",
        "STOCK_PURCHASE",
        "ADJUSTMENT",
      ],
      payment_status: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      payment_type: ["IN", "OUT"],
      purchase_payment_status: ["LUNAS", "PENDING"],
      stock_status: [
        "AVAILABLE",
        "BOOKED",
        "LIMITED_ACCESS",
        "SOLD",
        "ON_HOLD",
        "PROBLEM_ACTION",
        "PROBLEM_PERMANENT",
        "CANCELLED",
      ],
      user_role: ["OWNER", "ADMIN", "VIEWER"],
    },
  },
} as const
