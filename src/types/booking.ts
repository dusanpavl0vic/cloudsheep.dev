/** Slobodan termin za uvodni poziv. Vreme je ISO (UTC); prikazuje se u CET i lokalno. */
export interface BookingSlot {
  id: string
  startsAt: string
  durationMin: number
}

export interface AdminBookingSlot extends BookingSlot {
  /** Upit koji je zauzeo termin — `null` je slobodan. */
  booking: { messageId: string; name: string; email: string } | null
}
