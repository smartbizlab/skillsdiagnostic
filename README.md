# Skills Diagnóstico — Smart Business

## Deploy en Vercel (3 pasos)

### Opción A: Deploy directo desde GitHub (recomendado)

1. **Sube el proyecto a GitHub**
   - Crea un repositorio nuevo en github.com
   - Sube todos estos archivos

2. **Conecta con Vercel**
   - Ve a vercel.com e inicia sesión
   - Clic en "Add New Project"
   - Importa el repositorio de GitHub
   - Vercel detecta Vite automáticamente
   - Clic en "Deploy"

3. **Listo**
   - Vercel te da una URL tipo `skills-diagnostico.vercel.app`
   - Puedes agregar tu dominio personalizado en Settings → Domains

---

### Opción B: Deploy con Vercel CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Dentro de la carpeta del proyecto
npm install
vercel

# Sigue las instrucciones del CLI
```

---

## Desarrollo local

```bash
npm install
npm run dev
# Abre http://localhost:5173
```

## Build de producción

```bash
npm run build
# Los archivos quedan en /dist
```

---

## Personalización

- **CTAs de compra**: busca `"Ver Pack completo"` y `"Obtener solo la primera Skill"` en `src/App.jsx` y agrega los `href` de tus páginas de venta
- **Formulario GHL**: el ID del formulario está en `GHL_FORM_ID` al inicio de `src/App.jsx`
- **Colores**: el objeto `C` al inicio del archivo tiene todos los tokens de color
