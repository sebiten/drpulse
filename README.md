# DRPulse

Website en español para DRPulse, implementada con TypeScript, Vite y CSS. Sin backend ni analítica.

## Desarrollo

```sh
npm install
npm run dev
```

`npm run build` verifica TypeScript y genera `dist/`. `npm run preview` sirve la compilación.

## Contenido

- Descripción, compatibilidad y comandos contrastados con https://legacy.curseforge.com/wow/addons/drpulse el 13 de octubre de 2026.
- CurseForge indicaba que el proyecto estaba pendiente de aprobación. Actualizar el aviso de instalación cuando se publique.
- La demo de DR es conceptual y no representa la interfaz ni los temporizadores reales del addon.
- Emblema original proporcionado por el autor, sin modificar el archivo.
- Fuentes alojadas localmente mediante Fontsource.

## Recursos

`public/arena.png`: ilustración creada con la herramienta integrada image_gen. Prompt: arena circular de piedra de fantasía oscura, pilares góticos a la derecha, montañas y niebla azul acero, espacio negativo oscuro a la izquierda, sin personajes, texto, logotipos ni interfaz. Ilustración ambiental, no captura del juego.

## Verificación

Compilación y TypeScript correctos. Revisión en navegador de portada y móvil; secuencia 100/50/25/inmune, reinicio, categorías, búsqueda con y sin resultados, copia al portapapeles, acordeón y menú móvil. Sin errores de consola observados.
