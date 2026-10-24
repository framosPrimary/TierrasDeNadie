# Pipeline de assets — material del Profe (24/10/2026)

## Estado y fuentes
Los documentos fuente recibidos son `CARTAS BATALLA IA.pdf` (3 páginas; **45 imágenes de cartas de batalla**) y `CARTAS HEROES IA.pdf` (1 página; **10 imágenes de héroes**), más una imagen de tablero y una del Mercado. Se inspeccionaron visualmente y se contaron objetos de imagen incrustados en cada PDF: 16+16+13 cartas; 10 héroes. **No equivale todavía al mazo reglamentario de 50 cartas.**

Estos diseños son **provisionales y válidos como placeholders**. No deben tratarse como arte final ni como reglas de motor verificadas. Fuente de verdad de reglas: `docs/game-design/RULES.md`; pendientes: `docs/game-design/DECISIONS_AND_BLOCKERS.md`.

## Flujo de trabajo del diseñador
1. Conservar originales sin modificar; no republicar automáticamente material final.
2. Extraer las imágenes individuales de los PDFs (herramienta recomendada `pdfimages -j`, evita rasterización innecesaria y conserva los píxeles fuente).
3. Enumerar provisionalmente `battle_001...` y `heroes_001...`; no asumir que ese orden es identificador definitivo, ni duplicar cartas para llegar a 50.
4. Catalogar separado del arte: id, página, coordenada/orden, cara superior, cara inferior, valores, presencia de muralla/adorno intermedio, báculo, texto visible, notas y estado de validación.
5. Revisión humana de textos finos y de cada símbolo; elevar dudas al Profe. No usar OCR como fuente única.
6. UI prototipo: usar PNG/JPG/WEBP para ilustraciones y SVG para íconos; datos de efectos en JSON/TypeScript.
7. Mantener los identificadores estables cuando se rehaga el arte; sustituir sólo archivos de presentación.
8. Entregar formatos de producción y especificaciones al agente diseñador; conservar archivos editables originales cuando estén disponibles.

## Convenciones de formato
- Fuente: PDF/JPG/PNG del Profe; originales preservados.
- Runtime web: WEBP o PNG para imágenes, SVG para símbolos/interfaz; JSON/TS para valores y efectos.
- Diseño editable posterior: SVG (vector), Figma/Inkscape u otro formato fuente que acuerde el diseñador.
- Resolución: no escalar el material del Profe suponiendo que es de alta resolución; exportar tamaños acorde con dimensiones reales extraídas.
- UI: diseño adaptable a móvil y escritorio, sin fijar rígidamente la lógica a dimensiones de pantalla.
- Accesibilidad: números y símbolos deben seguir siendo legibles sobre cada ilustración; no confiar sólo en el color.

## Carpetas propuestas
```
assets/source/{battle,heroes,board,market}/
assets/processed/{battle,heroes}/
public/assets/{cards,heroes,board,ui}/
src/data/{battleCards,heroes,staffs}.json
```
No incorporar PDFs completos al bundle runtime. El primer paquete de imágenes extraídas se ha preparado como ZIP de trabajo local para revisión; **no está aún subido al repositorio**.

## Inventario observado
- 45 cartas físicas de batalla identificables como imágenes separadas. Falta confirmar 5 hasta completar 50, o composición exacta del mazo.
- 10 fichas visuales de héroe; transcripción reglamentaria pendiente de control.
- Báculos aparecen como componentes en cartas de batalla, no necesariamente como mazo separado.
- Algunas cartas muestran muros divisores como motivo de diseño; si constituyen murallas jugables independientes debe confirmarse mediante ejemplos del Profe.

## Bloqueos y siguientes pasos
- No inventar las cinco cartas que faltan ni cantidades de copias.
- Preparar catálogo legible por máquina de las 45 observadas; no asignar habilidades de báculo en código sin verificación.
- Validar con el Profe cómo se destapan elementos y qué parte de los muros ilustrados es un elemento persistente.
- La creación de arte final queda fuera del hito de motor; no requiere nuevas ilustraciones para testear la partida.
