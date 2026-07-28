# Catálogo de maquetas de Heraclio Rodríguez García

Sitio estático desarrollado con Astro, TypeScript y Tailwind CSS para presentar, ordenar y publicar como catálogo permanente la colección de maquetas de madera de Heraclio Rodríguez García.

La web está pensada como archivo digital de patrimonio y artesanía, no como tienda online. Todo el contenido vive en archivos Markdown y carpetas de imágenes, de forma que añadir una nueva maqueta no exige modificar el diseño.

## 1. Qué incluye este proyecto

- Portada con imagen destacada, presentación del autor, selección de obras y estadísticas automáticas.
- Página de biografía con trayectoria, técnicas, materiales y proceso.
- Catálogo completo con búsqueda instantánea y filtros por municipio, tipo, año y provincia.
- Página independiente para cada maqueta con galería, datos técnicos, historia, comparación con edificio original y mapa cuando existe identificación fiable.
- SEO automático: títulos, descripciones, URLs amigables, Open Graph y datos estructurados.
- Scripts para sincronizar imágenes históricas, optimizarlas y crear nuevas fichas.
- Despliegue automático en GitHub Pages mediante GitHub Actions.

## 2. Estructura del proyecto

```text
MAQUETAS/catalogo-heraclio/
  content/
    biografia/
      heraclio-rodriguez-garcia.md
    maquetas/
      _plantilla.md
      casa-de-las-conchas.md
      ...
  public/
    imagenes/
      casa-de-las-conchas/
      torre-catedral-nueva-salamanca/
      ...
    generated/
      manifest.json
    logo.svg
  scripts/
    create-maqueta.mjs
    optimize-images.mjs
    seed_legacy_content.py
    sync-legacy-media.mjs
  src/
    components/
    layouts/
    lib/
    pages/
    styles/
  astro.config.ts
  package.json
  README.md
```

## 3. Requisitos previos

Necesita instalar lo siguiente en el equipo donde vaya a mantener la web:

1. Node.js 22 o superior.
2. npm, que se instala con Node.js.
3. Python 3.11 o superior solo si quiere regenerar el contenido inicial a partir del archivo histórico.
4. Una cuenta de GitHub para publicar en GitHub Pages.

Para comprobar si Node.js y npm están instalados:

```powershell
node --version
npm --version
```

## 4. Instalación paso a paso

Abra una terminal en la carpeta del proyecto:

```powershell
cd MAQUETAS/catalogo-heraclio
```

Instale las dependencias:

```powershell
npm install
```

Si quiere reconstruir el contenido inicial desde el archivo histórico ya incluido en la carpeta MAQUETAS/FOTOS y los documentos del proyecto, puede ejecutar:

```powershell
npm run seed:legacy
```

Ese comando:

- genera los Markdown iniciales,
- crea la biografía base,
- copia imágenes claras desde la carpeta histórica al nuevo formato `public/imagenes/<slug>`.

## 5. Cómo ejecutar la web en local

Una vez instaladas las dependencias:

```powershell
npm run dev
```

Abra en el navegador la dirección que Astro mostrará en pantalla, normalmente:

```text
http://localhost:4321
```

## 6. Cómo preparar las imágenes optimizadas

El sitio puede funcionar con las imágenes tal cual están en `public/imagenes`, pero para mejorar rendimiento y Lighthouse conviene generar variantes optimizadas:

```powershell
npm run optimize:images
```

Ese comando:

- crea copias `webp` y `avif`,
- genera una imagen de respaldo `jpg`,
- actualiza `public/generated/manifest.json`.

## 7. Cómo publicar en GitHub Pages

### Paso 1. Crear un repositorio en GitHub

Para publicar en `https://github.com/safuen/heraclio`, el repositorio debe contener directamente el contenido de esta carpeta:

```text
MAQUETAS/catalogo-heraclio
```

Es decir, en GitHub la raíz del repositorio debe tener archivos como:

```text
.github/workflows/deploy.yml
package.json
astro.config.ts
src/
content/
public/
```

No suba todo `Vcode` ni deje el proyecto anidado dentro de `MAQUETAS/catalogo-heraclio` en el propio repositorio, porque GitHub Actions no detectaría bien esa estructura.

