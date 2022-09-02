import { z } from 'zod'
import { createRouter } from '../createRouter'

export const profileRouter = createRouter()
    .query('findProfileById',{
        input: z.object({
            uid: z.string().cuid()
        }),
        async resolve({ctx, input}){
            const Profile = await ctx.prisma.profile.findUnique({
                where:{
                    belongsToUserId: input.uid
                }
            })
            if(!Profile){
                throw new Error('Perfil não encontrado');
            }
            return Profile;
        }
    })