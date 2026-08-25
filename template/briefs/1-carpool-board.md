# Brief 1 — Campus Carpool Board

## The situation

Most students live in the dorms near the main campus, but some classes run at
the remote campus. A few students drive; everyone else takes the bus or asks
around in group chats for a seat. Seats go unfilled because nobody can see who
is driving when.

## What you are building

A web app where drivers post rides and passengers book seats.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Post a ride | Driver enters date, departure time, pickup point, seats available |
| Browse rides | Upcoming rides with seats left, soonest first |
| Book a seat | Pick a ride, confirm, see it in "my rides" |
| My rides | Rides I am driving or riding in; cancel a booking |

## Suggested data

One row per ride: `id`, `driver_name`, `date`, `depart_time`, `pickup_point`,
`seats_total`.

One row per booking: `id`, `ride_id`, `passenger_name`.

## The hard part

**A car must never be oversold, and cancelling must free exactly one seat.**
The count of bookings for a ride can never exceed `seats_total`, no matter what
order people click in.

The test to write first:

> A ride with 3 seats accepts 3 bookings and refuses the 4th, with a message
> saying it is full. After one passenger cancels, the next booking is accepted.

The second sentence matters as much as the first. A common bug is a booking
counter that only goes up, so a cancelled seat is lost forever.

## If your team is fast

- **Recurring rides.** "Every Tuesday 8:00" posts itself weekly.
- **A waitlist.** A full ride queues the next passenger; a cancellation
  promotes them automatically — and your capacity test still has to hold.
- **Pickup-point map.** Streamlit has `st.map`; coordinates are enough.

## AI feature for Session 3

Let a student type *"anyone driving to the remote campus Friday morning?"* and
turn it into a filtered search — date and rough time window extracted with
structured output, then matched against real rides. A ride that does not exist
in the data must never be invented.
