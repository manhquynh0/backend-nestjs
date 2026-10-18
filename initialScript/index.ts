import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { roleName } from '~/shared/constanst/role.constants.js'
import { HashsingService } from '~/shared/services/hashsing.service.js'
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})
const prisma = new PrismaClient({ adapter })

const main = async () => {
    const roleCount = await prisma.role.count()
    if (roleCount > 0) {
        throw new Error('Roles already exist')
    }
    const roles = await prisma.role.createMany({
        data: [
            {
                name: 'admin',
                description: 'Admin role'
            },
            {
                name: 'user',
                description: 'User role'
            },
            {
                name: 'seller',
                description: 'Seller role'
            }
        ]
    })
    const adminRole = await prisma.role.findFirstOrThrow({
        where: {
            name: roleName.Admin
        }
    })
    const hashingService = new HashsingService()
    const hasPassword = await hashingService.hash(process.env.ADMIN_PASSWORD!)
    const adminUser = await prisma.user.create({
        data: {
            name: process.env.ADMIN_NAME!,
            email: process.env.ADMIN_EMAIL!,
            password: hasPassword,
            roleId: adminRole.id,
            phoneNumber: process.env.ADMIN_PHONE_NUMBER!,
        }
    })
    return {
        createdRoleCount: roles.count,
        adminUser
    }

}
main().then(({ adminUser, createdRoleCount }) => {
    console.log('Roles created:', createdRoleCount)
    console.log('Admin user created:', adminUser)
    prisma.$disconnect()
}).catch((error) => {
    console.error(error)
    prisma.$disconnect()
})