class RecintosZoo {
    analisaRecintos(animalNome, quantidade) {
        const animais = this.getAnimais();
        const animalEncontrado = animais.find(animal => animal.especie === animalNome);

        if (!animalEncontrado) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const recintosDisponiveis = this.podemAcomodar(animalEncontrado, quantidade);
        if (recintosDisponiveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosDisponiveis.map(recinto => {
                const espacoDisponivel = this.calculaEspacoDisponivel(recinto, animalEncontrado);
                const quantidadeOcupada = animalEncontrado.tamanho * quantidade;
                const espacoRestante = espacoDisponivel - quantidadeOcupada;
                return `Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanho_total})`;
            })
        };
    }

    podemAcomodar(animal, quantidade) {
        const recintos = this.getRecintos();
        const recintosPossiveis = [];

        for (const recinto of recintos) {
            let biomaRecinto = recinto.bioma;

            if (!Array.isArray(biomaRecinto)) {
                biomaRecinto = [biomaRecinto];
            }

            if (animal.especie === "MACACO") {
                if (!biomaRecinto.includes("savana") && !biomaRecinto.includes("floresta")) {
                    continue;
                }
                if (recinto.animais_existentes === "vazio") {
                    continue;
                }
            } else if (animal.especie === "HIPOPOTAMO") {
                if (!biomaRecinto.includes("savana") || !biomaRecinto.includes("rio")) {
                    continue;
                }
            } else {
                if (!biomaRecinto.includes(animal.bioma)) {
                    continue;
                }
            }

            if (animal.tipo === "carnivoro" && recinto.animais_existentes !== "vazio") {
                const [qtdExistente, especieExistente] = recinto.animais_existentes.split(" ");
                if (especieExistente !== animal.especie) {
                    continue;
                }
            }

            const espacoDisponivel = this.calculaEspacoDisponivel(recinto, animal);
            const espacoNecessario = animal.tamanho * quantidade;

            if (espacoDisponivel >= espacoNecessario) {
                recintosPossiveis.push(recinto);
            }
        }

        return recintosPossiveis;
    }

    calculaEspacoDisponivel(recinto, novoAnimal) {
        const animaisExistentes = recinto.animais_existentes.split(" ");
        const animais = this.getAnimais();
        let espacoOcupado = 0;

        if (recinto.animais_existentes !== "vazio") {
            const especieExistente = animaisExistentes[1].toUpperCase();
            const quantidadeExistente = parseInt(animaisExistentes[0]);

            const animalExistente = animais.find(a => a.especie === especieExistente);
            if (animalExistente) {
                espacoOcupado = animalExistente.tamanho * quantidadeExistente;
            }

            if (especieExistente !== novoAnimal.especie) {
                espacoOcupado += 1;
            }
        }

        return recinto.tamanho_total - espacoOcupado;
    }

    getRecintos() {
        const recintos = [
            { "numero": 1, "bioma": "savana", "tamanho_total": 10, "animais_existentes": "3 MACACO" },
            { "numero": 2, "bioma": "floresta", "tamanho_total": 5, "animais_existentes": "vazio" },
            { "numero": 3, "bioma": ["savana", "rio"], "tamanho_total": 7, "animais_existentes": "1 GAZELA" },
            { "numero": 4, "bioma": "rio", "tamanho_total": 8, "animais_existentes": "vazio" },
            { "numero": 5, "bioma": "savana", "tamanho_total": 9, "animais_existentes": "1 LEAO" }
        ];
        return recintos;
    }

    getAnimais() {
        const animais = [
            { "especie": "LEAO", "tamanho": 3, "bioma": "savana", "tipo": "carnivoro" },
            { "especie": "LEOPARDO", "tamanho": 2, "bioma": "savana", "tipo": "carnivoro" },
            { "especie": "CROCODILO", "tamanho": 3, "bioma": "rio", "tipo": "carnivoro" },
            { "especie": "MACACO", "tamanho": 1, "bioma": ["savana", "floresta"], "tipo": "onivoro" },
            { "especie": "GAZELA", "tamanho": 2, "bioma": "savana", "tipo": "herbivoro" },
            { "especie": "HIPOPOTAMO", "tamanho": 4, "bioma": ["savana", "rio"], "tipo": "herbivoro" }
        ];
        return animais;
    }
}

export { RecintosZoo as RecintosZoo };
