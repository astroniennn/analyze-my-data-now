export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      sales_transactions: {
        Row: {
          approve: boolean | null
          bill_sale_price: number | null
          branch_id: string | null
          branch_name: string | null
          brand: string | null
          buy_bill: string | null
          buy_doc_ref: string | null
          category_id: string | null
          category_name: string | null
          comment: string | null
          cost: number | null
          cost_after_debt_reduction: number | null
          counter: number | null
          cr_off_id: string | null
          cr_off_name: string | null
          create_time: string
          created_at: string
          credit_days: number | null
          cus_ref: string | null
          customer_code: string | null
          customer_name: string | null
          diff_cost: number | null
          diff_cost_after_debt_reduction: number | null
          diff_set: number | null
          discount: number | null
          discount_value: number | null
          doc_date: string | null
          doc_no: string | null
          doc_ref: string | null
          finish: string | null
          id: string
          model: string | null
          number: number | null
          officer_id: string | null
          officer_name: string | null
          product_code: string | null
          product_name: string | null
          product_type: string | null
          profit_sale_price: number | null
          replicate_time: string | null
          sell_type: string | null
          serial: string | null
          set_price: number | null
          set_product_code: string | null
          set_product_name: string | null
          set_product_serial: string | null
          status: string | null
          sub_category: string | null
          sum_number: number | null
          supplier_code: string | null
          supplier_name: string | null
          total_price: number | null
          unit_sale_price: number | null
          uoff_id: string | null
          uoff_name: string | null
          update_time: string
          updated_at: string
          user_id: string
          vat_percentage: number | null
          vat_type: string | null
          vat_value: number | null
          version: string | null
        }
        Insert: {
          approve?: boolean | null
          bill_sale_price?: number | null
          branch_id?: string | null
          branch_name?: string | null
          brand?: string | null
          buy_bill?: string | null
          buy_doc_ref?: string | null
          category_id?: string | null
          category_name?: string | null
          comment?: string | null
          cost?: number | null
          cost_after_debt_reduction?: number | null
          counter?: number | null
          cr_off_id?: string | null
          cr_off_name?: string | null
          create_time?: string
          created_at?: string
          credit_days?: number | null
          cus_ref?: string | null
          customer_code?: string | null
          customer_name?: string | null
          diff_cost?: number | null
          diff_cost_after_debt_reduction?: number | null
          diff_set?: number | null
          discount?: number | null
          discount_value?: number | null
          doc_date?: string | null
          doc_no?: string | null
          doc_ref?: string | null
          finish?: string | null
          id?: string
          model?: string | null
          number?: number | null
          officer_id?: string | null
          officer_name?: string | null
          product_code?: string | null
          product_name?: string | null
          product_type?: string | null
          profit_sale_price?: number | null
          replicate_time?: string | null
          sell_type?: string | null
          serial?: string | null
          set_price?: number | null
          set_product_code?: string | null
          set_product_name?: string | null
          set_product_serial?: string | null
          status?: string | null
          sub_category?: string | null
          sum_number?: number | null
          supplier_code?: string | null
          supplier_name?: string | null
          total_price?: number | null
          unit_sale_price?: number | null
          uoff_id?: string | null
          uoff_name?: string | null
          update_time?: string
          updated_at?: string
          user_id: string
          vat_percentage?: number | null
          vat_type?: string | null
          vat_value?: number | null
          version?: string | null
        }
        Update: {
          approve?: boolean | null
          bill_sale_price?: number | null
          branch_id?: string | null
          branch_name?: string | null
          brand?: string | null
          buy_bill?: string | null
          buy_doc_ref?: string | null
          category_id?: string | null
          category_name?: string | null
          comment?: string | null
          cost?: number | null
          cost_after_debt_reduction?: number | null
          counter?: number | null
          cr_off_id?: string | null
          cr_off_name?: string | null
          create_time?: string
          created_at?: string
          credit_days?: number | null
          cus_ref?: string | null
          customer_code?: string | null
          customer_name?: string | null
          diff_cost?: number | null
          diff_cost_after_debt_reduction?: number | null
          diff_set?: number | null
          discount?: number | null
          discount_value?: number | null
          doc_date?: string | null
          doc_no?: string | null
          doc_ref?: string | null
          finish?: string | null
          id?: string
          model?: string | null
          number?: number | null
          officer_id?: string | null
          officer_name?: string | null
          product_code?: string | null
          product_name?: string | null
          product_type?: string | null
          profit_sale_price?: number | null
          replicate_time?: string | null
          sell_type?: string | null
          serial?: string | null
          set_price?: number | null
          set_product_code?: string | null
          set_product_name?: string | null
          set_product_serial?: string | null
          status?: string | null
          sub_category?: string | null
          sum_number?: number | null
          supplier_code?: string | null
          supplier_name?: string | null
          total_price?: number | null
          unit_sale_price?: number | null
          uoff_id?: string | null
          uoff_name?: string | null
          update_time?: string
          updated_at?: string
          user_id?: string
          vat_percentage?: number | null
          vat_type?: string | null
          vat_value?: number | null
          version?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
