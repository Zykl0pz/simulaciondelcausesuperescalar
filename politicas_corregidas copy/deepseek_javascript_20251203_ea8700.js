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
    let totalPossibleCycles = 0;
    
    simulationData.forEach(instData => {
        instData.forEach(cycleData => {
            if (cycleData && cycleData.stage === 'execute') {
                totalExecutionCycles++;
            }
        });
    });
    
    // Considerar todas las unidades funcionales
    const unitCount = Object.keys(simulatorConfig.functionalUnits).length;
    totalPossibleCycles = totalCycles * unitCount;
    
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
    
    return {
        name: policyName,
        ipc,
        totalCycles,
        instructionCount,
        resourceUtilization,
        waitCycles,
        efficiency: ((instructionCount / (totalCycles + waitCycles)) * 100).toFixed(1) + '%'
    };
}