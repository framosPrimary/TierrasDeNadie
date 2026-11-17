# Sprint de diseño 01 — Interfaz de batalla artesanal

**Fecha:** 17/11/2026
**Rama aislada:** `feat/art-direction-grotesque-print`
**Base:** motor experimental existente en `feat/m0-m1-domain-core`.
**Estado:** entrega técnica de diseño, sin revisión visual humana y sin despliegue en DigitalOcean.

## Objetivo

Volver el tablero del Profe más legible y reconocible como videojuego de cartas 1v1, siguiendo la referencia enviada: cómic medieval grotesco, materiales de pergamino, tinta oscura y rojo arcilla, personajes poco heroizados. Evitar glows, superficies excesivamente brillantes o un único fondo decorativo que absorba todos los controles.

## Funcionalidades implementadas en esta rama

- **Skin independiente** `src/artDirection.css`, importada después de `styles.css`; puede retirarse o ajustarse sin editar reglas.
- **Jerarquía de la mesa:** fondo apagado, terreno diferenciado, cartas claras con contorno oscuro, manos y Mercado en sus propios planos.
- **Mano**: mejora visual de selección, resaltado y vista previa compacta de la carta elegida antes de encadenarla.
- **Tutorial plegable:** el ejemplo del Profe permanece accesible pero ya no ocupa espacio constante durante la partida.
- **Mercado ilustrado por componentes** en `src/components/MarketPanel.tsx`: puesto de pergamino, monedero de oro disponible, tres compras principales, dos apartados de trueque, vista previa de carta que va a descartarse y costes visibles.
- **Validación de accesibilidad/interacción en Mercado:** botones de compra deshabilitados si falta oro; selección de dos cartas para devolver y preservación de la posibilidad de devolver las cartas obtenidas del rival.
- **Reglas de motor sin cambios** en esta etapa. La compra de carta extra continúa jugando directamente según la mecánica provisional anterior; cambiar su presentación a fase de elección en mano sigue pendiente.
- **Tests de Mercado visual:** `src/components/MarketPanel.test.tsx`.

## Criterios de aceptación — revisión próxima

1. Identificar de un vistazo la zona del rival, terrenos, mano, héroe y Mercado.
2. Comprender el estado de cada mitad visible o tapada en cadenas de cuatro o más cartas.
3. Poder escoger una carta desde la mano con el mouse/dedo sin perder de vista dónde se va a encadenar.
4. Abrir el Mercado y entender los cinco tipos de compra y sus costes antes de seleccionar una opción.
5. Los controles deshabilitados explican visualmente que la compra no está disponible.
6. Probar la interfaz en PC y celular; observar especialmente scroll de cadenas y mano.
7. Confirmar que la estética se siente artesanal, grotesca y poco artificial.
8. Reproducir la ronda y compras que el Profe había revisado para comprobar ausencia de regresiones funcionales.

## Pendientes del sprint/etapa siguiente

- Diseñar retratos originales finales: primero dos personajes grotescos para validar escala y tono; solo después diez héroes.
- Ilustrar tres terrenos como escenas autónomas, de bajo contraste, sin aplanar cartas y personajes en la misma imagen.
- Diseño detallado de iconos de espada, arco, escudo, muro, báculo, curación, oro y catapulta.
- Implementar subfase visual para la compra de carta extra: verla en la mano y elegir colocación inmediata, sin consumir jugada normal; consultar al Profe si desea reservarla para un turno distinto.
- Mejorar interacción real del intercambio con el rival: ahora los candidatos enemigos siguen siendo los primeros dos de la mano, solución únicamente válida como demo local.
- Preview real de superposición antes de confirmar la jugada; gestos drag-and-drop no implementados todavía.
- Capturar pantallas desde navegador de PC/celular y pedir aprobación; **CI verde no significa aprobación estética ni prueba manual**.
- No incorporar assets de la imagen de referencia como imagen de fondo ni copiar sus personajes; el diseño actual es un sistema CSS reutilizable.

## Entrega / despliegue

**No se ha actualizado DigitalOcean.** La rama de motor continúa como referencia estable. Cuando los cambios visuales pasen revisión humana, podremos hacer PR o integrar de forma controlada. Construir con `npm install --no-package-lock && npm run typecheck && npm test && npm run build`.

No llamar a esta entrega «juego visual final» ni desplegarla sin autorización del propietario.
