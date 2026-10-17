# DRPulse

Website de DRPulse en inglés con traducciones completas a español, alemán, francés y portugués. Implementada con TypeScript, Vite y CSS, sin backend. El idioma se determina por la URL: `/`, `/es/`, `/de/`, `/fr/` y `/pt/`.

## Desarrollo

```sh
npm install
npm run dev
```

`npm run build` verifica TypeScript y genera `dist/`. `npm run preview` sirve la compilación.

## SEO y carga inicial

La compilación genera HTML completo por idioma mediante `vite.config.ts` y el render compartido de `src/page.ts`. `src/seo.ts` centraliza el dominio público, títulos, descripciones, contenido sobre la alternativa a Diminish, canonical, hreflang y datos estructurados. Si cambia el dominio, actualizar `siteUrl` y la comprobación en `scripts/verify-seo.ts` antes de compilar.

Publicar todo `dist/`, incluidos los directorios de idiomas, `sitemap.xml` y `robots.txt`. El hosting debe servir los `index.html` de cada idioma, sin reescribirlos todos al HTML inglés. Enviar el sitemap a Google Search Console tras publicar; los cambios no garantizan una posición ni indexación inmediata.

La home usa variantes WebP del emblema (96, 320, 512 y 768 px), fondo WebP para móvil y escritorio, precarga del fondo y favicon pequeño. Los PNG originales se conservan como fuentes, pero no se solicitan en la home. Fondo de escritorio: 94.172 bytes; móvil: 34.650 bytes; logo de 512 px: 9.084 bytes.

Comprobar el HTML de los cinco idiomas después de compilar con `node --experimental-strip-types scripts/verify-seo.ts` (Node 22.6+).

## Contenido

- Descripción y compatibilidad contrastadas con https://curseforge.com/wow/addons/drpulse el 13 de octubre de 2026. Comandos actualizados a `/drpulse` por indicación del autor; esta web no modifica el código Lua del addon.
- CurseForge indicaba que el proyecto estaba pendiente de aprobación. Actualizar el aviso de instalación cuando se publique.
- La demo de DR es conceptual y no representa la interfaz ni los temporizadores reales del addon.
- Emblema original proporcionado por el autor, sin modificar el archivo.
- Fuentes alojadas localmente mediante Fontsource.

## Recursos

`public/icons/`: iconos de habilidades de World of Warcraft obtenidos de `https://wow.zamimg.com/images/wow/icons/large/`. Los nombres de archivo conservan su identificador de origen. Arte del juego de Blizzard Entertainment; representaciones visuales de las categorías, no una lista de hechizos verificados para esta versión. Se alojan localmente para evitar peticiones externas durante la navegación.

La barra de habilidades de la portada abre la categoría correspondiente en la demo. Las traducciones están centralizadas y tipadas en `src/locales.ts`.

`public/arena.png`: ilustración creada con la herramienta integrada image_gen. Prompt: arena circular de piedra de fantasía oscura, pilares góticos a la derecha, montañas y niebla azul acero, espacio negativo oscuro a la izquierda, sin personajes, texto, logotipos ni interfaz. Ilustración ambiental, no captura del juego.

## Verificación

Compilación y TypeScript correctos. Revisión en navegador de portada y móvil; secuencia 100/50/25/inmune, reinicio, categorías, búsqueda con y sin resultados, copia al portapapeles, acordeón y menú móvil. Sin errores de consola observados.
