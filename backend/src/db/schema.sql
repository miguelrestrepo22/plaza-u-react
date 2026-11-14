-- Esquema de la base de datos de Plaza U (PostgreSQL).
-- Se ejecuta al arrancar el servidor; es seguro repetirlo porque todo usa IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS usuarios (
  id        text PRIMARY KEY,
  nombre    text NOT NULL,
  email     text NOT NULL UNIQUE,
  pass_hash text NOT NULL,                       -- hash bcrypt, nunca la clave
  rol       text NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('estudiante', 'admin')),
  carrera   text NOT NULL DEFAULT '',
  whatsapp  text NOT NULL DEFAULT '',
  negocio   text NOT NULL DEFAULT '',
  creado    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id          text PRIMARY KEY,
  owner_id    text NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre      text NOT NULL,
  categoria   text NOT NULL,
  precio      integer NOT NULL CHECK (precio >= 0),
  stock       integer NOT NULL CHECK (stock >= 0),  -- el inventario nunca baja de cero
  descripcion text NOT NULL,
  imagen      text NOT NULL DEFAULT '/fotos/suculentas.jpg',
  creado      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cursos (
  id          text PRIMARY KEY,
  owner_id    text NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo      text NOT NULL,
  categoria   text NOT NULL,
  nivel       text NOT NULL,
  precio      integer NOT NULL CHECK (precio >= 0),
  cupos       integer NOT NULL CHECK (cupos >= 0),
  horario     text NOT NULL,
  duracion    text NOT NULL,
  descripcion text NOT NULL,
  temario     jsonb NOT NULL DEFAULT '[]',
  imagen      text NOT NULL DEFAULT '/fotos/react.jpg',
  creado      timestamptz NOT NULL DEFAULT now()
);

-- Los pedidos guardan una "foto" de los productos (items) para conservar el historial,
-- por eso no tienen llaves foráneas: si se borra un producto o un usuario, el pedido sigue ahí.
CREATE TABLE IF NOT EXISTS pedidos (
  id           text PRIMARY KEY,
  comprador_id text NOT NULL,
  vendedor_id  text NOT NULL,
  items        jsonb NOT NULL,
  total        integer NOT NULL,
  comision     integer NOT NULL,
  pago         text NOT NULL,
  estado       text NOT NULL DEFAULT 'Nuevo'
               CHECK (estado IN ('Nuevo', 'Preparando', 'En camino', 'Entregado', 'Cancelado')),
  cliente      jsonb NOT NULL,
  creado       timestamptz NOT NULL DEFAULT now(),
  actualizado  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inscripciones (
  id         text PRIMARY KEY,
  curso_id   text NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  usuario_id text NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  precio     integer NOT NULL,
  comision   integer NOT NULL,
  pago       text NOT NULL,
  creado     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (curso_id, usuario_id)                   -- nadie se inscribe dos veces al mismo curso
);

CREATE TABLE IF NOT EXISTS config (
  clave text PRIMARY KEY,
  valor text NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS pedido_seq START 1001;

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);
CREATE INDEX IF NOT EXISTS idx_pedidos_comprador ON pedidos (comprador_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_vendedor ON pedidos (vendedor_id);

INSERT INTO config (clave, valor) VALUES ('comision_porcentaje', '10') ON CONFLICT DO NOTHING;
