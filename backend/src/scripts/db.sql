create table users (
    id_user serial primary key,
    nombre varchar(20) not null,
    apellido varchar(20) not null,
    carrera varchar(100) not null,
    email varchar(100) not null,
    foto_user text
);

create table forms (
    id_form serial primary key,
    id_user int not null references users(id_user) on delete cascade,
    materia varchar(100) not null,
    tema varchar(100) not null,
    descripcion varchar(255) not null,
    tipo varchar(12) not null
    foto_form text
);

create table reviews (
    id_reviews serial primary key,
    id_form int not null references forms(id_form) on delete cascade,
    id_puntuado int not null references users(id_user),
    id_puntuador int not null references users(id_user),
    aura int not null,
    descripcion varchar(255) not null
);

insert into users (nombre, apellido, carrera, email) values ('esteban', 'ordoñez', 'ing informatica', 'eordonez@fi.uba.ar'),

insert into forms (id_user, materia, tema, descripcion, tipo) values (2, 'introCamejo', 'el backend', 'mil vueltas', 'mentor')

insert into reviews (id_form, id_puntuado, id_puntuador, aura, descripcion) values (1, 1, 2, 10, 'gran tipazo')