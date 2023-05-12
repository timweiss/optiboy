create table entries (
    id serial primary key,
    email text not null,
    source text,
    confirmed boolean default false,
    confirmation_key text,
    created_at timestamp default current_timestamp,
    updated_at timestamp
);