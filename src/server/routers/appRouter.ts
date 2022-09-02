import { createRouter } from '../createRouter'
import { messageRouter } from './messageRouter';
import { serverRouter } from './serverRouter';
import { userRouter } from './userRouter';


export const appRouter = createRouter()
    .merge('user.', userRouter)
    .merge('server.', serverRouter)
    .merge('message.', messageRouter)
;
// export type definition of API
export type AppRouter = typeof appRouter;