El repositorio puede llamarse:

```text
heraclio
```

### Paso 2. Activar GitHub Pages

En GitHub:

1. Entre en `Settings`.
2. Abra la sección `Pages`.
3. En `Build and deployment`, seleccione `GitHub Actions`.

No hace falta crear el workflow manualmente porque ya está incluido en `.github/workflows/deploy.yml`.

### Paso 3. Hacer un commit en la rama principal

Cada vez que haga un `push` a `main`, GitHub:

1. instalará dependencias,
2. sincronizará imágenes,
3. optimizará las imágenes,
4. generará el sitio estático,
5. lo publicará en GitHub Pages.

La URL publicada será:

```text
https://safuen.github.io/heraclio/
```

### Paso 4. Ajustar la URL del sitio

Revise el archivo [src/site.config.ts](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/src/site.config.ts).

Por defecto:

- en GitHub Actions se calcula la ruta base automáticamente a partir del nombre del repositorio,
- en local se usa como ejemplo `https://usuario.github.io`.

Si publica en un dominio propio, cambie la URL en [src/site.config.ts](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/src/site.config.ts). El archivo `robots.txt` se genera automáticamente a partir de esa configuración.

## 8. Cómo añadir una nueva maqueta sin tocar el diseño

Esta es la parte más importante del proyecto.

### Método manual recomendado

1. Copie una carpeta con las fotos a `public/imagenes/<slug-de-la-maqueta>/`.
2. Duplique el archivo [content/maquetas/_plantilla.md](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/content/maquetas/_plantilla.md).
3. Renómbrelo como `mi-maqueta.md`.
4. Rellene los campos del encabezado.
5. Escriba la descripción debajo.
6. Guarde el archivo.
7. Ejecute `npm run optimize:images`.
8. Haga commit y push.

### Método guiado por comando

También puede crear la ficha y la carpeta de imágenes con un solo comando:

```powershell
npm run create:maqueta -- --slug iglesia-san-martin --title "Iglesia de San Martín" --municipality "Salamanca" --province "Salamanca" --type "Iglesia"
```

Ese comando:

- crea `content/maquetas/iglesia-san-martin.md`,
- crea `public/imagenes/iglesia-san-martin/`.

Después solo tiene que copiar las fotos dentro de la carpeta y completar el texto.

## 9. Cómo añadir nuevas fotografías

1. Abra la carpeta de la maqueta en `public/imagenes/<slug>/`.
2. Copie dentro las fotos nuevas.
3. Si una foto debe ser la principal, indique su nombre exacto en el campo `heroImage` del Markdown.
4. Si una foto corresponde al edificio original, indique su nombre exacto en `originalImage`.
5. Ejecute `npm run optimize:images` para regenerar las variantes optimizadas.

Consejo práctico:

- use nombres sencillos, por ejemplo `fachada-principal.jpg`, `detalle-torre.jpg`, `edificio-original.jpg`.

## 10. Cómo modificar la biografía

Edite el archivo [content/biografia/heraclio-rodriguez-garcia.md](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/content/biografia/heraclio-rodriguez-garcia.md).

Puede cambiar:

- el resumen,
- los hitos de trayectoria,
- las técnicas,
- los materiales,
- el proceso,
- el texto largo explicativo.

## 11. Cómo cambiar los colores

Edite el archivo [src/styles/global.css](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/src/styles/global.css).

Las variables principales están al principio del archivo:

```css
:root {
  --color-ink: #211a16;
  --color-wood: #6e4b31;
  --color-wood-deep: #513320;
  --color-stone: #c5b5a1;
  --color-stone-deep: #a18a71;
  --color-parchment: #f6f0e7;
  --color-parchment-dark: #e6dccd;
  --color-accent: #8d6739;
}
```

Si cambia esos valores, el resto del diseño se adaptará automáticamente.

## 12. Cómo cambiar el logotipo

Sustituya el archivo [public/logo.svg](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/public/logo.svg).

Si quiere usar otro formato, por ejemplo PNG:

1. copie el nuevo archivo a `public/`,
2. cambie las referencias en [src/layouts/BaseLayout.astro](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/src/layouts/BaseLayout.astro) y [src/components/Header.astro](c:/Users/safue/Vcode/MAQUETAS/catalogo-heraclio/src/components/Header.astro).

