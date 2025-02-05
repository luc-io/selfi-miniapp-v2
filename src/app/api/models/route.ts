import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const models = await prisma.loraModel.findMany({
      where: {
        isPublic: true,
      },
      include: {
        baseModel: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    })

    const formattedModels = models.map((model) => ({
      databaseId: model.databaseId,
      name: model.name,
      triggerWord: model.triggerWord,
      status: model.status,
      isPublic: model.isPublic,
      starsRequired: model.starsRequired,
      baseModelPath: model.baseModel.modelPath,
      creatorUsername: model.user.username,
      previewImageUrl: model.previewImageUrl,
    }))

    return NextResponse.json(formattedModels)
  } catch (error) {
    console.error('Error fetching models:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}