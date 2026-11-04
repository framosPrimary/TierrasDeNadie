# Registro vivo de decisiones y bloqueos — Tierras de Nadie

Fuente: cuestionario respondido por el Profe (34 respuestas, octubre 2026) y acuerdos anteriores. Estados: CONFIRMADO / NO BLOQUEANTE / BLOQUEANTE / POR REVISAR.

## Confirmaciones recientes
- D-01 CONFIRMADO: primera carta bajo terreno (Q01); después superposición libre (Q02).
- D-02 CONFIRMADO: cartas destruidas no desplazan restantes, persistentes se recalculan, inmediatos no se reactivan (Q03–04).
- D-03 CONFIRMADO: al menos 1 carta por terreno (Q05), sin máximo.
- D-04 CONFIRMADO: orden de activación arriba → abajo (Q10).
- D-05 CONFIRMADO: curación a daño 0 se pierde (Q08).
- D-06 CONFIRMADO: ventana Mercado se cierra expresamente, compras repetidas posibles (Q12, Q31).
- D-07 CONFIRMADO: carta extra se juega inmediatamente y no consume carta normal; compra múltiple y combo de oro posible (Q13–14 y conversaciones).
- D-08 CONFIRMADO: intercambio devuelve **2** cartas al rival (Q16, Q32), corrige especificación anterior.
- D-09 CONFIRMADO: sin cartas disponibles, cancelar compra de robo, no reciclar descarte (Q15).
- D-10 CONFIRMADO: 10 héroes compartidos, reparto sin duplicados; titular revelado a la vez, suplente y descartados ocultos (Q25–26).
- D-11 CONFIRMADO: iniciativa moneda, perdedor elige ronda siguiente, desempate iniciado por perdedor del sorteo (Q20).
- D-12 CONFIRMADO: catapulta sin blanco puede activar habilidad de Ingeniero (Q34), aunque no destruya nada.
- D-13 CONFIRMADO: oro se acumula dentro de ronda; se reinicia entre rondas; daño se conserva (conversaciones).
- D-14 CONFIRMADO: báculo tapado no mantiene bonificador persistente (Q29).

## Pendientes a revisar con el Profe
- B-01 **BLOQUEANTE para enroque final**: Q09/Q11 dice «siempre y cuando tenga 3 cartas en mano», contradice la regla previa: con **3 o menos** el suplente queda suspendido definitivamente. Mantener comportamiento previo solo en demo etiquetada; confirmar redacción final.
- B-02 **BLOQUEANTE para cartas reales**: faltan imágenes/textos de las 50 cartas, 10 héroes y báculos (Q21, Q27, anexos). Se permite catálogo ficticio en pruebas identificado como tal.
- B-03 **BLOQUEANTE para desempate final fiel**: Q19 indica sumar «espadas, arcos y báculos» tras nuevo empate, pero no define si se cuentan símbolos, valores o efectos/qué valor tiene cada báculo.
- B-04 **POR REVISAR**: Q01 indica primera carta deja elemento inferior y/o muralla; necesitamos dos o tres ejemplos gráficos para validar geometría exacta de cadenas y visibilidad.
- B-05 **POR REVISAR**: Q06 murallas acumulan defensa contra arco; se requiere ejemplo de daño con varios arcos y muros, particularmente si el daño combinado se aplica una vez por nuevo arco.
- B-06 **POR REVISAR**: Q23–24 «héroe retirado deja de tener efecto»; diferenciar buff pasivo de daño/curación inmediata ya aplicados, que no deberían deshacerse sin definición expresa.
- B-07 **POR REVISAR**: Q17 describe final de ronda al quedarse sin cartas en mano, mientras Q13–14 indican extras inmediatas; confirmar cómo gestionar manos aumentadas por intercambio y qué significa completar 10 jugadas normales.
- B-08 **NO BLOQUEANTE para demo local**: falta definición de empate en marcador al elegir iniciativa en rondas 2/3 (Q20).
- B-09 **POR REVISAR**: si el descarte está agotado o el mazo no alcanza para tomar 2 cartas del rival, precondiciones exactas de compras no válidas y devolución del oro.
- B-10 **POR REVISAR**: Q34 «compra sin blanco se activa y luego se anula»; confirmar si siempre consume oro y produce triggers aunque falle efecto principal.

## Política
- No presentar hipótesis como decisiones del Profe.
- Cada nuevo problema se registra aquí con origen, efecto, gravedad y fecha de resolución.
- Bloqueos reales interrumpen la función afectada; se puede continuar trabajo independiente.
- Agrupar preguntas al cierre de cada hito en revisión; tras respuesta, convertirlas a pruebas.

## Seguimiento H1 (23/10/2026)
- H1-A IMPLEMENTADO: la primera carta de cada cadena deja únicamente la cara inferior activa; el elemento superior queda tapado por el terreno. Pruebas actualizadas. Confirmación Q01.
- H1-B BLOQUEANTE para destapado fiel: el modelo actual conserva bits de visibilidad por carta y al destruir una carta simplemente la extrae del array. No reconstruye qué vecino tapaba qué elemento. Para implementar destapado correcto se necesitan ejemplos visuales de una cadena con destrucción de carta interior y de la última carta. No inventar reglas espaciales ni marcar H1 completo.
- H1-C PENDIENTE de catálogo: Q01 menciona muralla visible aun en la primera carta; el modelo actual solo registra dos caras, no representa muralla impresa como componente adicional independiente. Requiere imágenes de cartas.
- H1-D EXISTENTE: arquería/murallas por línea y orden de activación top antes que bottom en colocaciones posteriores, pendientes de casos de prueba adicionales y catálogo.

