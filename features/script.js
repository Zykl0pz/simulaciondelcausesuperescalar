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
function calculatePerformanceMetrics() {
    // Calcular IPC (Instrucciones por Ciclo)
    simulationState.performanceMetrics.policy1.ipc = calculateIPC(simulationState.policy1Data);
    simulationState.performanceMetrics.policy2.ipc = calculateIPC(simulationState.policy2Data);
    simulationState.performanceMetrics.policy3.ipc = calculateIPC(simulationState.policy3Data);
    
    // Calcular utilización de recursos
    simulationState.performanceMetrics.policy1.resourceUtilization = calculateResourceUtilization(simulationState.policy1Data);
    simulationState.performanceMetrics.policy2.resourceUtilization = calculateResourceUtilization(simulationState.policy2Data);
    simulationState.performanceMetrics.policy3.resourceUtilization = calculateResourceUtilization(simulationState.policy3Data);
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
        
        // Calcular simulaciones
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
        
        // Actualizar UI
        document.getElementById('btnStep').disabled = false;
        document.getElementById('btnAuto').disabled = false;
        document.getElementById('btnResetSim').disabled = false;
        document.getElementById('btnToggleRename').disabled = false;
        document.getElementById('currentCycleIndicator').style.display = 'block';
        
        updateStatus('Simulación preparada - Lista para ejecutar', true);
        addLogEntry('Preparación', 'Simulación inicializada con las tres políticas. Métricas calculadas y dependencias analizadas.');
        
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
        "Las instrucciones se emiten y completan en el orden original del programa. Es la política más simple pero menos eficiente."
    );
    policiesContainer.appendChild(policy1Section);
    
    // Política 2
    const policy2Section = createPolicySection(
        "Política 2: Emisión en Orden y Finalización Desordenada", 
        simulationState.policy2Data,
        simulationState.performanceMetrics.policy2,
        "Las instrucciones se emiten en orden pero pueden completarse en cualquier orden, aprovechando mejor los recursos."
    );
    policiesContainer.appendChild(policy2Section);
    
    // Política 3
    const policy3Section = createPolicySection(
        "Política 3: Emisión Desordenada y Finalización Desordenada", 
        simulationState.policy3Data,
        simulationState.performanceMetrics.policy3,
        "Tanto la emisión como la finalización pueden ocurrir en cualquier orden, maximizando el paralelismo pero con mayor complejidad."
    );
    policiesContainer.appendChild(policy3Section);
    
    // Añadir entrada al registro
    addCycleLogEntry();
}

function createPolicySection(title, simulationData, metrics, explanation) {
    const section = document.createElement('div');
    section.className = 'policy-section';
    
    const header = document.createElement('div');
    header.className = 'policy-header';
    header.innerHTML = `
        <h3>${title}</h3>
        <div class="metrics">
            <div class="metric">IPC: ${metrics.ipc}</div>
            <div class="metric">Utilización: ${metrics.resourceUtilization}</div>
        </div>
    `;
    section.appendChild(header);
    
    const table = document.createElement('table');
    table.className = 'simulation-table';
    
    // Crear encabezado de la tabla
    const thead = document.createElement('thead');
    let headerRow = '<tr><th class="cycle-header">Ciclo</th>';
    simulationState.currentConfig.forEach(inst => {
        headerRow += `<th>${inst.name}</th>`;
    });
    headerRow += '</tr>';
    thead.innerHTML = headerRow;
    table.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    const maxCycles = Math.max(...simulationData.map(inst => inst.length));
    
    for (let cycle = 1; cycle <= maxCycles; cycle++) {
        let row = `<tr><td class="cycle-header">${cycle}</td>`;
        
        simulationState.currentConfig.forEach((inst, index) => {
            const cycleData = simulationData[index][cycle - 1];
            if (cycleData) {
                let cellClass = '';
                if (cycleData.stage === 'decode') cellClass = 'stage-decode';
                else if (cycleData.stage === 'execute') cellClass = 'stage-execute';
                else if (cycleData.stage === 'write') cellClass = 'stage-write';
                
                if (cycleData.conflict) cellClass += ' conflict';
                if (cycleData.dependency) cellClass += ' dependency';
                
                // Resaltar celda activa en el ciclo actual
                if (cycle === simulationState.currentCycle) {
                    cellClass += ' active-cell';
                }
                
                row += `<td class="${cellClass}">${cycleData.text || ''}</td>`;
            } else {
                row += '<td></td>';
            }
        });
        
        row += '</tr>';
        tbody.innerHTML += row;
    }
    
    table.appendChild(tbody);
    section.appendChild(table);
    
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'explanation';
    explanationDiv.textContent = explanation;
    section.appendChild(explanationDiv);
    
    return section;
}

