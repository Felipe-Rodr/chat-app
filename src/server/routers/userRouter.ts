import { deleteCookie, setCookie } from 'cookies-next';
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const userRouter = createRouter()
    .query('FindUserById',{
        input: z.object({
            uid: z.string().cuid()
        }),
        async resolve({ctx, input}){
            const User = await ctx.prisma.user.findUnique({
                where:{
                    id: input.uid
                }
            })
            if(!User){
                throw new Error('Usuário não foi encontrado.')
            }
            return User;
        }
    })
    .query('findUserServers',{
        input: z.object({
            uid: z.string().cuid()
        }),
        async resolve({ctx, input}){
            const Servers = await ctx.prisma.user.findUnique({
                where:{
                    id: input.uid
                },
                select:{
                    connectedToServers: {
                        include:{
                            belongsToUser: true
                        }
                    }
                }
            });
            if(!Servers){
                throw new Error('Nenhum servidor encontrado.');
            }
            return Servers
        }
    })
    .mutation('registerUser', {
        input: z.object({
            username: z.string(),
            password: z.string()
        }),
        async resolve({ctx, input}){
            try{
                const User = await ctx.prisma.user.create({
                    data:input
                });
                if(!User){
                    throw new Error('User não pôde ser criado.');
                }
                setCookie(
                    'sessionJustChatting',
                    encodeURIComponent(User.id),
                    {
                        req: ctx.req,
                        res: ctx.res,
                        maxAge: 60*10*6,
                        sameSite: 'none',
                        secure: true,
                    }
                );
                return 'Usuário registrado com sucesso.'
            } catch {
                throw new Error("Username já está sendo usado.")
            }
        }
    })
    .mutation('LoginUser', {
        input: z.object({
            username: z.string().optional(),
            password: z.string().optional()
        }),
        async resolve({ctx, input}){
            const User = await ctx.prisma.user.findFirst({
                where: {
                    username:input.username
                }
            });
            if(!User){
                throw new Error('Usuário não existe.');
            }
            if(User.password === input.password){
                setCookie(
                    'sessionJustChatting',
                    encodeURIComponent(User.id),
                    {
                        req: ctx.req,
                        res: ctx.res,
                        maxAge: 60*10*6,
                        sameSite: 'none',
                        secure: true,
                    }
                );
                return 'Login realizado com sucesso.'
            } else {
                throw new Error('Senha incorreta.')
            }
        }
    })
    .mutation('disconnectUser',{
        resolve({ctx}){
            deleteCookie('sessionJustChatting',{
                req: ctx.req,
                res: ctx.res
            });
            return;
        }
    })