import {
  MessageSquare,
  Image as ImageIcon,
  Video,
  FileImage,
  Type,
  Hash,
  Mail,
  Phone,
  Calendar,
  Star,
  MousePointerClick,
} from 'lucide-react'

export const BUBBLE_BLOCKS = [
  { type: 'text-bubble', label: 'Text', icon: MessageSquare },
  { type: 'image-bubble', label: 'Image', icon: ImageIcon },
  { type: 'video-bubble', label: 'Video', icon: Video },
  { type: 'gif-bubble', label: 'GIF', icon: FileImage },
]

export const INPUT_BLOCKS = [
  { type: 'text-input', label: 'Text', icon: Type },
  { type: 'number-input', label: 'Number', icon: Hash },
  { type: 'email-input', label: 'Email', icon: Mail },
  { type: 'phone-input', label: 'Phone', icon: Phone },
  { type: 'date-input', label: 'Date', icon: Calendar },
  { type: 'rating-input', label: 'Rating', icon: Star },
  { type: 'buttons-input', label: 'Buttons', icon: MousePointerClick },
]

export const ALL_BLOCKS = [...BUBBLE_BLOCKS, ...INPUT_BLOCKS]

export function getBlockMeta(type) {
  return ALL_BLOCKS.find((b) => b.type === type)
}

export function getBlockGroup(type) {
  if (BUBBLE_BLOCKS.find((b) => b.type === type)) return 'bubble'
  if (INPUT_BLOCKS.find((b) => b.type === type)) return 'input'
  return null
}