## Inventario y motor (24/10/2026)
- **B-11 BLOQUEANTE para mazo final:** PDF batalla contiene 45 imágenes individuales (16+16+13), aunque el reglamento define mazo de 50. Confirmar 5 faltantes o regla de copias. No inventarlas.
- **B-12 PENDIENTE:** los diez héroes sí figuran visualmente en el PDF, pero falta transcripción/validación exhaustiva de habilidades y timings especiales.
- **B-13 PENDIENTE:** cartas de báculos incluyen efectos y símbolos que exceden el tipo ElementType actual; requieren catálogo y ejecución por habilidad específica.
- **B-14 PENDIENTE:** la implementación UI del Mercado actualmente representa el robo rival con las primeras dos cartas rivales visibles en pruebas locales. No constituye selección secreta ni es apto para sala online.
- **D-15 IMPLEMENTADO provisional:** H2 intercambio 2 por 2, carta extra inmediata, compra de catapulta sin objetivo. Revisar tests de regresión/CI antes de dar por cerrado el hito.
- **D-16 IMPLEMENTADO:** P2 también reinicia héroe y estado temporal al cambiar ronda; el orden de inicio de siguientes rondas todavía es provisional.


## Nuevas evidencias del Profe — 04/11/2026

Fuente y casos de aceptación: `docs/game-design/PROFE_EXAMPLES_2026-11-04.md`.

- **D-17 CONFIRMADO POR EJEMPLO:** primera carta bajo terreno deja espada inferior 3 y una muralla independiente; H1 debe incorporar el atributo muralla adicional a ambas caras.
- **D-18 CONFIRMADO POR EJEMPLO:** arco 2 causa dos daños inmediatos al encadenar debajo de espada en línea sin murallas.
- **D-19 CONFIRMADO POR EJEMPLO:** báculo de +1 espada en todas las líneas, o de +1 en líneas laterales, se aplica al cierre según su texto específico y visibilidad.
- **D-20 CONFIRMADO POR VIDEO:** Cleptan aplica 2 daños al rival por `GOLD_ACTIVATED`, no por ejecución de `MARKET_PURCHASE`. Mantener el evento y mercado separados.
- **D-21 CONFIRMADO POR EJEMPLO:** catapulta destruye última carta enemiga y deja las otras en posición original; no ejecuta otra vez efectos instantáneos ya consumidos.
- **B-04 ACTUALIZADO:** ejemplos reales de cadenas e interacciones **recibidos**. Ahora queda específicamente por definir si una muralla puede estar ocluida y cómo se destapa una cara al destruir una carta interior (si fuese posible). No afirmar que toda la geometría está cerrada.
- **B-13 ACTUALIZADO:** lámina enumera ocho tipos/descripciones de báculos; ya tenemos material funcional parcial para diseñar sistema de efectos, pero aún requiere catalogación y validación contra cada carta física.
- **B-15 PENDIENTE:** báculo que prohíbe oro: ¿bloquea carta cuyo oro estaría tapado?
- **B-16 PENDIENTE:** báculo descarte hasta 3 / robo 3: ¿si se descartan 1–2 siempre se roban 3? ¿qué pasa si mazo insuficiente?
- **B-17 PENDIENTE:** confirmar si la muralla impresa defiende mientras la carta exista o puede quedar cubierta independientemente.
- **B-18 NO BLOQUEANTE:** secuencia del video (báculo lateral y Cleptan) y diagrama de 4 turnos (báculo de todas las líneas) son distintos; implementar pruebas separadas.

- **B-19 BLOQUEANTE para habilidad Cleptan:** video dice daño 2 por ACTIVACIÓN de oro, carta del PDF dice daño 2 por COMPRA en Mercado. Confirmar disparador y repetición (varias compras / Mercado abierto sin compra). Hasta entonces mantener ambas fuentes, sin codificar habilidad de Cleptan.

## Resolución B-19 (04/11/2026)

- **B-19 RESUELTO — Cleptan:** el Profe confirma **2 de daño una sola vez por turno** al encadenar carta cuyo oro se activa y habilita Mercado. **No** dispara por cada compra. La compra extra con oro durante el mismo turno no vuelve a dispararlo. Se rearmará para el turno normal siguiente. Implementación: contador de jugadas normales del jugador como marcador de turno y seguimiento de activación, con pruebas dedicadas en `src/domain/game/cleptan.test.ts`.

## Cierre técnico de candidata local 04/11/2026
- **P-01 PROVISIONAL (no bloquear demo):** cuando ronda 2/3 inicia con empate acumulado, el selector es perdedor de moneda original. No consta regla del Profe para empate previo; confirmar.
- **P-02 PROVISIONAL:** al terminar empatado el desempate de 5 cartas la demo muestra empate, en vez de resolver suma de espadas/arcos/báculos aún indeterminada.
- **P-03 PROVISIONAL:** catálogo de 50 cartas ficticias y nueve héroes demostrativos sin habilidad. La habilidad Cleptan sí tiene prueba de regla definitiva.
- **P-04 PROVISIONAL:** obligación de jugar al menos una en cada línea se verifica por historial de líneas visitadas, aunque catapulta destruya la carta colocada. Si Profe exige presencia física final, revisar.
- **QA-01 PENDIENTE para aprobación:** prueba manual completa con dos personas, en un navegador real, siguiendo `docs/development/PLAYABLE_ALPHA_V07.md`.
- **CI-01 IMPLEMENTADO:** construir y adjuntar `dist/` como artefacto, sin despliegue automático.
