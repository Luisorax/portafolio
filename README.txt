Luis Piñero Álvarez — web bilingüe lista para GitHub + Netlify

Qué hay aquí
- Web bilingüe elegante: español e inglés
- URLs limpias:
  /, /sobre-mi, /trabajo, /servicios, /contacto
  /en, /en/about, /en/work, /en/services, /en/contact
- Nombre corregido: Luis Piñero Álvarez
- Sección Filosofía eliminada
- CMS Decap preparado en /admin

Cómo subirlo a GitHub
1. Borra o reemplaza en tu repo los archivos antiguos.
2. Sube TODO el contenido de esta carpeta a la raíz del repo.
3. Haz commit y push.
4. Netlify redeployará automáticamente.

Para que /admin funcione
1. En Netlify > Identity > Enable Identity
2. En Netlify > Identity > Services > Enable Git Gateway
3. Invita tu email desde Identity > Invite users
4. Entra en /admin y accede con tu email

Importante
- En content/site.json cambia el valor:
  "formspree_endpoint": "https://formspree.io/f/your-form-id"
  por tu endpoint real si quieres que el formulario envíe mensajes.
- Los enlaces internos ya usan rutas limpias, sin .html.

Archivos principales
- index.html
- about.html
- work.html
- services.html
- contact.html
- styles.css
- script.js
- _redirects
- content/site.json
- admin/index.html
- admin/config.yml
- netlify.toml
