# Tierras de Nadie — Dirección artística 02: Fantasía grotesca impresa

**Fecha:** 11/11/2026. **Rama experimental:** `feat/art-direction-grotesque-print`. **Referencia:** imagen aportada por el usuario el 11/11/2026. No reproducir literalmente la composición, personajes o ilustraciones de la referencia; utilizar su lógica visual de tinta, papel, figuras imperfectas y contraste.

## Decisión de estilo

**Cambio de dirección:** la imagen de referencia no es pixel art puro. Se aproxima a cómic caricaturesco grotesco, grabado popular y collage de papel teñido. Prima una lectura física, casi teatral, en lugar de la fantasía épica iluminada con efectos digitales.

Paleta inicial (CSS; calibrar en navegador):
- Tinta y contornos: `#241a1c`.
- Papel y pergamino: `#e8d2a2`, `#d5bc91`.
- Rojo arcilla: `#b34f49`; escena nocturna violácea: `#2c2336`.
- Verde pantano: `#68775c`; polvo y desierto: `#b07a54`.
- Oro apagado: `#cf9a4e` solamente para destacar una acción, un símbolo y un costo.

## Regla visual principal

**El tablero explica el juego antes que el decorado.** Fondo menos detallado/menos contrastado; tres terrenos con aspecto diferenciado; cartas legibles de papel claro con borde oscuro; héroes a ambos lados del tablero; Mercado lateral. Prohibidos glows automáticos, halos y destellos constantes. Nada debe impedir reconocer qué mitad quedó TAPADA.

## Personajes

Medievales caricaturescos **no hegemónicos**: edades variadas, cuerpos desiguales, posturas cansadas, narices prominentes, dentaduras irregulares, ropa remendada, expresiones cómicas y ambigüedad moral. Evitar estereotipos ofensivos, idealización heroica uniforme y rostros idénticos. Cada retrato tendrá una silueta reconocible incluso a tamaño chico.

## Recursos para producir (en este orden)

1. **Sistema base** (primer paso implementado): variables de color, bordes de tinta, jerarquía tipográfica, botones de pergamino, panel de Mercado, estilos para carta con mitad superior/inferior.
2. **Tablero físico:** placas ilustradas separadas para los tres terrenos y escenografía apagada detrás; evitar dibujar todo en una única imagen.
3. **Héroes:** bocetos de dos perfiles muy distintos primero, validar dirección con Profe y usuario antes de producir los diez.
4. **Iconografía de reglas:** espada, arco, escudo, oro, muro, catapulta, curación, báculo; cada ícono debe funcionar en monocromo y en su color distintivo.
5. **Cartas reales:** marcos compartidos y capas de ilustración por carta, montadas sobre datos de juego; no convertir cada carta en imagen rígida imposible de modificar.
6. **Mercado y transición de turnos:** acciones accesibles con mouse o touch, información visible del costo y consecuencias; sin agregar animación por puro espectáculo.

## Implementación en esta rama

- `src/artDirection.css`: **skin experimental funcional** sobre la UI existente. No cambia reglas, animaciones ni posiciones de cadenas.
- `src/main.tsx`: importa la hoja de estilo al final, de forma que puede quitarse sin tocar `styles.css`.
- No se modifican ilustraciones del Profe, la lógica de cartas ni DigitalOcean.
- El prototipo de producción en la rama `feat/m0-m1-domain-core` no cambia por estos commits.
- Los retratos/escenarios SVG actuales siguen siendo placeholders; en esta etapa solo cambia su encuadre cromático.

## Criterios de aceptación del Profe

- Sin instrucciones, puede identificar qué carta pertenece a qué jugador, qué terreno ocupa y cuál mitad está tapada.
- No se pierde legibilidad al encadenar más de cuatro cartas.
- Rival y jugador se diferencian sin tener que leer etiquetas técnicas.
- El diseño tiene identidad caricaturesca/sucia y no parece un juego de fantasía heroica genérico.
- Las tres zonas principales (tablero, mano, personajes) se distinguen aun en pantalla mediana.
- La ausencia de glow es intencional y no debe sustituirse por un filtro luminoso global.

## Siguiente revisión

Comparar esta skin con el mismo estado del motor base en navegador, recopilar capturas de pantalla y notas de usuario/Profe; ajustar espaciado/contraste y recién después diseñar ilustraciones definitivas. **No desplegar sin revisión separada.**
