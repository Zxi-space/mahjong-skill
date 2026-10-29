import { Input, Text, View } from '@tarojs/components'
import './style.scss'
export interface MjInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  error?: string
}
export function MjInput({ value, onChange, label, placeholder, maxLength = 50, disabled = false, error }: MjInputProps) {
  return <View className='mj-input-field'>
    {label ? <Text className='mj-input-field__label'>{label}</Text> : null}
    <Input
      className={`mj-input-field__control ${error ? 'mj-input-field__control--error' : ''}`}
      type='text'
      value={value}
      placeholder={placeholder}
      maxlength={maxLength}
      disabled={disabled}
      onInput={event => onChange(event.detail.value)}
    />
    {error ? <Text className='mj-input-field__error'>{error}</Text> : null}
  </View>
}
