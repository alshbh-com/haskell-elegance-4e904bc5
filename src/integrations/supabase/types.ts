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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          section: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          section: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          section?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      admin_passwords: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_user_permissions: {
        Row: {
          created_at: string
          id: string
          permission: string
          permission_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission: string
          permission_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission?: string
          permission_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          password: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          password: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          password?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      agent_daily_closings: {
        Row: {
          closed_by: string | null
          closed_by_username: string | null
          closing_date: string
          created_at: string
          delivery_agent_id: string
          id: string
          is_closed: boolean
          net_amount: number | null
          notes: string | null
          total_delivered: number | null
          total_returns: number | null
          total_shipping: number | null
        }
        Insert: {
          closed_by?: string | null
          closed_by_username?: string | null
          closing_date: string
          created_at?: string
          delivery_agent_id: string
          id?: string
          is_closed?: boolean
          net_amount?: number | null
          notes?: string | null
          total_delivered?: number | null
          total_returns?: number | null
          total_shipping?: number | null
        }
        Update: {
          closed_by?: string | null
          closed_by_username?: string | null
          closing_date?: string
          created_at?: string
          delivery_agent_id?: string
          id?: string
          is_closed?: boolean
          net_amount?: number | null
          notes?: string | null
          total_delivered?: number | null
          total_returns?: number | null
          total_shipping?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_daily_closings_delivery_agent_id_fkey"
            columns: ["delivery_agent_id"]
            isOneToOne: false
            referencedRelation: "delivery_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_payments: {
        Row: {
          amount: number
          created_at: string
          delivery_agent_id: string
          id: string
          notes: string | null
          order_id: string | null
          payment_date: string | null
          payment_type: string
        }
        Insert: {
          amount?: number
          created_at?: string
          delivery_agent_id: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          delivery_agent_id?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_payments_delivery_agent_id_fkey"
            columns: ["delivery_agent_id"]
            isOneToOne: false
            referencedRelation: "delivery_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          product_id: string | null
          user_session: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          user_session?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          user_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          active_template: string
          active_theme: string
          announcements: Json
          created_at: string
          currency: string
          header_text: string | null
          id: string
          invoice_name: string
          language: string
          logo_url: string | null
          platform_name: string
          primary_color: string | null
          seo: Json
          shipping_fee: number
          show_related_global: boolean
          social_links: Json
          store_name: string
          theme: string
          updated_at: string
        }
        Insert: {
          active_template?: string
          active_theme?: string
          announcements?: Json
          created_at?: string
          currency?: string
          header_text?: string | null
          id?: string
          invoice_name?: string
          language?: string
          logo_url?: string | null
          platform_name?: string
          primary_color?: string | null
          seo?: Json
          shipping_fee?: number
          show_related_global?: boolean
          social_links?: Json
          store_name?: string
          theme?: string
          updated_at?: string
        }
        Update: {
          active_template?: string
          active_theme?: string
          announcements?: Json
          created_at?: string
          currency?: string
          header_text?: string | null
          id?: string
          invoice_name?: string
          language?: string
          logo_url?: string | null
          platform_name?: string
          primary_color?: string | null
          seo?: Json
          shipping_fee?: number
          show_related_global?: boolean
          social_links?: Json
          store_name?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          id: string
          is_published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cashbox: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          name: string
          opening_balance: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name: string
          opening_balance?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name?: string
          opening_balance?: number
          updated_at?: string
        }
        Relationships: []
      }
      cashbox_transactions: {
        Row: {
          amount: number
          cashbox_id: string
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          reason: string | null
          type: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          amount?: number
          cashbox_id: string
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          reason?: string | null
          type: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          amount?: number
          cashbox_id?: string
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          reason?: string | null
          type?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cashbox_transactions_cashbox_id_fkey"
            columns: ["cashbox_id"]
            isOneToOne: false
            referencedRelation: "cashbox"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image: string | null
          image_url: string | null
          is_active: boolean
          name: string
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image?: string | null
          image_url?: string | null
          is_active?: boolean
          name: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image?: string | null
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          governorate: string | null
          governorate_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          phone2: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          governorate?: string | null
          governorate_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          phone2?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          governorate?: string | null
          governorate_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          phone2?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_agents: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          serial_number: string | null
          total_owed: number
          total_paid: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          serial_number?: string | null
          total_owed?: number
          total_paid?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          serial_number?: string | null
          total_owed?: number
          total_paid?: number
          updated_at?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      governorates: {
        Row: {
          created_at: string
          id: string
          name: string
          shipping_cost: number
          updated_at: string
          zone: Database["public"]["Enums"]["gov_zone"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          shipping_cost?: number
          updated_at?: string
          zone?: Database["public"]["Enums"]["gov_zone"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          shipping_cost?: number
          updated_at?: string
          zone?: Database["public"]["Enums"]["gov_zone"]
        }
        Relationships: []
      }
      meta_settings: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          is_enabled: boolean
          pixel_id: string | null
          test_event_code: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          pixel_id?: string | null
          test_event_code?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          pixel_id?: string | null
          test_event_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          icon: string
          id: string
          is_active: boolean
          link: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          link?: string | null
          title: string
          type?: string
        }
        Update: {
          body?: string
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          link?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      offices: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
          watermark_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
          watermark_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
          watermark_name?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          order_id: string
          price: number
          product_details: Json | null
          product_id: string | null
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          order_id: string
          price?: number
          product_details?: Json | null
          product_id?: string | null
          quantity?: number
          size?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_details?: Json | null
          product_id?: string | null
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          agent_shipping_cost: number
          assigned_at: string | null
          barcode_value: string | null
          created_at: string
          customer_id: string | null
          delivery_agent_id: string | null
          discount: number
          governorate_id: string | null
          id: string
          modified_amount: number
          notes: string | null
          office_id: string | null
          order_details: string | null
          order_number: number
          payment_date: string | null
          qr_value: string | null
          shipping_cost: number
          status: string
          total_amount: number
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          agent_shipping_cost?: number
          assigned_at?: string | null
          barcode_value?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_agent_id?: string | null
          discount?: number
          governorate_id?: string | null
          id?: string
          modified_amount?: number
          notes?: string | null
          office_id?: string | null
          order_details?: string | null
          order_number?: number
          payment_date?: string | null
          qr_value?: string | null
          shipping_cost?: number
          status?: string
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          agent_shipping_cost?: number
          assigned_at?: string | null
          barcode_value?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_agent_id?: string | null
          discount?: number
          governorate_id?: string | null
          id?: string
          modified_amount?: number
          notes?: string | null
          office_id?: string | null
          order_details?: string | null
          order_number?: number
          payment_date?: string | null
          qr_value?: string | null
          shipping_cost?: number
          status?: string
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_agent_id_fkey"
            columns: ["delivery_agent_id"]
            isOneToOne: false
            referencedRelation: "delivery_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_pages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_color_variants: {
        Row: {
          color: string
          created_at: string
          id: string
          image_url: string | null
          product_id: string
          stock: number | null
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          image_url?: string | null
          product_id: string
          stock?: number | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          image_url?: string | null
          product_id?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_color_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          product_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          product_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          color_options: Json | null
          colors: Json
          compare_price: number | null
          created_at: string
          description: string | null
          details: string | null
          fake_stock_max: number
          fake_stock_min: number
          fake_viewers_max: number
          fake_viewers_min: number
          id: string
          image_url: string | null
          images: Json
          in_stock: boolean
          is_bestseller: boolean
          is_featured: boolean
          is_offer: boolean
          name: string
          offer_price: number | null
          price: number
          quantity_pricing: Json | null
          show_related: boolean | null
          size_options: Json | null
          sizes: Json
          slug: string
          stock: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          color_options?: Json | null
          colors?: Json
          compare_price?: number | null
          created_at?: string
          description?: string | null
          details?: string | null
          fake_stock_max?: number
          fake_stock_min?: number
          fake_viewers_max?: number
          fake_viewers_min?: number
          id?: string
          image_url?: string | null
          images?: Json
          in_stock?: boolean
          is_bestseller?: boolean
          is_featured?: boolean
          is_offer?: boolean
          name: string
          offer_price?: number | null
          price: number
          quantity_pricing?: Json | null
          show_related?: boolean | null
          size_options?: Json | null
          sizes?: Json
          slug: string
          stock?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          color_options?: Json | null
          colors?: Json
          compare_price?: number | null
          created_at?: string
          description?: string | null
          details?: string | null
          fake_stock_max?: number
          fake_stock_min?: number
          fake_viewers_max?: number
          fake_viewers_min?: number
          id?: string
          image_url?: string | null
          images?: Json
          in_stock?: boolean
          is_bestseller?: boolean
          is_featured?: boolean
          is_offer?: boolean
          name?: string
          offer_price?: number | null
          price?: number
          quantity_pricing?: Json | null
          show_related?: boolean | null
          size_options?: Json | null
          sizes?: Json
          slug?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          customer_id: string | null
          delivery_agent_id: string | null
          id: string
          notes: string | null
          order_id: string
          return_amount: number
          returned_items: Json | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          delivery_agent_id?: string | null
          id?: string
          notes?: string | null
          order_id: string
          return_amount?: number
          returned_items?: Json | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          delivery_agent_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          return_amount?: number
          returned_items?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_delivery_agent_id_fkey"
            columns: ["delivery_agent_id"]
            isOneToOne: false
            referencedRelation: "delivery_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          customer_name: string
          id: string
          images: Json
          is_approved: boolean
          product_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          comment?: string
          created_at?: string
          customer_name: string
          id?: string
          images?: Json
          is_approved?: boolean
          product_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          customer_name?: string
          id?: string
          images?: Json
          is_approved?: boolean
          product_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          order_id: string | null
          session_id: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          order_id?: string | null
          session_id?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          order_id?: string | null
          session_id?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_session_items: {
        Row: {
          id: string
          order_id: string | null
          scanned_at: string
          session_id: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          scanned_at?: string
          session_id: string
        }
        Update: {
          id?: string
          order_id?: string | null
          scanned_at?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_session_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_session_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_sessions: {
        Row: {
          ended_at: string | null
          id: string
          started_at: string
          status: string
          total_scanned: number
          user_id: string | null
          username: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string
          total_scanned?: number
          user_id?: string | null
          username?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string
          total_scanned?: number
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          subtitle: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      statistics: {
        Row: {
          id: string
          last_reset: string | null
          total_orders: number
          total_sales: number
          updated_at: string
        }
        Insert: {
          id?: string
          last_reset?: string | null
          total_orders?: number
          total_sales?: number
          updated_at?: string
        }
        Update: {
          id?: string
          last_reset?: string | null
          total_orders?: number
          total_sales?: number
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          customer_name: string
          email: string
          id: string
          message: string
          phone: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email: string
          id?: string
          message: string
          phone?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string
          id?: string
          message?: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_passwords: {
        Row: {
          id: string
          password: string
          password_type: string
          updated_at: string
        }
        Insert: {
          id?: string
          password: string
          password_type: string
          updated_at?: string
        }
        Update: {
          id?: string
          password?: string
          password_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracking_pixels: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          is_enabled: boolean
          name: string | null
          pixel_id: string
          platform: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          name?: string | null
          pixel_id: string
          platform: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          name?: string | null
          pixel_id?: string
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      treasury: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          type: string
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          type?: string
        }
        Relationships: []
      }
      ugc_photos: {
        Row: {
          caption: string
          created_at: string
          customer_name: string
          id: string
          image_url: string
          is_approved: boolean
          product_id: string | null
          sort_order: number
        }
        Insert: {
          caption?: string
          created_at?: string
          customer_name?: string
          id?: string
          image_url: string
          is_approved?: boolean
          product_id?: string | null
          sort_order?: number
        }
        Update: {
          caption?: string
          created_at?: string
          customer_name?: string
          id?: string
          image_url?: string
          is_approved?: boolean
          product_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "ugc_photos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_activity_logs: { Args: never; Returns: undefined }
      get_public_pixel_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reset_order_sequence: { Args: never; Returns: undefined }
      verify_admin_password: { Args: { _password: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      gov_zone: "internal" | "external" | "upper"
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
      app_role: ["admin", "user"],
      gov_zone: ["internal", "external", "upper"],
    },
  },
} as const