## 13. Cómo cambiar una imagen destacada

La portada toma como imagen principal la primera maqueta destacada con fotografía válida.

Para decidir qué obras se muestran como destacadas:

1. abra el Markdown de la maqueta,
2. cambie `featured: true` o `featured: false`.

## 14. Cómo funciona el catálogo

El catálogo se genera automáticamente leyendo todos los archivos Markdown de `content/maquetas`.

Cada vez que añade una ficha nueva, el sistema actualiza:

- las tarjetas,
- las páginas individuales,
- la búsqueda,
- los filtros,
- las estadísticas,
- el sitemap,
- los metadatos SEO.

No es necesario modificar plantillas ni rutas manualmente.

## 15. Campos principales de cada maqueta

En cada archivo Markdown puede usar estos campos:

- `title`: nombre de la maqueta.
- `slug`: URL amigable.
- `summary`: resumen breve.
- `municipality`: localidad.
- `province`: provincia.
- `buildingType`: tipo de edificio.
- `category`: `religioso`, `civil`, `detalle` o `costumbrista`.
- `featured`: si aparece destacada en portada.
- `yearCreated`: año de realización, si se conoce.
- `dimensions`: dimensiones, si existen.
- `scale`: escala, si se conoce.
- `materials`: materiales usados.
- `constructionTime`: tiempo de construcción.
- `heroImage`: imagen principal.
- `originalImage`: foto del edificio original.
- `originalImageSource`: procedencia de la foto original.
- `originalImageCaption`: aclaración de la comparación.
- `originalStillExists`: si el edificio sigue existiendo.
- `mapQuery`: texto para Google Maps.
- `originalBuildingHistory`: historia fiable del edificio.

## 16. Accesibilidad y SEO

El proyecto está preparado con estas decisiones:

- estructura semántica de encabezados,
- contraste alto,
- navegación por teclado,
- enlace de salto al contenido,
- imágenes con texto alternativo generado y editable,
- páginas estáticas para mejor rendimiento,
- metadatos Open Graph,
- datos estructurados Schema.org.

Para mantener un nivel WCAG 2.2 AA correcto, recuerde:

1. no subir imágenes esenciales sin contexto,
2. escribir resúmenes claros,
3. no inventar historia ni datos técnicos,
4. completar `originalImageSource` cuando se use una imagen del edificio original.

## 17. Comandos útiles

```powershell
npm install
npm run dev
npm run build
npm run check
npm run download:facebook
npm run sync:media
npm run optimize:images
npm run seed:legacy
npm run create:maqueta -- --slug ejemplo
```

## 18. Descarga de álbumes de Facebook

La extracción pública de Facebook se guarda en:

- `external/facebook-albums/albums.json`: inventario crudo de álbumes y fotos detectadas.
- `external/facebook-albums/download-summary.json`: resumen de descargas por álbum.
- `external/facebook-albums/<album>/`: imágenes descargadas y `metadata.json`.

Para relanzar la descarga de las URLs ya detectadas:

```powershell
npm run download:facebook
```

Importante:

- Facebook puede limitar parte del contenido visible cuando no hay sesión iniciada.
- En ese caso, el resumen puede indicar que el álbum declara más elementos de los que realmente deja listar públicamente.
- El script descarga todo lo que se ha podido detectar con acceso público y deja constancia de ello en `download-summary.json`.

## 19. Limitaciones actuales

- El proyecto no usa base de datos, por diseño.
- Algunas fichas iniciales aún necesitan revisión manual para completar datos técnicos o reclasificar imágenes heterogéneas del archivo histórico.
- La página de Facebook no ofrece extracción fiable sin sesión, por lo que la migración parte sobre todo de los dosieres locales, la web antigua y las carpetas fotográficas.

## 20. Recomendación de mantenimiento

Cuando incorpore una nueva maqueta, siga siempre este orden:

1. Crear o duplicar la ficha Markdown.
2. Copiar las fotografías.
3. Ejecutar `npm run optimize:images`.
4. Revisar localmente con `npm run dev`.
5. Hacer commit y push.
Así evita romper enlaces, imágenes o metadatos.