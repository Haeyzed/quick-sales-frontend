export interface Unit {
    id: string
    unit_code: string
    unit_name: string
    base_unit?: string | null
    operator?: "*" | "/" | null
    operation_value?: number | null
    created_at?: string
    updated_at?: string
  }
  