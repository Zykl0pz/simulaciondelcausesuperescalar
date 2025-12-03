// =============================================
// CONFIGURACIÓN DEL SIMULADOR
// =============================================

// Añadir configuración de ancho de emisión y recursos
const simulatorConfig = {
    issueWidth: 2,           // Máximo de instrucciones que se pueden emitir por ciclo
    renameRegisters: 32,     // Número de registros físicos disponibles
    functionalUnits: {
        'ALU': { count: 2, latency: 1 },
        'FPU': { count: 1, latency: 3 },
        'LOAD/STORE': { count: 1, latency: 2 },
        'BRANCH': { count: 1, latency: 1 }
    }
};

// =============================================
// CONFIGURACIONES PREDEFINIDAS
// =============================================
const predefinedExamples = {
    'figura14.4': [
        { id: 'I1', name: 'I1', executionTime: 2, dependencies: [], functionalUnit: 'U1', raw: [], war: [], waw: [] },
        { id: 'I2', name: 'I2', executionTime: 1, dependencies: [], functionalUnit: 'U2', raw: [], war: [], waw: [] },
        { id: 'I3', name: 'I3', executionTime: 1, dependencies: [], functionalUnit: 'U1', raw: [], war: [], waw: [] },
        { id: 'I4', name: 'I4', executionTime: 1, dependencies: [], functionalUnit: 'U1', raw: [], war: [], waw: [] },
        { id: 'I5', name: 'I5', executionTime: 1, dependencies: ['I4'], functionalUnit: 'U2', raw: ['I4'], war: [], waw: [] },
        { id: 'I6', name: 'I6', executionTime: 1, dependencies: [], functionalUnit: 'U2', raw: [], war: [], waw: [] }
    ],
    'dependenciasComplejas': [
        { id: 'I1', name: 'ADD R1, R2, R3', executionTime: 2, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I2', name: 'SUB R4, R1, R5', executionTime: 1, dependencies: ['I1'], functionalUnit: 'ALU', raw: ['I1'], war: [], waw: [] },
        { id: 'I3', name: 'MUL R1, R6, R7', executionTime: 3, dependencies: [], functionalUnit: 'ALU', raw: [], war: ['I2'], waw: ['I1'] },
        { id: 'I4', name: 'ADD R8, R9, R1', executionTime: 1, dependencies: ['I3'], functionalUnit: 'ALU', raw: ['I3'], war: [], waw: [] },
        { id: 'I5', name: 'DIV R10, R4, R2', executionTime: 4, dependencies: ['I2'], functionalUnit: 'ALU', raw: ['I2'], war: [], waw: [] },
        { id: 'I6', name: 'OR R11, R1, R12', executionTime: 1, dependencies: ['I3'], functionalUnit: 'ALU', raw: ['I3'], war: [], waw: [] }
    ],
    'conflictosRecursos': [
        { id: 'I1', name: 'ADD R1, R2, R3', executionTime: 2, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I2', name: 'SUB R4, R5, R6', executionTime: 1, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I3', name: 'MUL R7, R8, R9', executionTime: 3, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I4', name: 'DIV R10, R11, R12', executionTime: 4, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I5', name: 'AND R13, R14, R15', executionTime: 1, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I6', name: 'OR R16, R17, R18', executionTime: 1, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] }
    ],
    'saltosCondicionales': [
        { id: 'I1', name: 'CMP R1, R2', executionTime: 1, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [], isBranch: false },
        { id: 'I2', name: 'BEQ TARGET', executionTime: 1, dependencies: ['I1'], functionalUnit: 'BRANCH', raw: ['I1'], war: [], waw: [], isBranch: true, branchTarget: 'I5', branchPrediction: 'NOT_TAKEN' },
        { id: 'I3', name: 'ADD R3, R4, R5', executionTime: 2, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [], isBranch: false },
        { id: 'I4', name: 'SUB R6, R7, R8', executionTime: 1, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [], isBranch: false },
        { id: 'I5', name: 'TARGET: MUL R9, R10, R11', executionTime: 3, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [], isBranch: false },
        { id: 'I6', name: 'DIV R12, R13, R14', executionTime: 4, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [], isBranch: false }
    ],
    'renombradoRegistros': [
        { id: 'I1', name: 'ADD R1, R2, R3', executionTime: 2, dependencies: [], functionalUnit: 'ALU', raw: [], war: [], waw: [] },
        { id: 'I2', name: 'SUB R4, R1, R5', executionTime: 1, dependencies: ['I1'], functionalUnit: 'ALU', raw: ['I1'], war: [], waw: [] },
        { id: 'I3', name: 'MUL R1, R6, R7', executionTime: 3, dependencies: [], functionalUnit: 'ALU', raw: [], war: ['I2'], waw: ['I1'] },
        { id: 'I4', name: 'ADD R8, R9, R1', executionTime: 1, dependencies: ['I3'], functionalUnit: 'ALU', raw: ['I3'], war: [], waw: [] },
        { id: 'I5', name: 'DIV R10, R4, R2', executionTime: 4, dependencies: ['I2'], functionalUnit: 'ALU', raw: ['I2'], war: [], waw: [] },
        { id: 'I6', name: 'OR R11, R1, R12', executionTime: 1, dependencies: ['I3'], functionalUnit: 'ALU', raw: ['I3'], war: [], waw: [] }
    ]
};

// Configuración inicial
const defaultConfig = JSON.parse(JSON.stringify(predefinedExamples['figura14.4']));

// Estado de la simulación
let currentConfig = JSON.parse(JSON.stringify(defaultConfig));
let simulationState = {
    prepared: false,
    currentCycle: 0,
    maxCycles: 0,
    policy1Data: [],
    policy2Data: [],
    policy3Data: [],
    autoMode: false,
    intervalId: null,
    registerRenaming: false,
    currentConfig: [],
    performanceMetrics: {
        policy1: { ipc: 0, resourceUtilization: 0 },
        policy2: { ipc: 0, resourceUtilization: 0 },
        policy3: { ipc: 0, resourceUtilization: 0 }
    }
};

// =============================================
// INICIALIZACIÓN DE LA INTERFAZ
// =============================================
function initializeUI() {
    renderInstructionsConfig();
    attachEventListeners();
    updateStatus('Preparado para configurar', false);
}

function renderInstructionsConfig() {
    const container = document.getElementById('instructionsConfig');
    container.innerHTML = '';

    currentConfig.forEach((instruction, index) => {
        const instructionElement = document.createElement('div');
        instructionElement.className = 'instruction-config';
        
        instructionElement.innerHTML = `
            <h4>${instruction.name}</h4>
            <div class="form-group">
                <label for="execTime${index}">Tiempo Ejecución:</label>
                <select id="execTime${index}">
                    <option value="1" ${instruction.executionTime === 1 ? 'selected' : ''}>1 ciclo</option>
                    <option value="2" ${instruction.executionTime === 2 ? 'selected' : ''}>2 ciclos</option>
                    <option value="3" ${instruction.executionTime === 3 ? 'selected' : ''}>3 ciclos</option>
                    <option value="4" ${instruction.executionTime === 4 ? 'selected' : ''}>4 ciclos</option>
                </select>
            </div>
            <div class="form-group">
                <label for="functionalUnit${index}">Unidad Funcional:</label>
                <select id="functionalUnit${index}">
                    <option value="ALU" ${instruction.functionalUnit === 'ALU' ? 'selected' : ''}>ALU</option>
                    <option value="FPU" ${instruction.functionalUnit === 'FPU' ? 'selected' : ''}>FPU</option>
                    <option value="LOAD/STORE" ${instruction.functionalUnit === 'LOAD/STORE' ? 'selected' : ''}>LOAD/STORE</option>
                    <option value="BRANCH" ${instruction.functionalUnit === 'BRANCH' ? 'selected' : ''}>BRANCH</option>
                </select>
            </div>
            ${instruction.isBranch ? `
            <div class="form-group">
                <label for="branchPred${index}">Predicción Salto:</label>
                <select id="branchPred${index}">
                    <option value="TAKEN" ${instruction.branchPrediction === 'TAKEN' ? 'selected' : ''}>Tomado</option>
                    <option value="NOT_TAKEN" ${instruction.branchPrediction === 'NOT_TAKEN' ? 'selected' : ''}>No Tomado</option>
                </select>
            </div>
            ` : ''}
        `;
        container.appendChild(instructionElement);
    });
}

function attachEventListeners() {
    document.getElementById('btnReset').addEventListener('click', resetConfig);
    document.getElementById('btnSimulate').addEventListener('click', prepareSimulation);
    document.getElementById('btnStep').addEventListener('click', executeStep);
    document.getElementById('btnAuto').addEventListener('click', toggleAutoExecution);
    document.getElementById('btnResetSim').addEventListener('click', resetSimulation);
    document.getElementById('btnToggleRename').addEventListener('click', toggleRegisterRenaming);
    
    // Event listeners para ejemplos predefinidos
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            loadExample(this.dataset.example);
        });
    });
}