function addCycleLogEntry() {
    if (simulationState.currentCycle === 0) return;
    
    let logDetails = '';
    
    // Analizar cada política para el ciclo actual
    const policies = [
        { name: "Política 1", data: simulationState.policy1Data },
        { name: "Política 2", data: simulationState.policy2Data },
        { name: "Política 3", data: simulationState.policy3Data }
    ];
    
    policies.forEach(policy => {
        logDetails += `<div class="log-policy">${policy.name}</div>`;
        
        const activeInstructions = [];
        simulationState.currentConfig.forEach((inst, index) => {
            const cycleData = policy.data[index][simulationState.currentCycle - 1];
            if (cycleData) {
                let action = '';
                if (cycleData.stage === 'decode') action = 'decodificando';
                else if (cycleData.stage === 'execute') action = 'ejecutando';
                else if (cycleData.stage === 'write') action = 'escribiendo resultados';
                
                let details = '';
                if (cycleData.conflict) details += ' (Conflicto de recursos)';
                if (cycleData.dependency) details += ' (Esperando dependencia)';
                
                activeInstructions.push(`${inst.name} ${action}${details}`);
            }
        });
        
        if (activeInstructions.length > 0) {
            logDetails += '<ul>';
            activeInstructions.forEach(inst => {
                logDetails += `<li>${inst}</li>`;
            });
            logDetails += '</ul>';
        } else {
            logDetails += '<span>No hay actividad en este ciclo.</span>';
        }
        
        logDetails += '<br>';
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
    let currentCycle = 1;
    
    const unitUsage = {};
    
    config.forEach((instruction, index) => {
        let decodeCycle = currentCycle;
        let executeStartCycle = decodeCycle + 1;
        let writeCycle = executeStartCycle + instruction.executionTime;
        
        // Verificar dependencias
        let dependencyDelay = 0;
        instruction.dependencies.forEach(depId => {
            const depIndex = config.findIndex(inst => inst.id === depId);
            if (depIndex !== -1 && depIndex < index) {
                const depWriteCycle = simulationData[depIndex].findIndex(
                    cycle => cycle && cycle.stage === 'write'
                ) + 1;
                if (depWriteCycle > executeStartCycle) {
                    dependencyDelay = Math.max(dependencyDelay, depWriteCycle - executeStartCycle);
                }
            }
        });
        
        executeStartCycle += dependencyDelay;
        writeCycle += dependencyDelay;
        
        // Verificar conflictos de recursos
        let resourceConflict = false;
        if (unitUsage[instruction.functionalUnit]) {
            const lastUsage = unitUsage[instruction.functionalUnit];
            if (lastUsage >= executeStartCycle) {
                executeStartCycle = lastUsage + 1;
                writeCycle = executeStartCycle + instruction.executionTime;
                resourceConflict = true;
            }
        }
        
        unitUsage[instruction.functionalUnit] = writeCycle - 1;
        
        // Actualizar currentCycle para la siguiente instrucción
        currentCycle = Math.max(currentCycle, decodeCycle);
        
        // Registrar en simulationData
        simulationData[index][decodeCycle - 1] = {
            stage: 'decode',
            text: 'D'
        };
        
        for (let i = 0; i < instruction.executionTime; i++) {
            simulationData[index][executeStartCycle - 1 + i] = {
                stage: 'execute',
                text: `E${i+1}`,
                conflict: i === 0 && resourceConflict,
                dependency: i === 0 && dependencyDelay > 0
            };
        }
        
        simulationData[index][writeCycle - 1] = {
            stage: 'write',
            text: 'W'
        };
        
        currentCycle = writeCycle;
    });
    
    return simulationData;
}

function simulateInOrderOutOfOrder(config) {
    const simulationData = config.map(() => []);
    const instructions = config.map((inst, index) => ({
        ...inst,
        index,
        decodeCycle: 0,
        executeStartCycle: 0,
        writeCycle: 0,
        completed: false
    }));
    
    let currentCycle = 1;
    const unitUsage = {};
    const completedInstructions = [];
    
    while (completedInstructions.length < instructions.length) {
        instructions.forEach(instruction => {
            if (instruction.completed) return;
            
            // Si aún no se ha decodificado
            if (instruction.decodeCycle === 0) {
                instruction.decodeCycle = currentCycle;
            }
            
            // Si está decodificada pero no ha empezado a ejecutar
            if (instruction.decodeCycle > 0 && instruction.executeStartCycle === 0) {
                // Verificar dependencias
                const dependenciesSatisfied = instruction.dependencies.every(depId => {
                    const depInstruction = instructions.find(inst => inst.id === depId);
                    return depInstruction && depInstruction.completed;
                });
                
                if (dependenciesSatisfied) {
                    // Verificar disponibilidad de unidad funcional
                    let executeCycle = currentCycle;
                    if (unitUsage[instruction.functionalUnit] && unitUsage[instruction.functionalUnit] >= currentCycle) {
                        executeCycle = unitUsage[instruction.functionalUnit] + 1;
                    }
                    
                    instruction.executeStartCycle = executeCycle;
                    unitUsage[instruction.functionalUnit] = executeCycle + instruction.executionTime - 1;
                    instruction.writeCycle = executeCycle + instruction.executionTime;
                }
            }
            
            // Marcar como completada si ha llegado a su ciclo de escritura
            if (instruction.writeCycle > 0 && currentCycle >= instruction.writeCycle && !instruction.completed) {
                instruction.completed = true;
                completedInstructions.push(instruction.index);
            }
        });
        
        currentCycle++;
    }
    
    // Llenar simulationData
    instructions.forEach(instruction => {
        simulationData[instruction.index][instruction.decodeCycle - 1] = {
            stage: 'decode',
            text: 'D'
        };
        
        for (let i = 0; i < instruction.executionTime; i++) {
            simulationData[instruction.index][instruction.executeStartCycle - 1 + i] = {
                stage: 'execute',
                text: `E${i+1}`
            };
        }
        
        simulationData[instruction.index][instruction.writeCycle - 1] = {
            stage: 'write',
            text: 'W'
        };
    });
    
    return simulationData;
}

function simulateOutOfOrderOutOfOrder(config) {
    const simulationData = config.map(() => []);
    const instructions = config.map((inst, index) => ({
        ...inst,
        index,
        decodeCycle: 0,
        executeStartCycle: 0,
        writeCycle: 0,
        completed: false
    }));
    
    let currentCycle = 1;
    const unitUsage = {};
    const completedInstructions = [];
    const decodedInstructions = [];
    
    while (completedInstructions.length < instructions.length) {
        // Intentar decodificar instrucciones
        instructions.forEach(instruction => {
            if (instruction.decodeCycle === 0 && !decodedInstructions.includes(instruction.index)) {
                // En emisión desordenada, podemos decodificar en cualquier orden
                instruction.decodeCycle = currentCycle;
                decodedInstructions.push(instruction.index);
            }
        });
        
        // Intentar ejecutar instrucciones decodificadas
        decodedInstructions.forEach(decodedIndex => {
            const instruction = instructions[decodedIndex];
            if (instruction.executeStartCycle === 0 && !instruction.completed) {
                // Verificar dependencias
                const dependenciesSatisfied = instruction.dependencies.every(depId => {
                    const depInstruction = instructions.find(inst => inst.id === depId);
                    return depInstruction && depInstruction.completed;
                });
                
                if (dependenciesSatisfied) {
                    // Verificar disponibilidad de unidad funcional
                    let executeCycle = currentCycle;
                    if (unitUsage[instruction.functionalUnit] && unitUsage[instruction.functionalUnit] >= currentCycle) {
                        executeCycle = unitUsage[instruction.functionalUnit] + 1;
                    }
                    
                    instruction.executeStartCycle = executeCycle;
                    unitUsage[instruction.functionalUnit] = executeCycle + instruction.executionTime - 1;
                    instruction.writeCycle = executeCycle + instruction.executionTime;
                }
            }
        });
        
        // Marcar instrucciones completadas
        instructions.forEach(instruction => {
            if (instruction.writeCycle > 0 && currentCycle >= instruction.writeCycle && !instruction.completed) {
                instruction.completed = true;
                completedInstructions.push(instruction.index);
            }
        });
        
        currentCycle++;
    }
    
    // Llenar simulationData
    instructions.forEach(instruction => {
        simulationData[instruction.index][instruction.decodeCycle - 1] = {
            stage: 'decode',
            text: 'D'
        };
        
        for (let i = 0; i < instruction.executionTime; i++) {
            simulationData[instruction.index][instruction.executeStartCycle - 1 + i] = {
                stage: 'execute',
                text: `E${i+1}`
            };
        }
        
        simulationData[instruction.index][instruction.writeCycle - 1] = {
            stage: 'write',
            text: 'W'
        };
    });
    
    return simulationData;
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeUI);