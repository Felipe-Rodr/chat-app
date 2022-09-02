import { deleteCookie, setCookie } from 'cookies-next';
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const serverRouter = createRouter()
    .query('findServerById', {
        input: z.object({
            sid: z.string().cuid()
        }),
        async resolve({ctx, input}){
            const Server = await ctx.prisma.server.findUnique({
                where:{
                    belongsToUserId: input.sid
                },
                include:{
                    connectedUsers: {
                        select:{
                            username:true
                        }
                    }
                }
            });
            if(!Server){
                throw new Error('Server não encontrado.');
            }
            return Server;
        }
    })
    .mutation('createServerForOwnerUser', {
        input: z.object({
            uid: z.string().cuid(),
            name: z.string()
        }),
        async resolve({ctx, input}){
            const Server = await ctx.prisma.server.create({
                data:{
                    name: input.name,
                    belongsToUserId: input.uid,
                },
            });
            if(!Server){
                throw new Error('Erro na criação do servidor.')
            }
            setCookie(
                'sessionJustChatting',
                encodeURIComponent(input.uid),
                {
                    req: ctx.req,
                    res: ctx.res,
                    maxAge: 60*10*6,
                    sameSite: 'none',
                    secure: true,
                }
            );
            return 'Servidor criado com sucesso!'
        }
    })
    .mutation('AddUserToServer', {
        input: z.object({
            sid: z.string().cuid(),
            name: z.string()
        }),
        async resolve({ctx, input}){
            const User = await ctx.prisma.user.findUnique({
                where:{
                    username: input.name
                }
            })
            if(!User){
                throw new Error('Usuário não foi encontrado.');
            }
            const Server = await ctx.prisma.server.update({
                where:{
                    belongsToUserId: input.sid
                },
                data:{
                    connectedUsers:{
                        connect:[{
                            username: input.name
                        }]
                    }
                },
            });
            if(!Server){
                throw new Error('Usuário não pôde ser adicionado ao servidor.')
            }
            setCookie(
                'sessionJustChatting',
                encodeURIComponent(input.sid),
                {
                    req: ctx.req,
                    res: ctx.res,
                    maxAge: 60*10*6,
                    sameSite: 'none',
                    secure: true,
                }
            );
            return 'Usuário adicionado ao servidor com sucesso!'
        }
    })