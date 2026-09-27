-- ═══════════════════════════════════════════════════════════
-- pagina-web-purgatory — tabla `almas` (contenido del 4LMA)
-- ───────────────────────────────────────────────────────────
-- Esta tabla es dueña exclusiva de la web, al revés de discord_members
-- (dueño exclusivo: el bot purgatory-sync). Guarda lo que el usuario
-- declara sobre su propio 4LMA vía el Card Builder, más los campos
-- de calidad que administra el sistema/Staff.
--
-- NO tiene columna de avatar: el avatar de la card es siempre el
-- avatar verificado de Discord (discord_members.avatar_url) — no es
-- editable acá, así que no hace falta guardarlo dos veces.
--
-- calidad/calidad_motivo no los escribe nunca el usuario directamente:
-- los deriva el servidor en cada guardado (ver getCalidadDerivada en
-- src/lib/alma.js) a partir de datos verificados (rol, booster) o de
-- una decisión de Staff ('logro', vía el panel /staff/almas).
--
-- Requiere que discord_members (definida en purgatory-sync/sql/0001_init.sql)
-- ya exista en la misma base — es la misma Postgres, dos repos.
-- ═══════════════════════════════════════════════════════════

create table if not exists almas (
  discord_id          bigint primary key references discord_members(discord_id),

  slug                text unique,

  -- Autodeclarado — el usuario lo edita desde /cuenta/editar.
  nick                text not null default '',
  era                 text not null default 'purgatory'
                        check (era in ('fosas', 'pibes', 'olympo', 'purgatory')),
  mote_superior       text not null default '',
  mote_inferior       text not null default '',
  frase_iconica       text not null default '',
  descripcion         text not null default '',

  -- Sistema / administrado — nunca llega directo desde el form del usuario.
  calidad             text not null default 'normal'
                        check (calidad in ('normal', 'shiny', 'void')),
  calidad_motivo      text
                        check (calidad_motivo in ('moderador', 'booster', 'logro') or calidad_motivo is null),

  -- Sistema — controlado por el usuario a través de un toggle simple,
  -- no por edición directa del valor 'privada' (reservado a Staff).
  estado_publicacion  text not null default 'borrador'
                        check (estado_publicacion in ('borrador', 'publicada', 'privada')),

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists almas_estado_publicacion_idx on almas (estado_publicacion);

-- El mismo rol de solo-lectura sobre discord_members (ver
-- purgatory-sync/sql/0002_web_read_role.sql) gana select+insert+update
-- SOLO sobre esta tabla. Nunca delete: un alma no se borra, a lo sumo
-- vuelve a 'borrador'. discord_members se queda de solo lectura para
-- siempre desde este mismo rol.
grant select, insert, update on almas to web_app;
