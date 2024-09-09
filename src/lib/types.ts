export type ActionResult =
    | [null, { message: string; data?: any }]
    | [{ message: string; data?: any }, null]
