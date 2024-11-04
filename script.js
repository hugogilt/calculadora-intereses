function calcular() {
    // Obtener valores del formulario
    const capitalInicial = parseFloat(document.getElementById("capital").value);
    const interesTradeRepublicAnual = parseFloat(document.getElementById("interesTrade").value) / 100;
    const interesRevolutAnual = parseFloat(document.getElementById("interesRevolut").value) / 100;
    const impuestos = document.getElementById("impuestos").value === "Si";
    const impuesto = 0.19;

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

    let capitalTradeRepublicFinal = capitalInicialTradeRepublic * Math.pow((1 + interesTradeRepublicMensual), 12);
    let beneficioTradeRepublicSinImpuestos = capitalTradeRepublicFinal - capitalInicialTradeRepublic;
    let beneficioTradeRepublicConImpuestos = beneficioTradeRepublicSinImpuestos * (1 - impuesto);

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
    for (let i = 0; i < 365; i++) {
        let interesDiario = capitalRevolutFinal * interesRevolutDiario;
        if (impuestos) {
            interesDiario *= (1 - impuesto);
        }
        capitalRevolutFinal += interesDiario;
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
        mensajeDiferencia = `Con <b>Trade Republic</b> ganas ${diferenciaTradeRevolut.toFixed(2)}€ más.`;
    } else {
        mensajeDiferencia = `Con <b>Revolut</b> ganas ${Math.abs(diferenciaTradeRevolut).toFixed(2)}€ más.`;
    }

    // Decidir qué mostrar según si hay impuestos o no
    if (impuestos) {
        document.getElementById("resultado").innerHTML = `
            <p><strong>Con Impuestos:</strong></p>
            <p>Capital final Trade Republic: ${capitalTradeRepublicFinal.toFixed(2)}€</p>
            <p>Beneficio neto anual con Trade Republic: ${beneficioTradeRepublicConImpuestos.toFixed(2)}€
            <span class = alerta>${alertaTradeRepublic}<img id="alertaTradeRepublicImg" src="./img/warning.png"></span></p>
            <p>Capital final Revolut: ${capitalRevolutFinal.toFixed(2)}€</p>
            <p>Beneficio neto anual con Revolut: ${beneficioRevolutConImpuestos.toFixed(2)}€
            <span class = alerta>${alertaRevolut}<img id="alertaRevolutImg" src="./img/warning.png"></span></p>
            <p>${mensajeDiferencia}</p>
        `;
    } else {
        document.getElementById("resultado").innerHTML = `
            <p><strong>Sin Impuestos:</strong></p>
            <p>Capital final Trade Republic: ${capitalTradeRepublicFinal.toFixed(2)}€</p>
            <p>Beneficio neto Trade Republic: ${beneficioTradeRepublicSinImpuestos.toFixed(2)}€
            <span class = alerta>${alertaTradeRepublic}<img id="alertaTradeRepublicImg" src="./img/warning.png"></span></p>
            <p>Capital final Revolut: ${capitalRevolutFinal.toFixed(2)}€</p>
            <p>Beneficio neto Revolut: ${(capitalRevolutFinal - capitalInicialRevolut).toFixed(2)}€
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
}