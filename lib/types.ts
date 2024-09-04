export interface ActionResult {
    status: 'success' | 'error'
    message: string
    data?: any
}
