function calcular() {
    // Obtener valores del formulario
    const capitalInicial = parseFloat(document.getElementById("capital").value);
    const interesTradeRepublicAnual = parseFloat(document.getElementById("interesTrade").value) / 100;
    const interesRevolutAnual = parseFloat(document.getElementById("interesRevolut").value) / 100;
    const impuestos = document.getElementById("impuestos").value === "Si";
    const impuesto = 0.19;
    const frecuencia = document.getElementById("frecuencia").value;

    // Interés mensual y diario
    const interesTradeRepublicMensual = interesTradeRepublicAnual / 12;
    const interesRevolutDiario = interesRevolutAnual / 365;

    // Cálculo para Trade Republic (interés compuesto mensual) TOFIX: TENER EN CUENTA QUE EN TRADE EL MAXIMO CAPITAL ES 50.000 Y EN REVOLUT 100.000
    let capitalInicialTradeRepublic;
    let alertaTradeRepublic = '';
    if (capitalInicial > 50000) {
        capitalInicialTradeRepublic = 50000;
        alertaTradeRepublic = 'Los intereses han sido aplicados sobre 50.000€'
    } else {
        capitalInicialTradeRepublic = capitalInicial;
    }

    // Si la frecuencia es anual, calculamos para todo el año
    let capitalTradeRepublicFinal = capitalInicialTradeRepublic;
    let beneficioTradeRepublicSinImpuestos;
    let beneficioTradeRepublicConImpuestos;
    if (frecuencia === "Anual") {
        capitalTradeRepublicFinal = capitalInicialTradeRepublic * Math.pow((1 + interesTradeRepublicMensual), 12);
        beneficioTradeRepublicSinImpuestos = capitalTradeRepublicFinal - capitalInicialTradeRepublic;
        beneficioTradeRepublicConImpuestos = beneficioTradeRepublicSinImpuestos * (1 - impuesto);
    } else { // Si la frecuencia es mensual, calculamos solo para un mes
        capitalTradeRepublicFinal = capitalInicialTradeRepublic * (1 + interesTradeRepublicMensual);
        beneficioTradeRepublicSinImpuestos = capitalTradeRepublicFinal - capitalInicialTradeRepublic;
        beneficioTradeRepublicConImpuestos = beneficioTradeRepublicSinImpuestos * (1 - impuesto);
    }

    // Cálculo para Revolut (interés compuesto diario)
    let capitalInicialRevolut;
    let alertaRevolut = '';
    if (capitalInicial > 100000) {
        capitalInicialRevolut = 100000;
        alertaRevolut = 'Los intereses han sido aplicados sobre 100.000€'
    } else {
        capitalInicialRevolut = capitalInicial;
    }

    let capitalRevolutFinal = capitalInicialRevolut;
    if (frecuencia === "Anual") {
        for (let i = 0; i < 365; i++) {
            let interesDiario = capitalRevolutFinal * interesRevolutDiario;
            if (impuestos) {
                interesDiario *= (1 - impuesto);
            }
            capitalRevolutFinal += interesDiario;
        }
    } else { // Si la frecuencia es mensual, calculamos solo para un mes
        let interesRevolutMensual = interesRevolutAnual/12;
        let diasMesMedia = interesRevolutMensual/interesRevolutDiario;
        for (let i = 0; i < diasMesMedia; i++) {
            let interesDiario = capitalRevolutFinal * interesRevolutDiario;
            if (impuestos) {
                interesDiario *= (1 - impuesto);
            }
            capitalRevolutFinal += interesDiario;
        }
    }

    let beneficioRevolutConImpuestos = capitalRevolutFinal - capitalInicialRevolut;

    // Diferencia de beneficios
    let diferenciaTradeRevolut;

    if (impuestos) {
        diferenciaTradeRevolut = beneficioTradeRepublicConImpuestos - beneficioRevolutConImpuestos;
    } else {
        diferenciaTradeRevolut = beneficioTradeRepublicSinImpuestos - (capitalRevolutFinal - capitalInicialRevolut);
    }

    // Mostrar el resultado según si es positivo o negativo
    let mensajeDiferencia;
    if (diferenciaTradeRevolut > 0) {
        mensajeDiferencia = `Con <b>Trade Republic</b> ganas ${formatearNumero(Math.abs(diferenciaTradeRevolut))}€ más.`;
    } else {
        mensajeDiferencia = `Con <b>Revolut</b> ganas ${formatearNumero(Math.abs(diferenciaTradeRevolut))}€ más.`;
    }

    // Decidir qué mostrar según si hay impuestos o no
    if (impuestos) {
        document.getElementById("resultado").innerHTML = `
            <p><strong>Con Impuestos:</strong></p>
            <p>Capital final Trade Republic: ${formatearNumero(capitalTradeRepublicFinal)}€</p>
            <p>Beneficio neto Trade Republic: ${formatearNumero(beneficioTradeRepublicConImpuestos)}€
            <span class = alerta>${alertaTradeRepublic}<img id="alertaTradeRepublicImg" src="./img/warning.png"></span></p>
            <p>Capital final Revolut: ${formatearNumero(capitalRevolutFinal)}€</p>
            <p>Beneficio neto Revolut: ${formatearNumero(beneficioRevolutConImpuestos)}€
            <span class = alerta>${alertaRevolut}<img id="alertaRevolutImg" src="./img/warning.png"></span></p>
            <p>${mensajeDiferencia}</p>
        `;
    } else {
        document.getElementById("resultado").innerHTML = `
            <p><strong>Sin Impuestos:</strong></p>
            <p>Capital final Trade Republic: ${formatearNumero(capitalTradeRepublicFinal)}€</p>
            <p>Beneficio neto Trade Republic: ${formatearNumero(beneficioTradeRepublicSinImpuestos)}€
            <span class = alerta>${alertaTradeRepublic}<img id="alertaTradeRepublicImg" src="./img/warning.png"></span></p>
            <p>Capital final Revolut: ${formatearNumero(capitalRevolutFinal)}€</p>
            <p>Beneficio neto Revolut: ${(formatearNumero(capitalRevolutFinal - capitalInicialRevolut))}€
            <span class = alerta>${alertaRevolut}<img id="alertaRevolutImg" src="./img/warning.png"></span></p>
            <p>${mensajeDiferencia}</p>
        `;
    }

    function ocultarImagenSiAlertaVacia(alerta, idImagen) {
        if (alerta === '') {
            const imagen = document.querySelector(`#${idImagen}`);
            if (imagen) {
                imagen.style.display = 'none';
            }
        }
    }
    ocultarImagenSiAlertaVacia(alertaTradeRepublic, 'alertaTradeRepublicImg');
    ocultarImagenSiAlertaVacia(alertaRevolut, 'alertaRevolutImg');

    function formatearNumero(numero) {
        const numFijo = numero.toFixed(2); // Redondear a 2 decimales
        let [entero, decimal] = numFijo.split('.'); // Split en el punto
        entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Formatear la parte entera
        return `${entero},<span class="decimal">${decimal}</span>`;
    }
}
