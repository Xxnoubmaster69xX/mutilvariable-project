import React from 'react';

export default function PrintView() {
  return (
    <div className="print-only max-w-4xl mx-auto bg-white text-black p-10 font-serif leading-relaxed">
      {/* Portada */}
      <div className="text-center mb-24">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Universidad Autónoma de Coahuila (UAdeC)</h1>
        <h2 className="text-xl font-semibold mb-16">Facultad de Sistemas</h2>
        
        <div className="border-t-2 border-b-2 border-blue-900 py-6 my-16">
          <h3 className="text-2xl font-bold">TEMA: Análisis de Diferencia Total</h3>
        </div>

        <div className="my-16 space-y-4">
          <p className="font-bold">Asignatura: Cálculo Multivariable</p>
          <p className="font-bold">Actividad Integradora (10%)</p>
        </div>

        <div className="my-16">
          <h4 className="font-bold text-lg mb-4">EQUIPO 3</h4>
          <p>David Eduardo Lara Flores</p>
          <p>Cindy Roselyn Herrera Rodriguez</p>
          <p>Brayan Elias Calzoncit Berlanga</p>
        </div>

        <div className="mt-24">
          <p className="font-bold">Fecha de entrega: 20 de marzo de 2026</p>
        </div>
      </div>

      <div className="page-break"></div>

      {/* Introducción */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">Introducción</h2>
        <p className="mb-4">
          El cálculo multivariable permite analizar sistemas donde múltiples factores interactúan y cambian simultáneamente. Uno de los conceptos fundamentales para este análisis es el <strong>diferencial total</strong>.
        </p>
        <p className="mb-4">
          <strong>¿Qué es?</strong> El diferencial total de una función de varias variables es una aproximación lineal que representa el cambio neto en la variable dependiente (salida) resultante de pequeños incrementos en las variables independientes (entradas).
        </p>
        <p className="mb-4">
          <strong>¿Cómo se usa y aplica?</strong> En ingeniería y física, rara vez se altera una sola variable de un sistema de forma aislada. El diferencial total se aplica para estimar la propagación de errores en mediciones, optimizar procesos, o predecir cómo reaccionará un sistema (como un gas, un circuito o una estructura) ante fluctuaciones simultáneas en su entorno. En lugar de recalcular toda la función desde cero, este método utiliza las tasas de cambio instantáneo (derivadas parciales) para proporcionar una estimación rápida y altamente precisa.
        </p>
        <p className="mb-4">
          <strong>Fórmula general:</strong> Para una función de dos variables <em>z = f(x,y)</em>, la fórmula matemática del diferencial total está dada por:
        </p>
        <div className="text-center my-6 text-lg">
          <em>dz = (∂z/∂x)dx + (∂z/∂y)dy</em>
        </div>
        <p className="mb-4">
          Donde <em>∂z/∂x</em> y <em>∂z/∂y</em> son las derivadas parciales que miden la sensibilidad de la función respecto a cada variable, y <em>dx, dy</em> representan los pequeños cambios en dichas variables.
        </p>
      </div>

      {/* Desarrollo */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">Desarrollo</h2>
        <p className="mb-4">
          <strong>Planteamiento del problema:</strong> La presión, volumen y temperatura de un mol de un gas ideal están relacionados mediante la ecuación <em>PV = 8.31T</em>. Usando el diferencial total, se estimará el cambio aproximado en la presión si el volumen pasa de 12 a 12.3 litros y la temperatura disminuye de 310 a 305 °K.
        </p>

        <h3 className="font-bold mt-6 mb-2">1. Identificación de variables expuestas:</h3>
        <ul className="list-disc pl-8 mb-4 space-y-2">
          <li><em>P</em>: Presión del gas ideal (medida en kilopascales, kPa). Variable dependiente.</li>
          <li><em>V</em>: Volumen del gas (medido en litros, L). Variable independiente.</li>
          <li><em>T</em>: Temperatura del gas (medida en grados Kelvin, °K). Variable independiente.</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2">2. Definición de la función y los incrementos:</h3>
        <p className="mb-2">Despejando la presión <em>P</em> en términos de <em>V</em> y <em>T</em>, obtenemos la función principal:</p>
        <div className="text-center my-4 text-lg">
          <em>P(V,T) = 8.31T / V</em>
        </div>
        <p className="mb-2">Determinamos los valores iniciales y calculamos sus respectivos diferenciales (cambios):</p>
        <div className="pl-8 mb-4">
          <p>Volumen inicial (<em>V</em>) = 12 L &nbsp; ⇒ &nbsp; <em>dV</em> = 12.3 - 12 = 0.3 L</p>
          <p>Temperatura inicial (<em>T</em>) = 310 °K &nbsp; ⇒ &nbsp; <em>dT</em> = 305 - 310 = -5 °K</p>
        </div>

        <h3 className="font-bold mt-6 mb-2">3. Cálculo de derivadas parciales:</h3>
        <p className="mb-2">Derivamos la función <em>P</em> con respecto al volumen <em>V</em> y a la temperatura <em>T</em>:</p>
        <div className="text-center my-4 text-lg space-y-2">
          <p><em>∂P/∂V = -8.31T / V²</em></p>
          <p><em>∂P/∂T = 8.31 / V</em></p>
        </div>
        <p className="mb-2">Evaluamos ambas derivadas utilizando las condiciones iniciales del sistema (<em>V</em> = 12, <em>T</em> = 310):</p>
        <div className="text-center my-4 text-lg space-y-2">
          <p><em>∂P/∂V = -8.31(310) / (12)² = -2576.1 / 144 ≈ -17.8896</em></p>
          <p><em>∂P/∂T = 8.31 / 12 ≈ 0.6925</em></p>
        </div>

        <h3 className="font-bold mt-6 mb-2">4. Aplicación del diferencial total:</h3>
        <p className="mb-2">Adaptamos la fórmula general a nuestras variables físicas y sustituimos los valores obtenidos:</p>
        <div className="text-center my-4 text-lg space-y-2">
          <p><em>dP = (∂P/∂V)dV + (∂P/∂T)dT</em></p>
          <p><em>dP ≈ (-17.8896)(0.3) + (0.6925)(-5)</em></p>
          <p><em>dP ≈ -5.36688 - 3.4625</em></p>
        </div>

        <div className="bg-blue-900 text-white p-4 text-center rounded my-6">
          <p className="font-bold">Resultado Final</p>
          <p className="text-2xl mt-2"><em>dP ≈ -8.82938 kPa</em></p>
        </div>
      </div>

      {/* Conclusiones */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">Conclusiones</h2>
        <p className="mb-4">
          Al aplicar el método de diferencial total, obtuvimos como resultado matemático un cambio de <em>dP ≈ -8.83 kilopascales</em>.
        </p>
        <p className="mb-4">
          <strong>Interpretación en el contexto del problema:</strong> El signo negativo en el resultado indica que la presión neta del gas ideal disminuyó. Físicamente, este comportamiento tiene un profundo sentido termodinámico debido a la combinación de dos factores que ocurrieron simultáneamente en el sistema:
        </p>
        <ol className="list-decimal pl-8 mb-4 space-y-2">
          <li>El aumento en el volumen (<em>dV</em> = +0.3 L) permite que el gas se expanda en un espacio mayor, lo que reduce la fuerza que las partículas ejercen sobre las paredes del recipiente, provocando una caída de presión.</li>
          <li>La disminución de la temperatura (<em>dT</em> = -5 °K) significa que las partículas del gas perdieron energía cinética. Al moverse más lento, chocan con menor fuerza contra las paredes, generando una segunda caída de presión.</li>
        </ol>
        <p className="mb-4">
          Dado que ambas acciones contribuyen a la descompresión del sistema, los efectos se suman negativamente, resultando en la caída de presión estimada de 8.83 kPa. Este método demostró ser una herramienta matemática sumamente eficaz para aproximar comportamientos termodinámicos complejos de forma ágil y estructurada.
        </p>
      </div>

      {/* Bibliografía */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">Bibliografía</h2>
        <ul className="list-disc pl-8 mb-4 space-y-2">
          <li>Hernández Ovalle, R. M., & Flores González, L. <em>Formulario de Cálculo Multivariable</em>. Universidad Autónoma de Coahuila.</li>
          <li>Stewart, J. (2012). <em>Cálculo de varias variables: Trascendentes tempranas</em> (7a. ed.). Cengage Learning.</li>
        </ul>
      </div>
    </div>
  );
}
