-- GST CMS: one JSON document per admin collection (tours, destinations, reviews, …)
create table if not exists public.cms_documents (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cms_documents enable row level security;

-- Public site and admin both use the service role on the server.
-- Anon key has no policies → cannot read or write CMS from the browser.

create table if not exists public.cms_inquiries (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.cms_inquiries enable row level security;
