-- rooms table
create table if not exists rooms (
  id text primary key,
  code text not null unique,
  status text not null default 'lobby',
  created_at timestamp with time zone not null default now()
);

-- players table
create table if not exists players (
  id text primary key,
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  submitted_word text,
  assigned_word text,
  is_eliminated boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- optional index for room lookups
create index if not exists idx_players_room_id on players(room_id);

-- optional: allow upserts by id
create unique index if not exists idx_rooms_code on rooms(code);

-- Enable replication for realtime changes (required by Supabase row-level changes)
-- Supabase usually already has replication configured, but include for clarity:
alter table players replica identity full;
alter table rooms replica identity full;