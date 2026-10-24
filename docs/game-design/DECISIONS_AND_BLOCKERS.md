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
