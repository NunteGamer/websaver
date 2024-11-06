# websaver
Un sitio web programado en JavaScript que permite guardar sitios web para su acceso más tarde. Las webs se almacenan en un excel, que contiene sus nombres, URLs y tags para encontrarlos mejor.
También dispone de categorías (WIP).

## Funcionamiento
Lo que es el HTML como tal es muy simple, consta solamente del título, las fuentes de texto, el título y subtítulo y, por último (precisamente lo más importante) el _main_.
El HTML añade el _script.js_, que tiene todo lo que hace que el sitio funcione. Este hace verdadero uso del _main_.

### Explicación del código JavaScript
El script comienza por lanzar un _fetch_ al archivo _sitios.csv_, el cual contiene todos los sitios web. Este archivo comienza con las siguientes columnas: _name_, _url_, _description_ y _tags_.
El _name_ indica el nombre que se mostrará para representar la web. _url_ contiene la web a la que va a llevar; _description_, su descripción y, lo que más ayuda, **_tags_**, que contiene etiquetas separadas por puntos.

Ejemplo de _tags_: 
```
minecraft.generator.commands.mobs.vanilla
```
Estas sirven para poder encontrar cosas si no sabes el nombre exacto. Si quieres encontrar una web que generaba comandos de mobs para Minecraft, puedes buscar por _"mobs"_ y aún así podrás encontrarlo.

> [!NOTE]  
> Los tags **están ocultos ante el usuario** No pueden ser vistos sin entrar al _.csv_.