// =============================================
// MEJORA 1: MÉTRICAS DE RENDIMIENTO
// =============================================
// =============================================
// MEJORA 1: MÉTRICAS DE RENDIMIENTO - ACTUALIZADA
// =============================================
function calculatePerformanceMetrics() {
    // Calcular métricas detalladas para cada política
    simulationState.performanceMetrics.policy1 = calculatePolicyMetrics(simulationState.policy1Data, "Política 1");
    simulationState.performanceMetrics.policy2 = calculatePolicyMetrics(simulationState.policy2Data, "Política 2");
    simulationState.performanceMetrics.policy3 = calculatePolicyMetrics(simulationState.policy3Data, "Política 3");
    
    // Añadir análisis comparativo al registro
    addComparativeAnalysisToLog();
}

function addComparativeAnalysisToLog() {
    const p1 = simulationState.performanceMetrics.policy1;
    const p2 = simulationState.performanceMetrics.policy2;
    const p3 = simulationState.performanceMetrics.policy3;
    
    let analysis = `<strong>Análisis Comparativo de Políticas:</strong><br><br>`;
    
    analysis += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">`;
    
    [p1, p2, p3].forEach((policy, index) => {
        const policyName = `Política ${index + 1}`;
        analysis += `
            <div style="background: ${index === 0 ? '#e3f2fd' : index === 1 ? '#fff3e0' : '#e8f5e9'}; 
                         padding: 12px; border-radius: 6px; text-align: center; border-left: 4px solid 
                         ${index === 0 ? '#2196f3' : index === 1 ? '#ff9800' : '#4caf50'};">
                <strong>${policyName}</strong><br>
                <div style="font-size: 1.2em; font-weight: bold; margin: 8px 0;">IPC: ${policy.ipc}</div>
                <div style="font-size: 0.9em;">Ciclos: ${policy.totalCycles}</div>
                <div style="font-size: 0.9em;">Utilización: ${policy.resourceUtilization}</div>
                <div style="font-size: 0.85em; color: #666; margin-top: 5px;">
                    Espera: ${policy.waitCycles} ciclos
                </div>
            </div>
        `;
    });
    
    analysis += `</div>`;
    
    // Calcular mejoras porcentuales
    const improvementP2 = ((p1.totalCycles - p2.totalCycles) / p1.totalCycles * 100).toFixed(1);
    const improvementP3 = ((p1.totalCycles - p3.totalCycles) / p1.totalCycles * 100).toFixed(1);
    
    analysis += `<div style="background: #fff3cd; padding: 12px; border-radius: 4px; margin-top: 10px;">`;
    analysis += `<strong>Conclusiones:</strong><br>`;
    
    if (parseFloat(improvementP2) > 0) {
        analysis += `✓ <strong>Política 2</strong> es ${improvementP2}% más rápida que Política 1.<br>`;
    } else {
        analysis += `⚠ <strong>Política 2</strong> no muestra mejora significativa.<br>`;
    }
    
    if (parseFloat(improvementP3) > 0) {
        analysis += `✓ <strong>Política 3</strong> es ${improvementP3}% más rápida que Política 1.<br>`;
    } else {
        analysis += `⚠ <strong>Política 3</strong> no muestra mejora significativa.<br>`;
    }
    
    analysis += `<br><em>La Política 3 (Out-of-Order) debería ser la más rápida en programas paralelizables.</em>`;
    analysis += `</div>`;
    
    addLogEntry('Análisis Comparativo', analysis);
}

function calculateIPC(simulationData) {
    const totalInstructions = simulationState.currentConfig.length;
    const totalCycles = Math.max(...simulationData.map(inst => inst.length));
    return totalCycles > 0 ? (totalInstructions / totalCycles).toFixed(2) : '0.00';
}

function calculateResourceUtilization(simulationData) {
    const functionalUnits = {};
    let totalUtilization = 0;
    let unitCount = 0;
    
    // Contar utilización por unidad funcional
    simulationData.forEach((instructionData, index) => {
        instructionData.forEach(cycleData => {
            if (cycleData && cycleData.stage === 'execute') {
                const unit = simulationState.currentConfig[index].functionalUnit;
                
                if (!functionalUnits[unit]) functionalUnits[unit] = 0;
                functionalUnits[unit]++;
            }
        });
    });
    
    // Calcular utilización promedio
    Object.keys(functionalUnits).forEach(unit => {
        const maxPossible = simulationState.maxCycles;
        totalUtilization += (functionalUnits[unit] / maxPossible) * 100;
        unitCount++;
    });
    
    return unitCount > 0 ? (totalUtilization / unitCount).toFixed(1) + '%' : '0%';
}

// =============================================
// MEJORA 2: EJEMPLOS PREDEFINIDOS
// =============================================
function loadExample(exampleName) {
    if (predefinedExamples[exampleName]) {
        currentConfig = JSON.parse(JSON.stringify(predefinedExamples[exampleName]));
        renderInstructionsConfig();
        updateStatus(`Ejemplo "${exampleName}" cargado`, true);
        addLogEntry('Ejemplo Predefinido', `Se cargó el ejemplo "${exampleName}". Haz clic en "Preparar Simulación" para comenzar.`);
        
        // Mostrar información específica del ejemplo
        if (exampleName === 'renombradoRegistros') {
            addLogEntry('Información', 'Este ejemplo muestra dependencias WAR y WAW que pueden resolverse con renombrado de registros.');
        } else if (exampleName === 'saltosCondicionales') {
            addLogEntry('Información', 'Este ejemplo incluye un salto condicional. Observa cómo la predicción afecta el rendimiento.');
        }
    }
}

