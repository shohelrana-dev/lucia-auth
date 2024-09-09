import 'server-only'
import { z, ZodError, ZodType } from 'zod'
import { validateRequest } from './auth'
import { ActionError, ActionErrorSerialize } from './error'

type ActionFn = (input?: { [key: string]: string }) => Promise<any>
type ActionResult = [{ message: string }, null] | [null, ActionErrorSerialize]

export function createServerAction() {
    let zodSchema: ZodType
    let isAuthRequire = false

    function authRequire(this: ReturnType<typeof createServerAction>) {
        isAuthRequire = true
        return this
    }

    function schema(this: ReturnType<typeof createServerAction>, schema: ZodType) {
        zodSchema = schema
        return this
    }

    function handler(actionFn: ActionFn) {
        return async (input: z.infer<typeof zodSchema>): Promise<ActionResult> => {
            try {
                //Authentication check
                if (isAuthRequire) {
                    const { user } = await validateRequest()
                    if (!user) {
                        return [null, new ActionError('Unauthorized', 'UNAUTHORIZED').serialize()]
                    }
                }

                //validate input
                const parsedInput = zodSchema ? await zodSchema.parseAsync(input) : input

                //execute action with parsed input
                const result = await actionFn(parsedInput)

                //return success result
                return [result, null]
            } catch (err: any) {
                //handle zod validation error
                if (err instanceof ZodError) {
                    return [
                        null,
                        new ActionError('Invalid form input.', 'INPUT_VALIDATION_ERROR').serialize(),
                    ]
                }
                //handle action error
                if (err instanceof ActionError) {
                    return [null, err.serialize()]
                }
                //handle other errors
                return [null, new ActionError(err.message, 'ERROR').serialize()]
            }
        }
    }

    return {
        authRequire,
        schema,
        handler,
    }
}
