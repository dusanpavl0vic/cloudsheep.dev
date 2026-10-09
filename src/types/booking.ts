/** Slobodan termin za uvodni poziv. Vreme je ISO (UTC); prikazuje se u CET i lokalno. */
export interface BookingSlot {
  id: string
  startsAt: string
  durationMin: number
}

export interface AdminBookingSlot extends BookingSlot {
  /** Upit koji drži termin — `null` je slobodan. `confirmed: false` — čeka potvrdu adrese (24 h). */
  booking: { messageId: string; name: string; email: string; confirmed: boolean } | null
}
