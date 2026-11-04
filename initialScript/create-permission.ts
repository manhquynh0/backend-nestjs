import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module.js'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { HTTPMethod } from '../src/generated/prisma/enums.js'
const prisma = new PrismaService()
const permissionInDb = await prisma.permission.findMany({
    where: {
        deletedAt: null
    }
})

async function bootstrap() {
    // 1. Khởi tạo app theo cách của bạn
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] })
    await app.init() // Hoặc await app.listen(3001), dùng init() để không bị treo terminal sau khi chạy xong

    const server = app.getHttpAdapter().getInstance()
    const router = server.router

    // 2. Lấy danh sách routes từ router.stack theo code của bạn
    const availableRoutes: { path: string, method: HTTPMethod, name: string, description: string }[] = router.stack
        .map((layer: any) => {
            if (layer.route) {
                const method = layer.route?.stack[0].method.toUpperCase() as HTTPMethod
                const path = layer.route?.path as string
                return {
                    path: path,
                    method: method,
                    name: method + ' ' + path,
                    description: method + ' ' + path
                }
            }
        })
        .filter((item: any) => item !== undefined && item.path !== '/')
    console.log(availableRoutes, 'availableRoutes')
    // const permissionInDbMap = permissionInDb.reduce((acc, item) => {
    //     acc[`${item.method}-${item.path}`] = item
    //     return acc
    // }, {} as Record<string, typeof permissionInDb[number]>)
    const permissionInDbMap = new Map(permissionInDb.map((item) => {
        return [`${item.method}-${item.path}`, item]
    }))
    const availableRoutesMap = new Map(availableRoutes.map((item) => {
        return [`${item.method}-${item.path}`, item]
    }))

    console.log(permissionInDbMap, 'permissionInDbMap')
    console.log(availableRoutesMap, 'availableRoutesMap')
    // tim permission khong co trong availbleRoutes ma co trong permissionDb =>  xoa 
    const permissionToDelete = [...permissionInDbMap.keys()].filter((item) => !availableRoutesMap.has(item))
    console.log(permissionToDelete, 'permissionToDelete')
    // const availableRoutesMap: string[] = availableRoutes.map((item: any) => item.path)

    // const result = await prisma.permission.createMany({
    //     data: availableRoutes,
    //     skipDuplicates: true,
    // })


    if (permissionToDelete.length > 0) {
        const result = await prisma.permission.deleteMany({
            where: {
                id: {
                    in: permissionToDelete.map((item) => permissionInDbMap.get(item)!.id)
                }
            }
        })
        console.log(result)
    }

    // tim routes ma co trong availbeRoutes ma khong co trong permissionInDb
    const routesToAdd = availableRoutes.filter((item) => !permissionInDbMap.has(`${item.method}-${item.path}`))
    if (routesToAdd.length > 0) {
        const result = await prisma.permission.createMany({
            data: routesToAdd.map((item) => {
                return {
                    name: item.name,
                    description: item.description,
                    method: item.method,
                    path: item.path
                }
            })
        })
        console.log(result)
    }
    process.exit(0)
}
bootstrap()
