export interface Unit {
    id: string
    name: string
    code: string
    base_unit?: string | null
    operator?: "*" | "/" | null
    operation_value?: number | null
    created_at?: string
    updated_at?: string
  }
  