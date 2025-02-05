# Models Tab Feature Documentation

## Overview
The Models Tab allows users to view, manage, and modify their trained LoRA models. Users can view model details, toggle model visibility (public/private), and delete models.

## API Endpoints

### Get User Models
```
GET /api/loras/user
```

**Headers Required:**
- `x-telegram-init-data`: Telegram Web App validation data (URL encoded)
- `x-telegram-user-id`: Telegram user ID
- `Content-Type`: application/json

**Response:**
```typescript
interface Response {
  databaseId: string;
  name: string;
  triggerWord: string;
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  isPublic: boolean;
  createdAt: string;
  training?: {
    steps: number;
    metadata: Record<string, any>;
  };
  config_file?: {
    url: string;
    file_name: string;
    file_size: number;
    content_type: string;
  };
  diffusers_lora_file?: {
    url: string;
    file_name: string;
    file_size: number;
    content_type: string;
  };
}
```

### Toggle Model Public Status
```
POST /api/loras/:modelId/toggle-public
```

**Headers Required:**
- `x-telegram-init-data`: Telegram Web App validation data (URL encoded)
- `x-telegram-user-id`: Telegram user ID
- `Content-Type`: application/json

**Request Body:**
```typescript
interface Request {
  isPublic: boolean;
}
```

### Delete Model
```
DELETE /api/loras/:modelId
```

**Headers Required:**
- `x-telegram-init-data`: Telegram Web App validation data (URL encoded)
- `x-telegram-user-id`: Telegram user ID

## Authentication
All endpoints require Telegram Web App authentication via the `x-telegram-init-data` header. This header must contain:
1. The raw `initData` string from Telegram's Web App
2. All required Telegram parameters (auth_date, query_id, user, hash)

## Usage Notes
- Model status determines available actions:
  - Only COMPLETED models can be toggled public/private
  - Models in TRAINING state cannot be deleted
- Model details (training parameters, config files) are optional and may not be present for all models
- Public/private toggle affects model visibility in available models list

## Error Handling
- 401: Invalid authentication - Check Telegram validation data
- 404: Model not found or not owned by user
- 500: Server error during operation