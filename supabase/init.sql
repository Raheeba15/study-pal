-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using ( auth.uid() = id );

-- Create a trigger to automatically create profiles for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();