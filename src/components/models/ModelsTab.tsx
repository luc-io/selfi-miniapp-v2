import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Star, Loader2 } from 'lucide-react'
import type { LoraModel } from '@/types/lora'
import { getAvailableLoras } from '@/api/loras'

export function ModelsTab() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [models, setModels] = useState<LoraModel[]>([])

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true)
        const loras = await getAvailableLoras()
        setModels(loras.filter(lora => lora.isPublic))
      } catch (error) {
        console.error('Error loading models:', error)
        setError('Failed to load models')
      } finally {
        setIsLoading(false)
      }
    }
    loadModels()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <div className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <div className="p-6 text-center text-red-500">{error}</div>
      </Card>
    )
  }

  if (!models.length) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <div className="p-6 text-center text-gray-500">No public models available</div>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <div className="p-6">
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
                {model.user?.username && (
                  <p className="text-sm text-muted-foreground">
                    Created by: {model.user.username}
                  </p>
                )}
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
    </Card>
  )
}