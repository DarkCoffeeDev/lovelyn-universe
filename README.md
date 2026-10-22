# Lovelyn Universe

Un regalo de Eddy para Jocelyn. 22 parejas de anime, escenas de día y noche, cartas, matching icons descargables y canciones de Spotify por pareja.

## Uso

`npm run check` valida los archivos. `npm run build` prepara la carpeta `dist/`. En Vercel, importar este repositorio; la configuración está en `vercel.json`.

Los textos se editan en `chapters.js`. `node export-texts.mjs` genera la lista para revisarlos.

La música usa el reproductor de Spotify: la reproducción depende de Spotify, la cuenta y los permisos del navegador. Puede requerir tocar Play al cambiar de pareja.

Las imágenes se incluyen en matching.tar.gz, photos.tar.gz y scenes.tar.gz. El build las extrae automáticamente (requiere tar, disponible en Vercel).
