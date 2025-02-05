'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface LoraModel {
  databaseId: string
  name: string
  triggerWord: string
  weightsUrl: string | null
  configUrl: string | null
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED'
  previewImageUrl: string | null
  isPublic: boolean
  starsRequired: number
  baseModelPath: string
  creatorUsername: string | null
}

async function fetchModels(): Promise<LoraModel[]> {
  const response = await fetch('/api/models')
  if (!response.ok) {
    throw new Error('Failed to fetch models')
  }
  return response.json()
}

export function ModelsPage() {
  const { data: models, isLoading, error } = useQuery<LoraModel[]>({
    queryKey: ['models'],
    queryFn: fetchModels,
  })

  if (isLoading) return <div className="p-4">Loading models...</div>
  if (error) return <div className="p-4 text-red-500">Error loading models</div>
  if (!models?.length) return <div className="p-4">No public models available</div>

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Community Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.databaseId} className="p-4">
            {model.previewImageUrl && (
              <img
                src={model.previewImageUrl}
                alt={model.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{model.name}</h2>
                <Badge variant="secondary">
                  <Star className="w-4 h-4 mr-1" />
                  {model.starsRequired}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Trigger word: <code className="bg-muted px-1 rounded">{model.triggerWord}</code>
              </p>
              {model.creatorUsername && (
                <p className="text-sm text-muted-foreground">
                  Created by: {model.creatorUsername}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Base model: {model.baseModelPath}
              </p>
              <Badge 
                variant={model.status === 'COMPLETED' ? 'success' : 'secondary'}
                className="mt-2"
              >
                {model.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}