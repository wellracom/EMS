'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

interface Props {
  onApply?: (from: Date, to: Date) => void
}

export default function DateTimeRangePicker({ onApply }: Props) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState({
    top: true,
    left: true,
  })
  const [startDate, setStartDate] = useState<Date | null>(
    subMonths(new Date(), 1)
  )
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  const [startView, setStartView] = useState(subMonths(new Date(), 1))
  const [endView, setEndView] = useState(new Date())

  const [startHour, setStartHour] = useState('00')
  const [startMinute, setStartMinute] = useState('00')

  const [endHour, setEndHour] = useState('23')
  const [endMinute, setEndMinute] = useState('59')

  // =========================
  // VALIDATION (STRICT)
  // =========================
  const isInvalidRange = useMemo(() => {
    if (!startDate || !endDate) return false
    return startDate.getTime() > endDate.getTime()
  }, [startDate, endDate])

  const canApply = !isInvalidRange && startDate && endDate
  useEffect(() => {
    if (!open || !wrapperRef.current) return

    const rect = wrapperRef.current.getBoundingClientRect()

    const spaceRight = window.innerWidth - rect.left
    const spaceBottom = window.innerHeight - rect.bottom

    setPosition({
      left: spaceRight > 900, // popup width
      top: spaceBottom > 500, // popup height
    })
  }, [open])
  // =========================
  // NORMALIZE SAFE RANGE
  // =========================
  const normalizeRange = (a: Date, b: Date) => {
    return a.getTime() <= b.getTime() ? [a, b] : [b, a]
  }

  // =========================
  // BUILD MONTH
  // =========================
  const buildMonth = (base: Date) => {
    const start = startOfMonth(base)
    const end = endOfMonth(base)

    const days: Date[] = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }
    return days
  }

  // =========================
  // RANGE HELPERS
  // =========================
  const isStart = (d: Date) =>
    startDate && d.toDateString() === startDate.toDateString()

  const isEnd = (d: Date) =>
    endDate && d.toDateString() === endDate.toDateString()

  const isBetween = (d: Date) => {
    if (!startDate || !endDate) return false

    const t = d.getTime()
    return (
      t > Math.min(startDate.getTime(), endDate.getTime()) &&
      t < Math.max(startDate.getTime(), endDate.getTime())
    )
  }

  // =========================
  // CALENDAR RENDER (SMOOTH RANGE)
  // =========================
  const renderCalendar = (days: Date[], onSelect: (d: Date) => void) => (
    <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
      {days.map((day) => {
        const start = isStart(day)
        const end = isEnd(day)
        const middle = isBetween(day)

        return (
          <div
            key={day.toISOString()}
            onClick={() => onSelect(day)}
            className={`/* MIDDLE RANGE (SMOOTH BLOCK) */ relative cursor-pointer py-2 transition-all duration-150 ${middle ? 'bg-blue-100' : ''} /* START */ ${start ? 'rounded-l-full bg-blue-600 text-white' : ''} /* END */ ${end ? 'rounded-r-full bg-blue-600 text-white' : ''} /* SINGLE DAY FIX */ ${start && end ? 'rounded-full' : ''} hover:bg-blue-200`}
          >
            {day.getDate()}

            {/* smooth ring marker */}
            {(start || end) && (
              <div className="absolute inset-0 rounded-full opacity-70 ring-2 ring-blue-400" />
            )}
          </div>
        )
      })}
    </div>
  )

  // =========================
  // APPLY
  // =========================
  const handleApply = () => {
    if (!canApply || !startDate || !endDate) return

    const [fromBase, toBase] = normalizeRange(startDate, endDate)

    const from = new Date(fromBase)
    const to = new Date(toBase)

    from.setHours(Number(startHour))
    from.setMinutes(Number(startMinute))
    from.setSeconds(0)

    to.setHours(Number(endHour))
    to.setMinutes(Number(endMinute))
    to.setSeconds(59)

    onApply?.(from, to)
    console.log({ from, to })
    setOpen(false)
  }

  const startDays = buildMonth(startView)
  const endDays = buildMonth(endView)

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const years = Array.from({ length: 20 }).map(
    (_, i) => new Date().getFullYear() - 10 + i
  )

  return (
    <div ref={wrapperRef} className="relative w-fit">
      {/* TRIGGER */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded border px-4 py-2 shadow dark:text-white"
      >
        {startDate ? format(startDate, 'dd MMM yyyy') : 'Start'} →{' '}
        {endDate ? format(endDate, 'dd MMM yyyy') : 'End'}
      </div>

      {/* ERROR MESSAGE */}
      {isInvalidRange && (
        <div className="mt-2 text-sm font-medium text-red-500">
          ❌ Start date tidak boleh lebih besar dari End date
        </div>
      )}

      {/* POPUP */}
      {open && (
        <div
          className={`absolute z-50 w-[900px] rounded-xl border bg-white p-4 shadow-2xl ${position.top ? 'top-12' : 'bottom-12'} ${position.left ? 'left-0' : 'right-0'} `}
        >
          <div className="flex gap-6">
            {/* START */}
            <div className="flex-1">
              <div className="flex gap-2">
                <select
                  value={startView.getMonth()}
                  onChange={(e) =>
                    setStartView(
                      new Date(
                        startView.getFullYear(),
                        Number(e.target.value),
                        1
                      )
                    )
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={startView.getFullYear()}
                  onChange={(e) =>
                    setStartView(
                      new Date(Number(e.target.value), startView.getMonth(), 1)
                    )
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {renderCalendar(startDays, setStartDate)}
            </div>

            {/* END */}
            <div className="flex-1">
              <div className="flex gap-2">
                <select
                  value={endView.getMonth()}
                  onChange={(e) =>
                    setEndView(
                      new Date(endView.getFullYear(), Number(e.target.value), 1)
                    )
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={endView.getFullYear()}
                  onChange={(e) =>
                    setEndView(
                      new Date(Number(e.target.value), endView.getMonth(), 1)
                    )
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {renderCalendar(endDays, setEndDate)}
            </div>
          </div>

          {/* TIME */}
          <div className="mt-4 grid grid-cols-2 gap-6 border-t pt-4">
            <div>
              <div className="mb-2 font-medium">Start Time</div>
              <div className="flex gap-2">
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i}>{String(i).padStart(2, '0')}</option>
                  ))}
                </select>

                <span>:</span>

                <select
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  {Array.from({ length: 60 }).map((_, i) => (
                    <option key={i}>{String(i).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-2 font-medium">End Time</div>
              <div className="flex gap-2">
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i}>{String(i).padStart(2, '0')}</option>
                  ))}
                </select>

                <span>:</span>

                <select
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  {Array.from({ length: 60 }).map((_, i) => (
                    <option key={i}>{String(i).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-4 flex justify-end gap-2 border-t pt-4">
            <button
              onClick={() => setOpen(false)}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              disabled={!canApply}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
