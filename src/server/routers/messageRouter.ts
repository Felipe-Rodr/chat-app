import { deleteCookie, setCookie } from 'cookies-next';
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const messageRouter = createRouter()
    .query('findAllMessages',{
        input: z.object({
            sid: z.string().cuid()
        }),
        async resolve({ctx, input}){
            const Messages = await ctx.prisma.message.findMany({
                where:{
                    belongsToServerId: input.sid
                },
                include:{
                    sentFromUser:{
                        select:{
                            username:true
                        }
                    }
                }
            })
            if(!Messages){
                throw new Error('Nenhuma mensagem no server.');
            }
            return Messages;
        }
    })
    .mutation('sendMessage',{
        input: z.object({
            content: z.string(),
            sid: z.string().cuid(),
            uid: z.string().cuid()
        }),
        async resolve({ctx, input}){
            const Message = ctx.prisma.message.create({
                data:{
                    content: input.content,
                    belongsToServerId: input.sid,
                    sentFromUserId: input.uid
                }
            });
            if(!Message){
                throw new Error('Mensagem não pôde ser enviada.')
            }
            return Message
        }
    })