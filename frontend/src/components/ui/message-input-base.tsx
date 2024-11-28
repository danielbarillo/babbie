import * as React from "react"
import { Input } from "./input"
import { Button } from "./button"

interface MessageInputProps {
  onSubmit: (content: string) => Promise<void>
  placeholder?: string
  maxLength?: number
  disabled?: boolean
}

export const MessageInputBase = React.forwardRef<HTMLInputElement, MessageInputProps>(
  ({ onSubmit, placeholder = "Skriv ett meddelande...", maxLength = 500, disabled }, ref) => {
    const [content, setContent] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!content.trim() || isSubmitting) return

      try {
        setIsSubmitting(true)
        setError("")
        await onSubmit(content.trim())
        setContent("")
      } catch (error: any) {
        setError(error.message || "Failed to send message")
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={ref}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={isSubmitting || disabled}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting || disabled}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Skicka
          </Button>
        </form>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </div>
    )
  }
)

MessageInputBase.displayName = "MessageInputBase"