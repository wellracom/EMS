'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/dist/style.css'

interface Props {
  value?: Date
  onChange?: (date: Date) => void
}

export default function DateTimePicker({ value, onChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date())

  const [hour, setHour] = useState(
    selectedDate.getHours().toString().padStart(2, '0')
  )

  const [minute, setMinute] = useState(
    selectedDate.getMinutes().toString().padStart(2, '0')
  )

  const handleDateChange = (date?: Date) => {
    if (!date) return

    date.setHours(Number(hour))
    date.setMinutes(Number(minute))

    setSelectedDate(date)
    onChange?.(date)
  }

  const handleTimeChange = (newHour: string, newMinute: string) => {
    const newDate = new Date(selectedDate)

    newDate.setHours(Number(newHour))
    newDate.setMinutes(Number(newMinute))

    setHour(newHour)
    setMinute(newMinute)

    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  return (
    <div className="w-fit rounded-lg border bg-white p-4 shadow-md">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
      />

      <div className="mt-4 flex gap-2">
        <select
          className="rounded border px-2 py-1"
          value={hour}
          onChange={(e) => handleTimeChange(e.target.value, minute)}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <option key={i} value={i.toString().padStart(2, '0')}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>

        <span>:</span>

        <select
          className="rounded border px-2 py-1"
          value={minute}
          onChange={(e) => handleTimeChange(hour, e.target.value)}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <option key={i} value={i.toString().padStart(2, '0')}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {format(selectedDate, 'dd/MM/yyyy HH:mm')}
      </div>
    </div>
  )
}