// =============================================
// MEJORA 3: VISUALIZACIÓN DE DEPENDENCIAS MEJORADA
// =============================================
function analyzeDependencies() {
    const dependenciesContainer = document.getElementById('dependenciesContainer');
    const dependenciesGraph = document.getElementById('dependenciesGraph');
    
    dependenciesContainer.style.display = 'block';
    dependenciesGraph.innerHTML = '';
    
    let dependencyCount = {
        RAW: 0,
        WAR: 0,
        WAW: 0
    };
    
    // Explicaciones detalladas de cada tipo de dependencia
    const dependencyExplanations = {
        RAW: {
            title: "RAW - Dependencia Verdadera (Read After Write)",
            description: "Ocurre cuando una instrucción necesita leer el resultado de una instrucción anterior que aún no ha escrito. Esta es una dependencia REAL que limita el paralelismo y requiere sincronización.",
            example: "I1: ADD R1, R2, R3 → I2: SUB R4, R1, R5<br>I2 necesita el valor de R1 que I1 va a producir. I2 no puede ejecutarse hasta que I1 complete su escritura.",
            impact: "Causa detenciones (stalls) en el pipeline hasta que la dependencia se resuelve."
        },
        WAR: {
            title: "WAR - Anti-dependencia (Write After Read)",
            description: "Ocurre cuando una instrucción necesita escribir en un registro que una instrucción anterior necesita leer. Esta es una dependencia FALSA causada por la reutilización de nombres de registros.",
            example: "I1: SUB R4, R1, R5 → I2: MUL R1, R6, R7<br>I2 quiere escribir en R1, pero I1 aún necesita leerlo. En realidad, los valores son independientes.",
            impact: "Puede resolverse con renombrado de registros sin afectar la semántica del programa."
        },
        WAW: {
            title: "WAW - Dependencia de Salida (Write After Write)",
            description: "Ocurre cuando dos instrucciones escriben en el mismo registro y debe preservarse el orden de escritura. Otra dependencia FALSA por reutilización de nombres.",
            example: "I1: ADD R1, R2, R3 → I3: MUL R1, R6, R7<br>Ambas escriben en R1. Solo el último valor debe permanecer, pero el orden importa.",
            impact: "También se resuelve con renombrado de registros asignando nombres físicos diferentes."
        }
    };
    
    // Mostrar explicaciones generales primero
    Object.keys(dependencyExplanations).forEach(type => {
        const explanationSection = document.createElement('div');
        explanationSection.className = 'dependency-explanation-section';
        explanationSection.innerHTML = `
            <h4>${dependencyExplanations[type].title}</h4>
            <div class="explanation-content">
                <p><strong>Descripción:</strong> ${dependencyExplanations[type].description}</p>
                <p><strong>Ejemplo típico:</strong> ${dependencyExplanations[type].example}</p>
                <p><strong>Impacto:</strong> ${dependencyExplanations[type].impact}</p>
            </div>
        `;
        dependenciesGraph.appendChild(explanationSection);
    });
    
    // Separador
    const separator = document.createElement('hr');
    separator.style.margin = '20px 0';
    separator.style.border = '1px solid #ddd';
    dependenciesGraph.appendChild(separator);
    
    // Sección de dependencias específicas encontradas
    const specificDepsHeader = document.createElement('h4');
    specificDepsHeader.textContent = 'Dependencias Detectadas en Este Programa:';
    specificDepsHeader.style.marginTop = '20px';
    dependenciesGraph.appendChild(specificDepsHeader);
    
    const dependenciesList = document.createElement('div');
    dependenciesList.style.display = 'flex';
    dependenciesList.style.flexDirection = 'column';
    dependenciesList.style.gap = '10px';
    dependenciesList.style.marginTop = '10px';
    
    simulationState.currentConfig.forEach(instruction => {
        // Analizar dependencias RAW
        if (instruction.raw && instruction.raw.length > 0) {
            instruction.raw.forEach(depId => {
                const depInstruction = simulationState.currentConfig.find(inst => inst.id === depId);
                if (depInstruction) {
                    const dependencyItem = document.createElement('div');
                    dependencyItem.className = 'dependency-item';
                    dependencyItem.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span style="font-weight: bold;">${depInstruction.name} → ${instruction.name}</span>
                            <span class="dependency-type" style="background: var(--color-raw); padding: 2px 8px; border-radius: 3px; font-size: 0.8em; font-weight: bold;">RAW</span>
                        </div>
                        <div style="font-size: 0.9em; color: #555; padding-left: 5px;">
                            <strong>¿Por qué ocurre?</strong> ${instruction.name} necesita leer un registro que ${depInstruction.name} va a escribir.
                            Esto crea una dependencia REAL de datos que requiere que ${instruction.name} espere.
                        </div>
                    `;
                    dependenciesList.appendChild(dependencyItem);
                    dependencyCount.RAW++;
                }
            });
        }
        
        // Analizar dependencias WAR
        if (instruction.war && instruction.war.length > 0) {
            instruction.war.forEach(depId => {
                const depInstruction = simulationState.currentConfig.find(inst => inst.id === depId);
                if (depInstruction) {
                    const dependencyItem = document.createElement('div');
                    dependencyItem.className = 'dependency-item';
                    dependencyItem.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span style="font-weight: bold;">${depInstruction.name} → ${instruction.name}</span>
                            <span class="dependency-type" style="background: var(--color-war); padding: 2px 8px; border-radius: 3px; font-size: 0.8em; font-weight: bold;">WAR</span>
                        </div>
                        <div style="font-size: 0.9em; color: #555; padding-left: 5px;">
                            <strong>¿Por qué ocurre?</strong> ${instruction.name} quiere escribir en un registro que ${depInstruction.name} aún necesita leer.
                            Esta es una dependencia FALSA por reutilización de nombres que puede eliminarse con renombrado.
                        </div>
                    `;
                    dependenciesList.appendChild(dependencyItem);
                    dependencyCount.WAR++;
                }
            });
        }
        
        // Analizar dependencias WAW
        if (instruction.waw && instruction.waw.length > 0) {
            instruction.waw.forEach(depId => {
                const depInstruction = simulationState.currentConfig.find(inst => inst.id === depId);
                if (depInstruction) {
                    const dependencyItem = document.createElement('div');
                    dependencyItem.className = 'dependency-item';
                    dependencyItem.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span style="font-weight: bold;">${depInstruction.name} → ${instruction.name}</span>
                            <span class="dependency-type" style="background: var(--color-waw); padding: 2px 8px; border-radius: 3px; font-size: 0.8em; font-weight: bold;">WAW</span>
                        </div>
                        <div style="font-size: 0.9em; color: #555; padding-left: 5px;">
                            <strong>¿Por qué ocurre?</strong> Ambas instrucciones escriben en el mismo registro.
                            El orden de escritura importa para preservar la semántica, pero esto es otra dependencia FALSA.
                        </div>
                    `;
                    dependenciesList.appendChild(dependencyItem);
                    dependencyCount.WAW++;
                }
            });
        }
    });
    
    dependenciesGraph.appendChild(dependenciesList);
    
    // Mostrar resumen estadístico
    const summary = document.createElement('div');
    summary.style.marginTop = '20px';
    summary.style.padding = '15px';
    summary.style.background = '#e3f2fd';
    summary.style.borderRadius = '6px';
    summary.style.borderLeft = '4px solid var(--primary-color)';
    
    summary.innerHTML = `
        <h4 style="margin-top: 0;">Análisis de Paralelismo</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
            <div style="text-align: center; background: white; padding: 10px; border-radius: 4px;">
                <div style="font-size: 1.5em; font-weight: bold; color: #e74c3c;">${dependencyCount.RAW}</div>
                <div style="font-size: 0.9em;">Dependencias RAW</div>
                <div style="font-size: 0.8em; color: #666;">(Reales - Limitantes)</div>
            </div>
            <div style="text-align: center; background: white; padding: 10px; border-radius: 4px;">
                <div style="font-size: 1.5em; font-weight: bold; color: #27ae60;">${dependencyCount.WAR}</div>
                <div style="font-size: 0.9em;">Dependencias WAR</div>
                <div style="font-size: 0.8em; color: #666;">(Falsas - Renombrables)</div>
            </div>
            <div style="text-align: center; background: white; padding: 10px; border-radius: 4px;">
                <div style="font-size: 1.5em; font-weight: bold; color: #3498db;">${dependencyCount.WAW}</div>
                <div style="font-size: 0.9em;">Dependencias WAW</div>
                <div style="font-size: 0.8em; color: #666;">(Falsas - Renombrables)</div>
            </div>
        </div>
        
        <div style="background: #fff3cd; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107;">
            <strong>Recomendaciones:</strong><br>
            ${dependencyCount.WAR + dependencyCount.WAW > 0 ? 
                `• Este programa tiene ${dependencyCount.WAR + dependencyCount.WAW} dependencias falsas que pueden eliminarse con <strong>renombrado de registros</strong>. Activa el botón "Activar Renombrado" para ver la mejora.` : 
                '• No se detectaron dependencias falsas (WAR/WAW). El renombrado no mejoraría significativamente este caso.'}<br>
            ${dependencyCount.RAW > 0 ? 
                `• Existen ${dependencyCount.RAW} dependencias reales (RAW) que limitan el paralelismo. Solo la ejecución fuera de orden puede ayudar.` : 
                '• No hay dependencias reales (RAW). Este programa es altamente paralelizable.'}
        </div>
    `;
    
    dependenciesGraph.appendChild(summary);
}

// =============================================
// MEJORA 4: RENOMBRADO DE REGISTROS
// =============================================
function toggleRegisterRenaming() {
    simulationState.registerRenaming = !simulationState.registerRenaming;
    const btn = document.getElementById('btnToggleRename');
    
    if (simulationState.registerRenaming) {
        btn.textContent = 'Desactivar Renombrado';
        btn.style.background = '#f44336';
        addLogEntry('Renombrado de Registros', 'Renombrado ACTIVADO. Las dependencias WAR y WAW serán eliminadas.');
    } else {
        btn.textContent = 'Activar Renombrado';
        btn.style.background = '';
        addLogEntry('Renombrado de Registros', 'Renombrado DESACTIVADO. Se mantienen todas las dependencias.');
    }
    
    if (simulationState.prepared) {
        prepareSimulation();
    }
}

function applyRegisterRenaming(config) {
    if (!simulationState.registerRenaming) return config;
    
    const renamedConfig = JSON.parse(JSON.stringify(config));
    const registerMap = new Map();
    let physicalRegisterCounter = 100; // Empezar desde R100 para registros físicos
    
    // Aplicar renombrado a cada instrucción
    renamedConfig.forEach(instruction => {
        // Simular renombrado: reemplazar registros destino
        if (instruction.name.includes('R1')) {
            if (!registerMap.has('R1')) {
                registerMap.set('R1', 'R' + physicalRegisterCounter++);
            }
            instruction.name = instruction.name.replace('R1', registerMap.get('R1'));
        }
        
        // Eliminar dependencias WAR y WAW (son falsas después del renombrado)
        instruction.war = [];
        instruction.waw = [];
        
        // Mantener solo dependencias RAW (verdaderas)
    });
    
    return renamedConfig;
}

// =============================================
// MEJORA 5: PREDICCIÓN DE SALTOS
// =============================================
function simulateBranchPrediction(config) {
    const branchedConfig = JSON.parse(JSON.stringify(config));
    let branchPenalty = 0;
    
    branchedConfig.forEach(instruction => {
        if (instruction.isBranch) {
            // Simular predicción y penalización
            const actualTaken = true; // En una simulación real, esto sería determinado por los datos
            const predictedTaken = instruction.branchPrediction === 'TAKEN';
            
            if (actualTaken !== predictedTaken) {
                branchPenalty = 3; // Penalización típica por predicción incorrecta
                instruction.branchMisprediction = true;
                addLogEntry('Predicción de Salto', 
                    `¡Predicción incorrecta en ${instruction.name}! Penalización de ${branchPenalty} ciclos.`);
            } else {
                instruction.branchMisprediction = false;
                addLogEntry('Predicción de Salto', 
                    `Predicción correcta en ${instruction.name}. Sin penalización.`);
            }
        }
    });
    
    return { config: branchedConfig, branchPenalty };
}

// =============================================
// FUNCIONES PRINCIPALES DE SIMULACIÓN
// =============================================
function updateStatus(message, isActive) {
    document.getElementById('statusText').textContent = message;
    const statusDot = document.getElementById('statusDot');
    if (isActive) {
        statusDot.classList.add('active');
    } else {
        statusDot.classList.remove('active');
    }
}

function resetConfig() {
    currentConfig = JSON.parse(JSON.stringify(defaultConfig));
    renderInstructionsConfig();
    resetSimulation();
    updateStatus('Configuración restablecida', false);
    addLogEntry('Estado Inicial', 'Configuración restablecida a valores por defecto.');
}

function updateConfigFromUI() {
    currentConfig.forEach((instruction, index) => {
        instruction.executionTime = parseInt(document.getElementById(`execTime${index}`).value);
        instruction.functionalUnit = document.getElementById(`functionalUnit${index}`).value;
        
        if (instruction.isBranch) {
            instruction.branchPrediction = document.getElementById(`branchPred${index}`).value;
        }
    });
}

// =============================================
// FUNCIÓN PARA DETECTAR Y MOSTRAR DIFERENCIAS
// =============================================

function comparePoliciesAndShowDifferences() {
    const policies = [
        { name: "Política 1", data: simulationState.policy1Data },
        { name: "Política 2", data: simulationState.policy2Data },
        { name: "Política 3", data: simulationState.policy3Data }
    ];
    
    // Calcular métricas comparativas
    const metrics = policies.map(policy => {
        const totalCycles = Math.max(...policy.data.map(inst => inst.length));
        const totalInstructions = simulationState.currentConfig.length;
        const ipc = totalCycles > 0 ? (totalInstructions / totalCycles).toFixed(2) : '0.00';
        
        // Calcular ciclos de espera por dependencias
        let waitCycles = 0;
        policy.data.forEach((instructionData, instIndex) => {
            let lastStage = null;
            let lastCycle = 0;
            
            instructionData.forEach((cycleData, cycleIndex) => {
                if (cycleData && cycleData.stage) {
                    if (lastStage && cycleData.stage !== lastStage) {
                        const gap = cycleIndex - lastCycle - 1;
                        if (gap > 0) {
                            waitCycles += gap;
                        }
                    }
                    lastStage = cycleData.stage;
                    lastCycle = cycleIndex;
                }
            });
        });
        
        return {
            name: policy.name,
            totalCycles,
            ipc,
            waitCycles,
            efficiency: ((totalInstructions / (totalCycles + waitCycles)) * 100).toFixed(1) + '%'
        };
    });
    
    // Añadir análisis al registro
    addLogEntry('Análisis Comparativo', `
        <strong>Comparación de Políticas:</strong><br><br>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0;">
            ${metrics.map(metric => `
                <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
                    <strong>${metric.name}</strong><br>
                    <div style="font-size: 1.2em; font-weight: bold; color: #2196f3; margin: 10px 0;">IPC: ${metric.ipc}</div>
                    <div style="font-size: 0.9em;">Ciclos totales: ${metric.totalCycles}</div>
                    <div style="font-size: 0.9em;">Ciclos de espera: ${metric.waitCycles}</div>
                    <div style="font-size: 0.9em;">Eficiencia: ${metric.efficiency}</div>
                </div>
            `).join('')}
        </div>
        
        <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-top: 10px;">
            <strong>Observaciones:</strong><br>
            ${metrics[1].totalCycles < metrics[0].totalCycles ? 
                '✓ La Política 2 es más rápida que la Política 1 gracias a la finalización desordenada.' : 
                '⚠ La Política 2 no muestra mejora. Esto ocurre cuando hay muchas dependencias RAW.'}<br>
            ${metrics[2].totalCycles < metrics[1].totalCycles ? 
                '✓ La Política 3 es la más rápida gracias a la emisión y finalización desordenadas.' : 
                '⚠ La Política 3 no muestra mejora significativa. Revisa las dependencias del programa.'}
        </div>
    `);
}


// =============================================
// MODIFICAR LA FUNCIÓN prepareSimulation
// =============================================

function prepareSimulation() {
    try {
        updateConfigFromUI();
        
        // Aplicar renombrado de registros si está activado
        let configToUse = applyRegisterRenaming(currentConfig);
        
        // Simular predicción de saltos
        const branchResult = simulateBranchPrediction(configToUse);
        configToUse = branchResult.config;
        
        // Guardar configuración actual
        simulationState.currentConfig = JSON.parse(JSON.stringify(configToUse));
        
        // Calcular simulaciones con los algoritmos mejorados
        simulationState.policy1Data = simulateInOrderInOrder(configToUse);
        simulationState.policy2Data = simulateInOrderOutOfOrder(configToUse);
        simulationState.policy3Data = simulateOutOfOrderOutOfOrder(configToUse);
        
        // Calcular máximo de ciclos
        simulationState.maxCycles = Math.max(
            ...simulationState.policy1Data.map(inst => inst.length),
            ...simulationState.policy2Data.map(inst => inst.length),
            ...simulationState.policy3Data.map(inst => inst.length)
        );
        
        simulationState.currentCycle = 0;
        simulationState.prepared = true;
        
        // Calcular métricas de rendimiento
        calculatePerformanceMetrics();
        
        // Analizar dependencias
        analyzeDependencies();
        
        // Mostrar análisis comparativo
        comparePoliciesAndShowDifferences();
        
        // Actualizar UI
        document.getElementById('btnStep').disabled = false;
        document.getElementById('btnAuto').disabled = false;
        document.getElementById('btnResetSim').disabled = false;
        document.getElementById('btnToggleRename').disabled = false;
        document.getElementById('currentCycleIndicator').style.display = 'block';
        
        updateStatus('Simulación preparada - Lista para ejecutar', true);
        addLogEntry('Preparación', 'Simulación inicializada con los algoritmos mejorados. Observa las diferencias entre políticas.');
        
        // Mostrar estado inicial
        updateSimulationDisplay();
    } catch (error) {
        console.error('Error en prepareSimulation:', error);
        updateStatus('Error al preparar simulación', false);
        addLogEntry('Error', `No se pudo preparar la simulación: ${error.message}`);
    }
}

function resetSimulation() {
    simulationState.currentCycle = 0;
    simulationState.prepared = false;
    simulationState.autoMode = false;
    
    if (simulationState.intervalId) {
        clearInterval(simulationState.intervalId);
        simulationState.intervalId = null;
    }
    
    document.getElementById('btnStep').disabled = true;
    document.getElementById('btnAuto').disabled = true;
    document.getElementById('btnResetSim').disabled = true;
    document.getElementById('btnToggleRename').disabled = true;
    document.getElementById('currentCycleIndicator').style.display = 'none';
    document.getElementById('dependenciesContainer').style.display = 'none';
    
    updateStatus('Simulación reiniciada', false);
    addLogEntry('Reinicio', 'Simulación reiniciada. Puede modificar la configuración y preparar una nueva simulación.');
    
    // Limpiar visualización
    const policiesContainer = document.getElementById('policiesContainer');
    policiesContainer.innerHTML = '';
}

function executeStep() {
    if (!simulationState.prepared) return;
    
    simulationState.currentCycle++;
    updateSimulationDisplay();
    
    if (simulationState.currentCycle >= simulationState.maxCycles) {
        document.getElementById('btnStep').disabled = true;
        document.getElementById('btnAuto').disabled = true;
        updateStatus('Simulación completada', false);
        addLogEntry('Finalización', 'Todas las instrucciones han completado su ejecución en las tres políticas.');
    }
}

function toggleAutoExecution() {
    if (!simulationState.prepared) return;
    
    if (simulationState.autoMode) {
        clearInterval(simulationState.intervalId);
        simulationState.intervalId = null;
        simulationState.autoMode = false;
        document.getElementById('btnAuto').textContent = 'Ejecución Automática';
        document.getElementById('btnStep').disabled = false;
        updateStatus('Ejecución automática detenida', true);
        addLogEntry('Control', 'Ejecución automática detenida.');
    } else {
        simulationState.autoMode = true;
        document.getElementById('btnAuto').textContent = 'Detener Automático';
        document.getElementById('btnStep').disabled = true;
        updateStatus('Ejecución automática en curso...', true);
        addLogEntry('Control', 'Iniciando ejecución automática (500ms por ciclo).');
        
        simulationState.intervalId = setInterval(() => {
            executeStep();
            
            if (simulationState.currentCycle >= simulationState.maxCycles) {
                clearInterval(simulationState.intervalId);
                simulationState.intervalId = null;
                simulationState.autoMode = false;
                document.getElementById('btnAuto').textContent = 'Ejecución Automática';
                document.getElementById('btnAuto').disabled = true;
                updateStatus('Simulación completada', false);
            }
        }, 500);
    }
}

function updateSimulationDisplay() {
    document.getElementById('currentCycle').textContent = simulationState.currentCycle;
    
    const policiesContainer = document.getElementById('policiesContainer');
    policiesContainer.innerHTML = '';
    
    // Política 1
    const policy1Section = createPolicySection(
        "Política 1: Emisión en Orden y Finalización en Orden", 
        simulationState.policy1Data,
        simulationState.performanceMetrics.policy1,
        "Las instrucciones se emiten y completan en el orden original del programa. Es la política más simple pero menos eficiente.",
        0 // policyIndex
    );
    policiesContainer.appendChild(policy1Section);
    
    // Política 2
    const policy2Section = createPolicySection(
        "Política 2: Emisión en Orden y Finalización Desordenada", 
        simulationState.policy2Data,
        simulationState.performanceMetrics.policy2,
        "Las instrucciones se emiten en orden pero pueden completarse en cualquier orden, aprovechando mejor los recursos.",
        1 // policyIndex
    );
    policiesContainer.appendChild(policy2Section);
    
    // Política 3
    const policy3Section = createPolicySection(
        "Política 3: Emisión Desordenada y Finalización Desordenada", 
        simulationState.policy3Data,
        simulationState.performanceMetrics.policy3,
        "Tanto la emisión como la finalización pueden ocurrir en cualquier orden, maximizando el paralelismo pero con mayor complejidad.",
        2 // policyIndex
    );
    policiesContainer.appendChild(policy3Section);
    
    // Añadir entrada al registro
    addCycleLogEntry();
}

// =============================================
// VISUALIZACIÓN MEJORADA DE DIFERENCIAS
// =============================================

function createPolicySection(title, simulationData, metrics, explanation, policyIndex) {
    const section = document.createElement('div');
    section.className = 'policy-section';
    
    // Crear encabezado con métricas mejoradas
    const header = document.createElement('div');
    header.className = 'policy-header';
    header.innerHTML = `
        <h3>${title}</h3>
        <div class="metrics">
            <div class="metric" title="Instrucciones por Ciclo">IPC: ${metrics.ipc}</div>
            <div class="metric" title="Ciclos totales de ejecución">Ciclos: ${metrics.totalCycles}</div>
            <div class="metric" title="Utilización de recursos">Utilización: ${metrics.resourceUtilization}</div>
            <div class="metric" title="Ciclos de espera">Espera: ${metrics.waitCycles}</div>
        </div>
    `;
    section.appendChild(header);
    
    // Crear tabla de simulación
    const table = document.createElement('table');
    table.className = 'simulation-table';
    
    // Encabezado de la tabla
    const thead = document.createElement('thead');
    let headerRow = '<tr><th class="cycle-header">Ciclo</th>';
    simulationState.currentConfig.forEach(inst => {
        headerRow += `<th title="${inst.name} - ${inst.functionalUnit} (${inst.executionTime} ciclos)">${inst.name}</th>`;
    });
    headerRow += '</tr>';
    thead.innerHTML = headerRow;
    table.appendChild(thead);
    
    // Cuerpo de la tabla
    const tbody = document.createElement('tbody');
    const maxCycles = Math.max(...simulationData.map(inst => inst.length));
    
    for (let cycle = 1; cycle <= maxCycles; cycle++) {
        let row = `<tr><td class="cycle-header">${cycle}</td>`;
        
        simulationState.currentConfig.forEach((inst, index) => {
            const cycleData = simulationData[index][cycle - 1];
            let cellClass = '';
            let title = '';
            
            if (cycleData) {
                if (cycleData.stage === 'decode') {
                    cellClass = 'stage-decode';
                    title = `Decodificación: ${inst.name}`;
                } else if (cycleData.stage === 'execute') {
                    cellClass = 'stage-execute';
                    title = `Ejecución (${cycleData.text}): ${inst.name}`;
                    if (cycleData.dependency) title += ' - Esperando dependencia';
                    if (cycleData.conflict) title += ' - Conflicto de recursos';
                } else if (cycleData.stage === 'write') {
                    cellClass = 'stage-write';
                    title = `Escritura de resultados: ${inst.name}`;
                }
                
                if (cycleData.conflict) cellClass += ' conflict';
                if (cycleData.dependency) cellClass += ' dependency';
            }
            
            // Resaltar celda activa en el ciclo actual
            if (cycle === simulationState.currentCycle) {
                cellClass += ' active-cell';
                if (!title) title = 'Ciclo actual';
            }
            
            row += `<td class="${cellClass}" title="${title}">${cycleData?.text || ''}</td>`;
        });
        
        row += '</tr>';
        tbody.innerHTML += row;
    }
    
    table.appendChild(tbody);
    section.appendChild(table);
    
    // Añadir explicación y análisis detallado
    const analysisDiv = document.createElement('div');
    analysisDiv.className = 'explanation';
    
    let analysisHTML = `<strong>${title}</strong><br>`;
    analysisHTML += `<p>${explanation}</p>`;
    
    analysisHTML += `<div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">`;
    analysisHTML += `<strong>Métricas detalladas:</strong><br>`;
    analysisHTML += `• Instrucciones procesadas: ${metrics.instructionCount}<br>`;
    analysisHTML += `• Ciclos totales: ${metrics.totalCycles}<br>`;
    analysisHTML += `• IPC (Instrucciones por Ciclo): ${metrics.ipc}<br>`;
    analysisHTML += `• Utilización de recursos: ${metrics.resourceUtilization}<br>`;
    analysisHTML += `• Ciclos de espera: ${metrics.waitCycles}<br>`;
    analysisHTML += `• Eficiencia general: ${metrics.efficiency}<br>`;
    
    // Comparación con otras políticas si es necesario
    if (policyIndex > 0) {
        const baseline = policyIndex === 1 ? 
            simulationState.performanceMetrics.policy1 : 
            simulationState.performanceMetrics.policy2;
        
        const improvement = ((baseline.totalCycles - metrics.totalCycles) / baseline.totalCycles * 100).toFixed(1);
        analysisHTML += `<br><strong>Comparación:</strong> ${improvement}% más rápida que la Política ${policyIndex === 1 ? '1' : '2'}.`;
    }
    
    analysisHTML += `</div>`;
    
    analysisDiv.innerHTML = analysisHTML;
    section.appendChild(analysisDiv);
    
    return section;
}

function addCycleLogEntry() {
    if (simulationState.currentCycle === 0) return;
    
    let logDetails = `<strong>Actividad en Ciclo ${simulationState.currentCycle}:</strong><br><br>`;
    
    // Analizar cada política
    const policies = [
        { name: "Política 1", data: simulationState.policy1Data },
        { name: "Política 2", data: simulationState.policy2Data },
        { name: "Política 3", data: simulationState.policy3Data }
    ];
    
    policies.forEach((policy, policyIndex) => {
        logDetails += `<div style="margin-bottom: 15px;">`;
        logDetails += `<div class="log-policy" style="background: ${policyIndex === 0 ? '#2196f3' : policyIndex === 1 ? '#ff9800' : '#4caf50'}">${policy.name}</div>`;
        
        const activeInThisCycle = [];
        const waitingInThisCycle = [];
        
        simulationState.currentConfig.forEach((inst, index) => {
            const cycleData = policy.data[index][simulationState.currentCycle - 1];
            const prevCycleData = policy.data[index][simulationState.currentCycle - 2];
            
            if (cycleData) {
                let status = '';
                if (cycleData.stage === 'decode') status = 'decodificando';
                else if (cycleData.stage === 'execute') {
                    status = 'ejecutando';
                    if (cycleData.dependency) status += ' (espera dependencia)';
                    if (cycleData.conflict) status += ' (conflicto recurso)';
                }
                else if (cycleData.stage === 'write') status = 'escribiendo resultados';
                
                activeInThisCycle.push(`${inst.name}: ${status}`);
            } else if (prevCycleData && !cycleData) {
                // Instrucción que estaba activa en el ciclo anterior pero no en este
                waitingInThisCycle.push(inst.name);
            }
        });
        
        if (activeInThisCycle.length > 0) {
            logDetails += `<div style="margin-left: 10px; font-size: 0.9em;">`;
            logDetails += `<strong>Activas:</strong> ${activeInThisCycle.join(', ')}`;
            logDetails += `</div>`;
        }
        
        if (waitingInThisCycle.length > 0) {
            logDetails += `<div style="margin-left: 10px; font-size: 0.9em; color: #666;">`;
            logDetails += `<strong>En espera:</strong> ${waitingInThisCycle.join(', ')}`;
            logDetails += `</div>`;
        }
        
        if (activeInThisCycle.length === 0 && waitingInThisCycle.length === 0) {
            logDetails += `<div style="margin-left: 10px; font-size: 0.9em; color: #999;">`;
            logDetails += `Sin actividad`;
            logDetails += `</div>`;
        }
        
        logDetails += `</div>`;
    });
    
    addLogEntry(`Ciclo ${simulationState.currentCycle}`, logDetails);
}

function addLogEntry(title, details) {
    const logContent = document.getElementById('logContent');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <div class="log-cycle">${title}</div>
        <div class="log-details">${details}</div>
    `;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}

// =============================================
// ALGORITMOS DE SIMULACIÓN CORREGIDOS
// =============================================

function simulateInOrderInOrder(config) {
    const simulationData = config.map(() => []);
    let currentIssueCycle = 1; // Ciclo en el que se emite (decodifica) la próxima instrucción
    const unitBusyUntil = {}; // Ciclo hasta el que cada unidad funcional está ocupada
    
    // Para cada instrucción en orden
    config.forEach((instruction, index) => {
        // 1. DECODIFICACIÓN (Emisión) - ocurre en currentIssueCycle
        const decodeCycle = currentIssueCycle;
        simulationData[index][decodeCycle - 1] = {
            stage: 'decode',
            text: 'D'
        };
        
        // 2. Calcular cuándo puede empezar la EJECUCIÓN
        let executeStartCycle = decodeCycle + 1; // Mínimo un ciclo después de la decodificación
        
        // Verificar dependencias RAW (Read After Write)
        if (instruction.raw && instruction.raw.length > 0) {
            instruction.raw.forEach(depId => {
                const depIndex = config.findIndex(inst => inst.id === depId);
                if (depIndex !== -1 && depIndex < index) {
                    // Buscar cuándo la dependencia escribe su resultado
                    let depWriteCycle = 0;
                    for (let cycle = 0; cycle < simulationData[depIndex].length; cycle++) {
                        if (simulationData[depIndex][cycle] && simulationData[depIndex][cycle].stage === 'write') {
                            depWriteCycle = cycle + 1; // Convertir a base 1
                            break;
                        }
                    }
                    
                    if (depWriteCycle > 0 && depWriteCycle >= executeStartCycle) {
                        // Debe esperar hasta que la dependencia haya escrito
                        executeStartCycle = depWriteCycle + 1;
                    }
                }
            });
        }
        
        // Verificar disponibilidad de la unidad funcional
        const unitType = instruction.functionalUnit;
        if (unitBusyUntil[unitType] && unitBusyUntil[unitType] >= executeStartCycle) {
            executeStartCycle = unitBusyUntil[unitType] + 1;
        }
        
        // 3. EJECUCIÓN
        for (let i = 0; i < instruction.executionTime; i++) {
            const executeCycle = executeStartCycle + i;
            simulationData[index][executeCycle - 1] = {
                stage: 'execute',
                text: `E${i+1}`,
                dependency: i === 0 && executeStartCycle > decodeCycle + 1 // Si tuvo que esperar por dependencia
            };
        }
        
        // 4. ESCRITURA de resultados
        const writeCycle = executeStartCycle + instruction.executionTime;
        simulationData[index][writeCycle - 1] = {
            stage: 'write',
            text: 'W'
        };
        
        // Actualizar hasta cuándo la unidad funcional está ocupada
        unitBusyUntil[unitType] = writeCycle - 1; // Ocupada hasta el ciclo de escritura (inclusive)
        
        // 5. La siguiente instrucción se emite en el ciclo después de que esta termine de escribir
        // En política estricta in-order, la emisión de la siguiente instrucción ocurre después de que esta escriba
        currentIssueCycle = Math.max(currentIssueCycle + 1, writeCycle + 1);
        
        // Registrar en el log
        addLogEntry(`Instrucción ${instruction.name}`, 
            `Decodificada en ciclo ${decodeCycle}, ejecuta en ciclos ${executeStartCycle}-${writeCycle-1}, escribe en ciclo ${writeCycle}.`);
    });
    
    return simulationData;
}

function simulateInOrderOutOfOrder(config) {
    const simulationData = config.map(() => []);
    const instructionStatus = config.map((inst, idx) => ({
        index: idx,
        id: inst.id,
        decodeCycle: 0,
        executeStartCycle: 0,
        writeCycle: 0,
        completed: false,
        rawDeps: inst.raw || [],
        warDeps: inst.war || [],
        wawDeps: inst.waw || [],
        executionTime: inst.executionTime,
        unit: inst.functionalUnit,
        readyToExecute: false,
        readyToWrite: false
    }));
    
    let currentCycle = 1;
    let issueIndex = 0; // Índice de la próxima instrucción a emitir (en orden)
    const unitBusyUntil = {};
    const readyQueue = []; // Instrucciones listas para ejecutar
    const writeQueue = []; // Instrucciones listas para escribir
    
    while (issueIndex < config.length || readyQueue.length > 0 || writeQueue.length > 0) {
        // FASE 1: EMISIÓN (en orden)
        if (issueIndex < config.length) {
            const instruction = config[issueIndex];
            const status = instructionStatus[issueIndex];
            
            // Emitir esta instrucción
            status.decodeCycle = currentCycle;
            simulationData[issueIndex][currentCycle - 1] = {
                stage: 'decode',
                text: 'D'
            };
            
            // Verificar si está lista para ejecutar (dependencias RAW satisfechas)
            const rawDepsSatisfied = status.rawDeps.every(depId => {
                const depIdx = config.findIndex(inst => inst.id === depId);
                if (depIdx === -1) return true;
                const depStatus = instructionStatus[depIdx];
                return depStatus.writeCycle > 0 && currentCycle >= depStatus.writeCycle;
            });
            
            if (rawDepsSatisfied) {
                status.readyToExecute = true;
                readyQueue.push(status);
            }
            
            issueIndex++;
        }
        
        // FASE 2: EJECUCIÓN (desordenada)
        // Ordenar readyQueue por prioridad (podría ser por dependencias)
        readyQueue.sort((a, b) => {
            // Priorizar instrucciones con menos dependencias restantes
            const aDeps = a.rawDeps.length + a.warDeps.length + a.wawDeps.length;
            const bDeps = b.rawDeps.length + b.warDeps.length + b.wawDeps.length;
            return aDeps - bDeps;
        });
        
        const executedThisCycle = [];
        for (let i = 0; i < readyQueue.length && executedThisCycle.length < simulatorConfig.issueWidth; i++) {
            const status = readyQueue[i];
            const unit = status.unit;
            
            // Verificar si la unidad funcional está disponible
            if (!unitBusyUntil[unit] || unitBusyUntil[unit] < currentCycle) {
                // Iniciar ejecución
                status.executeStartCycle = currentCycle;
                status.readyToExecute = false;
                
                // Llenar celdas de ejecución
                for (let j = 0; j < status.executionTime; j++) {
                    simulationData[status.index][currentCycle - 1 + j] = {
                        stage: 'execute',
                        text: `E${j+1}`
                    };
                }
                
                // Programar fin de ejecución
                const executionEnd = currentCycle + status.executionTime - 1;
                unitBusyUntil[unit] = executionEnd;
                
                // Mover a cola de escritura
                writeQueue.push({
                    status: status,
                    readyCycle: executionEnd + 1
                });
                
                executedThisCycle.push(status);
                readyQueue.splice(i, 1);
                i--; // Ajustar índice después de remover
            }
        }
        
        // FASE 3: ESCRITURA (desordenada)
        for (let i = writeQueue.length - 1; i >= 0; i--) {
            const item = writeQueue[i];
            if (currentCycle >= item.readyCycle) {
                const status = item.status;
                const instruction = config[status.index];
                
                // Verificar dependencias WAR/WAW (solo si no hay renombrado)
                let canWrite = true;
                if (!simulationState.registerRenaming) {
                    // Verificar WAR
                    if (status.warDeps.length > 0) {
                        const warConflict = status.warDeps.some(depId => {
                            const depIdx = config.findIndex(inst => inst.id === depId);
                            if (depIdx === -1) return false;
                            const depStatus = instructionStatus[depIdx];
                            // La dependencia WAR requiere que la instrucción que lee se ejecute antes
                            return depStatus.executeStartCycle > 0 && depStatus.writeCycle === 0;
                        });
                        if (warConflict) canWrite = false;
                    }
                    
                    // Verificar WAW
                    if (status.wawDeps.length > 0) {
                        const wawConflict = status.wawDeps.some(depId => {
                            const depIdx = config.findIndex(inst => inst.id === depId);
                            if (depIdx === -1) return false;
                            const depStatus = instructionStatus[depIdx];
                            return depStatus.writeCycle === 0; // Otra instrucción aún no ha escrito
                        });
                        if (wawConflict) canWrite = false;
                    }
                }
                
                if (canWrite) {
                    status.writeCycle = currentCycle;
                    status.completed = true;
                    simulationData[status.index][currentCycle - 1] = {
                        stage: 'write',
                        text: 'W'
                    };
                    
                    writeQueue.splice(i, 1);
                    
                    // Activar instrucciones que esperaban por esta
                    instructionStatus.forEach(otherStatus => {
                        if (!otherStatus.readyToExecute && !otherStatus.executeStartCycle) {
                            const otherInst = config[otherStatus.index];
                            if (otherInst.dependencies.includes(instruction.id)) {
                                // Verificar si todas sus dependencias están satisfechas
                                const allDepsSatisfied = otherInst.dependencies.every(depId => {
                                    const depIdx = config.findIndex(inst => inst.id === depId);
                                    if (depIdx === -1) return true;
                                    return instructionStatus[depIdx].writeCycle > 0;
                                });
                                
                                if (allDepsSatisfied && !otherStatus.readyToExecute) {
                                    otherStatus.readyToExecute = true;
                                    readyQueue.push(otherStatus);
                                }
                            }
                        }
                    });
                }
            }
        }
        
        currentCycle++;
    }
    
    return simulationData;
}

function simulateInOrderOutOfOrder(config) {
    const simulationData = config.map(() => []);
    const instructionStatus = config.map((inst, index) => ({
        index,
        id: inst.id,
        decodeCycle: 0,
        executeStartCycle: 0,
        writeCycle: 0,
        completed: false,
        rawDeps: inst.raw || [],
        warDeps: inst.war || [],
        wawDeps: inst.waw || [],
        executionTime: inst.executionTime,
        unit: inst.functionalUnit,
        canExecute: false,
        canWrite: false
    }));
    
    let currentCycle = 1;
    const unitUsage = {};
    const decodedInstructions = [];
    const executedInstructions = [];
    const writtenInstructions = [];
    
    // Emisión en orden
    let issueIndex = 0;
    
    while (writtenInstructions.length < config.length) {
        // 1. Emitir (decodificar) una instrucción por ciclo en orden
        if (issueIndex < config.length) {
            const inst = instructionStatus[issueIndex];
            inst.decodeCycle = currentCycle;
            decodedInstructions.push(inst);
            issueIndex++;
            
            // Verificar si puede ejecutarse inmediatamente
            inst.canExecute = inst.rawDeps.every(depId => {
                const depInst = instructionStatus.find(i => i.id === depId);
                return depInst && depInst.writeCycle > 0 && currentCycle >= depInst.writeCycle;
            });
        }
        
        // 2. Intentar ejecutar instrucciones decodificadas pero no ejecutadas
        decodedInstructions.forEach(inst => {
            if (!inst.executeStartCycle && inst.canExecute) {
                // Verificar disponibilidad de unidad funcional
                const unit = inst.unit;
                if (!unitUsage[unit] || unitUsage[unit] < currentCycle) {
                    inst.executeStartCycle = currentCycle;
                    unitUsage[unit] = currentCycle + inst.executionTime - 1;
                    executedInstructions.push(inst);
                    
                    // Verificar si puede escribir después de ejecutar
                    setTimeout(() => {
                        inst.canWrite = inst.warDeps.every(depId => {
                            const depInst = instructionStatus.find(i => i.id === depId);
                            return depInst && depInst.executeStartCycle > 0 && 
                                   currentCycle > depInst.executeStartCycle;
                        }) && inst.wawDeps.every(depId => {
                            const depInst = instructionStatus.find(i => i.id === depId);
                            return depInst && depInst.writeCycle > 0 && 
                                   currentCycle >= depInst.writeCycle;
                        });
                    }, 0);
                }
            }
        });
        
        // 3. Intentar escribir resultados de instrucciones ejecutadas
        executedInstructions.forEach(inst => {
            if (!inst.writeCycle && inst.canWrite && 
                currentCycle >= inst.executeStartCycle + inst.executionTime) {
                
                inst.writeCycle = currentCycle;
                inst.completed = true;
                writtenInstructions.push(inst);
            }
        });
        
        // 4. Actualizar estado de dependencias para instrucciones en espera
        decodedInstructions.forEach(inst => {
            if (!inst.executeStartCycle && !inst.canExecute) {
                inst.canExecute = inst.rawDeps.every(depId => {
                    const depInst = instructionStatus.find(i => i.id === depId);
                    return depInst && depInst.writeCycle > 0 && currentCycle >= depInst.writeCycle;
                });
            }
            
            if (inst.executeStartCycle && !inst.writeCycle && !inst.canWrite) {
                inst.canWrite = inst.warDeps.every(depId => {
                    const depInst = instructionStatus.find(i => i.id === depId);
                    return depInst && depInst.executeStartCycle > 0 && 
                           currentCycle > depInst.executeStartCycle;
                }) && inst.wawDeps.every(depId => {
                    const depInst = instructionStatus.find(i => i.id === depId);
                    return depInst && depInst.writeCycle > 0 && 
                           currentCycle >= depInst.writeCycle;
                });
            }
        });
        
        currentCycle++;
    }
    
    // Llenar simulationData
    instructionStatus.forEach(inst => {
        simulationData[inst.index][inst.decodeCycle - 1] = {
            stage: 'decode',
            text: 'D'
        };
        
        for (let i = 0; i < inst.executionTime; i++) {
            simulationData[inst.index][inst.executeStartCycle - 1 + i] = {
                stage: 'execute',
                text: `E${i+1}`
            };
        }
        
        simulationData[inst.index][inst.writeCycle - 1] = {
            stage: 'write',
            text: 'W'
        };
    });
    
    return simulationData;
}

function simulateOutOfOrderOutOfOrder(config) {
    const simulationData = config.map(() => []);
    const instructionStatus = config.map((inst, idx) => ({
        index: idx,
        id: inst.id,
        decodeCycle: 0,
        executeStartCycle: 0,
        writeCycle: 0,
        completed: false,
        rawDeps: inst.raw || [],
        warDeps: inst.war || [],
        wawDeps: inst.waw || [],
        executionTime: inst.executionTime,
        unit: inst.functionalUnit,
        readyToIssue: inst.dependencies.length === 0, // Sin dependencias = lista para emitir
        readyToExecute: false,
        readyToWrite: false,
        issued: false
    }));
    
    let currentCycle = 1;
    const unitBusyUntil = {};
    const issueQueue = instructionStatus.filter(s => s.readyToIssue);
    const readyQueue = [];
    const writeQueue = [];
    
    while (issueQueue.length > 0 || readyQueue.length > 0 || writeQueue.length > 0) {
        // FASE 1: EMISIÓN DESORDENADA
        const issuedThisCycle = [];
        for (let i = 0; i < Math.min(issueQueue.length, simulatorConfig.issueWidth); i++) {
            const status = issueQueue[i];
            if (!status.issued) {
                status.decodeCycle = currentCycle;
                status.issued = true;
                simulationData[status.index][currentCycle - 1] = {
                    stage: 'decode',
                    text: 'D'
                };
                
                // Verificar si puede ejecutar inmediatamente
                const rawDepsSatisfied = status.rawDeps.every(depId => {
                    const depIdx = config.findIndex(inst => inst.id === depId);
                    if (depIdx === -1) return true;
                    return instructionStatus[depIdx].writeCycle > 0;
                });
                
                if (rawDepsSatisfied) {
                    status.readyToExecute = true;
                    readyQueue.push(status);
                }
                
                issuedThisCycle.push(status);
            }
        }
        
        // Remover emitidas de la cola
        issueQueue.splice(0, issuedThisCycle.length);
        
        // FASE 2: EJECUCIÓN DESORDENADA
        readyQueue.sort((a, b) => {
            // Priorizar instrucciones que han esperado más
            const aWait = currentCycle - a.decodeCycle;
            const bWait = currentCycle - b.decodeCycle;
            return bWait - aWait; // Las que han esperado más primero
        });
        
        const executedThisCycle = [];
        for (let i = 0; i < readyQueue.length && executedThisCycle.length < simulatorConfig.issueWidth; i++) {
            const status = readyQueue[i];
            const unit = status.unit;
            
            if (!unitBusyUntil[unit] || unitBusyUntil[unit] < currentCycle) {
                status.executeStartCycle = currentCycle;
                status.readyToExecute = false;
                
                // Llenar celdas de ejecución
                for (let j = 0; j < status.executionTime; j++) {
                    simulationData[status.index][currentCycle - 1 + j] = {
                        stage: 'execute',
                        text: `E${j+1}`
                    };
                }
                
                const executionEnd = currentCycle + status.executionTime - 1;
                unitBusyUntil[unit] = executionEnd;
                
                writeQueue.push({
                    status: status,
                    readyCycle: executionEnd + 1
                });
                
                executedThisCycle.push(status);
                readyQueue.splice(i, 1);
                i--;
            }
        }
        
        // FASE 3: ESCRITURA DESORDENADA
        for (let i = writeQueue.length - 1; i >= 0; i--) {
            const item = writeQueue[i];
            if (currentCycle >= item.readyCycle) {
                const status = item.status;
                
                // En emisión desordenada con renombrado, WAR/WAW se resuelven
                let canWrite = true;
                if (!simulationState.registerRenaming) {
                    // Verificar WAR
                    const warConflict = status.warDeps.some(depId => {
                        const depIdx = config.findIndex(inst => inst.id === depId);
                        if (depIdx === -1) return false;
                        const depStatus = instructionStatus[depIdx];
                        return depStatus.executeStartCycle > 0 && depStatus.writeCycle === 0;
                    });
                    
                    // Verificar WAW
                    const wawConflict = status.wawDeps.some(depId => {
                        const depIdx = config.findIndex(inst => inst.id === depId);
                        if (depIdx === -1) return false;
                        const depStatus = instructionStatus[depIdx];
                        return depStatus.writeCycle === 0;
                    });
                    
                    canWrite = !warConflict && !wawConflict;
                }
                
                if (canWrite) {
                    status.writeCycle = currentCycle;
                    status.completed = true;
                    simulationData[status.index][currentCycle - 1] = {
                        stage: 'write',
                        text: 'W'
                    };
                    
                    writeQueue.splice(i, 1);
                    
                    // Activar instrucciones que dependían de esta
                    instructionStatus.forEach(otherStatus => {
                        if (!otherStatus.issued && otherStatus.rawDeps.includes(status.id)) {
                            const allDepsSatisfied = otherStatus.rawDeps.every(depId => {
                                const depIdx = config.findIndex(inst => inst.id === depId);
                                if (depIdx === -1) return true;
                                return instructionStatus[depIdx].writeCycle > 0;
                            });
                            
                            if (allDepsSatisfied && !otherStatus.readyToIssue) {
                                otherStatus.readyToIssue = true;
                                issueQueue.push(otherStatus);
                            }
                        }
                    });
                }
            }
        }
        
        // FASE 4: Actualizar cola de emisión con nuevas instrucciones listas
        instructionStatus.forEach(status => {
            if (!status.issued && !status.readyToIssue) {
                const allDepsSatisfied = status.rawDeps.every(depId => {
                    const depIdx = config.findIndex(inst => inst.id === depId);
                    if (depIdx === -1) return true;
                    return instructionStatus[depIdx].writeCycle > 0;
                });
                
                if (allDepsSatisfied) {
                    status.readyToIssue = true;
                    // Evitar duplicados
                    if (!issueQueue.includes(status)) {
                        issueQueue.push(status);
                    }
                }
            }
        });
        
        currentCycle++;
    }
    
    return simulationData;
}

// =============================================
// FUNCIÓN AUXILIAR PARA CALCULAR MÉTRICAS
// =============================================

function calculatePolicyMetrics(simulationData, policyName) {
    const totalCycles = Math.max(...simulationData.map(inst => inst.length));
    const instructionCount = simulationData.length;
    
    // Calcular IPC
    const ipc = totalCycles > 0 ? (instructionCount / totalCycles).toFixed(2) : '0.00';
    
    // Calcular utilización de recursos
    let totalExecutionCycles = 0;
    
    simulationData.forEach(instData => {
        instData.forEach(cycleData => {
            if (cycleData && cycleData.stage === 'execute') {
                totalExecutionCycles++;
            }
        });
    });
    
    // Considerar todas las unidades funcionales
    const unitCount = Object.keys(simulatorConfig.functionalUnits).length;
    const totalPossibleCycles = totalCycles * unitCount;
    
    const resourceUtilization = totalPossibleCycles > 0 
        ? ((totalExecutionCycles / totalPossibleCycles) * 100).toFixed(1) + '%'
        : '0%';
    
    // Calcular ciclos de espera
    let waitCycles = 0;
    simulationData.forEach(instData => {
        let lastActiveCycle = -1;
        for (let cycle = 0; cycle < instData.length; cycle++) {
            if (instData[cycle]) {
                if (lastActiveCycle !== -1 && cycle > lastActiveCycle + 1) {
                    waitCycles += cycle - lastActiveCycle - 1;
                }
                lastActiveCycle = cycle;
            }
        }
    });
    
    // Calcular eficiencia general
    const efficiency = ((instructionCount / (totalCycles + waitCycles)) * 100).toFixed(1) + '%';
    
    return {
        name: policyName,
        ipc,
        totalCycles,
        instructionCount,
        resourceUtilization,
        waitCycles,
        efficiency
    };
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeUI);